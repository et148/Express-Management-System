var frame=frame||{};
var $=jQuery;
frame.Navigation = function() {
	return {
		init: function(options) {
			options=options||{};
			frame.Navigation.initNavigation(options);
		},
		initNavigation: function(options) {
			if (!$) {
				return;
			}
			if(!options.id){
				console.info("div id not specified");
				return;
			}
			options.dataArray=options.dataArray||[];
			var divObj=$("#"+options.id);
			if(!divObj){
				console.info("div obj with given id '"+options.id +"' not found");
				return;
			}
			this.constrcutMain(divObj);
			ulObj=$(divObj.find("ul")[0]);
			this.constrcutSearch(ulObj,options);
			this.constructMenu(ulObj,options.dataArray,1,options);
			this.bindEvents(ulObj,options);
		},
		constrcutMain:function(divObj,options){
			divObj.html('');
			divObj.append(''
			+'<div class="page-sidebar-wrapper">'
			+'<div class="page-sidebar navbar-collapse collapse">'
			+'<ul class="page-sidebar-menu" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">'
			+'<li class="sidebar-toggler-wrapper">'
			+'<div class="sidebar-toggler">'
			+'</div>'
			+'</li>'
			+'</ul>'
			+'</div>'
			+'</div>');
		},
		constrcutSearch:function(parentObj,options,callback){
			parentObj.append(''
			+'<li class="sidebar-search-wrapper">'
			+'<form class="sidebar-search ">'
			+'<a href="javascript:;" class="remove">'
			+'<i class="icon-close"></i>'
			+'</a>'
			+'<div class="input-group">'
			+'<input type="text" class="form-control" placeholder="'+(options.searchText||"查找")+'...">'
			+'<span class="input-group-btn">'
			+'<a href="javascript:;" class="btn submit"><i class="icon-magnifier"></i></a>'
			+'</span>'
			+'</div>'
			+'</form>'
			+'</li>');
		},
		constructMenu:function(parentObj,childrenArray,level,options){
			childrenArray=childrenArray||[];
			for(var index in childrenArray){
				var curData=childrenArray[index];
				var html=this.constructMenuItem(curData,level,options);
				parentObj.append(html);
				var curObj=parentObj;
				if(level!=1){
					var curObj=parentObj.children("li:last-child").find("ul");
				}
				this.constructMenu(curObj,curData.children,level+1,options);
			}	
		},
		constructMenuItem:function(data,level,options){
			var html="";
			if(level==1){
				html='<li id='+("menu-"+data.id)+' class="heading"><h3 class="uppercase">'+data.text+'</h3></li>'
			}else if(level==2){
				html=''
				+'<li id='+("menu-"+data.id)+'>'
				+'<a menu-level="'+level+'" menu-url='+(data.url ? (ctx + data.url):"#")+' menu-options="'+(data.options?data.options:"")+'" href="javascript:;">'
				+'<i class="'+data.icon+'"></i>'
				+'<span class="title">'+data.text+'</span>'
				+'<span class="selected"></span>'
				+'<span class="arrow"></span>'
				+'</a>'
				+'<ul class="sub-menu">'
				+'</ul>'
				+'</li>';
			}else{
				var span="";
				for(var i=3;i<level;i++){
					span+="--";
				}
				html=''
				+'<li id='+("menu-"+data.id)+'>'
				+'<a menu-level="'+level+'" menu-url='+(data.url ? (ctx + data.url):"#")+' menu-options="'+(data.options?data.options:"")+'" href="javascript:;">'+span
				+'<i class="'+data.icon+'"></i>'
				+'<span tabIcon='+data.tabIcon+'>'+data.text+'</span>'
				+'</a>'
				+'</li>';
			}
			return html;
		},
		bindEvents:function(parentObj,options){
			var self=this;
			options.mode=options.mode||"tab"
			switch(options.mode){
				case "tab":{
					parentObj.on("click","li a",function(){ 
						var url=this.attributes.getNamedItem("menu-url").value;
						var menu_options=this.attributes.getNamedItem("menu-options").value;
						var level=this.attributes.getNamedItem("menu-level").value;
						var menu = $('.page-sidebar-menu');
						if(level==1){
						}else if(level==2){
						}else{
							menu.find('li.active').removeClass('active');
							$(this.parentNode.parentNode.parentNode).addClass("active");
							$(this.parentNode).addClass("active");
						}
						if(url!="#"){
							var span=$(this).children("span");
							self.clickEventForTabMode(self,{text:span.text(), icon:span.attr("tabIcon"), url:url,options:menu_options,id:this.parentNode.id.split("-")[1]},options)
						}
					});
					break;
				}
				default:break;
			}
		},
		clickEventForTabMode:function(self,data,options){
			if(!options.relTabId){
				console.info("tab id not specified");
				return;
			}
			var tabObj=$("#"+options.relTabId);
			if(!tabObj){
				console.info("tab obj with given id '"+options.relTabId +"' not found");
				return;
			}
			$.ajax({
				url: data.url,
				type: "POST",
				dataType: "html",
				success: function(msg) {
					if(tabObj.find("#tab-"+data.id).length==0){
						self.constructTab(tabObj,data,msg);
					}else{
						tabObj.find("#tab-"+data.id).trigger("click")
					}
				}
			})
		},
		constructTab:function(tabObj,data,html){
			var header=tabObj.children().children("ul")
			var content=tabObj.children().children(".tab-content");
			header.append(''
			+'<li class="nav-item">'
			+'<a class="nav-link" id='+("tab-"+data.id)+' href="#'+(data.id+"-tabs-above")+'" role="tab-kv" data-toggle="tab" aria-controls="profile">'
			+'<i class="fa fa-'+data.icon+'"></i>'+data.text+'<i class="fa fa-remove tab-close" style="cursor:pointer"></i>'
			+'</a>'
			+'</li>');
			content.append(''
			+'<div class="tab-pane fade" id='+(data.id+"-tabs-above")+' role="tabpanel">'
			+html
			+'</div>');
			if(data.options){
				eval("var opt = " + data.options);
				if(opt.height){
					tabObj.find("#"+(data.id+"-tabs-above")).css("height",opt.height+"px");	
				}
			}
			tabObj.find("#tab-"+data.id).trigger("click");
			tabObj.on("click","#tab-"+data.id+" i:last",function(e){
				var curTab=$(this.parentNode.parentNode);
				var prevTab=curTab.prev();
				var isActive=curTab.hasClass("active");
				curTab.parent().parent().find(curTab.children("a").attr("href")).remove();
				curTab.remove();
				if(isActive){
					prevTab.children("a").trigger("click");	
				}
				e.stopPropagation();
			});
		}
	};
}();