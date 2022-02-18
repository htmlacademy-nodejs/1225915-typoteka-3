'use strict';

const { hash, hashSync } = require('bcrypt');

const SALT_ROUNDS = 10;

const passwordUtils = {
  hash: (password) => hash(password, SALT_ROUNDS),
  hashSync: (password) => hashSync(password, SALT_ROUNDS),
};

module.exports = { passwordUtils };
