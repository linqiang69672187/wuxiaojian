
    //单位数据、联系人数据
    var entitydata;
    var selectdevid;
    $(".input-group-btn button").on("click", function () {
        loaddata();
        if ($(".carVideo-box").is(":hidden")) {
            $(".carVideo-box").slideDown(500);

        } 
        return;

    })

    $(".seach-box input,.seach-box").on("keydown", function () {
        if (event.keyCode == 13) {
            loaddata();
            if ($(".carVideo-box").is(":hidden")) {
                $(".carVideo-box").slideDown(500);

            }
        }
        return;

    })

    $(".carVideo-title i").on("click", function () {

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


    })




    $("#ckgi").on("click", function (e) {
        
   
        $(e.target).parent().addClass("active");
        $(e.target).parent().prev().removeClass("active");
    })


    $("#sswz").on("click", function (e) {


        $(e.target).parent().addClass("active");
        $(e.target).parent().next().removeClass("active");
    })


    $.ajax({
        type: "POST",
        url: "../Handle/Orgchart/GetEntitys.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.result.length; i++) {
                entitydata = data; //保存单位数据
                if (data.result[i].Depth == 2) {  //修改单位标题
                    $(".brigadtitle p").text((data.result[i].Name));
                    $("#brigadeselect1").append("<option value='" + data.result[i].ID + "'>" + data.result[i].Name + "</option>");
                    continue;
                }
            }
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

    //更换大队选择
    $("#brigadeselect1").on("change", function (e) {
        //所属中队逻辑
        $("#squadronselect1").empty();
        $("#squadronselect1").append("<option value='all'>全部</option>");
        $("#squadronselect1").removeAttr("disabled");
        if (e.target.value == "all") {
            $("#squadronselect1").attr("disabled", "disabled");
            return;
        }
        for (var i = 0; i < entitydata.result.length; i++) {
            if (entitydata.result[i].ParentID == e.target.value) {
                $("#squadronselect1").append("<option value='" + entitydata.result[i].ID + "'>" + entitydata.result[i].Name + "</option>");
            }
        }
    });

    $("#cz-bianji").on("click", function () {
        loaddata();
    })

    function loaddata() {
        var val = $("input[name='wuxiaojian']:checked").next().text();
   
        var type = 1;
        switch (val) {
            case "警务通":
                type = 4;
                break;
            case "车载视频":
                type = 1;
                break;
            case "对讲机":
                type = 2;
            default:
                break;

        }
        var data =
         {
             search: $(".seach-box input").val(),
             type: type,
             ssdd: $("#brigadeselect1").val(),
             sszd: $("#squadronselect1").val(),
             sortMode1: $("#sortMode1").val(),
             status: $("#sbstate1").val()

         }
        $.ajax({
            type: "POST",
            url: "../Handle/SszkStatus.ashx",
            data: data,
            dataType: "json",
            success: function (data) {
                point_overlay.setPosition([0, 0]);
                $(".zq1").hide();
                $(".table .localtd").removeClass("localtd"); //移出定位
                $(".table tbody").empty();
                $(".equipmentNumb").empty();
                $(".onlineTotal-time").empty();
                loadmarks();//加载地图五小件
                if (data.r == "0") {
                
                    createtable(data.result);
             

                }
            },
            error: function (msg) {
                console.debug("错误:ajax");
            }
        });

    }


    function localFeatureInfo() {
        var newfeature ;
        var val = $("input[name='wuxiaojian']:checked").next().text();
        var type = (val=="")?"车载视频":val;
        switch (type) {
            case "警务通":
                newfeature = vectorLayerjwt.getSource().getFeatureById(selectdevid)
                break;
            case "车载视频":
                newfeature = vectorLayer.getSource().getFeatureById(selectdevid)
                break;
            case "对讲机":
                newfeature = vectorLayerdjj.getSource().getFeatureById(selectdevid)
                break;
            default:
                return;
                break;
        }
     
        if (!newfeature) {
            setTimeout(localFeatureInfo, 2000);
            return;
        }
        var newcoordinates = newfeature.getGeometry().getCoordinates();
        var pixel = map.getPixelFromCoordinate(newcoordinates);
        var IsOnline = newfeature.get('IsOnline') == "0" ? "离线" : "在线";
        var Contacts = newfeature.get('Contacts');
        var Name = newfeature.get('Name');
        var Tel = newfeature.get('Tel');
        var devid = newfeature.get('DevId');
        var PlateNumber = newfeature.get('PlateNumber');
        var DevType = newfeature.get('DevType');
        var IMEI = newfeature.get('IMEI');
        var UserNum = newfeature.get('UserNum');
        var IdentityPosition = newfeature.get('IdentityPosition');
        showfeatureinfo(IsOnline, Contacts, Name, Tel, devid, PlateNumber, DevType, pixel, IMEI, UserNum,IdentityPosition);
    }

    function createtable(data) {
        var $doc = $(".table tbody");
        var total = data.length;
        var zx = 0;
        var sc = 0;
        var coumm1 = "";
        var coumm2 = "";
        var val = $("input[name='wuxiaojian']:checked").next().text();
        var type = (val=="")?"车载视频":val;

        $(".table thead tr").empty();
        switch (type) {
            case "警务通":
            case "对讲机":
                $(".table thead tr").append("<th style='width:113px;'>设备编号</th><th style='width:113px;'>联系人</th><th>在线时长</th><th></th>")
                $(".seach-box").find("input").attr("placeholder", "请输入设备或联系人");
                break;

            case "车载视频":
                $(".seach-box").find("input").attr("placeholder", "请输入设备或车辆或联系人");
                $(".table thead tr").append("<th style='width:113px;'>车辆号码</th><th style='width:113px;'>联系人</th><th>在线时长(小时)</th><th></th>")
                break;

            default:
                break;

        }
      
        for (var i = 0; i < data.length; ++i) {
            
            //var img = "../img/car7.png";
            //if (data[i].IsOnline == "0") { img = "../img/car6.png"; }
            //if (data[i].Cartype == "摩托车")
            //{
            //    img = (data[i].IsOnline == "0") ?  "../img/moto6.png" : "../img/moto7.png";
            //}
            switch (type)
            {
                case "警务通":
                case "对讲机":
                    coumm2 = data[i].Contacts;
               
                    coumm1 = data[i].PDAID;
                  

                    break;
                case "车载视频":
                    coumm1 = data[i].PlateNumber;
                    coumm2 = data[i].Contacts;
                    break;

                default:

                    break;
            }
            // <img src='" + img + "'>
            switch (data[i].IsOnline) {
                case "1":
                    $doc.append(" <tr title='设备编号：" + data[i].PDAID + "'><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + coumm1 + "</span></td><td style='text-align:center;width:113px;'><span>" + coumm2 + "</span></td><td style='text-align:center;'><span>" + formatSeconds(data[i].OnlineTime) + "</span></td><td><i class='fa fa-map-marker fa-2x fa-map-marker-color-online' aria-hidden='true'  bh='" + data[i].PDAID + "'></i></td></tr>");
                    sc += parseInt(data[i].OnlineTime);
                    zx += 1;
                    break;
                case "0":
                    $doc.append(" <tr title='设备编号：" + data[i].PDAID + "'><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + coumm1 + "</span></td><td style='text-align:center;width:113px;'><span>" + coumm2 + "</span></td><td style='text-align:center;'><span>" + formatSeconds(data[i].OnlineTime) + "</span></td><td><i class='fa fa-map-marker fa-2x fa-map-marker-color-unline'  aria-hidden='true'  bh='" + data[i].PDAID + "'></i></td></tr>");
                    sc += parseInt(data[i].OnlineTime);
                    break;
                default:
                $doc.append(" <tr title='设备编号：" + data[i].PDAID + "'><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + coumm1 + "</span></td><td style='text-align:center;width:113px;'><span>" + coumm2 + "</span></td><td style='text-align:center;'><span>未上报</span></td><td></td></tr>");
                    break;
            }
      
   
          

        }


        $(".equipmentNumb").append("<label>绑定设备数:<span>" + total + "</span></label><label>在线数:<span>" + zx + "</span></label><label>离线数:<span>" + (total-zx) + "</span></label>")
        $(".onlineTotal-time").append("<p>总在线时长:<span>" + formatSeconds(sc) + "</span></p>")

        $(".table").on("click", function (e) {
            var devid;
            if (e.target.nodeName == "I") { devid = $(e.target).attr("bh") }
            else{
                devid= $(e.target).children().attr("bh");
            }
            if (devid == "" || devid == undefined) { return; }
            $(".zq1").hide();
            $(".table .localtd").removeClass("localtd"); //移出定位
            selectdevid = devid;
            var feature = vectorLayer.getSource().getFeatureById(devid);
            if (feature) {
                var coordinates = feature.getGeometry().getCoordinates();
                point_overlay.setPosition(coordinates);
                var view = map.getView();
                view.animate({ zoom: view.getZoom() }, { center: coordinates }, function () {
                    localFeatureInfo();
                    setTimeout(function () { point_overlay.setPosition([0, 0]) }, 30000)
                });
               
                
             

                return;

            }
            $.ajax({
                type: "POST",
                url: "../Handle/GetcoordinateBydevid.ashx",
                data: { 'devid': devid },
                dataType: "json",
                success: function (data) {
                   
                    var view = map.getView();
                    view.animate({ zoom: view.getZoom() }, { center: ol.proj.transform([parseFloat(data.data[0].La - offset.x), parseFloat(data.data[0].Lo - offset.y)], 'EPSG:4326', 'EPSG:3857') }, function () {
                        point_overlay.setPosition(ol.proj.transform([parseFloat(data.data[0].La - offset.x), parseFloat(data.data[0].Lo - offset.y)], 'EPSG:4326', 'EPSG:3857'));

                        localFeatureInfo();
                        setTimeout(function () { point_overlay.setPosition([0, 0]) }, 30000)
                    });
                },
                error: function (msg) {
                    console.debug("错误:ajax");
                }
            });
        })

        $(".table tbody").on("mouseover", function (e) {
            $(".fa-map-marker-color-mouseover").removeClass("fa-map-marker-color-mouseover");
            $(e.target).parent().find("i").addClass("fa-map-marker-color-mouseover");
        });
        $(".table tbody").on("mouseout", function (e) {
            $(".fa-map-marker-color-mouseover").removeClass("fa-map-marker-color-mouseover");
        });
    }
  
   // $(".carVideo-title p").prepend(("input[name='wuxiaojian']:checked").next().text());

    $(".zq-title1 .close").on("click", function () {
        $(".zq1").hide();
        $(".table .localtd").removeClass("localtd"); //移出定位
    });


    loaddata();//初始化加载

    function layerchager(id) {
        loaddata();//初始化加载
        vectorLayer.setVisible(false);
        vectorLayerjwt.setVisible(false);
        var v = $("input[name='wuxiaojian']:checked").next().text();
        $(".carVideo-title p label").html('');
        $(".carVideo-title p label").text(v);

    }








function formatSeconds(value) {

    var result = Math.floor((value / 60 / 60) * 100) / 100;

    return result;
}

function bannertype(e){

    $.cookie("bannertype", e);
    window.location.href = "index.html";
}
if (!$.cookie("username")) {
    window.location.href = "../Login.html";
}