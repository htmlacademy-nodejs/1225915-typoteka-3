'use strict';

const { shuffle, getRandomInt } = require(`../../../utils`);

const generateCategories = (categories) => {
  return shuffle(categories).slice(0, getRandomInt(1, categories.length - 1));
};

module.exports = {
  generateCategories,
};
