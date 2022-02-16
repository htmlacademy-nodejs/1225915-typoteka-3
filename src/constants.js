'use strict';

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const DEFAULT_API_PORT = 3009;

const EXIT_CODE = {
  error: 1,
  success: 0,
};

const HTTP_METHOD = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const HTTP_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ENV = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const REQUIRED_VALIDATION_MESSAGE = 'Обязательно для заполнения';

module.exports = {
  ENV,
  HTTP_CODE,
  HTTP_METHOD,
  EXIT_CODE,
  DEFAULT_API_PORT,
  USER_ARGV_INDEX,
  DEFAULT_COMMAND,
  REQUIRED_VALIDATION_MESSAGE,
};
