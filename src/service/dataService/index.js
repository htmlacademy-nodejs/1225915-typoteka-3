'use strict';

const { ArticlesService } = require(`./articles`);
const { CategoriesService } = require(`./categories`);
const { SearchService } = require(`./search`);
const { CommentsService } = require(`./comments`);
const { UserService } = require(`./user`);

module.exports = {
  ArticlesService,
  CategoriesService,
  SearchService,
  CommentsService,
  UserService,
};
