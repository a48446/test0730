let ctrl = true;

let fileDoc = null;
let allVendor = [];
let option_all_dict = {};

function UpFile() {
    $(".sendfilereal").click();
}

// 需要定義 dragover 事件，並設定 preventDefault()
// 如果沒有定義，會在觸發 Drop 事件之前就把檔案開啟了
document.querySelector('#dropArea').addEventListener('dragover', function (event) {
    // 取消拖拉時開啟檔案
    event.preventDefault();
});
document.querySelector('#dropArea').addEventListener('drop', function (event) {
    ctrl = !ctrl;
    // 取消拖拉時開啟檔案
    event.preventDefault();
    // 取得拖拉的檔案清單

    let filelist = event.dataTransfer.files;
    for (let i = 0; i < filelist.length; i++) {
        // 檔案名稱

        fileDoc = event.dataTransfer.files[0]
        $("#fileText").text(filelist[i].name);
        // 檔案類型
        let filepoint = filelist[i].name.indexOf(".");
        let filelength = filelist[i].name.length;
        let filetype = filelist[i].name.substring((filepoint + 1), filelength);

        // 檔案大小
        // console.log(filelist[i].size);

        // 透過 FileReader 取得檔案內容
        let reader = new FileReader();

        // 設定檔案讀取完畢時觸發的事件
        reader.onload = event => {
            // 取得檔案完整內容
            // console.log(event.target.result);
            // 上傳檔案到伺服器端
            // upload(file);
        };
        // 設定 onprogress event 查詢進度
        reader.onprogress = function (evt) {
            // 確定 evt 是否為 ProgressEvent
            if (evt.lengthComputable) {
                // 計算百分比
                let percentLoaded = Math.round((evt.loaded / evt.total) * 100);

                // 注意：這裡的百分比的數字不會到 100
                // console.log(percentLoaded);
            }
        };
        // 開始讀取檔案，以文字字串型式讀取資料
        reader.readAsText(filelist[i]);
    }
});
$(".sendfilereal").on('change', function () {
    //檔案選取視窗

    if (ctrl) {

        fileDoc = this.files[0];
        $("#fileText").text(this.files[0].name);
        let name = this.files[0].name;
        let filepoint = name.indexOf(".");
        let filelength = name.length;
        // let filetype = name.substring((filepoint + 1), filelength);
        // console.log(filetype)

    }
});

function getUploadFileOption(user_id, vendor, file_type) {
    $.ajax({
        url: "/api/document/upload_file_option",
        type: "POST",
        data: JSON.stringify({
            "user_id": user_id,
            "vendor": vendor,
            "file_type": file_type
        }),
        dataType: "json",
        contentType: "application/json; charset=UTF-8"
    }).done(function (res) {
        if (res["result"] == 0) {
            res = res["data"];

            // 一進上傳檔案頁面，先拿 客戶 & 檔案類型 的下拉選單
            if (user_id != "") {
                let vendorList = ['<option value="" disabled selected>選擇客戶</option>'];
                let vendorOption = "";
                let fileTypeList = ['<option value="" disabled selected>選擇檔案類型</option>'];
                let fileTypeOption = "";
                for (let idx in res) {
                    vendorOption = "<option value='" + res[idx]["vendor"] + "'>" + res[idx]["vendor"] + "</option>";
                    if (vendorList.indexOf(vendorOption) == -1) {
                        vendorList.push(vendorOption);
                    }
                    if (allVendor.indexOf(res[idx]["vendor"]) == -1) {
                        allVendor.push(res[idx]["vendor"]);
                    }

                    fileTypeOption = "<option value='" + res[idx]["file_type"] + "'>" + res[idx]["file_type"] + "</option>";
                    if (fileTypeList.indexOf(fileTypeOption) == -1) {
                        fileTypeList.push(fileTypeOption);
                    }
                }
                $("#vendor").html(vendorList.join("\n"));
                $("#fileType").html(fileTypeList.join("\n"));


                for (let i = 0; i < res.length; i++) {
                    let data_vendor = res[i].vendor;
                    let data_file_type = res[i].file_type;
                    let data_model_name = res[i].model_name;

                    // 製作下拉選單關聯的dictionary
                    if (!(data_vendor in option_all_dict)) {
                        option_all_dict[data_vendor] = {};
                    }
                    if (!(data_file_type in option_all_dict[data_vendor])) {
                        option_all_dict[data_vendor][data_file_type] = [];
                    }
                    if (option_all_dict[data_vendor][data_file_type].indexOf(data_model_name) == -1) {
                        option_all_dict[data_vendor][data_file_type].push(data_model_name);
                    }
                }


                $("#vendor").select2({
                    language: 'zh-TW',
                    width: '100%',
                    // 最多字元限制
                    maximumInputLength: 10,
                    // 最少字元才觸發尋找, 0 不指定
                    minimumInputLength: 0,
                    // 當找不到可以使用輸入的文字
                    tags: true,
                    // data: allVendor,
                });
            }
            // 選完 客戶 & 檔案類型 後，拿模型下拉選單
            else {
                let modelList = ['<option value="" disabled selected>選擇模型</option>'];
                let modelOption = "";
                for (let idx in res) {
                    modelOption = "<option value='" + res[idx] + "'>" + res[idx] + "</option>";
                    if (modelList.indexOf(modelOption) == -1) {
                        modelList.push(modelOption);
                    }
                }
                $("#model").html(modelList.join("\n"));
            }

        } else {
            alert(res["message"]);
        }
    });
}


$('#vendor').on('change', function () {
    let vendor = $("#vendor option:selected").val();

    if (vendor != "") {
        $("#fileType").prop("disabled", false);
        $("#fileType").val("");
        $("#model").val("");
    }
});

$('#fileType').on('change', function () {
    let vendor = $("#vendor option:selected").val();
    let fileType = $("#fileType option:selected").val();

    if (vendor != "" && fileType != "") {
        $("#model").prop("disabled", false);
        $("#model").val("");
        getUploadFileOption("", vendor, fileType)
    }
});

$('#uploadFileBtn').on('click', function () {
    let vendor = $("#vendor option:selected").val();
    let fileType = $("#fileType option:selected").val();
    let modelName = $("#model option:selected").val();

    if (vendor == "" || fileType == "" || modelName == "") {
        alert("請選擇上傳資訊");
        return false;
    } else if (fileDoc == null) {
        alert("請選擇上傳檔案");
        return false;
    } else {
        let user_id = $(this).data("id");
        let url = "?vendor=" + vendor + "&file_type=" + fileType + "&model_name=" + modelName + "&user_id=" + user_id;
        let form = new FormData();
        form.append("file", fileDoc);
        $.ajax({
            url: "/api/document/upload_file" + url,
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: form,
        }).done(function (res) {
            if (res.result == 0) {
                new PNotify({
                    title: '成功',
                    text: '上傳成功',
                    type: 'success',
                    shadow: true,
                });
                setTimeout(function () {
                    location.href = '/identify_progress_list';
                }, 1000);
            } else {
                alert(res.message);
            }
        });
    }
});
