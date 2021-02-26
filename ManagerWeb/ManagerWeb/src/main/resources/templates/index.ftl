<#import "./common/spring.ftl" as spring/>
<!DOCTYPE html>
<html>
<head><title>快递管理系统</title>
<#include "./frame/css.ftl"/>
</head>
<body class="page-header-fixed page-quick-sidebar-over-content page-style-square">
<#include "./frame/header.ftl"/>
<div class="page-container">
    <div id='page-sider' class="page-sidebar">
    </div>
    <div class="page-content-wrapper">
        <div class="page-content">
            <div id="content-tab">
            <#include "./frame/tab.ftl"/>
            </div>
        </div>
    </div>
</div>
<#include "./frame/footer.ftl"/>
<#include "./frame/script.ftl"/>
</body>
</html>