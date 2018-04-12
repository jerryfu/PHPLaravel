"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajax_1 = require("../../comm/ajax");
const comm_func_1 = require("../../comm/comm-func");
const defData_1 = require("../../comm/defData");
const reducers_1 = require("../inc/reducers");
const cbnReduce_1 = require("../inc/cbnReduce");
require("babel-polyfill");
exports.ac = {
    empty: 'empty',
    load: 'load',
    page: 'page',
    setpage: 'setpage',
    chgFdlVal: 'chgFdlVal',
    chgQryVal: 'chgQryVal',
    submitOK: 'submitOK',
    submitNot: 'submitNot',
    submitDel: 'submitDel',
    cancel: 'cancel',
    modify: 'modify',
    insert: 'insert',
    return: 'return'
};
exports.setInputValue = (field) => {
    return {
        type: exports.ac.chgFdlVal,
        field
    };
};
function submitData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let post_chgpw = { key: 'POST__api_chgPW_Update', path: 'Base/Func/MasterPwUpdate', method: 'POST', desc: '' };
        console.log('hello');
        let res = yield ajax_1.ft(post_chgpw, { md: data });
        if (res.state == defData_1.err_code.HasErrList) {
            let err_message = comm_func_1.packegeErrList(res.err_list);
            comm_func_1.tosMessage('', err_message, 3);
        }
        else if (res.state > 0) {
            alert(res.message);
        }
        else {
            comm_func_1.tosMessage('', lang.fi_update, 1);
            return dispatch => {
                dispatch({ type: exports.ac.submitOK, field: data });
            };
        }
    });
}
exports.submitData = submitData;
const field = (state = {}, action) => {
    switch (action.type) {
        case exports.ac.insert:
            return action.data;
        case exports.ac.modify:
            return action.data;
        case exports.ac.chgFdlVal:
            return action.field;
        case exports.ac.submitOK:
            return action.field;
        case exports.ac.cancel:
            return action.field;
        case exports.ac.return:
            return {};
        default:
            return state;
    }
};
const kfield = (state = {}, action) => {
    switch (action.type) {
        case exports.ac.insert:
            return action.data;
        case exports.ac.modify:
            return action.data;
        case exports.ac.submitOK:
            return action.field;
        default:
            return state;
    }
};
exports.store = cbnReduce_1.default({ menudata: reducers_1.menudata, field, kfield });
