import cron from 'node-cron';

import logger from './logger';
import User from '../api/models/user';

module.exports = {
  resetRemaining: cron.schedule(
    '* 0 * * *',
    () => User.resetRemaining()
      .then(ret => logger.info(`Reset remaining Cookiez for ${ret.nModified} users`))
      .catch(logger.error),
    false),
};