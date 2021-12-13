const formatNewArticle = ({ body, file = {} }) => {
  const data = {
    title: body.title,
    announce: body.announce,
    fullText: body.text,
    createdDate: body.date || new Date().toISOString(),
    category: body.categories || [],
    comments: [],
  };

  if (file.filename) {
    data.picture = file.filename;
  }

  return data;
};

module.exports = {
  formatNewArticle,
};
