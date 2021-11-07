'use strict';
(async () => {
    const app = await require('../../../index');
})();

const assert = require('assert');
const mongoose = require('mongoose');

const todoListController = require('../../../api/controller/todoList');
const todoItem = require('../../../api/model/todoItem');

const TodoItem = mongoose.model('TodoItem', todoItem);

const dummyCallback = function(data){
    console.log("Callback from", this.name);
    this.content = data;
    this.callback();
}

const dummyResponse = {
    name: 'DummyResponse',
    content: null,
    callback: null,
    json: (data) => dummyCallback.call(dummyResponse, data),
};

const dummyNext = {
    name: 'DummyNext',
    content: null,
    callback: null,
    next: (data) => dummyCallback.call(dummyNext, data),
};

const dummyRequest = ({name, status, id}) => {
    return {
        body: {name, status},
        params: {id},
    }
};

describe('TodoList Controller', function() {

    describe('update', function () {
        let dummyTodoItem = null;

        before(async () => {
            let newTodo = new TodoItem({
                name: 'Test the TodoList Controller',
            });
            dummyTodoItem = await newTodo.save();
            console.log(`Created dummy TodoItem`, dummyTodoItem);
        });

        after((done) => {
            TodoItem.findByIdAndRemove(dummyTodoItem._id, (err, todoItem) => {
                if(err) throw err;
                console.log(`Dummy TodoItem deleted`, todoItem);
                done();
            });
        });

        beforeEach((done) => {
            dummyResponse.content = null;
            dummyResponse.callback = null;
            dummyNext.content = null;
            dummyNext.callback = null;
            TodoItem.findById(dummyTodoItem._id,(err, todoItem) => {
                if(err) throw err;
                dummyTodoItem = todoItem;
                done();
            });
        });

        it('should update the fields of the todo item stored', (done)=> {
            const modifiedTodoData =  {
                name: "Make the test fail.",
                status: 'done', id: dummyTodoItem._id,
            };
            dummyResponse.callback = () => {
                assert.equal(modifiedTodoData.name, dummyResponse.content.name);
                assert.equal(modifiedTodoData.status, dummyResponse.content.status);
                assert.equal(modifiedTodoData.id.toString(), dummyResponse.content._id.toString());
                done();
            };

            todoListController.update(
                dummyRequest(modifiedTodoData),
                dummyResponse, dummyNext.next
            );
        });

        it('should set a 400 status if a ValidationError is raised', (done) => {
            const wrongTodoItem = {
                name: "Make the test fail.",
                status: 'notAtAll', id: dummyTodoItem._id,
            };

            dummyNext.callback = () => {
                assert.equal(400, dummyNext.content.status);
                done();
            }

            todoListController.update(
                dummyRequest(wrongTodoItem),
                dummyResponse, dummyNext.next
            );

        });
    });
});
