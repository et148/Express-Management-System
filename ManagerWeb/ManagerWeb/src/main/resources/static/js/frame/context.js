var frame=frame||{};
var $=jQuery;
frame.Context = function() {
	var Context=function(params){
		var self=this;
		var _divObj=params.divObj;
		var _targetObj;
		var _options=params.options;
		this.show=function(top,left){
			var ulObj=_divObj.find("ul");
			ulObj.css("display","block");
			var adjustedTop=top-8;
			var adjustedLeft=left+2;
			if(ulObj.width()+adjustedLeft>$(window).width()-10){
				adjustedLeft=$(window).width()-ulObj.width()-10;
			}
			ulObj.css("top",adjustedTop);
			ulObj.css("left",adjustedLeft);
		};
		this.hide=function(){
			var ulObj=_divObj.find("ul");
			ulObj.css("display","none");
		};
		this.setTarget=function(obj){
			_targetObj=obj;
		};
		this.getTarget=function(obj){
			return _targetObj;
		};
		this.setMenus=function(actions){
			_options.actions=actions||_options.actions;
			frame.Context.constrcutContexts(_divObj,_options);
			frame.Context.bindEvents(_divObj,_options);
		}
		this.bindEvent=function(id,eventName,event,params){
			_divObj.find("#"+id).off(eventName);
			_divObj.find("#"+id).on(eventName,params,event);
		}
		this.get=function(){
			return _divObj.find("ul");
		};
		this.getDom=function(){
			return _divObj.find("ul")[0];
		};
	};
	return {
		init: function(options) {
			options=options||{};
			return frame.Context.initContext(options);
		},
		initContext: function(options) {
			if (!$) {
				return;
			}
			options.actions=options.actions||[];
			var autoContextId="context-div-"+(frame.UUID());
			options.id=options.id||autoContextId;
			
			$("#"+options.id).remove();
			$("body").append('<div id="'+ options.id+'"></div>');
			var divObj=$("#"+options.id);
			this.constrcutContexts(divObj,options);
			this.bindEvents(divObj,options);
			var contextObj=new Context({divObj:divObj,options:options});
			return contextObj;
		},
		constrcutContexts:function(divObj,options){
			var html='<ul class="dropdown-menu" role="menu" style="min-width:120px;">'
			for(var i in options.actions){
				html+=(''
					+'<li role="presentation">'
					+'<a id="'+options.actions[i].id+'" role="menuitem" style="padding:4px 6px">'
					+'<i class="'+options.actions[i].icon+'"></i> '
					+options.actions[i].name
					//+' <span class="badge badge-success">'
					//+'0 </span>'
					+'</a>'
					+'</li>'
				)
			}
			html+='</ul>';
			divObj.html(html)
		},
		bindEvents:function(divObj,options){
			for(var i in options.actions){
				if(options.actions[i].click){
					divObj.find("#"+options.actions[i].id).on("click",options.actions[i].click);
				}
			}
		}
	};
}();