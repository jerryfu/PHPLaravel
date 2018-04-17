"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var toastr = require("toastr");
var Moment = require("moment");
function guid() {
    /**
     * 產生GUID
     */
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
    /*
    Autohr:Jerry
    Date:2014/2/23
    Description:列出物件屬性
    */
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
/**
 * 標準時間格式
 * @param utcstr
 */
function stdTime(utcstr) {
    if (utcstr && isValidJSONDate(utcstr, null)) {
        return Moment(utcstr).format("HH:mm");
    }
    else
        return null;
}
exports.stdTime = stdTime;
/**
 * 系統標準日期
 * @param utcstr UTC日期格
 */
function stdDate(utcstr) {
    if (utcstr && isValidJSONDate(utcstr, null)) {
        return Moment(utcstr).format("YYYY-MM-DD");
    }
    else
        return null;
}
exports.stdDate = stdDate;
/**
 * 加千分位數字及小數點位數
 * @param num 數字來源
 * @param float_num 小數點顯示位數
 */
function stdNumber(num, float_num) {
    if (num == undefined || num == null)
        return '';
    return fmtMoney(floatSpot(num, float_num));
}
exports.stdNumber = stdNumber;
function stdNumberFloat(num, float_num) {
    // 1 => 1.00 2.3=>2.30
    if (num == undefined || num == null)
        return '';
    var n = floatSpot(num, float_num);
    var s = n.toFixed(float_num);
    return s;
}
exports.stdNumberFloat = stdNumberFloat;
function fmtMoney(n, g) {
    /*
    Autohr:Ajoe
    Date:2015/12/09
    Description:金錢格式
    */
    if (n == undefined || n == null)
        return '';
    var glue = (typeof g == 'string' && g != null && g != undefined) ? g : ','; // 決定三個位數的分隔符號
    var digits = n.toString().split('.'); // 先分左邊及小數點後
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(digits[0])) {
        digits[0] = digits[0].replace(pattern, "$1" + glue + "$2");
    }
    return digits.join(".");
}
exports.fmtMoney = fmtMoney;
function getOptByVal(options, value) {
    var items = options.filter(function (x) { return x.value === value; });
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
//補字元
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
    if (type == ToastrType.info)
        toastr.info(message, title);
    if (type == ToastrType.success)
        toastr.success(message, title);
    if (type == ToastrType.error)
        toastr.error(message, title);
    if (type == ToastrType.warning)
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
/**
 * 浮點數取小數點位數
 * @param num 數字來源
 * @param pos 小數點顯示位數
 */
function floatSpot(num, pos) {
    var size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}
exports.floatSpot = floatSpot;
//除數加浮點數取小數點位數 格式化
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
    //background download excel file
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
    var m = parseFloat(n);
    //return !isNaN(parseFloat(n)) && isFinite(n) && m >= 0; //正能正整數
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
    /*
      Autohr:Ajoe
      Date:2015/9/8
      Description:台灣身份證檢查簡
    */
    if (id != null && id != "") {
        //建立字母分數陣列(A~Z)
        var city = new Array(1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30);
        id = id.toUpperCase();
        // 使用「正規表達式」檢驗格式
        if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
            //alert('基本格式錯誤');
            return false;
        }
        else {
            //將字串分割為陣列(IE必需這麼做才不會出錯)
            id = id.split('');
            //計算總分
            var total = city[id[0].charCodeAt(0) - 65];
            for (var i = 1; i <= 8; i++) {
                total += eval(id[i]) * (9 - i);
            }
            //補上檢查碼(最後一碼)
            total += eval(id[9]);
            //檢查比對碼(餘數應為0);
            return ((total % 10 == 0));
        }
    }
    else {
        return true;
    }
}
function DiffDate(start, end) {
    /*
      Autohr:Ajoe
      Date:2015/9/24
      Description:計算兩日期相差天數
    */
    if (start != null && end != null) {
        var day_s = new Date(start);
        var day_e = new Date(end);
        if (day_s <= day_e) {
            //開始日期 小於等於 結束日期 才計算
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
    //將日期設定成moment物件
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
//查詢QueryString
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
    var input = e.target;
    var value;
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
    //顯示台灣日期
    if (d == null || d == undefined) {
        return "";
    }
    var date = new Date(d);
    var mm = Moment(d); //改用moment套件
    var year = mm.year(), //date.getFullYear(),
    month = mm.month() + 1, //date.getMonth() + 1, // months are zero indexed
    day = mm.date(), //date.getDate(),
    hour = mm.hours(), //date.getHours(),
    minute = mm.minutes(), //date.getMinutes(),
    second = mm.seconds(), //date.getSeconds(),
    hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
    minuteFormatted = minute < 10 ? "0" + minute : minute, morning = hour < 12 ? "am" : "pm", result = year - 1911 + "\u5E74" + month + "\u6708" + day + "\u65E5 ";
    return result;
}
exports.getTwDate = getTwDate;
exports.packegeErrList = function (err_list) {
    var ls = [];
    //console.log('check err list', err_list);
    if (err_list && err_list.length > 0) {
        err_list.forEach(function (item, i) {
            item.err.forEach(function (list, j) {
                ls.push(item.field + ':' + list.message);
            });
        });
    }
    return ls.join('<br />');
};
//錯誤訊息包裝處
exports.showErrList = function (title, err_list) {
    var err_msgs = exports.packegeErrList(err_list);
    tosMessage(title, err_msgs, ToastrType.error);
};
//製作樣版函式
function mkTpl(strings) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return (function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
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
//字串是否全中文
function testZH(src) {
    for (var i = 0; i < src.length; i++) {
        if (src.charCodeAt(i) < 0x4E00 || src.charCodeAt(i) > 0x9FA5) {
            return false;
        }
    }
    return true;
}
exports.testZH = testZH;
/**
 * 浮點數相加
 * @param arg1
 * @param arg2
 */
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
/**
 * 浮點數相減
 * @param arg1
 * @param arg2
 */
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
/**
 * 浮點數相乘
 * @param arg1
 * @param arg2
 */
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
/**
 * 浮點數相除
 * @param arg1
 * @param arg2
 */
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
    //with (Math) {
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
    //}
}
exports.foDiv = foDiv;
/**
 * 取得選單目前選取項目
 * @param data 選單資料
 */
function getMenuName(data) {
    var m1 = data.filter(function (x) { return x.use == true; });
    var m2 = m1 && m1.length > 0 ? m1[0].sub.filter(function (x) { return x.use == true; }) : null;
    var m1_name = m1 && m1.length > 0 ? m1[0].menu_name : null;
    var m2_name = m2 && m2.length > 0 ? m2[0].menu_name : "";
    return { m1: m1_name, m2: m2_name };
}
exports.getMenuName = getMenuName;
/**
 * 依語係傳出不同字串
 * @param zhTW  中文
 * @param vnVN  越南
 * @param thTH  泰國
 * @param idID  印尼
 * @param msMS  馬來西亞
 */
function pickLang(zhTW, vnVN, thTH, idID, msMS) {
    if (thTH === void 0) { thTH = null; }
    if (idID === void 0) { idID = null; }
    if (msMS === void 0) { msMS = null; }
    return '';
}
exports.pickLang = pickLang;
/**
 * 取得系統前端參數值
 * @param key 要取得的參數key
 */
function pv(key) {
    var r = null;
    paramjs.forEach(function (item, i) {
        if (item.key == key) {
            r = item.value;
        }
    });
    return r;
}
exports.pv = pv;
/**
 * 依據value取得Select資料內的label直
 * @param val 要取得的參數value
 * @param data 要取得的參數selectlist
 */
function getOptionName(val, data) {
    var res = data.filter(function (x) { return x.value == val; });
    var name = "";
    if (res.length > 0) {
        name = res[0].label;
    }
    return name;
}
exports.getOptionName = getOptionName;
/**
 * 顯示台斤格式
 * @param qty 台斤值
 */
function fnTg(qty) {
    var n = 0, f = '0', fn = 0, res = '0';
    if (qty != 0) {
        var digits = qty.toString().split('.');
        n = parseInt(digits[0]);
        f = digits.length > 1 ? digits[1] : '0';
        fn = f == '1' ? 10 : parseInt(f);
        res = (n != 0 ? n + "\u65A4" : '') + (f != '0' ? fn + "\u5169" : '');
    }
    return res;
}
exports.fnTg = fnTg;
;
/**
 * 出貨單openwin
 * @param demand_sn
 */
exports.OpenWinFunc = function (demand_sn) {
    var param = [];
    param.push('demand_sn=' + demand_sn);
    var params = param.join('&');
    var url = gb_approot + 'Active/Func/PackingList?' + params;
    var open_p = 'width=960';
    { }
    open_p += ', height=600';
    { }
    open_p += ', top=0, left=0';
    open_p += ', fullscreen=no';
    open_p += ', resizable=yes';
    open_p += ', toolbar=no,menubar=no,location=no,status=no';
    var win = window.open(url, 'PackingList', open_p);
    win.focus();
};
