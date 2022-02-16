'use strict';

const { HTTP_CODE } = require('../../../constants');
const { newArticleSchema, updateArticleSchema } = require('./newArticleSchema');

const validateArticle =
  ({ allOptional } = {}) =>
  (req, res, next) => {
    const newArticleData = req.body;
    const schema = allOptional ? updateArticleSchema : newArticleSchema;

    const { error } = schema.validate(newArticleData, { abortEarly: false });

    if (error) {
      return res.status(HTTP_CODE.BAD_REQUEST).send(error.details.map((err) => err.message));
    }

    return next();
  };

module.exports = {
  validateArticle,
};
