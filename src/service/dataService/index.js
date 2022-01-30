'use strict';

const { ArticlesService } = require(`./articles`);
const { CategoriesService } = require(`./categories`);
const { SearchService } = require(`./search`);
const { CommentsService } = require(`./comments`);

module.exports = {
  ArticlesService,
  CategoriesService,
  SearchService,
  CommentsService,
};
