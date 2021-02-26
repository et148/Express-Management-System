var frame=frame||{};
var $=jQuery;
frame.Modal = function() {
	var Modal=function(params){
		var self=this;
		var _divObj=params.divObj;
		var _id=params.id;
		var _options=params.options;
		var _data = params.data;
		var _contentObj=params.contentObj;
		var _titleObj=params.titleObj;
		var _tailObj=params.tailObj
		this.getDivObj=function(){
			return _divObj;
		}
		this.setContent=function(html){
			return _contentObj.html(html);
		}
		this.setTitle=function(html){
			return _titleObj.html(html);
		}
		this.setTail=function(html){
			return _tailObj.html(html);
		}
		this.getId=function(){
			return _id;
		}
		this.getOptions=function(){
			return _options;
		}
		this.show=function(){
			_divObj.children("#"+_id).modal("show");
		}
		this.hide=function(){
			_divObj.children("#"+_id).modal("hide");
		}
		this.getData=function(){
			return _data;
		}
		this.dispose=function(){
			_divObj.remove();
			self=null;
		}
	};
	var defaultConfigForAlert={
		confirm:{
			size:"sm",
			title:'询问',
			icon:"icon-question",
			boxColor:"blue",
			showTitle:false,
			okColor:"blue",
			cancelColor:"red",
			okText:"是",
			cancelText:"否"
		},
		info:{
			size:"sm",
			title:'消息',
			icon:"icon-bubble",
			boxColor:"green",
			showTitle:false,
			showTail:false,
			showOk:false,
			isStatic:false,
			cancelText:"确定"
		},
		error:{
			size:"sm",
			title:'错误',
			icon:"icon-close",
			boxColor:"red",
			showTitle:false,
			showTail:false,
			showOk:false,
			isStatic:false,
			cancelText:"确定"
		},
		warning:{
			size:"sm",
			title:'警告',
			icon:"icon-bell",
			boxColor:"yellow",
			showTitle:false,
			showTail:false,
			showOk:false,
			isStatic:false,
			cancelText:"确定"
		}
	};
	return{
		show: function(id){
			$("#"+id).modal("show");
		},
		init: function(options){
			options=options||{};
			return frame.Modal.initModal(options);
		},
		initModal: function(options){
			if(!$){
				return;
			}
			options=options||{};
			if(options.type&&defaultConfigForAlert[options.type]){
				var config=defaultConfigForAlert[options.type];
				options.isDefault=true;
				for(var i in config){
					options[i]=options[i]||config[i];
				}
			}
			var autoModalId="modal-div-"+(frame.UUID());
			options.id=options.id||autoModalId;
			$("#"+options.id).remove();

			$("body").append('<div id="'+ options.id+'"></div>');
			var modalId=this.getModalId(options);
			var divObj=$("#"+options.id);
			var title=(options.showTitle==false?"":(''
			+'<div class="modal-header ">'
			+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>'
			+'<h4 class="modal-title">'+(options.title||"标题")+'</h4>'
			+'</div>'
			));
			var tail=(options.showTail==false?"":(''
			+'<div class="modal-footer">'
			+'</div>'
			));
			divObj.html(''
			+'<div class="modal fade" id="'+(modalId)+'" tabindex="-1" role="dialog" '+(options.isStatic==false?"":"data-backdrop=\"static\"")+' aria-hidden="true">'
			+'<div class="modal-dialog modal-'+(options.size||"lg")+'">'
			+'<div class="modal-content">'
			+title
			+'<div id="'+(options.bodyId||"")+'" class="modal-body" style="padding:5px">'
			+'</div>'
			+tail
			+'</div>'
			+'</div>'
			+'</div>');
			var modalObj=$(divObj.children());
			this.bindEvent(modalObj,options);
			var contentObj=$(divObj.find(".modal-body"));
			var titleObj=$(divObj.find(".modal-title"));
			var tailObj=$(divObj.find(".modal-footer"));
			this.setContent(contentObj,options);
			if(options.showTail!=false){
				this.setTail(tailObj,options);
			}
			var modalObj=new Modal({divObj:divObj,contentObj:contentObj,titleObj:titleObj,tailObj:tailObj,id:modalId,options:options});
            //存放前一个上下文的参数
            $("#"+options.id).data(options.data);
			return modalObj;
		},
		setContent:function(contentObj,options){
			if(options.isDefault){
				contentObj.html(''
				+'<div class="row">'
				+'<div class="col-md-12 text-center">'
				+'<div class="portlet box '+options.boxColor +'">'
				+'<div class="portlet-title">'
				+'<div class="caption">'
				+'<i class="'+options.icon+'"></i>'+options.title
				+'</div>'
				+'</div>'
				+'<div class="portlet-body">'+(options.text||options.title)
				+'</div>'
				+'</div>'
				+'</div>'
				+'</div>'
				+'');
				contentObj.find(".portlet").css("margin-bottom","0px");
				return;
			}
			contentObj.html(options.html||"content not set");
			if($('.colorpicker-default').colorpicker){
				$('.colorpicker-default').colorpicker({
					format: 'hex'
				});
				$('.colorpicker-default').each(function(e,o){
					$(o).find("button i").css("background-color",$(o).find("input").val()||"tansparent")
				})
			}
			if(options.url){
				$.ajax({
					url: options.url,
					data:options.params||{},
					type: "POST",
					dataType: "html",
					success: function(msg){
						contentObj.html(msg)
						if($('.colorpicker-default').colorpicker){
							$('.colorpicker-default').colorpicker({
								format: 'hex'
							});
							$('.colorpicker-default').each(function(e,o){
								$(o).find("button i").css("background-color",$(o).find("input").val()||"tansparent")
							})
						}
					}
				})
			}
		},
		setTail:function(tailObj,options){
			var okHtml="";
			var cancelHtml="";
			if(options.showOk!=false){
				okHtml='<button name="modal-ok" visible='+(options.showOk==false?false:true)+' type="button" class="btn btn-sm '+(options.okColor||"blue")+'" data-dismiss="modal">'+(options.okText||"确定")+'</button>';
			}
			if(options.showCancel!=false){
				cancelHtml='<button name="modal-cancel" visible='+(options.showCancel==false?false:true)+' type="button" class="btn btn-sm '+(options.cancelColor||"default")+'" data-dismiss="modal">'+(options.cancelText||"取消")+'</button>';	
			}
			tailObj.html(''
			+this.getButton(options.buttons)
			+okHtml
			+cancelHtml
			+'');
		},
		getModalId:function(options){
			return options.id+"-inner";
		},
		getButton:function(buttons){
			buttons=buttons||[];
			var html="";
			for(var i in buttons){
				var button=buttons[i];
				html+='<button name="'+button.name+'" type="button" class="btn btn-sm '+(button.cls||"blue")+'">'+(button.text||"确定")+'</button>';
			}
			return html;
		},
		bindEvent:function(modalObj,options){
			modalObj.on('hidden.bs.modal',function(e){
				$(this).parent().remove();
				if(options.onClose){
					options.onClose(e);
				}
			})
			modalObj.on('hide.bs.modal',function(e){
				if(options.onClosing){
					options.onClosing(e);
				}
			})
			modalObj.on('show.bs.modal',function(e){
				if(options.onOpening){
					options.onOpening(e);
				}
			})
			if(options.onOpen){
				modalObj.on('shown.bs.modal',function(e){
					options.onOpen(e);
				})
			}
			if(options.onOk){
				modalObj.on("click","button[name=modal-ok]",function(e){
					options.onOk(e);
				})
			}
			if(options.onCancel){
				modalObj.on("click","button[name=modal-cancel]",function(e){
					options.onCancel(e);
				})
			}
			for(var i in options.buttons){
				var button=options.buttons[i];
				if(button.callback){
					modalObj.on("click","button[name="+button.name+"]",button.callback);
				}
			}
		}
	};
}();