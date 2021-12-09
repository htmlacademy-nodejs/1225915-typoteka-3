'use strict';

const { generateId } = require('../cli/generate/generateId');
const { generateDate } = require('../cli/generate/generateDate');

const requiredArticleFields = [`title`, `category`, `announce`];

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  getAll() {
    return this._articles;
  }

  getArticleById(id) {
    return this._articles.find((article) => {
      return article.id === id;
    });
  }

  dropArticle(article) {
    const { id } = article;

    this._articles = this._articles.filter((article) => article.id !== id);

    return article;
  }

  getComments(article) {
    return article.comments;
  }

  dropArticleCommentById(articleId, commentId, article) {
    const comments = this.getComments(article);
    const comment = comments.find((comment) => comment.id === commentId);

    if (!comment) {
      return null;
    }

    const filteredComments = comments.filter((comment) => comment.id !== commentId);

    this._articles = this._articles.map((article) => {
      if (article.id === articleId) {
        return { ...article, comments: filteredComments };
      }

      return article;
    });

    return comment;
  }

  createArticle(data) {
    const newArticle = { ...data, id: generateId(), createdDate: generateDate(), comments: [] };

    this._articles.push(newArticle);

    return newArticle;
  }

  updateArticle(article, data) {
    const { id } = article;
    const updatedArticle = { ...article, ...data };

    this._articles = this._articles.map((article) => {
      if (article.id === id) {
        return updatedArticle;
      }

      return article;
    });

    return updatedArticle;
  }

  addComment(article, newCommentData) {
    const comments = this.getComments(article);
    const newComment = { ...newCommentData, id: generateId() };

    comments.push(newComment);

    return comments;
  }
}

module.exports = {
  ArticlesService,
  requiredArticleFields,
};
