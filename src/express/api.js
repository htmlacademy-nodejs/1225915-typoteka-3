'use strict';

const axios = require('axios');
const { DEFAULT_API_PORT, HTTP_METHOD } = require('../constants');

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

  getArticles(params = {}) {
    const { comments, limit, offset } = params;

    return this._load('/articles', { params: { comments, limit, offset } });
  }

  getArticleById(id) {
    return this._load(`/articles/${id}`);
  }

  getAllComments() {
    return this._load(`/articles/comments`);
  }

  search(query) {
    return this._load('/search', { params: { query } });
  }

  getCategories(params = {}) {
    const { withCount } = params;

    return this._load('/categories', { params: { withCount } });
  }

  createArticle(data) {
    return this._load('/articles', { method: HTTP_METHOD.POST, data });
  }

  createComment({ articleId, data, userId }) {
    return this._load(`/articles/${articleId}/comment`, { method: HTTP_METHOD.POST, data: { ...data, userId } });
  }

  editArticle({ articleId, data }) {
    return this._load(`/articles/${articleId}`, { method: HTTP_METHOD.PUT, data });
  }

  createUser(data) {
    return this._load('/user', { method: HTTP_METHOD.POST, data });
  }

  auth({ email, password }) {
    return this._load('/user/auth', { method: HTTP_METHOD.POST, data: { email, password } });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
