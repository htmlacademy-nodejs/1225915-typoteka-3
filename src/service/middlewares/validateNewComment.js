'use strict';

const { HTTP_CODE } = require(`../../constants`);

const requiredCommentFields = [`text`];

const validateNewComment = (req, res, next) => {
  const newComment = req.body;
  const isAllRequiredPropertiesExist = requiredCommentFields.every((propertyName) => newComment[propertyName]);

  if (!isAllRequiredPropertiesExist) {
    res.status(HTTP_CODE.BAD_REQUEST).send(`Invalid comment properties.`);
  }

  next();
};

module.exports = {
  validateNewComment,
};
