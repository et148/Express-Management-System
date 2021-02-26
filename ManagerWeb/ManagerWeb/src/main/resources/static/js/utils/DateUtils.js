var DateUtils = {
	getDateValues:function(date){
		return {
			"M+" : date.getMonth()+1, // 月份
			"d+" : date.getDate(), // 日
			"h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, // 小时
			"H+" : date.getHours(), // 小时
			"m+" : date.getMinutes(), // 分
			"s+" : date.getSeconds(), // 秒
			"q+" : Math.floor((date.getMonth()+3)/3), // 季度
			"S" : date.getMilliseconds() // 毫秒
		}
	},
	format : function(date,fmt) {
		var o = DateUtils.getDateValues(date);
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	},
	parse : function(dateStr) {
		return new Date(dateStr);
	},
	formatSeconds: function(value) {
		if(isNaN(value)){
			return {h:0,m:0,s:0};
		}
		var flag = value < 0 ? -1 : 1;
		value *= flag;
		var theTime = parseInt(value);// 秒
		var theTime1 = 0;// 分
		var theTime2 = 0;// 小时
		if(theTime >= 60) {
			theTime1 = parseInt(theTime/60);
			theTime = parseInt(theTime%60);
			if(theTime1 >= 60) {
				theTime2 = parseInt(theTime1/60);
				theTime1 = parseInt(theTime1%60);
			}
		}
		return {
			h : parseInt(theTime2) * flag,
			m : parseInt(theTime1),
			s : parseInt(theTime)
		};
	} 
};