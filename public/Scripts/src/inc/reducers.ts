//�t�Φ@�� Store
import update = require('react-addons-update');
import { combineReducers } from 'redux';
import { ac } from './ac_set';
//��浲�c���
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