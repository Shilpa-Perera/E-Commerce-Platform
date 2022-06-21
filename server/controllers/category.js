const _ = require("lodash");
const { Category } = require("../models/Category");

class CategoryController {
    static async getAllCategories(req, res, next) {
        const allCategories = await Category.fetchAll();
        res.send(allCategories[0]);
    }

    static async getAllSubCategories(req, res, next) {
        const allSubCategories = await Category.getAllSubCategories();
        res.send(allSubCategories[0]);
    }

    static async getSubCategories(req, res, next) {
        const { id: category_id } = req.params;
        const sub_category = await Category.getSubCategories(category_id);
        res.send(sub_category);
    }

    static async getSubCategoriesToLink(req, res, next) {
        const { id: category_id } = req.params;
        const sub_category = await Category.getSubCategoriesToLink(category_id);
        res.send(sub_category);
    }

    static async addCategory(req, res, next) {
        const { new_category_name } = req.body;
        await Category.addCategory(new_category_name);
        res.send(new_category_name);
    }

    static async addSubCategory(req, res, next) {
        const { new_sub_category_name } = req.body;
        await Category.addSubCategory(new_sub_category_name);
        res.send(new_sub_category_name);
    }

    static async linkSubCategories(req, res, next) {
        const { category_id, sub_category_id } = req.body;
        await Category.linkSubCategories(category_id, sub_category_id);
        res.send(category_id, sub_category_id);
    }
}

module.exports.CategoryController = CategoryController;
