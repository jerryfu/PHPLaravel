"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ac_set_1 = require("./ac_set");
exports.menudata = (state = [], action) => {
    switch (action.type) {
        case ac_set_1.ac.loadmenu:
            return action.data;
        case ac_set_1.ac.collapse_menu:
            return action.data;
        default:
            return state;
    }
};
