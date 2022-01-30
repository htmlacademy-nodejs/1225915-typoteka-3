'use strict';

const { shuffle, getRandomInt } = require(`../../../utils`);

const COMMENTS_LIST_MAX_LENGTH = 5;
const COMMENT_MAX_LENGTH = 3;

const generateComment = (comments, users) => () => {
  return {
    text: shuffle(comments).slice(1, COMMENT_MAX_LENGTH).join(` `),
    author_id: getRandomInt(1, users.length),
  };
};

const generateCommentsList = (comments, users) => {
  const targetListLength = getRandomInt(0, COMMENTS_LIST_MAX_LENGTH);

  return Array(targetListLength).fill({}).map(generateComment(comments, users));
};

module.exports = {
  generateCommentsList,
};
