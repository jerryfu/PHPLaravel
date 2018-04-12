/**
    系統名稱:資料維護
    檔案內容:共用設定
    2017-03-31  Jerry   建立
*/
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
    chgFdlVal: 'chgFdlVal',

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
export async function callLoad(p) {
    mask_show(lang.mk_loading);
    let pm: PBase = {};
    let data = await ft<ReturnData<server.ParamFooter>>(ap.GET__api_Footer, pm);

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
export async function submitData(edit_type: IEditType, md: server.ParamFooter) {

    let tm = { md };
    let pm = doWKPA(tm);

    let data = await ft<ReturnUpdate<any>>(ap.POST__api_Footer, md);
    if (data.state == err_code.HasErrList) {
        let err_message = packegeErrList(data.err_list);
        tosMessage('', err_message, ToastrType.error)
        //return;
    } else if (data.state > 0) {
        alert(data.message);
    }
    else {
        tosMessage('', lang.fi_update, ToastrType.success)
        return dispatch => {
            dispatch({ type: ac.submitOK, field: md });
        }
    }
}
export const cancel = (field) => {

    //.log('Check field', field);

    return {
        type: ac.cancel,
        field
    }
}
//reduces
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
const field = (state = {}, action): server.ParamFooter => {
    switch (action.type) {
        case ac.load:
            return action.data
        case ac.chgFdlVal:
            return action.field;
        case ac.cancel:
            return action.field;
        default:
            return state
    }
}
const kfield = (state = {}, action): server.ParamFooter => {
    switch (action.type) {
        case ac.load:
            return action.data
        case ac.submitOK:
            return action.field;
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
        default:
            return state
    }
}

export let store = cbnReduce({ menudata, oper_id, edit_type, view_mode, field, kfield, exist });