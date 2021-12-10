'use strict';

const requestLogger = (logger) => (req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
};

module.exports = {
  requestLogger,
};
