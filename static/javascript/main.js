// 定義所有ajax的錯誤狀態
$.ajaxSetup({
    statusCode: {
        400: function (jqxhr, textStatus, errorThrown) {
            alert(jqxhr.responseJSON.message);
        },
        401: function (jqxhr, textStatus, errorThrown) {
            var err_str = jqxhr.responseJSON.message;
            if (err_str.indexOf("Refresh Token") > -1) {
                return location.href = "/logout";
            } else {
                alert(err_str);
            }
        },
        500: function (jqxhr, textStatus, errorThrown) {
            alert("伺服器發生錯誤，請聯繫IT人員");
        },
    }
})

// 管理 帳戶資訊 下拉開關狀態
$(document).on("click", ".member_info", function () {
    if ($('.member_box').is(":hidden")) {
        $(".member_info_icon").removeClass("fa-chevron-down");
        $(".member_info_icon").addClass("fa-chevron-up");
        $('.member_box').css("display", "block");
    } else {
        $(".member_info_icon").removeClass("fa-chevron-up");
        $(".member_info_icon").addClass("fa-chevron-down");
        $('.member_box').css("display", "none");
    }
});