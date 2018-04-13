import { mask_show, mask_off } from '../../comm/vwMaskLoading';

interface LoginData {
    account?: string;
    password?: string;
    validate?: string;
    lang?: string;
}
interface LoginResult {
    result: boolean;
    message: string;
    url: string;
    state: number;
}
declare var ValidateCode: string;
function ReSetVcImg() {
    $("#validate_img").attr("src", gb_approot + "Ah/VC.ashx?vn=" + ValidateCode + "&t" + (new Date()).getTime());
}
alert(5);
$(document).ready(function () {

    $("#frm").submit(function (event) {
        event.preventDefault();
        var data: LoginData = {
            "account": $("#account").val(),
            "password": $("#password").val(),
            "validate": $("#validate").val(),//$("#g-recaptcha-response").val(),
            "lang": 'zh-TW'
        };

        mask_show('登錄中...');
        $.ajax({
            type: "POST",
            url: gb_approot + '_SysAdm/loginCheck',
            data: data,
            dataType: 'json'
        }).done(function (data: LoginResult, textStatus, jqXHRdata) {

            if (data.state == 0) {
                document.location.href = data.url;
            }
            else if (data.state == 1) {
                //grecaptcha.reset(widgetId);
                ReSetVcImg();
                $("#password").val("");
                alert(data.message);
                mask_off();
            }
            else if (data.state == 2) { //帳號停權
                //grecaptcha.reset(widgetId);
                ReSetVcImg();
                $("#password").val("");
                alert(data.message);
                mask_off();
            }
            else if (data.state == 3) {
                //grecaptcha.reset(widgetId);
                ReSetVcImg();
                $("#password").val("");
                alert(data.message);
                mask_off();
            }
            else {
                //grecaptcha.reset(widgetId);
                ReSetVcImg();
                alert('請按“F5”重新更新畫面後再登入，如仍無法登錄請聯絡管理員。')
                mask_off();
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            grecaptcha.reset(widgetId);
            mask_off();
            alert(errorThrown);
        });
    });
})