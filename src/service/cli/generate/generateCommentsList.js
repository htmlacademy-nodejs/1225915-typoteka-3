'use strict';

const { shuffle, getRandomInt } = require(`../../../utils`);
const { generateId } = require(`./generateId`);

const COMMENTS_LIST_MAX_LENGTH = 5;
const COMMENT_MAX_LENGTH = 3;

const generateComment = (comments) => () => {
  return {
    id: generateId(),
    text: shuffle(comments).slice(1, COMMENT_MAX_LENGTH).join(` `),
  };
};

const generateCommentsList = (comments) => {
  const targetListLength = getRandomInt(0, COMMENTS_LIST_MAX_LENGTH);

  return Array(targetListLength).fill({}).map(generateComment(comments));
};

module.exports = {
  generateCommentsList,
};
