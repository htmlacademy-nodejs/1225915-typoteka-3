'use strict';

const { DataTypes, Model } = require('sequelize');

class User extends Model {}

const defineUser = (sequelize) =>
  User.init(
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
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
