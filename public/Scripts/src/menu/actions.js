"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pub_1 = require("./pub");
require("babel-polyfill");
exports.setInputValue = (field) => {
    return {
        type: pub_1.ac.chgFdlVal,
        field
    };
};
exports.setQueryValue = (search) => {
    return {
        type: pub_1.ac.chgQryVal,
        search
    };
};
