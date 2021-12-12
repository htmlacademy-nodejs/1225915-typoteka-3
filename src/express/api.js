'use strict';

const axios = require('axios');
const { DEFAULT_API_PORT } = require('../constants');

const TIMEOUT = 1000;
const port = process.env.API_PORT || DEFAULT_API_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({ url, ...options });
    return response.data;
  }

  getArticles() {
    return this._load('/articles');
  }

  getArticleById(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load('/search', { params: { query } });
  }

  getCategories() {
    return this._load('/categories');
  }

  createArticle(data) {
    return this._load('/articles', { method: 'POST', data });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
