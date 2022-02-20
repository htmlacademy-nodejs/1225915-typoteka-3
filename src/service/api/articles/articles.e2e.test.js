const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const { articlesRouter } = require(`./articles`);
const { ArticlesService } = require(`../../dataService/articles`);
const { HTTP_CODE } = require(`../../../constants`);
const { getUsers } = require('../../cli/fillDb/getUsers');
const { initDb } = require('../../lib/initDb');
const { CommentsService } = require('../../dataService');

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
    comments: [{ text: 'text', author_id: 2 }],
    title: `Лучшие рок-музыканты 20-века`,
    category: [1],
    announce: `Освоить вёрстку несложно.`,
    full_text: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const createApi = async () => {
  const mockUsers = await getUsers();

  await initDb(mockDB, { categories: mockCategories, articles: mockArticles, users: mockUsers });

  const app = express();
  app.use(express.json());

  articlesRouter(app, new ArticlesService(mockDB), new CommentsService(mockDB));

  return app;
};

describe(`articlesRouter`, () => {
  describe(`GET /articles`, () => {
    let response;

    beforeAll(async () => {
      const app = await createApi();

      response = await request(app).get(`/articles`);
    });

    test(`Returns status 200`, () => {
      expect(response.statusCode).toBe(HTTP_CODE.OK);
    });
    test(`Contains 2 articles`, () => {
      expect(response.body.length).toBe(2);
    });
  });

  describe(`GET /articles/:articleId`, () => {
    describe(`Should return correct article by id`, () => {
      let response;

      beforeAll(async () => {
        const app = await createApi();

        response = await request(app).get(`/articles/2`);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.OK);
      });
      test(`Article title is "Лучшие рок-музыканты 20-века"`, () => {
        expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, async () => {
      const app = await createApi();

      request(app).get(`/articles/9999`).expect(HTTP_CODE.NOT_FOUND);
    });
  });

  describe(`GET /articles/:articleId/comments`, () => {
    describe(`Should return list of comments for article`, () => {
      let response;

      beforeAll(async () => {
        const app = await createApi();

        response = await request(app).get(`/articles/2/comments`);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.OK);
      });
      test(`Returns one comment`, () => {
        expect(response.body.length).toBe(1);
      });
      test(`Comment text is `, () => {
        expect(response.body[0].text).toBe(`text`);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, async () => {
      const app = await createApi();

      request(app).get(`/articles/randomId/comments`).expect(HTTP_CODE.NOT_FOUND);
    });
  });

  describe(`DELETE /articles/:articleId`, () => {
    describe(`Should delete article by id`, () => {
      let response;
      let app;

      beforeAll(async () => {
        app = await createApi();

        response = await request(app).delete(`/articles/2`);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.OK);
      });

      test(`Articles count is 1 now`, (done) => {
        request(app)
          .get(`/articles`)
          .expect((res) => expect(res.body.length).toBe(1))
          .end(done);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, async () => {
      const app = await createApi();

      request(app).delete(`/articles/randomId`).expect(HTTP_CODE.NOT_FOUND);
    });
  });

  describe(`POST /articles`, () => {
    describe(`Should create new article with correct data`, () => {
      let app;
      let response;

      const newArticle = {
        title: `Как перестать беспокоиться и начать жить. `,
        category: [1],
        announce: `Как достигнуть успеха не вставая с кресла`,
        full_text: `fullText`,
        userId: 1,
      };

      beforeAll(async () => {
        app = await createApi();

        response = await request(app).post(`/articles`).send(newArticle);
      });

      test(`Returns status code 201`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.CREATED);
      });
      test(`Returns created article`, () => {
        const { category, userId, ...rest } = newArticle;

        const createdArticleProperties = { ...rest };

        expect(response.body).toEqual(expect.objectContaining(createdArticleProperties));
      });
      test(`Articles count is changed`, (done) => {
        request(app)
          .get(`/articles`)
          .expect((res) => expect(res.body.length).toBe(3))
          .end(done);
      });
    });

    describe(`Should return BAD_REQUEST if article won't pass schema validation`, () => {
      const newArticle = {
        title: `Как перестать беспокоиться и начать жить. `,
        category: [1],
        announce: `Как достигнуть успеха не вставая с кресла`,
        full_text: `fullText`,
      };

      let app;

      beforeAll(async () => {
        app = await createApi();
      });

      test('correct handle wrong type of article properties', async () => {
        const badArticles = [
          { ...newArticle, title: true },
          { ...newArticle, announce: [] },
          { ...newArticle, full_text: {} },
          { ...newArticle, comments: '' },
          { ...newArticle, image: [] },
          { ...newArticle, category: '' },
        ];

        for (const badArticle of badArticles) {
          await request(app).post(`/articles`).send(badArticle).expect(HTTP_CODE.BAD_REQUEST);
        }
      });

      test('correct handle wrong value of article properties', async () => {
        const badArticles = [
          { ...newArticle, title: 'small title' },
          { ...newArticle, category: [] },
          {
            ...newArticle,
            announce:
              'too big announce too big announce too big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announce too big announce too big announce too big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announce',
          },
        ];

        for (const badArticle of badArticles) {
          await request(app).post(`/articles`).send(badArticle).expect(HTTP_CODE.BAD_REQUEST);
        }
      });
    });
  });

  describe(`PUT /:articleId`, () => {
    describe(`Changes an article`, () => {
      let app;
      let response;

      const newFieldsContent = {
        title: `Как перестать беспокоиться и начать жить. `,
        announce: `Как достигнуть успеха не вставая с кресла`,
      };

      beforeAll(async () => {
        app = await createApi();

        response = await request(app).put(`/articles/1`).send(newFieldsContent);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.OK);
      });
      test(`Returns changed article`, () => {
        expect(response.body).toBeTruthy();
      });
    });

    test('correct handle wrong value of article properties', async () => {
      const newArticle = {
        title: `Как перестать беспокоиться и начать жить. `,
        category: [1],
        announce: `Как достигнуть успеха не вставая с кресла`,
        full_text: `fullText`,
      };

      const app = await createApi();

      const badArticles = [
        { ...newArticle, title: 'small title' },
        { ...newArticle, category: [] },
        {
          ...newArticle,
          announce:
            'too big announce too big announce too big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announce too big announce too big announce too big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announcetoo big announce too big announce',
        },
      ];

      for (const badArticle of badArticles) {
        await request(app).put(`/articles/1`).send(badArticle).expect(HTTP_CODE.BAD_REQUEST);
      }
    });

    test(`Should return BAD_REQUEST if article with passed id isn't number`, async () => {
      const app = await createApi();

      await request(app).put(`/articles/randomId`).send({}).expect(HTTP_CODE.BAD_REQUEST);
    });

    test(`Should return "not found error" if article with passed id isn't number`, async () => {
      const app = await createApi();

      await request(app).put(`/articles/98765`).send({}).expect(HTTP_CODE.NOT_FOUND);
    });
  });

  describe(`DELETE /articles/:articleId/comments/:commentId`, () => {
    describe(`Should correctly delete a comment `, () => {
      let app;
      let response;

      beforeAll(async () => {
        app = await createApi();

        response = await request(app).delete(`/articles/2/comments/1`);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.OK);
      });
      test(`Really delete comment`, (done) => {
        request(app)
          .get(`/articles?comments=true`)
          .expect((res) => expect(res.body[1].comments).toEqual([]))
          .end(done);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, async () => {
      const app = await createApi();

      request(app).delete(`/articles/randomId/comments/commentId`).expect(HTTP_CODE.NOT_FOUND);
    });

    test(`Should return "not found error" if comment with passed id doesn't exist`, async () => {
      const app = await createApi();

      request(app).delete(`/articles/1/comments/999`).expect(HTTP_CODE.NOT_FOUND);
    });
  });

  describe(`POST /articles/:articleId/comments`, () => {
    describe(`Should add new comment`, () => {
      let app;
      let response;

      const newComment = {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        userId: 1,
      };

      beforeAll(async () => {
        app = await createApi();

        response = await request(app).post(`/articles/1/comment`).send(newComment);
      });

      test(`Returns status code 201`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.CREATED);
      });
      test(`Really add new comment`, (done) => {
        request(app)
          .get(`/articles/1/comments`)
          .expect((res) => expect(res.body[0]).toEqual(expect.objectContaining({ text: newComment.text })))
          .end(done);
      });
    });

    describe(`Should return "bad request" error with incorrect comment body`, () => {
      const newIncorrectComment = {
        incorrectProperty: `incorrectProperty`,
      };

      test(`Returns 400`, async () => {
        const app = await createApi();

        request(app).post(`/articles/1/comment`).send(newIncorrectComment).expect(HTTP_CODE.BAD_REQUEST);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, async () => {
      const app = await createApi();

      request(app).post(`/articles/9999/comment`).send({}).expect(HTTP_CODE.NOT_FOUND);
    });

    test(`Should return "bad request" if new comment doesn't contain text property`, async () => {
      const app = await createApi();

      request(app).post(`/articles/1/comment`).send({}).expect(HTTP_CODE.BAD_REQUEST);
    });

    test(`Should return "bad request" if new comment text property too small`, async () => {
      const app = await createApi();

      request(app).post(`/articles/1/comment`).send({ text: 'less then 20' }).expect(HTTP_CODE.BAD_REQUEST);
    });
  });
});
