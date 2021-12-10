'use strict';

const { handleNotFound } = require(`../lib/handleNotFound`);

const isArticleExist = (service) => (req, res, next) => {
  const { articleId } = req.params;

  const article = service.getArticleById(articleId);

  if (!article) {
    handleNotFound(res, `Article with id ${articleId} not found.`);
  }

  res.locals.article = article;
  next();
};

module.exports = {
  isArticleExist,
};
