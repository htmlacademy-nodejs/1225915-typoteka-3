'use strict';

const { Router } = require(`express`);
const { getAPI } = require('../api');
const { formatNewArticle } = require('../lib/formatNewArticle');
const { prepareErrors } = require('../lib/prepareErrors');
const { upload } = require('../middlewares/upload');

const BASE_ARTICLES_PATH = `/articles`;

const articlesRouter = new Router();
const api = getAPI();

const renderNewPost =
  (validationMessages = []) =>
  async (req, res) => {
    try {
      const categories = await api.getCategories();
      const post = req.body || {};
      res.render(`new-post`, {
        categories,
        post,
        validationMessages,
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
  res.render(`articles-by-category`);
});

articlesRouter.get(`/add`, renderNewPost());

articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  try {
    const { body, file } = req;

    console.log('body', body);

    await api.createArticle(formatNewArticle({ body, file }));
    res.redirect(`/my`);
  } catch (e) {
    const formattedValidationMessages = prepareErrors(e);

    renderNewPost(formattedValidationMessages)(req, res);
  }
});

articlesRouter.post('/:id/comment', async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    await api.createComment({ articleId: id, data: body });

    res.redirect(`/articles/${id}`);
  } catch (e) {
    const article = await api.getArticleById(id);

    const formattedValidationMessages = prepareErrors(e);

    res.render(`post`, { article, text: body.text, validationMessages: formattedValidationMessages });
  }
});

articlesRouter.get(`/:id/edit`, (req, res) => {
  res.render(`post`);
});

articlesRouter.get(`/:id`, async (req, res) => {
  const { id } = req.params;

  try {
    const article = await api.getArticleById(id);

    res.render(`post`, { article });
  } catch (err) {
    res.render(`404`);
  }
});

module.exports = { articlesRouter, BASE_ARTICLES_PATH };
