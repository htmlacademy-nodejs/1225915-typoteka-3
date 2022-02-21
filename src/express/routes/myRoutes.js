'use strict';

const { Router } = require(`express`);
const { getAPI } = require('../api');
const { authMiddleware } = require('../middlewares/auth');
const { prepareComments } = require('../lib/prepareComments');

const myRouter = new Router();

const BASE_MY_PATH = `/my`;
const api = getAPI();

myRouter.get(`/`, authMiddleware, async (req, res) => {
  const { user } = req.session;
  const articles = await api.getArticles();

  res.render(`my`, { articles, user });
});

myRouter.get(`/comments`, authMiddleware, async (req, res) => {
  const { user } = req.session;
  const comments = await api.getAllComments();

  res.render(`comments`, { comments: prepareComments(comments), user });
});

myRouter.get(`/categories`, authMiddleware, (req, res) => {
  const { user } = req.session;

  res.render(`all-categories`, { user });
});

module.exports = { myRouter, BASE_MY_PATH };
