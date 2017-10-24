var selectEntityID=1;
var selectParentID = -1;
var selectDepth = 1;
var selectcontatcs = "";
var selectDevtype="1";
var table;
var entitydata;

$.ajax({
    type: "POST",
    url: "../Handle/Orgchart/GetEntitys.ashx",
    data: "",
    dataType: "json",
    success: function (data) {

        entitydata = data; //保存单位数据


    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});

    function createorg(datasource) {
    $('#chart-container').orgchart({
        'data': datasource,
        
        'nodeContent': '',
        'nodeId': 'Id',
        'verticalDepth': 3,
        'depth': 3,
        'parentNodeSymbol': 'fa-group',
        'createNode': function ($node, data) {
            
            $node.on('click', function () {
                  $('#contacts-name').val('');
         
                var _Id = [];
                var _txt = [];
                var _nodeId = data.ID;
                $('#xd_rightbar').css({ "display": "none" });
                $('#zd_rightbar').css({ "display": "block" });

                LoadDevices(data);
                $('#sjtj').tab('show');//显示到数据列表
               

            })
        }

    });
  
    $(".verticalNodes").addClass('hidden'); //隐藏垂直三级树
        //$('#chart-container').orgchart('hideSiblings',$(".verticalNodes"));
    $(".orgchart div:eq(0) .title").css('font-size', '15px'); //
    $(".orgchart div:eq(0)").css('width', '180px').addClass('focused'); //
    $(".nodes div:eq(0) .title").css('font-size', '13px'); //
    $(".nodes div:eq(0)").css('width', '150px'); //


    }

    function LoadDevices(sdata) {     
        //$('.selected-avatar').attr('src', '../img/timg.gif');  //加载进度条

        $.ajax({
            type: "POST",
            url: "../Handle/Orgchart/GetDevicesStatus.ashx",
            data: { "ID": sdata.ID, "img": sdata.PicUrl, "name": sdata.name },
            dataType: "json",
            success: function (data) {
                if (sdata.ID != undefined) {
                    selectEntityID = sdata.ID; //选中ID
                    selectParentID = sdata.ParentID;
                    selectDepth = sdata.Depth;
                    selectcontatcs = "";
                }
               // $("#chart-container div").remove();//删除进度条
                if (data.r == "0") {
                     // data.result.czsp[0];//车载视频正常数目
                    //  data.result.czsp[1];//车载视频小于2小时
                     // data.result.czsp[2];//车载视频小于4小时
                    //data.result.czsp[3];//车载视频故障
               
                    var div = ['czspdiv', 'djjdiv', 'ljydiv', 'jwtdiv', 'zfjlydiv']; //车载视频、对讲机、拦截仪、警务通、执法记录仪
                    for (var i = 0; i < div.length; i++)
                    {
                        chageflexgrow(div[i], data, i);
                    }
                    if (data.contacts.length > 0) {
                        createcontacts(data.contacts);
                    }
                  
                    $("[data-toggle='tooltip']").tooltip('fixTitle').tooltip();;
                }

            },
            error: function (msg) {
                console.debug("LoadDevices出错了！");
                $('.selected-name').text("加载失败，请重试");
            }
        });

        $('.selected-name').text(sdata.name);
        switch (sdata.Depth) {
            case "1":
                imgsrc = "../img/jingjingju.png";
                break;
            case "2":
                imgsrc = "../img/dadui.png";
                break;
            case "3":
                imgsrc = "../img/zdui.png";
                break;
        }
      //  imgsrc = (sdata.PicUrl == "") ? '../img/taizhoulogo.jpg' : sdata.PicUrl;
        $('.selected-avatar').attr('src', imgsrc);
    }


    function createcontacts(contacts) {
      
        $(".contactsul li").unbind();
        $(".contactsul").empty();
        $(".contactsul").append("<li class='active'>请选择警员</li>");
        for (var i = 0; i < contacts.length; i++) {
            $(".contactsul").append(" <li >" + contacts[i].Contacts + "</li>");
        }
        $(".contactsul li").on("click", function (e) {
            if (e.target.innerText == "请选择警员") { return;}
            var sdata = {};
            sdata.name = e.target.innerText;
            selectcontatcs = e.target.innerText;
            LoadDevices(sdata);
            $(".contactsul li").removeClass("active");
            $(e.target).addClass("active");

        })

    }




//搜索框查找警员
    function searchcontacts(contact) {
        $.ajax({
            type: "POST",
            url: "../Handle/Orgchart/SearchContacts.ashx",
            data: { "name": contact },
            dataType: "json",
            success: function (data) {
                $('#sblb').tab('show');//右侧tab显示到设备列表
                createcontacts(data.result);

            },
            error: function (msg) {
                console.debug("错误：" + msg);
            }

        })

    }









    function chageflexgrow(id, data,i)
    {
        var n = data.result[i][0] + data.result[i][1];
        $("#" + id + " div span").html(n);

        $("#" + id + " .floot-bar").attr("title", "正常:" + data.result[i][0] + "<br>" + "告警:" + data.result[i][1] +"<br>");
        if (n == 0) {
            $("#" + id + " .floot-zhbar").css("width", 0);
            $("#" + id + " .floot-xy2bar").css("width", 0);
            $("#" + id + " .floot-gzbar").css("width", 308);
            return;
        }
        $("#" + id + " .floot-gzbar").css("width", 0);
        $("#" + id + " .floot-zhbar").css("width", data.result[i][0]/n*308);
        $("#" + id + " .floot-xy2bar").css("width", data.result[i][1] / n * 308);
  


    }





    $(function () {

        $.ajax({
            type: "POST",
            url: "../Handle/Orgchart/CreateOrgchart.ashx",
            data: "",
            dataType: "json",
            success: function (data) {
                $("#chart-container div").remove();//删除进度条
                createorg(data);
                LoadDevices(data);//初始化选中台州
            },
            error: function (msg) {
                alert("错误:"+msg);
            }
        });

        $("#chart-container").height(($(window).height() - 160));


        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.innerText == "设备列表") {
                $('.contactsul').css({ "display": "block" });
                $('.entitylogod').css({ "display": "none" });
            }
            else {
                $('.entitylogod').css({ "display": "block" });
                $('.contactsul').css({ "display": "none" });
            }
            //  e.target.innerText // 当前活动的标签 // e.relatedTarget // 上一个选择的标签
            //   if(e.target.inner)

        })
        //初始化显示组织树的进度
        $("#chart-container").html("<div style='text-align:center;'><img src='../img/timg.gif' /></div>")

        //搜索回车键
        $("#contacts-name").on("keydown", function (e) {
            var doc = e.target;
            var _content = doc.value;
            if (event.keyCode == 13) {
                if (_content == "") {
                    return;
                } else {
                    searchcontacts(_content);
                }
            }
        })

        //搜索键单击
        $(".search-btn").on("click", function (e) {
            var _content = $("#contacts-name").val();
            if (_content == "") {
                return;
            } else {
                searchcontacts(_content);
            }
        })

        // var selectEntityID = 1;
        // var selectParentID = -1;
        // var selectDepth = 1;
        $("#czspdiv .progress,#jwtdiv .progress,#djjdiv .progress,#ljydiv .progress,#zfjlydiv .progress").on("click", function (e) {
            var textlabel;
            switch ($(e.target).parent().parent().attr('id')) {
                case "czspdiv":
                    selectDevtype = "1";
                    textlabel = "车载视频昨日详情";
                    break;
                case "jwtdiv":
                    selectDevtype = "4";
                    textlabel = "警务通昨日详情";
                    break;
                case "djjdiv":
                    selectDevtype = "2";
                    textlabel = "对讲机昨日详情";
                    break;
                case "zfjlydiv":
                    selectDevtype = "5";
                    textlabel = "执法记录仪昨日详情";
                    break;
                case "ljydiv":
                    selectDevtype = "3";
                    textlabel = "拦截仪昨日详情";
                default:
                    break;

            }
   
            if (!table) {
                createDataTable();
               // createDataTable(selectDevtype, selectEntityID, selectcontatcs, selectDepth);
            } else {
                $('#detail-result-table').DataTable().ajax.reload(function () {
                });
            }

            $("#myModal").modal("show");
            $("#myModaltxzsLabel").text(textlabel)
        })








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
  
    function createDataTable() {

        var columns = [   { "data": null },
                          { "data": null },
                          { "data": "EntityId" },
                          { "data": "AlarmDay" },
                          { "data": "PlateNumber" },
                          { "data": "Contacts" },
                          { "data": "在线时长" },
                          { "data": "警号" },
                          { "data": "IMEI" },
                          { "data": "电话号码" },
                          { "data": "状态" }
        ];

        $.fn.dataTable.ext.errMode = 'none';

        table = $('#detail-result-table')
            //.on('error.dt', function (e, settings, techNote, message) {
            //    console.log('An error has been reported by DataTables: ', message);
            //})
            .on('preXhr.dt', function (e, settings, data) {
                $('#txbox .progress').show();
            })
             .on('xhr.dt', function (e, settings, json, xhr) {
                 $('#txbox .progress').hide();
               
                 switch (selectDevtype) {
                     case "1":   //车载视频
                         table.column(3).visible(true);
                         table.column(6).visible(true);
                         table.column(7).visible(false);
                         table.column(8).visible(false);
                         table.column(9).visible(false);
                         break;
                     case "2":   //对讲机
                         table.column(3).visible(true);
                         table.column(6).visible(true);
                         table.column(7).visible(true);
                         table.column(8).visible(false);
                         table.column(9).visible(false);
                         break;
                     case "3":   //拦截仪
                         table.column(3).visible(true);
                         table.column(6).visible(true);
                         table.column(7).visible(false);
                         table.column(8).visible(false);
                         table.column(9).visible(false);
                         break;
                     case "5":   //执法记录仪
                             table.column(3).visible(true);
                             table.column(6).visible(true);
                             table.column(7).visible(false);
                             table.column(8).visible(false);
                             table.column(9).visible(false);
                             break;
                         case "4":    //警务通
                             table.column(3).visible(false);
                             table.column(6).visible(false);
                             table.column(7).visible(true);
                             table.column(8).visible(false);
                             table.column(9).visible(true);
                             break;
                     }
                 $('.search-result-flooterleft span').text(json.data.length+"台");

              
                 switch (selectDevtype) {
                     case "1":   //车载视频
                         $("#detail-result-table thead tr th:eq(4)").html("车牌号码");
                         break;
                     case "2":   //对讲机
                         $("#detail-result-table thead tr th:eq(4)").html("设备编号");
                         break;
                     case "3":   //拦截仪
                         $("#detail-result-table thead tr th:eq(4)").html("设备编号");
                         break;
                     case "5":   //执法记录仪
                         $("#detail-result-table thead tr th:eq(4)").html("设备编号");
                         break;
                     case "4":    //警务通
                         $("#detail-result-table thead tr th:eq(3)").html("设备编号");
                         break;
                 }
                 if ($('#detail-result-table_wrapper .buttons-excel').length > 0) {
                     $('#detail-result-table_wrapper .buttons-excel').removeAttr("aria-controls").attr("href", "../Handle/upload/sjtj/" + json.title);
                 }
                 else {
                     $('#detail-result-table_wrapper.btn-group').append("<a class='btn btn-default buttons-excel buttons-html5'  href='../Handle/upload/sjtj/" + json.title + "'><span>导 出</span></a>");
                 }

                 $('#detail-result-table thead th:eq(0)').css({ 'width': '30px' });
             })
    
            .DataTable({
                ajax: {
                    url: "../Handle/GetOrgstructureTable.ashx",
                    type: "POST",
                    data: function () {
                        return data = { devtype: selectDevtype, selectEntityID: selectEntityID, selectcontatcs: selectcontatcs, selectDepth: selectDepth }
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
                               
                                 var prarentID
                                 for (var i = 0; i < entitydata.result.length; i++) {
                                     if (entitydata.result[i].ID == c.EntityId) {
                                         prarentID= entitydata.result[i].ParentID;
                                         
                                     }
                                 }
                                 for (var i = 0; i < entitydata.result.length; i++) {
                                     if (entitydata.result[i].ID == prarentID) {
                                         return entitydata.result[i].Name;

                                     }
                                 }
                                 return "/";
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
                        targets: 3,
                        render: function (a, b, c, d) { var html = new Date(c.AlarmDay).Format("yyyy年MM月dd日"); return html; }
                    },
                    {
                        targets: 4,
                        render: function (a, b, c, d) {
                            switch (selectDevtype) {
                                case "1":   //车载视频                                       
                                    return c.PlateNumber;
                                    break;
                                case "2":   //对讲机 
                                case "3":    //拦截仪 
                                case "4":    //警务通  
                                case "5":   //执法记录仪   
                                    return c.DevId;
                                    break;
                            }

                        }
                    }
                      ,
                    {
                        targets: 6,
                        render: function (a, b, c, d) { var html = formatSeconds(c.在线时长); return html; }
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

                dom: "" + "t" + "<'row' p>B",

                initComplete: function () {
                    //  $("#mytool").append('<button id="datainit" type="button" class="btn btn-primary btn-sm">增加基础数据</button>&nbsp');
                    // $("#datainit").on("click", initData);
                }

            });
    }

    function formatSeconds(value) {

        var result = Math.floor((value / 60 / 60) * 100) / 100;

        return result;
    }
   
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
    