;(function($){
	/**
	 * 菜单点击事件
	 */
	$(".nav-sidebar li").click(function(e) {
		// 设置选中状态
		$(".nav-sidebar .active").removeAttr("class","active");
		$(this).addClass("active");
		
		// 打开tab
		var li = $(this).get(0);
		var tab = $("#contentTab").tabs("getTab",li.children[0].text);
		if(tab) {
			$("#contentTab").tabs("select",li.children[0].text);
		} else {
			$("#contentTab").tabs("add",{
				title : li.children[0].text,
				closable:true,
				style:"overflow:auto;padding:20px;display:none;",
				href: ctx + li.children[0].getAttribute("path")
			});
		}
	});
}(jQuery));