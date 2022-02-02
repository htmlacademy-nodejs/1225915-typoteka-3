const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const { articlesRouter } = require(`./articles`);
const { ArticlesService } = require(`../dataService/articles`);
const { HTTP_CODE } = require(`../../constants`);
const { getUsers } = require('../cli/fillDb/getUsers');
const { initDb } = require('../lib/initDb');
const { CommentsService } = require('../dataService');

const mockUsers = getUsers();

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
    comments: [{ text: 'text' }],
    title: `Лучшие рок-музыканты 20-века`,
    category: [1],
    announce: `Освоить вёрстку несложно.`,
    full_text: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });

const createApi = async () => {
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
    test(`First article has title "Что такое золотое сечение"`, () => {
      expect(response.body[0].title).toBe(mockArticles[0].title);
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

      request(app).get(`/articles/randomId`).expect(HTTP_CODE.NOT_FOUND);
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
        title: `title`,
        category: [1],
        announce: `announce`,
        full_text: `fullText`,
      };

      beforeAll(async () => {
        app = await createApi();

        response = await request(app).post(`/articles`).send(newArticle);
      });

      test(`Returns status code 201`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.CREATED);
      });
      test(`Returns created article`, () => {
        const { category, ...rest } = newArticle;

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

    describe(`Refuses to create an article if data is invalid`, () => {
      let app;

      beforeAll(async () => {
        app = await createApi();
      });

      const newArticle = {
        title: `title`,
        category: [1],
        announce: `announce`,
      };

      test(`Without any required property response code is 400`, async () => {
        for (const key of Object.keys(newArticle)) {
          const badArticle = { ...newArticle };
          delete badArticle[key];

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
        title: `title`,
        announce: 'announce',
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
      test(`Really change article`, (done) => {
        request(app)
          .get(`/articles`)
          .expect((res) => {
            expect(res.body[0]).toEqual(expect.objectContaining(newFieldsContent));
          })
          .end(done);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, async () => {
      const app = await createApi();

      request(app).put(`/articles/randomId`).send({}).expect(HTTP_CODE.NOT_FOUND);
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

      const newComment = { text: `text` };

      beforeAll(async () => {
        app = await createApi();

        response = await request(app).post(`/articles/1/comments`).send(newComment);
      });

      test(`Returns status code 201`, () => {
        expect(response.statusCode).toBe(HTTP_CODE.CREATED);
      });
      test(`Really add new comment`, (done) => {
        request(app)
          .get(`/articles/1/comments`)
          .expect((res) => expect(res.body[0]).toEqual(expect.objectContaining(newComment)))
          .end(done);
      });
    });

    describe(`Should return "bad request" error with incorrect comment body`, () => {
      const newIncorrectComment = {
        incorrectProperty: `incorrectProperty`,
      };

      test(`Returns 400`, async () => {
        const app = await createApi();

        request(app).post(`/articles/1/comments`).send(newIncorrectComment).expect(HTTP_CODE.BAD_REQUEST);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, async () => {
      const app = await createApi();

      request(app).post(`/articles/9999/comments`).send({}).expect(HTTP_CODE.NOT_FOUND);
    });
  });
});
