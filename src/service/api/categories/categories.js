'use strict';

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../../constants`);

const categoriesRouter = (apiRouter, service) => {
  const route = new Router();

  apiRouter.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const { withCount } = req.query;

    const categories = await service.getAllCategories(withCount);

    res.status(HTTP_CODE.OK).json(categories);
  });
};

module.exports = {
  categoriesRouter,
};
