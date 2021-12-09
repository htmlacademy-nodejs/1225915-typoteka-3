const { shuffle, getRandomInt } = require('../../../utils');

const generateFullText = (sentences, announceLength) => {
  return shuffle(sentences).slice(0, getRandomInt(announceLength, sentences.length)).join(` `);
};

module.exports = {
  generateFullText,
};
