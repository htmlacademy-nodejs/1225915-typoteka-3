'use strict';

const { Router } = require('express');

const articlesRouter = new Router();

const BASE_ARTICLES_PATH = '/articles';

articlesRouter.get('/category/:id', (req, res) => {
  res.send('/articles/category/:id');
});

articlesRouter.get('/add', (req, res) => {
  res.send('/articles/add');
});

module.exports = { articlesRouter, BASE_ARTICLES_PATH };
