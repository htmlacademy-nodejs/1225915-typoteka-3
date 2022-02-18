'use strict';

const { userSchema, USER_VALIDATION_MESSAGES } = require('./userSchema');
const { HTTP_CODE } = require('../../../constants');

const validateUser = (service) => async (req, res, next) => {
  const newUserData = req.body;

  const { error } = userSchema.validate(newUserData, { abortEarly: false });

  if (error) {
    return res.status(HTTP_CODE.BAD_REQUEST).send(error.details.map((err) => err.message));
  }

  const userByEmail = await service.findByEmail(newUserData.email);

  if (userByEmail) {
    return res.status(HTTP_CODE.BAD_REQUEST).send(USER_VALIDATION_MESSAGES.EMAIL_EXISTS);
  }

  return next();
};

module.exports = {
  validateUser,
};
