'use strict';
const CategoryModel = require('../model/category').model;
const { respond } = require('./helpers');

const categoryController = {
    getAll: (req, res, next) => {
        CategoryModel.find({}, (err, categories) => {
            return respond(err, categories, res, next);
        });
    },
    create: (req, res, next) => {
        const newCategoryItem = new CategoryModel(req.body);
        newCategoryItem.save((err, savedCategoryItem) => {
            return respond(err, savedCategoryItem, res, next);
        });
    },
    get: (req, res, next) => {
        CategoryModel.findById(req.params.id, (err, categoryItem) => {
            return respond(err, categoryItem, res, next);
        });
    },
    update: (req, res, next) => {
        CategoryModel.findByIdAndUpdate(req.params.id, req.body,{
                runValidators: true, returnDocument: 'after'},
            (err, categoryItem) => {
                return respond(err, categoryItem, res, next);
            });
    },
    delete: (req, res, next) => {
        CategoryModel.findByIdAndRemove(req.params.id, (err, categoryItem) => {
            return respond(err, categoryItem, res, next);
        });
    }
};

module.exports = categoryController;
