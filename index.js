import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import chalk from 'chalk';
import morgan from 'morgan';

import logger from './services/logger';

const app = express();
const port = process.env.PORT || 50000;

const morganFormat = 'dev';
app.use(morgan(morganFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: logger.stream
}));
app.use(morgan(morganFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: process.stdout
}));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, autoIndex: false });
mongoose.connection.on('error', (err) => {
  logger.error(err);
  logger.error('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

import router from './router';
import cron from './services/cron';

cron.resetRemaining.start();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.forEach(route => {
  app[route.method.toLowerCase()](route.url, route.handler);
});

app.listen(port, () => {
  logger.info(`${chalk.green('✓')} App is running at http://localhost:${port} in ${app.get('env')} mode`);
  logger.info('  Press CTRL-C to stop');
});
