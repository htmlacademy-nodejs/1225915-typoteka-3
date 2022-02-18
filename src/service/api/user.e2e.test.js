const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const { userRouter } = require(`./user`);
const { UserService } = require(`../dataService/user`);
const { HTTP_CODE } = require(`../../constants`);
const { getUsers } = require('../cli/fillDb/getUsers');
const { initDb } = require('../lib/initDb');

const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const createApi = async () => {
  const users = await getUsers();

  await initDb(mockDB, { categories: [], articles: [], users });

  const app = express();
  app.use(express.json());

  userRouter(app, new UserService(mockDB));

  return app;
};

describe('userRouter', () => {
  describe('should create user if data is valid', () => {
    const validUserData = {
      name: `sidorov`,
      email: `sidorov@example.com`,
      password: `sidorov123`,
      passwordRepeated: `sidorov123`,
      avatar: `avatar-5.png`,
    };

    const { password, passwordRepeated, ...dataToComparison } = validUserData;

    let response;

    beforeAll(async () => {
      let app = await createApi();

      response = await request(app).post('/user').send(validUserData);
    });

    test(`status code 201`, () => expect(response.statusCode).toBe(HTTP_CODE.CREATED));
    test(`body should contains correct data`, () =>
      expect(response.body).toEqual(expect.objectContaining(dataToComparison)));
  });

  describe('should refuses if data is invalid', () => {
    const validUserData = {
      name: `sidorov`,
      email: `sidorov@example.com`,
      password: `sidorov123`,
      passwordRepeated: `sidorov123`,
    };

    let app;

    beforeAll(async () => {
      app = await createApi();
    });

    test(`should return 400 if one of required property doesn't send`, async () => {
      for (const key of Object.keys(validUserData)) {
        const badUserData = { ...validUserData };
        delete badUserData[key];

        await request(app).post(`/user`).send(badUserData).expect(HTTP_CODE.BAD_REQUEST);
      }
    });

    test(`should return 400 if one of required property has wrong type`, async () => {
      const badUsers = [
        { ...validUserData, name: true },
        { ...validUserData, email: 1 },
        { ...validUserData, password: true },
        { ...validUserData, passwordRepeated: {} },
      ];

      for (const badUserData of badUsers) {
        await request(app).post(`/user`).send(badUserData).expect(HTTP_CODE.BAD_REQUEST);
      }
    });

    test(`should return 400 if one of required property has wrong value`, async () => {
      const badUsers = [
        { ...validUserData, password: `short`, passwordRepeated: `short` },
        { ...validUserData, email: `invalid` },
        { ...validUserData, name: `invalid()` },
      ];
      for (const badUserData of badUsers) {
        await request(app).post(`/user`).send(badUserData).expect(HTTP_CODE.BAD_REQUEST);
      }
    });

    test(`should return 400 when password and passwordRepeated are not equal`, async () => {
      const badUserData = { ...validUserData, passwordRepeated: `not sidorov` };

      await request(app).post(`/user`).send(badUserData).expect(HTTP_CODE.BAD_REQUEST);
    });

    test(`should return 400 when email is already in use`, async () => {
      const badUserData = { ...validUserData, email: `ivanov@example.com` };

      await request(app).post(`/user`).send(badUserData).expect(HTTP_CODE.BAD_REQUEST);
    });
  });
});
