var entitydata;
var table;

function createDataTable() {

    table = $('#search-result-table')
        .on('xhr.dt', function (e, settings, json, xhr) {
            var height = ($(window).height());
            if (height < 800) {
                var tableH = height - 400;
                $("#search-result-table_wrapper").css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'height': tableH });

                $(".table-responsive").css({ 'overflow-y': 'hidden', 'overflow-x': 'hidden', 'height': 300 });
            }
        })
        .DataTable({
            ajax: {
                url: "../Handle/GetManageEntitys.ashx",
                type: "POST",
                data: function () {
                    return data = { search: $("#searchinput").val(), ssdd: $("#brigadeselect").val() }
                }

            },
            Paginate: true,
            pageLength: 10,
            serverSide: false,   //服务器处理
            responsive: true,
            paging: true,
            autoWidth: true,
            "order": [[3, 'asc']],
            columns: [
                { "data": null, "orderable": false, "visible": false },
                { "data": "id", "visible": false },

                { "data": "Name", "visible": true },
                { "data": "ParentID" },
                { "data": "JGDM" },   //   { "data": "c_name", "width": "80px" },
                { "data": "Sort" },
                { "data": "FullName", "visible": false },
                { "data": "UserCount" },
                { "data": null, "orderable": false }
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
                        targets: 3,
                        render: function (a, b, c, d) {
                            var parentid = "";
                            for (var i = 0; i < entitydata.result.length; i++) {
                                if (entitydata.result[i].ID == c.ParentID) {
                                    return entitydata.result[i].Name;

                                }
                            }



                            return "";
                        }
                    },
                     {
                         targets: 8,
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

function initselect() {

    $.ajax({
        type: "POST",
        url: "../Handle/Orgchart/GetEntitys.ashx",
        data: "",
        dataType: "json",
        success: function (data) {

            entitydata = data; //保存单位数据
            $("#brigadeselect").empty().append('<option value="all" selected>全部</option>')
            $("#addszBrigade").empty().append('<option value="1" >台州交警局</option>')

            for (var i = 0; i < data.result.length; i++) {

                if (data.result[i].Depth == 2) {  //修改单位标题
                    // $(".brigadtitle p").text((data.result[i].Name));
                    $("#brigadeselect").append("<option value='" + data.result[i].ID + "'>" + data.result[i].Name + "</option>");
                    $("#addszBrigade").append("<option value='" + data.result[i].ID + "'>" + data.result[i].Name + "</option>");


                }


            }

            if (!table) {
                createDataTable();
            } else {

                $('#search-result-table').DataTable().ajax.reload();
            }

        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
}

$(function () {
    initselect();
   

    $(".input-group-btn .btn-default,#cz-bianji").on("click", function () {


        if (!table) {
            createDataTable();
        } else {

            $('#search-result-table').DataTable().ajax.reload();
        }

    });

    $("#addUserModle .btn-default").on("click", function () {

        var _Name = $("#tjuserName").val(); //单位名称
        var _ParentID = $("#addszBrigade").val(); //上级单位ID

        var _FullName = $("#tjqc").val(); //单位全称
        var _type = $("#addUserModle h4").text();
        var _JGDM = $("#tjjgdm").val(); //机构代码
        var _Sort = $("#tjsort").val(); //排序

  

        if (_Name == "") {
            createUserAlarm($("#tjuserName"), "单位不能为空");
            return;
        }
     

        $.ajax({
            type: "post",
            url: "../Handle/AddEntity.ashx",
            data: { 'Name': _Name, 'ParentID': _ParentID, 'FullName': _FullName, 'JGDM': _JGDM, 'Sort': _Sort, 'addoredit': _type, 'tjid': $("#tjid").val(), 'tjusercount': $("#tjusercount").val() },
            dataType: "json",
            success: function (sdata) {
                if (sdata.r == "0") {
                    $("#addUserModle").modal("hide");
                    initselect();

                }
                else {
                    createUserAlarm($("#tjuserName"), sdata.result);
                }


            },
            error: function (msg) {
                createUserAlarm($("#adddeviceNo"), msg);
            }
        });
    });


    $("#addUserModle .btn-primary").on("click", function () {
        $("#addUserModle").modal("hide");
    })

    $("#addUser").on("click", function () {
        $("#tjuserName").val('');
       $("#addszBrigade").val('1');
       $("#addUserModle h4").text('新增单位');
       $("#tjqc").val('');
       $("#tjjgdm").val('');
       $("#tjsort").val('');
       $("#tjusercount").val('0');
       $("#addUserModle").modal("show");
    });


    $('#search-result-table tbody').on('click', 'a#addedit', function () {
        var data = $('#search-result-table').DataTable().row($(this).parents('tr')).data();
    
        $("#addUserModle h4").text("修改单位");

        $("#tjuserName").val(data.Name);
        $("#addszBrigade").val(data.ParentID);
        $("#tjqc").val(data.FullName);
        $("#tjjgdm").val(data.JGDM);
        $("#tjsort").val(data.Sort);
        $("#tjid").val(data.id);
        $("#tjusercount").val(data.UserCount);
        $("#addUserModle").modal("show");

    });

    $('#search-result-table tbody').on('click', 'a#adddel', function () {
        var data = $('#search-result-table').DataTable().row($(this).parents('tr')).data();
        $("#deletUserModle .modal-body").html("");
        $("#deletUserModle h4").text("是否删除该单位:" + data["Name"]);
        $('#deletUserModle input').val(data["id"]);
        $("#deletUserModle").modal("show");
    });


    $('#deletUserModle .btn-default').on('click', function () {

        $.ajax({
            type: "post",
            url: "../Handle/AddEntity.ashx",
            data: { 'ID': $('#deletUserModle input').val(), 'addoredit': '删除单位' },
            dataType: "json",
            success: function (sdata) {
                if (sdata.r == "0") {
                    $("#deletUserModle").modal("hide");
                    table.ajax.reload();

                }
                else {
                    $("#deletUserModle .modal-body").html('<label id="VerificationCode-error" class="error"  style="display: inline-block;">' + sdata.result + '</label>');
                }



            },
            error: function (msg) {

            }
        });

    });

    if (!$.cookie("username")) {
        window.location.href = "../Login.html";
    }

})


//报警 ele:document txt:报警内容
function createUserAlarm($ele, txt) {
    var $doc = $ele;
    $doc.parent().parent().find("#VerificationCode-error").remove();
    $doc.parent().parent().find(".input_danger").removeClass("input_danger");
    var _arlarmHtml = '<label id="VerificationCode-error" class="error"  style="display: inline-block;">' + txt + '</label>';
    $doc.addClass("input_danger");
    $doc.after(_arlarmHtml);
}