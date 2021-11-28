'use strict';

const express = require('express');
const chalk = require('chalk');

const { mainRouter, BASE_MAIN_PATH } = require('./routes/mainRoutes');
const { myRouter, BASE_MY_PATH } = require('./routes/myRoutes');
const { articlesRouter, BASE_ARTICLES_PATH } = require('./routes/articlesRoutes');

const DEFAULT_PORT = 8080;

const app = express();

app.use(BASE_MAIN_PATH, mainRouter);
app.use(BASE_MY_PATH, myRouter);
app.use(BASE_ARTICLES_PATH, articlesRouter);

app.listen(DEFAULT_PORT, () => {
  console.info(chalk.green(`Front server is listening on ${DEFAULT_PORT} port.`));
});
