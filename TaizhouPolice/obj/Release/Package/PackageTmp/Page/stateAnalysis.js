var table;
var jwttable;
var entitydata;
var starttime;
var endtime;
var hbstarttime;
var hbendtime;
var days = 0;
var ssddname;
var sszdname;
var sbmingc="车载视频";//设备名称

    //预编译模板
   
    //默认终止时间当前时间
    function enddatetimedefalute() {
        var reslut;
        var date = new Date();
        return reslut = formatDay(date);
    }
    function formatDay(dateC) {
        var y = dateC.getFullYear() + "-";
        var m = dateC.getMonth() + 1;
        var d = dateC.getDate();

        m = m < 10 ? "0" + m : "" + m;
        m = m + "-";
        d = d < 10 ? "0" + d : "" + d;
        //字符串拼接
        var dateday = y + m + d;
        return dateday;
    }


    $(".col-md-3 .btn-group").on("click", function (e) {
        $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
        return;
        switch (e.target.innerText) {
            case "日":
            case "周":
            case "月":
            case "年":
            case "半年":
            case "季":
                startdatetimedefalute(e.target.innerText);
                break;
           
            default:
                break;
        }

    })
   
  



function getMonthDays(myMonth) {
    var now = new Date(); //当前日期 
    var nowYear = now.getYear(); //当前年 
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}
//默认起始时间:当天00:00:00起
function startdatetimedefalute(date) {
    var curDate = new Date();
    var lastDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
    var preDate;
    var hbpreDate;
    var hblastDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天

    var now = new Date(); //当前日期 
    var nowYear = now.getYear(); //当前年 
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    switch (date) {
        case "日":
            preDate = lastDate; //起始时间和结束一样
            break;
        case "周":
            //  preDate = new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000);; //起始时间和结束差7天

            var myDate = new Date();
            myDate.setDate(myDate.getDay() == 0 ? myDate.getDate() - 6 : myDate.getDate() - (myDate.getDay() - 1)); //周一 
            var predate = new Date();
            predate.setDate(predate.getDay() == 0 ? predate.getDate() : predate.getDate() - (predate.getDay() - 1) + 6); //上周日

            myDate.setDate(myDate.getDate() - 7);
            predate.setDate(predate.getDate() - 7);

            preDate = myDate;
            lastDate = predate;


            var hbmyDate = new Date();
            hbmyDate.setDate(hbmyDate.getDay() == 0 ? hbmyDate.getDate() - 6 : hbmyDate.getDate() - (hbmyDate.getDay() - 1)); //周一 
            var hbpredate = new Date();
            hbpredate.setDate(hbpredate.getDay() == 0 ? hbpredate.getDate() : hbpredate.getDate() - (hbpredate.getDay() - 1) + 6); //上周日

          

            hbmyDate.setDate(hbmyDate.getDate() - 14);
            hbpredate.setDate(hbpredate.getDate() - 14);

            hbpreDate = hbmyDate;//环比时间

            hblastDate = hbpredate;;//环比时间

            break;
        case "月":
            // preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //当月
            // preDate.setDate(1);

            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

            var lastMonth = lastMonthDate.getMonth();
            if (lastMonth == 11) { nowYear -= 1;}
            var lastMonthStartDate = new Date(nowYear, lastMonth, 1); //这里的年有风险，待修复，可能不是今年
            var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));

            preDate = lastMonthStartDate;
            lastDate = lastMonthEndDate;
            var hblastMonthDate = new Date(); //huanb上月日期
            hblastMonthDate.setDate(1);
            hblastMonthDate.setMonth(hblastMonthDate.getMonth() - 2);

            var hblastMonth = hblastMonthDate.getMonth();
            var hblastMonthStartDate = new Date(nowYear, hblastMonth, 1);//这里的年有风险，待修复，可能不是今年
            var hblastMonthEndDate = new Date(nowYear, hblastMonth, getMonthDays(hblastMonth));

            hbpreDate = hblastMonthStartDate;
            hblastDate = hblastMonthEndDate;

            switch ($("#deviceName").val()) {
                case "1":
                      //上面计算的就是按照车载视频逻辑时间
                    break;

                case "4":

                    hbpreDate = new Date(nowYear-1, hblastMonth+1, 1);
                    hblastDate = new Date(nowYear-1, hblastMonth+1, getMonthDays(hblastMonth));;

                    break
                default:
                    break;

            }

              


            break;
        case "季":
            preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
            preDate.setDate(1)

            hbpreDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
            hbpreDate.setDate(1)
            switch (preDate.getMonth()) {
                case 0:
                case 1:
                case 2:
                    preDate.setMonth(9);
                    preDate.setYear(nowYear - 1);
                    lastDate = new Date(nowYear - 1, 11, getMonthDays(11));

                    hbpreDate.setMonth(6);
                    preDate.setYear(nowYear - 1);
                    hblastDate = new Date(nowYear - 1, 8, getMonthDays(8));

                    break;
                case 3:
                case 4:
                case 5:
                    preDate.setMonth(0);
                    lastDate = new Date(nowYear, 2, getMonthDays(2));


                    hbpreDate.setMonth(9);
                    hbpreDate.setYear(nowYear-1);
                    hblastDate = new Date(nowYear - 1, 11, getMonthDays(11));

                    break;
                case 6:
                case 7:
                case 8:
                    preDate.setMonth(3);
                    lastDate = new Date(nowYear, 5, getMonthDays(5));


                    hbpreDate.setMonth(0);
                    hblastDate = new Date(nowYear, 2, getMonthDays(2));

                    break;
                default:
                    preDate.setMonth(6);
                    lastDate = new Date(nowYear, 8, getMonthDays(8));

                    hbpreDate.setMonth(3);
                    hblastDate = new Date(nowYear, 5, getMonthDays(5));

                    break;
            }

            // 日期变换  

            switch ($("#deviceName").val()) {
                case "1":
                    //上面计算的就是按照车载视频逻辑时间
                    break;

                case "4":

                    hbpreDate = new Date(nowYear - 1, preDate.getMonth(), 1);
                    hblastDate = new Date(nowYear - 1, lastDate.getMonth(), getMonthDays(lastDate.getMonth()));;

                    break
                default:
                    break;

            }

            break;
        case "年":

            preDate = new Date(nowYear, 0, 1);//今年
            lastDate = new Date(nowYear, 11, 31);//今年

            hbpreDate = new Date(nowYear - 1, 0, 1);//去年同比
            hblastDate = new Date(nowYear - 1, 11, 31);//去年同比


            break;


        case "半年":
            preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);

            preDate = new Date(nowYear, 0, 1);///今年
            lastDate = new Date(nowYear, 5, 30);///今年

            hbpreDate = new Date(nowYear - 1, 0, 1);//去年同比
            hblastDate = new Date(nowYear - 1, 5, 30);//去年同比
          
            break;



    }

    // $('.start_form_datetime').val(transferDate(preDate));
    // $('.end_form_datetime').val(transferDate(lastDate));
    starttime = transferDate(preDate);
    endtime = transferDate(lastDate);
    //starttime = "2018/01/01"
   // endtime = "2018/01/25"

    hbstarttime = transferDate(hbpreDate);//环比时间
    hbendtime = transferDate(hblastDate);//环比时间
   // hbstarttime = "2017/01/01"
  //  hbendtime = "2017/01/25"
    var date3 = lastDate.getTime() - preDate.getTime()  //时间差的毫秒数
    days = Math.floor(date3 / (24 * 3600 * 1000)) + 1;


   
}

$("#cz-bianji").on("click", function () {
   // $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
    // switch (e.target.innerText) {

    startdatetimedefalute($(".btngroupactive").text());
   
    switch ($("#deviceName").val()) {
        case "1":
            $("#jwt-result-table_wrapper").hide();
            $("#search-result-table_wrapper").show();
            if (!table) {
                createDataTable();
            } else {

                $("#search-result-table").DataTable().ajax.reload();
            }
            sbmingc = "车载视频";
            break;

        case "2":
            $("#jwt-result-table_wrapper").hide();
            $("#search-result-table_wrapper").show();
            if (!table) {
                createDataTable();
            } else {

                $("#search-result-table").DataTable().ajax.reload();
            }

           
            sbmingc = "对讲机";

            break;

        case "3":
            $("#jwt-result-table_wrapper").hide();
            $("#search-result-table_wrapper").show();
            if (!table) {
                createDataTable();
            } else {

                $("#search-result-table").DataTable().ajax.reload();
            }


            sbmingc = "拦截仪";

            break;

        case "5":
            $("#jwt-result-table_wrapper").hide();
            $("#search-result-table_wrapper").show();
            if (!table) {
                createDataTable();
            } else {

                $("#search-result-table").DataTable().ajax.reload();
            }


            sbmingc = "执法记录仪";

            break;

        case "4":
            $("#jwt-result-table_wrapper").show();
            $("#search-result-table_wrapper").hide();

            if (!jwttable) {
                createDataTablejwt();
                $("#jwt-result-table").show();
            } else {
            
                $("#jwt-result-table").DataTable().ajax.reload();
            }

            sbmingc = "警务通";
            break;
           
    }
    




});


function transferDate(date) {
    // 年  
    var year = date.getFullYear();
    // 月  
    var month = date.getMonth() + 1;
    // 日  
    var day = date.getDate();

    if (month >= 1 && month <= 9) {

        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {

        day = "0" + day;
    }

    var dateString = year + '/' + month + '/' + day;

    return dateString;
}
   
function formatSeconds(value) {
   
    var result = Math.floor((value/60/60)*100)/100;

    return result;
}
$(function () { 
 $.ajax({
        type: "POST",
        url: "../Handle/Orgchart/GetEntitys.ashx",
        data: "",
        dataType: "json",
        success: function (data) {

            entitydata = data; //保存单位数据
            
            for (var i = 0; i < data.result.length; i++) {

                if (data.result[i].Depth == 2) {  //修改单位标题
                    // $(".brigadtitle p").text((data.result[i].Name));
                    $("#brigadeselect").append("<option value='" + data.result[i].ID + "'>" + data.result[i].Name + "</option>");
                    continue;
                }
            }
            for (var i = 0; i < entitydata.result.length; i++) {
                if (entitydata.result[i].ParentID == $("#brigadeselect").val()) {
                    $("#squadronselect").append("<option value='" + entitydata.result[i].ID + "'>" + entitydata.result[i].Name + "</option>");
                }
            }
            
            startdatetimedefalute("周");
            createDataTable("#search-result-table");
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
});


    //更换大队选择
    $("#brigadeselect").on("change", function (e) {
        //所属中队逻辑
        $("#squadronselect").empty();
        $("#squadronselect").append("<option value='all'>全部</option>");
        $("#squadronselect").removeAttr("disabled");
        if (e.target.value == "all") {
            $("#squadronselect").attr("disabled", "disabled");
            return;
        }
        for (var i = 0; i < entitydata.result.length; i++) {
            if (entitydata.result[i].ParentID == e.target.value) {
                $("#squadronselect").append("<option value='" + entitydata.result[i].ID + "'>" + entitydata.result[i].Name + "</option>");
            }
        }
    });


    $("#deviceName").on("change", function (e) {
        $(".btngroupactive").removeClass("btngroupactive");
        switch ($(this).val()) {
            case "1":
            case "2":
            case "3":
            case "5":
                $(".col-md-3 .btn-group button").remove();
                $(".col-md-3 .btn-group").prepend(" <button type='button' class='btn btn-default '>季</button>")
                $(".col-md-3 .btn-group").prepend(" <button type='button' class='btn btn-default '>月</button>")
                $(".col-md-3 .btn-group").prepend(" <button type='button' class='btn btn-default btngroupactive'>周</button>");

                break;
            case "4":
                $(".col-md-3 .btn-group button").remove();
                $(".col-md-3 .btn-group").append(" <button type='button' class='btn btn-default btngroupactive'>月</button>")
                $(".col-md-3 .btn-group").append(" <button type='button' class='btn btn-default '>季</button>")
                $(".col-md-3 .btn-group").append("<button type='button' class='btn btn-default'>半年</button>");
                $(".col-md-3 .btn-group").append("<button type='button' class='btn btn-default'>年</button>");
                break;
            default:

                break;
        }

    });

    var _filename = function () {
        var typename=""
        switch ($("#deviceName").val()) {
            case "1":
                typename = "车载视频";
                break
            case "4":
                typename = "警务通";
                break;
            case "2":
                typename = "对讲机";
                break
            case "3":
                typename = "拦截仪";
                break
            case "5":
                typename = "执法记录仪";
                break
            default:
                break;
        }

        if ($("#brigadeselect").val() == "all") {
            return  starttime + "_" + endtime + "台州交警局" + typename + "报表";
        }
        if ($("#squadronselect").val() == "all") {
            return starttime + "_" + endtime + ssddname + typename + "报表";
        }
        return  starttime + "_" + endtime + ssddname + "_" + sszdname + typename + "报表";

    }
    

    function createDataTablejwt() {
        $.fn.dataTable.ext.errMode = 'none';

        var columns = [
                          { "data": "序号" },
                          { "data": "单位名称" },
                          { "data": "警员数" },
                          { "data": "移动警务配发数量" },
                          { "data": "移动警务处罚数今年" },
                          { "data": "移动警务处罚数去年" },
                          { "data": "移动警务处罚数同比" },
                          { "data": "移动警务处罚占比今年" },
                          { "data": "移动警务处罚占比去年" },
                          { "data": "移动警务处罚占比同比" },
                          { "data": "机器平均今年" },
                          { "data": "机器平均去年" },
                          { "data": "机器平均去年同比" },
                          { "data": "人均今年" },
                          { "data": "人均去年" },
                          { "data": "人均去年同比" }
        ];


        var columnDefs = [{
            targets: 0,
            render: function (a, b, c, d) {
                var startIndex = d.settings._iDisplayStart;
                return startIndex + d.row + 1;

            }
        }

        ];




        jwttable = $('#jwt-result-table')
                       .on('error.dt', function (e, settings, techNote, message) {
                           console.log('An error has been reported by DataTables: ', message);
                       })
                 .on('preXhr.dt', function (e, settings, data) {
                     $('.progress').show();
                 })
             .on('xhr.dt', function (e, settings, json, xhr) {
                 var height = ($(window).height());
                 if (height < 800) {
                     var tableH = height - 405;
                     $("#jwt-result-table_wrapper").css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'height': tableH });

                 }
                 $('.progress').hide();
                 $(".search-result .search-result-flooterleft span:eq(0)").text(new Date(starttime).Format("yyyy年MM月dd日") + " 至 " + new Date(endtime).Format("yyyy年MM月dd日") + "  共" + days + "天");
                 ssddname = $("#brigadeselect").find("option:selected").text();
                 sszdname = $("#squadronselect").find("option:selected").text();

                 if ($('#jwt-result-table_wrapper .buttons-excel').length > 0) {
                     $('#jwt-result-table_wrapper .buttons-excel').removeAttr("aria-controls").attr("href", "../Handle/upload/" + json.title);
                 }
                 else {
                     $('#jwt-result-table_wrapper .btn-group').append("<a class='btn btn-default buttons-excel buttons-html5'  href='../Handle/upload/" + json.title + "'><span>导 出</span></a>");
                 }
                
             })

           .on('draw.dt', function () {
               $("#jwt-result-table tfoot tr td:eq(15)").html(new Date().Format("yyyy年MM月dd日"));
           })
            .DataTable({
                ajax: {
                    url: "../Handle/GetStateAnalysiss.ashx",
                    type: "POST",
                    data: function () {
                        ssdd = $("#brigadeselect").val();
                        sszd = $("#squadronselect").val();
                        type = $("#deviceName").val();
                        ssddtext = $("#brigadeselect").find("option:selected").text();
                        sszdtext = $("#squadronselect").find("option:selected").text();
                        return data = {ssddtext: ssddtext, sszdtext: sszdtext, type: type, ssdd: ssdd, sszd: sszd, begintime: starttime, endtime: endtime, hbbegintime: hbstarttime, hbendtime: hbendtime, days: days }
                    }

                },
                Paginate: true,
                pageLength: 8,
                Processing: true, //DataTables载入数据时，是否显示‘进度’提示  
                serverSide: false,   //服务器处理
                responsive: true,
                paging: true,
                autoWidth: true,
                "order": [],
                columns: columns,
                columnDefs: columnDefs,
                buttons: [
                {
                    extend: "print",
                    text: "打 印",
                    title: "<center> </center>",
                    footer: true,
                    exportOptions: {

                    },
                    customize: function (win) {
                        $(win.document.body).find('center').text(starttime + "_" + endtime + "警务通报表");
                        $(win.document.body).find('thead').prepend('<tr><th ></th><th ></th><th ></th><th ></th><th colspan="3">移动警务处罚数</th><th colspan="3" width="200px;">移动警务处罚占现场比例</th><th colspan="3">机器平均处罚量</th><th colspan="3">人均处罚量</th></tr>');
                    }


                }
                ],
                "language": {
                    "lengthMenu": "_MENU_每页",
                    "zeroRecords": "没有找到记录",
                    "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                    "infoEmpty": "无记录",
                    "infoFiltered": "(从 _MAX_ 条记录过滤)",
                    "search": "查找设备:",
                    "paginate": {
                        "previous": "上一页",
                        "next": "下一页"
                    }
                },

                dom: "" + "t" + "<'row' p>B",

                initComplete: function () {
                    //  $("#mytool").append('<button id="datainit" type="button" class="btn btn-primary btn-sm">增加基础数据</button>&nbsp');
                    // $("#datainit").on("click", initData);
                }

            });



    }

 

    var _customizeExcelOptions = function (xlsx) {
        var sheet = xlsx.xl.worksheets['sheet1.xml'];

     
   
        var downrows =1;
        var clRow = $('row', sheet);
        //update Row
        clRow.each(function () {
            var attr = $(this).attr('r');
            var ind = parseInt(attr);
            ind = ind + downrows;
            $(this).attr("r", ind);
        });

        // Update  row > c
        $('row c ', sheet).each(function () {
            var attr = $(this).attr('r');
            var pre = attr.substring(0, 1);
            var ind = parseInt(attr.substring(1, attr.length));
            ind = ind + downrows;
            $(this).attr("r", pre + ind);
        });

        function Addrow(index, data) {
            msg = '<row r="' + index + '">'
            for (i = 0; i < data.length; i++) {
                var key = data[i].k;
                var value = data[i].v;
                msg += '<c t="inlineStr" r="' + key + index + '" s="2">'; //'<c t="inlineStr" r="' + key + index + '" s="42">';
                msg += '<is>';
                msg += '<t>' + value + '</t>';
                msg += '</is>';
                msg += '</c>';
            }
            msg += '</row>';
            return msg;
        }

        //insert
        var r1 = Addrow(1, [{ k: 'E', v: '警务通处罚数' }, { k: 'H', v: '警务通处罚占现场处罚比例' }, { k: 'K', v: '机器平均处罚量' }, { k: 'N', v: '人均处罚量' }]);

        $('row c', sheet).attr("s", "51");
        $('row c[r^="B"]', sheet).attr("s", "50");
        $('row c[r$="2"]', sheet).attr("s", "2");
 

        sheet.childNodes[0].childNodes[1].innerHTML = r1  + sheet.childNodes[0].childNodes[1].innerHTML;

        console.log(sheet.childNodes[0].childNodes[1].innerHTML);


 

    }



    function createDataTable() {
        $.fn.dataTable.ext.errMode = 'none';
        var columns = [
                             { "data": "序号", "orderable": false },
                             { "data": null, "orderable": false },
                             { "data": "所属中队", visible: false },
                             { "data": "警员人数" },
                             { "data": "设备配发数" },
                             { "data": "在线时长" },
                             { "data": "视频大小" },
                             { "data": "设备使用率" }
                ];
          

       
        


        var columnDefs=[
                 {
                     targets: 1,
                     render: function (a, b, c, d) {

                         if ($("#brigadeselect").val() == "all") {
                             if (d.row == 0) {
                                 return "台州交警局";
                             }
                             else
                             {
                                 return c.所属大队;
                             }

                         }
                         if ($("#squadronselect").val() == "all")
                         {
                         
                             if (d.row == 0) {
                                 return $("#brigadeselect").find("option:selected").text()
                             }
                             return   c.所属中队;;
                            

                         }

                         if (d.row == 0) {
                             return $("#squadronselect").find("option:selected").text()
                         }
                         return c.警员人数;;
                        

                     }
                 }
                 /**
                 , {
                     targets: 2,
                     render: function (a, b, c, d) {
                       
                         var val = ($("#brigadeselect").val() == "all") ? "/" : c.所属中队;
                     

                         if ($("#squadronselect").val() != "all") {
                             val = $("#squadronselect").find("option:selected").text();
                         }
                         return val;
                        
                     }
                 }
                 **/
           , {
         targets: 3,
           render: function (a, b, c, d) {
               if (d.row > 0 && $("#squadronselect").val() != "all") {
                   return "1";
               }
               return c.警员人数;
               


         }
 }

        ];



        table = $("#search-result-table")
                 .on('preXhr.dt', function (e, settings, data) {
                     $('.progress').show();
                 })
                .on('xhr.dt', function (e, settings, json, xhr) {
                 var height = ($(window).height());
                 if (height < 800) {
                     var tableH = height - 335;
                     $("#search-result-table_wrapper").css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'height': tableH });

                 }
                 $('.progress').hide();
                 $(".search-result .search-result-flooterleft span:eq(0)").text(new Date(starttime).Format("yyyy年MM月dd日") + " 至 " + new Date(endtime).Format("yyyy年MM月dd日") + "  共" + days + "天");
                 ssddname = $("#brigadeselect").find("option:selected").text() ;
                 sszdname = $("#squadronselect").find("option:selected").text();
                 if ($('#search-result-table_wrapper .buttons-excel').length > 0) {
                     $('#search-result-table_wrapper .buttons-excel').removeAttr("aria-controls").attr("href", "../Handle/upload/" + json.title);
                 }
                 else {
                     $('#search-result-table_wrapper .btn-group').append("<a class='btn btn-default buttons-excel buttons-html5'  href='../Handle/upload/" + json.title + "'><span>导 出</span></a>");
                 }

                 switch ($("#deviceName").val()) {
                     case "1":   //车载视频
                     case "2":   //对讲机
                     case "3":   //对讲机

                         table.column(6).visible(false);
                         $("#search-result-table thead tr th:eq(4)").html("在线时长总和(小时)");
                         break;      
                     case "5":   //执法记录仪
                         table.column(6).visible(true);
                         $("#search-result-table thead tr th:eq(4)").html("文件大小(GB)");
                         $("#search-result-table thead tr th:eq(5)").html("视频长度总和(小时)");

                         break;
                 }

             })
           .on('draw.dt', function () {
             
               $("#search-result-table tfoot tr td:eq(7)").css("text-align", "right").html(new Date().Format("yyyy年MM月dd日"));
           })
            .DataTable({
            ajax: {
                url: "../Handle/GetStateAnalysiss.ashx",
                type: "POST",
                data: function () {
                    ssdd = $("#brigadeselect").val();
                    sszd = $("#squadronselect").val();
                    type = $("#deviceName").val();
                    ssddtext = $("#brigadeselect").find("option:selected").text();
                    sszdtext = $("#squadronselect").find("option:selected").text();
                    return data = {  ssddtext: ssddtext, sszdtext: sszdtext, type: type, ssdd: ssdd, sszd: sszd, begintime: starttime, endtime: endtime, hbbegintime: hbstarttime, hbendtime: hbendtime, days: days }
                }
                  
            },
            Paginate: true,
            pageLength:8,
            Processing: true, //DataTables载入数据时，是否显示‘进度’提示  
            serverSide: false,   //服务器处理
            responsive: true,
            paging: true,
            autoWidth: true,
            "order": [ ],
            columns: columns,
            columnDefs: columnDefs,
            buttons: [
            { extend: "print",
                text: "打 印",
                title: "<center></center>",
                footer: true,
                customize: function (win) {
                    $(win.document.body).find('center').text(starttime + "_" + endtime +sbmingc+ "报表");
                },
                exportOptions: {
                    columns: function (idx, data, node, h) {
                        var visible = table.column(idx).visible();
                        switch (node.outerText) {
                            case "":
                            case "设备使用率":
                                visible = false;
                                break;


                        }
                      
                        return visible;
                    }


                }


            }
            ],
            "language": {
                "lengthMenu": "_MENU_每页",
                "zeroRecords": "没有找到记录",
                "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "search": "查找设备:",
                "paginate": {
                    "previous": "上一页",
                    "next": "下一页"
                }
            },
            dom: "" + "t" + "<'row' p>B",
            initComplete: function () {
            }

            });

   

     
    }




    

   
    $(".col-md-3 .btn-group").mouseenter(function (e) {
        $('.btn-group').tooltip('hide');
        var title;
        switch (e.target.innerText) {
            case "周":
                title = "上周报表";
                break
            case "日":
                title = "昨日报表";
                break
            case "月":
                title = "上月报表";
                break
            case "季":
                title = "上季度报表";
                break
            case "半年":
                title = "半年报表";
                break
            case "年":
                title = "本年报表";
                break
            case "自定义":
                title = "自定义时间";
                break
        }
        $(".btn-group").attr("title", title);
        $("[data-toggle='tooltip']").tooltip('fixTitle').tooltip();
      

    });

   



Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

if (!$.cookie("username")) {
    window.location.href = "../Login.html";
}


