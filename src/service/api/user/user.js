'use strict';

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../../constants`);
const { validateUser } = require('../../middlewares/validateUser/validateUser');
const { passwordUtils } = require('../../lib/password');

const AUTH_ERROR_MESSAGES = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`,
};

const userRouter = (apiRouter, service) => {
  const route = new Router();

  apiRouter.use('/user', route);

  route.post('/', validateUser(service), async (req, res) => {
    const newUserData = req.body;

    newUserData.passwordHash = await passwordUtils.hash(newUserData.password);

    const newUser = await service.create(newUserData);

    delete newUser.passwordHash;

    res.status(HTTP_CODE.CREATED).json(newUser);
  });

  route.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    const user = await service.findByEmail(email);

    if (!user) {
      return res.status(HTTP_CODE.UNAUTHORIZED).send(AUTH_ERROR_MESSAGES.EMAIL);
    }

    const isPasswordCorrect = await passwordUtils.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(HTTP_CODE.UNAUTHORIZED).send(AUTH_ERROR_MESSAGES.PASSWORD);
    }

    const { passwordHash, ...userData } = user;

    res.status(HTTP_CODE.OK).send(userData);
  });
};

module.exports = {
  userRouter,
};
