'use strict';

const { DataTypes, Model } = require('sequelize');

class Article extends Model {}

const defineArticle = (sequelize) =>
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      announce: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'article',
      tableName: 'articles',
      underscored: true,
    }
  );

module.exports = {
  defineArticle,
};
