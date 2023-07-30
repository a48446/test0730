dataList();
function dataList() {
    $.ajax({
        url: "/api/document/get_upload_progress",
        type: "POST"
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];
            var fileType = [];
            var fileTypeFilter = [];
            var statusStr;
            for (var i = 0; i < res.length; i++) {
                var template = $('#rowSample').clone(true).remove('id').removeClass('display_none');
                $('#uploadUser', template).html(res[i].user_id);
                $('#uploadVendor', template).html(res[i].vendor);
                $('#fileType', template).html(res[i].file_type);
                if (fileTypeFilter.indexOf(res[i].file_type) == -1) {
                    fileTypeFilter.push(res[i].file_type);
                    fileType.push('<option value="' + res[i].file_type + '">' + res[i].file_type + '</option>');
                }
                $('#fileName', template).html(res[i].file_name);
                var updateTime = res[i].upload_time;
                if (updateTime) {
                    var finalUpdateTime = updateTime.split("T").join(" ");
                } else {
                    var finalUpdateTime = "";
                }
                $('#uploadTime', template).html(finalUpdateTime);

                if (res[i].status == "SUCCESS") {
                    statusStr = "辨識完成";
                } else if (res[i].status == "PENDING") {
                    statusStr = "等待辨識中";
                    $('.edit-icon', template).hide();
                } else if (res[i].status == "PROGRESS") {
                    statusStr = "辨識中";
                    $('.edit-icon', template).hide();
                    $('.delete-icon', template).hide();
                } else if (res[i].status == "FAILURE") {
                    statusStr = "辨識失敗";
                    $('.edit-icon', template).hide();
                }
                $('#fileStatus', template).html(statusStr);
                $('.edit-icon', template).data("uuid", res[i].uuid);
                $('.edit-icon', template).attr("onclick", "javascript: location.href='/compare_version/" + res[i].uuid + "'");
                $('.delete-icon', template).data("task_id", res[i].task_id);
                $('.delete-icon', template).data("uuid", res[i].uuid);
                $('#rowData').append(template);
            }

            myTable = $('#tableListProgress').DataTable({
                "info": false,
                // "bServerSide": true,
                lengthMenu: [10, 30, 50, 100],
                "language": {
                    "sLengthMenu": "每頁顯示 _MENU_筆",
                    "sSearch": "",
                    searchPlaceholder: "搜尋帳號, 檔案名稱",
                    "paginate": {
                        "next": "&raquo;",
                        "previous": "&laquo;"
                    },
                },
                // destroy:true,
                "search": {
                    "addClass": 'form-control input-lg col-xs-12'
                },
                sort: true,
                "pagingType": "simple_numbers",
                "start": 5,
                "length": 7,
            });
            $("#tableListProgress_filter label").before('<label><select id="selectFileType" aria-controls="list" class="form-control form-control-sm"><option value="">篩選檔案類型</option></select></label>');
            $("#selectFileType").append(fileType.join("\n"))
            $('#selectFileType').on('change', function () {
                myTable.columns(2).search(this.value).draw();
            });
            $("#tableListProgress_filter input").on('keyup', function () {
                var searchTerm = this.value.toLowerCase();
                $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                    //search only in column 1 and 2
                    if (~data[0].toLowerCase().indexOf(searchTerm)) return true;
                    if (~data[3].toLowerCase().indexOf(searchTerm)) return true;
                    return false;
                })
                myTable.draw();
                $.fn.dataTable.ext.search.pop();
            });
        } else {
            alert(res["message"]);
        }
    });
}

$(".edit-icon").on("click", function () {
    var uuid = $(this).data("uuid");
    localStorage.setItem("uuid", uuid);
});

$(".delete-icon").on("click", function () {
    if (confirm('是否確定刪除？')) {
        var task_id = $(this).data("task_id");

        $.ajax({
            url: "/api/document/delete_upload_progress",
            type: "POST",
            data: JSON.stringify({
                task_id: task_id
            }),
            dataType: "json",
            contentType: "application/json"
        }).done(function (res) {
            if (res.result == 0) {
                new PNotify({
                    title: '成功',
                    text: '刪除成功',
                    type: 'success',
                    delay: 500,
                    shadow: true
                });
                setTimeout(function () {
                    location.href = '/identify_progress_list';
                }, 500);

            } else {
                alert(res.message);
            }
        });
    }
});