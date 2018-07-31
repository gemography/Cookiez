import { WebClient } from '@slack/client';

const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

function sendMessage(conversationId, message) {
  return web.chat.postMessage({ channel: conversationId, text: message })
    .then((res) => {
      console.log('Message sent: ', res.ts);
      return res;
    })
    .catch(console.error);
}

module.exports = sendMessage;