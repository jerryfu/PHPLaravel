"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pom = require("es6-promise");
Pom.polyfill();
require("whatwg-fetch");
function EncodeQueryData(data) {
    var ret = [];
    for (var d in data) {
        if (data[d] !== undefined && data[d] !== null && data[d] !== '')
            ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        else
            ret.push(encodeURIComponent(d) + "=");
    }
    return ret.join("&");
}
function fetchGet(url, data) {
    const url_param = EncodeQueryData(data);
    return fetch(url + (url_param == '' ? '' : '?' + url_param), {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        }
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText);
            throw error;
        }
    })
        .catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
        return reason;
    });
}
exports.fetchGet = fetchGet;
;
function fetchPost(url, data) {
    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText);
            throw error;
        }
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
        return reason;
    });
}
exports.fetchPost = fetchPost;
;
function fetchPut(url, data) {
    return fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText);
            throw error;
        }
    })
        .catch((reason) => {
        alert('Call WebApi發生錯誤!');
        return reason;
    });
}
exports.fetchPut = fetchPut;
;
function fetchDelete(url, data) {
    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText);
            throw error;
        }
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
        return reason;
    });
}
exports.fetchDelete = fetchDelete;
;
function ft(api_path_obj, params = null) {
    if (api_path_obj.method == 'GET')
        return fetchGet(gb_approot + api_path_obj.path, params);
    if (api_path_obj.method == 'POST')
        return fetchPost(gb_approot + api_path_obj.path, params);
    if (api_path_obj.method == 'PUT')
        return fetchPut(gb_approot + api_path_obj.path, params);
    if (api_path_obj.method == 'DELETE')
        return fetchDelete(gb_approot + api_path_obj.path, params);
}
exports.ft = ft;
