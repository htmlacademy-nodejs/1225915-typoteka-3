const Sequelize = require('sequelize');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const mustExistEnv = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];

const getNotDefinedEnv = () => {
  const notExist = [];

  mustExistEnv.forEach((envDBName) => {
    if (!process.env[envDBName]) {
      notExist.push(envDBName);
    }
  });

  return notExist.length ? notExist : null;
};

const notDefinedEnv = getNotDefinedEnv();

if (notDefinedEnv) {
  throw new Error(`${notDefinedEnv.toString()} environmental variables are not defined`);
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: `postgres`,
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 10000,
  },
});

module.exports = {
  sequelize,
};
