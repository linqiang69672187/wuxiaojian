function createCode() {
    var code = "";
    var codeLength = 4; //验证码的长度
    var checkCode = document.getElementById("checkCode");
    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
    for (var i = 0; i < codeLength; i++) {
        var charNum = Math.floor(Math.random() * 52);
        code += codeChars[charNum];
    }
    if (checkCode) {
        checkCode.className = "code";
        checkCode.innerHTML = code;
    }
    return code;
}

$(function () {
    /*********添加登录窗口事件处理*********/
    createCode();//创建验证码
    $(".code").on("click", function () {
        //重置验证码
        createCode()
    });

    $("#loginBtn").on("click", function () {

        $(".loginForm").find("#VerificationCode-error").remove();

        var _userName = $("#userName").val();
        var _password = $("#userpassword").val();
       // var _checkcode = $("#checkCode").text().toUpperCase();
      //  var _checkcheckCode = $("#checkcheckCode").val().toUpperCase();

        if (_userName == "") {
            createUserAlarm($("#userName"), "用户名不能为空");
            createCode();
            return;
        }

        if (_password == "") {
            createUserAlarm($("#userpassword"), "密码不能为空");
            createCode();
            return;
        }

        //if (_checkcheckCode == "") {
        //    createUserAlarm($("#checkcheckCode"), "验证码不能为空");
        //    createCode();
        //    return;
        //}
        
        //if (_checkcheckCode != _checkcode) {
        //    createUserAlarm($("#checkcheckCode"), "验证码错误");
        //    createCode();
        //    return;
        //}
        $.ajax({
            type: "get",
            url: "Handle/Checklogin.ashx",
            data: { 'username': _userName, 'pwd': _password },
            dataType: "json",
            success: function (data) {
                if (data.r == "0") {
                    
                    window.location.href = "Page/default.html";
                }
                else {
                    createUserAlarm($("#userpassword"), data.result);
                 //   createCode();
                }
            },
            error: function (msg) {
                alert(msg);
            }
        });


    });

    $("input").on("keyup", function () {
        $(".loginForm").find("#VerificationCode-error").remove();
    });

    var height = ($(window).height());
    if (height < 800) {
        var tableH = height - 405;
        $(".loginbox").css({ 'margin-top': '-100px' });
        $(".bj1").css({ 'height': '155px' });
        $(".bj2").css({ 'height': '298px' });
    }


});

//报警 ele:document txt:报警内容
function createUserAlarm($ele, txt) {
    var $doc = $ele;
    $doc.empty();
    var _arlarmHtml = '<label id="VerificationCode-error" class="error"  style="display: inline-block;">' + txt + '</label>';
    $doc.addClass("input_danger");
    $doc.after(_arlarmHtml);
}