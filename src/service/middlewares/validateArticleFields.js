'use strict';

const { HttpCode } = require('../../constants');
const { requiredArticleFields } = require('../dataService/articles');

const validateArticleFields = (req, res, next) => {
  const newArticlesData = req.body;
  const newFields = Object.keys(newArticlesData);

  const isValidFields = newFields.every((fieldName) => requiredArticleFields.includes(fieldName));

  if (!isValidFields) {
    res.status(HttpCode.BAD_REQUEST).send('Incorrect set of fields.');
  }

  next();
};

module.exports = {
  validateArticleFields,
};
