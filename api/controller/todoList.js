'use strict';
const TodoItem = require('../model/todoItem').model;
const {respond, removeDuplicatesFromArray } = require('./helpers');

const todoListController = {
  getAll: async (req, res, next) => {
    let filter = {};
    if(req.params.categoryId){
      filter = {
        categories: req.params.categoryId
      };
    }
    TodoItem.find(filter, (err, todoItems) => {
      return respond(err, todoItems, res, next);
    }).populate('categories');
  },
  create: (req, res, next) => {
    req.body.categories = removeDuplicatesFromArray(req.body.categories);
    const newTodoItem = new TodoItem(req.body);
    newTodoItem.save((err, savedTodoItem) => {
      return respond(err, savedTodoItem, res, next);
    });
  },
  get: (req, res, next) => {
    TodoItem.findById(req.params.id, (err, todoItem) => {
      return respond(err, todoItem, res, next);
    }).populate('categories');
  },
  update: (req, res, next) => {
    req.body.categories = removeDuplicatesFromArray(req.body.categories);
    TodoItem.findByIdAndUpdate(req.params.id, req.body,{
      runValidators: true, returnDocument: 'after'},
        (err, todoItem) => {
        return respond(err, todoItem, res, next);
    }).populate('categories');
  },
  delete: (req, res, next) => {
    TodoItem.findByIdAndRemove(req.params.id, (err, todoItem) => {
      return respond(err, todoItem, res, next);
    });
  }
};

module.exports = todoListController;
