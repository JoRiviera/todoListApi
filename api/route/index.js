'use strict';
const todoListController = require('../controller/todoList');
const categoryController = require('../controller/categoryList');

module.exports = (app) => {
  app.route('/todoitems').get(todoListController.getAll);
  app.route('/todoitems').post(todoListController.create);
  app.route('/todoitems/:id').get(todoListController.get);
  app.route('/todoitems/:id').put(todoListController.update);
  app.route('/todoitems/:id').delete(todoListController.delete);

  app.route('/categories').get(categoryController.getAll);
  app.route('/categories').post(categoryController.create);
  app.route('/categories/:id').get(categoryController.get);
  app.route('/categories/:id').put(categoryController.update);
  app.route('/categories/:id').delete(categoryController.delete);

  app.use((req, res, next) => {
    next({status: 404, message: 'Invalid Path or Method'})
  });

  app.use(({status, message}, req, res, next) => {
    const respStatus = status || 500;
    const method = req.method.toUpperCase();
    const url = req.originalUrl.toLowerCase();

    let log = `****** ERROR ${respStatus} ******\n` ;
    log += `On ${method} ${url}\n`;
    log += message || '';
    console.log(log);
    res.status(respStatus).send({
      error: message,
      url, method,
    });
  });
};
