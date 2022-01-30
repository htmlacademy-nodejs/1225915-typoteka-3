INSERT INTO categories(title) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо'),
('Работа'),
('Семья'),
('Уход за собой');

INSERT INTO roles(title) VALUES
('admin'),
('reader');

ALTER TABLE users DISABLE TRIGGER ALL;
INSERT INTO users(email, firstname, lastname, avatar, role_id) VALUES
('ivanov@example.com', 'Иван', 'Иванов', 'avatar1.jpg', 1),
('petrov@example.com', 'Пётр', 'Петров', 'avatar2.jpg', 2);
ALTER TABLE users ENABLE TRIGGER ALL;

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, author_id) VALUES
('Ёлки. История деревьев', 'Ёлки — это не просто красивое дерево.', 'Ёлки — это не просто красивое дерево. Это прочная древесина.', 1),
('Как перестать беспокоиться и начать жить', 'Первая большая ёлка была установлена только в 1938 году.', 'Вы можете достичь всего. Стоит только немного постараться и запастись книгами.', 1),
('Как достигнуть успеха не вставая с кресла', 'Освоить вёрстку несложно.', 'Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.', 1);
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, article_id, author_id) VALUES
('Это где ж такие красоты?', 1, 1),
('Совсем немного...', 1, 2),
('Согласен с автором!', 2, 1),
('Мне кажется или я уже читал это где-то?', 2, 2),
('Мне не нравится ваш стиль. Ощущение что вы меня поучаете.', 3, 1),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 3, 2);
ALTER TABLE comments ENABLE TRIGGER ALL;

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
(1, 4),
(2, 5),
(3, 6);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
