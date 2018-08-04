import cron from 'node-cron';

import User from '../api/models/user';

module.exports = {
  resetRemaining: cron.schedule(
    '0 0 * * *',
    () => User.resetRemaining()
        .then(ret => console.log(`Reset remaining Cookiez for ${ret.nModified} users`)),
    false),
};