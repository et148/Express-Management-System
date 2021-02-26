<input type="hidden" id="ctx" value="${request.contextPath}">

<script src="${request.contextPath}/assets/global/plugins/respond.min.js"></script>
<script src="${request.contextPath}/assets/global/plugins/excanvas.min.js"></script>

<script src="${request.contextPath}/assets/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>

<script src="${request.contextPath}/assets/global/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/global/plugins/select2/select2.min.js" type="text/javascript" ></script>

<script src="${request.contextPath}/assets/global/scripts/metronic.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="${request.contextPath}/assets/admin/layout/scripts/demo.js" type="text/javascript"></script>
<script src="${request.contextPath}/js/utils/md5.js" type="text/javascript"></script>
<script src="${request.contextPath}/js/system/login.js" type="text/javascript"></script>

<#--md5-->

<script>
var ctx = $("#ctx")[0].value;
jQuery(document).ready(function() {
    Metronic.init(); // init metronic core components
    Layout.init(); // init current layout
    Login.init();
    Demo.init();
});
</script>