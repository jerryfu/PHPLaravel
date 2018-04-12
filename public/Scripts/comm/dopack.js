"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doWKPA = (obj) => {
    let r = {
        device: 'W',
        account: account
    };
    let m = null;
    if (obj != undefined && obj != null) {
        m = extend({}, r, obj);
    }
    else {
        m = r;
    }
    return m;
};
function extend(...target) {
    let sources = [].slice.call(arguments, 1);
    let newobj = {};
    sources.forEach(function (source) {
        for (var prop in source) {
            newobj[prop] = source[prop];
        }
    });
    return newobj;
}
