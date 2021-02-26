var frame=frame||{};
var $=jQuery;
frame.Menu = function() {
	return {
		toggleSelection:function(obj,checked){
			var menu=obj.find(".menu-text");
			if(menu.length==0) menu=obj.find(".l-btn-text");
			if(menu.length==0) return;
			var i=menu.find("i");
			if(checked!=null){
				if(checked){
					i.remove();
					menu.append(' <i class="fa fa-check"></i>');
				}else{
					i.remove();
				}
			}else{
				if(i.length!=0){
					i.remove();
				}else{
					menu.append(' <i class="fa fa-check"></i>');
				}
			}
		},
		switchSelection:function(obj){
			obj.parent().find(".menu-item").each(function(){
				$(this).find("i").remove();
			});
			obj.append(' <i class="fa fa-check"></i>');
		},
		init: function(options) {
			options=options||{};
			frame.Menu.initMenu(options);
		},
		initMenu: function(options) {
			if (!$) {
				return;
			}
			if(!options.id){
				console.info("div id not specified");
				return;
			}
			options.actions=options.actions||[];
			var divObj=$("#"+options.id);
			if(!divObj){
				console.info("div obj with given id '"+options.id +"' not found");
				return;
			}
			divObj.html('<div style="cursor:pointer;margin-top:2px;width:15px;text-align: center;float:left"><i id="left" class="fa fa-caret-left"></i></div><div id="middle" style="float:left;overflow: hidden;white-space: nowrap;width:calc(100% - 30px);"></div><div style="cursor:pointer;margin-top:2px;width:15px;text-align: center;float:right"><i id="right" class="fa fa-caret-right"></i></div>');
			middleObj=divObj.find("#middle");
			if(options.style=="metro"){
				//简易色块风格
				this.constrcutMenusInMetro(divObj,options);
			}else if(options.style=="easy"){
				//easy-ui风格
				this.constrcutMenusInEasy(middleObj,options);
			}else{
				//默认圆形菜单风格
				this.constrcutMenusInCircle(divObj,options);
			}
			this.bindEvents(divObj,options);
		},
		constrcutMenusInCircle:function(divObj,options){
			var html='';
			for(var i in options.actions){
				var subs=options.actions[i].subs;
				var subHtml=null;
				if(subs&&subs.length>0){
					subHtml='<ul class="dropdown-menu">';
					for(var j in subs){
						subHtml+='<li><a id="'+subs[j].id+'">'+(subs[j].text||'')+'</a></li>'
					}
					subHtml+='</ul>';
				}
				html+=(''	
				+'<div class="btn-group">'
				+'<a id="'+options.actions[i].id+'" title="'+(options.actions[i].title||"")+'" class="btn btn-circle btn-icon-only btn-default dropdown-toggle" '+(subHtml==null?'':'data-toggle="dropdown"')+'>'
				+'<i class="'+options.actions[i].icon+'"></i> '
				+' </a>'
				+(subHtml||'')
				+'</div>'
				)
			}
			if(options.showFullScreen==true){
				html+=(''
				+'<div class="btn-group">'
				+'<a id="fullscreen" title="全屏" class="btn btn-circle btn-icon-only btn-default fullscreen">'
				+'</a>'
				+'</div>'
				);
			}
			divObj.html(html)
		},
		constrcutMenusInMetro:function(divObj,options){
			var html='';
			for(var i in options.actions){
				var subs=options.actions[i].subs;
				var subHtml=null;
				if(subs&&subs.length>0){
					subHtml='<ul class="dropdown-menu">';
					for(var j in subs){
						subHtml+='<li><a id="'+subs[j].id+'">'+(subs[j].text||'')+'</a></li>'
					}
					subHtml+='</ul>';
				}
				html+=(''	
				+'<div class="btn-group">'
				+'<a id="'+options.actions[i].id+'" title="'+(options.actions[i].title||"")+'" class="btn btn-xs grey-cararra dropdown-toggle" '+(subHtml==null?'':'data-toggle="dropdown"')+'>'
				+'<i class="'+options.actions[i].icon+'"></i> '
				+(options.actions[i].text||'')
				+(subHtml==null?'':'<i class="fa fa-angle-down"></i>')
				+' </a>'
				+(subHtml||'')
				+'</div>'
				)
			}
			divObj.html(html)
		},
		constrcutMenusInEasy: function(divObj,options){
			var html='';
			for(var i in options.actions){
				var subs=options.actions[i].subs;
				var subHtml='';
				if(subs&&subs.length>0){
					subHtml='<div id="'+options.actions[i].id+'-sub"></div>';
				}
				html+=('<a id="'+options.actions[i].id+'">'+(options.actions[i].text||'')+'</a>'+(subHtml||""));
			}
			divObj.html(html);
			for(var i in options.actions){
				var ops={
					plain:!false,
					iconCls: options.actions[i].icon
				}
				var subs=options.actions[i].subs;
				if(subs&&subs.length>0){
					ops.menu='#'+options.actions[i].id+'-sub';
					$('#'+options.actions[i].id).menubutton(ops);
					$(ops.menu).html("");
					for(var i in subs){
						$(ops.menu).menu('appendItem', {
							id:subs[i].id,
							text: subs[i].text||'',
							iconCls: subs[i].icon||'',
							onclick: subs[i].click||function(){}
						});
						if(subs[i].checked==true){
							$(ops.menu).find(".menu-text").last().append(' <i class="fa fa-check"></i>');
						}
					}
				}else{
					var obj=$('#'+options.actions[i].id).linkbutton(ops);
					if(options.actions[i].checked==true){
						 obj.find(".l-btn-text").append(' <i class="fa fa-check"></i>');
					}
					
				}
			}
		},
		bindEvents:function(divObj,options){
			
			var midObj=	divObj.find("#middle");
			divObj.find("#left").on("mousedown",function(){
				if(midObj.scrollLeft()>0){
					midObj.scrollLeft(midObj.scrollLeft()-20);
				}
			});
			divObj.find("#right").on("mousedown",function(){
				if(midObj.scrollLeft()<midObj.width()){
					midObj.scrollLeft(midObj.scrollLeft()+20);
				}
			});
			for(var i in options.actions){
				if(options.actions[i].click){
					divObj.find("#"+options.actions[i].id).on("click",options.actions[i].click);
				}
				for(var j in options.actions[i].subs||[]){
					if(options.actions[i].subs[j].click){
						divObj.find("#"+options.actions[i].subs[j].id).on("click",options.actions[i].subs[j].click);
					}
				}
			}
			if(options.fullScreenCallBack){
				divObj.find("#fullscreen").on("click",options.fullScreenCallBack);
			}
		}
	};
}();