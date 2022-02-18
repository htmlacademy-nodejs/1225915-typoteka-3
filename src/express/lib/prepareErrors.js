const prepareErrors = (errors) => {
  return Array(errors.response.data);
};

module.exports = {
  prepareErrors,
};
