import { fetchGet, fetchDelete, fetchPost, fetchPut } from '../../comm/ajax';
import { ac } from './ac_set'
import "babel-polyfill";

export const callLoadMenu = (data) => {
    return {
        type: ac.loadmenu,
        data
    }
}