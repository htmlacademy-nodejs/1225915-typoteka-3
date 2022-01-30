'use strict';

const { HTTP_CODE } = require(`../../constants`);
const { requiredArticleFields } = require(`../dataService/articles`);

const validateNewArticle = (req, res, next) => {
  const newArticle = req.body;
  const newArticleFields = Object.keys(newArticle);

  const fieldsExists = requiredArticleFields.every((fieldName) => newArticleFields.includes(fieldName));

  if (!fieldsExists) {
    res.status(HTTP_CODE.BAD_REQUEST).send(`Not all fields were passed.`);
    return;
  }

  next();
};

module.exports = {
  validateNewArticle,
};
