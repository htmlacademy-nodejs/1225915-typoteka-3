const getCommentsFromArticles = (articles) => {
  return articles.reduce((acc, curr) => {
    return acc.concat(curr.comments.map((comment) => ({ ...comment, title: curr.title, articleId: curr.id })));
  }, []);
};

module.exports = {
  getCommentsFromArticles,
};
