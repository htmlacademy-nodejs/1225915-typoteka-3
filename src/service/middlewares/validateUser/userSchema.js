'use strict';

const Joi = require(`joi`);

const USER_VALIDATION_MESSAGES = {
  NAME: `Имя содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXISTS: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`,
};

const userSchema = Joi.object({
  name: Joi.string()
    .pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/)
    .required()
    .messages({
      'string.pattern.base': USER_VALIDATION_MESSAGES.NAME,
    }),
  email: Joi.string().email().required().messages({
    'string.email': USER_VALIDATION_MESSAGES.EMAIL,
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': USER_VALIDATION_MESSAGES.PASSWORD,
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'any.only': USER_VALIDATION_MESSAGES.PASSWORD_REPEATED,
  }),
  avatar: Joi.string().allow(''),
});

module.exports = {
  userSchema,
  USER_VALIDATION_MESSAGES,
};
