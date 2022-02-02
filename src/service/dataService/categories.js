'use strict';

const { fn, col } = require(`sequelize`);

class CategoriesService {
  constructor(sequelize) {
    this._Category = sequelize.models.category;
    this._ArticleCategory = sequelize.models.article_category;
  }

  async getAllCategories(withCount) {
    if (withCount) {
      const categories = await this._Category.findAll({
        attributes: ['id', 'title', [fn(`COUNT`, `*`), 'articles_in_category']],
        group: [col('category.id')],
        include: [
          {
            model: this._ArticleCategory,
            attributes: [],
          },
        ],
      });

      return categories.map((category) => category.get());
    } else {
      return this._Category.findAll({ raw: true });
    }
  }
}

module.exports = {
  CategoriesService,
};
