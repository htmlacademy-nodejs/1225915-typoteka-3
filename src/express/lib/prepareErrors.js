const prepareErrors = (errors) => {
  return errors.response.data;
};

module.exports = {
  prepareErrors,
};
