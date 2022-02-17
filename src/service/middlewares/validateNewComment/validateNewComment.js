'use strict';

const { HTTP_CODE } = require(`../../../constants`);
const { newCommentSchema } = require('./newCommentSchema');

const validateNewComment = (req, res, next) => {
  const newComment = req.body;

  const { error } = newCommentSchema.validate(newComment, { abortEarly: false });

  if (error) {
    return res.status(HTTP_CODE.BAD_REQUEST).send(error.details.map((err) => err.message));
  }

  return next();
};

module.exports = {
  validateNewComment,
};
