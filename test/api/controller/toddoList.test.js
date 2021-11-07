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
    console.log("Callback from", this.name, 'executing...');
    this.content = data;
    this.callback();
}

const dummyResponse = {
    name: 'DummyResponse',
    content: null,
    callback: null,
    json: (data) => dummyCallback(data),
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
    };
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

        it('should update the todo item stored on valid fields', (done)=> {
            const modifiedTodoData =  {
                name: "Make the test fail.",
                status: 'done', id: dummyTodoItem._id,
            };

            dummyResponse.callback = () => {
                TodoItem.findById(modifiedTodoData.id,(err, todoItem) => {
                    if(err) throw err;
                    assert.equal(modifiedTodoData.name, todoItem.name);
                    assert.equal(modifiedTodoData.status, todoItem.status);
                    assert.equal(modifiedTodoData.id.toString(), todoItem._id.toString());
                    done();
                });
            };

            todoListController.update(
                dummyRequest(modifiedTodoData),
                dummyResponse, dummyNext.next
            );
        });

        it('should return the updated todoItem on valid fields', (done) => {
            const modifiedTodoData =  {
                name: "Make the test fail AGAIN.",
                status: 'todo', id: dummyTodoItem._id,
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

        it('should pass any raised error through next function', (done) => {
            const randomTodoItem = {
                name: "Cancel the party.",
                status: 'impossible', id: dummyTodoItem._id,
            };
            mongoose.disconnect();

            dummyNext.callback = () => {
                assert.equal(true, dummyNext.content instanceof Error);
                assert.equal(400, dummyNext.content.status);
                mongoose.connect('mongodb://127.0.0.1:27017/TodoListDB', {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                }).then(() => done());
            };

            todoListController.update(
                dummyRequest(randomTodoItem),
                dummyResponse, dummyNext.next
            );
        });

        it('should set a 400 status on a error through next function object if a field has an invalid value',
            (done) => {
                const wrongTodoItem = {
                    name: "Make the app crash for good.",
                    status: 'neverhappening', id: dummyTodoItem._id,
                };

                dummyNext.callback = () => {
                    assert.equal(true, dummyNext.content instanceof Error);
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
