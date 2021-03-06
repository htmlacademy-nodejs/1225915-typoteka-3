'use strict';

const { DEFAULT_ORDER } = require('./constants');
const { includeUser } = require('../lib/includeUser');

class CommentsService {
  constructor(sequelize) {
    this._Comment = sequelize.models.comment;
    this._User = sequelize.models.user;
  }

  getComments(limit = 5) {
    return this._Comment.findAll({ include: includeUser(this._User), limit, order: [DEFAULT_ORDER] });
  }

  getCommentsById(articleId) {
    return this._Comment.findAll({ where: { article_id: articleId }, include: includeUser(this._User), raw: true });
  }

  async addComment(articleId, newCommentData) {
    const { userId, ...commentData } = newCommentData;

    const newComment = await this._Comment.create({ ...commentData, article_id: Number(articleId) });
    newComment.setArticle(Number(articleId));
    newComment.setAuthor(Number(userId));

    return newComment;
  }

  async dropCommentById(commentId) {
    const droppedRows = await this._Comment.destroy({ where: { id: Number(commentId) } });

    return !!droppedRows;
  }
}

module.exports = {
  CommentsService,
};
