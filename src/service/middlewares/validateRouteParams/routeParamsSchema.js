'use strict';

const Joi = require(`joi`);

const routeParamsSchema = Joi.object({
  articleId: Joi.number().integer().min(1),
  commentId: Joi.number().integer().min(1),
});

module.exports = {
  routeParamsSchema,
};
