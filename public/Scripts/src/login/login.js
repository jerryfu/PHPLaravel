"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vwMaskLoading_1 = require("../../comm/vwMaskLoading");
function ReSetVcImg() {
    $("#validate_img").attr("src", gb_approot + "Ah/VC.ashx?vn=" + ValidateCode + "&t" + (new Date()).getTime());
}
$(document).ready(function () {
    $("#frm").submit(function (event) {
        event.preventDefault();
        var data = {
            "account": $("#account").val(),
            "password": $("#password").val(),
            "validate": $("#validate").val(),
            "lang": 'zh-TW'
        };
        vwMaskLoading_1.mask_show('登錄中...');
        $.ajax({
            type: "POST",
            url: gb_approot + '_SysAdm/loginCheck',
            data: data,
            dataType: 'json'
        }).done(function (data, textStatus, jqXHRdata) {
            if (data.state == 0) {
                document.location.href = data.url;
            }
            else if (data.state == 1) {
                ReSetVcImg();
                $("#password").val("");
                alert(data.message);
                vwMaskLoading_1.mask_off();
            }
            else if (data.state == 2) {
                ReSetVcImg();
                $("#password").val("");
                alert(data.message);
                vwMaskLoading_1.mask_off();
            }
            else if (data.state == 3) {
                ReSetVcImg();
                $("#password").val("");
                alert(data.message);
                vwMaskLoading_1.mask_off();
            }
            else {
                ReSetVcImg();
                alert('請按“F5”重新更新畫面後再登入，如仍無法登錄請聯絡管理員。');
                vwMaskLoading_1.mask_off();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            grecaptcha.reset(widgetId);
            vwMaskLoading_1.mask_off();
            alert(errorThrown);
        });
    });
});
