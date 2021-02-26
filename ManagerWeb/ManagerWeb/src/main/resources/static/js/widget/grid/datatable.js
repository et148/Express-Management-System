var widget = widget || {};
widget.grid = widget.grid || {};
widget.grid.datatable = {
	
	defaultSettings : {
		"iDisplayLength" : 10,
		"bLengthChange": true,
		"bSort": false, //是否支持排序功能 
		"aLengthMenu": [[10, 25, 50], [10, 25, 50]],
		"bPaginate": true,//翻页功能
		"bFilter": false,
		"bInfo": true,//页脚信息,添加 共n条结果
		"bAutoWidth": false,//自动宽度
		//"bStateSave": true,//状态保存，使用了翻页或者改变了每页显示数据数量，会保存在cookie中，下回访问时会显示上一次关闭页面时的内容
		"bProcessing": true,
		"bServerSide": true,
		"sDom":'frtpli',
		"oLanguage": {
			"sLengthMenu": " _MENU_ 条纪录/页",	 
			"sZeroRecords": "没有检索到数据",	 
			"sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",	 
			"sInfoEmtpy": "没有数据",	 
			"sProcessing": '<i class="fa fa-coffee"></i> 正在加载数据...',
			"sEmptyTable":'无数据',
			"sInfoEmpty":"",
			"oPaginate": {	 
				"sFirst": "首页",	 
				"sPrevious": "上页",	 
				"sNext": "下页",	 
				"sLast": "尾页"	
			}
		}
	},
	
	/**
	 * 初始化列表
	 */
	init:function(tid,config) {
		if($.fn.dataTable.fnIsDataTable(tid))
			return;
		var combConfig = {};
		$.extend(combConfig,widget.grid.datatable.defaultSettings,config);
		widget.grid.datatable.registerEvent(tid);
		return $(tid).dataTable(combConfig);
	},
	
	/**
	 * 注册事件：全选
	 */
	registerEvent:function(tid) {
		// 全选
		$(tid + " .group-checkable").click(function(e) {
			var flag = $(this).prop("checked");
			$(tid + " .checkboxes").each(function() {
				$(this).prop('checked', flag);
			});
		});
	},
	
	/**
	 * 删除操作
	 * @param tab
	 * @returns
	 */
	doDelete: function(tid,deleteUrl,callback) {
		var oTbl;
		if(!$.fn.dataTable.fnIsDataTable(tid)) {
			return
		} else {
			oTbl = $(tid).dataTable();
		}
		var cks = $(tid+" .checkboxes:checked");
		if(cks.length == 0) {
			frame.Modal.init({type:'warning',text:"请选择要删除的数据!"}).show();
		} else {
			frame.Modal.init({type:'confirm',title:'确认',text:'您确认想要删除记录吗？',onOk:function() {
				var ids = '';
				cks.each(function() {
					ids += ',' + $(this).attr("sid")
				});
				ids = ids.substr(1);
				$.ajax({
					type: "POST",
					url: deleteUrl,
					data: "ids="+ids,
					success: function(ret){
						if(callback) {
							callback(ret);
							return;
						}
						if(ret.isOk) {
							toastr.success("删除成功！","提示");
							var pi = oTbl.fnPagingInfo()
							if(pi.iTotal - pi.iPage * pi.iLength <= cks.length) {
								if(pi.iPage > 0) {
									oTbl.fnPageChange(pi.iPage - 1);
									return;
								}
							}
							oTbl.fnPageChange(pi.iPage);
						} else {
							toastr.error(ret.message,"提示");
						}
					}
				});
			}}).show();
		}
	},
	refresh: function(tid) {
		var cks = widget.grid.datatable.getCheckedIds(tid);
		var oTbl = $(tid).dataTable();
		var pi = oTbl.fnPagingInfo()
		if(pi.iTotal - pi.iPage * pi.iLength <= cks.length) {
			if(pi.iPage > 0) {
				oTbl.fnPageChange(pi.iPage - 1);
				return;
			}
		}
		oTbl.fnPageChange(pi.iPage);
	},
	getCheckedIds: function(tid) {
		var oTbl;
		if(!$.fn.dataTable.fnIsDataTable(tid)) {
			return
		} else {
			oTbl = $(tid).dataTable();
		}
		var cks = $(tid+" .checkboxes:checked");
		if(cks.length == 0) {
			return {length:0,ids:""}	
		} else {
			var ids = '';
			cks.each(function() {
				ids += ',' + $(this).attr("sid")
			});
			ids = ids.substr(1);
			return {length:cks.length,ids:ids}
		}
	},
	getDataById:function(tid,id) {
		var oTbl;
		if(!$.fn.dataTable.fnIsDataTable(tid)) {
			return
		} else {
			oTbl = $(tid).dataTable();
		}
		var tData = oTbl.DataTable().data();
		var len = tData.length;
		for(var i = 0; i < len; i++) {
			if(tData[i].id == id) {
				return tData[i];
			}
		}
	}
}