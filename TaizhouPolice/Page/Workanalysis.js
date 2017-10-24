$(function () {
  
    var contactsdata;


    $(".glyphicon").on("click", function (e) {

        if ($(".carVideo-title i").is(".glyphicon-chevron-up")) {
            $(".carVideo-title i").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        } else {
            $(".carVideo-title i").addClass("glyphicon-chevron-up").removeClass("glyphicon-chevron-down");
        }
        if ($(".carVideo-box").is(":visible")) {
            $(".carVideo-box").slideUp(500);

        } else {
            $(".carVideo-box").slideDown(500);
        }
    });


});

var date = new Date();

$('.start_form_datetime').datetimepicker({
    format: 'yyyy/mm/dd',
    autoclose: true,
    todayBtn: true,
    minView: "month" 
});

$('.end_form_datetime').datetimepicker({
    format: 'yyyy/mm/dd',
    autoclose: true,
    todayBtn: true,
    minView: "month"
});
startdatetimedefalute()//初始化时间值

//默认起始时间:当天00:00:00起
function startdatetimedefalute() {
    var curDate = new Date();
    var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
    var beforepreDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000 * 2); //前一天



    $('.start_form_datetime').val(transferDate(beforepreDate));
    $('.end_form_datetime').val(transferDate(preDate));
}

function getWeek() {

    //按周日为一周的最后一天计算  
    var date = new Date();

    //今天是这周的第几天  
    var today = date.getDay();

    //上周日距离今天的天数（负数表示）  
    var stepSunDay = -today +1;

    // 如果今天是周日  
    if (today == 0) {

        stepSunDay = -7;
    }

    // 周一距离今天的天数（负数表示）  
    var stepMonday = 7 - today;

    var time = date.getTime();

    var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
    var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);

    //本周一的日期 （起始日期）  
    var startDate = transferDate(monday); // 日期变换  
    //本周日的日期 （结束日期）  
    var endDate = transferDate(sunday); // 日期变换  

    $('.start_form_datetime').val(startDate);

    var preDate = new Date(date.getTime() - 24 * 60 * 60 * 1000); //前一天
    $('.end_form_datetime').val(transferDate(preDate));
   
}

function getMonth() {

    // 获取当前月的第一天  
    var start = new Date();
    start.setDate(1);

    // 获取当前月的最后一天  
    var date = new Date();
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    var end = new Date(nextMonthFirstDay - oneDay);

    var startDate = transferDate(start); // 日期变换  
    var endDate = transferDate(end); // 日期变换  


    $('.start_form_datetime').val(startDate);

    var preDate = new Date(new Date.getTime() - 24 * 60 * 60 * 1000); //前一天
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

$("#selectdevices").on("change", function (e) {
    $("#selectonline").empty();
    if (e.target.value == "警务通") {
        $("#selectonline").append("<option value='zxsc'>在线时长</option>");
        $("#selectonline").append("<option value='cll'>处理量</option>");
        //$("#selectonline").append("<option value='lxzxsc'>连续在线时长</option>");
        //$("#selectonline").append("<option value='lxlxsc'>连续离线时长</option>");
    }
    else {
        $("#selectonline").append("<option value='zxsc'>在线时长</option>");
        //$("#selectonline").append("<option value='lxzxsc'>连续在线时长</option>");
        // $("#selectonline").append("<option value='lxlxsc'>连续离线时长</option>");
    }
});
$("#selectonline").on("change", function (e) {
    if (e.target.value == "lxzxsc" || e.target.value == "lxlxsc"){
        $(".start_form_datetime").attr("disabled", "disabled");
        $(".end_form_datetime").attr("disabled", "disabled");
    }
    else
    {
        $(".start_form_datetime").removeAttr("disabled");
        $(".end_form_datetime").removeAttr("disabled");
    }
});

//更换大队选择
$("#brigadeselect").on("change", function (e) {
  
    //联系人逻辑
    $("#contactselect").empty();
    $("#contactselect").append("<option value='all'>全部</option>");
    $("#contactselect").attr("disabled", "disabled");

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


//更换中队选择
$("#squadronselect").on("change", function (e) {

    //联系人逻辑
    $("#contactselect").empty();
    $("#contactselect").append("<option value='all'>全部</option>");
    $("#contactselect").removeAttr("disabled");
    if (e.target.value == "all") {
        $("#squadronselect").attr("disabled", "disabled");
        return;
    }
    for (var i = 0; i < contactsdata.length; i++) {
        if (contactsdata[i].EntityID == e.target.value) {
            $("#contactselect").append("<option value='" + contactsdata[i].Contacts + "'>" + contactsdata[i].Contacts + "</option>");
        }
    }
});

$("button").on("click", function (e) {
    var onlinetype = $("#selectonline")["0"].value;
    $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
    switch (e.target.innerText)
    {
        case "昨日": 
          if (onlinetype=="zxsc"||onlinetype=="cll"){  startdatetimedefalute();}//修改时间
            break;
        case "本周":
            if (onlinetype == "zxsc" || onlinetype == "cll") { getWeek(); }//修改时间
           
            break;
        case "当月":
            if (onlinetype == "zxsc" || onlinetype == "cll") { getMonth(); }//修改时间
            break;
        default:
            break;
    }

})





$(document).ready(function () {

    //显示饼图
function createchar(data) {
        $('#echartbox1').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: null
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.0f}%</b>'
            },
            plotOptions: {
                pie: {
                    size: 100,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        // 通过 format 或 formatter 来格式化数据标签显示
                        //format: '值: {point.y} 占比 {point.percentage} %',
                        formatter: function () {
                            //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                            return '<span style="color: ' + this.point.color + '"> 值：' + this.y + '，占比' + parseInt(this.percentage) + '%</span>';
                        }
                    },
                    showInLegend: true  // 显示在图例中
                }
            },
            series: [{
                type: 'pie',
                name: '',
                data:data
                            // { name: '连续在线时长', y: 1, color: '#39579A' },
                            /// { name: '连续离线时长', y: 1, color: '#F55949' },
            }]
        });
 }

    $.ajax({
        type: "POST",
        url: "../Handle/Orgchart/GetEntitys.ashx",
        data: "",
        dataType: "json",
        success: function (data) {

            entitydata = data; //保存单位数据
            for (var i = 0; i < data.result.length; i++) {
              
                if (data.result[i].Depth == 2) {  //修改单位标题
                    $(".brigadtitle p").text((data.result[i].Name));
                    $("#brigadeselect").append("<option value='" + data.result[i].ID + "'>" + data.result[i].Name + "</option>");
                    continue;
                }
               

            }
           

        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

    $.ajax({
        type: "POST",
        url: "../Handle/Orgchart/GetContacts.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            contactsdata = data;
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

    function arr(name,y){
        this.name=name;
        this.y = y;
    }

    $("#cz-bianji").on("click", function () {
        var data =
            {
            sbmc: $("#selectdevices").val(),
            onlinetype : $("#selectonline").val(),
            begintime :$(".start_form_datetime").val(),
            endtime: $(".end_form_datetime").val(),
            endabletime : ($(".end_form_datetime").attr("disabled") == "disabled"),
            ssdd : $("#brigadeselect").val(),
            sszd : $("#squadronselect").val(),
            lxren: $("#contactselect").val()
            }
        $.ajax({
            type: "POST",
            url: "../Handle/Workanalysis.ashx",
            data: data,
            dataType: "json",
            success: function (data) {
                $('#echartbox1').empty();
                var chardata=[];    
                    if (data.result == "0") return;
                    for (var i = 0; i < data.result.length; i++) {
                        chardata.push(new arr(data.result[i].name,parseInt(data.result[i].y)));
                    }     
                    createchar(chardata);

               
            },
            error: function (msg) {
                console.debug("错误:ajax");
            }
        });
       

    })


       

});

