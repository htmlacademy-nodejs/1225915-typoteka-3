'use strict';

const { Router } = require(`express`);

const { getAPI } = require('../api');
const { upload } = require('../middlewares/upload');
const { prepareErrors } = require('../lib/prepareErrors');

const BASE_MAIN_PATH = `/`;
const ARTICLES_PER_PAGE = 8;
const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  let { page = 1 } = req.query;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{ count, articles }, categories] = await Promise.all([
    api.getArticles({ comments: true, limit: ARTICLES_PER_PAGE, offset }),
    api.getCategories({ withCount: true }),
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, { articles, categories, page: Number(page), totalPages });
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`, { payload: {} });
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`login`);
});

mainRouter.get(`/search`, async (req, res) => {
  const { query } = req.query;

  try {
    const articles = await api.search(query);
    res.render(`search`, { articles, query });
  } catch (e) {
    res.render(`search`, { articles: [], query });
  }
});

mainRouter.get(`/categories`, (req, res) => {
  res.render(`all-categories`);
});

mainRouter.post('/register', upload.single(`avatar`), async (req, res) => {
  const { body, file } = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: body.name,
    email: body.email,
    password: body.password,
    passwordRepeated: body.passwordRepeated,
  };

  try {
    await api.createUser(userData);

    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const payload = {
      name: body.name,
      email: body.email,
    };

    res.render(`sign-up`, { validationMessages, payload });
  }
});

module.exports = { mainRouter, BASE_MAIN_PATH };
