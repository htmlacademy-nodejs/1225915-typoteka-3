const { getRandomInt } = require('../../../utils');

const generateTitle = (titles) => {
  return titles[getRandomInt(0, titles.length - 1)];
};

module.exports = {
  generateTitle,
};
