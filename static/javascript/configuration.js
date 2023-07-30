var flag = false;
var newId = 0;
var ruleTitle = [];
var ruleDoc = [];
var oldData = null;
var optionData = {};
var sFlag = true;
var temporartilyData = [];
var saveCount = 0;
var initialdata = [];
var currentData = [];
var titleTemporartilyData = 0;
// TODO session拿不到vendor
var vendorVal = "PRL";
// TODO configuration 不會有fileType
var filetypeVal = "TechPack";
var nowData = null;
var compareData = null;
var checkBoxFalg = false;
//拿取選項api
function getErpKey(vendor) {
    checkBoxFalg = false;
    $.ajax({
        url: "/api/document/get_key_value_mapping",
        type: "POST",
        data: JSON.stringify({
            vendor: vendorVal,
            file_type: filetypeVal
        }),
        dataType: "json",
        contentType: "application/json"
    }).done(function (res) {
   
        let mappingDict = {};
        let _key = "";
        for (let idx in res["data"]) {
            _key = res["data"][idx]["field"];
            if(_key == null || _key == "null"){
                _key = "0.0";
            }
            if (!(_key in mappingDict)) {
                mappingDict[_key] = {};
                mappingDict[_key] = res["data"][idx];
            }
        }

        // oldData = mappingDict;
        delete res["message"]
        delete res["result"]
        oldData =  res
        
        ruleTitle = Object.keys(mappingDict);

        for (var i = 0; i < ruleTitle.length; i++) {
            _key = ruleTitle[i];
            ruleDoc.push(mappingDict[_key]["fieldvalue"]);

            newId++;
            flag = true;
            var divRow = document.createElement("div");
            var divStr = document.createElement("div");
            var divContent = document.createElement("div");
            var label = document.createElement("label");
            var checkBox = document.createElement("input");
            var select = document.createElement("select");
            var emptyDiv1 = document.createElement("div");
            var emptyDiv2 = document.createElement("div");
            var deleteDiv = document.createElement("div");
            var deleteIcon = document.createElement("p");

            $(deleteIcon).text("X")
            
            $(deleteIcon).attr({
                id: "de"+(i+1),
                onclick:"deleteRule("+(i+1)+")"
            });

            $(divRow).attr({
                id:"row"+(i+1),
                class: "row align-self-center",
            });

            $(emptyDiv1).attr({
                class: "col-1 ",
            });

            $(emptyDiv2).attr({
                class: "col-1 ",
            });

            $(divStr).attr({
                class: "col-3 mt-4 border-left border-top border-bottom bg_FCFCFC",
            });

            $(divContent).attr({
                class: "col-6 mt-4 pt-3 pb-3 border-right border-top border-bottom bg_FCFCFC",
            });

            $(deleteDiv).attr({
                class: "col-1 mt-4 pt-4 pl-5 border-top border-bottom bg_FCFCFC",
            });
           
            $(label).attr({
                class: "text-dark pl-2 pt-4 pb-3",
            });

            $(checkBox).attr({
                type: "checkbox",
            });

            $(select).attr({
                class: "form-control selectOption",
                id: "num" + newId,
            });

            $(label).text(_key);
            $(label).attr("for", _key);
            // 表示被選為版本識別的欄位
            if (mappingDict[_key]["version_check"]) {
                $(checkBox).prop("checked", true);
            }
            $(checkBox).attr("value", _key);
            $(checkBox).attr("id", _key);
            $(divContent).append(select);
            $(divStr).append(checkBox);
            $(divStr).append(label);
            $(deleteDiv).append(deleteIcon);
            $(divRow).append(emptyDiv1);
            $(divRow).append(divStr);
            $(divRow).append(divContent);
            $(divRow).append(divContent);
            $(divRow).append(deleteDiv);
            $(divRow).append(emptyDiv2);
            $("#list").append(divRow);

            $("#addName").val();
            doSelect2(ruleDoc[i]);

        }

    });
}

//新增規則功能
$('#addTOList').on('click', function () {

    newId++;
    flag = true;
    var divRow = document.createElement("div");
    var divStr = document.createElement("div");
    var divContent = document.createElement("div");
    var label = document.createElement("label");
    var checkBox = document.createElement("input");
    var select = document.createElement("select");
    var emptyDiv1 = document.createElement("div");
    var emptyDiv2 = document.createElement("div");
    var deleteDiv = document.createElement("div");
    var deleteIcon = document.createElement("p");
    $(deleteIcon).text("X")
            
    $(deleteIcon).attr({
        id: "de"+newId,
        onclick:"deleteRule("+newId+")"
    });

    $(divRow).attr({
        id:"row"+newId,
        class: "row align-self-center",
    });

    $(emptyDiv1).attr({
        class: "col-1 ",
    });

    $(emptyDiv2).attr({
        class: "col-1 ",
    });

    $(divStr).attr({
        class: "col-3 mt-4 border-left border-top border-bottom bg_FCFCFC",
    });

    $(divContent).attr({
        class: "col-6 mt-4 pt-3 pb-3 border-right border-top border-bottom bg_FCFCFC",
    });

    $(deleteDiv).attr({
        class: "col-1 mt-4 pt-4 pl-5 border-top border-bottom bg_FCFCFC",
    });

    $(label).attr({
        class: "text-dark pl-2 pt-4 pb-3",
    });

    $(checkBox).attr({
        type: "checkbox",
    });

    $(select).attr({
        class: "form-control selectOption",
        id: "num" + newId,
    });

    if ($("#addName").val() != "") {
        $(label).text($("#addName").val());
        $(label).attr("for", $("#addName").val());
        $(checkBox).attr("value", $("#addName").val());
        $(checkBox).attr("id", $("#addName").val());
        $(divContent).append(select);
        $(divStr).append(checkBox);
        $(divStr).append(label);
        $(deleteDiv).append(deleteIcon);
        $(divRow).append(emptyDiv1);
        $(divRow).append(divStr);
        $(divRow).append(divContent);
        $(divRow).append(deleteDiv);
        $(divRow).append(emptyDiv2);
        $("#list").append(divRow);
    }

    doSelect2();

    var contentH = $(".content").height();
    $("#list").scrollTop(contentH + 9999);
    
});

//Select2套件功能
function doSelect2(option) {

    if (option != undefined) {
        var allOption = [];
        for (var i = 0; i < option.length; i++) {
            allOption.push({id: (i + 1), text: option[i]});
        }

        if (flag) {
            $("#num" + newId).select2({
                language: 'zh-TW',
                width: '100%',
                // 最多字元限制
                maximumInputLength: 10,
                // 最少字元才觸發尋找, 0 不指定
                minimumInputLength: 0,
                // 當找不到可以使用輸入的文字
                tags: true,
                multiple: "multiple",
                data: allOption,

            });

            var checked = []
            for (var i = 0; i < allOption.length; i++) {
                checked.push((i + 1).toString());
            }
            $("#num" + newId).val(checked).trigger("change");

        }
    } else {
        if (flag) {
            $("#num" + newId).select2({
                language: 'zh-TW',
                width: '100%',
                // 最多字元限制
                maximumInputLength: 10,
                // 最少字元才觸發尋找, 0 不指定
                minimumInputLength: 0,
                // 當找不到可以使用輸入的文字
                tags: true,
                multiple: "multiple",
                data: [
                    {id: 1, text: "fake"},
                    {id: 2, text: "data"},
                ]
            });

            var newtitle = $("#addName").val();
            ruleTitle.push(newtitle);
        }
    }
    flag = false;
    $("#addName").val("");

    listenCheckBox();
}

function autosave(){
    
    var data = nowData["data"]
    $.ajax({
        url: "/api/document/autosave_key_value_mapping",
        type: "POST",
        data: JSON.stringify({
            data
        }),
        dataType: "json",
        contentType: "application/json"
    }).done(function (res) {
    });
}

//test button
function savetest(){
    
    var title = [];
    var sumOption = [];
    for (var i = 0; i <= newId; i++) {
        title.push($("label").eq(i).text());
        var options = $("#num" + i + " option:checked");
     
        var docs = [];

        for (var j = 0; j < options.length; j++) {
            docs.push($(options[j]).text());
        }

        sumOption.push(docs);
    }

    for (var i = 0; i < title.length; i++) {
        if (title[i] != "新增規則") {
            var key = title[i];
            optionData[key] = sumOption[i+1];
        }
    }

    var data = [];
    var dataKey = Object.keys(optionData);
    let version_check = 0;
    for (var i = 0; i < dataKey.length; i++) {
        if($("input[value='"+ dataKey[i] +"']").is(":checked")){
            version_check = 1;
        } else{
            version_check = 0;
        }
        data.push({
            "field": dataKey[i],
            "fieldvalue": optionData[dataKey[i]],
            "file_type": filetypeVal,
            "vendor": vendorVal,
            "version_check": version_check
        })
    }
    loadNowData();
   
    var oldLength = JSON.stringify({oldData}).length
    var nowLength = JSON.stringify({compareData}).length-4
   
    if(((oldLength != nowLength)&&(titleTemporartilyData != nowLength))||(checkBoxFalg)){
        titleTemporartilyData = nowLength;
        checkBoxFalg = false;
        autosave();
    }

}

//畫面刪除功能
function deleteRule(rowNum){
    $("#row"+rowNum).remove()
}

function loadNowData(){

    var nowTitle = [];
    for(var i = 0;i<$("label").length;i++){
        nowTitle.push($("label")[i].innerText);
    }
   
    var selectId = []
    for(var i = 0;i<$("select").length;i++){
        selectId.push($("select")[i].id);
    }
   
    var nowOption = []
    for(var i = 0;i<selectId.length;i++){
      
        var options = $("#"+selectId[i]+" option:checked")
        var nowDoc = []
        for(var j = 0;j<options.length;j++){
           nowDoc.push($(options[j]).text());
        }
        nowOption.push(nowDoc);

    }
    
    var checkArray = []
    for(var i = 0;i<$("input").length;i++){
        if($("input")[i].type == "checkbox"){
            if($("input")[i].checked == true){
                checkArray.push(1);
            }else{
                checkArray.push(0);
            }
        }
    }
 
    var data = {
        "data":[]
    };

    for(var i = 0;i<nowTitle.length;i++){
        data["data"].push({
            "field": nowTitle[i],
            "fieldvalue": nowOption[i],
            "file_type": filetypeVal,
            "vendor": vendorVal,
            "version_check": checkArray[i]
        })
    }

    var fakeData = {
        "data":[]
    };
    
    for(var i = 0;i<nowTitle.length;i++){
        fakeData["data"].push({
            "field": nowTitle[i],
            "fieldvalue": nowOption[i],
            "version_check": checkArray[i]
        })
    }

    nowData = data;
    compareData = fakeData;
}
//監聽checkbox
function listenCheckBox(){
    
    for(var i = 0;i<$("input").length;i++){
        if($("input")[i].type == "checkbox"){
            var checkBoxId =$("input")[i].id;
            $('#'+checkBoxId).on('click', function () {
                checkBoxFalg = true;
            });
        }
    }
}

//autosave api
setInterval(function () {   
    
    var title = [];
    var sumOption = [];
    for (var i = 0; i <= newId; i++) {
        title.push($("label").eq(i).text());
        var options = $("#num" + i + " option:checked");
     
        var docs = [];

        for (var j = 0; j < options.length; j++) {
            docs.push($(options[j]).text());
        }

        sumOption.push(docs);
    }

    for (var i = 0; i < title.length; i++) {
        if (title[i] != "新增規則") {
            var key = title[i];
            optionData[key] = sumOption[i+1];
        }
    }

    var data = [];
    var dataKey = Object.keys(optionData);
    let version_check = 0;
    for (var i = 0; i < dataKey.length; i++) {
        if($("input[value='"+ dataKey[i] +"']").is(":checked")){
            version_check = 1;
        } else{
            version_check = 0;
        }
        data.push({
            "field": dataKey[i],
            "fieldvalue": optionData[dataKey[i]],
            "file_type": filetypeVal,
            "vendor": vendorVal,
            "version_check": version_check
        })
    }
    loadNowData();
   
    var oldLength = JSON.stringify({oldData}).length
    var nowLength = JSON.stringify({compareData}).length-4
   
    if(((oldLength != nowLength)&&(titleTemporartilyData != nowLength))||(checkBoxFalg)){
        titleTemporartilyData = nowLength;
        checkBoxFalg = false;
        autosave();
    }

}, 1000);