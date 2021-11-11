'use strict';
const Category = require('../model/category').model;
const TodoItem = require('../model/todoItem').model;
const { respond } = require('./helpers');

const categoryController = {
    getAll: (req, res, next) => {
        Category.find({}, (err, categories) => {
            return respond(err, categories, res, next);
        });
    },
    create: (req, res, next) => {
        const newCategoryItem = new Category(req.body);
        newCategoryItem.save((err, savedCategoryItem) => {
            return respond(err, savedCategoryItem, res, next);
        });
    },
    get: (req, res, next) => {
        Category.findById(req.params.id, (err, categoryItem) => {
            return respond(err, categoryItem, res, next);
        });
    },
    update: (req, res, next) => {
        Category.findByIdAndUpdate(req.params.id, req.body,{
                runValidators: true, returnDocument: 'after'},
            (err, categoryItem) => {
                return respond(err, categoryItem, res, next);
            });
    },
    delete: (req, res, next) => {
        Category.findByIdAndRemove(req.params.id, (err, categoryItem) => {
            TodoItem.updateMany({categories: {$all: req.params.id}},
                {$pull: {categories: req.params.id}}, (err) => {
                    return respond(err, categoryItem, res, next);
                });
        });
    }
};

module.exports = categoryController;
