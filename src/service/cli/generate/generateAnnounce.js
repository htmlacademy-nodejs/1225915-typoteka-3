'use strict';

const { shuffle, getRandomInt } = require(`../../../utils`);

const ANNOUNCE_MIN_LENGTH = 1;
const ANNOUNCE_MAX_LENGTH = 5;

const getAnnounceLength = () => getRandomInt(ANNOUNCE_MIN_LENGTH, ANNOUNCE_MAX_LENGTH);

const generateAnnounce = (sentences, announceLength) => {
  return shuffle(sentences).slice(0, announceLength).join(` `);
};

module.exports = {
  generateAnnounce,
  getAnnounceLength,
};
