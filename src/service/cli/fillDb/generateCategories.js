'use strict';

const { shuffle, getRandomInt } = require(`../../../utils`);

const generateCategories = (categories) => {
  const categoriesWithId = categories.map((categoryName, index) => ({ categoryName, id: index + 1 }));

  return shuffle(categoriesWithId)
    .slice(0, getRandomInt(1, categoriesWithId.length - 1))
    .map(({ id }) => id);
};

module.exports = {
  generateCategories,
};
