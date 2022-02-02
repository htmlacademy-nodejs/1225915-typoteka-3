'use strict';

const { DataTypes, Model } = require('sequelize');

class Comment extends Model {}

const defineComment = (sequelize) =>
  Comment.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'comment',
      tableName: 'comments',
      underscored: true,
    }
  );

module.exports = {
  defineComment,
};
