var flag = 0;
$.ajax({
    url: "api/document/upload_file_option",
    type: "POST",
    async: false,
    data: JSON.stringify({}),
    dataType: "json",
    contentType: "application/json"
}).done(function (res) {

    var clientList = res.data;
    for (client in clientList) {
        for (clientFileType in clientList[client]) {
            $("#dictionarySelect").append("<option value='"+clientFileType+"'>"+clientFileType+"</option>");       
        }
    }
})

$("#dictionarySelect").on('change', function() { //下拉式選單
    var fileType = this.value;
    getDictionaryList(fileType)
});

function getDictionaryList (fileType) { //列表api
    $.ajax({
        url: "api/configuration/get_key_header",
        type: "POST",
        async: false,
        data: JSON.stringify({
            file_type: fileType
        }),
        dataType: "json",
        contentType: "application/json"
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];
            if (flag == 1) {
                $("#dictionaryList2_wrapper").remove();
            }

            var tableTemplate = $('#dictionaryList').clone(true).remove('id').removeClass('display_none').attr("id", "dictionaryList2");

            for (var i = 0; i < res.length; i++) {
                var template = $('#rowSample').clone(true).remove('id').removeClass('display_none');
                $("#dictionaryName", template).html(res[i].header);
                $("#addUser", template).html(res[i].initiator);
                $(".delRow", template).data("header", res[i].header);
                var updateTime = res[i].update_time;
                if (updateTime) {
                    var finalUpdateTime = updateTime.split("T").join(" ");
                } else {
                    var finalUpdateTime = "";
                }
                $("#addTime", template).html(finalUpdateTime);
                $("#rowData", tableTemplate).append(template);
            }
            $("#dictionaryInfo").append(tableTemplate)
            myTable = $('#dictionaryList2').DataTable({
                "info": false,
                "ordering": false,
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
                destroy:true,
                "search": {
                    "addClass": 'form-control input-lg col-xs-12'
                },
                sort: true,
                "pagingType": "simple_numbers",
                "start": 5,
                "length": 7,
            });
            $("#dictionaryList2_filter input").on('keyup', function () {
                var searchTerm = this.value.toLowerCase();
                $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                    //search only in column 0 and 2
                    if (~data[0].toLowerCase().indexOf(searchTerm)) return true;
                    return false;
                })
                myTable.draw();
                $.fn.dataTable.ext.search.pop();
            });
            flag = 1;
        } else {
            alert(res["message"]);
        }
        
        
    })
}
$("#addHeader").on("click", function () { //新增header
    var headerInput = $("#headerInput").val();
    var selectedFileType = $("#dictionarySelect").children("option:selected").val();
    if (selectedFileType == "請選擇檔案類型") {
        $('#createHeader').modal('hide');
        return;
    }
    $("#headerInput").val("");

    $.ajax({
        url: "/api/configuration/add_key_header",
        type: "POST",
        async: false,
        data: JSON.stringify({
            data: [
                {
                    file_type: selectedFileType,
                    header: headerInput
                }
            ]
        }),
        dataType: "json",
        contentType: "application/json"
    }).done(function (res) {
        if (res["result"] == 0) {
            new PNotify({
                title: '成功',
                text: '新增成功',
                type: 'success',
                delay: 500,
                shadow: true
            });
            getDictionaryList(selectedFileType)
        } else {
            alert(res["message"]);
        }
    });
    $('#createHeader').modal('hide');
});

$(".delRow").on("click", function () {//刪除header
    if (confirm('是否確定刪除？')) {
        var delHeader = $(this).data("header");
        var selectedFileType = $("#dictionarySelect").children("option:selected").val();
        myTable.row($(this).parents('tr')).remove().draw();
        $.ajax({
            url: "/api/configuration/delete_key_header",
            type: "POST",
            async: false,
            data: JSON.stringify({
                file_type: selectedFileType,
                header: delHeader
            }),
            dataType: "json",
            contentType: "application/json"
        }).done(function (res) {
            if (res["result"] == 0) {
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