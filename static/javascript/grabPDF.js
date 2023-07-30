/*
載入pdf檔

 */
var uuid = localStorage.getItem('uuid')
var front_path = Math.random();
fetch("api/document/get_upload_file", {
    body: JSON.stringify({ uuid: uuid }),
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
})
    .then(response => response.blob())
    .then(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const downloadUrl = URL.createObjectURL(blob);
        showPDF(downloadUrl)
    })

$.ajax({
    url: "api/document/get_image_path",
    type: "POST",
    data: JSON.stringify({
        uuid: uuid
    }),
    cache: false,
    dataType: "json",
    contentType: "application/json",
}).done(function (res) {
    console.log(res)
    var front_path = res.data.front_path + `?v=${new Date()}`;
    var back_path = res.data.back_path + `?v=${new Date()}`;
    $("#img1").attr("src", front_path);
    $("#img2").attr("src", back_path);
    $("#img1").css("height", "180px");
    $("#img2").css("height", "180px")

}).catch(err => {
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

    PDFJS.getDocument({ url: pdf_url }).then(function (pdf_doc) {
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
    });;
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
    var a = $("#fileToUpload").get(0)
    // handleFiles(a)

    // Send the object url of the pdf
    showPDF(URL.createObjectURL($("#fileToUpload").get(0).files[0]));


});

// Previous page of the PDF
$("#pdf-prev").on('click', function () {

    if (__CURRENT_PAGE != 1)
        showPage(--__CURRENT_PAGE);
});

// Next page of the PDF
$("#pdf-next").on('click', function () {
    if (__CURRENT_PAGE != __TOTAL_PAGES)
        showPage(++__CURRENT_PAGE);
});
/*
    判斷是否開始截圖
*/
var open = false;
var open2 = false;
$("#image1").on('click', function () {
    if (open == false) {
        open = true;
        croping();

    } else {
        open = false;
        cropImage();
    }
});
$("#image2").on('click', function () {
    if (open2 == false) {
        open2 = true;
        croping2();

    } else {
        open2 = false;
        cropImage2();
    }
});
/*
任意區域取消畫布
*/
$(document).mouseup(function (e) {
    var _con = $("#test");
    var _ccc = $("#image1");
    var _cell = $("#image2");
    if (!_con.is(e.target) && _con.has(e.target).length === 0 && !_ccc.is(e.target) && _ccc.has(e.target).length === 0 && !_cell.is(e.target) && _cell.has(e.target).length === 0) {
        if (open == true) {
            open = false;
            cropImage();
        }
        if (open2 == true) {
            open2 = false;
            cropImage2();
        }
    }
})
/*
開始截圖
*/
// Download button
function croping() {

    /*
    創造包住cropper的div
    */
    const test = document.createElement("div");
    test.id = "test";
    $("#croptest").append(test);
    $("#pdfCanvas").attr("style", "display:none")
    var a = __CANVAS.toDataURL();
    const img = document.createElement("img");

    $(img).attr('src', a);
    $(img).attr("id", "make");
    $("#test").append(img);

    $('#image1').css({
        width: '350px',
        overflow: 'hidden',
        height: "350px"
    });
    cropper = new Cropper(img, {
        aspectRatio: NaN,
        movable: false,
        zoomable: false,
        data: {
            width: "350px",
            height: "350px"
        },
        preview: '#image1',

        crop(event) {

            const canvas = this.cropper.getCroppedCanvas();
        }
    });
}
/*
開始截圖
*/
function croping2() {

    /*
    創造包住cropper的div
    */
    const test = document.createElement("div");
    test.id = "test";
    $("#croptest").append(test);
    $("#pdfCanvas").attr("style", "display:none")
    var a = __CANVAS.toDataURL();
    const img = document.createElement("img");

    $(img).attr('src', a);
    $(img).attr("id", "make");
    $("#test").append(img);


    $('#image2').css({
        width: '350px',
        overflow: 'hidden',
        height: "350px"
    });

    cropper = new Cropper(img, {
        aspectRatio: NaN,
        movable: false,
        zoomable: false,
        preview: '#image2',
        data: {
            width: "350px",
            height: "350px"
        },

        crop(event) {

            const canvas = this.cropper.getCroppedCanvas();
        }
    });
};

/*
將截下照片顯示框中
*/
var file1, imgurl;
var crop1 = false;
var crop2 = false
function cropImage() {
    imgurl = cropper.getCroppedCanvas().toDataURL();
    file1 = dataURItoBlob(imgurl)

    $("#img1").attr("src", imgurl);
    $("#test").remove();
    $("#pdfCanvas").attr("style", "display:block");
    crop1 = true;
    autosave();
}
/*
將截下照片顯示框中
*/
var file2, imgurl2;
function cropImage2() {
    imgurl2 = cropper.getCroppedCanvas().toDataURL();
    file2 = dataURItoBlob(imgurl2)
    $("#img2").attr("src", imgurl2);
    $("#test").remove();
    $("#pdfCanvas").attr("style", "display:block");
    crop2 = true;
    autosave();
}
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

function autosave() {
    var formData = new FormData()
    formData.append("front_path", file1);
    formData.append("back_path", file2);
    $.ajax({
        url: "/api/document/autosave_image_path?uuid=" + uuid,
        type: "POST",
        data: formData,
        cache: false,
        processData: false,
        accept: "application/json",
        contentType: false
    }).done(function (res) {
        console.log(res)
    });

}

