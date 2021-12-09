'use strict';

const express = require('express');
const { Router } = require('express');
const chalk = require(`chalk`);

const { HttpCode } = require('../../constants');
const { apiRouter, API_ROUTER_PREFIX } = require('../api');

const DEFAULT_PORT = 3000;

module.exports = {
  name: '--server',
  run: (args) => {
    const port = Number.parseInt(args[0], 10) || DEFAULT_PORT;

    const app = express();

    app.use(express.json());
    app.use(API_ROUTER_PREFIX, apiRouter);
    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send('Not found'));
    app.use((err, req, res, next) => {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send('Internal server error: 500');
    });

    app.listen(port, () => {
      console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  },
};
