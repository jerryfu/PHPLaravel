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
import update = require('react-addons-update');

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
    return: 'return',
    loadRecord: 'loadRecord',
    addRecord: 'addRecord',
    chgRecord: 'chgRecord',
    addPlayerToSchedule: 'addPlayerToSchedule'

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
    let data1 = await ft<ReturnData<GridInfo<server.Schedule>>>(ap.GET__api_Schedule, pm);
    let data2 = await ft<PackOption>(ap.POST__api_Schedule_PackOption, {});
    mask_off();
    if (data1.state > 0)
        alert(data1.message);
    else
        return {
            type: ac.load,
            data: data1.data,
            exist: data1.exist,
            pack_option: data2
        }
}
export async function callPage(p) {

    let pm = doWKPA(p);
    let data = await ft<ReturnData<GridInfo<server.Schedule>>>(ap.GET__api_Schedule, pm);
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
    let data = await ft<ReturnData<server.Schedule>>(ap.GET__api_Schedule_Item, pm);
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
    let data = await ft<ReturnBase>(ap.POST__api_Schedule_Remove, pm);
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
export async function submitData(id: string | number, edit_type: IEditType, data: server.Schedule) {

    let tm = { id, md: data };
    let pm = doWKPA(tm);

    if (edit_type == IEditType.modify) {

        let data = await ft<ReturnUpdate<any>>(ap.POST__api_Schedule_Update, pm);
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
        let data = await ft<ReturnUpdate<any>>(ap.POST__api_Schedule, pm);

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
                dispatch(callEdit(data.id))
            }

            //return { type: ac.submitOK, field: tm.md };
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
    let r: { type: string, data: server.Schedule } = {
        type: ac.insert,
        data: { //新增值初始化
            schedule_id: 0,
            play_name_id: 0
        }
    }
    return r;
}
export const setPage = (data) => {
    let r = {
        type: ac.setpage,
        data
    }
    return r;
}
export async function loadRecord(schedule_id: number) {
    let pm: PBase = { schedule_id: schedule_id };
    let data1 = await ft<ReturnData<RecordReturn>>(ap.GET__api_Records_GetBySchedule, pm);
    //let data2 = await ft<ReturnData<server.Schedule>>(ap.GET__api_Schedule_Item, { id: schedule_id });

    let r = {
        type: ac.loadRecord,
        data: data1.data,
        //field: data2.data
    }
    return r;
}
export const addRecord = (data) => {
    let r: { type: string, data }
        =
        {
            type: ac.addRecord,
            data
        }
    return r;
}
export const setRecordValue = (field) => {
    return {
        type: ac.chgRecord,
        field
    }
}
export async function saveRecord(records, field) {

    let pm = records;
    let data1 = await ft<ReturnBase>(ap.POST__api_Records, pm);

    if (data1.state == 0) {
        let param = { id: records.schedule_id, md: field }
        let data2 = await ft<ReturnBase>(ap.POST__api_Schedule_UpdateSet, param);
        tosMessage('比賽資訊更新', lang.fi_update, ToastrType.success);
    } else {
        tosMessage('比賽資訊更新', data1.message, ToastrType.error);
    }

    return {
        type: 'submit'
    }
}
export function addPlayerToSchedule(editRecordToogle: string, player_id: number, player_name: string, jersey_number: string, team_name: string) {
    return {
        type: ac.addPlayerToSchedule,
        editRecordToogle,
        player_id,
        player_name,
        jersey_number,
        team_name
    }
}

//reduces
const page_grid = (state: GridInfo<server.Schedule> = { rows: [] }, action): GridInfo<server.Schedule> => {
    switch (action.type) {
        case ac.load:
            return action.data;
        case ac.page:
            return action.data;
        case ac.setpage:
            return action.data
        default:
            return state;
    }
}
const search = (state = {
    schedule_start_date: null,
    schedule_end_date: null,
    workYear: workYear

}, action) => {
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
const field = (state = {}, action): server.Schedule => {
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
const kfield = (state = {}, action): server.Schedule => {
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
const pack_option = (state = { option_team: [], option_play_name: [], option_site: [] }, action) => {
    switch (action.type) {
        case ac.load:
            if (action.pack_option) {
                return action.pack_option;
            } else return state;
        default:
            return state
    }
}
const records = (state = { field: {}, home: { data: [] }, visiting: { data: [] } }, action) => {
    switch (action.type) {
        case ac.loadRecord:
            if (action.data) {
                return action.data;
            } else return state;
        case ac.addRecord:
            return action.data;
        case ac.chgRecord:
            return action.field;
        case ac.addPlayerToSchedule:
            return records_addPlayerToSchedule(state, action);

        default:
            return state
    }
}
function records_addPlayerToSchedule(state, action) {

    let { editRecordToogle, player_id, player_name, jersey_number, team_name } = action;
    
    let obj = { player_id, player_name, jersey_number, team_name }
    let struct = {}
    //console.log('before', state);

    if (editRecordToogle == 'Home') {
        struct = {
            home: {
                data: {
                    $push: [obj]
                }
            }
        };
    } else {
        struct = {
            visiting: {
                data: {
                    $push: [obj]
                }
            }
        };
    }

    let n_state = update(state, struct);
    //console.log('after', n_state);
    return n_state;
}


export let store = cbnReduce({ menudata, oper_id, search, page_grid, edit_type, view_mode, field, kfield, exist, pack_option, records });