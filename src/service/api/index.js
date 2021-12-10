'use strict';

const { Router } = require(`express`);
const { ArticlesService, CategoriesService, SearchService } = require(`../dataService`);
const { articlesRouter } = require(`./articles`);
const { categoriesRouter } = require(`./categories`);
const { searchRouter } = require(`./search`);
const { getMockData } = require(`../lib/getMockData`);
const { getLogger } = require(`../lib/logger`);

const API_ROUTER_PREFIX = `/api`;

const apiRouter = new Router();

const logger = getLogger({ name: `api` });

(async () => {
  try {
    const mockData = await getMockData();

    articlesRouter(apiRouter, new ArticlesService(mockData));
    categoriesRouter(apiRouter, new CategoriesService(mockData));
    searchRouter(apiRouter, new SearchService(mockData));
  } catch (err) {
    logger.error(`/api/index error: ${err.message}`);
  }
})();

module.exports = {
  apiRouter,
  API_ROUTER_PREFIX,
};
