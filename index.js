import express from 'express';
import bodyParser from 'body-parser';
import router from './router';

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.forEach(route => {
  app[route.method.toLowerCase()](route.url, route.handler);
});

app.listen(port, () => console.info('Running on port', port));