'use strict';

const { where } = require('sequelize');
const { DEFAULT_ORDER } = require('./constants');
const requiredArticleFields = [`title`, `category`, `announce`];

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._Category = sequelize.models.category;
    this._Comment = sequelize.models.comment;
  }

  async getAll(needComments) {
    const include = [this._Category];

    if (needComments) {
      include.push(this._Comment);
    }

    const articles = await this._Article.findAll({ include, order: [DEFAULT_ORDER] });

    return articles.map((article) => article.get());
  }

  getArticleById(articleId) {
    return this._Article.findByPk(articleId, {
      include: [this._Category, this._Comment],
    });
  }

  async createArticle(data) {
    const newArticle = await this._Article.create(data);
    newArticle.addCategories(data.category);
    newArticle.setAuthor(1);

    return newArticle.get();
  }

  async updateArticle(articleId, data) {
    const [affectedRows] = await this._Article.update(data, {
      where: {
        id: Number(articleId),
      },
    });

    return !!affectedRows;
  }

  async dropArticle(articleId) {
    const deletedRaws = this._Article.destroy({ where: { id: Number(articleId) } });

    return !!deletedRaws;
  }
}

module.exports = {
  ArticlesService,
  requiredArticleFields,
};
