"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const react_redux_1 = require("react-redux");
const ajax_1 = require("../../comm/ajax");
const api_1 = require("../../comm/api");
const actions_1 = require("./actions");
const Masterlayout_1 = require("./Masterlayout");
function AddMasterMenu(ContextObject, store, menu_id = 0) {
    ajax_1.ft(api_1.default.GET__api_Menu_GetByLogin, { menu_id: menu_id }).then((data) => {
        var dom = document.getElementById('page_content');
        react_dom_1.render(React.createElement(react_redux_1.Provider, { store: store },
            React.createElement(Masterlayout_1.default, null,
                React.createElement(ContextObject, null))), dom);
        store.dispatch(actions_1.callLoadMenu(data.data));
    });
}
exports.AddMasterMenu = AddMasterMenu;
