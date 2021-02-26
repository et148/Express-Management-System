<#import "../common/spring.ftl" as spring/>
<!DOCTYPE html>
<html>
<head><title>快递管理系统</title>
<#include "./login/css.ftl"/>
</head>
<body class="login">

<!-- BEGIN LOGO -->
<div class="logo">
    <img src="${request.contextPath}/img/logo/logo.png" alt=""/>
</div>
<!-- END LOGO -->

<!-- BEGIN LOGIN -->
<div class="content">
    <!-- BEGIN LOGIN FORM -->
    <form class="login-form" action="${request.contextPath}/login2index" method="post">
        <h3 class="form-title">登陆</h3>
        <div class="alert alert-danger">
            <button class="close" data-close="alert"></button>
            <span><#if msg??>${msg}<#else>用户名或密码错误</#if></span>
        </div>
        <div class="form-group">
            <!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
            <label class="control-label visible-ie8 visible-ie9">用户</label>
            <div class="input-icon">
                <i class="fa fa-user"></i>
                <input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="用户名" name="name"/>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label visible-ie8 visible-ie9">密码</label>
            <div class="input-icon">
                <i class="fa fa-lock"></i>
                <input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="密码" name="password"/>
            </div>
        </div>
        <div class="form-actions">
            <label></label>
            <button type="submit" class="btn green-haze pull-right">
                登陆 <i class="m-icon-swapright m-icon-white"></i>
            </button>
        </div>
    </form>
</div>
<#include "./login/footer.ftl"/>
<#include "./login/script.ftl"/>
</body>
</html>