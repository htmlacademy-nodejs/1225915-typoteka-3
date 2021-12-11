'use strict';

const { Router } = require(`express`);

const articlesRouter = new Router();

const BASE_ARTICLES_PATH = `/articles`;

articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles-by-category`);
});

articlesRouter.get(`/add`, (req, res) => {
  res.render(`new-post`);
});

articlesRouter.get(`/edit/:id`, (req, res) => {
  res.render(`post`);
});

articlesRouter.get(`/:id`, (req, res) => {
  res.render(`post`);
});

module.exports = { articlesRouter, BASE_ARTICLES_PATH };
