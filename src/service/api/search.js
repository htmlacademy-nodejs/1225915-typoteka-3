'use strict';

const { Router } = require('express');
const { HttpCode } = require('../../constants');

const searchRouter = (apiRouter, service) => {
  const route = new Router();

  apiRouter.use('/search', route);

  route.get('/', (req, res) => {
    const { query } = req.query;

    const articles = service.searchByTitle(query);

    res.status(HttpCode.OK).json(articles);
  });
};

module.exports = {
  searchRouter,
};
