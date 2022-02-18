'use strict';

const { Op } = require(`sequelize`);
const { DEFAULT_ORDER } = require('./constants');
const { includeUser } = require('../lib/includeUser');

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._Category = sequelize.models.category;
    this._User = sequelize.models.user;
  }

  async searchByTitle(subStr) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: subStr,
        },
      },
      include: [this._Category, includeUser(this._User)],
      order: [DEFAULT_ORDER],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = {
  SearchService,
};
