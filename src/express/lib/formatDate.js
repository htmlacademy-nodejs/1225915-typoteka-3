const formatDate = (isoDateString) => new Date(isoDateString).toLocaleString('ru');

module.exports = {
  formatDate,
};
