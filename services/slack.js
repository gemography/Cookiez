import { WebClient } from '@slack/client';

const web = new WebClient(process.env.SLACK_TOKEN);

function sendCookiezMessage(to, message, attachedMsg, id) {
  const attachment = {
      text: attachedMsg,
      callback_id: `cookiez_reaction-${id}`,
      attachment_type: 'default',
      actions: [
        {
          name: 'thumbsup',
          text: ':thumbsup:',
          value: ':thumbsup:',
          type: 'button'
        },
        {
          name: 'joy',
          text: ':joy:',
          value: ':joy:',
          type: 'button'
        },
        {
          name: 'msemmen',
          text: ':msemmen:',
          value: ':msemmen:',
          type: 'button'
        },
      ]
    };
  return _sendMessage(to, message, [attachment]);
}

function sendReactionBackToSender({ to, reactionMsg, cookiezMsg, attachedMsg }) {
  const attachment = {
      pretext: cookiezMsg, // y gave cookiez to x
      text: attachedMsg,
      attachment_type: 'default',
    };
  return _sendMessage(to, reactionMsg, [attachment]);
}

function getReactionCallbackMessage(payload) {
  return {
    text: payload.original_message.text,
    attachments: [
      {
        text: payload.original_message.attachments[0].text,
      },
      {
        text: `You reacted with ${payload.actions[0].value}`,
      }
    ]
  }
}

function _sendMessage(to, text, attachments) {
  return web.chat.postMessage({
    channel: to,
    user: to,
    text,
    attachments,
  });
}

function _updateMEssage(channel, to, text, ts, attachments) {
  return web.chat.update({
    channel,
    user: to,
    ts,
    text,
    attachments,
  });
}

module.exports = {
  sendCookiezMessage,
  getReactionCallbackMessage,
  sendReactionBackToSender
};
