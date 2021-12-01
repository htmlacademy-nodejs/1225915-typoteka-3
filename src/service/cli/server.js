'use strict';

const express = require('express');
const { Router } = require('express');
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const { MOCK_FILE_NAME, HttpCode } = require('../../constants');

const DEFAULT_PORT = 3000;

const getPostsRouter = () => {
  const postsRouter = new Router();

  postsRouter.get('/', async (req, res, next) => {
    try {
      const fileContent = await fs.readFile(MOCK_FILE_NAME, { encoding: 'utf8' });
      const mocks = JSON.parse(fileContent);

      res.json(mocks);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.json([]);
      } else {
        next(err);
      }
    }
  });

  return postsRouter;
};

module.exports = {
  name: '--server',
  run: (args) => {
    const port = Number.parseInt(args[0], 10) || DEFAULT_PORT;

    const app = express();

    app.use(express.json());
    app.use('/posts', getPostsRouter());
    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send('Not found'));
    app.use((err, req, res, next) => {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send('Internal server error: 500');
    });

    app.listen(port, () => {
      console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  },
};
