import mainController from './api/controllers/mainController';

module.exports = [
  {
    method: 'GET',
    url: '',
    handler: mainController.testMain,
  },
  {
    method: 'POST',
    url: '/send',
    handler: mainController.sendCookiez,
  },
  {
    method: 'POST',
    url: '/interact',
    handler: mainController.react,
  }
];