'use strict';

const { Model } = require('sequelize');

class ArticleCategory extends Model {}

const defineArticleCategory = (sequelize) =>
  ArticleCategory.init(
    {},
    { sequelize, underscored: true, createdAt: false, updatedAt: false, modelName: 'article_category' }
  );

module.exports = {
  defineArticleCategory,
};
