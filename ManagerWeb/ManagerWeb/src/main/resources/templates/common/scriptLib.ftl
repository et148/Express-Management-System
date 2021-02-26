<!-- 如果要使用Bootstrap的JS插件，则必须引入jQuery -->
<script src="${request.contextPath}/js/lib/jquery.js"></script>
<script src="${request.contextPath}/js/lib/jquery-migrate-1.2.1.js"></script>
<!-- Bootstrap的JS插件 -->
<script src="${request.contextPath}/js/lib/bootstrap.js"></script>
<!-- jquery-easyui -->
<script src="${request.contextPath}/js/lib/jquery.easyui.min.js"></script>
<script src="${request.contextPath}/js/lib/plugins/jquery.dataTables.min.js"></script>
<script src="${request.contextPath}/js/lib/plugins/jquery.fancybox.pack.js"></script>
<input id="ctx" value="${request.contextPath}">
<script type="text/javascript">
var ctx = $("#ctx")[0].value;
function openWindow(url, title){
	$("#openRowLnk").attr("href",encodeURI(url));
	$("#openRowLnk").attr("title",title);
	$("#openRowLnk").click();
}
</script>