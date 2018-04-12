//系統共用 Store
import update = require('react-addons-update');
import { combineReducers } from 'redux';
import { ac } from './ac_set';
//選單結構資料
export const menudata = (state: Array<server.Menu> = [], action) => {
    switch (action.type) {
        case ac.loadmenu:
            return action.data;
        case ac.collapse_menu:
            return action.data;
        default:
            return state;
    }
}