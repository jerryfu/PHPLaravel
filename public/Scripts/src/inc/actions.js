"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ac_set_1 = require("./ac_set");
require("babel-polyfill");
exports.callLoadMenu = (data) => {
    return {
        type: ac_set_1.ac.loadmenu,
        data
    };
};
