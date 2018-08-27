import User from '../models/user';

module.exports = {
  getCookiezAmount(req, res) {
    const { token, user_id } = req.body;
    if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
      return res.status(403).send('wrong token');
    }

    const query = { userId: user_id };
    return User.findOne(query)
      .then(u => {
        const user = u || new User();
        return res.send(`You can still give ${user.remaining} Cookiez today and have ${user.total} in your balance`)
      });
  }
};
