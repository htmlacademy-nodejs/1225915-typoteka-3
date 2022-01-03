DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS articles_comments;
DROP TABLE IF EXISTS articles_categories;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR (100) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR (50) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR (100) NOT NULL,
  lastname VARCHAR (100) NOT NULL,
  avatar VARCHAR (150) UNIQUE,
  email VARCHAR (250) NOT NULL UNIQUE,
  role INTEGER NOT NULL,
  FOREIGN KEY (role) REFERENCES roles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR (100) NOT NULL,
  announce VARCHAR (100) NOT NULL,
  full_text TEXT NOT NULL,
  created TIMESTAMP DEFAULT current_timestamp,
  author_id INTEGER NOT NULL,
  image VARCHAR(150)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  text VARCHAR (500) NOT NULL,
  article_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  created TIMESTAMP DEFAULT current_timestamp,
  FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE articles_categories (
  article_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
