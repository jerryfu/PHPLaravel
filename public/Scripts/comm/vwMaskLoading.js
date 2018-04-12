"use strict";
const comm_func_1 = require("./comm-func");
var MaskLoadingFunc;
(function (MaskLoadingFunc) {
    let mask_div_id = 'mask_unique_' + comm_func_1.guid();
    MaskLoadingFunc.mask_show = (text = '資料讀取中……') => {
        let body = document.getElementsByTagName("BODY")[0];
        let _div = document.createElement('div');
        _div.id = mask_div_id;
        _div.className = 'loading';
        _div.innerHTML = '<div class="loader" data-loader="circle-side"></div><p>' + text + '</p>';
        body.appendChild(_div);
    };
    MaskLoadingFunc.mask_off = () => {
        let body = document.getElementsByTagName("BODY")[0];
        if (body) {
            let _div = document.getElementById(mask_div_id);
            if (_div)
                body.removeChild(_div);
        }
    };
})(MaskLoadingFunc || (MaskLoadingFunc = {}));
module.exports = MaskLoadingFunc;
