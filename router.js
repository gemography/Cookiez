import mainController from './api/controllers/mainController';
import userController from './api/controllers/userController';

module.exports = [
  {
    method: 'POST',
    url: '/cookiez',
    handler: userController.getCookiezAmount,
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