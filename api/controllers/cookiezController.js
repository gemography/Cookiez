import slack from '../../services/slack';
import logger from '../../services/logger';
import User from '../models/user';
import Transaction from '../models/transaction';
import CookiezInput from '../lib/cookiezInput';

module.exports = {
  sendCookiez(req, res) {
    const { token, user_name, text, user_id } = req.body;
    if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
      return res.status(403).send('wrong token');
    }
    const input = new CookiezInput({ name: user_name, userId: user_id }, text);
    logger.debug(JSON.stringify(input));

    if (input.ineligibility) {
      return res.send(input.getIneligibilityMessage());
    }

    return User
      .find({ userId: { $in: [user_id, input.to.userId] } })
      .then(users => {
        if (users.length > 2) {
          logger.error(`find for users ${input.from} and ${input.to} resulted in ${users.length} hits`);
          return res.status(500).send('Something went wrong');
        }

        const from = users.find(x => x.userId === user_id) || new User(input.from);
        const to = users.find(x => x.userId === input.to.userId) || new User(input.to);
        from.name = user_name;
        to.name = input.to.name;
        const transaction = new Transaction({ from: from._id, to: to._id, amount: input.amount });
        from.remaining -= input.amount;
        to.total += input.amount;

        if (from.remaining < 0) {
          return res.send(`You only have ${from.remaining + input.amount} left. You can't send more than that`);
        }

        return Promise
          .all([from.save(), to.save(), transaction.save()])
          .then(() => slack.sendCookiezMessage(
            `@${to.name}`,
            `*${from.name}* gave you *${input.amount} Cookiez* (You have now ${to.total})`,
            input.message,
            transaction._id))
          .then(() => res.send(`You gave *${to.name} ${input.amount} Cookiez* (${from.remaining} left)`));
      })
      .catch(err => {
        logger.error(err);
        return res.status(500).send('Oops! Something went wrong.');
      });
  },

  react(req, res) {
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

    if (payload.token !== process.env.SLACK_VERIFICATION_TOKEN) {
      return res.status(403).send('wrong token');
    }

    return Transaction.update(
      { _id: payload.callback_id.split('-')[1] },
      { $set : { reaction: payload.actions[0].value } }
    )
      .then(() => res.send(slack.getReactionCallbackMessage(payload)))
      .catch(logger.error);
  }
};
