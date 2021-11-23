'use strict';

const chalk = require(`chalk`);
const version = require('./version');
const generate = require('./generate');

module.exports = {
  name: '--help',
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для API.

        Гайд:
        service.js <command>
        Команды:
         ${version.name}: выводит номер версии
         ${this.name}: печатает этот текст
         ${generate.name} <count> формирует файл mocks.json
    `;

    console.info(chalk.gray(text));
  },
};
