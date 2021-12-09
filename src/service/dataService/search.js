'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  searchByTitle(subStr) {
    return this._articles.filter(({ title }) => title.includes(subStr));
  }
}

module.exports = {
  SearchService,
};
