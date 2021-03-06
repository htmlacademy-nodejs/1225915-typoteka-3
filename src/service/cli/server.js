'use strict';

const express = require(`express`);

const { HTTP_CODE, DEFAULT_API_PORT } = require(`../../constants`);
const { getApiRouter, API_ROUTER_PREFIX } = require(`../api`);
const { getLogger } = require(`../lib/logger`);
const { requestLogger } = require(`../middlewares/requestLogger`);
const { sequelize } = require(`../lib/sequelize`);

const logger = getLogger({ name: `api` });

const run = async (args) => {
  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
    logger.info(`Connection to database established`);
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(1);
  }

  const port = Number.parseInt(args[0], 10) || DEFAULT_API_PORT;

  const apiRouter = await getApiRouter();

  const app = express();

  app.use(express.json());
  app.use(requestLogger(logger));
  app.use(API_ROUTER_PREFIX, apiRouter);
  app.use((req, res) => {
    res.status(HTTP_CODE.NOT_FOUND).send(`Not found`);
    logger.error(`Route not found: ${req.url}`);
  });
  app.use((err, req, res, next) => {
    res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send(`Internal server error: 500`);
    logger.error(`An error occurred on processing request: ${err.message}`);
  });

  try {
    app.listen(port, (err) => {
      if (err) {
        return logger.error(`An error occurred on server creation: ${err.message}`);
      }

      return logger.info(`Listening to connections on ${port}`);
    });
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(1);
  }
};

module.exports = {
  name: `--server`,
  run,
};
