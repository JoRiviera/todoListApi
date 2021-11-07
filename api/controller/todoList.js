'use strict';
const todoItem = require('../model/todoItem');
const mongoose = require('mongoose');
const TodoItem = mongoose.model('TodoItem', todoItem);

function respond(err, result, res, next) {
  if (err) {
    if(err instanceof mongoose.Error.ValidationError){
      err.status = 400;
    }
    return next(err);
  }
  return res.json(result);
}

const todoListController = {
  getAll: (req, res, next) => {
    TodoItem.find({}, (err, todoItems) => {
      return respond(err, todoItems, res, next);
    });
  },
  create: (req, res, next) => {
    const newTodoItem = new TodoItem(req.body);
    newTodoItem.save((err, savedTodoItem) => {
      return respond(err, savedTodoItem, res, next);
    });
  },
  get: (req, res, next) => {
    TodoItem.findById(req.params.id, (err, todoItem) => {
      return respond(err, todoItem, res, next);
    });
  },
  update: (req, res, next) => {
    TodoItem.findByIdAndUpdate(req.params.id, req.body,{
      runValidators: true, returnDocument: 'after'},
        (err, todoItem) => {
        return respond(err, todoItem, res, next);
    });
  },
  delete: (req, res, next) => {
    TodoItem.findByIdAndRemove(req.params.id, (err, todoItem) => {
      return respond(err, todoItem, res, next);
    });
  }
};

module.exports = todoListController;
