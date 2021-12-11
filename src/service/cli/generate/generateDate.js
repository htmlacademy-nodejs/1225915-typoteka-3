'use strict';

const { getRandomInt } = require(`../../../utils`);

const getAvailableDates = () => {
  const lastDate = Date.now();
  const firstDate = new Date(lastDate);

  firstDate.setMonth(firstDate.getMonth() - 3);

  return {
    lastDate,
    firstDate: firstDate.getTime(),
  };
};

const generateDate = () => {
  const { lastDate, firstDate } = getAvailableDates();

  return new Date(getRandomInt(firstDate, lastDate)).toISOString();
};

module.exports = {
  generateDate,
};
