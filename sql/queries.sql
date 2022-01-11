-- get all categories
SELECT * FROM categories;


-- get categories with publications
SELECT
  articles_categories.category_id,
  categories.title
FROM
  articles_categories
INNER JOIN
  categories
ON articles_categories.category_id = categories.id
GROUP BY
  articles_categories.category_id,
  categories.title;


--get categories with publications and count of articles in categories
SELECT
  articles_categories.category_id,
  categories.title,
  count(articles_categories.category_id) AS "articles_count"
FROM
  articles_categories
INNER JOIN
  categories
ON articles_categories.category_id = categories.id
GROUP BY
  articles_categories.category_id,
  categories.title;


-- get articles list
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.created,
  users.firstname,
  users.lastname,
  users.email,
  count(comments.id) AS "comments_count",
  STRING_AGG(DISTINCT categories.title, ', ') AS category_list
FROM
  articles
LEFT JOIN users ON articles.author_id = users.id
LEFT JOIN comments ON articles.id = comments.article_id
LEFT JOIN articles_categories ON articles_categories.article_id = articles.id
LEFT JOIN categories ON articles_categories.category_id = categories.id
GROUP BY
  articles.id, users.id
ORDER BY
  articles.created DESC;


-- get full information for certain article
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.full_text,
  articles.created,
  articles.image,
  users.firstname,
  users.lastname,
  users.email,
  count(comments.id) AS "comments_count",
  STRING_AGG(DISTINCT categories.title, ', ') AS category_list
FROM
  articles
LEFT JOIN users ON articles.author_id = users.id
LEFT JOIN comments ON articles.id = comments.article_id
LEFT JOIN articles_categories ON articles_categories.article_id = articles.id
LEFT JOIN categories ON articles_categories.category_id = categories.id
WHERE articles.id = 2
GROUP BY
  articles.id, users.id;


-- get last 5 comments
SELECT
  comments.id,
  comments.article_id,
  concat(users.firstname, ' ', users.lastname) AS "author",
  comments.text
FROM
  comments
LEFT JOIN
  users
ON comments.author_id = users.id
ORDER BY comments.created DESC
LIMIT 5;


-- get comments for first article
SELECT
  comments.id,
  comments.article_id,
  concat(users.firstname, ' ', users.lastname) AS "author",
  comments.text
FROM
  comments
LEFT JOIN
  users
ON comments.author_id = users.id
WHERE comments.article_id = 1
ORDER BY comments.created DESC;


-- update article title
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
