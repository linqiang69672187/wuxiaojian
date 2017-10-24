var entitydata;
var alarmGate;
var table;
$(function () {
  
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
                startdatetimedefalute(); //修改时间
                break;
            case "本周":
                getWeek(); //修改时间

                break;
            case "当月":
                getMonth(); //修改时间
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


    createDataTable();

});



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
    var date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

    //今天是这周的第几天  
    var today = date.getDay();

    //上周日距离今天的天数（负数表示）  
    var stepSunDay = -today + 1;

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
    switch (nowMonth) {
        case 0, 1, 2:
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



    $(".setArlarm button").on("click", function () {

       $("#setAlarmInforModle").modal('toggle');

    });




    $("#deviceName").change(function (e) {
        $("#setAlarmInforModle .modal-dialog .modal-content .modal-body .modal-title select").val(e.target.value);

    });

    $("#deviceNameset").change(function (e) {
        clearInsertAlarm(alarmGate);
    });

    function clearInsertAlarm(data) {
        $("#setAlarmInforModle tbody").empty();
        var type = $("#deviceNameset").val();
        var unit;
        for (var i = 0; i < data.result.length; i++) {

            if (data.result[i].DevType == type) {  //修改单位标题
                switch (data.result[i].TypeName) {
                    case "在线时长":
                        unit = "小时";
                        break;
                    case "处理量":
                        unit = "条";
                        break;
                    default:
                        unit = "小时";
                        break;
                }
                $("#setAlarmInforModle tbody").append("<tr><td width='100px;'><input value='" + data.result[i].ID + "' style='display:none;' /><label style='margin:0;'>" + data.result[i].TypeName + "</label></td><td style='text-align:left'><select class='form-control selectOp1'><option class='lt' value='lt'>&lt;</option></select><input type='text' class='form-control hourOp1' style='width:75px;' value='" + data.result[i].CommonAlarmGate + "'><span>" + unit + "</span></td><td>@</td><td><label></label><span></span><input type='text' class='form-control dayOp1' value='" + data.result[i].UrgencyAlarmGate + "'> <span>" + unit + "</span></td></tr>");

                // $("#setAlarmInforModle tbody").append(" <tr><td><label>" + data.result[i].TypeName + "</label><select class='form-control selectOp1'><option class='lt' value='lt'>&lt;</option></select>一般告警：<input type='text' class='form-control hourOp1' value='" + data.result[i].CommonAlarmGate + "'><span>" + unit + "</span><select class='form-control selectOp1'></select>紧急告警：<input type='text' class='form-control hourOp1' value='" + data.result[i].UrgencyAlarmGate + "'><span>" + unit + "</span></td></tr>");

            }
        }
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
                    $("#brigadeselect").append("<option value='" + data.result[i].ID + "'>" + data.result[i].Name + "</option>");
              

                }
            }
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });


function loadAlarmGage(inserAlarm){
  $.ajax({
        type: "POST",
        url: "../Handle/GetAlarmGate.ashx",
        data: "",
        dataType: "json",
        success: function (data) {

            alarmGate = data; //门限数据
            if (inserAlarm) {
                clearInsertAlarm(data);
            }
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
}
loadAlarmGage(true);


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

//setAlarmInforModle
    function isPositiveNum(s) {//是否为正整数  
        var re = /^[0-9]*[1-9][0-9]*$/;
        return re.test(s)
    }

    $("#setAlarmInforModle .btn-default").on("click", function () {

        var typename;
        var valone;
        var valtwo;
        var isPass = true;
        $("#setAlarmInforModle .table tbody tr input").each(function () {

            if ($(this).val() == "") {
                 createUserAlarm($(this), "");
                $(this).val('');
                $(this).attr('placeholder', '为空');
                isPass = false;
                return;
            }
           
            var value = $(this).val();
            if (!isPositiveNum(value)) {
                $(this).val('');
                createUserAlarm($(this), "");
                $(this).attr('placeholder', '整数');
               
                isPass = false;
                return;
            }

        });

        if (!isPass) { return;} //验证不通过


        $("#setAlarmInforModle .table tbody tr").each(function () {

            ID = $(this).find('input:eq(0)').val();
            valone = $(this).find('input:eq(1)').val();
            valtwo = $(this).find('input:eq(2)').val();


            $.ajax({
                type: "POST",
                url: "../Handle/EditAlarmGate.ashx",
                data: {"ID":ID,"CommonAlarmGate":valone,"UrgencyAlarmGate":valtwo},
                dataType: "json",
                success: function (data) {
                    loadAlarmGage(false);
                },
                error: function (msg) {
                    console.debug("错误:ajax");
                }
            });
        });

        $("#setAlarmInforModle").modal("hide");

  
        

       
    });

   


function createDataTable() {

    table = $('#search-result-table')
        .on('xhr.dt', function (e, settings, json, xhr) {
        $(".search-result-flooterleft span").text(json.data.length + "台");

            // Note no return - manipulate the data directly in the JSON object.
        switch ($("#deviceName").val()) {
            case "1":   //车载视频
                table.column(4).visible(true);
     
                break;
            case "4":    //警务通
          
                table.column(4).visible(false);
                break;
        }
    })
        .DataTable({
        ajax: {
            url: "../Handle/GetAlarm.ashx",
            type: "POST",
            data: function () {
                return data = {
                    search: $(".seach-box input").val(),
                    type: $("#deviceName").val(),
                    ssdd: $("#brigadeselect").val(),
                    sszd: $("#squadronselect").val(),
                    begintime: $(".start_form_datetime").val(),
                    endtime: $(".end_form_datetime").val(),
                    alramtype: $("#alarmType").val(),
                    alarmState: $("#alarmState").val()
                }
            }

        },
        Paginate: true,
        pageLength: 8,
        serverSide: false,   //服务器处理
        responsive: true,
        paging: true,
        autoWidth: true,
        "order": [[2, 'asc']],
        columns: [
            { "data": null, "orderable": false },
           { "data": "Id", visible: false },
            { "data": "dtypename", visible: true },
            { "data": "DevId" },
            { "data": "PlateNumber" },  
            { "data": "dName" },
            { "data": "zName" },
            { "data": "Contacts" },
            { "data": "Tel" },
            { "data": "AlarmState" },
            { "data": "aTypeName" },
            { "data": "AlarmDay"  }
        ],
        columnDefs: [
                {
                    targets: 0,
                    render: function (a, b, c, d) { var html = "<input type='checkbox' name='checkList' value=''>"; return html; }
                },
                {
                    targets: 9,
                    render: function (a, b, c, d) { var html = (c.AlarmState=="1")?"告警":"正常"; return html; }
                }



        ],
        buttons: [{
            extend: "excel",
            text: "导 出",
            filename: $(".start_form_datetime").val() + "-" + $(".end_form_datetime").val() + $("#deviceName").find("option:selected").text() + "告警报表",
            exportOptions: {
                columns: function (idx, data, node) {
                    var visible = table.column(idx).visible();
                    switch (node.outerText) {
                        case "":
                        case "ID":
                            visible = false;
                            break;

                    }
                    return visible;
                }


            }


        }
        ]
            ,
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



//报警 ele:document txt:报警内容
function createUserAlarm($ele, txt) {
    var $doc = $ele;
    $doc.parent().parent().find("#VerificationCode-error").remove();
    $doc.parent().parent().find(".input_danger").removeClass("input_danger");
   // var _arlarmHtml = '<label id="VerificationCode-error" class="error"  style="display: inline-block;">' + txt + '</label>';
    $doc.addClass("input_danger");
  //  $doc.after(_arlarmHtml);
}

$("#cz-bianji,.input-group-btn>.btn-default").on("click", function () {


    if (!table) {
        createDataTable();
    } else {

        $('#search-result-table').DataTable().ajax.reload(function () { });

    }

})