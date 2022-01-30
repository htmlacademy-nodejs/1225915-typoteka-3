const { generateCommentsList } = require(`./generateCommentsList`);
const { generateTitle } = require(`./generateTitle`);
const { generateCategories } = require(`./generateCategories`);
const { generateAnnounce, getAnnounceLength } = require(`./generateAnnounce`);
const { generateFullText } = require(`./generateFullText`);

const generatePublications = ({ count, titles, categories, sentences, comments, users }) =>
  Array(count)
    .fill({})
    .map(() => {
      const announceLength = getAnnounceLength();

      return {
        comments: generateCommentsList(comments, users),
        title: generateTitle(titles),
        category: generateCategories(categories),
        announce: generateAnnounce(sentences, announceLength),
        full_text: generateFullText(sentences, announceLength),
      };
    });

module.exports = {
  generatePublications,
};
