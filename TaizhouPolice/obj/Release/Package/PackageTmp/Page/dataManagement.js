var table;
var entitydata;
var starttime;
var endtime;
var ssdd;
var sszd;
var state;
var search;
var type;
var date;
var tablezd;
var tablegr;
var zdEntityID;
var typelx=0; //查询类型[0汇总，1明细]

$(function () {
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

    $('.start_form_datetime').datetimepicker({
        format: 'yyyy/m/d',
        autoclose: true,
        todayBtn: true,
        minView: 2
    });
    $('.end_form_datetime').datetimepicker({
        format: 'yyyy/mm/dd',
        autoclose: true,
        todayBtn: true,
        minView: 2
    });
    startdatetimedefalute("周");
    $("button").on("click", function (e) {
        $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
        switch (e.target.innerText) {
            case "日":
            case "周":
            case "月":
            case "年":
            case "季":
                startdatetimedefalute(e.target.innerText);
                break;
            case "自定义":
                $('.start_form_datetime').datetimepicker('show');
            default:
                break;
        }

    })
   
  

});
$(".start_form_datetime,.end_form_datetime").change(function () {
    $(".btn-group button:last").addClass("btngroupactive").siblings().removeClass("btngroupactive");
});

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

           break;
        case "月":
           // preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //当月
            // preDate.setDate(1);
          
            var lastMonthDate = new Date(); //上月日期
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            var lastMonth = lastMonthDate.getMonth();
            var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
            var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));


            preDate = lastMonthStartDate;
            lastDate = lastMonthEndDate;


            break;
        case "季":
            preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
            preDate.setDate(1)
            switch (preDate.getMonth()) {
                case 0:
                case 1:
                case 2:
                    preDate.setMonth(9);
                    preDate.setYear(nowYear - 1);
                    lastDate = new Date(nowYear - 1, 11, getMonthDays(11));
                    break;
                case 3:
                case 4:
                case 5:
                    preDate.setMonth(0);
                    lastDate = new Date(nowYear, 2, getMonthDays(2));
                    break;
                case 6:
                case 7:
                case 8:
                    preDate.setMonth(3);
                    lastDate = new Date(nowYear , 5, getMonthDays(5));
                    break;
                default:
                    preDate.setMonth(6);
                    lastDate = new Date(nowYear, 8, getMonthDays(8));
                    break;
            }

            // 日期变换  

            break;
        case "年":
            preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
            preDate.setDate(1);
            preDate.setMonth(0);
            break;
       
      
    }
 
    $('.start_form_datetime').val(transferDate(preDate));
    $('.end_form_datetime').val(transferDate(lastDate));
}

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
            
            readCookie();
            createDataTable();
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });


    function readCookie() {

        var devicetype = $.cookie("deviceType");
        var selectEntityID = $.cookie("selectEntityID");
        var selectParentID = $.cookie("selectParentID");
        var selectDepth = $.cookie("selectDepth");
        var selectcontatcs = $.cookie("selectcontatcs");
        if (devicetype != undefined) {
            $("#deviceName").val(devicetype); //初始化设置设备名称

            switch (selectParentID + selectDepth) {
                case "-11": //选中台州公安
                    break;
                case "12":  //直属大队
                    $("#brigadeselect").val(selectEntityID);
                    break;
                default:
                    InitSelectZD(selectEntityID);
                    break;
            }

            if (selectcontatcs != undefined && selectcontatcs != "") {
                $(".seach-box input").val(selectcontatcs);

            }




        }


        function InitSelectZD(entitid) {
            var parentid = $.cookie("selectParentID");
            $("#squadronselect").empty();
            $("#squadronselect").append("<option value='all'>全部</option>");
            $("#squadronselect").removeAttr("disabled");
         
            for (var i = 0; i < entitydata.result.length; i++) {
                if (entitydata.result[i].ParentID == parentid) {
                    $("#squadronselect").append("<option value='" + entitydata.result[i].ID + "'>" + entitydata.result[i].Name + "</option>");
                  
                }
            }
            $("#brigadeselect").val(parentid);
            $("#squadronselect").val(entitid);


        }
    }

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



    $(".cell-button,.toSearchText>.btn-default").on("click", function () {
        $('.progress').show();
        var pbegintime = $(".start_form_datetime").val();
        var pendtime = $(".end_form_datetime").val();
        if (pbegintime == "" || pendtime == "") {
            alert("起始和结束时间不能为空");
            return;

        }
        if (this.id == "cz-all") {
            typelx = 1;//汇总
        }
        else
        {
            typelx = 0;//明细
        }
        if (!table) {
            createDataTable();
        } else {
        
            $('#search-result-table').DataTable().ajax.reload(function () {   });

        }     
    });
    





    function createDataTable() {
        
        var columns = [
                          { "data": null },
                          { "data": null },
                          { "data": "EntityId" },             
                          { "data": "总数" },
                          { "data": "PlateNumber" },
                          { "data": "Contacts" },
                          { "data": "在线时长" },
                          { "data": "状态" },
                          { "data": "预警总数" },
                          { "data": "AlarmDay" },
                          { "data": null, "orderable": false }
            ];
      
       
        $.fn.dataTable.ext.errMode = 'none';
        table = $('#search-result-table')
           
           .on('error.dt', function (e, settings, techNote, message) {
               console.log('An error has been reported by DataTables: ', message);
           })
             .on('xhr.dt', function (e, settings, json, xhr) {
                 var height = ($(window).height());
                 if (height < 800) {
                     var tableH = height - 455;
                     $("#search-result-table_wrapper").css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'height': tableH });

                 }
                 $('.progress').hide();
                 var date3 = new Date(endtime).getTime() - new Date(starttime).getTime();
                 var days = Math.floor(date3 / (24 * 3600 * 1000)) + 1;
                 var alarmcount = 0;
                 var totalcount = 0;
                 for (var i = 0; i < json.data.length; i++) {
                     totalcount += parseInt(json.data[i]["总数"]);
                     alarmcount += parseInt(json.data[i]["预警总数"]);
                 }

                 $(".search-result .search-result-flooterleft").width($(".search-result").width() - 100);
                 $(".search-result .search-result-flooterleft span:eq(0)").text(new Date(starttime).Format("yyyy年MM月dd日") + " 至 " + new Date(endtime).Format("yyyy年MM月dd日") + "  共" + days + "天");
                 $(".search-result .search-result-flooterleft span:eq(1)").text("总数：" + totalcount + "  预警总数：" + alarmcount);

                 if ($('#search-result-table_wrapper .buttons-excel').length > 0) {
                     $('#search-result-table_wrapper .buttons-excel').removeAttr("aria-controls").attr("href", "../Handle/upload/sjtj/" + json.title);
                 }
                 else {
                     $('#search-result-table_wrapper .btn-group').append("<a class='btn btn-default buttons-excel buttons-html5'  href='../Handle/upload/sjtj/" + json.title + "'><span>导 出</span></a>");
                 }
                 if (typelx == 0) {//汇总
                     table.column(4).visible(false);
                     table.column(5).visible(false);
                     table.column(3).visible(true); //4,9,10
                     table.column(8).visible(true);
                     table.column(10).visible(true);
                     $("#search-result-table thead tr th:eq(3)").html("总数(台)");
                 }
                 else {
                   
                     table.column(8).visible(false);
                     table.column(10).visible(false);
                     table.column(5).visible(true);
                     table.column(3).visible(false);
                     switch ($("#deviceName").val()) {
                         case "1":   //车载视频
                             table.column(4).visible(true);
                             $("#search-result-table thead tr th:eq(3)").html("车辆号码");
                             $("#search-result-table thead tr th:eq(5)").html("在线时长(小时)");

                             break
                         case "2":   //对讲机
                             table.column(3).visible(true);
                             table.column(4).visible(true);
                             $("#search-result-table thead tr th:eq(5)").html("在线时长(小时)");
                             $("#search-result-table thead tr th:eq(3)").html("设备编号");
                             $("#search-result-table thead tr th:eq(4)").html("警号");
                             break;
                         case "4":    //警务通
                         case "3":    //拦截仪
                             table.column(4).visible(true);
                             $("#search-result-table thead tr th:eq(5)").html("在线时长(小时)");

                             $("#search-result-table thead tr th:eq(3)").html("设备编号");
                             break;
                         case "5":   //执法记录仪
                           
                             table.column(4).visible(true);
                             $("#search-result-table thead tr th:eq(5)").html("视频长度(小时)");
                             $("#search-result-table thead tr th:eq(3)").html("设备编号");
                             break;
                     }


                 }

                

               
             })

            .DataTable({
            ajax: {
                url: "../Handle/GetDataManagement.ashx",
                type: "POST",
                data: function () {
                    starttime = $(".start_form_datetime").val();
                    endtime = $(".end_form_datetime").val()
                    ssdd = $("#brigadeselect").val();
                    sszd = $("#squadronselect").val();
                    state = $("#alarmType").val();
                    search = $(".seach-box input").val();
                    type = $("#deviceName").val();
                    ssddtext = $("#brigadeselect").find("option:selected").text();
                    sszdtext = $("#squadronselect").find("option:selected").text();
                    return data = { ssddtext: ssddtext, sszdtext: sszdtext, search: search, type: type, ssdd: ssdd, sszd: sszd, begintime: starttime, endtime: endtime, state: state, typelx: typelx }
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
            columnDefs: [
                      {
                      targets: 0,
                      render: function (a, b, c, d) {
                          var startIndex = d.settings._iDisplayStart;
                          return startIndex + d.row + 1;
                          
                      }
                      }
                        ,
                     {
                         targets: 1,
                         render: function (a, b, c, d) {
                             var ssdd=$("#brigadeselect").find("option:selected").text();
                             switch (ssdd) {
                                 case "全部":
                                     if (typelx == 0) {//
                                         for (var i = 0; i < entitydata.result.length; i++) {
                                             if (entitydata.result[i].ID == c.EntityId) {
                                                 return entitydata.result[i].Name;

                                             }
                                         }
                                     } else
                                     {
                                         var parentid
                                         for (var i = 0; i < entitydata.result.length; i++) {
                                             if (entitydata.result[i].ID == c.EntityId) {
                                                 parentid = entitydata.result[i].ParentID;
                                                 i = 9999;

                                             }
                                         }
                                         for (var i = 0; i < entitydata.result.length; i++) {
                                             if (entitydata.result[i].ID == parentid) {
                                                 return entitydata.result[i].Name;
                                                 

                                             }
                                         }


                                     }

                                     break;
                                 default:
                                     return ssdd;
                                     break;
                             }
                         

                         }
                     }
                        ,
                     {
                         targets: 2,
                         render: function (a, b, c, d) {
                             if (typelx == 0) {//
                                 var val = ($("#squadronselect").val() == "all") ? "/" : $("#squadronselect").find("option:selected").text()
                                 return val;
                             }
                             else
                             {
                                 if (c.EntityId == "") {
                                     return "/";
                                 }
                                 for (var i = 0; i < entitydata.result.length; i++) {
                                     if (entitydata.result[i].ID == c.EntityId) {
                                         return entitydata.result[i].Name;

                                     }
                                 }
                             }
                         }
                     }
                      ,
                    {
                        targets: 3,
                        render: function (a, b, c, d) {
                            if (typelx == 0) {//汇总
                                return c.总数;
                            }
                            else { return c.DevId; }
                                    
                        }
                    }
                      ,
                    {
                        targets: 4,
                        render: function (a, b, c, d) {
                            switch ($("#deviceName").val()) {
                                case "1":   //车载视频            
                                case "2":   //对讲机   
                                    return c.PlateNumber;
                                    break;
                                case "4":    //警务通   
                                case "3":    //拦截仪  
                                case "5":   //执法记录仪   
                                    return c.DevId;
                                    break;
                            }


                        }
                    }
                     ,
                    {
                        targets: 9,
                        render: function (a, b, c, d) { var html = new Date(c.AlarmDay).Format("yyyy年MM月dd日"); return html; }
                    },
                    {
                        targets:6,
                        render: function (a, b, c, d) { var html = formatSeconds(c.在线时长); return html; }
                     }
                     ,
                     {
                         targets:10,
                         render: function (a, b, c, d) { var html = "<a  class='btn btn-sm btn-primary txzs-btn' parentid='" + c.EntityId + "'  >查看详情</a>"; return html; }
                     }
                 
                    


            ],
            buttons: [ ],
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
    $('#search-result-table tbody').on('click', 'a.txzs-btn', function () {
        var $doc = $(this).parents('tr');
        var data = $('#search-result-table').DataTable().row($doc).data();
        $doc.addClass("trselect");
        date = data["AlarmDay"];
        ssdd = $(this).attr("parentid");
        ssddtext = $doc.find("td:eq(1)").text();
        sszdtext = $doc.find("td:eq(2)").text();
        if (sszd == "all") {
            showzd();//显示中队汇总详情
        }
        else
        {
            zdEntityID = sszd;
            showgr();//显示设备详情
        }

    });

    $('#detail-result-table tbody').on('click', 'a.txzs-btn', function () {

        var $doc = $(this).parents('tr');
        var data = $('#detail-result-table').DataTable().row($doc).data();
        $doc.addClass("trselect"); 
        zdEntityID = data["EntityId"]
        ssddtext = $doc.find("td:eq(1)").text();
        sszdtext = $doc.find("td:eq(2)").text();
        showgr()//显示设备详情

    });

   
    $(".btn-group button").mouseenter(function (e) {
        $('.btn-group').tooltip('hide');
        var title;
        switch (this.innerText) {
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

   

});
function showgr() {
    $("#myModaltxzs").css({ opacity: 0 });
    $("#myModalgr").modal("show");
    if (!tablegr) {
        createtablegr();
    } else {
        $('#detailgr-result-table').DataTable().ajax.reload(function () {
        });
    }
}
function showzd() {
    $("#myModaltxzs").modal("show");
    if (!tablezd) {
        createtablezd();
    } else {
        $('#detail-result-table').DataTable().ajax.reload(function () {
        });
    }
}

$('#myModaltxzs').on('hidden.bs.modal', function () {

    $("#search-result-table").find(".trselect").removeClass("trselect"); //移除选择
});
$('#myModalgr').on('hidden.bs.modal', function () {

    $("#detail-result-table").find(".trselect").removeClass("trselect"); //移除选择
    $("#myModaltxzs").css({ opacity: 1 });
    if (sszd != "all") {
        $("#search-result-table").find(".trselect").removeClass("trselect"); //移除选择
    }

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

function createtablezd() {
    tablezd = $('#detail-result-table')
                   .on('error.dt', function (e, settings, techNote, message) {
                       console.log('An error has been reported by DataTables: ', message);
                   })
         .on('xhr.dt', function (e, settings, json, xhr) {
            
             var alarmcount = 0;
             var totalcount = 0;
             for (var i = 0; i < json.data.length; i++) {
                 totalcount += parseInt(json.data[i]["总数"]);
                 alarmcount += parseInt(json.data[i]["预警总数"]);
             }

             if ($('#detail-result-table_wrapper .buttons-excel').length > 0) {
                 $('#detail-result-table_wrapper .buttons-excel').removeAttr("aria-controls").attr("href", "../Handle/upload/sjtj/" + json.title);
             }
             else {
                 $('#detail-result-table_wrapper .btn-group').append("<a class='btn btn-default buttons-excel buttons-html5'  href='../Handle/upload/sjtj/" + json.title + "'><span>导 出</span></a>");
             }
             $("#myModaltxzs .search-result-flooterleft span:eq(0)").text(new Date(date).Format("yyyy年MM月dd日"));

             $("#myModaltxzs .search-result-flooterleft span:eq(1)").text("总数：" + totalcount + "  预警总数：" + alarmcount);
             $('#detail-result-table').css("width", "1028px;");

     })
        .DataTable({
            ajax: {
                url: "../Handle/GetDataManagementDay.ashx",
                type: "POST",
                data: function () {
                    return data = { ssddtext: ssddtext, sszdtext: sszdtext, search: search, type: type, ssdd: ssdd, sszd: sszd, date: date, endtime: endtime, state: state }
                }
            },
            Paginate: true,
            pageLength: 6,
            Processing: true, //DataTables载入数据时，是否显示‘进度’提示  
            serverSide: false,   //服务器处理
            responsive: true,
            paging: true,
            autoWidth: true,

            "order": [[1, 'asc']],
            columns: [
                         { "data": null, "orderable": false },
                         { "data": null },
                         { "data": "EntityId" },
                    
                         { "data": "总数" },
                         { "data": "在线时长" },
                         { "data": "状态" },
                         { "data": "预警总数" },
                         { "data": null },
                         { "data": null, "orderable": false }
            ],
            columnDefs: [
                      {
                          targets: 0,
                          render: function (a, b, c, d) {
                              var startIndex = d.settings._iDisplayStart;
                              return startIndex + d.row + 1;

                          }
                      }
                        ,
                     {
                         targets: 1,
                         render: function (a, b, c, d) {
                             for (var i = 0; i < entitydata.result.length; i++) {
                                 if (entitydata.result[i].ID == ssdd) {
                                     return entitydata.result[i].Name;

                                 }
                             }
                            
                         }
                     }
                        ,
                     {
                         targets: 2,
                         render: function (a, b, c, d) {
                             for (var i = 0; i < entitydata.result.length; i++) {
                                 if (entitydata.result[i].ID == c.EntityId) {
                                     return entitydata.result[i].Name;

                                 }
                             }
                           
                         }
                     }
                     ,
                    {
                        targets: 7,
                        render: function (a, b, c, d) { var html = new Date(date).Format("yyyy年MM月dd日"); return html; }
                    },
                    {
                        targets: 4,
                        render: function (a, b, c, d) { var html = formatSeconds(c.在线时长); return html; }
                    }
                     ,
                     {
                         targets: 8,
                         render: function (a, b, c, d) { var html = "<a  class='btn btn-sm btn-primary txzs-btn'  >查看详情</a>"; return html; }
                     }
            ],
            buttons: [],
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

            dom: "" + "t" + "<'row' p>B"
        });

}


function createtablegr() {
    tablegr = $('#detailgr-result-table')
                   .on('error.dt', function (e, settings, techNote, message) {
                       console.log('An error has been reported by DataTables: ', message);
                   })
         .on('xhr.dt', function (e, settings, json, xhr) {

             var alarmcount = 0;
             var totalcount = 0;
             for (var i = 0; i < json.data.length; i++) {
                 totalcount += parseInt(json.data[i]["总数"]);
                 alarmcount += parseInt(json.data[i]["预警总数"]);
             }

             if ($('#detailgr-result-table_wrapper .buttons-excel').length > 0) {
                 $('#detailgr-result-table_wrapper .buttons-excel').removeAttr("aria-controls").attr("href", "../Handle/upload/sjtj/" + json.title);
             }
             else {
                 $('#detailgr-result-table_wrapper .btn-group').append("<a class='btn btn-default buttons-excel buttons-html5'  href='../Handle/upload/sjtj/" + json.title + "'><span>导 出</span></a>");
             }
             $("#myModalgr .search-result-flooterleft span:eq(0)").text(new Date(date).Format("yyyy年MM月dd日"));
             $("#myModalgr .search-result-flooterleft span:eq(1)").text("总数：" + totalcount + "  预警总数：" + alarmcount);
         
             switch (type) {
                 case "1":   //车载视频
                     tablegr.column(4).visible(false);
                     break;
                 case "2":   //对讲机
                     tablegr.column(4).visible(true);
                     $("#detailgr-result-table thead tr th:eq(4)").html("警号");
                     break;
                 case "4":    //警务通
                 case "5":    //执法记录仪
                 case "3":    //拦截仪
                     tablegr.column(4).visible(false);
                   //  $("#detailgr-result-table thead tr th:eq(4)").html("设备编号");
                     break;
             }
             
         })
        .DataTable({
            ajax: {
                url: "../Handle/GetDataManagementDay.ashx",
                type: "POST",
                data: function () {
                    return data = { ssddtext: ssddtext, sszdtext: sszdtext, search: search, type: type, ssdd: ssdd, sszd: zdEntityID, date: date, endtime: endtime, state: state }
                }
            },
            Paginate: true,
            pageLength: 6,
            Processing: true, //DataTables载入数据时，是否显示‘进度’提示  
            serverSide: false,   //服务器处理
            responsive: true,
            paging: true,
            autoWidth: true,

            "order": [[1, 'asc']],
            columns: [
                         { "data": null, "orderable": false },
                         { "data": null },
                         { "data": null },
                         { "data": "DevId" },
                         { "data": "PlateNumber" },
                         { "data": "Contacts" },
                         { "data": "Value" },
                         { "data": "状态" },
                      
            ],
            columnDefs: [
                      {
                          targets: 0,
                          render: function (a, b, c, d) {
                              var startIndex = d.settings._iDisplayStart;
                              return startIndex + d.row + 1;

                          }
                      }
                        ,
                     {
                         targets: 1,
                         render: function (a, b, c, d) {
                             for (var i = 0; i < entitydata.result.length; i++) {
                                 if (entitydata.result[i].ID == ssdd) {
                                     return entitydata.result[i].Name;

                                 }
                             }

                         }
                     }
                        ,
                     {
                         targets: 2,
                         render: function (a, b, c, d) {
                             for (var i = 0; i < entitydata.result.length; i++) {
                                 if (entitydata.result[i].ID == c.EntityId) {
                                     return entitydata.result[i].Name;

                                 }
                             }

                         }
                     },
                     {
                         targets: 4,
                         render: function (a, b, c, d) {
                             switch (type) {
                                 case "1":   //车载视频
                                 case "2":   //对讲机
                                     return c.PlateNumber
                                     break;
                                 case "4":    //警务通
                                 case "5":    //执法记录仪
                                 case "3":    //拦截仪
                                     return c.DevId
                                     break;
                             }

                         }
                     }
                      ,
                     {
                         targets:6,
                         render: function (a, b, c, d) { var html = formatSeconds(c.Value); return html; }
                     }
                   
            ],
            buttons: [
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

            dom: "" + "t" + "<'row' p>B"
        });

}

/** 拖拽模态框*/
var mouseStartPoint = { "left": 0, "top": 0 };
var mouseEndPoint = { "left": 0, "top": 0 };
var mouseDragDown = false;
var oldP = { "left": 0, "top": 0 };
var moveTartet;
$(document).ready(function () {
    $(document).on("mousedown", ".modal-header", function (e) {
        if ($(e.target).hasClass("close"))//点关闭按钮不能移动对话框  
            return;
        mouseDragDown = true;
        moveTartet = $(this).parent();
        mouseStartPoint = { "left": e.clientX, "top": e.clientY };
        oldP = moveTartet.offset();
    });
    $(document).on("mouseup", function (e) {
        mouseDragDown = false;
        moveTartet = undefined;
        mouseStartPoint = { "left": 0, "top": 0 };
        oldP = { "left": 0, "top": 0 };
    });
    $(document).on("mousemove", function (e) {
        if (!mouseDragDown || moveTartet == undefined) return;
        var mousX = e.clientX;
        var mousY = e.clientY;
        if (mousX < 0) mousX = 0;
        if (mousY < 0) mousY = 25;
        mouseEndPoint = { "left": mousX, "top": mousY };
        var width = moveTartet.width();
        var height = moveTartet.height();
        mouseEndPoint.left = mouseEndPoint.left - (mouseStartPoint.left - oldP.left);//移动修正，更平滑  
        mouseEndPoint.top = mouseEndPoint.top - (mouseStartPoint.top - oldP.top);
        moveTartet.offset(mouseEndPoint);
    });

    if (!$.cookie("username")) {
        window.location.href = "../Login.html";
    }
    
});
