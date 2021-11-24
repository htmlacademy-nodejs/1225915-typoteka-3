'use strict';

const fs = require('fs').promises;
const chalk = require(`chalk`);
const { getRandomInt, shuffle } = require('../../utils');
const { ExitCode, MOCK_FILE_NAME } = require('../../constants');

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const ANNOUNCE_MIN_LENGTH = 1;
const ANNOUNCE_MAX_LENGTH = 5;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getAvailableDates = () => {
  const lastDate = Date.now();
  const firstDate = new Date(lastDate);

  firstDate.setMonth(firstDate.getMonth() - 3);

  return {
    lastDate,
    firstDate: firstDate.getTime(),
  };
};

const generatePublications = ({ count, titles, categories, sentences }) =>
  Array(count)
    .fill({})
    .map(() => {
      const announceLength = getRandomInt(ANNOUNCE_MIN_LENGTH, ANNOUNCE_MAX_LENGTH);
      const { lastDate, firstDate } = getAvailableDates();

      return {
        title: titles[getRandomInt(0, titles.length - 1)],
        category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
        announce: shuffle(sentences).slice(0, announceLength).join(` `),
        fullText: shuffle(sentences).slice(0, getRandomInt(announceLength, sentences.length)).join(` `),
        createdDate: new Date(getRandomInt(firstDate, lastDate)).toISOString(),
      };
    });

module.exports = {
  name: '--generate',
  run: async (args) => {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const publicationsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (publicationsCount > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generatePublications({ count: publicationsCount, titles, categories, sentences }));

    try {
      await fs.writeFile(MOCK_FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
