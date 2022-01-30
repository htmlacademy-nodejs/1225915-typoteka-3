'use strict';

const { Op } = require(`sequelize`);
const { DEFAULT_ORDER } = require('./constants');

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
  }

  async searchByTitle(subStr) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: subStr,
        },
      },
      order: [DEFAULT_ORDER],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = {
  SearchService,
};
