'use strict';

const Joi = require(`joi`);

const { REQUIRED_VALIDATION_MESSAGE } = require(`../../../constants`);

const COMMENT_MIN_SYMBOLS = 20;

const SMALL_COMMENT_VALIDATION_MESSAGE = `Минимум ${COMMENT_MIN_SYMBOLS} символов`;

const newCommentSchema = Joi.object({
  text: Joi.string().min(COMMENT_MIN_SYMBOLS).required().messages({
    'any.required': REQUIRED_VALIDATION_MESSAGE,
    'string.min': SMALL_COMMENT_VALIDATION_MESSAGE,
  }),
  userId: Joi.number().required(),
});

module.exports = {
  newCommentSchema,
};
