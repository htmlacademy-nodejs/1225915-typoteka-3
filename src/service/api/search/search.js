'use strict';

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../../constants`);

const searchRouter = (apiRouter, service) => {
  const route = new Router();

  apiRouter.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const { query } = req.query;

    if (!query) {
      res.status(HTTP_CODE.OK).json([]);
      return;
    }

    const articles = await service.searchByTitle(query);

    res.status(HTTP_CODE.OK).json(articles);
  });
};

module.exports = {
  searchRouter,
};
