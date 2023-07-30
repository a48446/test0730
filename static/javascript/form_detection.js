/*
載入pdf檔
*/
var uuid = localStorage.getItem('uuid');
var variable;
fetch("api/document/get_upload_file", {
    body: JSON.stringify({uuid: uuid}),
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
})
    .then(response => response.blob())
    .then(response => {
        const blob = new Blob([response], {type: 'application/pdf'});
        const downloadUrl = URL.createObjectURL(blob);
        showPDF(downloadUrl);
    });
/*
任意區域取消畫布
*/
$(document).mouseup(function (e) {
    var _con = $("#test");
    var _tb = $("#detectedTableSelect");
    var _cell = $("#detectedCellSelect");
    if (!_con.is(e.target) && _con.has(e.target).length === 0 && !_tb.is(e.target) && _tb.has(e.target).length === 0 && !_cell.is(e.target) && _cell.has(e.target).length === 0) {
        $("#test").remove();
        $("#pdfCanvas").attr("style", "display:block");
    }
})
/*
pdf.js
*/
var __PDF_DOC,
    __CURRENT_PAGE,
    __TOTAL_PAGES,
    __PAGE_RENDERING_IN_PROGRESS = 0,
    __CANVAS = $('#pdfCanvas').get(0),
    __CANVAS_CTX = __CANVAS.getContext('2d');

function showPDF(pdf_url) {
    $("#pdfLoader").show();

    PDFJS.getDocument({url: pdf_url}).then(function (pdf_doc) {
        __PDF_DOC = pdf_doc;
        __TOTAL_PAGES = __PDF_DOC.numPages;

        // Hide the pdf loader and show pdf container in HTML
        $("#pdfLoader").hide();
        $("#pdfContents").show();
        $("#pdfTotalPages").text(__TOTAL_PAGES);

        // Show the first page
        showPage(1);
    }).catch(function (error) {
        // If error re-show the upload button
        $("#pdfLoader").hide();
        $("#uploadButton").show();
        alert(error.message);
    });
}

function showPage(page_no) {
    __PAGE_RENDERING_IN_PROGRESS = 1;
    __CURRENT_PAGE = page_no;

    // Disable Prev & Next buttons while page is being loaded
    $("#pdf-next, #pdf-prev").attr('disabled', 'disabled');

    // While page is being rendered hide the canvas and show a loading message
    $("#pdfCanvas").hide();
    $("#pageLoader").show();
    $("#downloadImage").hide();
    $("#downloadImage2").hide();

    // Update current page in HTML
    $("#pdfCurrentPage").text(page_no);

    // Fetch the page
    __PDF_DOC.getPage(page_no).then(function (page) {
        // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
        var scale_required = __CANVAS.width / page.getViewport(1).width;
        variable = scale_required;
        // Get viewport of the page at required scale
        var viewPort = page.getViewport(scale_required);

        // Set canvas height
        __CANVAS.height = viewPort.height;

        var renderContext = {
            canvasContext: __CANVAS_CTX,
            viewport: viewPort
        };

        // Render the page contents in the canvas
        page.render(renderContext).then(function () {
            __PAGE_RENDERING_IN_PROGRESS = 0;

            // Re-enable Prev & Next buttons
            $("#pdf-next, #pdf-prev").removeAttr('disabled');

            // Show the canvas and hide the page loader
            $("#pdfCanvas").show();
            $("#pageLoader").hide();
            $("#downloadImage").show();
            $("#downloadImage2").show();
        });
    });
}

// Upon click this should should trigger click on the #file-to-upload file input element
// This is better than showing the not-good-looking file input element
$("#uploadButton").on('click', function () {
    $("#fileToUpload").trigger('click');
});

// When user chooses a PDF file
$("#fileToUpload").on('change', function () {
    // Validate whether PDF
    if (['application/pdf'].indexOf($("#fileToUpload").get(0).files[0].type) == -1) {
        alert('Error : Not a PDF');
        return;
    }

    $("#uploadButton").hide();
    var a = $("#fileToUpload").get(0);
    // handleFiles(a)

    // Send the object url of the pdf
    showPDF(URL.createObjectURL($("#fileToUpload").get(0).files[0]));


});

// Previous page of the PDF
$("#pdf-prev").on('click', function () {
    if (__CURRENT_PAGE != 1)
        showPage(--__CURRENT_PAGE);
    if (page != 1) {
        page--;
        $("#test").remove();
        $("#pdfCanvas").attr("style", "display:block");
    }
    dealData();
});

// Next page of the PDF
$("#pdf-next").on('click', function () {
    if (__CURRENT_PAGE != __TOTAL_PAGES) {
        showPage(++__CURRENT_PAGE);
    }
    if (page != __TOTAL_PAGES) {
        page++;
        $("#test").remove();
        $("#pdfCanvas").attr("style", "display:block");
    }
    dealData();
});

/*
選擇檔案
*/
function handleFiles(files) {
    $("#uploadButton").hide();
    var a = $("#fileToUpload").get(0);
    showPDF(URL.createObjectURL(files[0]));
}

/*
api匯入和處理座標
*/
let isDrawing = false;
let x = 0;
let y = 0;
const myPics = document.getElementById('pdfCanvas');
const context = myPics.getContext('2d');
//設定初始,改變,和控制api停止
var getAll, changeAll, stopAll = 0;
$.ajax({
    url: "api/document/get_detect_table",
    type: "POST",
    data: JSON.stringify({
        uuid: uuid
    }),
    dataType: "json",
    contentType: "application/json"
}).done(function (res) {
    getAll = JSON.parse(JSON.stringify(res.data));
    changeAll = res.data;
    dealData();
}).catch(error => {
    alert(error.message);
})
/*
資料處理
每換一次page都要執行一次
*/
var tableAccount;

function dealData() {
    tableAccount = 1;
    $("#detectedTableSelect").empty().append("<option>請選擇</option>");
    $("#cellToWhichTable").empty().append("<option>請選擇</option>");
    allTable = Object.getOwnPropertyDescriptor(changeAll, "page" + page).value;
    var allTableKeys = Object.keys(allTable);
    for (var x = 0; x < allTableKeys.length; x++) {
        var tableValue = document.createElement("option");
        var addTableValue = document.createElement("option");
        tableAccount = allTableKeys.length + 1;
        tableValue.setAttribute("id", allTableKeys[x]);
        addTableValue.setAttribute("id", allTableKeys[x]);
        var t = document.createTextNode(allTableKeys[x]);
        var t2 = document.createTextNode(allTableKeys[x]);
        tableValue.append(t);
        addTableValue.append(t2)
        $("#detectedTableSelect").append(tableValue);
        $("#cellToWhichTable").append(addTableValue);
    }
    $("#detectedCellSelect").empty().append("<option disabled selected>請選擇</option>");
}

/*
創造包住cropper的div
*/
function createCanva() {
    const test = document.createElement("div");
    test.id = "test";
    $("#croptest").append(test);
    $("#pdfCanvas").attr("style", "display:none");
}

/*
    表格拉框
*/
var page = 1;
var allTable;
$("#detectedTableSelect").on('change', function () {
    $("#test").remove();
    $("#pdfCanvas").attr("style", "display:block");
    $("#detectedCellSelect").empty().append("<option disabled selected>請選擇</option>");
    createCanva();
    var a = __CANVAS.toDataURL();
    const img = document.createElement("img");

    $(img).attr('src', a);
    $(img).attr("id", "make");
    $("#test").append(img);

    var obj = document.getElementById("detectedTableSelect")
    var index = obj.selectedIndex;
    var iid = obj.options[index].id;
    allTable = Object.getOwnPropertyDescriptor(changeAll, "page" + page).value;
    tableId = Object.getOwnPropertyDescriptor(allTable, iid);
    var leftUp = tableId.value.upper_left;
    var rightUp = tableId.value.upper_right;
    var leftDown = tableId.value.lower_left;
    var rightDown = tableId.value.lower_right;
    $("#leftUp").text("(" + tableId.value.upper_left + ")");
    $("#rightUp").text("(" + tableId.value.upper_right + ")");
    $("#leftDown").text("(" + tableId.value.lower_left + ")");
    $("#rightDown").text("(" + tableId.value.lower_right + ")");
    var cell = Object.keys(tableId.value.cells)
    for (var x = 0; x < cell.length; x++) {
        var tableValue = document.createElement("option");
        tableValue.setAttribute("id", cell[x]);
        var t = document.createTextNode("cell" + cell[x]);
        tableValue.append(t);
        $("#detectedCellSelect").append(tableValue);
    }

    cropperDraw(img, leftUp, rightUp, leftDown, rightDown);
})
/*
    單元格拉框
*/
var tableId;
var cellValue;
$("#detectedCellSelect").on('change', function () {
    $("#display").empty()
    $("#test").remove();
    $("#pdfCanvas").attr("style", "display:block");
    createCanva();
    var a = __CANVAS.toDataURL();
    const img = document.createElement("img");
    $(img).attr('src', a);
    $(img).attr("id", "make");
    $("#test").append(img);
    var obj = document.getElementById("detectedCellSelect")
    var index = obj.selectedIndex;
    var iid = obj.options[index].id;
    var use = Object.values(tableId.value.cells)
    cellValue = Object.getOwnPropertyDescriptor(use, iid);
    var leftUpCell = cellValue.value.upper_left;
    var rightUpCell = cellValue.value.upper_right;
    var leftDownCell = cellValue.value.lower_left;
    var rightDownCell = cellValue.value.lower_right;
    document.getElementById("display").innerText = cellValue.value.content;
    cropperDrawCell(img, leftUpCell, rightUpCell, leftDownCell, rightDownCell);
})

/*
    cropper 畫框
*/
function cropperDraw(img, leftUp, rightUp, leftDown, rightDown) {

    start = leftUp.split(",")[0] / variable;
    start2 = leftUp.split(",")[1] / variable;
    start3 = rightDown.split(",")[0] / variable;
    start4 = rightDown.split(",")[1] / variable;

    cropper = new Cropper(img, {
        aspectRatio: NaN,
        movable: false,
        zoomable: false,
        data: {
            x: start,
            y: start2,
            width: start3 - start,
            height: start4 - start2,
        },

        crop(event) {
            leftUp2 = Math.round((event.detail.x) * variable) + "," + Math.round((event.detail.y) * variable);
            rightUp2 = Math.round((event.detail.x + event.detail.width) * variable) + "," + Math.round((event.detail.y) * variable);
            leftDown2 = Math.round((event.detail.x) * variable) + "," + Math.round((event.detail.y + event.detail.height) * variable);
            rightDown2 = Math.round((event.detail.x + event.detail.width) * variable) + "," + Math.round((event.detail.y + event.detail.height) * variable);

            $("#leftUp").text("(" + leftUp2 + ")");
            $("#leftDown").text("(" + leftDown2 + ")");
            $("#rightUp").text("(" + rightUp2 + ")");
            $("#rightDown").text("(" + rightDown2 + ")");
            tableId.value.upper_left = leftUp2;
            tableId.value.upper_right = rightUp2;
            tableId.value.lower_left = leftDown2;
            tableId.value.lower_right = rightDown2;
        }
    });
}

/*
    cropper 畫Cell框
*/

function cropperDrawCell(img, leftUpCell, rightUpCell, leftDownCell, rightDownCell) {

    start = leftUpCell.split(",")[0] / variable;
    start2 = leftUpCell.split(",")[1] / variable;
    start3 = rightDownCell.split(",")[0] / variable;
    start4 = rightDownCell.split(",")[1] / variable;

    cropper = new Cropper(img, {
        aspectRatio: NaN,
        movable: false,
        zoomable: false,
        data: {
            x: start,
            y: start2,
            width: start3 - start,
            height: start4 - start2,
        },

        crop(event) {
            leftUpCell2 = Math.round((event.detail.x) * variable) + "," + Math.round((event.detail.y) * variable);
            rightUpCell2 = Math.round((event.detail.x + event.detail.width) * variable) + "," + Math.round((event.detail.y) * variable);
            leftDownCell2 = Math.round((event.detail.x) * variable) + "," + Math.round((event.detail.y + event.detail.height) * variable);
            rightDownCell2 = Math.round((event.detail.x + event.detail.width) * variable) + "," + Math.round((event.detail.y + event.detail.height) * variable);
            $("#leftUpCell").text("(" + leftUpCell2 + ")");
            $("#leftDownCell").text("(" + leftDownCell2 + ")");
            $("#rightUpCell").text("(" + rightUpCell2 + ")");
            $("#rightDownCell").text("(" + rightDownCell2 + ")");

            cellValue.value.upper_left = leftUpCell2;
            cellValue.value.upper_right = rightUpCell2;
            cellValue.value.lower_left = leftDownCell2;
            cellValue.value.lower_right = rightDownCell2;
        }
    });
}

/*
    auto save api
*/
var changeFirst = true;
setInterval(function () {
    //表格

    if (changeFirst&&(JSON.stringify(getAll).length === JSON.stringify(changeAll).length)) {

    } else if (JSON.stringify(stopAll).length === JSON.stringify(changeAll).length) {

    } else {
        changeFirst =false;
        stopAll = JSON.parse(JSON.stringify(changeAll))
        var data = changeAll;
        autosave_Detect_Table(data)
    }
}, 750);

function autosave_Detect_Table(data) {

    $.ajax({
        url: "/api/document/autosave_detect_table",
        type: "POST",
        data: JSON.stringify({
            data,
            uuid: uuid,
            page_number: page
        }),
        dataType: "json",
        contentType: "application/json"
    }).done(function (res) {
        if (res.result == 1) {
            alert(res.message);
        }
    });
}

/*
    add table
*/
function add() {
    createCanva();

    const img = document.createElement("img");
    $(img).attr('src', __CANVAS.toDataURL());
    $(img).attr("id", "make");
    $("#test").append(img);

    cropper = new Cropper(img, {
        aspectRatio: NaN,
        movable: false,
        zoomable: false,
        crop(event) {
            leftUpAdd = Math.round((event.detail.x) * variable) + "," + Math.round((event.detail.y) * variable);
            rightUpAdd = Math.round((event.detail.x + event.detail.width) * variable) + "," + Math.round((event.detail.y) * variable);
            leftDownAdd = Math.round((event.detail.x) * variable) + "," + Math.round((event.detail.y + event.detail.height) * variable);
            rightDownAdd = Math.round((event.detail.x + event.detail.width) * variable) + "," + Math.round((event.detail.y + event.detail.height) * variable);
            $("#leftUpAdd").text("(" + leftUpAdd + ")");
            $("#rightUpAdd").text("(" + rightUpAdd + ")");
            $("#leftDownAdd").text("(" + leftDownAdd + ")");
            $("#rightDownAdd").text("(" + rightDownAdd + ")");
        }
    });

    var add_check = true;
    $(document).mouseup(function (e) {
        var _con = $("#test");
        var _tb = $("#detectedTableSelect");
        var _cell = $("#detectedCellSelect");
        if (!_con.is(e.target) && _con.has(e.target).length === 0 && !_tb.is(e.target) && _tb.has(e.target).length === 0 && !_cell.is(e.target) && _cell.has(e.target).length === 0) {
            $("#test").remove();
            $("#pdfCanvas").attr("style", "display:block");
            if (add_check) {
                add_check = false;
                $(".addTable").click();
            }
        }
    })
}

/*
    當你按下新增table的送出
*/
function addTableBtn() {
    if (Object.getOwnPropertyDescriptor(changeAll, "page" + page) == undefined) {
        changeAll["page" + page] = {};
        changeAll["page" + page]["table" + tableAccount] = {
            upper_left: leftUpAdd,
            upper_right: leftDownAdd,
            lower_left: leftDownAdd,
            lower_right: rightDownAdd,
            cells: {},
        };
    } else {
        allTable["table" + tableAccount] = {
            upper_left: leftUpAdd,
            upper_right: leftDownAdd,
            lower_left: leftDownAdd,
            lower_right: rightDownAdd,
            cells: {},
        };
    }

    var obj = document.createElement("option");
    var addTableValues = document.createElement("option");
    obj.setAttribute("id", "table" + tableAccount);
    addTableValues.setAttribute("id", "table" + tableAccount);
    var t = document.createTextNode(obj.id);
    var t2 = document.createTextNode(addTableValues.id);
    obj.append(t);
    addTableValues.append(t2);
    $("#detectedTableSelect").append(obj);
    $("#cellToWhichTable").append(addTableValues);
    tableAccount++;
}

/*
    add cell
*/
function addCell() {
    createCanva();

    const img = document.createElement("img");
    $(img).attr('src', __CANVAS.toDataURL());
    $(img).attr("id", "make");
    $("#test").append(img);

    cropper = new Cropper(img, {
        aspectRatio: NaN,
        movable: false,
        zoomable: false,
        crop(event) {
            leftUpAddCell = Math.round((event.detail.x) * variable) + "," + Math.round((event.detail.y) * variable);
            rightUpAddCell = Math.round((event.detail.x + event.detail.width) * variable) + "," + Math.round((event.detail.y) * variable);
            leftDownAddCell = Math.round((event.detail.x) * variable) + "," + Math.round((event.detail.y + event.detail.height) * variable);
            rightDownAddCell = Math.round((event.detail.x + event.detail.width) * variable) + "," + Math.round((event.detail.y + event.detail.height) * variable);
            $("#leftUpAddCell").text("(" + leftUpAddCell + ")");
            $("#rightUpAddCell").text("(" + rightUpAddCell + ")");
            $("#leftDownAddCell").text("(" + leftDownAddCell + ")");
            $("#rightDownAddCell").text("(" + rightDownAddCell + ")");
        }
    });

    var add_check = true;
    $(document).mouseup(function (e) {
        var _con = $("#test");
        var _tb = $("#detectedTableSelect");
        var _cell = $("#detectedCellSelect");
        var _select = $("#cellToWhichTable");
        if (!_con.is(e.target) && _con.has(e.target).length === 0 &&
            !_tb.is(e.target) && _tb.has(e.target).length === 0 &&
            !_cell.is(e.target) && _cell.has(e.target).length === 0 &&
            !_select.is(e.target) && _select.has(e.target).length === 0) {
            $("#test").remove();
            $("#pdfCanvas").attr("style", "display:block");
            if (add_check) {
                add_check = false;
                $(".addCell").click();
            }
        }
    })
}

/*
    當你按下新增cell的送出
*/
function addCellBtn() {
    var obj = document.getElementById("cellToWhichTable");
    var index = obj.selectedIndex;
    var iid = obj.options[index].id;
    var obj2 = document.getElementById("detectedTableSelect");
    var index2 = obj2.selectedIndex;
    var iid2 = obj2.options[index2].id;
    var use = Object.values(allTable[iid].cells);
    if (use.length == 0) {
        allTable[iid]["cells"] = [{
            name: use.length.toString(),
            upper_left: leftUpAddCell,
            upper_right: leftDownAddCell,
            lower_left: leftDownAddCell,
            lower_right: rightDownAddCell,
            start_row: 0,
            end_row: 0,
            start_col: 2,
            end_col: 2,
            content: ""
        }];
    } else {
        allTable[iid]["cells"][use.length] = {
            name: use.length.toString(),
            upper_left: leftUpAddCell,
            upper_right: leftDownAddCell,
            lower_left: leftDownAddCell,
            lower_right: rightDownAddCell,
            start_row: 0,
            end_row: 0,
            start_col: 2,
            end_col: 2,
            content: ""
        };
    }
    if (iid == iid2) {
        var obj = document.createElement("option");
        obj.setAttribute("id", use.length);
        var t = document.createTextNode("cell" + obj.id);
        obj.append(t);
        $("#detectedCellSelect").append(obj);
    }
}