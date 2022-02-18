'use strict';

const includeUser = (model) => ({
  model,
  as: 'author',
  attributes: {
    exclude: [`passwordHash`],
  },
});

module.exports = {
  includeUser,
};
