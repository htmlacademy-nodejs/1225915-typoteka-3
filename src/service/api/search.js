'use strict';

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);

const searchRouter = (apiRouter, service) => {
  const route = new Router();

  apiRouter.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const { query } = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).send(`"query" parameter doesn't exist`);
    }

    const articles = service.searchByTitle(query);

    if (!articles.length) {
      res.status(HttpCode.NOT_FOUND).send(`Nothing is found.`);
    }

    res.status(HttpCode.OK).json(articles);
  });
};

module.exports = {
  searchRouter,
};
