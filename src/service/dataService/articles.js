'use strict';

const { where } = require('sequelize');
const { DEFAULT_ORDER } = require('./constants');
const { includeUser } = require('../lib/includeUser');

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.article;
    this._Category = sequelize.models.category;
    this._Comment = sequelize.models.comment;
    this._User = sequelize.models.user;
  }

  getIncludeProp(needComments) {
    const include = [this._Category, includeUser(this._User)];

    if (needComments) {
      const includeComment = {
        model: this._Comment,
        include: [includeUser(this._User)],
      };

      include.push(includeComment);
    }

    return include;
  }

  async getAll(needComments) {
    const include = this.getIncludeProp(needComments);

    const articles = await this._Article.findAll({ include, order: [DEFAULT_ORDER] });

    return articles.map((article) => article.get());
  }

  async getByPage({ limit, offset, comments }) {
    const include = this.getIncludeProp(!!comments);

    const { count, rows } = await this._Article.findAndCountAll({
      order: [DEFAULT_ORDER],
      distinct: true,
      include,
      limit,
      offset,
    });

    return { count, articles: rows };
  }

  getArticleById(articleId) {
    return this._Article.findByPk(Number(articleId), {
      include: this.getIncludeProp(true),
    });
  }

  async createArticle(data) {
    const { userId, ...articleData } = data;
    const newArticle = await this._Article.create(articleData);

    newArticle.addCategories(data.category);
    newArticle.setAuthor(userId);

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
};
