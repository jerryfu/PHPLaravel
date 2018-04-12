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

export interface chgPW {
    OldPassword?: string;
    NewPassword?: string;
    ConfirmPassword?: string;
}

//action
export const setInputValue = (field) => {
    return {
        type: ac.chgFdlVal,
        field
    }
}
export async function submitData(data: chgPW) {
    let post_chgpw: ApiPathStruct = { key: 'POST__api_chgPW_Update', path: 'Base/Func/MasterPwUpdate', method: 'POST', desc: '' };
    console.log('hello');
    let res = await ft<ReturnUpdate<any>>(post_chgpw, { md: data });
    if (res.state == err_code.HasErrList) {
        let err_message = packegeErrList(res.err_list);
        tosMessage('', err_message, ToastrType.error)
        //return;
    } else if (res.state > 0) {
        alert(res.message);
    }
    else {
        tosMessage('', lang.fi_update, ToastrType.success)
        return dispatch => {
            dispatch({ type: ac.submitOK, field: data });
        }
    }

}


//reduces
const field = (state = {}, action) => {
    switch (action.type) {
        case ac.insert:
            return action.data
        case ac.modify:
            return action.data
        case ac.chgFdlVal:
            return action.field;
        case ac.submitOK:
            return action.field;
        case ac.cancel:
            return action.field;
        case ac.return:
            return {};
        default:
            return state
    }
}
const kfield = (state = {}, action) => {
    switch (action.type) {
        case ac.insert:
            return action.data;
        case ac.modify:
            return action.data
        case ac.submitOK:
            return action.field;
        default:
            return state
    }
}

export let store = cbnReduce({ menudata, field, kfield });