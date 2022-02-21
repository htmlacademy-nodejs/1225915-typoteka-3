'use strict';

const authMiddleware = (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    return res.render(`login`, { validationMessages: [], payload: {} });
  }
  return next();
};

module.exports = {
  authMiddleware,
};
