import mainController from './api/controllers/mainController';

module.exports = [
  {
    method: 'GET',
    url: '',
    handler: mainController.testMain,
  }
];