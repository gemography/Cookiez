import sendMessage from '../../services/messageSender';

module.exports = {
  testMain (req, res) {
    return sendMessage('aab13')
      .then(sRes => {
        console.log(sRes);
        return res.send(sRes.ts);
      });
  }
};