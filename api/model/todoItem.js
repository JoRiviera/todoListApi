'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategoryName = require('./category').name;

const TodoItem = {
    name: "TodoItem",
}

TodoItem.schema = new Schema({
    name: {type: String, required: true},
    status: {type: String, enum: ['todo', 'inProgress', 'done'], default: 'todo', required: true},
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: CategoryName,
        },
    ]
  },
  {timestamps: true}
);

TodoItem.model = mongoose.model('TodoItemModel', TodoItem.schema);

module.exports = TodoItem;
