'use strict';

const { Router } = require(`express`);

const myRouter = new Router();

const BASE_MY_PATH = `/my`;

myRouter.get(`/`, (req, res) => {
  res.render(`my`);
});

myRouter.get(`/comments`, (req, res) => {
  res.render(`comments`);
});

module.exports = { myRouter, BASE_MY_PATH };
