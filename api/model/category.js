'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = {
    name: 'Category',
};

Category.schema = new Schema({
    name: {type: String, required: true, unique: true, lowercase: true},
});

Category.model = mongoose.model(Category.name, Category.schema);

module.exports = Category;
