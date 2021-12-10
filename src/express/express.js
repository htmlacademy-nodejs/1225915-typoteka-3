'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const path = require(`path`);

const { mainRouter, BASE_MAIN_PATH } = require(`./routes/mainRoutes`);
const { myRouter, BASE_MY_PATH } = require(`./routes/myRoutes`);
const { articlesRouter, BASE_ARTICLES_PATH } = require(`./routes/articlesRoutes`);
const { HttpCode } = require(`../constants`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const TEMPLATES_PATH = path.join(`templates`, `pages`);

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.set(`views`, path.resolve(__dirname, TEMPLATES_PATH));
app.set(`view engine`, `pug`);

app.use(BASE_MAIN_PATH, mainRouter);
app.use(BASE_MY_PATH, myRouter);
app.use(BASE_ARTICLES_PATH, articlesRouter);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).render(`404`);
});
app.use((err, req, res, next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`500`);
  next();
});

app.listen(DEFAULT_PORT, () => {
  console.info(chalk.green(`Front server is listening on ${DEFAULT_PORT} port.`));
});
