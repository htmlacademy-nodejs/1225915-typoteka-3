'use strict';

const { Router } = require(`express`);
const csrf = require(`csurf`);

const { getAPI } = require('../api');
const { formatNewArticle } = require('../lib/formatNewArticle');
const { prepareErrors } = require('../lib/prepareErrors');
const { upload } = require('../middlewares/upload');
const { authMiddleware } = require('../middlewares/auth');
const { prepareComments } = require('../lib/prepareComments');
const { formatDate } = require('../lib/formatDate');

const BASE_ARTICLES_PATH = `/articles`;

const csrfProtection = csrf();
const articlesRouter = new Router();
const api = getAPI();

const renderNewPost =
  (validationMessages = []) =>
  async (req, res) => {
    try {
      const { user } = req.session;
      const categories = await api.getCategories();
      const post = req.body || {};

      res.render(`new-post`, {
        categories,
        post,
        user,
        validationMessages,
        csrfToken: req.csrfToken(),
        setChecked(category) {
          if (!post.categories) {
            return false;
          }
          return post.categories.indexOf(category) !== -1;
        },
      });
    } catch (e) {
      console.log('e', e);
    }
  };

articlesRouter.get(`/category/:id`, (req, res) => {
  const { user } = req.session;

  res.render(`articles-by-category`, { user });
});

articlesRouter.get(`/add`, [authMiddleware, csrfProtection], renderNewPost());

articlesRouter.post(`/add`, [authMiddleware, upload.single(`picture`), csrfProtection], async (req, res) => {
  try {
    const { user } = req.session;
    const { body, file } = req;

    await api.createArticle({ ...formatNewArticle({ body, file }), userId: user.id });
    res.render(`/my`, { user });
  } catch (e) {
    const formattedValidationMessages = prepareErrors(e);

    renderNewPost(formattedValidationMessages)(req, res);
  }
});

articlesRouter.post('/:id/comment', [authMiddleware, csrfProtection], async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const { user } = req.session;
  const { _csrf, ...data } = body;

  try {
    await api.createComment({ articleId: id, data, userId: user.id });

    res.render(`/articles/${id}`, { user });
  } catch (e) {
    const article = await api.getArticleById(id);

    const formattedValidationMessages = prepareErrors(e);

    res.render(`post`, { article, text: body.text, validationMessages: formattedValidationMessages, user });
  }
});

articlesRouter.get(`/:id/edit`, [authMiddleware, csrfProtection], async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  try {
    const article = await api.getArticleById(id);

    res.render(`post`, { article, csrfToken: req.csrfToken(), user });
  } catch (e) {
    res.render(`404`);
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  try {
    const article = await api.getArticleById(id);

    const preparedArticle = {
      ...article,
      createdAt: formatDate(article.createdAt),
      comments: prepareComments(article.comments),
    };

    res.render(`post`, { article: preparedArticle, csrfToken: req.csrfToken(), user });
  } catch (e) {
    res.render(`404`);
  }
});

module.exports = { articlesRouter, BASE_ARTICLES_PATH };
