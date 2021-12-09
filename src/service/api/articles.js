'use strict';

const { Router } = require('express');
const { HttpCode } = require('../../constants');
const { handleNotFound } = require('../lib/handleNotFound');
const { validateNewArticle } = require('../middlewares/validateNewArticle');
const { isArticleExist } = require('../middlewares/isArticleExist');
const { validateArticleFields } = require('../middlewares/validateArticleFields');
const { validateNewComment } = require('../middlewares/validateNewComment');

const articlesRouter = (apiRouter, service) => {
  const route = new Router();
  apiRouter.use('/articles', route);

  route.get('/', (req, res) => {
    res.status(HttpCode.OK).json(service.getAll());
  });

  route.get('/:articleId', isArticleExist(service), (req, res) => {
    const { article } = res.locals;

    res.status(HttpCode.OK).json(article);
  });

  route.delete('/:articleId', isArticleExist(service), (req, res) => {
    const { article } = res.locals;

    const droppedArticle = service.dropArticle(article);

    res.status(HttpCode.OK).json(droppedArticle);
  });

  route.get('/:articleId/comments', isArticleExist(service), (req, res) => {
    const { article } = res.locals;

    const comments = service.getComments(article);

    res.status(HttpCode.OK).json(comments);
  });

  route.delete('/:articleId/comments/:commentId', isArticleExist(service), (req, res) => {
    const { article } = res.locals;
    const { articleId, commentId } = req.params;

    const comment = service.dropArticleCommentById(articleId, commentId, article);

    if (!comment) {
      return handleNotFound(res, `Comment with id ${commentId} not found.`);
    }

    res.status(HttpCode.OK).json(comment);
  });

  route.post('/', validateNewArticle, (req, res) => {
    const newArticle = req.body;

    const createdArticle = service.createArticle(newArticle);

    res.status(HttpCode.CREATED).json(createdArticle);
  });

  route.put('/:articleId', [isArticleExist(service), validateArticleFields], (req, res) => {
    const { article } = res.locals;
    const newArticleData = req.body;

    const updatedArticle = service.updateArticle(article, newArticleData);

    res.status(HttpCode.OK).json(updatedArticle);
  });

  route.post('/:articleId/comments', [isArticleExist(service), validateNewComment], (req, res) => {
    const { article } = res.locals;
    const newComment = req.body;

    const updatedComments = service.addComment(article, newComment);

    res.status(HttpCode.CREATED).json(updatedComments);
  });
};

module.exports = {
  articlesRouter,
};
