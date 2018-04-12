"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const toastr = require("toastr");
const Moment = require("moment");
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
exports.guid = guid;
function obj_prop_list(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            console.log(prop + " :" + obj[prop]);
        }
    }
}
function isValidJSONDate(value, userFormat) {
    var userFormat = userFormat || 'yyyy-mm-dd';
    var delimiter = /[^mdy]/.exec(userFormat)[0];
    var theFormat = userFormat.split(delimiter);
    var splitDatePart = value.split('T');
    if (splitDatePart.length == 1)
        return false;
    var theDate = splitDatePart[0].split(delimiter);
    var isDate = function (date, format) {
        var m, d, y;
        for (var i = 0, len = format.length; i < len; i++) {
            if (/m/.test(format[i]))
                m = date[i];
            if (/d/.test(format[i]))
                d = date[i];
            if (/y/.test(format[i]))
                y = date[i];
        }
        ;
        return (m > 0 && m < 13 &&
            y && y.length === 4 &&
            d > 0 && d <= (new Date(y, m, 0)).getDate());
    };
    return isDate(theDate, theFormat);
}
exports.isValidJSONDate = isValidJSONDate;
function stdTime(utcstr) {
    if (utcstr && isValidJSONDate(utcstr, null)) {
        return Moment(utcstr).format("HH:mm");
    }
    else
        return null;
}
exports.stdTime = stdTime;
function stdDate(utcstr) {
    if (utcstr && isValidJSONDate(utcstr, null)) {
        return Moment(utcstr).format("YYYY-MM-DD");
    }
    else
        return null;
}
exports.stdDate = stdDate;
function stdNumber(num, float_num) {
    if (num == undefined || num == null)
        return '';
    return fmtMoney(floatSpot(num, float_num));
}
exports.stdNumber = stdNumber;
function stdNumberFloat(num, float_num) {
    if (num == undefined || num == null)
        return '';
    var n = floatSpot(num, float_num);
    var s = n.toFixed(float_num);
    return s;
}
exports.stdNumberFloat = stdNumberFloat;
function fmtMoney(n, g) {
    if (n == undefined || n == null)
        return '';
    let glue = (typeof g == 'string' && g != null && g != undefined) ? g : ',';
    let digits = n.toString().split('.');
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(digits[0])) {
        digits[0] = digits[0].replace(pattern, "$1" + glue + "$2");
    }
    return digits.join(".");
}
exports.fmtMoney = fmtMoney;
function getOptByVal(options, value) {
    var items = options.filter(x => x.value === value);
    if (items.length > 0)
        return items[0];
    else
        return null;
}
exports.getOptByVal = getOptByVal;
function getNowDate() {
    var d = new Date();
    var r = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    return r;
}
function monthFirstDay() {
    var d = new Date();
    var r = new Date(d.getFullYear(), d.getMonth(), 1);
    return r;
}
function monthLastDay() {
    var d = new Date();
    var r = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return r;
}
function tim() {
    var d = new Date();
    return d.toUTCString() + '.' + d.getMilliseconds().toString();
}
exports.tim = tim;
function pad(str, len, pad, dir) {
    var padlen;
    if (typeof (len) == "undefined") {
        var len = 0;
    }
    if (typeof (pad) == "undefined") {
        var pad = ' ';
    }
    if (typeof (dir) == "undefined") {
        var dir = 3;
    }
    if (len + 1 >= str.length) {
        switch (dir) {
            case 1:
                str = Array(len + 1 - str.length).join(pad) + str;
                break;
            case 2:
                str = str + Array(len + 1 - str.length).join(pad);
                break;
            case 3:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                break;
        }
    }
    return str;
}
exports.pad = pad;
function tosMessage(title, message, type) {
    toastr.options.closeButton = true;
    if (type == 0)
        toastr.info(message, title);
    if (type == 1)
        toastr.success(message, title);
    if (type == 3)
        toastr.error(message, title);
    if (type == 2)
        toastr.warning(message, title);
}
exports.tosMessage = tosMessage;
function formatFileSize(byte_size) {
    var get_size = byte_size;
    if (get_size <= 1024) {
        return get_size + 'Byte';
    }
    else if (get_size > 1024 && get_size <= 1024 * 1024) {
        var num = get_size / 1024;
        var fmt = Math.ceil(num);
        return fmt + 'KB';
    }
    else {
        var num = get_size / (1024 * 1024);
        var fmt = Math.ceil(num);
        return fmt + 'MB';
    }
}
exports.formatFileSize = formatFileSize;
function clone(obj) {
    if (null == obj || "object" != typeof obj)
        return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
            copy[attr] = obj[attr];
    }
    return copy;
}
exports.clone = clone;
function floatSpot(num, pos) {
    let size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}
exports.floatSpot = floatSpot;
function divisor(num, div_num, pos) {
    if (num !== null && num != undefined) {
        if (pos != null)
            return floatSpot(num / div_num, pos);
        else
            return num / div_num;
    }
    else
        return null;
}
exports.divisor = divisor;
function ifrmDown(download_src) {
    $('#file_down').remove();
    var item = $(this).attr('item');
    var src = src;
    var encSrc = download_src;
    var ifram = $('<iframe id="file_down" style="display:none">');
    ifram.attr('src', encSrc);
    $(document.body).append(ifram);
}
exports.ifrmDown = ifrmDown;
function isNumeric(n) {
    let m = parseFloat(n);
    return !isNaN(parseFloat(n)) && isFinite(n);
}
exports.isNumeric = isNumeric;
function getBrower() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    if (Sys.ie)
        return ('IE: ' + Sys.ie);
    if (Sys.firefox)
        return ('Firefox: ' + Sys.firefox);
    if (Sys.chrome)
        return ('Chrome: ' + Sys.chrome);
    if (Sys.opera)
        return ('Opera: ' + Sys.opera);
    if (Sys.safari)
        return ('Safari: ' + Sys.safari);
}
function checkTwID(id) {
    if (id != null && id != "") {
        var city = new Array(1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30);
        id = id.toUpperCase();
        if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
            return false;
        }
        else {
            id = id.split('');
            var total = city[id[0].charCodeAt(0) - 65];
            for (var i = 1; i <= 8; i++) {
                total += eval(id[i]) * (9 - i);
            }
            total += eval(id[9]);
            return ((total % 10 == 0));
        }
    }
    else {
        return true;
    }
}
function DiffDate(start, end) {
    if (start != null && end != null) {
        var day_s = new Date(start);
        var day_e = new Date(end);
        if (day_s <= day_e) {
            var iDays = (Math.abs(day_e.getTime() - day_s.getTime()) / 1000 / 60 / 60 / 24) + 1;
            return { result: 1, diff_day: iDays };
        }
        else {
            return { result: -1, diff_day: 0 };
        }
    }
    else {
        return { result: -2, diff_day: 0 };
    }
}
function MntV(date) {
    var r = date === null || date === undefined ? null : Moment(date);
    return r;
}
exports.MntV = MntV;
function formatNumber(number) {
    if (number == undefined || number == null) {
        return '';
    }
    var snumber = number.toFixed(2) + '';
    var x = snumber.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1;
}
exports.formatNumber = formatNumber;
function queryString(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
exports.queryString = queryString;
function makeInputValue(e) {
    let input = e.target;
    let value;
    if (input.value == 'true') {
        value = true;
    }
    else if (input.value == 'false') {
        value = false;
    }
    else {
        value = input.value;
    }
    return value;
}
exports.makeInputValue = makeInputValue;
function getTwDate(d) {
    if (d == null || d == undefined) {
        return "";
    }
    let date = new Date(d);
    let mm = Moment(d);
    let year = mm.year(), month = mm.month() + 1, day = mm.date(), hour = mm.hours(), minute = mm.minutes(), second = mm.seconds(), hourFormatted = hour % 12 || 12, minuteFormatted = minute < 10 ? "0" + minute : minute, morning = hour < 12 ? "am" : "pm", result = `${year - 1911}年${month}月${day}日 `;
    return result;
}
exports.getTwDate = getTwDate;
exports.packegeErrList = (err_list) => {
    let ls = [];
    if (err_list && err_list.length > 0) {
        err_list.forEach((item, i) => {
            item.err.forEach((list, j) => {
                ls.push(item.field + ':' + list.message);
            });
        });
    }
    return ls.join('<br />');
};
exports.showErrList = (title, err_list) => {
    let err_msgs = exports.packegeErrList(err_list);
    tosMessage(title, err_msgs, 3);
};
function mkTpl(strings, ...keys) {
    return (function (...values) {
        var dict = values[values.length - 1] || {};
        var result = [strings[0]];
        keys.forEach(function (key, i) {
            var value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}
exports.mkTpl = mkTpl;
function isOK(src) {
    if (src === undefined || src === null || src === '')
        return false;
    else
        return true;
}
exports.isOK = isOK;
function testZH(src) {
    for (var i = 0; i < src.length; i++) {
        if (src.charCodeAt(i) < 0x4E00 || src.charCodeAt(i) > 0x9FA5) {
            return false;
        }
    }
    return true;
}
exports.testZH = testZH;
function foAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (foMul(arg1, m) + foMul(arg2, m)) / m;
}
exports.foAdd = foAdd;
function foSubtraction(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
exports.foSubtraction = foSubtraction;
function foMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) { }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
exports.foMul = foMul;
function foDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) { }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) { }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}
exports.foDiv = foDiv;
function getMenuName(data) {
    let m1 = data.filter(x => x.use == true);
    let m2 = m1 && m1.length > 0 ? m1[0].sub.filter(x => x.use == true) : null;
    let m1_name = m1 && m1.length > 0 ? m1[0].menu_name : null;
    let m2_name = m2 && m2.length > 0 ? m2[0].menu_name : "";
    return { m1: m1_name, m2: m2_name };
}
exports.getMenuName = getMenuName;
function pickLang(zhTW, vnVN, thTH = null, idID = null, msMS = null) {
    return '';
}
exports.pickLang = pickLang;
function pv(key) {
    var r = null;
    paramjs.forEach((item, i) => {
        if (item.key == key) {
            r = item.value;
        }
    });
    return r;
}
exports.pv = pv;
function getOptionName(val, data) {
    let res = data.filter((x) => { return x.value == val; });
    let name = "";
    if (res.length > 0) {
        name = res[0].label;
    }
    return name;
}
exports.getOptionName = getOptionName;
function fnTg(qty) {
    let n = 0, f = '0', fn = 0, res = '0';
    if (qty != 0) {
        let digits = qty.toString().split('.');
        n = parseInt(digits[0]);
        f = digits.length > 1 ? digits[1] : '0';
        fn = f == '1' ? 10 : parseInt(f);
        res = (n != 0 ? `${n}斤` : '') + (f != '0' ? `${fn}兩` : '');
    }
    return res;
}
exports.fnTg = fnTg;
;
exports.OpenWinFunc = (demand_sn) => {
    let param = [];
    param.push('demand_sn=' + demand_sn);
    let params = param.join('&');
    let url = gb_approot + 'Active/Func/PackingList?' + params;
    let open_p = 'width=960';
    { }
    open_p += ', height=600';
    { }
    open_p += ', top=0, left=0';
    open_p += ', fullscreen=no';
    open_p += ', resizable=yes';
    open_p += ', toolbar=no,menubar=no,location=no,status=no';
    let win = window.open(url, 'PackingList', open_p);
    win.focus();
};
