'use strict';

const { Router } = require('express');

const myRouter = new Router();

const BASE_MY_PATH = '/my';

myRouter.get('/', (req, res) => {
  res.send('/my');
});

myRouter.get('/comments', (req, res) => {
  res.send('/my/comments');
});

module.exports = { myRouter, BASE_MY_PATH };
