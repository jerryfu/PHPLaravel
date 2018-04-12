"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajax_1 = require("../../comm/ajax");
exports.CartProxy = {
    Set: function (product_id, qty) {
        return ajax_1.fetchPost(gb_approot + 'Cart/Add', { id: product_id, qty });
    },
    Info: function () {
        return ajax_1.fetchGet(gb_approot + 'Cart/Info', {});
    },
    Del: function (product_id) {
        return ajax_1.fetchGet(gb_approot + 'Cart/Del', { product_id: product_id });
    },
    Check: function () {
        return ajax_1.fetchGet(gb_approot + 'Cart/Check', {});
    },
    Submit: function (data) {
        return ajax_1.fetchPost(gb_approot + 'Cart/Submit', { master: data });
    }
};
exports.MemberProxy = {
    Regist: function (data) {
        return ajax_1.fetchPost(gb_approot + 'Member/Register', data);
    },
    Login: function (data) {
        return ajax_1.fetchPost(gb_approot + 'Member/loginCheck', data);
    }
};
