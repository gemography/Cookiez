import sendMessage from '../../services/messageSender';
import User from '../models/user';

module.exports = {
  testMain(req, res) {
    return sendMessage('aab13', 'hola')
      .then(sRes => {
        console.log(sRes);
        return res.send(sRes.ts);
      });
  },

  sendGift(req, res) {
    const { token, user_name, text } = req.body;
    if (token !== process.env.SLACK_TOKEN) {
      return res.status(403).send('wrong token');
    }
    const parsed = text.split(' ');
    const targetUser = parsed[0].substring(1);
    const amount = isNaN(parsed[1]) ? 1 : +parsed[1];
    return User
      .find({ name: { $in: [user_name, targetUser] } })
      .then(users => {
        if (users.length > 2) return res.status(500).send('Something went wrong 5001');
        const from = users.find(x => x.name === user_name) || new User({ name: user_name });
        const to = users.find(x => x.name === targetUser) || new User({ name: targetUser });
        from.remaining -= amount;
        to.total += amount;
        console.log(amount, from.remaining, to.total);
        if (from.remaining < 0) {
          return sendMessage(from.name, `You only have ${from.remaining} left. You can't send more than that`);
        }
        return Promise
          .all([from.save(), to.save()])
          .then(() => res.send('done'));
      })
      .catch(err => {
        console.error(err);
        return res.status(500).send(err);
      });

  }
};