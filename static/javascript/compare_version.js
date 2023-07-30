var uuid = localStorage.getItem('uuid');
var page = 0;
var version_id = 0;
var herstoryAllValue = 0;
var startAllValue = 0;
var getAllValue = 0;
var stopAll = 0;
var flagIn = 0;
var flagCurrentHeader = 0;
var flagCompareHeader = 0;
var pageZeroHeader = 0;
var pageZeroStart = 0;
var zeroHeaders = 0;
var totalPage = 0;
var versionFlag = 0;
var nanFlag = 0;
var apidata = {
    "uuid": uuid,
    "page_number": page
}
get_key_value(uuid);
function get_key_value() {
    $.ajax({
        url: "api/document/get_key_value",
        type: "POST",
        async: false,
        data: JSON.stringify(apidata),
        dataType: "json",
        contentType: "application/json"
    }).done(function (res) { 
        //version start
        if (versionFlag == 0) {
            $("#VersionSelect").append("<option value='"+ res.model_name +"' selected>"+ res.model_name +"</option>");
            for (var l = 0; l < res.model_list.length; l++) {
                $("#VersionSelect").append("<option value='"+ res.model_list[l] +"'>"+ res.model_list[l] +"</option>");
            }
            versionFlag = 1;
        }
        
        //version end
        $("#pageNumber").append("第" +page+ "頁");
        if (page == 0) {
            pageZeroHeader = JSON.parse(JSON.stringify(res.data.current));
            pageZeroStart = res.data.current;
            zeroHeaders = pageZeroHeader["page0"];
        }

        // for (zeroHeader in zeroHeaders) {
        if (flagCurrentHeader == 0 && page == 0) {
            // Current header辨識結果 start
            var header = zeroHeaders["table1"]["header"];
            for (var i = 0; i < header.length; i++) {
                var currentHeaderSample = $("#currentHeaderSample").clone(true).addClass("d-block").removeClass("display_none");
                if (header[i].mark == 1) {
                    // current_real_key with color
                    $(".current_key", currentHeaderSample).html(header[i].key).attr("style", "background-color: skyblue");
                    $(".current_value", currentHeaderSample).html(header[i].value).attr("style", "background-color: skyblue");
                    $("#currentVersionTableList").append(currentHeaderSample);
                } else {
                    // current_real_key without color
                    $(".current_key", currentHeaderSample).html(header[i].key);
                    $(".current_value", currentHeaderSample).html(header[i].value);
                    $("#currentVersionTableList").append(currentHeaderSample);
                }

            }
            $("#headerFourUp").removeClass("display_none").addClass("d-flex");
            flagCurrentHeader = 1;
            // Current header辨識結果 end
        }
        // }
        if (page == 0 && flagIn == 0) {
            totalPage = Object.keys(res.data.current).length; //if page == 0 && flagin == 0
            console.log(totalPage)
            var tableListForHeader = res["data"]["current"]["page0"];
            var header2 = tableListForHeader["table1"]["header"];
            for (var i = 0; i < header2.length; i++) {
                var headerSample = $("#headerSample").clone(true).addClass("d-block").removeClass("display_none");
                $("#spanKey", headerSample).html(header2[i].real_key).attr("title", header2[i].real_key);
                $(".inputKey", headerSample).val(header2[i].key).attr("data-page", "page0").attr("data-table", "table1").attr("data-row", i).attr("data-key", "key");
                $(".inputValue", headerSample).val(header2[i].value).attr("data-page", "page0").attr("data-table", "table1").attr("data-row", i).attr("data-key", "value");
                $("#headerFourUp").append(headerSample);
            }
            flagIn = 1;
        }
        getAllValue = JSON.parse(JSON.stringify(res.data.current));
        herstoryAllValue = res.data.history;
        startAllValue = res.data.current
        var pageN = "page" + page;
        var tableList = res["data"]["current"][pageN];
        var historyList = res["data"]["history"][pageN];

        for (table in tableList) {
            // current version start
            $("#currentVersionTableList").append("<table border=1 id=" + table + " class='mb-4 mt-1'></table>");
            var items = tableList[table]["items"];
            var currentLenArray = [];
            var needRowspan = false;
            var objCurrentLen;
            var objCurrentName;
            var currentColSpan;
            var currentColSpanName;
            var currentMaxLength;
            $("#" + table + "").append("<thead></thead><tbody></tbody>");

            for (need in items) { //判斷欄位是否需要 rowspan 合併儲存格及尋找最長陣列
                if (items[need].length == undefined) {
                    needRowspan = true;
                    objCurrentLen = Object.keys(items[need]).length;
                    objCurrentName = Object.keys(items[need]);
                    for (spanLen in items[need]) {
                        currentLenArray.push(items[need][spanLen].length);
                    }
                } else {
                    currentLenArray.push(items[need].length);
                }
            }

            $("#" + table + " thead").append("<tr></tr>");
            for (i in items) { //製作標題欄位
                if (items[i].length == undefined) {
                    currentColSpan = Object.keys(items[i]).length;
                    currentColSpanName = Object.keys(items[i]);
                    $("#" + table + " thead tr").eq(0).append("<th colspan=" + currentColSpan + ">" + i + "</th>");
                    for (var j = 0; j < currentColSpanName.length; j++) {
                        if (j == 0) {
                            $("#" + table + " thead").append("<tr id=aa></tr>");
                        }
                        $("#aa").append("<th>" + currentColSpanName[j] + "</th>");
                    }
                } else {
                    if (needRowspan == true) {
                        $("#" + table + " thead tr").eq(0).append("<th rowspan=2>" + i + "</th>");
                    } else {
                        $("#" + table + " thead tr").eq(0).append("<th>" + i + "</th>");
                    }
                }
            }
            currentMaxLength = Math.max.apply(null, currentLenArray);//最長陣列
            for (var k = 0; k < currentMaxLength; k++) {
                $("#" + table + " tbody").append("<tr id=currentData" + (k + 1) + "></tr>");
            }
            for (j in items) {
                if (items[j].length == undefined) {
                    for (c in items[j]) {
                        for (var v = 0; v < currentMaxLength; v++) {
                            if (items[j][c][v].mark == 1) {
                                $("#" + table + " #currentData" + (v + 1) + "").append("<td style='background-color:skyeblue'>" + items[j][c][v].value + "</td>"); //資料寫入顏色
                            } else {
                                $("#" + table + " #currentData" + (v + 1) + "").append("<td>" + items[j][c][v].value + "</td>"); //資料寫入
                            }
                        }
                    }
                } else {
                    for (var g = 0; g < currentMaxLength; g++) {
                        if (items[j][g] == "NaN" && nanFlag == 0) {
                            nanFlag == 1;
                            alert("column 內容異常");
                        }
                        if (items[j][g].mark == 1) {
                            $("#" + table + " #currentData" + (g + 1) + "").append("<td data-key='" + items[j][g].key + "' style='background-color: skyblue'>" + items[j][g].value + "</td>") //資料寫入
                        } else {
                            $("#" + table + " #currentData" + (g + 1) + "").append("<td>" + items[j][g].value + "</td>"); //資料寫入
                        }
                    }
                }
            }
            // current version end

            // 詢問是否移除 start

            $("#askDeleteTableList").append("<table class='table mb-3 pb-3' id=askDelete" + table + "></table>");

            var askLengthArray = [];
            var askNeedRowspan = false;
            var askColSpan;
            var askColSpanName;
            var askMaxLength;
            $("#askDelete" + table + "").append("<thead></thead><tbody></tbody>");
            var objLen = Object.keys(items).length;
            var objName = Object.keys(items);

            for (askNeed in items) {
                if (items[askNeed].length == undefined) {
                    askNeedRowspan = true;
                    for (askSpanLen in items[askNeed]) {
                        askLengthArray.push(items[askNeed][askSpanLen].length);
                    }
                } else {
                    askLengthArray.push(items[askNeed].length);
                }
            }

            $("#askDelete" + table + " thead").append("<tr></tr>");
            for (i in items) { //製作標題欄位
                if (items[i].length == undefined) {
                    askColSpan = Object.keys(items[i]).length;
                    askColSpanName = Object.keys(items[i]);
                    $("#askDelete" + table + " thead tr").eq(0).append("<th colspan=" + askColSpan + " class=align-middle scope=col>" + i + "</th>");
                    for (var j = 0; j < askColSpanName.length; j++) {
                        if (j == 0) {
                            $("#askDelete" + table + " thead").append("<tr id=askcol" + table + "></tr>");
                        }
                        $("#askcol" + table + "").append("<th data-key='" + i + "'>" + askColSpanName[j] + "<button class='btn del_col_colspan'><i type=button class='fas fa-times delete_icon'></i></button></th>");
                    }
                } else {
                    if (askNeedRowspan == true) {
                        $("#askDelete" + table + " thead tr").eq(0).append("<th class=align-middle scope=col rowspan=2>" + i + "<button class='btn del_col_rowspan'><i type=button class='fas fa-times delete_icon'></i></button></th>");
                    } else {
                        $("#askDelete" + table + " thead tr").eq(0).append("<th>" + i + "<button class='btn del_col'><i type=button class='fas fa-times delete_icon'></i></button></th>");
                    }
                }
            }
            askMaxLength = Math.max.apply(null, askLengthArray);//最長陣列

            for (var k = 0; k < askMaxLength; k++) {
                $("#askDelete" + table + " tbody").append("<tr id=askData" + (k + 1) + "></tr>");
            }

            for (j in items) {
                if (items[j].length == undefined) {
                    for (c in items[j]) {
                        for (var v = 0; v < askMaxLength; v++) {
                            $("#askDelete" + table + " #askData" + (v + 1) + "").append("<td contenteditable='true'><input data-table='" + table + "' data-keymom='" + j + "' data-key='" + c + "' data-row='" + v + "' value='" + items[j][c][v].value + "' class='form-control' oninput='OnInput (event)'></td>"); //資料寫入
                        }
                    }
                } else {
                    for (var g = 0; g < askMaxLength; g++) {
                        if (g < items[j].length) {
                            $("#askDelete" + table + " #askData" + (g + 1) + "").append("<td><input data-table='" + table + "' data-key='" + items[j][g].key + "' data-row='" + g + "' value='" + items[j][g].value + "' class='form-control' oninput='OnInput (event)'></td>"); //資料寫入
                        } else {
                            $("#askDelete" + table + " #askData" + (g + 1) + "").append("<td><input data-table='" + table + "' data-key='" + items[j][0].key + "' data-row='" + g + "' oninput='OnInput (event)' type=text class='form-control'></td>"); //資料寫入
                        }
                    }
                }
            }
            var checkIfEmpty = Object.keys(tableList[table]["items"]).length;
            if (checkIfEmpty != 0) {
                $.each($("#askDelete" + table + " tbody tr"), function (i, val) {
                    var tdAdd = $(this).children().length;

                    if ($(this).children().length != objLen) {
                        for (var y = 0; y < objLen - tdAdd; y++) {
                            $(this).append("<td></td>");
                        }
                    }
                    $(this).prepend('<td><button class="btn del_row" ><i type=button class="fas fa-times delete_icon"></i></button></td>');
                });
                if (askNeedRowspan == true) {
                    $("#askDelete" + table + " thead tr").eq(0).prepend("<th scope=col class=option_row rowspan=2>是否移除<div style='display:inline'><button style='display:inline' class='btn add_row'><i class='fa-5x fas fa-plus mt-3 add_icon'></i></button><button style='display:inline' class='btn add_col' data-toggle='modal' data-target='#exampleModal'><i class='fas fa-plus mt-3 add_icon'></i></button></div></th>");
                } else {
                    $("#askDelete" + table + " thead tr").prepend("<th scope=col class=option_row>是否移除<div><button style='display:inline' class='btn add_row'><i class='fa-5x fas fa-plus mt-3 add_icon'></i></button><button style='display:inline' class='btn add_col' data-toggle='modal' data-target='#exampleModal'><i class='fas fa-plus mt-3 add_icon'></i></button></div></th>");
                }
            }
            // 詢問是否移除 end

        }

        for (herstory in historyList) {
            if (flagCompareHeader == 0 && page == 0) {
                //compare version header start
                var header = historyList[herstory]["header"];
                for (var i = 0; i < header.length; i++) {
                    var compareHeaderSample = $("#compareHeaderSample").clone(true).addClass("d-block").removeClass("display_none");
                    $(".compare_key", compareHeaderSample).html(header[i].key);
                    $(".compare_value", compareHeaderSample).html(header[i].value);
                    $("#compareVersionTableList").append(compareHeaderSample);
                }
                $("#headerFourUp").removeClass("display_none").addClass("d-flex");
                //compare version header end
                flagCompareHeader = 1;
            }
            

            items2 = historyList[herstory]["items"];

            // compare version start
            $("#compareVersionTableList").append("<table border=1 id=compare" + herstory + " class='mb-4 mt-1'></table>");
            $("#compare" + herstory + "").append("<thead></thead><tbody></tbody>");
            var compareLenArray = [];
            var needRowspanCom = false;
            var objCompareLen;
            var objCompareName;
            var compareColSpan;
            var compareColSpanName;
            var compareMaxLength;
            for (need in items2) { //判斷欄位是否需要 rowspan 合併儲存格及尋找最長陣列
                if (items2[need].length == undefined) {
                    needRowspanCom = true;
                    objCompareLen = Object.keys(items2[need]).length;
                    objCompareName = Object.keys(items2[need]);
                    for (spanLen in items2[need]) {
                        compareLenArray.push(items2[need][spanLen].length);
                    }
                } else {
                    compareLenArray.push(items2[need].length);
                }
            }
            $("#compare" + herstory + " thead").append("<tr></tr>");
            for (i in items2) { //製作標題欄位
                if (items2[i].length == undefined) {
                    compareColSpan = Object.keys(items2[i]).length;
                    compareColSpanName = Object.keys(items2[i]);
                    $("#compare" + herstory + " thead tr").eq(0).append("<th colspan=" + compareColSpan + ">" + i + "</th>");
                    for (var j = 0; j < compareColSpanName.length; j++) {
                        if (j == 0) {
                            $("#compare" + herstory + " thead").append("<tr id=comcol></tr>");
                        }
                        $("#comcol").append("<th>" + compareColSpanName[j] + "</th>");
                    }
                } else {
                    if (needRowspanCom == true) {
                        $("#compare" + herstory + " thead tr").eq(0).append("<th rowspan=2>" + i + "</th>");
                    } else {
                        $("#compare" + herstory + " thead tr").eq(0).append("<th>" + i + "</th>");
                    }
                }
            }
            compareMaxLength = Math.max.apply(null, compareLenArray);//最長陣列
            for (var k = 0; k < compareMaxLength; k++) {
                $("#compare" + herstory + " tbody").append("<tr id=compareData" + (k + 1) + "></tr>");
            }
            for (j in items2) {
                if (items2[j].length == undefined) {
                    for (c in items2[j]) {
                        for (var v = 0; v < compareMaxLength; v++) {
                            if (items2[j][c][v].mark == 1) {
                                $("#compare" + herstory + " #compareData" + (v + 1) + "").append("<td>" + items2[j][c][v].value + "</td>"); //資料寫入
                            } else {
                                $("#compare" + herstory + " #compareData" + (v + 1) + "").append("<td>" + items2[j][c][v].value + "</td>"); //資料寫入
                            }
                        }
                    }
                } else {
                    for (var g = 0; g < compareMaxLength; g++) {
                        if (items2[j][g].mark == 1) {
                            $("#compare" + herstory + " #compareData" + (g + 1) + "").append("<td>" + items2[j][g].value + "</td>"); //資料寫入
                        } else {
                            $("#compare" + herstory + " #compareData" + (g + 1) + "").append("<td>" + items2[j][g].value + "</td>"); //資料寫入
                        }
                    }
                }
            }
        }
    })
}


//刪除 row
$(document).on('click', '.del_row', function () {
    var trindex = $(this).closest("tr").index();
    var delRowTable = $(this).closest('table').attr('id');
    delRowTable = delRowTable.replace(/[^0-9]/ig, "");
    $(this).closest('tr').find('td input').each(function () {
        var datamom = $(this).attr('data-keymom');
        var datakey = $(this).attr('data-key');
        if ($(this).attr('data-keymom') == undefined) {

            delete getAllValue["page" + page + ""]["table" + delRowTable + ""]["items"][datakey][trindex];
            getAllValue["page" + page + ""]["table" + delRowTable + ""]["items"][datakey] = getAllValue["page" + page + ""]["table" + delRowTable + ""]["items"][datakey].filter(el => {
                return el != null && el != '';
            });

        }
        else {
            delete getAllValue["page" + page + ""]["table" + delRowTable + ""]["items"][datamom][datakey][trindex];
            getAllValue["page" + page + ""]["table" + delRowTable + ""]["items"][datamom][datakey] = getAllValue["page" + page + ""]["table" + delRowTable + ""]["items"][datamom][datakey].filter(el => {
                return el != null && el != '';
            });
        }
    })
    $(this).parents("tr").remove();
});

//刪除 col
$(document).on('click', '.del_col', function () {
    var index = this.closest('th').cellIndex;
    var delColName = $(this).closest('th').text();
    var delColTable = $(this).closest('table').attr('id');
    delColTable = delColTable.replace(/[^0-9]/ig, "");
    delete getAllValue["page" + page + ""]["table" + delColTable + ""]["items"]["" + delColName + ""];
    $(this).closest('table').find('tr').each(function () {
        this.removeChild(this.cells[index]);
    });
});

//刪除 col with rowspan
$(document).on('click', '.del_col_rowspan', function () {
    var index = this.closest('th').cellIndex;
    var delColName = $(this).closest('th').text();
    var delColTable = $(this).closest('table').attr('id');
    delColTable = delColTable.replace(/[^0-9]/ig, "");
    $(this).closest('table').find('tbody tr').each(function () {
        this.removeChild(this.cells[index]);
    });
    $(this).closest('th').remove();
    delete getAllValue["page" + page + ""]["table" + delColTable + ""]["items"]["" + delColName + ""];
});

//刪除 col with colspan
$(document).on('click', '.del_col_colspan', function () {
    var titlewithoutcol = 0;
    var titlewithrow = 0;
    var samekey = $(this).closest('th').attr("data-key");
    var index = this.closest('th').cellIndex;
    var delColName = $(this).closest('th').text();
    var delColTable = $(this).closest('table').attr('id');
    var delKeyMom = $(this).closest('th').attr("data-key");
    delColTable = delColTable.replace(/[^0-9]/ig, "");
    $(this).closest('table').find('thead tr').eq(0).find('th').each(function () {
        if ($(this).text() == samekey) {
            var span = $(this).attr("colspan")
            $(this).attr("colspan", span - 1)
        }
    });
    $(this).closest('table').find('thead tr th').each(function () {
        if ($(this).attr('colspan') == undefined) {
            titlewithoutcol++;
        }
        if ($(this).attr('rowspan') != undefined) {
            titlewithrow++;
        }
    });
    titlewithoutcol = titlewithoutcol - 1;
    titlewithrow = titlewithrow - 1;
    $(this).closest('table').find('tbody tr').each(function () {
        this.removeChild(this.cells[index + titlewithrow + 1]);
    });
    $(this).closest('th').remove()
    delete getAllValue["page" + page + ""]["table" + delColTable + ""]["items"]["" + delKeyMom + ""]["" + delColName + ""];
});


function OnHeaderInput(event) {
    if (page ==0) {
        var keyOrValue = $(event.target).attr('data-key');
        if (keyOrValue == "key") {
            var dataRow = $(event.target).attr('data-row');
            getAllValue["page" + page + ""][table]["header"][dataRow].key = event.target.value;

        } else if (keyOrValue == "value") {
            var dataRow = $(event.target).attr('data-row');
            getAllValue["page" + page + ""][table]["header"][dataRow].value = event.target.value;
        }
    } else {
        var keyOrValue = $(event.target).attr('data-key');
        if (keyOrValue == "key") {
            var dataRow = $(event.target).attr('data-row');
            pageZeroHeader["page0"]["table1"]["header"][dataRow].key = event.target.value;
        } else if (keyOrValue == "value") {
            var dataRow = $(event.target).attr('data-row');
            pageZeroHeader["page0"]["table1"]["header"][dataRow].value = event.target.value;
        }
    }

    
}

function OnInput(event) {
    var table = $(event.target).attr('data-table');
    var key = $(event.target).attr('data-key');
    var haveDataMom = $(event.target).attr('data-keymom');
    var index = $(event.target).closest("tr").index();
    if (haveDataMom != undefined) {
        getAllValue["page" + page + ""][table]["items"][haveDataMom][key][index].value = event.target.value;
    } else {
        getAllValue["page" + page + ""][table]["items"][key][index].value = event.target.value;
    }
}

$(document).on('click', 'table td input', function () {
    var tr = $(this).closest('tr');
    var column_num = parseInt($(this).parent().index()) - 1;
    var row_num = tr.index();
    var editTable = $(this).closest('table').attr('id');
    editTable = editTable.replace(/[^0-9]/ig, "");
    var edit_Row_Name = $(this).closest('td').attr('data-key');
    localStorage.setItem("edit_row", row_num);
    localStorage.setItem("edit_column", column_num);
    localStorage.setItem("edit_page", editTable);
    localStorage.setItem("edit_Row_Name", edit_Row_Name);
});
//version onchange start
$("#VersionSelect").on('change', function() {
    flagIn = 0;
    var model_name = this.value;
    page = 0;
    apidata = {
        "uuid" : uuid,
        "page_number" : page,
        "model_name" : model_name
    }
    $("#headerFourUp").empty();
    $("#currentVersionTableList").empty();
    $("#compareVersionTableList").empty();
    $("#askDeleteTableList").empty();
    $("#pageNumber").empty();
    get_key_value();
});
//version onchange end
// 上一頁
$(".prev_page").click(function () {
    if (page == 0) {
        alert("第一頁!!");
        return
    } else {
        flagCurrentHeader = 0;
        flagCompareHeader = 0;
        page--
        apidata.page_number--
        $("#currentVersionTableList").empty();
        $("#compareVersionTableList").empty();
        $("#askDeleteTableList").empty();
        $("#pageNumber").empty();
        get_key_value();
    }
});
// 下一頁
$(".next_page").click(function () {
    if (page == (totalPage - 1)) {
        alert("最後一頁!!");
        return
    }
    flagCurrentHeader = 0;
    flagCompareHeader = 0;
    page++
    apidata.page_number++
    $("#currentVersionTableList").empty();
    $("#compareVersionTableList").empty();
    $("#askDeleteTableList").empty();
    $("#pageNumber").empty();
    get_key_value();
});
// 新增Row
$("#clickAddRow").click(function () {
    var addNumTable = $("#askHowMany").val();
    var dataAddId = $("#askDeletetable" + addNumTable + " tbody tr").length
    dataAddId++;
    var arr = [];
    var addRowTemplate = $("#askDeletetable" + addNumTable + " #askData1").clone(true).removeAttr("id", "none").attr("id", "askData" + dataAddId + "");
    $.each(addRowTemplate, function () {
        $(this).find("td input").val("").attr("data-row", dataAddId - 1);
    });
    $("#askcoltable" + addNumTable + "").find('th').each(function () {

        var keymom = $(this).attr("data-key");
        var datakey = $(this).text();
        getAllValue["page" + page + ""]["table" + addNumTable + ""]["items"][keymom][datakey].push({ value: "", key: "" });
    });
    $("#askDeletetable" + addNumTable + " thead").find('th').each(function () {
        if ($(this).attr("rowspan") != undefined) {
            arr.push($(this).text());
        }
    })
    arr.shift()
    for (var i = 0; i < arr.length; i++) {
        getAllValue["page" + page + ""]["table" + addNumTable + ""]["items"][arr[i]].push({ value: "", key: "" });
    }
    if (arr.length == 0) {
        for (i in getAllValue["page" + page + ""]["table" + addNumTable + ""]["items"]) {
            getAllValue["page" + page + ""]["table" + addNumTable + ""]["items"][i].push({ value: "", key: "" });
        }
    }
    $("#askDeletetable" + addNumTable + " tbody").append(addRowTemplate);
    $('#exampleModal').modal('hide');
});
//add row new
$(document).on('click', '.add_row', function () {
    var table = $(this).closest("table").attr("id");
    var tableNumber = $(this).closest("table").attr("id").replace(/[^0-9]/ig, "");
    var rowTemplate = $("#" + table + " tbody").find("tr").eq(0).clone(true).removeAttr("id", "none");
    $.each(rowTemplate, function () {
        $(this).find("td input").val("");
    });
    var datakey = $(this).closest("table").find("tbody tr").eq(0).find("input");
    $.each(datakey, function () {
        var key = $(this).attr("data-key");
        getAllValue["page" + page + ""]["table" + tableNumber + ""]["items"][key].push({
            key: key,
            value: "",
            key_end_col: 0,
            key_end_row: 0,
            key_start_col: 0,
            key_start_row: 0,
            key_type: "data",
            mark: 0,
            value_end_col: 0,
            value_end_row: 0,
            value_start_col: 0,
            value_start_row: 0,
            value_type: "data",

        });

    });
    $("#" + table + " tbody").append(rowTemplate[0])
});

//add column
$(document).on('click', '.add_col', function () {
    var table = $(this).closest("table").attr("id");
    var collength = $(this).closest("table").find("tbody tr").length
    localStorage.setItem("addcoltable", table);
    localStorage.setItem("addcollength", collength);
});

$(document).on('click', '#add_col_comfirm', function () {
    var colName = $("#colName").val();
    var obj = {};
    var arr = [];
    $('#exampleModal').modal('hide');
    var table = localStorage.getItem("addcoltable");
    var collength = localStorage.getItem("addcollength");
    var tableNum = table.replace(/[^0-9]/ig, "");
    $("#" + table + " thead tr").append("<th>" + colName + "<button class='btn del_col'><i type=button class='fas fa-times delete_icon'></i></button></th>");
    $("#askDeletetable" + tableNum + " tbody").find('tr').each(function (i) {
        $(this).append("<td><input data-table='table" + tableNum + "' data-key='" + colName + "' data-row='" + i + "' class='form-control' oninput='OnInput (event)'></td>");
        // getAllValue
        arr.push({
            "key_start_row": 0,
            "key_end_row": 0,
            "key_start_col": 0,
            "key_end_col": 0,
            "value_start_row": 0,
            "value_end_row": 0,
            "value_start_col": 0,
            "value_end_col": 0,
            "mark": 0,
            "key": colName,
            "key_type": "header",
            "value_type": "data",
            "value": ""
        })
    });
    obj[colName] = arr;
    Object.assign(getAllValue["page" + page + ""]["table" + tableNum + ""]["items"], obj);
})
/*
    auto save api
*/

setInterval(function () {
    var getAllLength = JSON.stringify(getAllValue).length;
    var startAllLength = JSON.stringify(startAllValue).length;
    if (getAllLength !== startAllLength) {
        startAllValue = JSON.parse(JSON.stringify(getAllValue));
        var history = herstoryAllValue;
        var current = getAllValue;
        autosave_Detect_Table(current, history);
        function autosave_Detect_Table(current, history) {
            $.ajax({
                url: "api/document/autosave_key_value",
                type: "POST",
                data: JSON.stringify({
                    data: current, // Format to be revised
                    uuid: uuid,
                    page_number: page
                }),

                dataType: "json",
                contentType: "application/json"
            }).done(function (res) {
            });
        }

    }
    var pageZeroHeaderLength = JSON.stringify(pageZeroHeader).length;
    var pageZeroStartLength = JSON.stringify(pageZeroStart).length;
    if (pageZeroHeaderLength !== pageZeroStartLength) {
        pageZeroStart = JSON.parse(JSON.stringify(pageZeroHeader));
        var history = herstoryAllValue;
        var headerCurrent = pageZeroHeader;
        autosave_Header(current);
        function autosave_Header(current, history) {
            $.ajax({
                url: "api/document/autosave_key_value",
                type: "POST",
                data: JSON.stringify({
                    data: headerCurrent, // Format to be revised
                    uuid: uuid,
                    page_number: 0
                }),

                dataType: "json",
                contentType: "application/json"
            }).done(function (res) {
                
            });
        }

    }
}, 750);

$("#exportFile").on("click", function () {
    askExportData = {
        "uuid": uuid,
        "overwrite": 0
    }
    askExport();
    var yes = confirm("確定要匯出?")
        if(yes) {
            askExportData.overwrite = 1;
            askExport();
        }
});

function askExport () {
    $.ajax({
        url: "api/document/export",
        type: "POST",
        async: false,
        data: JSON.stringify(askExportData),
        dataType: "json",
        contentType: "application/json"
    }).fail(function (xhr) {
   
    })
}
// left and right scroll start
var l=document.querySelector('.current_version');
var r=document.querySelector('.compare_version');
l.addEventListener('scroll', function () {
  r.scrollTop = l.scrollTop;
});
r.addEventListener('scroll', function () {
    l.scrollTop = r.scrollTop;
});
// left and right scroll end