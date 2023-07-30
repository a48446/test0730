var data =[];
var titleLength = 0;
var cellLength = 0;
var excelRow = [];
var english = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var excelFiles = null;
var mergesCell =[];
var mergescellRange = [];
var colorStyle = ["#FF9797","#FFD0FF","#DDDDFF","#BBFFBB","#FFFFCE","#E0E0E0"];
var titleStyle = ["MetaTitle","GroupHead","Header","Data","Other","NullCell"];
var tojson = null;
var clickCellstart = null;
var clickCellOut = null;
var allColorDocument =new Array(6);
var mergeNullCell = [];
var emptyFlag = false;
var group = new Array(6);
var addGroup = new Array(6);
let stack = new Array();
let click = [];
let color_ = [];
let count = 0;
var transform = new Array(6);
transform[0] = new Array();
transform[1] = new Array();
transform[2] = new Array();
transform[3] = new Array();
transform[4] = new Array();
transform[5] = new Array();
var judgeTableArray = new Array(6);
var tableRange = [];
var rangeCount = 0;
var nowPayload = null;
var oldData = null;
var oldAPIData = null;
var temporarilyPayload = 0;
var correctOutput = new Array(6);
var allRange = [];
var typeTableRange = [];
var pageNum = 1;
var uuid = localStorage.getItem('uuid');
var versionNum = 0;
var versionArray = [];
var allDoc = [];
var jexcelLicense = "YjQ5M2Q0NzQ4ZjU4OWM4YzZjMzc5ZWZiNzNjNzllMTM4MDA2N2NiYmYxOTcwMDk0NTVmM2VhZGRjYjkyZWJiZDk2NzdjNjg0N2EwYTQ1ZTE1ZDQ5MDIxZjIyYjAwMWFjMTAxZDAwYjFhMWIwNjgwMWIyMjkzYjk3YTM4ODZmNDYsZXlKdVlXMWxJam9pWVd4bWNtVmtJaXdpWkdGMFpTSTZNVFl3T1RRMU9USXdNQ3dpWkc5dFlXbHVJanBiSW14dlkyRnNhRzl6ZENJc0lteHZZMkZzYUc5emRDSmRMQ0p3YkdGdUlqb3dmUT09"
var secret = [];
var pageMaxNum = null;
var getDetectCellApiData = null;

//找出陣列重覆個數
function collectionRepeat(box, key){
    var counter = {};
    box.forEach(function(x) { 
        counter[x] = (counter[x] || 0) + 1; 
    });
    var val = counter[key];
    if (key === undefined) {
        return counter;
    }
    return (val) === undefined ? 0 : val;
}

//陣列總和
function SumDatareduce(arr){
    return arr.reduce((a,b)=>a+b);  
}

//合併儲存格功能
function mergesTable(){
    //將有!merges的特殊字元去除
    var transform = null;
    do {
        transform = tojson.replace("!merges","merges");
    }
    while((transform.includes("!merges")))

    var obj = JSON.parse(transform);
    
    //找出合併儲存格的欄位 和 合併範圍
    if(obj.merges!=undefined){
        for(var i = 0;i<obj.merges.length;i++){
        var mergerow = null;
        var mergecol = null;
        if(obj.merges[i].e.c>obj.merges[i].s.c){
            if(obj.merges[i].e.r>obj.merges[i].s.r){
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                   
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].s.c]+(obj.merges[i].s.r+1).toString());
            }
            else if(obj.merges[i].e.r<obj.merges[i].s.r){
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                  
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].e.c]+(obj.merges[i].e.r+1).toString());
            }
            else{
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                    
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].s.c]+(obj.merges[i].s.r+1).toString());
            }
        }
        else if(obj.merges[i].e.c<obj.merges[i].s.c){

            if(obj.merges[i].e.r>obj.merges[i].s.r){
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                    
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].s.c]+(obj.merges[i].s.r+1).toString());
            }
            else if(obj.merges[i].e.r<obj.merges[i].s.r){
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                   
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].e.c]+(obj.merges[i].e.r+1).toString());
            }
            else{
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                   
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].e.c]+(obj.merges[i].s.r+1).toString());
            }
        }
        else{

            if(obj.merges[i].e.r>obj.merges[i].s.r){
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                   
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].s.c]+(obj.merges[i].s.r+1).toString());
            }
            else if(obj.merges[i].e.r<obj.merges[i].s.r){
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                 
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].e.c]+(obj.merges[i].e.r+1).toString());
            }
            else{
                mergerow = Math.abs(obj.merges[i].e.c-obj.merges[i].s.c)+1;
                mergecol = Math.abs(obj.merges[i].e.r-obj.merges[i].s.r)+1;                                 
                mergesCellRange[i] = [mergerow,mergecol];
                mergesCell.push(english[obj.merges[i].e.c]+(obj.merges[i].s.r+1).toString());
            }

            }
        }
    }              
    
    //找出合併儲存格的未存在欄位
    for(var i = 0;i<mergesCell.length;i++){
        var englishPosition =  english.indexOf(mergesCell[i].substring(0,1));
        var numPosition =  parseInt(mergesCell[i].substring(1,mergesCell[i].length),10);
        for(var j = englishPosition;j<(englishPosition+mergesCellRange[i][0]);j++){
            for(var k = numPosition;k<(numPosition+mergesCellRange[i][1]);k++){
                mergeNullCell.push(english[j]+k);
            }
        }
    }
    for(var i = 0;i<mergesCell.length;i++){
        var deletePosition = mergeNullCell.indexOf(mergesCell[i]);
        mergeNullCell.splice(deletePosition, 1);
    }
    
    //合併語法
    
    for(var i = 0;i<mergesCell.length;i++){
        appearanceExcel.setMerge(mergesCell[i], mergesCellRange[i][0], mergesCellRange[i][1]);
    }
}
//生成表格
function doExcel(dataBoard){
  //判斷是否有空白欄位 將data裡有empty(空白欄)替代
    if(emptyFlag){
        for(var i = 0;i<data.length;i++){
            for(var j = 0;j<data[i].length;j++){
                if(data[i][j].length<10){
                    if(data[i][j].includes("empty")){
                        data[i][j]=" ";
                    }
                    else if(data[i][j].includes("EMPTY")){
                        data[i][j]=" ";
                    }
                }
            }
        }   
    }
    
    for(var i = 0;i<col.length;i++){
        col[i].title = english[i];
    }
    data.pop();
    //顯示出像excel的頁面

    var excelHeight =$("#jexcelOn").height();
    appearanceExcel = jexcel(document.getElementById('spreadsheet'), {
        tableOverflow: true,
        data:dataBoard,
        minDimensions: [26,100],
        columnSorting: false,
        tableHeight:excelHeight+"px",
        setHeight:"50px",
        license:jexcelLicense,
    });
    mergesTable();
    setTimeout(function(){ 
        doColor();
    }, 1500);
    listenMouseRange();
    
    appearanceExcel.showIndex();
}
//處理data
function dealData(jsondata, dataBoard) {/*Function used to convert the JSON array to Html Table*/  
    //將sheet.js 的 output 轉換成 excel.js的input格式(只有data)
    var cellVal =[];
    var zero = 0;
    var init = [];
    var columns = dealTable(jsondata); /*Gets all the column headings of Excel*/  
    
    for (var i = 0; i < jsondata.length; i++) {  
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {  
            var cellValue = jsondata[i][columns[colIndex]];  
            if (cellValue == null)  
                cellValue = ""; 
            cellVal.push(cellValue) ;
        }  
    }  
   
    cellLength = cellVal.length

    do{
        init.push(zero);
        zero+=titleLength;
    }
    while(zero<=cellLength)

    data.push(excelRow);

    for(var i = 0;i<init.length;i++){
        data.push(cellVal.slice(init[i], init[i+1]));
    }
    doExcel(dataBoard)
}  
//處理表格資料
function dealTable(jsondata) {/*Function used to get all column names from JSON and bind the html table header*/  
    var columnSet = [];  
    for (var i = 0; i < jsondata.length; i++) {  
        var rowHash = jsondata[i];  
        for (var key in rowHash) {  
            if (rowHash.hasOwnProperty(key)) {  
                if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/  
                    columnSet.push(key);  
                }  
            }  
        }  
    }  
    return columnSet;  
}  
//偵測選取範圍
function listenMouseRange(){

    $('td').on('mousedown',function(e){
            var datax = e.currentTarget.attributes[0].nodeValue;
            var datay = e.currentTarget.attributes[1].nodeValue;
            clickCellStart = english[datax]+(parseInt(datay,10)+1);
            });

    $('td').on('mouseup',function(e){
            var datax = e.currentTarget.attributes[0].nodeValue;
            var datay = e.currentTarget.attributes[1].nodeValue;
            clickCellOut = english[datax]+(parseInt(datay,10)+1);
           
            if(mergesCell.indexOf(clickCellStart)>=0){
                var mergesNum = mergesCell.indexOf(clickCellStart);
                var endEnglishNum = english.indexOf(clickCellStart.substring(0,1))+mergesCellRange[mergesNum][0]-1;
                var endEnglish = english[endEnglishNum];
                var endNum = parseInt(clickCellStart.substring(1,clickCellStart.length),10)+mergesCellRange[mergesNum][1]-1;
                var clickCellEnd = endEnglish+endNum;
                $("#coordinate").text(clickCellStart+"~"+clickCellEnd);
            }else{
                $("#coordinate").text(clickCellStart+"~"+clickCellOut);
            }
            
            judgeTable(clickCellStart,clickCellOut);
    });
    
}
//顏色功能
function color(start,end,colornum){
    var col = [];
    var row = [];
    var startCol = null;
    var startRow = null;
    var endCol = null;
    var endRow = null;
    var all = [];

    col.push(start.substring(0,1));
    col.push(end.substring(0,1));
    endCol = col.sort()[col.length-1];
    startCol = col.sort()[0];
    row.push(parseInt(start.substring(1,(start.length)),10));
    row.push(parseInt(end.substring(1,(end.length)),10));
    
    endRow = row[0]
    for(var i = 0;i<row.length;i++){
        if (row[i] > endRow) {
            endRow = row[i];
        }
    }
    startRow = row[0]
    for(var i = 0;i<row.length;i++){
        if (row[i] < startRow) {
            startRow = row[i];
        }
    }
    for(var i = english.indexOf(startCol);i<=english.indexOf(endCol);i++){
        for(var j = (startRow-1);j<endRow;j++){
            all.push(english[i]+(j+1));
        }
    }
    
    //判斷各顏色有那些cell
        var deleteColor = [];
        var cancelAcount = 0;
        if(allColorDocument[colornum]==undefined){
            allColorDocument[colornum] =all;
            group[colornum].push(all.length);
            addGroup[colornum].push(all.length);
        }else{
            allColorDocument[colornum] += ","+all;
            var split = allColorDocument[colornum].split(",");
            if(split[0]==""){
                split.shift();
            }
            var repeat = split.filter(function(element, index, arr){
                return arr.indexOf(element) !== index;
            });
    //顏色取消時檢查
        for(var i = 0;i<repeat.length;i++){
            if((collectionRepeat(split, repeat[i]))%2 == 0){
                deleteColor.push(repeat[i]);
                cancelAcount++;
            }
        }
        group[colornum].push(all.length-cancelAcount)
        for(var i = 0;i<deleteColor.length;i++){
            do{
                var position = split.indexOf(deleteColor[i]);
                split.splice(position, 1);
            }
            while(split.includes(deleteColor[i]))
        }
        addGroup[colornum].push(split.length);
        allColorDocument[colornum] =split;
    }
    //分組資料處理功能
    for(var i = 0; i <all.length ; i++){
        if(click[all[i]] == undefined){
            color_[all[i]] = 0;
        }
    }
    let arr;
    for (var i = all.length - 1; i >= 0; i--) {
        if(color_[all[i]] != 0){
            arr = stack[click[all[i]]];
            arr.splice(arr.indexOf(all[i]),1);
        }
        if(colornum+1 == color_[all[i]]){
            color_[all[i]] = 0 ;
        }
        else{
            click[all[i]] = count;
            color_[all[i]] = colornum+1;
            if(stack[count] == undefined){
                stack[count] = new Array();
                stack[count].push(colornum);
            }
            stack[click[all[i]]].push(all[i]);
        }
    }
    if(stack[count] != undefined)
        {count++;}

    //顏色改變時檢查
    var allColorDocumentKey = Object.keys(allColorDocument);
    var allColorDocumentLength = allColorDocument[colornum].length;
    for(var i = 0;i<allColorDocumentKey.length;i++){
      if((i!=colornum)&&(allColorDocumentKey.length>=1)){
         for(var j = 0;j<allColorDocumentLength;j++){
              do{
                  if((allColorDocument[allColorDocumentKey[i]].indexOf(allColorDocument[colornum][j])>=0)&&(allColorDocumentKey[i]!=colornum)){
                       var position = allColorDocument[allColorDocumentKey[i]].indexOf(allColorDocument[colornum][j]);
                       allColorDocument[allColorDocumentKey[i]].splice(position, 1);
                  }
              }while((allColorDocument[allColorDocumentKey[i]].indexOf(allColorDocument[colornum][j])>=0)&&(allColorDocumentKey[i]!=colornum))
         }
      }
    }
    
    //去除合併儲存格時不存在的欄位
    for(var i = 0;i<allColorDocument.length;i++){
        for(var j = 0;j<mergeNullCell.length;j++){
            if(allColorDocument[i] != undefined){
                var deletePosition = allColorDocument[i].indexOf(mergeNullCell[j]);
                if(deletePosition>=0){
                    allColorDocument[i].splice(deletePosition, 1);
                }
            }
        };
    };
    //將結果轉字串顯示
    let allColorStr = new Array(6);
    for(var i = 0 ; i <6 ;i++){
        allColorStr[i] = "";
    }
    for(var j = 0;j<stack.length;j++){
        if(stack[j].length == 1 ) 
        {continue;}
        allColorStr[stack[j][0]] +="[";
        for(var k = 1; k < stack[j].length; k++){
            allColorStr[stack[j][0]] +=stack[j][k]+',';
        }
        allColorStr[stack[j][0]] +="]";
    }
    
    //分組資訊去除不存在的合併儲存格
    for(var i = 0;i<allColorStr.length;i++){
        for(var j = 0;j<mergeNullCell.length;j++){
            if(allColorStr[i].includes(mergeNullCell[j])){
                allColorStr[i] = allColorStr[i].replace(","+mergeNullCell[j],"");
            }
        }
    }
    
    //輸出格式轉換
    transform = new Array(6);
    transform[0] = new Array();
    transform[1] = new Array();
    transform[2] = new Array();
    transform[3] = new Array();
    transform[4] = new Array();
    transform[5] = new Array();
    judgeTableArray = allColorStr;

    for(var i = 0;i<allColorStr.length;i++){
        var temporary = allColorStr[i];
        do{
            temporary = temporary.replace("[","");
        }
        while(temporary.includes("["))
        var toArray = temporary.split("]");
        for(var j = 0;j<toArray.length;j++){
            transform[i].push(toArray[j].split(","));
        }
    }

    correctOutput = new Array(6);
    correctOutput[0] = new Array();
    correctOutput[1] = new Array();
    correctOutput[2] = new Array();
    correctOutput[3] = new Array();
    correctOutput[4] = new Array();
    correctOutput[5] = new Array();
  
    //修改範圍 因sort語法無法使用需改寫
    for(var i = 0;i<transform.length;i++){
        for(var j = 0;j<transform[i].length;j++){
            if(transform[i][j]!= undefined){
                var sortArray = transform[i][j].sort();
                if((sortArray[1]!=undefined) && (sortArray[sortArray.length-1]!=undefined)){
                    var n1 = [];
                    var n2 = [];
                    var n3 = [];
                    for(var k = 0;k<transform[i][j].length;k++){
                        if(transform[i][j][k].length<=2){
                            n1.push(transform[i][j][k]);
                        }else if(transform[i][j][k].length==3){
                            n2.push(transform[i][j][k]);
                        }else if(transform[i][j][k].length==4){
                            n3.push(transform[i][j][k]);
                        }
                    }

                    if(n3.length!=0){
                        n3 = n3.sort();
                        n2 = n2.sort();
                        n1 = n1.sort();
                        var startN1 = n1[1];
                        var endN1 = n1[n1.length-1];
                        var startN2 = n2[0];
                        var endN2 = n2[n2.length-1];
                        var startN3 = n3[0];
                        var endN3 = n3[n3.length-1];
                        var start = null;
                        var end = null;

                        if(startN2 !=undefined){
                            if(startN2.length>startN3.length){
                                start = startN3.split("");
                            }else{
                                start = startN2.split("");
                            }
                        }else{
                            start = startN3.split("");
                        }

                        if(startN2 !=undefined){
                            if(endN2.length>endN3.length){
                                end = endN2.split("");
                            }else{
                                end = endN3.split("");
                            }
                        }else{
                            end = endN3.split("");
                        }

                        var correct = handleOutput(start,end);
                        correctOutput[i].push(correct);

                    }else if(n2.length!=0){
                        
                        n2 = n2.sort();
                        n1 = n1.sort();
                        var startN1 = n1[1];
                        var endN1 = n1[n1.length-1];
                        var startN2 = n2[0];
                        var endN2 = n2[n2.length-1];
                        
                        var start = null;
                        var end = null;

                        if(startN1 !=undefined){
                            if(startN1.length>startN2.length){
                                start = startN2.split("");
                            }else{
                                start = startN1.split("");
                            }
                        }else{
                            start = startN2.split("");
                        }

                        if(endN1 !=undefined){
                            if(endN1.length>endN2.length){
                                end = endN1.split("");
                            }else{
                                end = endN2.split("");
                            }
                        }else{
                            end = endN2.split("");
                        }

                        var correct = handleOutput(start,end);
                        correctOutput[i].push(correct);
                    }else{
                        var start = sortArray[1].split("");
                        var end = sortArray[sortArray.length-1].split("");
                        var correct = handleOutput(start,end);
                        correctOutput[i].push(correct);
                    }
                }
            }
        }
    }

    $('#metaTitleFont').text(correctOutput[0]);
    $('#groupHeadFont').text(correctOutput[1]);
    $('#headerFont').text(correctOutput[2]);
    $('#dataFont').text(correctOutput[3]);
    $('#otherFont').text(correctOutput[4]);
    $('#nullCellFont').text(correctOutput[5]);

    //上色
    for(var i = 0;i<all.length;i++){
        appearanceExcel.setStyle(all[i],'background-color', colorStyle[colornum]);
    }
}
//點擊顏色區塊後改變顏色
function changeColor(colornum){
    
    if((clickCellStart!=undefined)&&(clickCellOut!=undefined)){
       
        versionNum++
        color(clickCellStart,clickCellOut,colornum);
        var key = Object.keys(nowPayload)[2];
        var pageKey = Object.keys(nowPayload[key]);
        // var tableKey = Object.keys(nowPayload[key][pageKey]);
        var allRangeKey = Object.keys(allRange);
        var startOutRange = "$"+clickCellStart.substring(0,1)+"$"+clickCellStart.substring(1,clickCellStart.length)+":$"+clickCellOut.substring(0,1)+"$"+clickCellOut.substring(1,clickCellOut.length);

        for(var i = 0;i<allRangeKey.length;i++){
            if(allRange[allRangeKey[i]].indexOf(clickCellStart)>=0){
                if(clickCellStart==clickCellOut){
                    nowPayload["data"]["page"+pageNum][allRangeKey[i]].push({
                        cell_type:titleStyle[colornum],
                        range:"$"+clickCellStart.substring(0,1)+"$"+clickCellStart.substring(1,clickCellStart.length),
                        version:versionNum
                    })
                    
                }else{
                    nowPayload["data"]["page"+pageNum][allRangeKey[i]].push({
                        cell_type:titleStyle[colornum],
                        range:startOutRange,
                        version:versionNum
                    })
                  
                }
                
            }
        }
  
    }
}

//處理輸出格式function
function handleOutput(start,end){
    var startStr = "";
    var endStr = "";
    for(var i = 0;i<start.length;i++){
        if(i == 0){
            startStr+="$"+start[i];
        }else if(i == 1){
            startStr+="$"+start[i];
        }
        else{
            startStr+=start[i];
        }
    }
    for(var i = 0;i<end.length;i++){
        if(i == 0){
            endStr+="$"+end[i];
        }else if(i == 1){
            endStr+="$"+end[i];
        }
        else{
            endStr+=end[i];
        }
    }
    var all = startStr+":"+endStr;
    return all
}

//判斷單元格類型
function judgeTable(judgestart,judgeend){
    
    var change = true;
    var tableRangeDoc = [];
    //判斷tableType
    if(rangeCount == 0){
        for(var i = 0;i<Object.keys(tableRange).length;i++){
            if(tableRange[Object.keys(tableRange)[i]].length > 6){
                var allRangeLarge = tableRange[Object.keys(tableRange)[i]];
                if(allRangeLarge.includes("$")){
                    for(var j = 0;j<4;j++){
                        allRangeLarge = allRangeLarge.replace("$","");
                    }
                    allRangeLarge = allRangeLarge.split(":");
                }
                
                var startEnglish =  allRangeLarge[0].substring(0,1);
                var endEnglish =  allRangeLarge[1].substring(0,1);
                var startVal =  parseInt(allRangeLarge[0].substring(1,allRangeLarge[0].length), 10);
                var endVal =  parseInt(allRangeLarge[1].substring(1,allRangeLarge[1].length), 10);
    
                for(var k = english.indexOf(startEnglish);k<=english.indexOf(endEnglish);k++){
                    for(var l = startVal;l<=endVal;l++){
                        tableRangeDoc.push(english[k]+l);
                    }
                }
                tableRange[Object.keys(tableRange)[i]] = tableRangeDoc;
                allRange[Object.keys(tableRange)[i]] = tableRangeDoc;
               
            
            }else{
                var allRangeSmall = tableRange[Object.keys(tableRange)[i]];
                var allRangeSmallArray = [];
    
                if(allRangeSmall.includes("$")){
                    for(var j = 0;j<2;j++){
                        allRangeSmall = allRangeSmall.replace("$","");
                    }
                }
                allRangeSmallArray.push(allRangeSmall);
                tableRange[Object.keys(tableRange)[i]] = allRangeSmallArray;
                allRange[Object.keys(tableRange)[i]] = allRangeSmallArray;
            }
        }
    }
    //emptyFlag??
    var haveFlag = true;
    emptyFlag = true;
    for(var i = 0;i<Object.keys(tableRange).length;i++){
        if(tableRange[Object.keys(tableRange)[i]].indexOf(judgestart)>=0){
            if((tableRange[Object.keys(tableRange)[i]][tableRange[Object.keys(tableRange)[i]].indexOf(judgestart)])==judgestart){
                // $("#tableType").text(Object.keys(tableRange)[i]);
                haveFlag = false;
                rangeCount++;
            }
        }else if(haveFlag){
            if(emptyFlag){
                // $("#tableType").text("empty");
                emptyFlag = false;
                rangeCount++;
            }
        }
    }
  
    //判斷dataType
    for(var i = 0;i<judgeTableArray.length;i++){
        if(judgeTableArray[i] != undefined){
            if((judgeTableArray[i].includes(judgestart))&&(judgeTableArray[i].includes(judgeend))){
            
                switch (i) {
                    case 0:
                      $("#dataType").text("MetaTitle");
                      change = !change
                      break;
                    case 1:
                      $("#dataType").text("GroupHead");
                      change = !change
                      break;
                    case 2:
                      $("#dataType").text("Header");
                      change = !change
                      break;
                    case 3:
                      $("#dataType").text("Data");
                      change = !change
                      break;
                    case 4:
                      $("#dataType").text("Other");
                      change = !change
                      break;
                    case 5:
                      $("#dataType").text("NullCell");
                      change = !change
                      break;
                    default:
                      console.log('not found');
                  }
            }
            else if(!(judgeTableArray[i].includes(judgestart))&&!(judgeTableArray[i].includes(judgeend))&&change){
                $("#dataType").text("empty");
            }
        }
    }
    
}

getDetectCellAPI();

function getDetectCellAPI(){

        $.ajax({
            url: "/api/document/get_detect_cell",
            type: "POST",
            data: JSON.stringify({
                uuid: uuid,
                page_number: pageNum
            }),
            contentType: "application/json"
        }).done(function(res) {
            getDetectCellApiData = res;
        });

}

//上色color api
function doColor(){
        allDoc  = [];
        versionArray = [];
        oldAPIData = null;
        oldData = null;
        
        var key = Object.keys(getDetectCellApiData.data);
        var allPage = [];
        for(var i = 0;i<key.length;i++){
            allPage.push(parseInt(key[i].substring(4,key[i].length),10));
        }

        pageMaxNum  = allPage[0];

        for(var i = 0;i<allPage.length;i++){
            if(pageMaxNum<allPage[i]){
                pageMaxNum = allPage[i];
            }
        }
       
        var table = Object.keys(getDetectCellApiData.data["page"+pageNum]);

        oldAPIData = JSON.parse(JSON.stringify(getDetectCellApiData["data"]));
        oldData = getDetectCellApiData;
        nowPayload = oldData;

        var tableFlag = true
        var tableKey = Object.keys(getDetectCellApiData.data["page"+pageNum]);
        for(var j = 0;j<tableKey.length;j++){
            for(var k = 0;k<getDetectCellApiData.data["page"+pageNum][Object.keys(getDetectCellApiData.data["page"+pageNum])[j]].length;k++){
                if(getDetectCellApiData.data["page"+pageNum][Object.keys(getDetectCellApiData.data["page"+pageNum])[j]][k].cell_type == "Table"){
                    if(tableFlag){
                        tableFlag = false
                        tableRange[Object.keys(getDetectCellApiData.data["page"+pageNum])[j]] = getDetectCellApiData.data["page"+pageNum][Object.keys(getDetectCellApiData.data["page"+pageNum])[j]][k].range;
                    }
                
                }
                
            }
        };

        var allDocId  = 0
        for(var i = 0;i<table.length;i++){
            for(var j = 0;j<getDetectCellApiData.data["page"+pageNum][table[i]].length;j++){

                    allDoc.push({
                        cell_type: getDetectCellApiData.data["page"+pageNum][table[i]][j].cell_type,
                        range:getDetectCellApiData.data["page"+pageNum][table[i]][j].range,
                        version:getDetectCellApiData.data["page"+pageNum][table[i]][j].version,
                        table:table[i],
                        id:allDocId
                    });
                    allDocId++
            }
        }
        
        for(var i = 0;i<allDoc.length;i++){
            versionArray.push(allDoc[i].version);
        }

        var max = versionArray[0]
        for(var i = 1;i<versionArray.length;i++){
            if(max<versionArray[i]){
                max = versionArray[i];
            }
        }
  
        versionNum = max;
   
        for(var i = 0;i<=max;i++){
            for(var j = 0;j<allDoc.length;j++){
                if(allDoc[j].version == i){
                    toColorStyle(allDoc[j].cell_type,allDoc[j].range);
                }
            }
        }
      

    }
//執行api上色

function toColorStyle(type,range){
    var str = range;
    
    if(str.includes(":")){
        for(var i = 0;i<4;i++){
            str = str.replace("$","");
        }
    
        var bgColor = str.split(":");
    
        switch (type) {
            case "Table":
                typeTableRange.push("$"+bgColor[0].substring(0,1)+"$"+bgColor[0].substring(1,bgColor[0].length)+":$"+bgColor[1].substring(0,1)+"$"+bgColor[1].substring(1,bgColor[1].length));

              break;
            case "MetaTitle":
                color(bgColor[0],bgColor[1],0);
              break;
            case "GroupHead":
                color(bgColor[0],bgColor[1],1);
              break;
            case "Header":
                color(bgColor[0],bgColor[1],2);
              break;
            case "Data":
                color(bgColor[0],bgColor[1],3);
              break;
            case "Other":
                color(bgColor[0],bgColor[1],4);
              break;
            case "NullCell":
                color(bgColor[0],bgColor[1],5);
              break;
            default:
                console.log(`Sorry, we are out of color`,type);
        }
    }else{
        for(var i = 0;i<2;i++){
            str = str.replace("$","");
        }
   
        var bgColor = str;
     
        switch (type) {
            case "Table":
                typeTableRange.push("$"+bgColor.substring(0,1)+"$"+bgColor.substring(1,bgColor.length));
              break;
            case "MetaTitle":
                color(bgColor,bgColor,0);
              break;
            case "GroupHead":
                color(bgColor,bgColor,1);
              break;
            case "Header":
                color(bgColor,bgColor,2);
              break;
            case "Data":
                color(bgColor,bgColor,3);
              break;
            case "Other":
                color(bgColor,bgColor,4);
              break;
            case "NullCell":
                color(bgColor,bgColor,5);
              break;
            default:
                console.log(`Sorry, we are out of color`,type);
        }
    }
}

//抓取檔案 api
getFileApi()
function getFileApi(){
    stack = [];
    click = [];
    color_ = [];
    count = 0;
    $("#spreadsheet").remove();
    var div = document.createElement("div");
    $(div).attr("id","spreadsheet");
    $('#jexcelOn').append(div);
    data =[];
    col =[];
    excelRow = [];
    mergesCell =[];
    mergesCellRange = [];
    tojson = [];
    clickCellStart = null;
    clickCellOut = null;
    mergeNullcell = [];
    emptyFlag = false;
    allColorDocument = new Array(6);
    group = new Array(6);
    group[0] = new Array(1);
    group[1] = new Array(1);
    group[2] = new Array(1);
    group[3] = new Array(1);
    group[4] = new Array(1);
    group[5] = new Array(1);
    addGroup = new Array(6);
    addGroup[0] = new Array(1);
    addGroup[1] = new Array(1);
    addGroup[2] = new Array(1);
    addGroup[3] = new Array(1);
    addGroup[4] = new Array(1);
    addGroup[5] = new Array(1);
    judgeTableArray = new Array(6);
    tableRange = [];
    titleLength = 0;
    cellLength = 0;
    rangeCount = 0;
    typeTableRange = [];
    emptyFlag = false;

    $('#metaTitleFont').text("");
    $('#groupHeadFont').text("");
    $('#headerFont').text("");
    $('#dataFont').text("");
    $('#otherFont').text("");
    $('#nullCellFont').text("");

    axios({
        method: 'post',
        url: 'api/document/get_detect_cell_file',
        responseType: 'blob',
        data: {
            uuid: uuid,
            page_number: pageNum-1
        }
    }).then(function (response) {
   
        var reader_test = new FileReader();
        reader_test.readAsBinaryString(response.data);
        reader_test.addEventListener("loadend", function() {

            var fromTo = '';
            var test = XLSX.read(reader_test.result, {
                type: 'binary'
            })
            var persons = [];
            var workBook = test;

            var cellKey = JSON.parse(JSON.stringify(Object.keys(workBook.Sheets.Sheet1)))

            var cellDoc = [];
            var cellEnglish = [];
            var cellNum = [];
            
            for(var i = 0;i<cellKey.length;i++){
                if(!cellKey[i].includes("!")){
            
                    cellDoc.push({
                        position:cellKey[i],
                        word:workBook.Sheets.Sheet1[cellKey[i]].w,
                        col:parseInt(cellKey[i].substring(1,cellKey[i].length),10)-1,
                        row:english.indexOf(cellKey[i].substring(0,1))  
                    })
                    cellEnglish.push(cellKey[i].substring(0,1));
                    cellNum.push(parseInt(cellKey[i].substring(1,cellKey[i].length),10));
                    
                }
            }
            var cellNumMax = cellNum[0]
            for(var i = 1;i<cellNum.length;i++){
                if(cellNumMax<cellNum[i]){
                    cellNumMax = cellNum[i];
                }
            }
            var cellEnglishMax = english.indexOf(cellEnglish[cellEnglish.length-1])+1;

            dataBoard = [];

            var level = [];
            for(var i = 0;i<cellNumMax;i++){
            
                level = [];
                for(var j = 0;j<cellEnglishMax;j++){
                    level.push(" ");
                
                }
                dataBoard.push(level);
            }

            for(var i = 0;i<cellDoc.length;i++){
                dataBoard[cellDoc[i].col][cellDoc[i].row] = cellDoc[i].word;
            }

            for (var sheet in workBook.Sheets) {

                    fromTo = workBook.Sheets[sheet]['!ref'];
                    tojson = JSON.stringify(workBook.Sheets[sheet]);
                    var lattice = Object.keys(workBook.Sheets[sheet]).sort();
                    var find = [];
                    for(var i =0;i<lattice.length;i++){
                            if(i==0||i==1||i==2){
                                lattice.pop();
                            }else{
                                find.push(parseInt(lattice[i].substring(1,(lattice[i].length+1)), 10));
                            }
                    }
                    //找出最大row
                    var rowMax = find[0]
                    for(var i = 0;i<find.length;i++){
                        if (find[i] > rowMax) {
                            rowMax = find[i];
                        }
                    }
                    var noStrLattice = []
                    for(var i = 0;i<lattice.length;i++){
                        if(i==1){
                            noStrLattice.shift();
                        }
                        noStrLattice.push(lattice[i].substring(1,lattice[i].length));
                    }
                    var result = noStrLattice.filter(function(element, index, arr){
                        return arr.indexOf(element) === index;
                    });
                    var backLattice = lattice.pop().substring(0,1);
                    var englishTotal = english.indexOf(backLattice)+1;
                    var mustPosition = [];
                    for(var i = 0;i<englishTotal;i++){
                        for(var j = 0;j<rowMax;j++){j
                            mustPosition.push(english[i]+(j+1));
                        }
                    }
                    persons = persons.concat(XLSX.utils.sheet_to_json(workBook.Sheets[sheet]));
                    break; // 如果只取第一張表，就取消註釋這行
            }
            
            var arr = [];
            for(var i = 0;i<persons.length;i++){
                arr.push(Object.keys(persons[i]).length);
            }
            var result = arr[0];
            for (var i = 1; i < arr.length; i++) {
                result =  Math.max(result, arr[i]);
            }
            var resultIndex = arr.indexOf(result);
            var excelTitle= Object.keys(persons[resultIndex]);

            titleLength = excelTitle.length;

            for(var j =0;j<(excelTitle.length);j++){
                excelRow.push(excelTitle[j]);
                col.push({
                    type: 'text',
                    title:excelTitle[j],
                    width:100
                });                  
            }
     
            dealData(persons, dataBoard);

        });
    });
}
 
//check and test autosave api 測試用
var judgeTableFlag = true;
function savebutton(){
 
        if(judgeTableFlag){
            judgeTable("A1","A1");
            // $("#tableType").text("empty");
            $("#dataType").text("empty");
            judgeTableFlag = false;
        }
    
        var savePayload = JSON.parse(JSON.stringify(nowPayload["data"]))
        var needPage = Object.keys(savePayload)
        var noPage = []
        for(var i = 0;i<needPage.length;i++){
            if(needPage[i]!=("page"+pageNum)){
                noPage.push(needPage[i])
            }
        }

        for(var i = 0;i<noPage.length;i++){
            delete savePayload[noPage[i]]
        }

        var jsonNowPayload = JSON.stringify(nowPayload["data"]).length;
        var jsonOldApiData = JSON.stringify(oldAPIData).length;

        if (!(jsonNowPayload == jsonOldApiData)&&!(temporarilyPayload == jsonNowPayload)) {

            temporarilyPayload = jsonNowPayload;
        
            $.ajax({
                        url: "/api/document/autosave_detect_cell",
                        type: "POST",
                        data: JSON.stringify(
                            {
                                uuid: uuid,
                                page_number: pageNum,
                                data:savePayload
                            }
                        ),
                        dataType: "json",
                        contentType: "application/json"
                      }).done(function(res) {
                              
                        });
        }
    }


// autosave api
setInterval(function () {   
    
    if(judgeTableFlag){
        judgeTable("A1","A1");
        // $("#tableType").text("empty");
        $("#dataType").text("empty");
        judgeTableFlag = false;
    }
  
    var savePayload = JSON.parse(JSON.stringify(nowPayload["data"]));
    var needPage = Object.keys(savePayload);
    var noPage = []
    for(var i = 0;i<needPage.length;i++){
        if(needPage[i]!=("page"+pageNum)){
            noPage.push(needPage[i]);
        }
    }

    var jsonNowPayload = JSON.stringify(nowPayload["data"]).length;
    var jsonOldApiData = JSON.stringify(oldAPIData).length;

    if (!(jsonNowPayload == jsonOldApiData)&&!(temporarilyPayload == jsonNowPayload)) {
     
        temporarilyPayload = jsonNowPayload;
        $.ajax({
                    url: "/api/document/autosave_detect_cell",
                    type: "POST",
                    data: JSON.stringify(
                        {
                            uuid: uuid,
                            page_number: pageNum,
                            data:savePayload
                        }
                    ),
                    dataType: "json",
                    contentType: "application/json"
                  }).done(function(res) {
               
                    });
    }
}, 1000);

//分頁功能
pagination()
$('#subPage').on('click',function(e){
         
         if(pageNum!=1){
             pageNum--;
             $("#nowPage").text(pageNum);
             $("#jexcelOn div").remove();
             getDetectCellAPI();
             getFileApi();
         }
         
            });
$('#addPage').on('click',function(e){
        
         if(pageNum<pageMaxNum){
             pageNum++;
             $("#nowPage").text(pageNum);
             $("#jexcelOn div").remove();
             getDetectCellAPI();
             getFileApi();
         }
      
            });
function pagination(){
    $("#nowPage").text(pageNum);
}