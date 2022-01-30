'use strict';

const pino = require(`pino`);
const { ENV } = require(`../../constants`);

const LOGS_FILE = `./logs/api.log`;
const isDev = process.env.NODE_ENV === ENV.DEVELOPMENT;
const defaultLogLevel = isDev ? `info` : `error`;

const logger = pino(
  {
    name: `base-logger`,
    level: process.env.LOG_LEVEL || defaultLogLevel,
    prettyPrint: isDev,
  },
  isDev ? process.stdout : pino.destination(LOGS_FILE)
);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  },
};
