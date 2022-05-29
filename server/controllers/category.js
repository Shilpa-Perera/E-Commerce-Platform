const _ = require("lodash");
const { Category } = require("../models/Category");

class CategoryController {
  static async getAllCategories(req, res, next) {
    const allCategories = await Category.fetchAll();
    res.send(allCategories[0]);
  }

  static async getSubCategories(req, res, next) {
    const { id: category_id } = req.params;
    const sub_category = await Category.getSubCategories(category_id);

    // if (!sub_category)
    //   return res.status(404).send("The given category ID is invalid");

    res.send(sub_category);
  }

  static async addCategory(req, res, next) {
    const { new_category_name } = req.body;
    await Category.addCategory(new_category_name);
    res.send(new_category_name);
  }
}

module.exports.CategoryController = CategoryController;
