"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const redux_async_await_1 = require("redux-async-await");
const redux_thunk_1 = require("redux-thunk");
function cbnReduce(obj, cross_reduces = null) {
    function logger({ getState }) {
        return (next) => (action) => {
            let returnValue = next(action);
            return returnValue;
        };
    }
    let getCombineReducers = redux_1.combineReducers(obj);
    function rootReducer(state, action) {
        let tempstate = getCombineReducers(state, action), finalstate = cross_reduces(tempstate, action);
        return finalstate;
    }
    var st = cross_reduces == null ?
        redux_1.createStore(getCombineReducers, redux_1.applyMiddleware(redux_thunk_1.default, redux_async_await_1.default, logger)) :
        redux_1.createStore(rootReducer, redux_1.applyMiddleware(redux_thunk_1.default, redux_async_await_1.default, logger));
    return st;
}
exports.default = cbnReduce;
