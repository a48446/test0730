/**
 * 修改密碼
 * @function
 */
$(document).on("click", ".change_psw", function () {
    if($("#originPassword").val().length == 0 || $("#newPassword").val().length == 0 || $("#comfirmPassword").val().length == 0){
        alert("請填入密碼資訊");
        return false;
    }

    $.ajax({
        url: "/api/account/change_password",
        type: "POST",
        data: JSON.stringify({
            "old_password": $("#originPassword").val(),
            "new_password": $("#newPassword").val(),
            "verification_password": $("#comfirmPassword").val()
        }),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            new PNotify({
                title: '成功',
                text: '修改成功',
                type: 'success',
                delay: 500,
                shadow: true
            });
            setTimeout(function () {
                location.href = '/export_list';
            }, 500);
        } else {
            alert(res["message"]);
        }
    });
});