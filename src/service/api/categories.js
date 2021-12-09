'use strict';

const { Router } = require('express');
const { HttpCode } = require('../../constants');

const categoriesRouter = (apiRouter, service) => {
  const route = new Router();

  apiRouter.use('/categories', route);

  route.get('/', (req, res) => {
    res.status(HttpCode.OK).json(service.getAllCategories());
  });
};

module.exports = {
  categoriesRouter,
};
