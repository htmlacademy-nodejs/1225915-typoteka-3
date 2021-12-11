'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const { ExitCode, MOCK_FILE_NAME } = require(`../../../constants`);
const { readContent } = require(`./readContent`);
const { generateId } = require(`./generateId`);
const { generateCommentsList } = require(`./generateCommentsList`);
const { generateTitle } = require(`./generateTitle`);
const { generateCategories } = require(`./generateCategories`);
const { generateAnnounce, getAnnounceLength } = require(`./generateAnnounce`);
const { generateFullText } = require(`./generateFullText`);
const { generateDate } = require(`./generateDate`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const generatePublications = ({ count, titles, categories, sentences, comments }) =>
  Array(count)
    .fill({})
    .map(() => {
      const announceLength = getAnnounceLength();

      return {
        id: generateId(),
        comments: generateCommentsList(comments),
        title: generateTitle(titles),
        category: generateCategories(categories),
        announce: generateAnnounce(sentences, announceLength),
        fullText: generateFullText(sentences, announceLength),
        createdDate: generateDate(),
      };
    });

module.exports = {
  name: `--generate`,
  run: async (args) => {
    const [sentences, titles, categories, comments] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const [count] = args;
    const publicationsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (publicationsCount > MAX_COUNT) {
      console.error(chalk.red(`Не больше ${MAX_COUNT} публикаций`));
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(
      generatePublications({ count: publicationsCount, titles, categories, sentences, comments })
    );

    try {
      await fs.writeFile(MOCK_FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
