var entitydata;

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
              
                 
                }


            }


        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });


    $.ajax({
        type: "POST",
        url: "../Handle/GetRole.ashx",
        data: {search:""},
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.data.length; i++) {
                $("#tjqxgroup").append("<option value='" + data.data[i].ID + "'>" + data.data[i].RoleName + "</option>");

            }


        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });




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


    function createDataTable() {

        table = $('#search-result-table')
         .on('xhr.dt', function (e, settings, json, xhr) {
             var height = ($(window).height());
             if (height < 800) {
           
                 $(".table-responsive").css({'height': '300px' });

             }
         })
            .DataTable({
                ajax: {
                    url: "../Handle/GetUsers.ashx",
                    type: "POST",
                    data: function () {
                        return data = { search: $("#searchinput").val(), ssdd: $("#brigadeselect").val(), sszd: $("#squadronselect").val() }
                    }

                },
                Paginate: true,
                pageLength: 10,
                serverSide: false,   //服务器处理
                responsive: true,
                paging: true,
                autoWidth: true,
                "order": [[1, 'asc']],
                columns: [
                    { "data": null, "orderable": false },
                    { "data": "ID","visible":false },
                    { "data": "UserName" },
                    { "data": "parentname" },   //   { "data": "c_name", "width": "80px" },
                    { "data": "Name" },
                    { "data": "Tel" },
                    { "data": "RoleName" },
                    { "data": null, "orderable": false }
                ],
                columnDefs: [
                        {
                            targets: 0,
                            render: function (a, b, c, d) { var html = "<input type='checkbox' name='checkList' value=''>"; return html; }
                        },
                         {
                             targets: 7,
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

    createDataTable();


    $("#addUserModle .btn-default").on("click", function () {

        var _UserName = $("#tjuserName").val();
        var _EntityId = $("#addszSquadron").val();

        var _Tel = $("#tjtelephone").val();
        var _type = $("#addUserModle h4").text();
        var _PWD = $("#tjnewpassword").val();
        var _RoleId = $("#tjqxgroup").val();
        var _ssdd = $("#addszBrigade").val();

  

        if (_UserName == "") {
            createUserAlarm($("#tjuserName"), "用户不能为空");
            return;
        }
        /**
        if (_ssdd == "all") {
            createUserAlarm($("#addszBrigade"), "请选择所属大队");
            return;

        }
        if (_EntityId == "all") {
            createUserAlarm($("#addszSquadron"), "请选择所属中队");
            return;
        }
         **/
        if (_PWD == "") {
            createUserAlarm($("#tjnewpassword"), "密码不能为空");
            return;

        }

        if (_RoleId == "all") {
            createUserAlarm($("#tjqxgroup"), "请选择权限");
            return;

        }

        $.ajax({
            type: "post",
            url: "../Handle/AddUser.ashx",
            data: { 'UserName': _UserName, 'Password': _PWD, 'EntityId': _EntityId, 'Tel': _Tel, 'RoleId': _RoleId, 'addoredit': _type },
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


    $("#addUserModle .btn-primary").on("click", function () {
        $("#addUserModle").modal("hide");
    })

    $("#addUser").on("click", function () {
       $("#tjuserName").val('');
       $("#addszSquadron").val('all');
       $("#tjtelephone").val('');
       $("#addUserModle h4").text('新增用户');
       $("#tjnewpassword").val('');
       $("#tjqxgroup").val('all');
       $("#addszBrigade").val('all');
       $("#addUserModle").modal("show");
    });


    $('#search-result-table tbody').on('click', 'a#addedit', function () {
        var data = $('#search-result-table').DataTable().row($(this).parents('tr')).data();
    
        $("#addUserModle h4").text("修改用户");

        $("#tjuserName").val(data.UserName);
        $("#tjuserName").attr("disabled", "disabled");

        $("#tjtelephone").val(data.Tel);
        $("#tjnewpassword").val(data.Password);
        $("#tjqxgroup").val(data.RoleId);
 

       
        var entity;
        for (var i = 0; i < entitydata.result.length; i++) {
            if (entitydata.result[i].ID == data.EntityId) {
                entity = entitydata.result[i];
                i = entitydata.result.length;//退出循环
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
        $('#addszSquadron').val(data.EntityId);
        $("#addszSquadron").removeAttr("disabled");


        $("#addUserModle").modal("show");

    });

    $('#search-result-table tbody').on('click', 'a#adddel', function () {
        var data = $('#search-result-table').DataTable().row($(this).parents('tr')).data();
        $("#deletUserModle h4").text("是否删除该用户:" + data["UserName"]);
        $('#deletUserModle input').val(data["ID"]);
        $("#deletUserModle").modal("show");
    });


    $('#deletUserModle .btn-default').on('click', function () {

        $.ajax({
            type: "post",
            url: "../Handle/AddUser.ashx",
            data: { 'ID': $('#deletUserModle input').val(), 'addoredit': '删除用户' },
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