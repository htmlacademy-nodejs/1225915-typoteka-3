'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;

const { MOCK_FILE_NAME, HttpCode } = require('../../constants');

const DEFAULT_PORT = 3000;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <body>${message}</body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const createTitleElement = (post) => `<li>${post.title}</li>`;

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`: {
      try {
        const fileContent = await fs.readFile(MOCK_FILE_NAME, { encoding: 'utf8' });
        const mocks = JSON.parse(fileContent);
        const message = mocks.map(createTitleElement).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    }

    default: {
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
    }
  }
};

module.exports = {
  name: '--server',
  run: (args) => {
    const port = Number.parseInt(args[0], 10) || DEFAULT_PORT;

    http
      .createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        console.info(chalk.green(`Ожидаю соединений на ${port}`));
      })
      .on(`error`, ({ message }) => {
        console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  },
};
