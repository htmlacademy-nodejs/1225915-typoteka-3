'use strict';

const { handleNotFound } = require(`../lib/handleNotFound`);

const isArticleExist =
  (service, needComments = false) =>
  async (req, res, next) => {
    const { articleId } = req.params;

    const article = await service.getArticleById(articleId, needComments);

    if (!article) {
      return handleNotFound(res, `Article with id ${articleId} not found.`);
    }

    res.locals.article = article;
    return next();
  };

module.exports = {
  isArticleExist,
};
