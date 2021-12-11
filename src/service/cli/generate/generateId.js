'use strict';

const { nanoid } = require(`nanoid`);

const MAX_ID_LENGTH = 6;

const generateId = (idLength = MAX_ID_LENGTH) => {
  return nanoid(idLength);
};

module.exports = {
  generateId,
};
