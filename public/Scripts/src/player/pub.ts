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
import update = require('react-addons-update');
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
export const setInputValue = (name, value) => {
    return {
        type: ac.chgFdlVal,
        name,
        value
    }
}
export const setQueryValue = (name, value) => {
    return {
        type: ac.chgQryVal,
        name,
        value
    }
}
export async function callLoad(p) {
    mask_show(lang.mk_loading);
    let pm: PBase = {};
    let data1 = await ft<ReturnData<GridInfo<server.Player>>>(ap.GET__api_Player, pm);
    let data2 = await ft<ReturnData<ReturnData<server.Team[]>>>(ap.GET__api_Team_Option, pm);
    mask_off();

    if (data1.state > 0)
        alert(data1.message);
    else
        return {
            type: ac.load,
            data: data1.data,
            exist: data1.exist,
            option_team: data2.data
        }
}
export async function callPage(p) {

    let pm = doWKPA(p);
    let data = await ft<ReturnData<GridInfo<server.Player>>>(ap.GET__api_Player, pm);
    mask_off();
    if (data.state > 0) {
        tosMessage(null, data.message, ToastrType.error);
        return;
    }
    else
        return {
            type: ac.load,
            data: data.data,
            exist: data.exist
        }
}
export async function callEdit(id) {

    mask_show(lang.mk_loading);
    let tm = { id };
    let pm = doWKPA(tm);
    let data = await ft<ReturnData<server.Player>>(ap.GET__api_Player_Item, pm);
    mask_off();
    if (data.state > 0) {
        alert(data.message);
        return;
    }
    return {
        type: ac.modify,
        data: data.data
    };
}
export async function callRemove(id, p) {

    mask_show(lang.mk_updating);
    let tm = { id };
    let pm = doWKPA(tm);
    let data = await ft<ReturnBase>(ap.POST__api_Player_Remove, pm);
    mask_off();
    if (data.state > 0) {
        tosMessage('', data.message, ToastrType.error);
    } else {
        tosMessage('', lang.fi_delete, ToastrType.success);
        return {
            type: ac.submitDel
        }
    }

}
export async function submitData(id: string | number, edit_type: IEditType, data: server.Player) {

    let tm = { id, md: data };
    let pm = doWKPA(tm);

    if (edit_type == IEditType.modify) {

        let data = await ft<ReturnUpdate<any>>(ap.POST__api_Player_Update, pm);
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
                dispatch({ type: ac.submitOK, field: tm.md });
            }
        }
    } else if (edit_type == IEditType.insert) {
        let data = await ft<ReturnUpdate<any>>(ap.POST__api_Player, pm);

        if (data.state == err_code.HasErrList) {
            let err_message = packegeErrList(data.err_list);
            tosMessage('', err_message, ToastrType.error)

        } else if (data.state > 0) {
            tosMessage('', data.message, ToastrType.error)
            //return dispatch => {
            //    dispatch({ type: ac.submitNot, field: data });
            //}
            return { type: ac.submitNot, field: tm.md };
        }
        else {
            tosMessage('更新資訊', lang.fi_insert, ToastrType.success);
            return dispatch => {
                dispatch(callEdit(data.id));
            }

            //return { type: ac.submitOK, field: data };
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
export const addState = () => {
    let r: { type: string, data: server.Player } = {
        type: ac.insert,
        data: { //新增值初始化
            player_id: 0
        }
    }
    return r;
}
//reduces
const page_grid = (state: GridInfo<server.Player> = { rows: [] }, action): GridInfo<server.Player> => {
    switch (action.type) {
        case ac.load:
            return action.data;
        case ac.page:
            return action.data;
        case ac.setpage:
            let struct = {
                page: { $set: 1 }
            };
            let n_state = update(state, struct);
            return n_state
        default:
            return state;
    }
}
const search = (state = {}, action) => {
    switch (action.type) {
        case ac.chgQryVal:

            let { name, value } = action;
            let struct = {
                [name]: { $set: value }
            };
            let n_state = update(state, struct);
            return n_state;
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
            return IEditType.modify;
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
const field = (state = {}, action): server.Player => {
    switch (action.type) {
        case ac.insert:
            return action.data
        case ac.modify:
            return action.data
        case ac.chgFdlVal:
            let { name, value } = action;

            let struct = {
                [name]: { $set: value }
            };
            let n_state = update(state, struct);
            return n_state;
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
const kfield = (state = {}, action): server.Player => {
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
        case ac.return:
            return guid();
        default:
            return state
    }
}
const option_team = (state = [], action) => {
    switch (action.type) {
        case ac.load:
            if (action.option_team)
                return action.option_team;
            else
                return state;
        default:
            return state
    }
}
/**
 * 觸發多重reducers
 * @param state
 * @param action
 */
function crossReducer(state, action) {
    console.log('Cross', state, action);
    switch (action.type) {
        case ac.chgQryVal:
            return Object.assign({}, state,
                {
                    page_grid: page_grid(state.page_grid, { type: ac.setpage }),
                });
        default:
            return state;
    }
}
export let store = cbnReduce({ menudata, oper_id, search, page_grid, edit_type, view_mode, field, kfield, exist, option_team }, crossReducer);