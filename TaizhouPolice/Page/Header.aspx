<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Header.aspx.cs" Inherits="TaizhouPolice.Page.Header" %>
<link href="../CSS/head.css" rel="stylesheet" />
<link href="../CSS/mianLayot.css" rel="stylesheet" />
    <div class="nav">
        <div class="nav-title">
            <p style="margin-left:20px;">五小件管理平台</p>
        </div>
        <div class="nav-menu">
            <ul>
                <li class="isActivePath"><a href="default.html">首页</a></li>
                <li ><a href="Orgstructure.html">设备查看</a></li>
                <li ><a id="one-menu" href="index.html"> 实时状况 </a></li>
                <li ><a href="alarmManagement.html" style="display:none;">告警管理</a></li>
            
                <li ><a href="dataManagement.html">数据统计</a></li>
                <li><a href="stateAnalysis.html">报表分析</a></li>
                <li class="">
                    <a id="two-menu">系统设置<i class="glyphicon glyphicon-triangle-bottom"></i></a>
                    <div class="systemSettings-menu" style="z-index: 5;" id="two_systemSettings-menu">
                        <ul>
                            <li  ><a href="userManagement.html">用户管理</a></li>
                            <li ><a href="qxSetting.html">权限管理</a></li>
                            <li ><a href="deviceManagement.html">设备管理</a></li>
                            <li ><a href="entityManagement.html">单位管理</a></li>
                        </ul>
                    </div>
                </li>
                <li class="userInfor">
                    <a href="../Login.html">
                        <img src="../img/user1.png">
                        <span runat="server" id="user"></span>
                        <span>|</span>
                        <span>退出系统</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
