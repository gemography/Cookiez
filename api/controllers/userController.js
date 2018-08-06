import User from '../models/user';

module.exports = {
  getCookiezAmount(req, res) {
    const { token, user_name, text } = req.body;
    if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
      return res.status(403).send('wrong token');
    }
    const query = {};
    if (text === '') query.name = user_name;
    else query.name = text.substring(1);

    return User.findOne(query)
      .then(u => res.send(!u
        ? `${query.name} doesn't seem to be a Cookiez user`
        : `You can still give ${u.remaining} today and have ${u.total} Cookiez in your balance`
      ));
  }
};
