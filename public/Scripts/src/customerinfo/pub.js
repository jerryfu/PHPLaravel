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
const api_1 = require("../../comm/api");
const defData_1 = require("../../comm/defData");
const vwMaskLoading_1 = require("../../comm/vwMaskLoading");
const dopack_1 = require("../../comm/dopack");
const reducers_1 = require("../inc/reducers");
const cbnReduce_1 = require("../inc/cbnReduce");
require("babel-polyfill");
exports.ac = {
    empty: 'empty',
    load: 'load',
    chgFdlVal: 'chgFdlVal',
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
function callLoad(p) {
    return __awaiter(this, void 0, void 0, function* () {
        vwMaskLoading_1.mask_show(lang.mk_loading);
        let pm = {};
        let data = yield ajax_1.ft(api_1.default.GET__api_CustomerInfo, pm);
        vwMaskLoading_1.mask_off();
        if (data.state > 0)
            alert(data.message);
        else
            return {
                type: exports.ac.load,
                data: data.data,
                exist: data.exist
            };
    });
}
exports.callLoad = callLoad;
function submitData(edit_type, md) {
    return __awaiter(this, void 0, void 0, function* () {
        let tm = { md };
        let pm = dopack_1.doWKPA(tm);
        let data = yield ajax_1.ft(api_1.default.POST__api_CustomerInfo, md);
        if (data.state == defData_1.err_code.HasErrList) {
            let err_message = comm_func_1.packegeErrList(data.err_list);
            comm_func_1.tosMessage('', err_message, 3);
        }
        else if (data.state > 0) {
            alert(data.message);
        }
        else {
            comm_func_1.tosMessage('', lang.fi_update, 1);
            return dispatch => {
                dispatch({ type: exports.ac.submitOK, field: md });
            };
        }
    });
}
exports.submitData = submitData;
exports.cancel = (field) => {
    return {
        type: exports.ac.cancel,
        field
    };
};
const edit_type = (state = 0, action) => {
    switch (action.type) {
        case exports.ac.insert:
            return 1;
        case exports.ac.modify:
            return 2;
        case exports.ac.submitOK:
            return 0;
        case exports.ac.return:
            return 0;
        default:
            return state;
    }
};
const view_mode = (state = 1, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
const field = (state = {}, action) => {
    switch (action.type) {
        case exports.ac.load:
            return action.data;
        case exports.ac.chgFdlVal:
            return action.field;
        case exports.ac.cancel:
            return action.field;
        default:
            return state;
    }
};
const kfield = (state = {}, action) => {
    switch (action.type) {
        case exports.ac.load:
            return action.data;
        case exports.ac.submitOK:
            return action.field;
        default:
            return state;
    }
};
const exist = (state = false, action) => {
    switch (action.type) {
        case exports.ac.load:
            return action.exist;
        case exports.ac.submitOK:
            return true;
        default:
            return state;
    }
};
const oper_id = (state = comm_func_1.guid(), action) => {
    switch (action.type) {
        case exports.ac.submitOK:
            return comm_func_1.guid();
        case exports.ac.submitDel:
            return comm_func_1.guid();
        default:
            return state;
    }
};
exports.store = cbnReduce_1.default({ menudata: reducers_1.menudata, oper_id, edit_type, view_mode, field, kfield, exist });
