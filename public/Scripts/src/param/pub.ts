import { ft } from '../../comm/ajax';
import { guid, tosMessage, packegeErrList } from '../../comm/comm-func';
import ap from '../../comm/api';
import { err_code } from '../../comm/defData';
import { mask_show, mask_off } from '../../comm/vwMaskLoading';
import { doWKPA } from '../../comm/dopack'
import { menudata } from '../inc/reducers';
import { bindActionCreators } from 'redux';
import cbnReduce from '../inc/cbnReduce'
import "babel-polyfill";

export const ac = {
    empty: 'empty', //空的 store不可使用
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
}

//action
export const setInputValue = (field) => {
    return {
        type: ac.chgFdlVal,
        field
    }
}
export const setQueryValue = (search) => {
    return {
        type: ac.chgQryVal,
        search
    }
}
export async function callLoad(p) {
    mask_show(lang.mk_loading);
    let pm: PBase = {};
    let data = await ft<ReturnData<DotWeb.WebApp.Models.JsonWebParam.WebParam[]>>(ap.GET__api_Param, pm);

    mask_off();
    if (data.state > 0)
        alert(data.message);
    else
        return {
            type: ac.load,
            data: data.data,
            exist: data.exist
        }
}

export async function submitData(data) {

    let tm = { md: data };
    let pm = doWKPA(tm);
    console.log(data, tm)
    let result = await ft<ReturnUpdate<any>>(ap.POST__api_Param, pm);

    if (result.state == err_code.HasErrList) {
        let err_message = packegeErrList(result.err_list);
        tosMessage('', err_message, ToastrType.error)
    } else if (result.state > 0) {
        alert(result.message);
    }
    else {
        tosMessage('', lang.fi_update, ToastrType.success)
        return dispatch => {
            dispatch({ type: ac.submitOK, field: result });
        }
    }
}
export const cancel = (field) => {
    return {
        type: ac.cancel,
        field
    }
}
export const returnGrid = () => {
    return {
        type: ac.return
    }
}

export const setPage = (data) => {
    let r = {
        type: ac.setpage,
        data
    }
    return r;
}

//reduces
const web_param = (state: DotWeb.WebApp.Models.JsonWebParam.WebParam[] = [], action): DotWeb.WebApp.Models.JsonWebParam.WebParam[] => {
    switch (action.type) {
        case ac.load:
            return action.data;
        case ac.chgFdlVal:
            return action.field;
        default:
            return state;
    }
}
const search = (state = {}, action) => {
    switch (action.type) {
        case ac.chgQryVal:
            return action.search;
        default:
            return state;
    }
}
const edit_type = (state = IEditType.none, action): IEditType => {
    switch (action.type) {
        case ac.insert:
            return IEditType.insert;
        case ac.modify:
            return IEditType.modify;
        case ac.submitOK:
            return IEditType.none;
        case ac.return:
            return IEditType.none;
        default:
            return state;
    }
}
const view_mode = (state = InputViewMode.edit, action): InputViewMode => {
    switch (action.type) {
        default:
            return state
    }
}

const exist = (state = false, action) => {
    switch (action.type) {
        case ac.load:
            return action.exist;
        case ac.submitOK:
            return true;
        default:
            return state
    }
}
const oper_id = (state = guid(), action) => {
    switch (action.type) {
        case ac.submitOK:
            return guid();
        case ac.submitDel:
            return guid();
        case ac.chgQryVal: //自動查詢
            return guid();
        default:
            return state
    }
}

export let store = cbnReduce({ menudata, oper_id, search, web_param, edit_type, view_mode, exist });