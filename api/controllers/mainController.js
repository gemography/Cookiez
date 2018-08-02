import sendMessage from '../../services/messageSender';
import User from '../models/user';

module.exports = {
  testMain(req, res) {
    return sendMessage('@ahmed', 'hola')
      .then(sRes => {
        return res.send(sRes);
      }).catch((err) => {
        console.error(err);
        res.status(500).send('Oops! Something went wrong');
      });
  },

  sendCookiez(req, res) {
    const { token, user_name, text } = req.body;
    if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
      return res.status(403).send('wrong token');
    }
    const parsed = text.split(' ');
    const targetUser = parsed[0].substring(1);
    const amount = isNaN(parsed[1]) ? 1 : +parsed[1];
    const message = isNaN(parsed[1]) ? parsed.slice(1).join(' ') : parsed.slice(2).join(' ');

    return User
      .find({ name: { $in: [user_name, targetUser] } })
      .then(users => {
        if (users.length > 2) return res.status(500).send('Something went wrong 5001');

        const from = users.find(x => x.name === user_name) || new User({ name: user_name });
        const to = users.find(x => x.name === targetUser) || new User({ name: targetUser });
        from.remaining -= amount;
        to.total += amount;

        if (from.remaining < 0) {
          return res.send(`You only have ${from.remaining + amount} left. You can't send more than that`);
        }

        return Promise
          .all([from.save(), to.save()])
          .then(() => sendMessage(`@${targetUser}`, message))
          .then(() => res.send(`You gave ${from.name} ${amount} Cookiez to ${to.name}`));
      })
      .catch(err => {
        console.error(err);
        return res.status(500).send('Oops! Something went wrong.');
      });
  },

  react(req, res) {

  }
};