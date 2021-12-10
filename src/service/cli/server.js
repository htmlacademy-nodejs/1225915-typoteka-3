'use strict';

const express = require(`express`);

const { HttpCode } = require(`../../constants`);
const { apiRouter, API_ROUTER_PREFIX } = require(`../api`);
const { getLogger } = require(`../lib/logger`);
const { requestLogger } = require(`../middlewares/requestLogger`);

const DEFAULT_PORT = 3009;

const logger = getLogger({ name: `api` });

module.exports = {
  name: `--server`,
  run: (args) => {
    const port = Number.parseInt(args[0], 10) || DEFAULT_PORT;

    const app = express();

    app.use(express.json());
    app.use(requestLogger(logger));
    app.use(API_ROUTER_PREFIX, apiRouter);
    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(`Not found`);
      logger.error(`Route not found: ${req.url}`);
    });
    app.use((err, req, res, next) => {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Internal server error: 500`);
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
  },
};
