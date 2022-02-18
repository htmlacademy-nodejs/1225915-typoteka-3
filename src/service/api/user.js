'use strict';

const { Router } = require(`express`);
const { HTTP_CODE } = require(`../../constants`);
const { validateUser } = require('../middlewares/validateUser/validateUser');
const { passwordUtils } = require('../lib/password');

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
};

module.exports = {
  userRouter,
};
