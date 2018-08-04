import { WebClient } from '@slack/client';

const web = new WebClient(process.env.SLACK_TOKEN);

function sendCookiezMessage(to, message, attachedMsg) {
  return web.chat.postMessage({
    channel: to,
    user: to,
    text: message,
    attachments: [
      {
        text: attachedMsg,
        callback_id: 'cookiez_reaction',
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
            name: 'msemen',
            text: ':msemen:',
            value: ':msemen:',
            type: 'button'
          }
        ]
      }
    ]
  });
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

module.exports = {
  sendCookiezMessage,
  getReactionCallbackMessage
};