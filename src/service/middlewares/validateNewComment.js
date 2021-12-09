'use strict';

const { HttpCode } = require('../../constants');

const requiredCommentFields = ['text'];

const validateNewComment = (req, res, next) => {
  const newComment = req.body;
  const isAllRequiredPropertiesExist = requiredCommentFields.every((propertyName) => newComment[propertyName]);

  if (!isAllRequiredPropertiesExist) {
    res.status(HttpCode.BAD_REQUEST).send('Invalid comment properties.');
  }

  next();
};

module.exports = {
  validateNewComment,
};
