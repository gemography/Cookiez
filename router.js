import mainController from './api/controllers/mainController';
import cookiezController from './api/controllers/cookiezController';
import userController from './api/controllers/userController';

module.exports = [
  {
    method: 'GET',
    url: '/',
    handler: mainController.welcome,
  },
  {
    method: 'POST',
    url: '/cookiez',
    handler: userController.getCookiezAmount,
  },
  {
    method: 'POST',
    url: '/send',
    handler: cookiezController.sendCookiez,
  },
  {
    method: 'POST',
    url: '/interact',
    handler: cookiezController.react,
  }
];
