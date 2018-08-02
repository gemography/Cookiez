import { WebClient } from '@slack/client';

const web = new WebClient(process.env.SLACK_TOKEN);

function sendMessage(to, message) {
  return web.chat.postMessage({
    channel: to,
    user: to,
    text: message,
    attachments: [
      {
        text: message,
        callback_id: "cookiez_reaction",
        attachment_type: "default",
        actions: [
          {
            name: "thumbsup",
            text: ":thumbsup:",
            value: ":thumbsup:",
            type: "button"
          },
          {
            name: "joy",
            text: ":joy:",
            value: ":joy:",
            type: "button"
          },
          {
            name: "msemen",
            text: ":msemen:",
            value: ":msemen:",
            type: "button"
          }
        ]
      }
    ]
  });
}

module.exports = sendMessage;