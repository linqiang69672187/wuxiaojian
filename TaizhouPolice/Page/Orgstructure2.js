$(function () {
    var entitydata;
    var contactsdata;
    ////下拉列表选择设备类型
    //$(".sbdropdown p span").on("click", function (e) {
    //    if ($(".dropdownmenu").is(":visible")) {
    //        $(".dropdownmenu").slideUp();
    //    } else {
    //        $(".dropdownmenu").slideDown();
    //    }
    //    $(".squadronbox").css({ "display": "none" });
    //    $(".contactsbox").css({ "display": "none" });

    //    $(".brigadeul li.active").removeClass("active");
    //    $(".squadronul li.active").removeClass("active");
    //    $(".contactsul li.active").removeClass("active");

    //});

    ////选择设备类型
    //$(".dropdownul li span").on("click", function (e) {
    
    //    $doc = $(e.target);
    //    $doc.parent().addClass("active").siblings().removeClass("active");
    //    $(".dropdownmenu").slideUp();
    //    $(".sbdropdown p span").text($doc.text());

    //});



    function createbrigadeulevent(){
        //点击大队显示中队
        $(" .brigadeul li").on("click", function (e) {
            var $doc;
            if (e.target.localName == "span") { $doc = $(e.target).parent(); }
            else { $doc=$(e.target) }

            $(".squadronbox").css({ "display": "block" });
            $(".contactsbox").css({ "display": "none" });
            $doc.addClass("active").siblings().removeClass("active");
            $(".squadronul li.active").removeClass("active");
            $(".contactsul li.active").removeClass("active");
            createZDspan($doc.attr("parentID"));
            loaddevices($doc.attr("parentID"), "../Handle/Orgchart/GetDevicecountByparentID.ashx");//加载右侧列表数据
            $(".selected-name").text($doc.text());
            var PicUrl = $doc.attr("PicUrl");
            PicUrl = (PicUrl == "") ? "../img/taizhoulogo.jpg" : PicUrl;
            $('.selected-avatar').attr('src', PicUrl);  //替换右侧图片

        });
    }
    //加载右侧列表数据
    function loaddevices(id,url) {
        $.ajax({
            type: "POST",
            url: url,
            data: { "ID": id },
            dataType: "json",
            success: function (data) {
                createrihtbar(data)
            },
            error: function (msg) {
                console.debug("错误:ajax" + url);
            }
        });

    }

    //创建右侧列表数据
    function createrihtbar(data) {
        $(" .cell-device-count").text('0');
        var div = ['czspdiv', 'djjdiv', 'ljydiv', 'jwtdiv', 'zfjlydiv'];
        for (var i = 0; i < div.length; i++) {
         
            for (var h = 0; h<data.result.length; h++) {
                if (i + 1 == parseInt(data.result[h].DevType))
                {
                    $("#" + div[i] + " .cell-device-count").text(data.result[h].sum);
                    break;
                  
                }
            }

        }


    }



    //根据大队单位ID创建中队列表
    function createZDspan(parentID) {
        $(".squadronul li").unbind();
        $(".squadronul").empty();
        for (var i = 0; i < entitydata.result.length; i++) {
            if (entitydata.result[i].ParentID == parentID) {
                $(".squadronul").append(" <li EntityID='" + entitydata.result[i].ID + "' parentID=\"" + entitydata.result[i].ID + "\"> <span    PicUrl=\"" + entitydata.result[i].PicUrl + "\" parentID=\"" + entitydata.result[i].ID + "\" >" + entitydata.result[i].Name + "</span></li>");
            }
        }
        createcontactsulevent();

    }



    function createcontactsulevent() {
        //点击中队显示警员
        $(".squadronul li").on("click", function (e) {
            var $doc;
            if (e.target.localName == "span") { $doc = $(e.target).parent(); }
            else { $doc = $(e.target) }

            $(".contactsbox").css({ "display": "block" });
            $doc.addClass("active").siblings().removeClass("active");
            $(".contactsul li.active").removeClass("active");
        
            createlxr($doc.attr("parentID"));
            loaddevices($doc.attr("parentID"), "../Handle/Orgchart/GetDevicecountByparentID.ashx");//加载右侧列表数据
            $(".selected-name").text($doc.text());
            var PicUrl = $doc.attr("PicUrl");
            PicUrl = (PicUrl == "") ? "../img/taizhoulogo.jpg" : PicUrl;
            $('.selected-avatar').attr('src', PicUrl);  //替换右侧图片
        });
    }


    function createlxr(parentID,search) {
        $(".contactsul li").unbind();
        $(".contactsul").empty();
        for (var i = 0; i < contactsdata.length; i++) {
            if (contactsdata[i].EntityID == parentID || contactsdata[i].Contacts.indexOf(search)>=0) {
                var value = parseInt(contactsdata[i].normal) / parseInt(contactsdata[i].sum) * 100;
                var css = 'progress-bar progress-bar-success';
                if (value < 30) {css = 'progress-bar progress-bar-danger';}
                $(".contactsul").append("<li EntityID='" + contactsdata[i].EntityID + "' ><span>" + contactsdata[i].Contacts + "</span><div class='progress'><div class='" + css + "' role='progressbar' aria-valuenow='" + value + "' aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div></li>");
             

            }
        }
        $(".progress-bar").each(function () {
            $(this).width($(this).attr("aria-valuenow") + "%");
        })
          
        createcontactevent(); //创建监听警员列表事件
    }


    function createcontactevent(){
    //点击警员更新列表
    $(" .contactsul li").on("click", function (e) {
        var $doc = $(this);
        //if ($doc.localName == "span") { $doc = $doc.parent(); }

        $('#contacts-name').val();
        var se = $(".contactsul li[class='active']").attr("EntityID");
        if (se != $doc.attr("EntityID")) {
            if (se != undefined) {
                selectparentsid($doc.attr("EntityID")); //如果选择的联系人的所属单位不一样，将重载左边大队，中队的列表
            }
        }
        $doc.addClass("active").siblings().removeClass("active");
        loaddevices($doc.text(), "../Handle/Orgchart/GetDevicecountByUser.ashx");//加载右侧列表数据
        $(".selected-name").text($doc.text());
        $('.selected-avatar').attr('src', "../img/policeman-avatar.png");  //替换右侧图片


    });
    }


    //搜索回车键
    $("#contacts-name").on("keydown", function(e) {
        var doc = e.target;
        var _content = doc.value;
 

        if (event.keyCode == 13) {
            if (_content == "") {
                return;
            } 
            searchcontacts(_content);
        }
    })

    //搜索键单击
    $(".search-btn").on("click", function (e) {
        var _content = $("#contacts-name").val();
 
            if (_content == "") {
                return;
            } 
            searchcontacts(_content);
          
    })

    //查找警员重建警员列表
    function searchcontacts(contact) {
        createlxr("0", contact);
        $(".contactsbox,.squadronbox").css({ "display": "block" });
        $(".selected-name").text(contact);
        $(".contactsul li:first").addClass("active");
        selectparentsid($(".contactsul li:first").attr("EntityID"));
        var txt = $(".contactsul li:first").text();
        loaddevices(txt, "../Handle/Orgchart/GetDevicecountByUser.ashx");//加载右侧列表数据
        $(".selected-name").text(txt);
        $('.selected-avatar').attr('src', "../img/policeman-avatar.png");  //替换右侧图片
    }
    
    function selectparentsid(ChilidEntityId) {
        var data = entitydata;
        var ddID = 0; //联系人所属大队单位ID
        for (var i = 0; i < entitydata.result.length; i++) {
            if (ChilidEntityId == entitydata.result[i].ID) {
                ddID = entitydata.result[i].ParentID;
                break;
            }

        }
        createZDspan(ddID);
        $(".squadronul li[EntityID='" + ChilidEntityId + "']").addClass("active").siblings().removeClass("active");
        $(".brigadeul li[EntityID='" + ddID + "']").addClass("active").siblings().removeClass("active");

    }


  


    $.ajax({
        type: "POST",
        url: "../Handle/Orgchart/GetEntitys.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
        

            for (var i = 0; i < data.result.length; i++) {
                entitydata = data; //保存单位数据
                if (data.result[i].Depth == 1) {  //修改单位标题
                    $(".brigadtitle p").text((data.result[i].Name));
                    continue;
                }
                if (data.result[i].Depth == 2) { 
                    $(".brigadeul").append(" <li EntityID='" + entitydata.result[i].ID + "'  parentID=\"" + data.result[i].ID + "\" > <span  PicUrl=\"" + entitydata.result[i].PicUrl + "\" parentID=\"" + data.result[i].ID + "\">" + data.result[i].Name + "</span></li>");
                    continue;
                }

            }
            createbrigadeulevent()//创建大队点击监听

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

 
   
    //监听设备列表数量文本变化czspdiv
    var div = ['czspdiv', 'djjdiv', 'ljydiv', 'jwtdiv', 'zfjlydiv'];
    for (var i = 0; i < div.length;i++){
        $("#" + div[i] + " .cell-device-count").bind('DOMNodeInserted', function (e) {
            var id = $(e.target).parent().parent()["0"].id;
            $("#" + id + " .bt1").removeClass("shishi");
            $("#" + id + " .bt2").removeClass("bianji");
            $("#" + id + " .bt3").removeClass("shuju");
            if ($(e.target).text() != "0") {
                $("#" + id + " .bt3").addClass("shuju");
            }
        var contactli = $(".contactsul li[class='active']");
        if ($(e.target).text() == "1" && contactli["0"].nodeName=="LI") {
            $("#" + id + " .bt1").addClass("shishi");
            $("#" + id + " .bt2").addClass("bianji");
        }
        
    });

    }
  
    


});
