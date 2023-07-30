exportListSuper();

function exportListSuper() {
    $.ajax({
        url: "/api/document/get_history_operate_list",
        type: "POST"
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];
            var fileType = [];
            var fileTypeFilter = [];
            for (var i = 0; i < res.length; i++) {
                var template = $('#rowSample').clone(true).remove('id').removeClass('display_none');
                $('#exportUser', template).html(res[i].user_id);
                $('#exportVendor', template).html(res[i].vendor);

                if (fileTypeFilter.indexOf(res[i].file_type) == -1) {
                    fileTypeFilter.push(res[i].file_type);
                    fileType.push('<option value="' + res[i].file_type + '">' + res[i].file_type + '</option>');
                }
                $('#fileType', template).html(res[i].file_type);
                $('#fileName', template).html(res[i].file_name);
                $('#updateTime', template).html(res[i].update_time);
                $('#fileNote', template).html(res[i].note);
                $('.editRow', template).attr('value', 'btn-' + res[i].uuid);
                var updateTime = res[i].update_time;
                if (updateTime) {
                    var finalUpdateTime = updateTime.split("T").join(" ");
                } else {
                    var finalUpdateTime = "";
                }
                $('#updateTime', template).html(finalUpdateTime);

                // 匯出按鈕
                if (res[i].status == "Done") {
                    $(".downloadRow", template).css("display", "block");
                }

                $(".downloadRow", template).data("uuid", res[i].uuid);
                $(".editRow", template).data("uuid", res[i].uuid);
                $(".editRow", template).attr("onclick", "javascript: location.href='/form_detection'");
                $(".delRow", template).data("uuid", res[i].uuid);

                $('#rowData').append(template);
            }

            myTable = $('#tableListExportSuper').DataTable({
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
            $("#tableListExportSuper_filter label").before('<label><select id="selectFileType" aria-controls="list" class="form-control form-control-sm"><option value="">篩選檔案類型</option></select></label>');
            $("#selectFileType").append(fileType.join("\n"));
            $('#selectFileType').on('change', function () {
                myTable.columns(2).search(this.value).draw();
            });
            $("#tableListExportSuper_filter input").on('keyup', function () {
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

$(".editRow").on("click", function () {
    var uuid = $(this).val().split('-')[1];
    localStorage.setItem("uuid", uuid);
});

$(".delRow").on("click", function () {
    if (confirm('是否確定刪除？')) {
        var uuid = $(this).data("uuid");
        $.ajax({
            url: "/api/document/delete_history_operate_list",
            type: "POST",
            data: JSON.stringify({
                uuid: uuid
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
                    location.href = '/export_list';
                }, 500);

            } else {
                alert(res.message);
            }
        });
    }
});
