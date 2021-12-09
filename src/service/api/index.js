'use strict';

const { Router } = require('express');
const { ArticlesService, CategoriesService, SearchService } = require('../dataService');
const { articlesRouter } = require('./articles');
const { categoriesRouter } = require('./categories');
const { searchRouter } = require('./search');
const { getMockData } = require('../lib/getMockData');

const API_ROUTER_PREFIX = '/api';

const apiRouter = new Router();

(async () => {
  try {
    const mockData = await getMockData();

    articlesRouter(apiRouter, new ArticlesService(mockData));
    categoriesRouter(apiRouter, new CategoriesService(mockData));
    searchRouter(apiRouter, new SearchService(mockData));
  } catch (err) {
    console.log('api/index error', err);
  }
})();

module.exports = {
  apiRouter,
  API_ROUTER_PREFIX,
};
