'use strict';

const { Router } = require('express');

const BASE_MAIN_PATH = '/';

const mainRouter = new Router();

mainRouter.get('/', (req, res) => {
  res.send('mian');
});

mainRouter.get('/register', (req, res) => {
  res.send('/register');
});

mainRouter.get('/login', (req, res) => {
  res.send('/login');
});

mainRouter.get('/search', (req, res) => {
  res.send('/search');
});

mainRouter.get('/categories', (req, res) => {
  res.send('/categories');
});

module.exports = { mainRouter, BASE_MAIN_PATH };
