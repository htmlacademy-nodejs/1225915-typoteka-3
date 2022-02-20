const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const { initDb } = require('../../lib/initDb');
const { categoriesRouter } = require(`./categories`);
const { CategoriesService } = require(`../../dataService/categories`);
const { getUsers } = require('../../cli/fillDb/getUsers');
const { HTTP_CODE } = require(`../../../constants`);

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

describe(`categoriesRouter`, () => {
  beforeAll(async () => {
    const users = await getUsers();

    await initDb(mockDB, { categories: mockCategories, articles: mockArticles, users });
    categoriesRouter(app, new CategoriesService(mockDB));
  });

  describe(`API should return category list`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get(`/categories`);
    });

    test(`Status code should be 200`, () => {
      expect(response.statusCode).toBe(HTTP_CODE.OK);
    });
    test(`Should return list of 12 categories`, () => {
      expect(response.body.length).toBe(3);
    });
    test(`Category names are 'Семья', 'Работа', 'Уход за собой'`, () => {
      expect(response.body.map((it) => it.title)).toEqual(expect.arrayContaining([`Семья`, `Уход за собой`, `Работа`]));
    });
  });
});
