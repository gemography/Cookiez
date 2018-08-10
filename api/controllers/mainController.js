import slack from '../../services/slack';
import logger from '../../services/logger';
import User from '../models/user';
import Transaction from '../models/transaction';

module.exports = {
  sendCookiez(req, res) {
    const { token, user_name, text, user_id } = req.body;
    if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
      return res.status(403).send('wrong token');
    }
    const parsed = text.split(' ');
    const target= parsed[0].substring(1).split('|');
    const targetUser = target[0].substring(1);
    const targetUserName = target[1];
    if (target[0].substring(0, 2) !== '@U') {
      return res.send('You must mention a Slack user');
    }
    const amount = isNaN(parsed[1]) ? 1 : +parsed[1];
    const message = isNaN(parsed[1])
      ? parsed.length > 1 ? parsed.slice(1).join(' ') : null
      : parsed.length > 2 ? parsed.slice(2).join(' ') : null;

    if (user_id === targetUser) {
      return res.send('You can\'t give Cookiez to yourself. Be a champ and give it to a colleague that you appreciate');
    }

    return User
      .find({ userId: { $in: [user_id, targetUser] } })
      .then(users => {
        if (users.length > 2) {
          logger.error(`find for users ${user_id} and ${targetUser} resulted in ${users.length} hits`);
          return res.status(500).send('Something went wrong');
        }

        const from = users.find(x => x.userId === user_id) || new User({ userId: user_id, name: user_name });
        const to = users.find(x => x.userId === targetUser) || new User({ userId: targetUser, name: targetUserName });
        from.name = user_name;
        to.name = targetUserName;
        const transaction = new Transaction({ from: from._id, to: to._id, amount });
        if (amount < 0) {
          return res.send('You can only share positivity with Cookiez');
        }
        from.remaining -= amount;
        to.total += amount;

        if (from.remaining < 0) {
          return res.send(`You only have ${from.remaining + amount} left. You can't send more than that`);
        }

        return Promise
          .all([from.save(), to.save(), transaction.save()])
          .then(() => slack.sendCookiezMessage(`@${to.name}`, `*${from.name}* gave you *${amount} Cookiez*`, message, transaction._id))
          .then(() => res.send(`You gave ${to.name} *${amount} Cookiez*`));
      })
      .catch(err => {
        logger.error(err);
        return res.status(500).send('Oops! Something went wrong.');
      });
  },

  react(req, res) {
    if (payload.token !== process.env.SLACK_VERIFICATION_TOKEN) {
      return res.status(403).send('wrong token');
    }

    let payload;
    try {
      payload = JSON.parse(req.body.payload);
    } catch (e) {
      logger.error(`A request body payload cause JSON.parse() to throw an error`);
      logger.error('req.body.payload:');
      logger.error(req.body.payload);
      logger.error('Exception object:');
      logger.error(e);
      return res.status(400).send('something was wrong with the request');
    }
    return Transaction.update(
      payload.callback_id.split('-')[1],
      { $set : { reaction: payload.actions[0].value } }
      )
      .then(() => res.send(slack.getReactionCallbackMessage(payload)))
      .catch(logger.error);
  }
};
