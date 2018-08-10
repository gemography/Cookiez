import logger from '../../services/logger';

function checkFromObject(from) {
  if (!from || !from.userId) {
    logger.error(JSON.stringify(from));
    throw Error('from must be an object of type { userId: string, name?: string }')
  }
}

class CookiezInput {

  constructor(from, text) {
    checkFromObject(from);

    this.from = from;

    const parsed = text.split(' ');

    const target= parsed[0].substring(1).split('|');
    const targetUserId = target[0].substring(1);
    const targetUserName = target[1].substring(0, target[1].length - 1);
    this.to = { name: targetUserName, userId: targetUserId };

    this.amount = isNaN(parsed[1]) ? 1 : +parsed[1];
    this.message = isNaN(parsed[1])
      ? parsed.length > 1 ? parsed.slice(1).join(' ') : null
      : parsed.length > 2 ? parsed.slice(2).join(' ') : null;

    if (target[0].substring(0, 2) !== '@U') {
      this.ineligibility = 1;
    } else if (targetUserId === from.userId) {
      this.ineligibility = 2;
    } else if (this.amount < 0) {
      this.ineligibility = 3;
    } else {
      this.ineligibility = 0;
    }
  }

  getIneligibilityMessage() {
    switch (this.ineligibility) {
      case 1: return 'You must mention a Slack user';
      case 2: return 'You can\'t give Cookiez to yourself. Be a champ and give it to a colleague that you appreciate';
      case 3: return 'You can only share positivity with Cookiez';
    }
  }
}

module.exports = CookiezInput;