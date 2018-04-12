import * as Pom from 'es6-promise';
Pom.polyfill();
import 'whatwg-fetch';

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

export function fetchGet<T>(url: string, data: any): Promise<T> {

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
            var error = new Error(response.statusText)
            throw error;
        }
    })
        .catch((reason) => {
            console.log(reason, url, data);
            alert('Call WebApi發生錯誤!');
            return reason;
        });
};
export function fetchPost<T>(url: string, data: any): Promise<T> {

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
            var error = new Error(response.statusText)
            throw error;
        }
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
        return reason;
    });
};
export function fetchPut<T>(url: string, data: any): Promise<T> {

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
            var error = new Error(response.statusText)
            throw error;
        }
    })
        .catch((reason) => {
            alert('Call WebApi發生錯誤!');
            return reason;
        });
};
export function fetchDelete<T>(url: string, data: any): Promise<T> {

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
            var error = new Error(response.statusText)
            throw error;
        }
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
        return reason;
    });
};

export function ft<T>(api_path_obj: ApiPathStruct, params: any = null) {
    if (api_path_obj.method == 'GET')
        return fetchGet<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'POST')
        return fetchPost<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'PUT')
        return fetchPut<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'DELETE')
        return fetchDelete<T>(gb_approot + api_path_obj.path, params);
}