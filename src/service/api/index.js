'use strict';

const { Router } = require(`express`);
const { sequelize } = require('../lib/sequelize');

const { ArticlesService, CategoriesService, SearchService, CommentsService } = require(`../dataService`);
const { articlesRouter } = require(`./articles`);
const { categoriesRouter } = require(`./categories`);
const { searchRouter } = require(`./search`);
const { getLogger } = require(`../lib/logger`);
const { defineModels } = require('../models');

const API_ROUTER_PREFIX = `/api`;

const logger = getLogger({ name: `api` });

defineModels(sequelize);

const getApiRouter = async () => {
  const apiRouter = new Router();

  try {
    articlesRouter(apiRouter, new ArticlesService(sequelize), new CommentsService(sequelize));
    categoriesRouter(apiRouter, new CategoriesService(sequelize));
    searchRouter(apiRouter, new SearchService(sequelize));
  } catch (err) {
    logger.error(`/api/index error: ${err.message}`);
  }

  return apiRouter;
};

module.exports = {
  getApiRouter,
  API_ROUTER_PREFIX,
};
