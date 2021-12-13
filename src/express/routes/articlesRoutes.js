'use strict';

const { Router } = require(`express`);
const { getAPI } = require('../api');
const { formatNewArticle } = require('../lib/formatNewArticle');
const { upload } = require('../middlewares/upload');

const BASE_ARTICLES_PATH = `/articles`;

const articlesRouter = new Router();
const api = getAPI();

const renderNewPost = async (req, res) => {
  try {
    const categories = await api.getCategories();
    const post = req.body || {};
    res.render(`new-post`, {
      categories,
      post,
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

articlesRouter.get(`/add`, renderNewPost);

articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  try {
    const { body, file } = req;
    await api.createArticle(formatNewArticle({ body, file }));
    res.redirect(`/my`);
  } catch (err) {
    renderNewPost(req, res);
  }
});

articlesRouter.get(`/edit/:id`, (req, res) => {
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
