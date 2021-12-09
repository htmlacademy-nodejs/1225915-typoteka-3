'use strict';

const fs = require('fs').promises;
const { MOCK_FILE_NAME } = require('../../constants');

const data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(MOCK_FILE_NAME, { encoding: 'utf8' });
    const mocks = JSON.parse(fileContent);

    data.push(...mocks);
  } catch (err) {
    return err;
  }

  return data;
};

module.exports = {
  getMockData,
};
