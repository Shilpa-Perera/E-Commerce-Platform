const db = require("../util/database");
const dotenv = require("dotenv");
dotenv.config();

class Category {
  //   constructor(categoryDetails) {
  //     this.category_id = categoryDetails.category_id;
  //     this.category_name = categoryDetails.category_name;
  //   }

  static fetchAll() {
    const select_all_query = "select * from category";
    return db.execute(select_all_query);
  }

  static async getAllSubCategories() {
    const get_all_sub_categories_query =
      "select * from category_link natural join sub_category";
    const [all_sub_categories, _] = await db.execute(
      get_all_sub_categories_query
    );

    if (all_sub_categories.length > 0) {
      return all_sub_categories;
    }

    return false;
  }

  static async getSubCategories(categoryId) {
    const get_sub_categories_query =
      "select * from category_link natural join sub_category where category_id=?";
    const [sub_categories, _] = await db.execute(get_sub_categories_query, [
      categoryId,
    ]);

    if (sub_categories.length > 0) {
      return sub_categories;
    }

    return false;
  }

  static async addCategory(categoryName) {
    const insert_add_category_query =
      "insert into category (category_name) values (?)";
    const result = await db.execute(insert_add_category_query, [categoryName]);
  }

  static async addSubCategory(subCategoryName) {
    const insert_add_sub_category_query =
      "insert into sub_category (sub_category_name) values (?)";
    const result = await db.execute(insert_add_sub_category_query, [
      subCategoryName,
    ]);
  }
}

module.exports.Category = Category;
