import winston from 'winston';
import chalk from 'chalk';

const { combine, timestamp, printf } = winston.format;

const levelToColor = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  verbose: 'magenta',
  debug: 'blue',
  silly: 'orange'
};

const customFormat = printf(info => {
  const color = chalk.keyword(levelToColor[info.level]);
  return `${new Date(info.timestamp).toUTCString()} ${color(info.level)}: ${info.message}`
});

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    customFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'app.log',
      level: 'error',
      format: printf(info => JSON.stringify(info))
    }),
  ],
});

logger.stream = { write: (message, encoding) => logger.error(message) };

module.exports = logger;
