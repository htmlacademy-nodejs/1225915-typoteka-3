'use strict';

const Joi = require(`joi`);

const articleSchema = {
  title: Joi.string().min(30).max(250).required(),
  announce: Joi.string().min(30).max(250).required(),
  full_text: Joi.string().max(1000),
  image: Joi.string(),
  category: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  comments: Joi.array(),
};

const newArticleSchema = Joi.object({ ...articleSchema });

const updateArticleSchema = Joi.object({
  ...articleSchema,
}).fork(Object.keys(articleSchema), (schema) => schema.optional());

module.exports = {
  newArticleSchema,
  updateArticleSchema,
};
