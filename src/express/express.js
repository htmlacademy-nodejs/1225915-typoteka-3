'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const path = require(`path`);

const { mainRouter, BASE_MAIN_PATH } = require(`./routes/mainRoutes`);
const { myRouter, BASE_MY_PATH } = require(`./routes/myRoutes`);
const { articlesRouter, BASE_ARTICLES_PATH } = require(`./routes/articlesRoutes`);
const { HTTP_CODE } = require(`../constants`);
const { PUBLIC_DIR, UPLOAD_DIR, DEFAULT_PORT, TEMPLATES_PATH } = require('./constants');

const app = express();
const PORT = process.env.FRONTEND_PORT || DEFAULT_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.set(`views`, path.resolve(__dirname, TEMPLATES_PATH));
app.set(`view engine`, `pug`);

app.use(BASE_MAIN_PATH, mainRouter);
app.use(BASE_MY_PATH, myRouter);
app.use(BASE_ARTICLES_PATH, articlesRouter);

app.use((req, res) => {
  res.status(HTTP_CODE.NOT_FOUND).render(`404`);
});
app.use((err, req, res, next) => {
  res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).render(`500`);
  next();
});

app.listen(PORT, () => {
  console.info(chalk.green(`Front server is listening on ${PORT} port.`));
});
