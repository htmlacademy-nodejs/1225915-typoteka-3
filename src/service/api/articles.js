'use strict';

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../constants`);
const { handleNotFound } = require(`../lib/handleNotFound`);
const { validateNewArticle } = require(`../middlewares/validateNewArticle`);
const { isArticleExist } = require(`../middlewares/isArticleExist`);
const { validateArticleFields } = require(`../middlewares/validateArticleFields`);
const { validateNewComment } = require(`../middlewares/validateNewComment`);

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

  route.get(`/:articleId`, isArticleExist(articlesService), (req, res) => {
    const { article } = res.locals;

    res.status(HTTP_CODE.OK).json(article);
  });

  route.delete(`/:articleId`, isArticleExist(articlesService), (req, res) => {
    const { article } = res.locals;

    const droppedArticle = articlesService.dropArticle(article.id);

    res.status(HTTP_CODE.OK).json(droppedArticle);
  });

  route.get(`/:articleId/comments`, isArticleExist(articlesService, true), (req, res) => {
    const { article } = res.locals;

    res.status(HTTP_CODE.OK).json(article.comments);
  });

  route.delete(`/:articleId/comments/:commentId`, isArticleExist(articlesService), async (req, res) => {
    const { commentId } = req.params;

    const comment = await commentsService.dropCommentById(commentId);

    if (!comment) {
      return handleNotFound(res, `Comment with id ${commentId} not found.`);
    }

    res.status(HTTP_CODE.OK).json(comment);
  });

  route.post(`/`, validateNewArticle, async (req, res) => {
    const newArticle = req.body;
    const createdArticle = await articlesService.createArticle(newArticle);

    res.status(HTTP_CODE.CREATED).json(createdArticle);
  });

  route.put(`/:articleId`, [isArticleExist(articlesService), validateArticleFields], async (req, res) => {
    const { article } = res.locals;
    const newArticleData = req.body;

    const updatedArticle = await articlesService.updateArticle(article.id, newArticleData);

    res.status(HTTP_CODE.OK).json(updatedArticle);
  });

  route.post(`/:articleId/comments`, [isArticleExist(articlesService), validateNewComment], async (req, res) => {
    const { articleId } = req.params;
    const newComment = req.body;

    const createdComment = await commentsService.addComment(articleId, newComment);

    res.status(HTTP_CODE.CREATED).json(createdComment);
  });
};

module.exports = {
  articlesRouter,
};
