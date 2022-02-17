'use strict';

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../constants`);
const { handleNotFound } = require(`../lib/handleNotFound`);
const { isArticleExist } = require(`../middlewares/isArticleExist`);
const { validateNewComment } = require(`../middlewares/validateNewComment/validateNewComment`);
const { validateArticle } = require('../middlewares/validateNewArticle/validateArticle');
const { validateRouteParams } = require('../middlewares/validateRouteParams/validateRouteParams');

const articlesRouter = (apiRouter, articlesService, commentsService) => {
  const route = new Router();
  apiRouter.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const { comments, limit, offset } = req.query;

    const handleSuccessResponse = (articles) => {
      res.status(HTTP_CODE.OK).json(articles);
    };

    if (limit && offset) {
      const articles = await articlesService.getByPage({ limit, offset, comments });

      handleSuccessResponse(articles);
    } else {
      const articles = await articlesService.getAll(comments);

      handleSuccessResponse(articles);
    }
  });

  route.get('/comments', async (req, res) => {
    const { limit } = req.query;

    const comments = await commentsService.getComments(limit);

    res.status(HTTP_CODE.OK).json(comments);
  });

  route.get(`/:articleId`, [validateRouteParams, isArticleExist(articlesService)], (req, res) => {
    const { article } = res.locals;

    res.status(HTTP_CODE.OK).json(article);
  });

  route.delete(`/:articleId`, [validateRouteParams, isArticleExist(articlesService)], (req, res) => {
    const { article } = res.locals;

    const droppedArticle = articlesService.dropArticle(article.id);

    res.status(HTTP_CODE.OK).json(droppedArticle);
  });

  route.get(`/:articleId/comments`, [validateRouteParams, isArticleExist(articlesService, true)], (req, res) => {
    const { article } = res.locals;

    res.status(HTTP_CODE.OK).json(article.comments);
  });

  route.delete(
    `/:articleId/comments/:commentId`,
    [validateRouteParams, isArticleExist(articlesService)],
    async (req, res) => {
      const { commentId } = req.params;

      const comment = await commentsService.dropCommentById(commentId);

      if (!comment) {
        return handleNotFound(res, `Comment with id ${commentId} not found.`);
      }

      res.status(HTTP_CODE.OK).json(comment);
    }
  );

  route.post(`/`, validateArticle(), async (req, res) => {
    const newArticle = req.body;

    const createdArticle = await articlesService.createArticle({ ...newArticle });

    res.status(HTTP_CODE.CREATED).json(createdArticle);
  });

  route.put(
    `/:articleId`,
    [validateRouteParams, isArticleExist(articlesService), validateArticle({ allOptional: true })],
    async (req, res) => {
      const { article } = res.locals;
      const newArticleData = req.body;

      const updatedArticle = await articlesService.updateArticle(article.id, newArticleData);

      res.status(HTTP_CODE.OK).json(updatedArticle);
    }
  );

  route.post(
    `/:articleId/comment`,
    [validateRouteParams, isArticleExist(articlesService), validateNewComment],
    async (req, res) => {
      const { articleId } = req.params;
      const newComment = req.body;

      const createdComment = await commentsService.addComment(articleId, newComment);

      res.status(HTTP_CODE.CREATED).json(createdComment);
    }
  );
};

module.exports = {
  articlesRouter,
};
