'use strict';

const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const { sequelize } = require(`../../service/lib/sequelize`);

const { SESSION_SECRET } = process.env;
const MINUTE = 60000;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: MINUTE * 3,
  checkExpirationInterval: MINUTE,
});

sequelize.sync({ force: false });

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
});

module.exports = {
  sessionMiddleware,
};
