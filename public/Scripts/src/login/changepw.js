$("#loginform").submit(function (event) {
    event.preventDefault();
    var data = {
        opwd: $('#opwd').val(),
        npwd: $('#npwd').val(),
        spwd: $('#spwd').val()
    };
    $.ajax({
        type: "POST",
        url: gb_approot + 'index/ACChgPW',
        data: data,
        dataType: 'json'
    }).done(function (data, textStatus, jqXHRdata) {
        if (data.state == 0) {
            $('#opwd').val('');
            $('#npwd').val('');
            $('#spwd').val('');
            alert('更改密碼成功，下次登錄請用新密碼。');
        }
        else if (data.state > 0) {
            $('#opwd').val('');
            alert(data.message);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert('請按“F5”重新更新畫面後再登入，如仍無法登錄請聯絡管理員。');
        alert(errorThrown);
    });
});
