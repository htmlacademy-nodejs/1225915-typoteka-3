'use strict';

const { Router } = require(`express`);
const { getAPI } = require('../api');

const BASE_MAIN_PATH = `/`;
const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles({ comments: true }),
    api.getCategories({ withCount: true }),
  ]);

  console.log('articles', articles);

  res.render(`main`, { articles, categories });
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`);
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

module.exports = { mainRouter, BASE_MAIN_PATH };
