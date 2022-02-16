const formatNewArticle = ({ body, file = {} }) => {
  const data = {
    title: body.title,
    announce: body.announce,
    full_text: body.text,
    category: (body.categories || []).map((category) => Number(category)),
  };

  if (file.filename) {
    data.image = file.filename;
  }

  return data;
};

module.exports = {
  formatNewArticle,
};
