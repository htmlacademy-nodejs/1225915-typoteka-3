'use strict';

const { passwordUtils } = require('../../lib/password');

const getUsers = async () => [
  {
    email: 'ivanov@example.com',
    name: 'ivanov',
    passwordHash: await passwordUtils.hash(`ivanov`),
    role: { title: 'admin' },
    avatar: 'avatar-1.png',
  },
  {
    email: 'petrov@example.com',
    name: 'petrov',
    passwordHash: await passwordUtils.hash(`petrov`),
    role: { title: 'reader' },
    avatar: 'avatar-2.png',
  },
];

module.exports = {
  getUsers,
};
