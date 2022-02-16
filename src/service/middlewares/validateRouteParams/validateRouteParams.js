'use strict';

const { HTTP_CODE } = require(`../../../constants`);
const { routeParamsSchema } = require('./routeParamsSchema');

const validateRouteParams = (req, res, next) => {
  const { params } = req;

  const { error } = routeParamsSchema.validate(params);

  if (error) {
    return res.status(HTTP_CODE.BAD_REQUEST).send(error.details.map((err) => err.message));
  }

  return next();
};

module.exports = {
  validateRouteParams,
};
