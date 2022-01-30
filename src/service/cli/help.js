'use strict';

const chalk = require(`chalk`);
const version = require(`./version`);
const fillDb = require(`./fillDb`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для API.

        Гайд:
        service.js <command>
        Команды:
         ${version.name}: выводит номер версии
         ${this.name}: печатает этот текст
         ${fillDb.name} <count> формирует и заполняет базу данных
    `;

    console.info(chalk.gray(text));
  },
};
