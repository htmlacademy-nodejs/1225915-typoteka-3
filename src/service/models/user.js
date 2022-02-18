'use strict';

const { DataTypes, Model } = require('sequelize');

class User extends Model {}

const defineUser = (sequelize) =>
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users',
      underscored: true,
    }
  );

module.exports = {
  defineUser,
};
