﻿import * as $ from 'jquery';
import { MemberProxy } from '../inc/func';
import { guid } from '../../comm/comm-func';
$(document).ready(function () {
    let customer_id = $('#customer_id');
    let form_register = $('#form_register');
    let register_name = $('#register_name');
    let mobile = $('#mobile');
    let email = $('#email');
    let recommand_name = $('#recommand_name');
    let recommand_mobile = $('#recommand_mobile');

    customer_id.val(guid());
    form_register.submit(function (event) {
        event.preventDefault();
        let data = {
            customer_id: customer_id.val(),
            c_name: register_name.val(),
            email: email.val(),
            mobile: mobile.val(),
            recommand_name: recommand_name.val(),
            recommand_mobile: recommand_mobile.val(),
            c_pw: mobile.val(),
            state: 'A',
            lang: 'zh-TW'
        }

        MemberProxy.Regist(data).then((res) => {
            if (res.state == 0) {
                alert('註冊完成')
                document.location.href = gb_approot;
            } else {
                alert(res.message);
            }
        });
        return false;
    })


    let form_login = $('#form_login');
    let account = $('#account');
    let password = $('#password');
    let validate = $('#validate');

    form_login.submit(function (event) {
        event.preventDefault();
        let data = {
            account: account.val(),
            password: password.val(),
            validate: validate.val(),
            lang: 'zh-TW'
        };

        MemberProxy.Login(data).then((res) => {
            if (res.state == 0) {
                alert('登入成功!')
                document.location.href = gb_approot;
            } else {
                alert(res.message);
            }
        });
        return false;
    })
});

