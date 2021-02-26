var frame=frame||{};
var $=jQuery;
frame.Form = function() {
	var Form=function(params){
		var self=this;
		var _html=params.html;
		var _options=params.options;
		var _format=params.options.format||{};
		var _valueBeforeFormat={};
		var _setJsonObj=function(jsonObj,key,value){
			var pre=key.split(".");
			var parent=jsonObj;
			for(var i=0;i<pre.length-1;i++){
				parent[pre[i]]=parent[pre[i]]||{};
				parent=parent[pre[i]];
			}
			parent[pre[pre.length-1]]=value;
		}
		this.setSubmitEnabled=function(isEnabled){
			var formObj=$("#"+_options.formId);
			formObj.find("button[name='submit']").attr("disabled",!isEnabled);
		}
		this.setTitleText=function(text){
			var formObj=$("#"+_options.formId);
			formObj.parent().parent().find(".caption-subject").text(" "+text)
		}
		this.setSubTitleText=function(text){
			var formObj=$("#"+_options.formId);
			formObj.parent().parent().find(".caption-helper").text(" "+text)
		}
		this.setBoxColor=function(color){
			var formObj=$("#"+_options.formId);
			formObj.parent().parent().addClass(color);
		}
		this.getOptions=function(){
			return _options;
		}
		this.getHtml=function(){
			return _html;
		}
		this.initForm=function(obj){
			obj.html(_html);
			frame.Form.bindEvents(obj,_options);
			this.setData(_options.data);
			this.handleValidation(_options,this.submit);
			//obj.find('button[name="submit"]').on("click",this.submit)
			this.setFieldConfig(_options.fields);
		}
		this.setFieldConfig=function(fields) {
			if($.inputmask) {
				$.extend($.inputmask.defaults, {
					'autounmask': true
				});
				$("input[regex]").each(function() {
					$(this).inputmask('Regex', { regex:$(this).attr("regex")});
				});
			};
			for(var i = 0; i < fields.length; i++) {
				var field = fields[i];
				if(field.type == 'number') {
					$("._numberfield_"+field.id).spinner({
						max:field.max||999,
						value:field.value||0
					});
				} else if(field.type == 'selectTree') {
					this.initSelectTree(field);
				} else if(field.type == 'location'){
					$(".locationDu1").inputmask('Regex', { regex:"^(-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,5})?)|180(([.][0]{1,5})?)))$"});
					$(".locationDu2").inputmask('Regex', { regex:"^(-?((0|[1-8]?[0-9]?)(([.][0-9]{1,5})?)|90(([.][0]{1,5})?)))$"});
					$(".locationD1").inputmask('Regex', { regex:"^(-?((0|1?[0-7]?[0-9]?)|180))$"});
					$(".locationF1").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])$"});
					$(".locationM1").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])([.][0-9]{1,4})$"});
					$(".locationD2").inputmask('Regex', { regex:"^(-?((0|[1-8]?[0-9]?)|90))$"});
					$(".locationF2").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])$"});
					$(".locationM2").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])([.][0-9]{1,4})$"});
					var changeTodfm = function(du) {
						var str1 = du.split(".");
						var du1 = str1[0];
						var tp = "0."+str1[1]
						var tp = String(tp*60);		//这里进行了强制类型转换
						var str2 = tp.split(".");
						var fen =str2[0];
						tp = "0."+str2[1];
						tp = tp*60;
						var miao = tp;
						return {d:(isNaN(du1)?0:du1),f:(isNaN(fen)?0:fen),m:(isNaN(miao)?0:miao)};
					}
					var changeToDFM = function(btn) {
						var du1 = $(btn).parent().parent().find(".locationDu1").val();
						var ret1 = changeTodfm(du1);
						$(btn).parent().parent().find(".locationD1").val(ret1.d);
						$(btn).parent().parent().find(".locationF1").val(ret1.f);
						$(btn).parent().parent().find(".locationM1").val(ret1.m);
						var du2 = $(btn).parent().parent().find(".locationDu2").val();
						var ret2 = changeTodfm(du2);
						$(btn).parent().parent().find(".locationD2").val(ret2.d);
						$(btn).parent().parent().find(".locationF2").val(ret2.f);
						$(btn).parent().parent().find(".locationM2").val(ret2.m);
					}
					var changeTodu = function(d,f,m) {
						var f = parseFloat(f) + parseFloat(m/60);
						var du = parseFloat(f/60) + parseFloat(d);
						return isNaN(du)?0:du;
					}
					var changeToDu = function(btn) {
						var d1 = $(btn).parent().parent().find(".locationD1").val()||0;
						var f1 = $(btn).parent().parent().find(".locationF1").val()||0;
						var m1 = $(btn).parent().parent().find(".locationM1").val()||0;
						var ret1 = changeTodu(d1,f1,m1);
						$(btn).parent().parent().find(".locationDu1").val(ret1);
						
						var d2 = $(btn).parent().parent().find(".locationD2").val()||0;
						var f2 = $(btn).parent().parent().find(".locationF2").val()||0;
						var m2 = $(btn).parent().parent().find(".locationM2").val()||0;
						var ret2 = changeTodu(d2,f2,m2);
						$(btn).parent().parent().find(".locationDu2").val(ret2);
					}
					$(".locationBtn").click(function(e) {
						var display = $(this).parent().parent(".input-group").find(".du").css("display");
						var isDisplay = (display == 'none');
						$(this).parent().parent(".input-group").find(".du").css("display",isDisplay?'block':'none');
						$(this).parent().parent(".input-group").find(".dfm").css("display",isDisplay?'none':'block');
						isDisplay ? changeToDu(this) : changeToDFM(this);
					});
					$(".locationDu1,.locationDu2").change(function() {
						var du1 = $(this).parent().find(".locationDu1").val();
						var du2 = $(this).parent().find(".locationDu2").val();
						if(du1 != "" && du2 != "") {
							$(this).parent().parent().find("input[type=hidden]").val(du1+' '+du2);
						}
					});
					$(".locationD1,.locationF1,.locationM1,.locationD2,.locationF2,.locationM2").change(function(){
						var d1 = $(this).parent().find(".locationD1").val()||0;
						if(d1 == "180" || d1 == "-180"){
							$(this).parent().find(".locationF1").val(0);
							$(this).parent().find(".locationM1").val(0);
						}
						var f1 = $(this).parent().find(".locationF1").val()||0;
						var m1 = $(this).parent().find(".locationM1").val()||0;
						var du1 = changeTodu(d1,f1,m1);
						var d2 = $(this).parent().find(".locationD2").val()||0;
						if(d2 == "90" || d2 == "-90") {
							$(this).parent().find(".locationF2").val(0);
							$(this).parent().find(".locationM2").val(0);
						}
						var f2 = $(this).parent().find(".locationF2").val()||0;
						var m2 = $(this).parent().find(".locationM2").val()||0;
						var du2 = changeTodu(d2,f2,m2);
						if(du1 != "" && du2 != "") {
							$(this).parent().parent().find("input[type=hidden]").val(du1+' '+du2);
						}
					});
				} else if(field.type == 'datetime'){
					var val = $("input[name='"+field.id+"']").val();
					if(val) {
						$("input[name='"+field.id+"']").parent().find(".datetimeD").val(val.split(" ")[0]);
						$("input[name='"+field.id+"']").parent().find(".datetimeH").val(val.split(" ")[1].split(":")[0]);
						$("input[name='"+field.id+"']").parent().find(".datetimeM").val(val.split(" ")[1].split(":")[1]);
						$("input[name='"+field.id+"']").parent().find(".datetimeS").val(val.split(" ")[1].split(":")[2]);
					}
					$("input[name='"+field.id+"']").parent().find(".datetimeD").datepicker();
					$("input[name='"+field.id+"']").parent().find(".datetimeH").inputmask('Regex', { regex:"^((([0-9]|0?[1-9]?|1[0-9]|2[0-3])))$"});
					$("input[name='"+field.id+"']").parent().find(".datetimeM").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])$"});
					$("input[name='"+field.id+"']").parent().find(".datetimeS").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])([.][0-9]{1,4})$"});
					$("input[name='"+field.id+"']").parent().find(".datetimeD,.datetimeH,.datetimeM,.datetimeS").change(function() {
						var d = $(this).parent().find(".datetimeD").val()||'';
						var h = $(this).parent().find(".datetimeH").val()||0;
						var m = $(this).parent().find(".datetimeM").val()||0;
						var s = $(this).parent().find(".datetimeS").val()||0;
						$(this).parent().find("input[type=hidden]").val(d+' '+h+':'+m+':'+s).change();
					});
				} else if(field.type == 'relativeTime') {
					var changeTime = function(fieldName,baseTime,value) {
						if(baseTime) {
							var timeStr = DateUtils.format(new Date(new Date(baseTime).getTime() + parseInt(value||0) * 1000),"yyyy-MM-dd HH:mm:ss");
							$("input[name='"+fieldName+"']").parents(".row").find(".baseTimeD").val(timeStr.split(" ")[0]);
							$("input[name='"+fieldName+"']").parents(".row").find(".baseTimeH").val(timeStr.split(" ")[1].split(":")[0]);
							$("input[name='"+fieldName+"']").parents(".row").find(".baseTimeM").val(timeStr.split(" ")[1].split(":")[1]);
							$("input[name='"+fieldName+"']").parents(".row").find(".baseTimeS").val(timeStr.split(" ")[1].split(":")[2]);
						}
					}
					var changeRelativeTime = function(fieldName,value) {
						var ret = DateUtils.formatSeconds(value);
						$("input[name='"+fieldName+"']").parent().find(".relativeTimeH").val(ret.h);
						$("input[name='"+fieldName+"']").parent().find(".relativeTimeM").val(ret.m);
						$("input[name='"+fieldName+"']").parent().find(".relativeTimeS").val(ret.s);
					}
					
					// 添加校验
					$("input[name='"+field.id+"']").parent().find(".relativeTimeH").inputmask('Regex', { regex:"^(-?\\d{0,9})$"});
					$("input[name='"+field.id+"']").parent().find(".relativeTimeM").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])$"});
					$("input[name='"+field.id+"']").parent().find(".relativeTimeS").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])([.][0-9]{1,4})$"});
					$("input[name='"+field.id+"']").parents(".row").find(".baseTimeD").datepicker();
					$("input[name='"+field.id+"']").parents(".row").find(".baseTimeH").inputmask('Regex', { regex:"^((([0-9]|0?[1-9]?|1[0-9]|2[0-3])))$"});
					$("input[name='"+field.id+"']").parents(".row").find(".baseTimeM").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])$"});
					$("input[name='"+field.id+"']").parents(".row").find(".baseTimeS").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])([.][0-9]{1,4})$"});

					// 显示初始化值
					var relativeValue = parseInt(field.value);
					changeRelativeTime(field.id,relativeValue);
					var baseTime = $("input[name='"+field.id+"']").parents(".row").find(".baseTime").val();
					changeTime(field.id,baseTime,field.value);
					// 修改事件
					$("input[name='"+field.id+"']").parent().find(".relativeTimeH,.relativeTimeM,.relativeTimeS").change(function() {
						// 设置组件值
						var h = $(this).parent().find(".relativeTimeH").val();
						var m = $(this).parent().find(".relativeTimeM").val();
						var s = $(this).parent().find(".relativeTimeS").val();
						var flag = parseInt(h) < 0 ? -1 : 1;
						var result = flag * (parseInt(h) * flag * 3600 + parseInt(m) * 60 + parseInt(s));
						$(this).parent().find("input[type=hidden]").val(result);
						
						var fieldName = $(this).parent().find("input[type=hidden]").attr("name");
						// 修改绝对时间的值
						changeTime(fieldName,baseTime,result);
					});
					
					// 绝对时间修改
					$("input[name='"+field.id+"']").parents(".row").find(".baseTimeD,.baseTimeH,.baseTimeM,.baseTimeS").change(function() {
						var d = $(this).parent().find(".baseTimeD").val()||0;
						var h = $(this).parent().find(".baseTimeH").val()||0;
						var m = $(this).parent().find(".baseTimeM").val()||0;
						var s = $(this).parent().find(".baseTimeS").val()||0;
						
						var dateStr = d + ' ' + h + ':' + m + ':' + s;
						var date = new Date(dateStr);
						var baseDate = new Date(baseTime);
						var v = (date - baseDate) / 1000;
						var fieldName = $(this).parent().find("input[type=hidden]").attr("tid");
						changeRelativeTime(fieldName,v);
					});
				} else if(field.type == 'durationTime') {
					/*
					 * 添加验证
					 */
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeD").inputmask('Regex', { regex:"^\\d+[.]\\d+$"});
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeH").inputmask('Regex', { regex:"^[0-9]+$"});
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeM").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])$"});
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeS").inputmask('Regex', { regex:"^([0-9]|[0-5][0-9])([.][0-9]{1,4})$"});
				
					/*
					 * 初始化
					 */
					var val = $("input[name='"+field.id+"']").val();
					// 天
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeD").val(val / 86400);
					// 时分秒
					var ret = DateUtils.formatSeconds(val);
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeH").val(ret.h);
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeM").val(ret.m);
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeS").val(ret.s);
					
					/*
					 * 修改值
					 */
					$("input[name='"+field.id+"']").parents(".row").find(".durationTimeD").change(function(){
						$(this).parents(".row").find("input[type=hidden]").val($(this).val()*86400);
						var ret = DateUtils.formatSeconds($(this).val()*86400);
						$(this).parents(".row").find(".durationTimeH").val(ret.h);
						$(this).parents(".row").find(".durationTimeM").val(ret.m);
						$(this).parents(".row").find(".durationTimeS").val(ret.s);
					});
					$("input[name='"+field.id+"']").parent().find(".durationTimeH,.durationTimeM,.durationTimeS").change(function(){
						var h = $(this).parent().find(".durationTimeH").val()||0;
						var m = $(this).parent().find(".durationTimeM").val()||0;
						var s = $(this).parent().find(".durationTimeS").val()||0;
						$(this).parents(".row").find("input[type=hidden]").val(parseInt(h)*3600 + parseInt(m) *60 + parseInt(s));
						$(this).parents(".row").find(".durationTimeD").val((parseInt(h)*3600 + parseInt(m) *60 + parseInt(s))/86400);
					});
				}
			}
		}
		this.initSelectTree=function(field) {
			function dataFilter(treeId, parentNode, childNodes) {
				if(parentNode && (childNodes.jsonData==null || (childNodes.jsonData && childNodes.jsonData.length==0))){
					return
				};
				setChildrenAttr(childNodes.jsonData);
				return childNodes.jsonData;
			};
			
			//设置子节点的open属性
			function setChildrenAttr(data) {
				if(data){
					for (var index in data) {
						data[index].open = true;
						setChildrenAttr(data[index].children);//递归
					}
				}
			};
			
			var baseTree = new $.BaseTree();
			var rootId = field.id+"TreeContainer";
			var setting = {
				forceable: true,//true强制结合默认值，false自定义,
				async: {
					enable: true,
					otherParam: field.treeConfig.otherParams,
					type: "post",
					dataType: 'json',
					url: field.treeConfig.url,
					dataFilter: dataFilter
				},
				callback: {
					onClick:function(event, treeId, treeNode) {
						$("input[name="+field.id+"]").val(field.valueField ? eval("treeNode."+field.valueField) : treeNode.id);
						$("input[name="+field.id+"Name]").val(treeNode.name);
						$("#"+field.id+"MenuContent").fadeOut("fast");
					}
				}
			};
			
			/*
			 * 用户设置
			 * */
			var customSetting = {
				containerId:field.id+'TreeContainer'
			};
			
			baseTree.initTree(rootId, setting, null, customSetting);
			$("input[name='"+field.id+"Name']").on("click",function(e) {
				if($("#"+field.id+"MenuContent").css("display") != "none"){
					$("#"+field.id+"MenuContent").fadeOut("fast");
					return;
				}
				var obj = $(this).parent();
				$("#"+field.id+"MenuContent").css({width:obj.width(),"z-index":10,height:"250px",overflow:"auto"}).slideDown("fast").position({
					my: "center",
					at: "bottom",
					of: $(this)
				});
			});
		}
		this.getForm=function(){
			return $("#"+_options.formId);
		}
		this.setData=function(data){
			if(data){
				var formObj=$("#"+_options.formId);
				var setValue=function(key,value){
					if(_format[key]){
						_valueBeforeFormat[key]=value;
						value=_format[key](value);
					}
					formObj.find("input[name='"+key+"'][value='"+value+"']").click();
					formObj.find("input[name='"+key+"'][type=text]").val(value);
					formObj.find("input[name='"+key+"'][type=hidden]").val(value);
					formObj.find("select[name='"+key+"']").val(value);
					formObj.find("textarea[name='"+key+"']").val(value);
					formObj.find("img[name='"+key+"-img']").attr('src',value); 
				}
				var setHelper=function(key,value){
					if(value instanceof Object){
						var k=(key+".");
						for(var i in value){
							setHelper(k+i,value[i]);
						}
					}else{
						setValue(key,value);
					}
				};
				for(var i in data){
					setHelper(i,data[i]);
				}
			}
		}
		this.serialize=function(formObj){
			//对于有format函数的值需要还原format前的值
			var jsn={};
			var arr=formObj.serializeArray();
			for(var i in arr){
				var key=arr[i].name;
				var value=_valueBeforeFormat[key]||arr[i].value;
				jsn[key]=value;
			}
			//此外还有额外传入的提交需要用到的参数页一并加入
			for(var key in _options.submitParams){
				jsn[key]=_options.submitParams[key];
			}
			return jsn;
		}
		this.submit=function(){
			if(_options.submitUrl){
				var form=self.getForm();
				var formFileds=self.serialize(form);
				var formData = new FormData(form[0]);
				for(var i in formFileds){
					formData.delete(i);
					formData.append(i,formFileds[i]);
				}
				form.find("audio").each(function(index,obj){
					var file=$(obj).data("blob");
					if(file){
						var fileName=$(obj).attr("name")+"-file";
						formData.append(fileName,file);
					}
				});
				$.ajax({
					url: _options.submitUrl,
					type: 'POST',  
					data: formData,  
					cache: false,  
					contentType: false,  
					processData: false,  
					success: function (msg) {
						if(_options.showMsg == false && _options.submitCallback) {
							_options.submitCallback(msg,formFileds);
							return;
						}
						if(msg){
							if(msg.isOk==true){
								frame.Modal.init({type:'info',text:"操作成功"}).show();
								_options.submitCallback(msg,formFileds);
							}else{
								frame.Modal.init({type:'error',text:msg.message}).show();
							}
						}else{
							frame.Modal.init({type:'error',text:"系统错误"}).show();
						}
					} 
				})
			}
		}
		this.dispose=function(){
			var formObj=$("#"+_options.formId);
			formObj.remove();
			self=null;
		};

		this.getRules = function (fields) {
			var rules = {};
			for(var m in fields){
				var field = fields[m];
				var type = field.type;
				var id = field.id;
				if(type!=='hidden'){
					rules[id] = {required:false,maxlength:100,minlength:1,email:false,number:false,digits:false,creditcard:false};//默认
					for(var n in rules[id]){
						if(field.hasOwnProperty(n)){
							rules[id][n] = field[n];
						}
					}
				}
			}
			return rules;
		};

		this.handleValidation = function (options,callback) {
			var form = $('#'+options.formId);
			var error = $('.alert-danger', form);
			var success = $('.alert-success', form);

			form.validate({
				errorElement: 'span', //default input error message container
				errorClass: 'help-block help-block-error', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				ignore: "",  // validate all fields including form hidden input
				rules: this.getRules(options.fields),
				invalidHandler: function (event, validator) { //display error alert on form submit
					success.hide();
					error.show();
					Metronic.scrollTo(error, -200);
				},

				errorPlacement: function (error, element) { // render error placement for each input type
					var icon = $(element).parent('.input-icon').children('i');
					icon.removeClass('fa-check').addClass("fa-warning");
					icon.attr("data-original-title", error.text()).tooltip({'container': '#'+options.formId});
				},

				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.msg').removeClass("has-success").addClass('has-error'); // set error class to the control group
				},

				unhighlight: function (element) { // revert the change done by hightlight

				},

				success: function (label, element) {
					var icon = $(element).parent('.input-icon').children('i');
					$(element).closest('.msg').removeClass('has-error').addClass('has-success'); // set success class to the control group
					icon.removeClass("fa-warning").addClass("fa-check");
				},

				submitHandler: function (form) {
					success.show();
					error.hide();
					callback();
				}
			});
		}
	};
	return {
		init: function(options){
			options=options||{};
			return frame.Form.initForm(options);
		},
		initForm: function(options){
			if(!$){
				return;
			}
			options.fields=options.fields||[];
			var autoFormId="form-id-"+(frame.UUID());
			options.formId=options.formId||autoFormId;
			var formHtml=this.setContent(options);
			var formObj= new Form({html:formHtml,options:options});
			return formObj;
		},
		setContent: function(options){
			var portletClass="portlet box "+(options.color||"blue");
			if(options.type!="box"){
				portletClass="portlet light";
			}
			var html=''
			+'<div class="'+portletClass+'" style="padding:5px;margin:0"><!--light bg-inverse, box blue-->';
			if(options.hasTitle!=false) {
				html+=this.getTitle(options);
			}
			html+='<div class="portlet-body form">'
			+'<form id="'+options.formId+'" action="#" class="horizontal-form">'
			+'<div class="form-body">'+this.getValidateInfo(options)
			+this.getFields(options.fields,options.groups,options)
			+'</div>'
			+this.getButtons(options)
			+'</form>'
			+'</div>'
			+'</div>';
			if(options.id){
				$("#"+options.id).html(html);
				bindEvents($("#"+options.id),options);
			}
			return html;
		},
		bindEvents:function(obj,options){
			//录制工具，如果要使用录音功能，需要传入录制工具
			var recorder=options.recorder;
			if(recorder){
				var isRecording=false;
				//按下按钮开始录制
				obj.on("mousedown",".field-audio-record",function(e){
					isRecording=true;
					if(recorder){
						recorder.clear();
						recorder.record();
					}
				});
				//移开按钮取消录制
				obj.on("mouseleave",".field-audio-record",function(e){
					if(isRecording==true){
						isRecording=false;
						recorder && recorder.clear();
					}
				});
				//松开按钮完成录制
				obj.on("mouseup",".field-audio-record",function(e){
					if(isRecording==true){
						isRecording=false;
						if(recorder){
							var me=$(this);
							recorder.stop();
							recorder.exportWAV(function(blob) {
								var url = URL.createObjectURL(blob);
								me.parent().find("audio").data("blob",blob);
								me.parent().find("audio").attr("src",url);
							});
							recorder.clear();
						}
					}
				});
			}
			//音频播放
			obj.on("click",".field-audio-play",function(e){
				var me=$(this);
				var audioObj=me.find("audio")[0];
				if(audioObj.paused){
					audioObj.play();
				}else{
					audioObj.pause();
				}
			});
			//图片预览开关
			obj.on("click",".field-image-toggle",function(){
				if($(this).parent().parent().next().css('display')!='none') {
					$(this).parent().parent().next().css('display','none');
				}else{
					$(this).parent().parent().next().css('display','block');
				}
			});
			//图片选定设置
			obj.on("change",".field-image-select",function(e){
				var file = e.target.files[0];
				if(!file) return;
				var next=$(e.target).next();
				next.val(file.name);
				var reader = new FileReader();
				//读取文件过程方法
				reader.onload = function (e) {
					var img = obj.find("#imagePreview").find("img")[0];
					img.src = e.target.result;
				}
				reader.readAsDataURL(file)
			});
			//初始化颜色选择器
			this.initColorPicker(obj);
		},
		getTitle:function(options){
			var titleHtml=''
			+'<div class="portlet-title" style="min-height:0;margin:0;">'
			+'<div class="caption">'
			+'<i class="'+(options.titleIcon||"icon-equalizer")+'"></i>'
			+'<span class="caption-subject uppercase">'+(options.titleText||"标题")+'</span>'
			+'<span class="caption-helper"> '+(options.subTitleText||"副标题")+'</span>'
			+'</div>'
			+'</div>';
			return titleHtml;
		},
		getFields:function(fields,groups,options){
			var fieldsHtml=''
			var parentdiv=$('<div></div>');
			if(groups){
				for(var i in groups){
					parentdiv.append('<h3 id="field-group-'+groups[i].id+(groups[i].text?'" class="form-section">':'>')+groups[i].text+'</h3>')
					parentdiv.append('<div class="row"></div>');
					var colIndex=0;
					for(var j in fields){
						fields[j].col=fields[j].col||12;
						var cols = fields[j].col + (fields[j].lcol||0);
						if(fields[j].group==groups[i].id){
							if(cols+colIndex>12){
								parentdiv.append('<div class="row"></div>');
								colIndex=cols;
							}else{
								colIndex+=cols;
							}
							parentdiv.children(".row:last").append(this.getField(fields[j]));
						}
					}
				}
			}else{
				parentdiv.append('<div class="row"></div>');
				var colIndex=0;
				for(var j in fields){
					fields[j].col=fields[j].col||12;
					var cols = fields[j].col + (fields[j].lcol||0);
					if(cols+colIndex>12){
						parentdiv.append('<div class="row"></div>');
						colIndex=cols;
					}else{
						colIndex+=cols;
					}
					parentdiv.children(".row:last").append(this.getField(fields[j]));
				}
			}
			fieldsHtml=parentdiv.html();
			return fieldsHtml;
		},
		getField:function(field){
			var fieldHtml='';
			switch(field.type){
				case 'drop':{
					fieldHtml= this.getFieldDrop(field);
					break;
				}
				case 'radio':{
					fieldHtml= this.getFieldRadio(field);
					break;
				}
				case 'area':{
					fieldHtml= this.getFieldArea(field);
					break;
				}
				case 'colorPicker':{
					fieldHtml= this.getFieldColorPicker(field);
					break;
				}
				case 'image':{
					fieldHtml= this.getFieldImage(field);
					break;
				}
				case 'file':{
					fieldHtml= this.getFieldFile(field);
					break;
				}
				case 'hidden':{
					fieldHtml= this.getFieldHidden(field);
					break;
				}
				case 'number':{
					fieldHtml= this.getFieldNumber(field);
					break;
				}
				case 'selectTree':{
					fieldHtml= this.getFieldSelectTree(field);
					break;
				}
				case 'textBtn' : {
					fieldHtml= this.getFieldTextBtn(field);
					break;
				}
				case 'location' : {
					fieldHtml= this.getFieldLocation(field);
					break;
				}
				case 'datetime' : {
					fieldHtml= this.getFieldDataTime(field);
					break;
				}
				case 'relativeTime' : {
					fieldHtml= this.getFieldRelativeTime(field);
					break;
				}
				case 'durationTime' : {
					fieldHtml= this.getFieldDurationTime(field);
					break;
				}
				case 'display' : {
					fieldHtml= this.getFieldDisplay(field);
					break;
				}
				case 'button' : {
					fieldHtml= this.getFieldButton(field);
					break;
				}
				case 'audio' :{
					fieldHtml= this.getFieldAudio(field);
					break;
				}
				default:{
					fieldHtml= this.getFieldText(field);
				}
			}
			return fieldHtml;
		},
		getFieldLabel:function(field) {
			return ''
			+'<label class="'+(field.required ?"control-label":"")+' '+ (field.lcol?('col-md-'+field.lcol):'') +'">'
				+field.label+' '+(field.required ? '<span class="required" aria-required="true">*</span>':'')
			+'</label>';
		},
		getFieldButton:function(field){
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+'<label class="'+(field.required ?"control-label":"")+' '+ (field.lcol?('col-md-'+field.lcol):'') +'">'
			+'</label>'
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div '+(field.icon?'class="input-icon")':'')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<button name="'+field.id+'" type="button" class="btn '+(field.btnCls||'')+'">'+field.label+'</button>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldDisplay:function(field) {
			return ''
			+'<div class="msg">'
				+'<div class="col-md-'+field.col+'">'
					+'<div '+(field.icon?'class="input-icon")':'')+'>'
					+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
					+'</div>'
					+'<label class="control-label">'+field.value+'</label>'
				+'</div>'
			+'</div>';
		},
		getFieldAudio:function(field) {
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div class="progress field-audio-play" style="cursor:pointer;margin-top:5px;width:calc(100% - 100px);float:left;"><div class="progress-bar progress-bar-danger" style="width: 100%"><i class="fa fa-volume-up"></i><span>'+(field.playText||"")+'</span></div><audio name="'+field.id+'" src="'+field.value+'"></audio></div>'
			+'<button type="button" style="float:right;" class="btn btn-sm '+(field.color||"default")+' field-audio-record"><i class="fa fa-volume-up"></i> '+(field.recordText||"录制")+'</button>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},

		getFieldDurationTime:function(field) {
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div '+(field.icon?'class="input-icon")':'')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<div class="input-group">'
				+'<input type="hidden" name="'+field.id+'" class="durationTime" value="'+(field.value||'')+'"/>'
				+'<div class="sfm">'
					+'<input type="text" class="form-control durationTimeH" value=0 style="float:left;width:50px"/><span style="float:left;font-size:14px;padding:5px">时</span>'
					+'<input type="text" class="form-control durationTimeM" value=0 style="float:left;width:50px"/><span style="float:left;font-size:14px;padding:5px">分</span>'
					+'<input type="text" class="form-control durationTimeS" value=0 style="float:left;width:50px"/><span style="float:left;font-size:14px;padding:5px">秒</span>'
				+'</div>'
			+'</div>'
			+'<span class="help-block">'
			+'</span>'
			+'<div>'
				+'<input type="text" class="form-control durationTimeD" value=0 style="float:left;width:200px"/><span style="float:left;font-size:14px;padding:5px">日</span>'
			+'</div>'
			+'<span class="help-block" style="margin-top:45px">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>'
			+'</div>';
		},
		getFieldRelativeTime:function(field) {
			var html = '';
			html+=(field.horizontal?'':'<div class="col-md-'+field.col+'">');
			html+=(field.horizontal?'<div class="msg">':'<div class="form-group">');
			html+=this.getFieldLabel(field);
			html+=(field.horizontal?'<div class="col-md-'+field.col+'">':'');
			html+='<div '+(field.icon?'class="input-icon")':'')+'>';
			html+=(field.icon?'<i class="fa '+field.icon+'"></i>':'');
			html+='<div class="input-group">';
				html+='<input type="hidden" name="'+field.id+'" value="'+(field.value||'')+'"/>';
				html+='<input type="text" '+((field.readOnly&&field.readOnly=='true')?'readOnly':'')+' class="form-control relativeTimeH" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">时</span>';
				html+='<input type="text" '+((field.readOnly&&field.readOnly=='true')?'readOnly':'')+' class="form-control relativeTimeM" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">分</span>';
				html+='<input type="text" '+((field.readOnly&&field.readOnly=='true')?'readOnly':'')+' class="form-control relativeTimeS" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">秒</span>';
			html+='</div>';
			html+='<span class="help-block">';
			html+=(field.helpText||"");
			html+='</span>';
			html+='</div>';
			html+='</div>';
			html+='</div>';
			if(!field.onlyRelativeTime) {
				html+=(field.horizontal?'':'<div class="col-md-'+field.col+'">');
				html+=(field.horizontal?'<div class="msg">':'<div class="form-group">');
				html+='<label class="' + (field.lcol?('col-md-'+field.lcol):'') +'">';
				html+='绝对时间';
				html+='</label>';
				html+=(field.horizontal?'<div class="col-md-'+field.col+'">':'');
				html+='<div '+(field.icon?'class="input-icon")':'')+'>';
				html+=(field.icon?'<i class="fa '+field.icon+'"></i>':'');
				html+='<div class="input-group">';
					html+='<input type="hidden" tid="'+field.id+'" class="baseTime" value="'+(field.baseTime||'')+'"/>';
					html+='<input type="text" placeholder="日期" data-date-language="zh-CN" readOnly data-date-format="yyyy-mm-dd" style="float:left;width:40%" class="form-control form-control-inline date-picker baseTimeD"></input>';
					html+='<input type="text" class="form-control baseTimeH" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">时</span>';
					html+='<input type="text" class="form-control baseTimeM" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">分</span>';
					html+='<input type="text" class="form-control baseTimeS" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">秒</span>';
				html+='</div>';
				html+='<span class="help-block">';
				html+=(field.helpText||"");
				html+='</span>';
				html+='</div>';
				html+='</div>';
				html+='</div>';
			}
			return html;
		},
		getFieldDataTime:function(field){
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div '+(field.icon?'class="input-icon")':'')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<div class="input-group">'
				+'<input type="hidden" name="'+field.id+'" value="'+(field.value||'')+'"/>'
				+'<input type="text" placeholder="日期" data-date-language="zh-CN" readOnly data-date-format="yyyy-mm-dd" style="float:left;width:40%" class="form-control form-control-inline date-picker datetimeD"></input>'
				+'<input type="text" class="form-control datetimeH" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">时</span>'
				+'<input type="text" class="form-control datetimeM" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">分</span>'
				+'<input type="text" class="form-control datetimeS" style="float:left;width:14%"/><span style="float:left;font-size:14px;padding:5px">秒</span>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>'
			+'</div>';
		},
		getFieldLocation:function(field){
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div '+(field.icon?'class="input-icon")':'')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<div class="input-group">'
				+'<input type="hidden" name="'+field.id+'" value="'+(field.value||'')+'"/>'
				+'<div class="du">'
					+'<input type="text" class="form-control locationDu1" style="float:left;width:45%" value="'+(field.value?field.value.split(" ")[0]:'')+'"/>'
					+'<div style="float:left;width:5%">&nbsp</div>'
					+'<input type="text" class="form-control locationDu2" style="float:left;width:45%" value="'+(field.value?field.value.split(" ")[1]:'')+'"/>'
				+'</div>'
				+'<div class="dfm" style="display:none">'
					+'<input type="text" class="form-control locationD1" style="float:left;width:14%"/><span style="float:left;font-size:20px">°</span>'
					+'<input type="text" class="form-control locationF1" style="float:left;width:14%"/><span style="float:left;font-size:20px">\'</span>'
					+'<input type="text" class="form-control locationM1" style="float:left;width:14%"/><span style="float:left;font-size:20px">\"</span>'
					+'<div style="float:left;width:5%">&nbsp</div>'
					+'<input type="text" class="form-control locationD2" style="float:left;width:14%"/><span style="float:left;font-size:20px">°</span>'
					+'<input type="text" class="form-control locationF2" style="float:left;width:14%"/><span style="float:left;font-size:20px">\'</span>'
					+'<input type="text" class="form-control locationM2" style="float:left;width:14%"/><span style="float:left;font-size:20px">\"</span>'
				+'</div>'
				+'<span class="input-group-btn">'
				+'<button class="locationBtn btn btn-icon-only btn-circle grey-cascade" type="button"><i class="fa fa-exchange"/></button>'
				+'</span>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>'
			+'</div>';
		},
		getFieldSelectTree:function(field) {
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div class="input-icon right">'
			+'<i class="fa"></i>'
			+'<div>'
				+'<input type="hidden" name="'+field.id+'"' +'value='+(field.value||"")+'>'
				+'<input type="text" name="'+field.id+'Name" value="'+(field.value||"")+'" class="form-control" placeholder="'+(field.tipText||"")+'" readonly>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'<div id="'+field.id+'MenuContent" class="menuContent" style="display:none; position: absolute;background-color: white;">'
			+'<ul id="'+field.id+'TreeContainer" class="ztree" style="margin-top:0; width:160px;"></ul>'
			+'</div>';
		},
		getFieldNumber:function(field) {
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div '+(field.icon?'class="input-icon")':'')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<div class="_numberfield_'+field.id+'">'
				+'<div class="input-group">'
					+'<input type="text" name="'+field.id+'" class="spinner-input form-control">'
					+'<div class="spinner-buttons input-group-btn btn-group-vertical">'
						+'<button type="button" class="btn spinner-up btn-xs blue">'
						+'<i class="fa fa-angle-up"></i>'
						+'</button>'
						+'<button type="button" class="btn spinner-down btn-xs blue">'
						+'<i class="fa fa-angle-down"></i>'
						+'</button>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldTextBtn:function(field){
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div class="input-group">'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<input type="text" name="'+field.id+'" class="form-control" '+(field.regex?('regex='+field.regex):'')
				+' placeholder="'+(field.tipText||"")+'" '
				+(field.disabled==true?" disabled ":"")
				+(field.readOnly==true?" readOnly ":"")
				+'value='+(field.value||"")
				+'>'
				+'<span class="input-group-btn">'
				+'<button class="btn blue '+(field.btnCls?field.btnCls:'')+'" type="button"><i class="'+(field.btnIcon?field.btnIcon:'')+'"/></button>'
				+'</span>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldText:function(field){
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div '+(field.icon?'class="input-icon")':'')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<input type="text" name="'+field.id+'" class="form-control" '+(field.regex?('regex='+field.regex):'')
				+' placeholder="'+(field.tipText||"")+'" '
				+(field.readOnly==true?" readOnly ":"")
				+'value='+(field.value||"")
				+'>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldHidden:function(field){
			return ''
			+'<div class="col-md-'+field.col+'">'
			+'<input type="hidden" name="'+field.id+'" class="form-control" value="'+(field.value||"")+'" placeholder="'+(field.tipText||"")+'">'
			+'</div>';
		},
		getFieldDrop:function(field){
			var dropItemHtml='';
			for(var i in field.items){
				field.items[i].value == field.value?dropItemHtml+='<option value="'+field.items[i].value+'" selected>'+field.items[i].text+'</option>':
					dropItemHtml+='<option value="'+field.items[i].value+'">'+field.items[i].text+'</option>'
			}

			//同步加载
			if(field.url){
				$.ajax({
					type: "POST",
					url: field.url,
					data: {},
					async: false,
					success: function(response){
						if(response && response.isOk){
							dropItemHtml='';
							var data = JSON.parse(response.jsonData);
							for(var m in data){
								data[m].value == field.value?dropItemHtml+="<option data='"+(data[m].data||'')+"' value='"+data[m].value+"' selected>"+data[m].text+"</option>":
									dropItemHtml+="<option data='"+(data[m].data||'')+"' value='"+data[m].value+"'>"+data[m].text+"</option>"
							}
						}
					}
				});
			}

			return ""
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div>':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div '+(field.icon?'class="input-icon")':'')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<select name="'+field.id+'" class="form-control">'
			+dropItemHtml
			+'</select>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldRadio:function(field){
			var radioItemHtml=''
			for(var i in field.items){
				radioItemHtml+=(''
				+'<label>'
				+'<input type="radio" name="'+field.id+'" value="'+field.items[i].value+'" class="icheck" '+((''+field.items[i].value)==(''+field.value)?'checked':'')+'> '+field.items[i].text
				+'</label>');
			}
			return ""
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div>':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div class="input-group">'
			+'<div class="icheck-inline">'
			+radioItemHtml
			+'</div>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldArea:function(field){
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div>':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<textarea style="resize:none" '+(field.readOnly==true?" readOnly ":"")+' name="'+field.id+'" rows='+(field.rows||3)+' class="form-control" placeholder="'+(field.tipText||"")+'" >'+(field.value||"")+'</textarea>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldColorPicker:function(field){
			//return '<div class="input-group color colorpicker-default" data-color="#3865a8" data-color-format="rgba"><input type="text" class="form-control" value="#3865a8" readonly><span class="input-group-btn"><button class="btn default" type="button"><i style="background-color: #3865a8;"></i>&nbsp;</button></span></div>'
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div data-color="transparent" data-color-format="rgba" '+(field.icon?'class="input-icon input-group color colorpicker-default")':'class="input-group color colorpicker-default"')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<input type="hidden" class="colorFieldValue" value="'+field.value+'" name="'+field.id+'" '+(field.regex?('regex='+field.regex):'')+' placeholder="'+(field.tipText||"")+'">'
			+'<div class="colorFieldDisplay form-control" style="background-color:'+field.value+'" class="form-control"></div>'
			+'<span class="input-group-btn">'
			+'<button class="btn default" type="button"><i style="background-color: transparent;"></i>&nbsp;</button>'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldImage:function(field){
			
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div style="position:relative;overflow:hidden;"'+(field.icon?'class="input-icon input-group")':'class="input-group"')+'>'
			+(field.icon?'<i class="fa '+field.icon+'"></i>':'')
			+'<span class="form-control">'
			+'<input style="outline:none;opacity:0;z-index:999;" accept="image/*" type="file" " name="'+field.id+'-file" value="" class="field-image-select form-control" '+(field.regex?('regex='+field.regex):'')+'">'
			+'<input style="position:absolute;top:1px;left:0px;border:none;height:30px" type="text" name="'+field.id+'" value="'+(field.value||"")+'" class="form-control" '+(field.regex?('regex='+field.regex):'')+'">'
			+'</span>'
			+'<span class="input-group-btn">'
			+'<a class="btn default field-image-toggle"><i class ="icon-eye" style="background-color: transparent;"></i>&nbsp;</a>'
			+'</span>'
			+'</div>'
			
			+'<span style="display:'+(field.value==null?'none':'block')+'" id="imagePreview" class="help-block">'
			+'<img name="'+field.id+'-img" style="max-width:100%;" src="'+(field.value==null?'':field.value)+'" />'
			+'</span>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getFieldFile:function(field){
			return ''
			+(field.horizontal?'':'<div class="col-md-'+field.col+'">')
			+(field.horizontal?'<div class="msg">':'<div class="form-group">')
			+this.getFieldLabel(field)
			+(field.horizontal?'<div class="col-md-'+field.col+'">':'')
			+'<div class="input-icon right">'
			+'<i class="fa"></i>'
			+'<input type="file" name="'+field.id+'">'
			+'</div>'
			+'<span class="help-block">'
			+(field.helpText||"")
			+'</span>'
			+'</div>'
			+'</div>';
		},
		getButtons:function(options){
			var hasOk=options.hasOk;
			var hasCancel=options.hasCancel;
			var okButton;
			var cancelButton;
			if(hasOk!=false){
				okButton='<button name="submit" type="submit" class="btn btn-sm '+(options.color||"blue")+'"><i class="fa fa-check"></i> '+(options.okText||"提交")+'</button>';
			}
			if(hasCancel!=false){
				cancelButton='<button name="cancel" type="button" data-dismiss="modal" class="btn btn-sm default"><i class="fa fa-power-off"></i> '+(options.cancelText||"取消")+'</button>';
			}
			var buttonsHtml=''
			+'<div class="form-actions right" style="padding:2px;">'
			+(okButton||'')
			+(cancelButton||'')
			+'</div>';
			if(!okButton && !cancelButton){
				return '';
			}else{
				return buttonsHtml;
			}
		},
		getValidateInfo:function (options) {
			if(options.hasValidateInfo!=false){
				return '<div class="alert alert-danger display-hide">'+
					'<button class="close" data-close="alert"></button>'+
					'表单验证不通过.'+
					'</div>'+
					'<div class="alert alert-success display-hide">'+
					'<button class="close" data-close="alert"></button>'+
					'表单验证成功!'+
					'</div>'
			}else{
				return '';
			}
		},
		initColorPicker:function(obj){
			obj.find('.colorpicker-default').each(function(){
				var o=$(this);
				o.colorpicker({
					format: 'hex'
				}).on("changeColor",function(ev) {
					o.find(".colorFieldDisplay").css("background-color",ev.color.toHex());
				});
				o.find("button i").css("background-color",o.find("input").val()||"tansparent");
			})
		},
		loadData:function(editFormObj,url,data,callback){
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(ret){
					editFormObj.setData(ret);
					if(callback) callback(ret);
				}
			});
		}
	};
}();