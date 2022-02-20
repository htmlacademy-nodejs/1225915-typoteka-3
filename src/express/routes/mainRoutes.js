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
  const { user } = req.session;

  const [{ count, articles }, categories] = await Promise.all([
    api.getArticles({ comments: true, limit: ARTICLES_PER_PAGE, offset }),
    api.getCategories({ withCount: true }),
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, { articles, categories, page: Number(page), totalPages, user });
});

mainRouter.get(`/register`, (req, res) => {
  const { user } = req.session;

  res.render(`sign-up`, { payload: {}, user });
});

mainRouter.get(`/login`, (req, res) => {
  const { user } = req.session;

  res.render(`login`, { validationMessages: [], payload: {}, user });
});

mainRouter.get(`/search`, async (req, res) => {
  const { query } = req.query;
  const { user } = req.session;

  try {
    const articles = await api.search(query);
    res.render(`search`, { articles, query, user });
  } catch (e) {
    res.render(`search`, { articles: [], query, user });
  }
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

mainRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await api.auth({ email, password });

    req.session.user = user;
    req.session.save(() => {
      console.log('req.session', req.session);
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);

    res.render('login', { validationMessages, payload: { email, password } });
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;

  res.redirect(`/`);
});

module.exports = { mainRouter, BASE_MAIN_PATH };
