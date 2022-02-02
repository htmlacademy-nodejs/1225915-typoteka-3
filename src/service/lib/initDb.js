'use strict';

const { defineModels } = require(`../models`);

const initDb = async (sequelize, { categories, articles, users }) => {
  const { Category, Role, User, Article, Comment } = defineModels(sequelize);

  await sequelize.sync({ force: true });

  await Category.bulkCreate(categories.map((category) => ({ title: category })));
  await User.bulkCreate(users, { include: [Role] });

  const articlesPromises = articles.map(async (article, articleIndex) => {
    const articleModel = await Article.create({ ...article });

    const commentsPromises = article.comments.map(async ({ text, author_id }) => {
      const commentModel = await Comment.create({ text });

      await commentModel.setAuthor(author_id);
      await commentModel.setArticle(articleIndex + 1);
    });

    await Promise.all(commentsPromises);

    await articleModel.addCategories(article.category);
    await articleModel.setAuthor(1);
  });

  await Promise.all(articlesPromises);
};

module.exports = {
  initDb,
};
