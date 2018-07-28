import { WebClient } from '@slack/client';

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

function sendMessage(conversationId) {
  return web.chat.postMessage({ channel: conversationId, text: 'Hello there' })
    .then((res) => {
      console.log('Message sent: ', res.ts);
      return res;
    })
    .catch(console.error);
}

module.exports = sendMessage;