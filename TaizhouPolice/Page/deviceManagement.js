var table;
var errtable;
var entitydata;
var filename;
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
                    $("#addszBrigade").append("<option value='" + data.result[i].ID + "'>" + data.result[i].Name + "</option>");
                    $("#editszBrigade").append("<option value='" + data.result[i].ID + "'>" + data.result[i].Name + "</option>");
                   
                }
            }
            createDataTable();
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
    //添加修改更换大队选择
        $("#addszBrigade").on("change", function (e) {
        //所属中队逻辑
            $("#addszSquadron").empty();
            $("#addszSquadron").append("<option value='all'>请选择</option>");
        $("#addszSquadron").removeAttr("disabled");
        if (e.target.value == "all") {
            $("#addszSquadron").attr("disabled", "disabled");
            return;
        }
        for (var i = 0; i < entitydata.result.length; i++) {
            if (entitydata.result[i].ParentID == e.target.value) {
                $("#addszSquadron").append("<option value='" + entitydata.result[i].ID + "'>" + entitydata.result[i].Name + "</option>");

            }
        }
    });
        $("#cz-bianji,.input-group-btn>button").on("click", function () {


        if (!table) {
            createDataTable();
        } else {

            $('#search-result-table').DataTable().ajax.reload(function () {});

        }



    });


    function createDataTable() {

        table = $('#search-result-table').on( 'draw.dt', function () {
            // console.log( 'Redraw occurred at: '+new Date().getTime() );
        }) 
        .on('xhr.dt', function (e, settings, json, xhr) {
      
            $(".search-result-flooterleft span").text(json.data.length+"台");
             
            // Note no return - manipulate the data directly in the JSON object.
            switch ($("#deviceNameselect").val()) {
                case "1":   //车载视频
                    table.column(1).visible(true);
                    table.column(2).visible(true);
                    table.column(7).visible(true);        
                    table.column(8).visible(false);
                    table.column(9).visible(false);
                    table.column(10).visible(false);
                    table.column(11).visible(false);
                    table.column(12).visible(true);
                    $('#search-result-table tr:eq(0) th:eq(3)').text("所属大队");
                    $('#search-result-table tr:eq(0) th:eq(4)').text("所属中队");

                    break;
                case "4":    //警务通
                    table.column(1).visible(false);
                    table.column(2).visible(false);
                    table.column(7).visible(false);
                    table.column(8).visible(true);
                    table.column(9).visible(true);
                    table.column(10).visible(true);
                    table.column(11).visible(false);
                    table.column(12).visible(true);
                    $('#search-result-table tr:eq(0) th:eq(1)').text("所属部门");
                    $('#search-result-table tr:eq(0) th:eq(2)').text("所属单位");
                    break;
                case "2":    //对讲机
                case "3":    //拦截仪
                case "5":    //执法记录仪
                    table.column(1).visible(false);
                    table.column(2).visible(false);
                    table.column(7).visible(false);
                    table.column(8).visible(true);
                    table.column(9).visible(false);
                    table.column(10).visible(false);
                    table.column(11).visible(true);
                    table.column(12).visible(true);
                    $('#search-result-table tr:eq(0) th:eq(1)').text("所属部门");
                    $('#search-result-table tr:eq(0) th:eq(2)').text("机构名称");
                   // $('#search-result-table tr:eq(0) th:eq(6)').text("呼号");
                    break;
            }
        
            var height = ($(window).height());
            if (height < 800) {
                var tableH = height -400;
                $("#search-result-table_wrapper").css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'height': tableH });

                $(".table-responsive").css({ 'overflow-y': 'hidden', 'overflow-x': 'hidden', 'height': 300 });
            }
        })
            .DataTable({
            ajax: {
                url: "../Handle/GetDevicesToManage.ashx",
                type: "POST",
                data: function () {
                    return data = { search: $("#searchinput").val(), type: $("#deviceNameselect").val(), ssdd: $("#brigadeselect").val(), sszd: $("#squadronselect").val() }
                }

            },
            Paginate: true,
            pageLength: 8,
            serverSide: false,   //服务器处理
            responsive: true,
            paging: true,
            autoWidth: true,
            "order": [[0, 'asc']],
            columns: [
                { "data": null,"width":"20px"},
                { "data": "设备编号" },
                { "data": "车辆号码" },   //   { "data": "c_name", "width": "80px" },
                { "data": "所属单位" },
                { "data": "所属部门" },
                { "data": "联系人" },
                { "data": "联系电话" },
                { "data": "车辆类型", visible: false },
                { "data": "警号" },
                { "data": "身份证号"},
                { "data": "SIMID" },
                { "data": "IdentityPosition", visible: true },
                { "data": null, "orderable": false },
                { "data": "IMEI", visible: false }
    
            ],
            columnDefs: [
                    {
                        targets: 0,
                        render: function (a, b, c, d) {
                            var startIndex = d.settings._iDisplayStart;
                            return startIndex + d.row + 1;
                        }
                    },
                     {
                         targets: 12,
                         render: function (a, b, c, d) { var html = "<a  class=\'btn btn-sm btn-primary txzs-btn\' id='addedit' >修改</a><a  class=\'btn btn-sm btn-primary txzs-btn\' style='margin-left:10px' id='adddel' >删除</a>"; return html; }
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
          

            dom: "" + "t" + "<'row' p>",

            initComplete: function () {
                //  $("#mytool").append('<button id="datainit" type="button" class="btn btn-primary btn-sm">增加基础数据</button>&nbsp');
                // $("#datainit").on("click", initData);
            }

        });



    }

    if (!$.cookie("username")) {
        window.location.href = "../Login.html";
    }

});
//报警 ele:document txt:报警内容
function createUserAlarm($ele, txt) {
    var $doc = $ele;
    $doc.parent().parent().find("#VerificationCode-error").remove();
    $doc.parent().parent().find(".input_danger").removeClass("input_danger");
    var _arlarmHtml = '<label id="VerificationCode-error" class="error"  style="display: inline-block;">' + txt + '</label>';
    $doc.addClass("input_danger");
    $doc.after(_arlarmHtml);
}

$("#addbtn").on("click", function () {

    var _deviceNo = $("#adddeviceNo").val();
    var _ssdd = $("#addszBrigade").val();
    var _sszd = $("#addszSquadron").val();
    var _addcontacts = $("#addcontacts").val();
    var _type = $("#addDeviceModle h4").text(); //新增设备or修改设备
   
 
    if (_deviceNo == "") {
        createUserAlarm($("#adddeviceNo"), "此ID不能为空");
        return;
    }

    if (_ssdd == "all") {
        createUserAlarm($("#addszBrigade"), "请选择所属大队");
        return;

    }
    if (_sszd == "all") {
        createUserAlarm($("#addszSquadron"), "请选择所属中队");
        return;

    }
    if (_addcontacts == "") {
        createUserAlarm($("#addcontacts"), "联系人不能为空");
        return;

    }
    $.ajax({
        type: "post",
        url: "../Handle/AddDevice.ashx",
        data: {
            'deviceNo': _deviceNo,
            'sszd': _sszd,
            'contacts': _addcontacts,
            'Car': $("#addszCar").val(),
            'telephone': $("#addtelephone").val(),
            'adddeviceType': $("#adddeviceType").val(),
            'addszCartype': $("#addszCartype").val(),
            'addoredit': _type,
            'IdentityNum': $("#addIdentityNum").val(),
            'SIMID': $("#addSIMID").val(),
            'IMEI': $("#addIMEI").val(),
            'IdentityPosition': $("#addIdentityPosition").val()
        },
        dataType: "json",
        success: function (sdata) {
            if(sdata.r=="0")
            {
                $("#addDeviceModle").modal("hide");
                table.ajax.reload();
               
            }
            else
            {
                createUserAlarm($("#adddeviceNo"), sdata.result);
            }


        },
        error: function (msg) {
            createUserAlarm($("#adddeviceNo"), msg);
        }
    });
});

$("#addcancel").on("click", function () {
    $("#addDeviceModle").modal("hide");
})
$('#addDevicebtn').on('click', function () {
    $("#addDeviceModle").find("#VerificationCode-error").remove();
    $("#addDeviceModle").find(".input_danger").removeClass("input_danger");
    $("#addDeviceModle h4").text("新增设备");
    $("#adddeviceNo").val("");
    $("#addcontacts").val("");
    $("#addtelephone").val("");
    $("#addszCar").val("");
    $("#addszCartype").val("");
    $("#addszBrigade").val("all");
    $("#addszSquadron").val("all");
    $("#addszSquadron").attr("disabled", "disabled");
    $("#adddeviceNo").removeAttr("disabled");
    $("#adddeviceType").removeAttr("disabled"); //
    $("#addSIMID").val("");
    $("#addIMEI").val("");
    $("#addIdentityPosition").val("");
    $("#addIdentityNum").val("");

    var deviceNameselect = $("#deviceNameselect").val();
    $("#adddeviceType").val(deviceNameselect);

    deviceselectchange(deviceNameselect);
    $("#addDeviceModle").modal("show");
})
$('#search-result-table tbody').on('click', 'a#adddel', function () {
    var data = $('#search-result-table').DataTable().row($(this).parents('tr')).data();
    $("#deletDeviceModle h4").text("是否删除该设备:" + data["设备编号"]);
    $('#deletDeviceModle input').val(data["设备编号"]);
    $("#deletDeviceModle").modal("show");
});

$('#deletDeviceModle .btn-default').on('click', function () {

    $.ajax({
        type: "post",
        url: "../Handle/AddDevice.ashx",
        data: { 'deviceNo': $('#deletDeviceModle input').val(), 'addoredit': '删除设备' },
        dataType: "json",
        success: function (sdata) {
            if (sdata.r == "0") {
                $("#deletDeviceModle").modal("hide");
                table.ajax.reload();

            }
            


        },
        error: function (msg) {
           
        }
    });

});



$('#search-result-table tbody').on('click', 'a#addedit', function () {
    var data = $('#search-result-table').DataTable().row($(this).parents('tr')).data();
    var devtype = data["DevType"];
    $("#addDeviceModle h4").text("修改设备");

    $("#adddeviceNo").attr("disabled", "disabled").val(data["设备编号"]);
    $("#addcontacts").val(data["联系人"]);
    $("#addtelephone").val(data["联系电话"]);
    $("#addszCar").val(data["车辆号码"]);
    $("#addIdentityNum").val(data["身份证号"]);
    $("#addszCartype").val(data["车辆类型"]);
    $("#adddeviceType").val(devtype).attr("disabled", "disabled");
    deviceselectchange(devtype);
    $("#addIdentityPosition").val(data["IdentityPosition"]);
    $("#addIMEI").val(data["IMEI"]);
    $("#addSIMID").val(data["SIMID"]);
    // $("#addszBrigade option[text='" + data["所属单位"] + "']").attr("selected", true);
    var entity;
    for (var i = 0; i < entitydata.result.length; i++) {
        if (entitydata.result[i].ID == data["EntityId"]) {
            entity = entitydata.result[i];
            i = entitydata.result.length;
        }
    }
    $('#addszBrigade').val(entity.ParentID); //选中大队

    $("#addszSquadron").empty();
    $("#addszSquadron").append("<option value='all'>请选择</option>");
    for (var i = 0; i < entitydata.result.length; i++) {
        if (entitydata.result[i].ParentID == $('#addszBrigade').val()) {
            entity = entitydata.result[i];
            $("#addszSquadron").append("<option value='" + entitydata.result[i].ID + "'>" + entitydata.result[i].Name + "</option>");

        }
    }

    $('#addszSquadron').val(data["EntityId"]);
 


    $("#addszSquadron").removeAttr("disabled");


    $("#addDeviceModle").modal("show");

});

$("#adddeviceType").on("change", function (e) {
    deviceselectchange(e.target.value)

})


function deviceselectchange(devtype) {
    switch (devtype) {
        case "1":
            $(".form-content .form-group").each(function (index,e) {
                switch (index) {
                    case 0:
                        $(this).find("label").text("编号:");
                        $(this).find("input").attr("placeholder", "请输入编号");
                        break;
                    case 1:
                        $(this).hide();
                        break;
                    case 9:
                        $(this).hide();
                        break;
                    case 7:
                        $(this).find("label").text("车牌号码:");
                        $(this).find("input").attr("placeholder", "请输入车牌号码");
                        break;
                    case 8:
                        $(this).show();
                        break;
                    case 10:
                        $(this).hide();
                        break;
                    case 11:
                        $(this).hide();
                        break;
                }
            })
            break;
        case "2":
            $(".form-content .form-group").each(function (index, e) {
                switch (index) {
                    case 0:
                        $(this).find("label").text("编号:");
                        $(this).find("input").attr("placeholder", "请输入编号");
                        break;
                    case 1:
                        $(this).show();
                        $(this).find("label").text("呼号:");
                        $(this).find("input").attr("placeholder", "请输入呼号");
                        break;
                    
                    case 7:
                        $(this).find("label").text("警号:");
                        $(this).find("input").attr("placeholder", "请输入警号");
                        break;
                    case 8:
                        $(this).hide();
                        break;
                    case 9:
                        $(this).hide();
                        break;
                    case 10:
                        $(this).hide();
                        break;
                    case 11:
                        $(this).show();
                        break;
                }
            })
            break;
        case "4":
            $(".form-content .form-group").each(function (index, e) {
                switch (index) {
                    case 0:
                        $(this).find("label").text("PDAID:");
                        $(this).find("input").attr("placeholder", "请输入PDAID");
                        break;
                    case 1:
                        $(this).show();
                        $(this).find("label").text("SIMID:");
                        $(this).find("input").attr("placeholder", "请输入SIMID");
                        break;

                    case 7:
                        $(this).find("label").text("警号:");
                        $(this).find("input").attr("placeholder", "请输入警号");
                        break;
                    case 8:
                        $(this).hide();
                        break;
                    case 9:
                        $(this).show();
                        break;
                    case 10:
                        $(this).show();
                        break;
                    case 11:
                        $(this).show();
                        break;
                }


               
            })
            break;

        case "3":  //拦截仪
        case "5":  //执法记录仪
            $(".form-content .form-group").each(function (index, e) {
                switch (index) {
                    case 0:
                        $(this).find("label").text("编号:");
                        $(this).find("input").attr("placeholder", "请输入编号");
                        break;
                    case 1:
                        $(this).hide();
                        break;

                    case 7:
                        $(this).find("label").text("警号:");
                        $(this).find("input").attr("placeholder", "请输入警号");
                        break;
                    case 8:
                        $(this).hide();
                        break;
                    case 9:
                        $(this).hide();
                        break;
                    case 10:
                        $(this).hide();
                        break;
                    case 11:
                        $(this).show();
                        break;
                }
            })
            break;



        default:
            break;

    }


  //  $(".modal-dialog").css("top", $(document.body).height() - $(".modal-dialog").height() + "px");

}

/**
$('#addDeviceModle').on('shown.bs.modal', function () {
    $(".modal-dialog").css("top", $(document.body).height() - $(".modal-dialog").height() + "px");

})
**/
$(".setArlarm #setgj").on("click", function () {

    $("#setAlarmInforModle").modal('toggle');

});




$("#deviceNameselect").change(function (e) {
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
                case "文件大小":
                    unit = "GB";
                    break;
                default:
                    unit = "小时";
                    break;
            }
            $("#setAlarmInforModle tbody").append("<tr><td width='100px;'><input value='" + data.result[i].ID + "' style='display:none;' /><label style='margin:0;'>" + data.result[i].TypeName + "</label></td><td style='text-align:left'><select class='form-control selectOp1'><option class='lt' value='lt'>&lt;</option></select><input type='text' class='form-control hourOp1' style='width:75px;' value='" + data.result[i].CommonAlarmGate + "'><span>" + unit + "</span></td></tr>");

            // $("#setAlarmInforModle tbody").append(" <tr><td><label>" + data.result[i].TypeName + "</label><select class='form-control selectOp1'><option class='lt' value='lt'>&lt;</option></select>一般告警：<input type='text' class='form-control hourOp1' value='" + data.result[i].CommonAlarmGate + "'><span>" + unit + "</span><select class='form-control selectOp1'></select>紧急告警：<input type='text' class='form-control hourOp1' value='" + data.result[i].UrgencyAlarmGate + "'><span>" + unit + "</span></td></tr>");

        }
    }
}
function loadAlarmGage(inserAlarm) {
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

    if (!isPass) { return; } //验证不通过


    $("#setAlarmInforModle .table tbody tr").each(function () {

        ID = $(this).find('input:eq(0)').val();
        valone = $(this).find('input:eq(1)').val();
        valtwo = 99;


        $.ajax({
            type: "POST",
            url: "../Handle/EditAlarmGate.ashx",
            data: { "ID": ID, "CommonAlarmGate": valone, "UrgencyAlarmGate": valtwo },
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
});
$(function () {
    $('#upload').Huploadify({
        auto: true,
        fileTypeExts: '*.xlsx;*.xls',
        multi: false,
        formData: { key: 123456, key2: 'vvvv' },
        fileSizeLimit: 9999,
        showUploadedPercent: true,//是否实时显示上传的百分比，如20%
        showUploadedSize: false,
        removeTimeout: 9999999,
        uploader: '../Handle/UploadHandler.ashx',
        onUploadStart: function () {
            //alert('开始上传');
            $("#drtext span").html("<a href='../Handle/Upload/%e6%95%b0%e6%8d%ae%e5%af%bc%e5%85%a5%e6%a8%a1%e7%89%88.xls'>下载EXCEL导入模板</a>");
        },
        onInit: function () {
            //alert('初始化');
            $("#drtext span").html("<a href='../Handle/Upload/%e6%95%b0%e6%8d%ae%e5%af%bc%e5%85%a5%e6%a8%a1%e7%89%88.xls'>下载EXCEL导入模板</a>");
        },
        onUploadSuccess: function (file, data) {
            filename = data;
                        if (!errtable) {
                            setTimeout(function(){ createErrDataTable()},1000);
                        } else {

                            setTimeout(function () { $('#err-result-table').DataTable().ajax.reload(function () { }) }, 1000);

                        }

        },
        onDelete: function (file) {
            console.log('删除的文件：' + file);
            console.log(file);
        }
    });
});

function createErrDataTable() {

    errtable = $('#err-result-table').on('draw.dt', function () {
        // console.log( 'Redraw occurred at: '+new Date().getTime() );
    })
    .on('xhr.dt', function (e, settings, json, xhr) {
        $("#errModal").modal("show");
        if (json.title == "error") {
            $("#errEXCEL").show();
        }
        else {
            $("#errEXCEL").hide();
        }
     var height = ($(window).height());
        if (height < 800) {
            var tableH = height - 350;
           // $("#search-result-table_wrapper").css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'height': tableH });

            $("#txbox").css({ 'overflow-y': 'hidden', 'overflow-x': 'hidden', 'height': 350 });
        }
        $('#search-result-table').DataTable().ajax.reload(function () { });
    })
        .DataTable({
            ajax: {
                url: "../Handle/GetExcel.ashx",
                type: "POST",
                data: function () {
                    return data = { filename: filename };
                }

            },
            Paginate: true,
        
            serverSide: false,   //服务器处理
            responsive: true,
            paging: false,
            autoWidth: true,
            "ordering": false,
            columns: [    
                { "data": "xuhao" },   //   { "data": "c_name", "width": "80px" },
                { "data": "Description" }
         

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


            dom: "" + "t" + "<'row' p>",

            initComplete: function () {
                //  $("#mytool").append('<button id="datainit" type="button" class="btn btn-primary btn-sm">增加基础数据</button>&nbsp');
                // $("#datainit").on("click", initData);
            }

        });



}


