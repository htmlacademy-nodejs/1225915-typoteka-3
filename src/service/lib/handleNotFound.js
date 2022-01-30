'use strict';

const { HTTP_CODE } = require(`../../constants`);

const handleNotFound = (res, message) => {
  return res.status(HTTP_CODE.NOT_FOUND).send(message);
};

module.exports = {
  handleNotFound,
};
