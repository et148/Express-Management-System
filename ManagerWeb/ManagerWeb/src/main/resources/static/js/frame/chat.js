var frame=frame||{};
var $=jQuery;
frame.Chat = function() {
	var Chat=function(params){
		var self=this;
		var _html=params.html;
		var _options=params.options;
		var _divObj=params.divObj;
		
		var _grpScroller=_divObj.find("#grpScroller");
		var _grpList=_grpScroller.find("ul");
		
		var _msgScroller=_divObj.find("#msgScroller");
		var _msgList=_msgScroller.find("ul");
		var _msgInput=_divObj.find(".input-cont").find("input");
		var _msgTextButton=_divObj.find(".btn-cont:eq(0)").find("a");
		var _msgAudioButton=_divObj.find(".btn-cont:eq(1)").find("a");
		var _msgPlusButton=_divObj.find(".btn-cont:eq(2)").find("a");
		
		var _msgImageButton=_divObj.find("#sendImage");
		var _msgGroupButton=_divObj.find("#createGroup");
		
		var _currentChattingGroup;
		
		var _currentPlayingAudio;
		var _audioPlayingInterval;
		
		var _doAfterSend=function(data,params,group){
		}
		var _doAfterAudioPlay=function(e){
			clearInterval(_audioPlayingInterval);
			var icon=$(e.target).parent().find("i");
			icon.removeClass();
			icon.addClass("fa");
			icon.addClass("fa-volume-up");
			_currentPlayingAudio=null;
		}
		var _formatDate=function(date){
			return date.toLocaleString();
		}
		var _constructGroup=function(data){
			return (''
				+'<li id="'+(data.id||"")+'">'
				+'<a style="padding:3px;" href="#">'
				+'<span class="badge badge-success">'+(data.number||1)+'</span> <i>'+(data.name||"临时会话")+'</i></a>'
				+'</li>'
				+'<li>'
			);
		}
		var _constructMessage=function(data){
			data.prefix=data.prefix||"";
			data.iconUrl=data.iconUrl||"/platform/img/map/battle/staff.png";
			data.type=data.type||"Text";
			var message="";
			switch(data.type){
				case "Text":
					message=data.text;
					break;
				case "Image":
					message='<img src="'+(data.prefix+data.url)+'" />';
					break;
				case "Audio":
					var msgMargin=(data.isSelf==true?"0px 0px 0px auto":"0px auto 0px 0px");
					var msgWidth="5%";
					var msgLength="...";
					if(data.length){
						var time=Math.ceil(data.length);
						var ratio=Math.round(time/60*100);
						if(ratio>100) ratio=100;
						if(ratio<5) ratio=5
						msgWidth=ratio+"%";
						msgLength=time;
					}
					
					var msgType=(data.isSelf==true?"progress-bar-danger":"progress-bar-success");
					message=''
					+'<div class="progress" style="cursor:pointer;margin:'+msgMargin+';width:'+msgWidth+'">'
					+'<div class="progress-bar '+msgType+'" style="width: 100%">'
					+'<i class="fa fa-volume-up"></i><span>'+msgLength+'"</span>'
					+'</div>'
					+'<audio src="'+(data.prefix+data.url)+'" >'
					+'</audio>'
					+'</div>'
					;
					break;
				default:break;
			}
			return (''
				+'<li id="'+data.id+'" class="'+(data.isSelf==true?"out":"in")+'">'
				+'<img class="avatar" alt="" src="'+data.iconUrl+'" />'
				+'<div class="message">'
					+'<span class="arrow">'
					+'</span>'
					+'<a href="#" class="name">'
					+''+data.name+' </a>'
					+'<span class="datetime">'
					+' '+_formatDate(data.time)+' </span>'
					+'<span class="body">'
					+ message
					+'</span>'
				+'</div>'
			+'</li>');
		}
		this.setAfterSendHandler=function(handler){
			_doAfterSend=handler;
		}
		this.setSelectedGroup=function(obj){
			if(_currentChattingGroup){
				_currentChattingGroup.css("background","");	
			}
			obj.css("background","#eee");
			var titleStr=obj.find("a").text();
			titleStr=titleStr.substr(titleStr.split(" ")[0].length);
			_divObj.find(".portlet-title").find(".caption-helper").text("("+titleStr+" )");
			_currentChattingGroup=obj;
		}
		this.clearAudioPlaying=function(){
			if(_currentPlayingAudio!=null){
				_currentPlayingAudio.currentTime=0;
				_currentPlayingAudio.pause();
				_doAfterAudioPlay({target:_currentPlayingAudio})
			}
		}
		this.initScroller=function(){
			_msgScroller.slimScroll({ height: _options.height+'px',start: 'bottom', opacity: .4,railOpacity: .2 });
			_grpScroller.slimScroll({ height: (_options.height-0+60)+'px',start: 'bottom', opacity: .4,railOpacity: .2 });
		}
		this.getScroller=function(){
			return _msgScroller;
		}
		this.getMessageInput=function(){
			return _msgInput;
		}
		this.getGroupList=function(){
			return _grpList;
		}
		this.getMessageList=function(){
			return _msgList;
		}
		this.getAudioButton=function(){
			return _msgAudioButton;
		}
		this.getPlusButton=function(){
			return _msgPlusButton;
		}
		this.getImageButton=function(){
			return _msgImageButton;
		}
		this.getGroupButton=function(){
			return _msgGroupButton;
		}
		this.getOptions=function(){
			return _options;
		}
		this.getHtml=function(){
			return _html;
		}
		this.getDivObj=function(){
			return _divObj;
		}
		this.clear=function(){
			_msgList.html("");
		}
		this.send=function(data,params){
			var html="";
			if(data instanceof Array){
			}else{
				data=[data];
			}
			for(var i in data){
				html+=_constructMessage(data[i]);
			}
			_msgList.append(html);
			var scrollHeight = _msgScroller.prop("scrollHeight");
			_msgScroller.scrollTop(scrollHeight,200);
			self.initScroller();
			params=params||{};
			_doAfterSend(data,params,_currentChattingGroup);
		}
		this.addGroup=function(data,reset){
			var html="";
			if(data instanceof Array){
				for(var i in data){
					html+=_constructGroup(data[i]);
				}
			}else{
				html=_constructGroup(data);
			}
			if(reset==true){
				_grpList.html(html);
			}else{
				_grpList.append(html);
			}
		}
		_msgTextButton.on("click",function(e){
			if(_msgInput.val()=="") return;
			self.send({isSelf:true,time:new Date(),name:"我",text:_msgInput.val()});
			_msgInput.val("");
		});
		_msgPlusButton.hover(function(){_msgPlusButton.css("background-color","transparent");});
		_msgList.on("click",".progress",function(e){
			self.clearAudioPlaying();
			var me=$(this);
			var audioObj=me.find("audio")[0];
			_currentPlayingAudio=audioObj;
			audioObj.removeEventListener('ended',_doAfterAudioPlay);
			audioObj.addEventListener('ended',_doAfterAudioPlay);
			audioObj.play();
			_audioPlayingInterval=setInterval(function(){
				var icon=me.find("i");
				var newClass="";
				if(icon.hasClass("fa-volume-off")){
					newClass+="fa-volume-down";
				}else if(icon.hasClass("fa-volume-down")){
					newClass+="fa-volume-up";
				}else {
					newClass+="fa-volume-off";
				}
				icon.removeClass();
				icon.addClass("fa");
				icon.addClass(newClass);
			},500)
		});
		_grpList.on("click","a",function(e){
			self.setSelectedGroup($(e.target).closest("li"));
		});
		_grpList.on("click","span",function(e){
			return false;
		});
		this.initScroller();
	};
	return {
		init: function(options){
			options=options||{};
			return frame.Chat.initChat(options);
		},
		initChat: function(options){
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
			divObj.html("");
			options.columns=options.columns||[];
			var chatHtml=this.setContent(divObj,options);
			var chatObj= new Chat({options:options,html:chatHtml,divObj:divObj});
			return chatObj;
		},
		setContent:function(divObj,options){
			options.height=options.height||300;
			options.title=options.title||"聊天"
			var groupListHtml='';
			if(options.hasGroupList==true){
				groupListHtml=''
					+'<div style="padding:5px;" class="portlet light bg-inverse tasks-widget col-xs-2">'
					+'<div id="grpScroller" class="scroller" style="height: '+(options.height-0+60)+'px;" data-always-visible="1" data-rail-visible1="1">'
					+'<div style="padding:0px;" class="portlet-body" style="height: auto;">'
					+'<ul class="nav nav-pills nav-stacked">'
					+'</ul>'
					+'</div>'
					+'</div>'
					+'</div>'
			}
			var html=''
				+'<div class="portlet light" style="margin-bottom:0px;">'
				
				+'<div class="portlet-title">'
				+'<div class="caption">'
				+'<i class="icon-bubble font-green-sharp"></i>'
				+'<span class="caption-subject font-green-sharp">'+options.title+'</span>'
				+'<span class="caption-helper"></span>' 
				+'</div>'
				+'</div>'
				
				+'<div class="portlet-body">'
				
				+'<div class="col-xs-'+(options.hasGroupList==true?"10":"12")+'">'
				+'<div id="msgScroller" class="scroller" style="height: '+options.height+'px;" data-always-visible="1" data-rail-visible1="1">'
				+'<ul class="chats">'
				+'</ul>'
				+'</div>'
				+'<div class="chat-form" style="overflow:visible;">'
				+'<div class="input-cont">'
				+'<input class="form-control" type="text" placeholder="..."/>'
				+'</div>'
				+'<div class="btn-cont" style="width:100px">'
				+'<span class="arrow" style="right:100px">'
				+'</span>'
				+'<a href="#" class="btn blue icn-only" draggable="false" style="border-radius:0px">'
				+'<i class="fa fa-pencil icon-white"></i>'
				+'</a>'
				+'</div>'
				+'<div class="btn-cont" style="width:59px">'
				+'<a href="#" class="btn blue icn-only" draggable="false" style="border-radius:0px">'
				+'<i class="fa fa-volume-up icon-white"></i>'
				+'</a>'
				+'</div>'
				+'<div class="btn-group" style="margin-top:-35px;float:right;width:17px">'
				+'<a href="#" class="btn icn-only dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style="width:100%;padding-left:5px;border-radius:0px"><i class="fa fa-plus icon-white"></i>'
				+'</a>'
				+'<ul class="dropdown-menu dropdown-menu-default" role="menu" style="min-width:120px;">'
				+'<li role="presentation">'
				+'<a id="sendImage" role="menuitem" tabindex="-1" href="#" style="user-select:none;">'
				+'<span class="fa fa-file-image-o"></span> 添加图片  '
				+'</a>'
				+'</li>'
				/*
				+'<li role="presentation">'
				+'<a id="sendVideo" role="menuitem" tabindex="-1" href="#" style="user-select:none;">'
				+'<span class="fa fa-camera"></span> 添加视频  '
				+'</a>'
				+'</li>'
				*/
				+'<li role="presentation">'
				+'<a id="createGroup" role="menuitem" tabindex="-1" href="#" style="user-select:none;">'
				+'<span class="fa fa-comments-o"></span> 新建群组  '
				+'</a>'
				+'</li>'
				+'</ul>'
				+'</div>'
				+'</div>'
				+'</div>'
				
				+groupListHtml
				
				+'<div style="clear:both;"></div>'
				
				+'</div>'
				+'</div>';
			divObj.html(html);
			return html;
		}
	};
}();