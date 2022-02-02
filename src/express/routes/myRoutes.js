'use strict';

const { Router } = require(`express`);
const { getAPI } = require('../api');

const myRouter = new Router();

const BASE_MY_PATH = `/my`;
const api = getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, { articles });
});

myRouter.get(`/comments`, async (req, res) => {
  const comments = await api.getAllComments();

  res.render(`comments`, { comments });
});

module.exports = { myRouter, BASE_MY_PATH };
