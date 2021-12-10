const express = require(`express`);
const request = require(`supertest`);

const { articlesRouter } = require(`./articles`);
const { ArticlesService } = require(`../dataService/articles`);
const { HttpCode } = require(`../../constants`);

const mockData = [
  {
    id: `7uDv8x`,
    comments: [{ id: `eJC--w`, text: `Хочу такую же футболку :-)` }],
    title: `Что такое золотое сечение`,
    category: [`Работа`, `Уход за собой`],
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха.`,
    createdDate: `2021-11-29T11:17:03.491Z`,
  },
  {
    id: `7i3VHZ`,
    comments: [
      { id: `oK88CG`, text: `Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!` },
      { id: `vjHhpE`, text: `Хочу такую же футболку :-) Согласен с автором!` },
      {
        id: `fKqVh5`,
        text: `Мне не нравится ваш стиль. Ощущение что вы меня поучаете. Мне кажется или я уже читал это где-то?`,
      },
      {
        id: `tnztmI`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`,
      },
    ],
    title: `Лучшие рок-музыканты 20-века`,
    category: [`Уход за собой`, `Семья`, `Музыка`],
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов.`,
    fullText: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Собрать камни бесконечности легко, если вы прирожденный герой. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Больше разнообразных строк в предложениях Это один из лучших рок-музыкантов.`,
    createdDate: `2021-11-15T21:25:16.857Z`,
  },
];

const createApi = () => {
  const app = express();
  app.use(express.json());
  const currentMockData = JSON.parse(JSON.stringify(mockData));

  articlesRouter(app, new ArticlesService(currentMockData));

  return app;
};

describe(`articlesRouter`, () => {
  describe(`GET /articles`, () => {
    const app = createApi();

    let response;

    beforeAll(async () => {
      response = await request(app).get(`/articles`);
    });

    test(`Returns status 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Contains 2 articles`, () => {
      expect(response.body.length).toBe(2);
    });
    test(`First article has id "7uDv8x"`, () => {
      expect(response.body[0].id).toBe(`7uDv8x`);
    });
  });

  describe(`GET /articles/:articleId`, () => {
    describe(`Should return correct article by id`, () => {
      const app = createApi();

      let response;

      beforeAll(async () => {
        response = await request(app).get(`/articles/7i3VHZ`);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HttpCode.OK);
      });
      test(`Article title is "Лучшие рок-музыканты 20-века"`, () => {
        expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, (done) => {
      const app = createApi();

      request(app).get(`/articles/randomId`).expect(HttpCode.NOT_FOUND).end(done);
    });
  });

  describe(`GET /articles/:articleId/comments`, () => {
    describe(`Should return list of comments for article`, () => {
      const app = createApi();

      let response;

      beforeAll(async () => {
        response = await request(app).get(`/articles/7uDv8x/comments`);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HttpCode.OK);
      });
      test(`Returns one comment`, () => {
        expect(response.body.length).toBe(1);
      });
      test(`Comment text is `, () => {
        expect(response.body[0].text).toBe(`Хочу такую же футболку :-)`);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, (done) => {
      const app = createApi();

      request(app).get(`/articles/randomId/comments`).expect(HttpCode.NOT_FOUND).end(done);
    });
  });

  describe(`DELETE /articles/:articleId`, () => {
    describe(`Should delete article by id`, () => {
      const app = createApi();

      let response;

      beforeAll(async () => {
        response = await request(app).delete(`/articles/7uDv8x`);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HttpCode.OK);
      });
      test(`Returns correct article`, () => {
        expect(response.body.id).toBe(`7uDv8x`);
      });

      test(`Articles count is 1 now`, (done) => {
        request(app)
          .get(`/articles`)
          .expect((res) => expect(res.body.length).toBe(1))
          .end(done);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, (done) => {
      const app = createApi();

      request(app).delete(`/articles/randomId`).expect(HttpCode.NOT_FOUND).end(done);
    });
  });

  describe(`POST /articles`, () => {
    describe(`Should create new article with correct data`, () => {
      const app = createApi();

      let response;

      const newArticle = {
        title: `title`,
        category: [`category`],
        announce: `announce`,
        fullText: `fullText`,
      };

      beforeAll(async () => {
        response = await request(app).post(`/articles`).send(newArticle);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HttpCode.CREATED);
      });
      test(`Returns created article`, () => {
        expect(response.body).toEqual(expect.objectContaining(newArticle));
      });
      test(`Articles count is changed`, (done) => {
        request(app)
          .get(`/articles`)
          .expect((res) => expect(res.body.length).toBe(3))
          .end(done);
      });
    });

    describe(`Refuses to create an article if data is invalid`, () => {
      const app = createApi();

      const newArticle = {
        title: `title`,
        category: [`category`],
        announce: `announce`,
      };

      test(`Without any required property response code is 400`, async () => {
        for (const key of Object.keys(newArticle)) {
          const badArticle = { ...newArticle };
          delete badArticle[key];

          await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
        }
      });
    });
  });

  describe(`PUT /:articleId`, () => {
    describe(`Changes an article`, () => {
      const app = createApi();

      let response;

      const newFieldsContent = {
        title: `title`,
        category: [`Работа`],
      };

      beforeAll(async () => {
        response = await request(app).put(`/articles/7uDv8x`).send(newFieldsContent);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HttpCode.OK);
      });
      test(`Returns changed article`, () => {
        expect(response.body).toEqual(expect.objectContaining(newFieldsContent));
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

    test(`Should return "not found error" if article with passed id doesn't exist`, (done) => {
      const app = createApi();

      request(app).put(`/articles/randomId`).send({}).expect(HttpCode.NOT_FOUND).end(done);
    });
  });

  describe(`DELETE /articles/:articleId/comments/:commentId`, () => {
    describe(`Should correctly delete a comment `, () => {
      const app = createApi();

      let response;

      beforeAll(async () => {
        response = await request(app).delete(`/articles/7uDv8x/comments/eJC--w`);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HttpCode.OK);
      });
      test(`Really delete comment`, (done) => {
        request(app)
          .get(`/articles`)
          .expect((res) => expect(res.body[0].comments).toEqual([]))
          .end(done);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, (done) => {
      const app = createApi();

      request(app).delete(`/articles/randomId/comments/commentId`).expect(HttpCode.NOT_FOUND).end(done);
    });

    test(`Should return "not found error" if comment with passed id doesn't exist`, (done) => {
      const app = createApi();

      request(app).delete(`/articles/7uDv8x/comments/commentId`).expect(HttpCode.NOT_FOUND).end(done);
    });
  });

  describe(`POST /articles/:articleId/comments`, () => {
    describe(`Should add new comment`, () => {
      const app = createApi();

      let response;

      const newComment = { text: `text` };

      beforeAll(async () => {
        response = await request(app).post(`/articles/7uDv8x/comments`).send(newComment);
      });

      test(`Returns status code 200`, () => {
        expect(response.statusCode).toBe(HttpCode.CREATED);
      });
      test(`Really add new comment`, (done) => {
        request(app)
          .get(`/articles/7uDv8x`)
          .expect((res) => expect(res.body.comments[1]).toEqual(expect.objectContaining(newComment)))
          .end(done);
      });
    });

    describe(`Should return "bad request" error with incorrect comment body`, () => {
      const app = createApi();

      const newIncorrectComment = {
        incorrectProperty: `incorrectProperty`,
      };

      test(`Returns 400`, (done) => {
        request(app).post(`/articles/7uDv8x/comments`).send(newIncorrectComment).expect(HttpCode.BAD_REQUEST).end(done);
      });
    });

    test(`Should return "not found error" if article with passed id doesn't exist`, (done) => {
      const app = createApi();

      request(app).post(`/articles/randomId/comments`).send({}).expect(HttpCode.NOT_FOUND).end(done);
    });
  });
});
