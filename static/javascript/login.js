/**
 * 登入驗證
 * @function
 */
$(document).on("click", ".login_button", function () {
    var acct = $("input.acct").val();
    var pwd = $("input.pwd").val();

    if (acct.length == 0 || pwd.length == 0) {
        alert("請輸入登入資訊");
        return false;
    }

    $.ajax({
        url: "/api/authorize/login",
        type: "POST",
        data: JSON.stringify({
            "user_id": acct,
            "passwd": pwd
        }),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];
            location.href = "/";
        } else {
            alert(res["message"]);
        }
    });
});

/**
 * 按Enter觸發登入
 * @function
 * @param {obj} e - 按鍵資訊
 */
$(document).on("keyup", "input.pwd", function (e) {
    if (e.keyCode == 13) {
        $(".login_button").trigger("click");
    }
});

/**
 * 忘記密碼
 * @function
 */
$("#sendEmail").on("click", function () {
    var forgetEmail = $("#emailAccount").val();
    $.ajax({
        url: "/api/account/forget",
        type: "POST",
        data: JSON.stringify({
            "email": forgetEmail,
        }),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            $("#emailAccount").val("");
        } else {
            alert(res["message"]);
        }
    });
});