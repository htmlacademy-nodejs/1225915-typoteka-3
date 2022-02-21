const { formatDate } = require('./formatDate');

const prepareComments = (comments) =>
  comments.map((comment) => ({ ...comment, formattedCreatedAt: formatDate(comment.createdAt) }));

module.exports = {
  prepareComments,
};
