'use strict';

const { EXIT_CODE } = require(`../../../constants`);
const { sequelize } = require('../../lib/sequelize');
const { readContent } = require(`../../lib/readContent`);
const { initDb } = require(`../../lib/initDb`);
const { logger } = require('../../lib/logger');
const { generatePublications } = require('./generatePublications');
const { getUsers } = require('./getUsers');

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const run = async (args) => {
  const [count] = args;
  const publicationsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

  if (publicationsCount > MAX_COUNT) {
    logger.error(`No more than ${MAX_COUNT} articles`);
    process.exit(EXIT_CODE.error);
  }

  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
    logger.info(`Connection to database established`);
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(EXIT_CODE.error);
  }

  const [sentences, titles, categories, comments] = await Promise.all([
    readContent(FILE_SENTENCES_PATH),
    readContent(FILE_TITLES_PATH),
    readContent(FILE_CATEGORIES_PATH),
    readContent(FILE_COMMENTS_PATH),
  ]);

  const users = getUsers();

  const articles = generatePublications({ count: publicationsCount, categories, comments, sentences, titles, users });

  await initDb(sequelize, { categories, articles, users });
};

module.exports = {
  name: `--fillDb`,
  run,
};
