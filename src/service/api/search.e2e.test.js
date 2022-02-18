const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const { searchRouter } = require(`./search`);
const { SearchService } = require(`../dataService/search`);
const { HTTP_CODE } = require(`../../constants`);
const { getUsers } = require('../cli/fillDb/getUsers');
const { initDb } = require('../lib/initDb');

const mockCategories = ['Семья', 'Работа', 'Уход за собой'];

const mockArticles = [
  {
    comments: [],
    title: `Что такое золотое сечение`,
    category: [2, 3],
    announce: `Освоить вёрстку сложно.`,
    full_text: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно.`,
  },
  {
    comments: [],
    title: `Лучшие рок-музыканты 20-века`,
    category: [1],
    announce: `Освоить вёрстку несложно.`,
    full_text: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const app = express();
app.use(express.json());

describe(`searchRouter`, () => {
  beforeAll(async () => {
    const users = await getUsers();

    await initDb(mockDB, { categories: mockCategories, articles: mockArticles, users });
    searchRouter(app, new SearchService(mockDB));
  });

  describe(`API should return offer based on search query`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/search`).query({
        query: `золотое сечение`,
      });
    });

    test(`Status code should be 200`, () => expect(response.statusCode).toBe(HTTP_CODE.OK));
    test(`1 article found`, () => expect(response.body.length).toBe(1));
    test(`Article has correct id`, () => expect(response.body[0].id).toBe(1));
  });

  describe(`API should return empty array if nothing is found`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/search`).query({
        query: `nothing to see here bro`,
      });
    });

    test(`Status code should be 200`, () => expect(response.statusCode).toBe(HTTP_CODE.OK));
    test(`0 article found`, () => expect(response.body.length).toBe(0));
  });

  describe(`API should return empty array if query string is absent`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/search`);
    });

    test(`Status code should be 200`, () => expect(response.statusCode).toBe(HTTP_CODE.OK));
    test(`0 article found`, () => expect(response.body.length).toBe(0));
  });
});
