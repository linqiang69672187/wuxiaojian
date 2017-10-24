var table;
var entitydata;
var starttime;
var endtime;
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
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: true,
        minView: 2
    });
    $('.end_form_datetime').datetimepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayBtn: true,
        minView: 2
    });
    startdatetimedefalute();


    $("button").on("click", function (e) {
 
        $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
        switch (e.target.innerText) {
            case "昨日":
                 startdatetimedefalute(); 
                break;
            case "本周":
                getWeek(); 

                break;
            case "当月":
               getMonth(); 
               break;
            case "本年":
                getYear(); 
                break;
            case "本季":
                getQuarter();
                break;
            default:
                break;
        }

    })




});



//默认起始时间:当天00:00:00起
function startdatetimedefalute() {
    var curDate = new Date();
    var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
   // var beforepreDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天



    $('.start_form_datetime').val(transferDate(preDate));
    $('.end_form_datetime').val(transferDate(preDate));
}

function getWeek() {

    //按周日为一周的最后一天计算  
    var date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

    //今天是这周的第几天  
    var today = date.getDay();

    //上周日距离今天的天数（负数表示）  
    var stepSunDay = -today + 1;

    // 如果今天是周日  
    if (today == 0) {

        stepSunDay = -6;
    }

    // 周一距离今天的天数（负数表示）  
    var stepMonday = stepSunDay - today;

    var time = date.getTime();

    var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
    var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);

    //本周一的日期 （起始日期）  
    var startDate = transferDate(monday); // 日期变换  
    //本周日的日期 （结束日期）  


    $('.start_form_datetime').val(startDate);

    var preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); //前一天
    $('.end_form_datetime').val(transferDate(preDate));

}

function getMonth() {
    var preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); //前一天

    var start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    start.setDate(1);

    var startDate = transferDate(start); // 日期变换  

    $('.start_form_datetime').val(startDate);

    $('.end_form_datetime').val(transferDate(preDate));

}
function getYear() {


    var start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    start.setDate(1);
    start.setMonth(0);

    var startDate = transferDate(start); // 日期变换  

    $('.start_form_datetime').val(startDate);
    var preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); //前一天
    $('.end_form_datetime').val(transferDate(preDate));

}

function getQuarter() {
    var nowMonth = new Date().getMonth(); //当前月 

    var start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    start.setDate(1);
    switch(nowMonth)
    {
        case 0,1,2:
            start.setMonth(0);
            break;
        case 3, 4, 5:
            start.setMonth(3);
            break;
        case 6, 7, 8:
            start.setMonth(6);
            break;
        default:
            start.setMonth(9);
            break;


    }
    

    var startDate = transferDate(start); // 日期变换  

    $('.start_form_datetime').val(startDate);
    var preDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); //前一天
    $('.end_form_datetime').val(transferDate(preDate));
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


        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
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



    $("#cz-bianji,.toSearchText>.btn-default").on("click", function () {
        var pbegintime = $(".start_form_datetime").val();
        var pendtime = $(".end_form_datetime").val();
        if (pbegintime == "" || pendtime == "") {
            alert("起始和结束时间不能为空");
            return;

        }
    
      

        if (!table) {
            createDataTable();
        } else {
        
            $('#search-result-table').DataTable().ajax.reload(function () {
                
                

            });

        }

       
      
    });
    

    function createDataTable() {

        table = $('#search-result-table')
             .on('xhr.dt', function (e, settings, json, xhr) {
                 $(".search-result-flooterleft span").text(json.data.length + "台");

                 // Note no return - manipulate the data directly in the JSON object.

                 $('#search-result-table tbody').on('click', 'a.txzs-btn', function () {

                     var $doc = $(this).parents('tr');
                     var data = $('#search-result-table').DataTable().row($doc).data();
                     $doc.addClass("trselect");
                     shwomd(data["设备编号"], data["天数"]);

                 });

           
                 switch ($("#deviceName").val()) {
                     case "1":   //车载视频
                         table.column(3).visible(true);
                         table.column(9).visible(false);
                         break;
                     case "4":    //警务通
                         table.column(9).visible(true);
                         table.column(3).visible(false);
                         break;
                 }
             

             })

            .DataTable({
            ajax: {
                url: "../Handle/GetDataManagement.ashx",
                type: "POST",
                data: function () {
                    starttime = $(".start_form_datetime").val();
                    endtime =   $(".end_form_datetime").val()
                    return data = { search: $(".seach-box input").val(), type: $("#deviceName").val(), ssdd: $("#brigadeselect").val(), sszd: $("#squadronselect").val(), begintime: starttime, endtime: endtime }
                }
                  
            },
            Paginate: true,
            pageLength: 9,
            Processing: true, //DataTables载入数据时，是否显示‘进度’提示  
            serverSide: false,   //服务器处理
            responsive: true,
            paging: true,
            autoWidth: true,
           
            "order": [ [ 1, 'asc' ]],
            columns: [
                         { "data": null, "orderable": false },
                         { "data": "设备名称" },
                         { "data": "设备编号" },
                         { "data": "所在车辆" },
                         { "data": null },
                         { "data": "单位ID" },
                         { "data": "联系人" },
                         { "data": "联系电话" },
                         { "data": "在线时长" },
                         { "data": "处理量"},
                         { "data": "天数", "orderable": false },
                         { "data": null, "orderable": false }
            ],
            columnDefs: [
                    {
                        targets:0,
                        render: function (a, b, c, d) { var html = "<input type='checkbox' name='checkList' value=''>"; return html; }
                    },
                     {
                         targets: 11,
                         render: function (a, b, c, d) { var html = "<a  class='btn btn-sm btn-primary txzs-btn'  >展示</a>"; return html; }
                     }
                     ,
                     {
                         targets: 8,
                         render: function (a, b, c, d) { var html = formatSeconds(c.在线时长); return html; }
                     }
                     ,
                     {
                         targets: 5,
                         render: function (a, b, c, d) {
                             var parentid = "";
                             for (var i = 0; i < entitydata.result.length; i++) {
                                 if (entitydata.result[i].ID == c.单位ID) {
                                    return entitydata.result[i].Name;
                                   
                                 }
                             }

                           
                           
                             return "";
                         }
                     },
                      {
                          targets: 4,
                          render: function (a, b, c, d) {
                              var parentid = "";
                              for (var i = 0; i < entitydata.result.length; i++) {
                                  if (entitydata.result[i].ID == c.单位ID) {
                                    //  c.单位ID = entitydata.result[i].Name;
                                      parentid = entitydata.result[i].ParentID;
                                      i = entitydata.result.length;
                                  }
                              }

                              for (var i = 0; i < entitydata.result.length; i++) {
                                  if (entitydata.result[i].ID == parentid) {
                                      return entitydata.result[i].Name;

                                  }
                              }

                              return "";
                          }
                      }



                    


            ],
            buttons: [{
                extend: "excel",
                text: "导 出",
                filename: $(".start_form_datetime").val() + "-" + $(".end_form_datetime").val() +$("#deviceName").find("option:selected").text() + "数据统计报表",
                exportOptions: {  
                    columns: function (idx, data, node,h) {
                        var visible = table.column(idx).visible();
                        
                        switch (node.outerText) {
                            case "":
                            case "图形展示":
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
                //  $("#mytool").append('<button id="datainit" type="button" class="btn btn-primary btn-sm">增加基础数据</button>&nbsp');
                // $("#datainit").on("click", initData);
            }

        });



    }


    createDataTable();
 
   // $('#search-result-table').on('draw.dt', function () {
     //   console.log('Redraw occurred at: ' + new Date().getTime());
    //});

   
 

});




function shwomd(obj, iDays) {



    $.ajax({
        type: "POST",
        url: "../Handle/GetStatusDeviceID.ashx",
        data: { "DevicesID": obj, "starttime": starttime, "endtime": endtime, "iDays": iDays },
        dataType: "json",
        success: function (data) {

            $("#myModaltxzs").modal("show");
         
            createchar(data.result);
        },
        error: function (msg) {
            console.debug("错误:ajax");
          
        }
    });

}

$('#myModaltxzs').on('hidden.bs.modal', function () {
  
    $("#search-result-table").find(".trselect").removeClass("trselect"); //移除选择
})

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

function createchar(data) {

  
       
    var xaxis = [];//X轴
    //var ydata = []; //处理量
    var ydata1 = [];//在线时长

    for (var i = 0; i < data.length; i++) {
        if (data[i].Time.length == 7)
        {
            xaxis.push(data[i].Time);
        }
        else
        {
        var oldTime = (new Date(data[i].Time)).getTime();
        var curTime = new Date(oldTime).Format("M/d");
       xaxis.push(curTime);
       }
        ydata1.push(parseInt(data[i].OnlineTime));

    }
    var yaxis, series = [];
    
            yaxis = [{ // Primary yAxis
                labels: {
                    format: '{value}分钟',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: '在线时长',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }];
            series = [ { name: '在线时长', type: 'spline', data: ydata1, tooltip: { valueSuffix: '分钟' } }]
    



    $('#txbox').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: '' 
        },
        xAxis: [{
            categories: xaxis,
            crosshair: true
        }],
        yAxis: yaxis,
    

        plotOptions: {
            series: {
                cursor: 'pointer',
                events: {
                    click: function (event) {
                        alert(event.point.category);
                    }
                }
            }
        },
        
        series: series,
        navigation: {
            buttonOptions: {
                enabled: true
            }
        }
        ,
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: 'Export to PNG (small)',
                        onclick: function () {
                            this.exportChart({
                                width: 250
                            });
                        }
                    }, {
                        text: 'Export to PNG (large)',
                        onclick: function () {  
                            this.exportChart();
                        },
                        separator: false
                    }]
                }
            }
        }
    });
}
