'use strict';

const { HttpCode } = require('../../constants');

const handleNotFound = (res, message) => {
  return res.status(HttpCode.NOT_FOUND).send(message);
};

module.exports = {
  handleNotFound,
};
