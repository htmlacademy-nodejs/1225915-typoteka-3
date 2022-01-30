'use strict';

const help = require(`./help`);
const version = require(`./version`);
const fillDb = require(`./fillDb`);
const server = require(`./server`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [fillDb.name]: fillDb,
  [server.name]: server,
};

module.exports = {
  Cli,
};
