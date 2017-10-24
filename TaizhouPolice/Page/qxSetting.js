var table;
var entitydata;









$(function () {
    createDataTable();

    $("#contacts-name").on("keydown", function (e) {
        var doc = e.target;
        var _content = doc.value;
        if (event.keyCode == 13) {
            if (_content == "") {
                return;
            } else {
              
            }
        }
    })

    //搜索键单击
    $("#sear-btn").on("click", function (e) {
        var _content = $("#contacts-name").val();
        if (_content == "") {
            return;
        } else {
            
        }
    })
   

    $("#cz-bianji").on("click", function () {


        if (!table) {
            createDataTable();
        } else {

            $('#search-result-table').DataTable().ajax.reload(function () { });

        }



    });


    function createDataTable() {

        table = $('#search-result-table')
            .DataTable({
                ajax: {
                    url: "../Handle/GetRole.ashx",
                    type: "POST",
                    data: function () {
                        return data = { search: $("#contacts-name").val()}
                    }

                },
                Paginate: true,
                pageLength: 10,
                serverSide: false,   //服务器处理
                responsive: true,
                paging: true,
                autoWidth: true,
                "order": [[2, 'asc']],
                columns: [
                    { "data": null, "orderable": false, "width": "30px" },
                    { "data": "ID", "orderable": false,"visible":false},
                    { "data": "RoleName" },
                    { "data": "Power" },   //   { "data": "c_name", "width": "80px" },
                    { "data": "bz" },
                    { "data": "CreateDate" },
                    { "data": null, "orderable": false }
                ],
                columnDefs: [
                        {
                            targets: 0,
                            render: function (a, b, c, d) { var html = "<input type='checkbox' name='checkList' value=''>"; return html; }
                        },
                         {
                             targets:6,
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

    var _qxname = $("#tjqxName").val();

    var _power = "";

    var _bz = $("#tjremarks").val();
    var _type = $("#addUserModle h4").text();
    var _id = $("#sendid").val();
    if (_qxname == "") {
        createUserAlarm($("#tjqxName"), "权限名不能为空");
        return;
    }


    $('#addUserModle input:checkbox').each(function () {
        if (this.checked==true) {
            _power += "[" + $(this).val() + "]";
        }

    });
    $.ajax({
        type: "post",
        url: "../Handle/AddEditRole.ashx",
        data: { 'qxname': _qxname, 'power': _power, 'bz': _bz, 'type': _type ,'id':_id},
        dataType: "json",
        success: function (sdata) {
            if (sdata.r == "0") {
                $("#addUserModle").modal("hide");
                table.ajax.reload();

            }
            else {
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


$('#addUserModle').on('hidden.bs.modal', function () {
    $("#addUserModle").find("#VerificationCode-error").remove();
    $("#addUserModle").find(".input_danger").removeClass("input_danger");
    $("#addUserModle h4").text("新增权限");
    $("#tjqxName").val("");
    $("#tjremarks").val("");
    $("#addUserModle input[type='checkbox']").each(function () {
        this.checked = false;
    });
   

});



$('#search-result-table tbody').on('click', 'a#adddel', function () {
    var data = $('#search-result-table').DataTable().row($(this).parents('tr')).data();
    $("#deletUserModle h4").text("是否删除改权限:" + data["RoleName"]);
    $('#deletUserModle input').val(data["ID"]);
    $("#deletUserModle").modal("show");
});



$('#deletUserModle .btn-default').on('click', function () {

    $.ajax({
        type: "post",
        url: "../Handle/AddEditRole.ashx",
        data: { 'ID': $('#deletUserModle input').val(), 'type': '删除权限' },
        dataType: "json",
        success: function (sdata) {
            if (sdata.r == "0") {
                $("#deletUserModle").modal("hide");
                table.ajax.reload();

            }



        },
        error: function (msg) {

        }
    });

});



$('#search-result-table tbody').on('click', 'a#addedit', function () {
    var data = $('#search-result-table').DataTable().row($(this).parents('tr')).data();

    $("#addUserModle h4").text("修改权限");

    $("#tjqxName").val(data["RoleName"]);
    $("#tjremarks").val(data["bz"]);
    $("#sendid").val(data["ID"]);
    var power = data["Power"];


    $("#addUserModle input[type='checkbox']").each(function () {

     if (power.indexOf($(this).val()) >= 0){
         this.checked = true;
     };
    });
  
   

    


    $("#addUserModle").modal("show");

});