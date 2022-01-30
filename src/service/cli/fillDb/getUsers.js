const getUsers = () => [
  {
    email: 'ivanov@example.com',
    firstname: 'Иван',
    lastname: 'Иванов',
    role: { title: 'admin' },
  },
  {
    email: 'petrov@example.com',
    firstname: 'Пётр',
    lastname: 'Петров',
    role: { title: 'reader' },
  },
];

module.exports = {
  getUsers,
};
