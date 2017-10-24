var entitydata;

function checkBtn(txt) {
    var isAllsame = true;
    $(".btngroupactive").each(function () {
        if ($(this).text() != txt) {
            isAllsame = false;
            return;
        }
    });
    if (!isAllsame) { return;}
    $(".selectdevice").removeClass("selectdevice");
    switch (txt) {
        case "车载视频":
          
            $(".devicebg:eq(0)").addClass("selectdevice")

            break;
        case "警务通":
            $(".devicebg:eq(1)").addClass("selectdevice")
            break;
        case "拦截仪":
            $(".devicebg:eq(2)").addClass("selectdevice")
            break;
        case "对讲机":
            $(".devicebg:eq(3)").addClass("selectdevice")
            break;
        case "执法记录仪":
            $(".devicebg:eq(4)").addClass("selectdevice")
            break;
        default:
            break;

    }


}


$(function () {
    loadEntitys();
    $("#bt_sbfb button").on("click", function (e) {
        $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
        CreateChar('sbfb', $(".btngroupactive:eq(0)").text());
        checkBtn($(".btngroupactive:eq(0)").text());
    });

    $("#bt_sbzx button").on("click", function (e) {
        $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
        CreateChar('sbzx', $(".btngroupactive:eq(1)").text());
        checkBtn($(".btngroupactive:eq(1)").text());
       
    });
    $("#bt_yjzb button").on("click", function (e) {
        $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
        CreateChar('yjzb', $(".btngroupactive:eq(2)").text());
        checkBtn($(".btngroupactive:eq(2)").text());
    });
    $("#bt_yjqs button").on("click", function (e) {
        $(e.target).addClass("btngroupactive").siblings().removeClass("btngroupactive");
        CreateChar('yjqs', $(".btngroupactive:eq(3)").text());
        checkBtn($(".btngroupactive:eq(3)").text());
    });

    $(".devicebg").on("click", function (e) {
        var typename;
        switch(e.target.localName)
        {
            case "div":
                if (e.target.innerText == "")
                {
                    $(e.target).parent().addClass("selectdevice").siblings().removeClass("selectdevice");
                }
                else
                {
                    $(e.target).addClass("selectdevice").siblings().removeClass("selectdevice");
                }
                
           
                break;
            case "img":
                $(e.target).parent().parent().addClass("selectdevice").siblings().removeClass("selectdevice");
                break;
            case "p":
                $(e.target).parent().addClass("selectdevice").siblings().removeClass("selectdevice");
                break;
            default:
                break;
        }

        typename = $(".selectdevice").text();
    
        switch (typename) {
            case "车载视频":
                $(".btngroupactive").removeClass("btngroupactive");

                $("#bt_sbfb button:eq(0)").addClass("btngroupactive");
                $("#bt_sbzx button:eq(0)").addClass("btngroupactive");
                $("#bt_yjzb button:eq(0)").addClass("btngroupactive");
                $("#bt_yjqs button:eq(0)").addClass("btngroupactive");

                CreateChar('sbzx', $(".btngroupactive:eq(1)").text());
                break;
            case "警务通":
                $(".btngroupactive").removeClass("btngroupactive");

                $("#bt_sbfb button:eq(1)").addClass("btngroupactive");
                $("#bt_sbzx button:eq(1)").addClass("btngroupactive");
                $("#bt_yjzb button:eq(1)").addClass("btngroupactive");
                $("#bt_yjqs button:eq(1)").addClass("btngroupactive");

               
                CreateChar('sbzx', $(".btngroupactive:eq(1)").text());
                break;
            case "拦截仪":

                $(".btngroupactive").removeClass("btngroupactive");
                $("#bt_sbfb button:eq(2)").addClass("btngroupactive");
                $("#bt_sbzx button:eq(2)").addClass("btngroupactive");
                $("#bt_yjzb button:eq(2)").addClass("btngroupactive");
                $("#bt_yjqs button:eq(2)").addClass("btngroupactive");

                CreateChar('sbzx', $(".btngroupactive:eq(1)").text());
                break;
            case "对讲机":
                $(".btngroupactive").removeClass("btngroupactive");

                $("#bt_sbfb button:eq(3)").addClass("btngroupactive");
                $("#bt_sbzx button:eq(3)").addClass("btngroupactive");
                $("#bt_yjzb button:eq(3)").addClass("btngroupactive");
                $("#bt_yjqs button:eq(3)").addClass("btngroupactive");

              
                CreateChar('sbzx', $(".btngroupactive:eq(1)").text());
                break;
            case "执法记录仪":
                $("#bt_sbfb  .btngroupactive").removeClass("btngroupactive");
                $("#bt_yjzb  .btngroupactive").removeClass("btngroupactive");
                $("#bt_yjqs  .btngroupactive").removeClass("btngroupactive");

                $("#bt_sbfb button:eq(4)").addClass("btngroupactive");
                // $("#bt_sbzx button:eq(4)").addClass("btngroupactive");
                $("#bt_yjzb button:eq(4)").addClass("btngroupactive");
                $("#bt_yjqs button:eq(4)").addClass("btngroupactive");
                break;
            default:

                break;


        }



        CreateChar('sbfb', $(".btngroupactive:eq(0)").text());
       // CreateChar('sbzx', $(".btngroupactive:eq(1)").text());
        CreateChar('yjzb', $(".btngroupactive:eq(2)").text());
        CreateChar('yjqs', $(".btngroupactive:eq(3)").text());

    });

    if (!$.cookie("username")) {
        window.location.href = "../Login.html";
    }
});




function loadEntitys() {

    $.ajax({
        type: "POST",
        url: "../Handle/Orgchart/GetEntitys.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            entitydata = data; //保存单位数据
            CreateChar('sbfb', $(".btngroupactive:eq(0)").text());
            CreateChar('sbzx', $(".btngroupactive:eq(1)").text());
            CreateChar('yjzb', $(".btngroupactive:eq(2)").text());
            CreateChar('yjqs', $(".btngroupactive:eq(3)").text());

          
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
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

function getnowtime() {
    var nowtime = new Date();
    var year = nowtime.getFullYear();
    var month = padleft0(nowtime.getMonth() + 1);
    var day = padleft0(nowtime.getDate());
    var hour = padleft0(nowtime.getHours());
    var minute = padleft0(nowtime.getMinutes());
    var second = padleft0(nowtime.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second ;
}
function padleft0(obj) {
    return obj.toString().replace(/^[0-9]{1}$/, "0" + obj);
}

function CreateChar(id,bttype) {
    var legend = { layout: 'horizontal',backgroundColor: '#FFFFFF', floating: false,align: 'center', verticalAlign: 'top',}
    var chart;
    var title;
    var tooltip;
    var plotOptions;
    var series=[];
    var func;
    var xAxis;
    var yAxis;
    var json = {};
    var labels;
   /**
    var myDate = new Date();
    myDate.setDate(myDate.getDay() == 0 ? myDate.getDate() - 6 : myDate.getDate() - (myDate.getDay() - 1)); //周一 
    var predate = new Date();
    predate.setDate(predate.getDay() == 0 ? predate.getDate() : predate.getDate() - (predate.getDay() - 1) + 6); //上周日
    myDate.setDate(myDate.getDate() - 7);
    predate.setDate(predate.getDate() - 7);

    **/

    var myDate = new Date();
    var predate = new Date();
    predate.setDate(predate.getDate() - 6);



    $.ajax({
        type: "POST",
        url: "../Handle/Orgchart/default_chart.ashx",
        data: { type: bttype, chart: id, sdate: predate.toLocaleDateString(), edate: myDate.toLocaleDateString() },
        dataType: "json",
        success: function (data) {
            switch (id) {
                case "sbfb":
                    legend.y = -30;
                    chart = { plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, spacing: [60, 0, 40, 0] };
                   var count=0;
                    tooltip = { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' };
                    plotOptions = {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.y}'
                            },
                            showInLegend: true,
                            point: {
                                events: {

                                    click: function (e) { // 同样的可以在点击事件里处理
                                        chart.setTitle({
                                            text: '<b>' + e.point.y + '</b> <br/>' + e.point.name
                                        });
                                    }
                                }
                            },
                        }
                    };
                    func = function (c) {
                        // 环形图圆心
                        var centerY = c.series[0].center[1],
                            titleHeight = parseInt(c.title.styles.fontSize);
                        c.setTitle({
                            y: centerY + titleHeight / 2
                        });
                        chart = c;
                    };
                    var dataarray = [];
                    for (var h = 0; h< data.result.length; h++) {
                       
                      
                        for (var i = 0; i < entitydata.result.length; i++) {
                            if (entitydata.result[i].ID == data.result[h].ParentID) {
                                switch( h)
                                {
                                    case 1:
                                        dataarray.push({ name: entitydata.result[i].Name, y: parseInt(data.result[h].总数), color: '#ea2e49' });
                                        count += parseInt(data.result[h].总数)
                                        break;
                                    case 2:
                                        dataarray.push({ name: entitydata.result[i].Name, y: parseInt(data.result[h].总数), color: '#fec107' });
                                        count += parseInt(data.result[h].总数)
                                        break;
                                    case 3:
                                        dataarray.push({ name: entitydata.result[i].Name, y: parseInt(data.result[h].总数), color: '#2296f3' });
                                        count += parseInt(data.result[h].总数)
                                        break;
                                    default:
                                        dataarray.push({ name: entitydata.result[i].Name, y: parseInt(data.result[h].总数) });
                                        count += parseInt(data.result[h].总数)
                                        break;

                                }

                        

                                i = 999;
                            }
                        }
                        if (data.result[h].ParentID == null) {
                            dataarray.push({ name: '未绑定', y: data.result[h].总数, color: '#999999' })
                            continue;
                        }
                    }


                    series = [{
                        type: 'pie',
                        innerSize: '80%',
                        name: '占比',
                        data: dataarray
                    }];

                    title = { floating: true, text:'<b>'+ count + '</b><br/>台州交警局' };
                    break;

                case "sbzx":

                    chart = { type: 'column' };
                  
                    yAxis =  { min: 0,itle: {text: '' }}
                  
                    var namearray = [];
                    var IDarray = [];
                    var zxdata = [];
                    var lxdata = [];
                    var entity 
                    for (var h = 0; h < data.result.length; h++) {

                        if (entity != data.result[h].ParentID) {
                            IDarray.push(data.result[h].ParentID);
                        }
                        entity = data.result[h].ParentID;
                    }

                    for (var h = 0; h < IDarray.length; h++) {
                        if (IDarray[h] == "") {
                            namearray.push("未绑定");
                            continue;
                        }
                        for (var i = 0; i < entitydata.result.length; i++) {
                            if (entitydata.result[i].ID == IDarray[h]) {
                                namearray.push(entitydata.result[i].Name);
                                i = 999;

                            }
                        }
                    };

                    var zxls = 0, lxls = 0;

                    $.each(IDarray, function (key, val) {
                        zxls = 0, lxls = 0;
                        for (var h = 0; h < data.result.length; h++) {
                            if (data.result[h].ParentID == IDarray[key]) {
                                if (data.result[h].IsOnline == "0") {
                                    lxls = parseInt(data.result[h].总数);
                                }
                                else {
                                    zxls = parseInt(data.result[h].总数);
                                }

                            }
                        
                        }
                        zxdata.push(zxls);
                        lxdata.push(lxls);

                    });

                 

                    var zxtatol=0;
                    var lxtatol = 0;
                    $.each(zxdata, function (key, val) {
                        //回调函数有两个参数,第一个是元素索引,第二个为当前值
                        zxtatol += val;
                    });
                    $.each(lxdata, function (key, val) {
                        //回调函数有两个参数,第一个是元素索引,第二个为当前值
                        lxtatol += val;
                    });

                    namearray.push("台州交警局");
                    lxdata.push(lxtatol);
                    zxdata.push(zxtatol);

                    yAxis = {
                        title: {
                            text: '数量'
                        }
                    };

                    xAxis = { categories: namearray };
                    series = [{
                        name: '在线',
                        data: zxdata,
                        color: '#68d44c'
                    }, {
                        name: '离线',
                        data: lxdata,
                        color: '#ff0000'
                    }];
                  
                    plotOptions={
                            column: {
                                dataLabels: {
                                    enabled: true
                                  //  inside:true
                                  
                                }
                            }
                    };

                
                    $("#reftime").text("统计时间：" + getnowtime());
                    break;

                case "yjzb":
                    title = {
                        text: ''
                    };
                    yAxis = {
                        title: {
                            text: '数量'
                        }
                    };
                    labels = {
                        items: [{
                            html: '',
                            style: {
                                left: '50px',
                                top: '18px',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                            }
                        }]
                    };

                    var namearray = [];
                    var IDarray = [];
                    var zcdata = [];//正常
                    var gjdata = [];//告警
                    var entity;
                    var zc=0;
                    var gj = 0;
                    for (var h = 0; h < data.result.length; h++) {

                        if (entity != data.result[h].ParentID) {
                            IDarray.push(data.result[h].ParentID);
                        }
                        //if (data.result[h].AlarmState == "1") {
                        //    gjdata.push(parseInt(data.result[h].总数))
                        //    gj += parseInt(data.result[h].总数);
                        //}
                        //else {
                        //    zcdata.push(parseInt(data.result[h].总数))
                        //    zc += parseInt(data.result[h].总数)
                        //}
                        entity = data.result[h].ParentID;
                    }

                    for (var h = 0; h < IDarray.length; h++) {
                        if (IDarray[h] == "") {
                            namearray.push("未绑定");
                            continue;
                        }
                        for (var i = 0; i < entitydata.result.length; i++) {
                            if (entitydata.result[i].ID == IDarray[h]) {
                                namearray.push(entitydata.result[i].Name);
                                i = 999;

                            }
                        }
                    }

                    var zcsl = 0, gjsl = 0;

                    $.each(IDarray, function (key, val) {
                        zcsl = 0, gjsl = 0;
                        for (var h = 0; h < data.result.length; h++) {
                            if (data.result[h].ParentID == IDarray[key]) {
                                if (data.result[h].AlarmState == "1") {
                                    gjsl = parseInt(data.result[h].总数);
                                }
                                else {
                                    zcsl = parseInt(data.result[h].总数);
                                }

                            }

                        }
                        gjdata.push(gjsl);
                        zcdata.push(zcsl);
                        gj += gjsl;
                        zc += zcsl;

                    });


                    namearray.push("台州交警局");
                    gjdata.push(gj);
                    zcdata.push(zc);


                    xAxis = {
                        categories: namearray
                    };
                    series = [ {
                        type: 'column',
                        name: '正常',
                        data: zcdata,
                        color: '#079e05'

                    }, {
                        type: 'column',
                        name: '告警',
                        data:gjdata,
                        color: '#f20011'
                    }
                    ];
                    plotOptions = {
                        column: {
                            dataLabels: {
                                enabled: true

                            }
                        }
                    };
                    
                    break;
                case "yjqs":
                    var entity;

                    var dates = [];
                    var ndate;
                  
                       cdata = [];
                       name = undefined;
                       type = 'spline';
                  
                    for (var h = 0; h < data.result.length; h++) {
                        if (entity != data.result[h].ParentID) {
                            if (name != "undefined") { series.push({ name: name, type: type, data: cdata }); }
                                  cdata = [];
                                  name = undefined;
                                  switch (data.result[h].ParentID) {
                                      case "":
                                          name = "未绑定";
                                          break;
                                      case "-1":
                                          name = "台州交警局直属";
                                          break;
                                       
                                      default:
                                          for (var i = 0; i < entitydata.result.length; i++) {
                                              if (entitydata.result[i].ID == data.result[h].ParentID) {
                                                  name = entitydata.result[i].Name;

                                                  i = 999;
                                              }
                                          }
                                          break;

                                  }
                        
                            cdata.push(Math.floor(parseInt(data.result[h].告警数) / parseInt(data.result[h].总数) * 100*100)/100)
                            entity = data.result[h].ParentID;
                        }
                        else
                        {
                            cdata.push(Math.floor(parseInt(data.result[h].告警数) / parseInt(data.result[h].总数) * 100*100)/100)
                        }
                        var oldTime = (new Date(data.result[h].AlarmDay)).getTime();
                        var curTime = new Date(oldTime).Format("M/d");

                        if (dates.indexOf(curTime) == -1) {
                          
                            dates.push(curTime);
                        }
                    }
                    series.push({ name: name, type: type, data: cdata }); //最后一个单位循环完成


                    xAxis = {
                        categories: dates
                    };
                    yAxis = {
                        title: {
                            text: '告警百分比'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    };

                    tooltip = {
                        valueSuffix: '%'
                    }
     
                    break;

                default:
                    break;

            }
            //json.legend = legend;
            if (chart != undefined) {
                json.chart = chart;
            }
            json.title = title;
            json.xAxis = xAxis;
            if (yAxis != undefined) {
                json.yAxis = yAxis;
            }
            json.legend = legend;
    
            if (tooltip != undefined) {
                json.tooltip = tooltip;
            }

            if (labels!=undefined){
                json.labels = labels;
            }
            if (plotOptions != undefined) {
                json.plotOptions = plotOptions;
            }
            json.series = series;
            if (func != undefined) {
                $('#' + id).highcharts(json, func);
            }
            else {
                $('#' + id).highcharts(json);
            } 
        }
            ,
        error: function (msg) {
                
        }
                 
       });

   


}