'use strict';

const { DataTypes, Model } = require('sequelize');

class Category extends Model {}

const defineCategory = (sequelize) =>
  Category.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'category',
      tableName: 'categories',
      underscored: true,
    }
  );

module.exports = {
  defineCategory,
};
