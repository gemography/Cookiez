import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import chalk from 'chalk';

const app = express();
const port = process.env.PORT || 50000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

import router from './router';
import bootstrap from './bootstrap';

bootstrap();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.forEach(route => {
  app[route.method.toLowerCase()](route.url, route.handler);
});

app.listen(port, () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), port, app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});
