'use strict';

const { defineCategory } = require('./category');
const { defineRole } = require('./role');
const { defineUser } = require('./user');
const { defineArticle } = require('./article');
const { defineComment } = require('./comment');
const { defineArticleCategory } = require('./articleCategory');

const defineModels = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Role = defineRole(sequelize);
  const User = defineUser(sequelize);
  const Article = defineArticle(sequelize);
  const Comment = defineComment(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  Article.hasMany(Comment, { onDelete: `cascade` });
  Comment.belongsTo(User, { as: 'author' });
  Comment.belongsTo(Article);
  Article.belongsTo(User, { as: 'author' });
  User.belongsTo(Role);

  Article.belongsToMany(Category, { through: ArticleCategory });
  Category.belongsToMany(Article, { through: ArticleCategory });
  Category.hasMany(ArticleCategory);

  return {
    Category,
    Role,
    User,
    Article,
    Comment,
    ArticleCategory,
  };
};

module.exports = {
  defineModels,
};
