let memberList = {};
let checkedRole = new Array();

dataList();
getVenderList();

/**
 * 去除拖拉方式上傳的 localstorage 資料
 * @function
 */
function clearStorage() {
    localStorage.removeItem("list");
    $("#dropList").empty();
    $("#dropList").append("<button type=button class='btn page_button' data-dismiss=modal onclick=csvUpload()>上傳</button>");
    $(".file_name").text("點擊上傳檔案");
}

/**
 * 將 CSV 檔每筆資料製作成 row
 * @param file - CSV內的資料
 * @function
 */
function processingList(file) {
    var file = file;
    for (var i = 1; i < file.length; i++) {
        var template = $('#rowSample').clone(true).remove('id').removeClass('display_none');
        for (var j = 0; j < file[i].length; j++) {
            $('#memberName', template).html(file[i][0]);
            if (i % 2 == 0) {
                template.addClass('even_row');
            } else {
                template.addClass('odd_row');
            }
        }
        $('#rowData').append(template);
    }
    new PNotify({
        title: '成功',
        text: '上傳成功',
        type: 'success',
        delay: 500,
        shadow: true
    });
}

$("#fileUploader").on("change", function () {
    $(".file_name").text(this.files[0].name);
});

/**
 * 將 CSV 檔匯入
 * @function
 */
function csvUpload() {

    var file_data = $("#fileUploader").prop("files")[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    $.ajax({
        url: "/api/account/import_account",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];
            dataList();
        } else {
            alert(res["message"]);
        }
    });
}

/**
 * 將 CSV 檔拖拉方式匯入並上傳
 * @function
 */
function dropList() {
    var file = JSON.parse(localStorage.getItem("list"));
    $.ajax({
        url: "/api/account/import_account",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];
        } else {
            alert(res["message"]);
        }
    });
}

window.onload = function () {

    const dropbox = document.getElementById("uploadZone");
    const click = e => handleFileSelect(e);

    /**
     * 點擊方式上傳 CSV 檔
     * @function
     */
    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();
        const fileUploader = document.getElementById("fileUploader");
        fileUploader.click();
    }

    /**
     * 終止事件傳導及預設行為
     * @function
     */
    function dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * 終止事件傳導將 CSV 檔拖拉方式匯入處理成 array
     * @function
     */
    function drop(e) {
        var data = [];
        var col = [];
        e.stopPropagation();
        e.preventDefault();
        $("#dropList").empty();
        $("#dropList").append("<button id=modelButton type=button class='btn page_button' data-dismiss=modal onclick=dropList()>上傳</button>");
        const dt = e.dataTransfer;
        const files = dt.files;
        var form_data = new FormData(files[0]);
        form_data.append('file', file_data);
    }

    dropbox.addEventListener("click", click, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);
}

$("input").click(function () {
    if (!$(this).attr("checked")) {
        $(this).attr("checked", "checked");
    } else {
        $(this).removeAttr("checked");
    }
});

//確認新增
$("#addRole").on("click", function () {
    if (checkedRole.indexOf("super_user") > -1 || checkedRole.indexOf("general_user") > -1) {
        var roleVendor = $(".super_user_select_add").find("select option:selected").val();
    } else {
        var roleVendor = "";
    }

    var roleUser = $("#addRoleUser").val();
    var roleEmail = $("#addRoleEmail").val();

    if (checkedRole.length == 0) {
        alert("須選擇角色");
        return false;
    } else if (checkedRole.indexOf("super_user") > -1 && checkedRole.indexOf("general_user") > -1) {
        alert("Super User 和 General User 只能二選一");
        return false;
    } else if (roleUser.length == 0 || roleEmail.length == 0) {
        alert("請輸入帳號、信箱資訊");
        return false;
    }

    $.ajax({
        url: "/api/account/add_account_list",
        type: "POST",
        data: JSON.stringify({
            "user_id": roleUser,
            "role": checkedRole,
            "email": roleEmail,
            "vendor": roleVendor
        }),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            $("#checkAddRole input").removeAttr("checked");
            $("#addRoleUser").val("");
            $("#addRoleEmail").val("");

            new PNotify({
                title: '成功',
                text: '新增成功',
                type: 'success',
                delay: 500,
                shadow: true
            });
            $("#checkAddRole input").prop("checked", false);
            $("#addRole").closest(".modal-content").find(".close").trigger("click");
            dataList();
        } else {
            alert(res["message"]);
        }
    });
});

// initial input columns
$("#addRoleBtn").on("click", function () {
    $(".super_user_select_add").css("display", "none");
    $(".super_user_select_add").find("select").val("");
    // 先取消全部勾選
    $("#checkAddRole").find("input[type=checkbox]").each(function () {
        $(this).prop("checked", false);
        $(this).prop("disabled", false);
    });
    $("#addRoleUser").val("");
    $("#addRoleEmail").val("");
});


$(".delRow").on("click", function () {
    if (confirm('是否確定刪除？')) {
        var roleUser = $(this).parent().parent()[0].cells[0].innerHTML;
        var delId = $(this).val().split('-')[1];
        myTable.row($(this).parents('tr')).remove().draw();
        $.ajax({
            url: "/api/account/delete_account_list",
            type: "POST",
            data: JSON.stringify({
                "user_id": roleUser,
            }),
            dataType: "json",
            contentType: "application/json; charset=UTF-8"
        }).done(function (res) {
            if (res["result"] == 0) {
                res = res["data"];
                new PNotify({
                    title: '成功',
                    text: '刪除成功',
                    type: 'success',
                    delay: 500,
                    shadow: true
                });
            } else {
                alert(res["message"]);
            }
        });
    }

});

function dataList() {
    $.ajax({
        url: "/api/account/get_account_list",
        type: "POST",
        data: JSON.stringify({}),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];

            for (var idx = 0; idx < res.length; idx++) {
                var Id = res[idx]["user_id"];
                memberList[Id] = res[idx];
            }

            // dataTable initial
            myTable = $('#tableList').DataTable({
                "info": false,
                // "bServerSide": true,
                lengthMenu: [10, 30, 50, 100],
                "language": {
                    "sLengthMenu": "每頁顯示 _MENU_ 筆",
                    "sSearch": "",
                    searchPlaceholder: "帳號",
                    "paginate": {
                        "next": "&raquo;",
                        "previous": "&laquo;"
                    },
                },
                destroy: true,
                "search": {
                    "addClass": 'form-control input-lg col-xs-12'
                },
                sort: true,
                "pagingType": "simple_numbers",
                "start": 5,
                "length": 7,
            });

            myTable.clear().draw();

            for (var i = 0; i < res.length; i++) {
                var template = $('#rowSample').clone(true).remove('id').removeClass('display_none');
                $('#memberName', template).html(res[i].user_id);
                $('#memberVendor', template).html(res[i].vendor);
                $('#memberEmail', template).html(res[i].email);

                // 啟用停用 狀態
                $('.enable-btn', template).data("value", res[i].user_id);
                $('.disable-btn', template).data("value", res[i].user_id);
                if (res[i].status == "activated") {
                    $('.enable-btn', template).show();
                    $('.disable-btn', template).hide();
                } else {
                    $('.enable-btn', template).hide();
                    $('.disable-btn', template).show();
                }

                var updateTime = res[i].update_time;
                if (updateTime) {
                    var finalUpdateTime = updateTime.split("T").join(" ");
                } else {
                    var finalUpdateTime = "";
                }
                $('#memberTime', template).html(finalUpdateTime);
                $('.editRow', template).attr("value", "editRow-" + res[i].user_id);
                $('.delRow', template).attr("value", "delRow-" + res[i].user_id);
                var role = res[i].role;
                if (role.length > 0) {
                    var roleJoin = role.join('<br/>');
                } else {
                    var roleJoin = "";
                }
                $('#memberRole', template).html(roleJoin);
                myTable.rows.add(template);
            }
            myTable.draw();

            $("#tableList_filter label").before('<label style="margin-right: 7px;"><select id="userSelect" aria-controls="list" class="form-control form-control-sm">' +
                '<option value="">篩選角色</option>' +
                '<option value="Admin">Admin</option>' +
                '<option value="Super User">Super User</option>' +
                '<option value="General User">General User</option>' +
                '</select></label>' +
                '<label><select id="vendorSelect" aria-controls="list" class="form-control form-control-sm">\' +\n' +
                '<option value="">篩選客戶</option>' +
                '<option value="prl">PRL</option>' +
                '<option value="tommy">Tommy</option>' +
                '</select></label>');
            $('#userSelect').on('change', function () {
                myTable.columns(2).search(this.value).draw();
            });
            $('#vendorSelect').on('change', function () {
                myTable.columns(1).search(this.value).draw();
            });
            $("#tableList_filter input").on('input', function () {
                myTable.columns(0).search(this.value).draw();
            });

        } else {
            alert(res["message"]);
        }
    });
}

function getVenderList() {
    $.ajax({
        url: "/api/document/upload_file_option",
        type: "POST",
        data: JSON.stringify({
            "user_id": "",
            "vendor": "",
            "file_type": ""
        }),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];
            let vendorList = ['<option value="" selected>選擇綁定的客戶</option>'];
            let vendorOption = "";
            for(var idx in res){
                vendorOption = "<option value='"+ res[idx]["vendor"] +"'>"+ res[idx]["vendor"] +"</option>";
                if(vendorList.indexOf(vendorOption) == -1){
                    vendorList.push(vendorOption);
                }
            }
            $(".super_user_select_add").find("select").html(vendorList.join("\n"));
            $(".super_user_select_edit").find("select").html(vendorList.join("\n"));
        } else{
            alert(res["message"]);
        }
    });
}

/**
 * 修改啟用停用狀態
 * @function
 */
$(".enable-btn, .disable-btn").on("click", function () {
    var status = $(this).attr("name");
    var user_id = $(this).data("value");
    var data = {
        "old_user_id": user_id,
        "is_activated": true
    };
    if (status == "disable") {
        data["is_activated"] = true;
    } else {
        data["is_activated"] = false
    }
    $.ajax({
        url: "/api/account/update_account_status",
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            dataList();
        } else {
            alert(res["message"]);
        }
    });
})


$(".editRow").on("click", function () {
    var editId = $(this).val().split('-')[1];
    localStorage.setItem("oldUser", editId);

    $("#editRoleUser").val(memberList[editId]["user_id"]);
    $("#editRoleEmail").val(memberList[editId]["email"]);
    $(".super_user_select_edit").find("select").val("");
    if (memberList[editId]["vendor"] || memberList[editId]['role'].indexOf("super_user") > -1 || memberList[editId]['role'].indexOf("general_user") > -1) {
        $(".super_user_select_edit").css("display", "block");
    } else {
        $(".super_user_select_edit").css("display", "none");
    }

    // 先取消全部勾選
    $("#checkEditRole").find("input[type=checkbox]").each(function () {
        $(this).prop("checked", false);
        $(this).prop("disabled", false);
    });
    // 依據回傳結果勾選角色
    for (var idx in memberList[editId]["role"]) {
        $("input[name=" + memberList[editId]['role'][idx] + "]").prop("checked", true);
        if (memberList[editId]['role'][idx] == "super_user") {
            $("input[name=general_user]").prop("disabled", true);
            $(".super_user_select_edit").find("select option[value='" + memberList[editId]["vendor"] + "']").prop("selected", true);
        } else if (memberList[editId]['role'][idx] == "general_user") {
            $("input[name=super_user]").prop("disabled", true);
            $(".super_user_select_edit").find("select option[value='" + memberList[editId]["vendor"] + "']").prop("selected", true);
        }
    }
});

$("#checkAddRole input[type=checkbox]").on("change", function () {
    // super user 和 general user 選了其中一個就disabled另一個
    var superChkBox = $('#checkAddRole input:checkbox[name=super_user]');
    var generChkBox = $('#checkAddRole input:checkbox[name=general_user]');
    if (superChkBox.is(":checked")) {
        generChkBox.prop("disabled", true);
    } else if (!superChkBox.is(":checked")) {
        generChkBox.prop("disabled", false);
    }

    if (generChkBox.is(":checked")) {
        superChkBox.prop("disabled", true);
    } else if (!generChkBox.is(":checked")) {
        superChkBox.prop("disabled", false);
    }

    if (superChkBox.is(":checked") && generChkBox.is(":checked")) {
        alert("Super User 和 General User 只能二選一");
        $(this).prop("checked", false);
        return false;
    } else {
        checkedRole = new Array();
        $("#checkAddRole input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                checkedRole.push($(this).attr("name"));
            }
        });
    }

    if ($('#checkAddRole input:checkbox[name=super_user], #checkAddRole input:checkbox[name=general_user]').is(":checked")) {
        $(".super_user_select_add").css("display", "block");
    } else {
        $(".super_user_select_add").css("display", "none");
    }
});

$("#checkEditRole input[type=checkbox]").on("change", function () {
    // super user 和 general user 選了其中一個就disabled另一個
    var superChkBox = $('#checkEditRole input:checkbox[name=super_user]');
    var generChkBox = $('#checkEditRole input:checkbox[name=general_user]');
    if (superChkBox.is(":checked")) {
        generChkBox.prop("disabled", true);
    } else if (!superChkBox.is(":checked")) {
        generChkBox.prop("disabled", false);
    }

    if (generChkBox.is(":checked")) {
        superChkBox.prop("disabled", true);
    } else if (!generChkBox.is(":checked")) {
        superChkBox.prop("disabled", false);
    }

    if (superChkBox.is(":checked") && generChkBox.is(":checked")) {
        alert("Super User 和 General User 只能二選一");
        $(this).prop("checked", false);
        return false;
    }

    if ($('#checkEditRole input:checkbox[name=super_user], #checkEditRole input:checkbox[name=general_user]').is(":checked")) {
        $(".super_user_select_edit").css("display", "block");
    } else {
        $(".super_user_select_edit").css("display", "none");
    }
});

$("#editRoleBtn").on("click", function () {

    var editRoleEmail = $("#editRoleEmail").val();
    var oldUser = localStorage.getItem("oldUser");
    var checkedEditRole = new Array();
    $("#checkEditRole").find("input[type=checkbox]").each(function () {
        if ($(this).is(":checked")) {
            checkedEditRole.push($(this).attr("name"));
        }
    });
    if (checkedEditRole.indexOf("super_user") > -1 || checkedEditRole.indexOf("general_user") > -1) {
        var editRoleVendor = $(".super_user_select_edit").find("select option:selected").val();
    } else {
        var editRoleVendor = "";
    }

    if (checkedEditRole.length == 0) {
        alert("須選擇角色");
        return false;
    } else if (editRoleEmail.length == 0) {
        alert("請輸入信箱資訊");
        return false;
    }

    $.ajax({
        url: "/api/account/update_account_list",
        type: "POST",
        data: JSON.stringify({
            "old_user_id": oldUser,
            "data": {
                "new_role": checkedEditRole,
                "new_email": editRoleEmail,
                "new_vendor": editRoleVendor
            }
        }),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            dataList();
            $("#checkEditRole input").removeAttr("checked");
            new PNotify({
                title: '成功',
                text: '更新成功',
                type: 'success',
                delay: 500,
                shadow: true
            });
        } else {
            alert(res["message"]);
        }
    });
});

