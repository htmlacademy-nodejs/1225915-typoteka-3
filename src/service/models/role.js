'use strict';

const { DataTypes, Model } = require('sequelize');

class Role extends Model {}

const defineRole = (sequelize) =>
  Role.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'role',
      tableName: 'roles',
      underscored: true,
    }
  );

module.exports = {
  defineRole,
};
