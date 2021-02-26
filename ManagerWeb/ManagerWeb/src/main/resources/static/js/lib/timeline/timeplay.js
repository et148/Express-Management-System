var Timeplay = function (options) {
    var timePlay = this;
    timePlay.default_option = {
        speed: 1000,
        datetimes: [],
        container: '#timePlay',
        pageControl: true,
        stepUnit : '秒',
        stepInit:20,
        onClickChangeEnd: function (timePlay) {

        },
        onAnimateEnd: function (timePlay) {

        }
    };

    timePlay.options = jQuery.extend(true, timePlay.default_option, options);// 基本配置

    timePlay.initDoms();// 初始化结构

    timePlay.size = $('.timeProgress-inner li').outerWidth();    // 每格长度

    timePlay.cur_time_index = 0;    // 时间索引
    timePlay.hover_time_index = 0;  // 临时索引

    timePlay.timer = null;          // 动画定时器
    timePlay.offset = 0;            // 时间轴总位移(时间轴被隐藏起来的长度)
    timePlay.cur_time_pixel = 0;    // 当前时间对应的轴的长度
    timePlay.hover_time_pixel = 0;  // 临时记录距离时间轴最左端的距离
    timePlay.step = 20;

    // timeProgress-box: 当前页面的时间轴
    // offset: timeProgress-box在浏览器页面中的位置
    timePlay.left = $(".timeProgress-box").offset().left;   // 时间轴距离浏览器左边的距离(定长)
    timePlay.right = $(window).width() - timePlay.left - $(".timeProgress-box").width();    // //时间轴距离浏览器右侧的距离

    timePlay.init();// 初始化
};

Timeplay.prototype.init = function () {
    var timePlay = this;
    timePlay.initDate();// 初始化日期

    // 播放暂停
    $('.timeControl').on('click', function () {
        timePlay.play();
    });

    // 鼠标悬浮
    $('.timeProgress').on('mouseover', function () {
        timePlay.hoverPopup();
    });

    // 鼠标单击
    $('.timeProgress').on('click', function () {
        timePlay.clickPopup();
    });

    // 显示下一页的时间轴
    $(".timeProgress-next").on('click', function () {
        timePlay.pageNext();
    });

    // 显示上一页的时间轴
    $(".timeProgress-prev").on('click', function () {
        timePlay.pagePrev();
    });
};


// 鼠标悬浮显示提示信息
Timeplay.prototype.hoverPopup = function () {
    var timePlay = this;
    $(window).on('mousemove', function (event) {
        var e = event || window.event;
        var x = e.clientX;  // 鼠标悬浮位置距离浏览器左侧的位置

        timePlay.hover_time_pixel = x + timePlay.offset - timePlay.left;  // 距离时间轴最左侧的偏移量
        timePlay.hover_time_index = Math.floor(timePlay.hover_time_pixel / timePlay.size);    // 时间索引：当前悬浮位置对应第几个时间标签
        
        //重新计算curDate
        timePlay.hover_date = timePlay.initDateValue(timePlay.hover_time_index);
        
        //计算一下步长
		timePlay.step = timePlay.options.stepInit * timePlay.getUnitVal(timePlay.hover_time_index);
		
        // 获得剩余距离
        var leftPixel = Math.floor(timePlay.hover_time_pixel % timePlay.size);
        //剩余距离换算成时间
        var leftTime = Math.floor((leftPixel/timePlay.getStepPixel(timePlay.hover_time_index))*timePlay.step);
        timePlay.hover_date = timePlay.hover_date.dateAdd('s',leftTime);
        $(".timeProgress-hover-popup").show().css("left", x - timePlay.left).text(timePlay.hover_date.format('YYYY-MM-DD HH:mm:ss'));
    });

    $('.timeProgress').one('mouseleave', function () {
        $(window).off('mousemove');
        $(".timeProgress-hover-popup").hide();
    })
};

// 鼠标单击事件(先触发悬浮后触发单击)
Timeplay.prototype.clickPopup = function () {
    var timePlay = this;
    timePlay.stopPlay();
    $(".timeProgress-curr-popup").hide().text(timePlay.hover_date.format('YYYY-MM-DD HH:mm:ss'));
    $(".timeProgress-curr-popup.for-click").show().css('left', timePlay.hover_time_pixel - timePlay.offset);
    $(".timeProgress-bar").stop().css('width', timePlay.hover_time_pixel);
    timePlay.cur_time_pixel = timePlay.hover_time_pixel;
    timePlay.cur_time_index = timePlay.hover_time_index;
    timePlay.curDate = timePlay.hover_date;
    timePlay.options.onClickChangeEnd();
};

// 初始化日期
Timeplay.prototype.initDate = function () {
    var timePlay = this;
	timePlay.curDate = timePlay.initDateValue(0);
    $(".timeProgress-prev").addClass('disable');

    var time_width = $('.timeProgress-inner').width();  // 时间进度条的总长度
    var page_width = $('.timeProgress-box').width();    // 当前可见的时间进度条的长度(一页)
    if (Math.ceil(time_width / page_width) > 1) {
        $(".timeProgress-next").removeClass('disable');
    } else {
        $(".timeProgress-next").addClass('disable');
    }

    $(".timeProgress-curr-popup").show();

    $(".timeProgress-curr-popup").text(timePlay.curDate.format('YYYY-MM-DD HH:mm:ss'));

    timePlay.progressAni();
};

// 初始化dom
Timeplay.prototype.initDoms = function () {
    var timePlay = this;
    $(timePlay.options.container).hide();
    var mainContainer = $('<div id="timeMain"></div>');
    var playControl = '<div class="timeControl-box"><div class="timeControl play"></div></div>';
    var pageControl = '<div class="timeProgress-prev-box"><div class="timeProgress-prev" title="上一页"></div></div><div class="timeProgress-next-box"><div class="timeProgress-next" title="下一页"></div></div><div class="timeProgress-change-speed slow">快</div>';
    var timeAxis = '<div class="timeProgress-box"><div class="timeProgress-hover-popup"></div><div class="timeProgress-curr-popup for-click"></div><div class="timeProgress-hide"><div class="timeProgress-inner"><div class="timeProgress"><div class="timeProgress-bar"><div class="timeProgress-curr-popup for-animate"></div></div></div><ul></ul></div></div></div>';

    $(timePlay.options.container).append(mainContainer);

    mainContainer.append(playControl).append(pageControl).append(timeAxis);

    var datelist = '';

    for (var idx in timePlay.options.datetimes) {
        datelist += '<li class="timeProgress-every"><span class="timeProgress-datetime-item">' + timePlay.options.datetimes[idx] + '</span></li>';
    }

    $(timePlay.options.container).show().find('ul').append(datelist);

    $(".timeProgress-change-speed").on("click", function () {
        if ($(this).hasClass("slow")) {
            timePlay.options.speed = 300;
            $(".timeProgress-change-speed.slow").removeClass("slow").addClass("fast").text("慢");
        } else {
            timePlay.options.speed = 1000;
            $(".timeProgress-change-speed.fast").removeClass("fast").addClass("slow").text("快");
        }
    });

};

// 时间轴进度动画(调整时间轴位置)
Timeplay.prototype.progressAni = function () {
    var timePlay = this;
    var page_width = $('.timeProgress-box').width();                    // 当前可见的时间进度条的长度(一页)
    var time_width = $('.timeProgress-inner').width();                  // 时间进度条的总长度
    var page_num = Math.floor(timePlay.cur_time_pixel / page_width);    // 当前是第几页
    var left_dis = page_num * page_width;                               // 隐藏时间轴的总长度
    if (page_num == 0) {
        timePlay.offset = 0;
    } else {
        // 如果当前页面的时间轴剩余长度不足一格，则用下一页的时间轴显示
        if (left_dis + page_width - timePlay.cur_time_pixel < timePlay.size) {
            left_dis = left_dis + (page_width / 2);
        }

        // 尽量让剩余的时间轴充满屏幕
        if (left_dis + page_width > time_width) {
            left_dis = time_width - page_width;
            $(".next").addClass('disable');
        }

        // 如果当前时间的位置距离浏览器最左侧不足一格的话，把时间轴往前拉一拉，争取让当前时间显示在屏幕中间
        if ((timePlay.cur_time_pixel - left_dis) < timePlay.size) {
            left_dis = left_dis - (page_width / 2);
        }
        timePlay.offset = left_dis;
    }

    $('.timeProgress-inner').css({'transform': "translateX(-" + timePlay.offset + "px)"});

    $(".timeProgress-bar").css({'width': timePlay.cur_time_pixel});

};

// 是否到结尾
Timeplay.prototype.reachEnd = function () {
    var timePlay = this;
    var page_width = $('.timeProgress-box').width();

    var dis_right = page_width - (timePlay.cur_time_pixel - timePlay.offset);

    if (dis_right <= 108) {
        return true;
    } else {
        return false;
    }
};

Timeplay.prototype.play = function () {
    var timePlay = this;
    if ($('.timeControl').hasClass('play')) {
        timePlay.startPlay();
    } else {
        timePlay.stopPlay();
    }
};


Timeplay.prototype.startPlay = function () {
    var timePlay = this;
    $('.timeControl').toggleClass('play').toggleClass('pause');
	
	
    // 相当于重新播放
    if (timePlay.cur_time_index == timePlay.options.datetimes.length) {
        timePlay.cur_time_index = 0;
        timePlay.cur_time_pixel = 0;
        $(".timeProgress-curr-popup").hide();
    }

    timePlay.progressAni();

    var display_func = function () {
		
		//计算一下步长
		timePlay.step = timePlay.options.stepInit * timePlay.getUnitVal(timePlay.cur_time_index);
		
       
        
        // 获得当前推进的距离
        if((timePlay.cur_time_pixel + timePlay.getStepPixel(timePlay.cur_time_index))>=$('.timeProgress-inner').width()){
        	timePlay.cur_time_pixel = $('.timeProgress-inner').width();
        } else {
        	timePlay.cur_time_pixel = timePlay.cur_time_pixel + timePlay.getStepPixel(timePlay.cur_time_index);	
        }
        
         // 如果到了当前时间的尾部，则翻页
        if (timePlay.reachEnd()) {
            timePlay.halfPageNext();
        }
        
        //如果当前推行的距离超过了大刻度 大刻度加1
        if(timePlay.cur_time_pixel>(timePlay.cur_time_index+1)*timePlay.size){
        	timePlay.cur_time_index = timePlay.cur_time_index + Math.floor((timePlay.cur_time_pixel - (timePlay.cur_time_index+1)*timePlay.size)/timePlay.size)+1;
        }
        
        timePlay.curDate = timePlay.curDate.dateAdd('s',timePlay.step);

        if (timePlay.cur_time_index < $(".timeProgress-every").length) {
            $(".timeProgress-curr-popup").text(timePlay.curDate.format('YYYY-MM-DD HH:mm:ss'));
        }

        if (timePlay.cur_time_pixel >= $('.timeProgress').width()) {
            timePlay.cur_time_pixel = $('.timeProgress').width();
            $(".timeProgress-curr-popup").hide().text("END");
            $(".timeProgress-bar").css({'width': timePlay.cur_time_pixel});
            $(".timeProgress-curr-popup.for-click").show().css('left', timePlay.cur_time_pixel - timePlay.offset);
            timePlay.stopPlay();
        } else {
            $(".timeProgress-bar").css({'width': timePlay.cur_time_pixel});
            $(".timeProgress-curr-popup").hide();
            $(".timeProgress-curr-popup.for-animate").show();
            timePlay.options.onAnimateEnd();
            timePlay.timer = setTimeout(display_func, timePlay.options.speed);
        }

    };

    display_func();

};


Timeplay.prototype.stopPlay = function () {
    var timePlay = this;
    if ($('.timeControl').hasClass('pause')) {
        $('.timeControl').toggleClass('play').toggleClass('pause');
    }
    clearTimeout(timePlay.timer);
};

Timeplay.prototype.showPopup = function () {
    var timePlay = this;
    $(".timeProgress-curr-popup").hide();

    var t1 = timePlay.cur_time_index == 0 && timePlay.offset == 0;
    var t2 = timePlay.cur_time_index == timePlay.options.datetimes.length && $(".next").hasClass("disable");

    if (t1 || t2) {
        $(".timeProgress-curr-popup.for-click").show();
    } else {
        $(".timeProgress-curr-popup.for-animate").show();
    }
};

Timeplay.prototype.pageNext = function () {
    var timePlay = this;

    $(".timeProgress-prev").removeClass('disable');

    var page_width = $('.timeProgress-box').width();
    var time_width = $('.timeProgress-inner').width();

    timePlay.offset += page_width;

    if (timePlay.offset + page_width > time_width) {
        timePlay.offset = time_width - page_width;
        $(".timeProgress-next").addClass('disable');
    }

    timePlay.showPopup();

    $('.timeProgress-inner').css({'transform': "translateX(-" + timePlay.offset + "px)"});
};


Timeplay.prototype.pagePrev = function () {
    var timePlay = this;

    $(".timeProgress-next").removeClass('disable');

    var page_width = $('.timeProgress-box').width();
    timePlay.offset = timePlay.offset - page_width;

    if (timePlay.offset < 0) {
        timePlay.offset = 0;
        $(".timeProgress-prev").addClass('disable');
    }

    timePlay.showPopup();

    $('.timeProgress-inner').css({'transform': "translateX(-" + timePlay.offset + "px)"});
};


Timeplay.prototype.halfPageNext = function () {
    var timePlay = this;

	var page_num = Math.floor(timePlay.cur_time_pixel / page_width);
    if (page_num > 0) {
        $(".timeProgress-prev").removeClass('disable');
    }		

    var page_width = $('.timeProgress-box').width();
    var time_width = $('.timeProgress-inner').width();

	timePlay.offset = timePlay.offset + page_width / 2;
	
	while(timePlay.offset+page_width -timePlay.cur_time_pixel < page_width / 2){
		timePlay.offset = timePlay.offset + page_width / 2;
	}
		
    if (timePlay.offset + page_width > time_width) {
        timePlay.offset = time_width - page_width;
        $(".timeProgress-next").addClass('disable');
    }
    
    timePlay.showPopup();

    $('.timeProgress-inner').css({'transform': "translateX(-" + timePlay.offset + "px)"});
};


/**
 * 获取步长有多少距离
 */
Timeplay.prototype.getStepPixel = function (index) {
	var timePlay = this;
	var result ;
	var length = timePlay.options.datetimes[index].length;
	if(length == 4){
		var year = timePlay.options.datetimes[index];
		if(((year%4==0)&&(year%100!=0))||(year%400==0)){
			result = 366*24*60*60;
		} else {
			result = 355*24*60*60;
		}
	} else if(length == 7){
		result = new Date(timePlay.options.datetimes[index].split('-')[0],timePlay.options.datetimes[index].split('-')[1],0).getDate()*24*60*60;
	} else if(length == 10){
		result = 24*60*60;
	} else if(length == 13){
		result = 60*60;    
	} else if(length == 16){
		result = 60;
	}
	result = timePlay.step / result * timePlay.size;
	return result;
}


/**
 * 初始化时间
 */
Timeplay.prototype.initDateValue = function (index) {
	var timePlay = this;
	var result = timePlay.options.datetimes[index];
	var length = timePlay.options.datetimes[index].length;
	if(length == 4){
		result = new Date(timePlay.options.datetimes[index]);
	} else if(length == 7){
		result = new Date(timePlay.options.datetimes[index].split('-')[0],timePlay.options.datetimes[index].split('-')[1]);
	} else if(length == 10){
		result = new Date(timePlay.options.datetimes[index].split('-')[0],timePlay.options.datetimes[index].split('-')[1],timePlay.options.datetimes[index].split('-')[2]);
	} else if(length == 13){
		var ym = timePlay.options.datetimes[index].split(' ')[0];
		var shs =timePlay.options.datetimes[index].split(' ')[1]; 
		result = new Date(ym.split('-')[0],ym.split('-')[1],ym.split('-')[2],shs[1]);
	} else if(length == 16){
		var ym = timePlay.options.datetimes[index].split(' ')[0];
		var shs =timePlay.options.datetimes[index].split(' ')[1]; 
		result = new Date(ym.split('-')[0],ym.split('-')[1],ym.split('-')[2],shs.split(':')[0],shs.split(':')[1]);
	}
	return result;
}

/**
 * 时间相加
 */
Date.prototype.dateAdd = function(strInterval, Number) {   
    var dtTmp = this;  
    switch (strInterval) {   
        case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));  
        case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));  
        case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));  
        case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));  
        case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));  
        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
    }  
}


// 日期格式化  
// 格式 YYYY/yyyy/YY/yy 表示年份  
// MM/M 月份  
// W/w 星期  
// dd/DD/d/D 日期  
// hh/HH/h/H 时间  
// mm/m 分钟  
// ss/SS/s/S 秒 
Date.prototype.format = function(formatStr){   
    var str = formatStr;   
    var Week = ['日','一','二','三','四','五','六'];  
  
    str=str.replace(/yyyy|YYYY/,this.getFullYear());   
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));   
  
  
  	var month = this.getMonth()==0?12: this.getMonth();
    str=str.replace(/MM/,(month)>9?month.toString():'0' + (month));   
    str=str.replace(/M/g,month);   
  
    str=str.replace(/w|W/g,Week[this.getDay()]);   
  
    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
    str=str.replace(/d|D/g,this.getDate());   
  
    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());   
    str=str.replace(/h|H/g,this.getHours());   
    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());   
    str=str.replace(/m/g,this.getMinutes());   
  
    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());   
    str=str.replace(/s|S/g,this.getSeconds());   
  
    return str;   
} 

Timeplay.prototype.getUnitVal = function(index){
	var timePlay = this;
	var val = timePlay.options.stepUnit;
	if(val=='秒'){
		return 1;
	}else if(val=='分'){
		return 60;
	}else if(val=='时'){
		return 60*60;
	}else if(val=='日'){
		return 24*60*60
	}else if(val=='月'){
		return new Date(timePlay.options.datetimes[index].split('-')[0],timePlay.options.datetimes[index].split('-')[1],0).getDate()*24*60*60;
	}else if(val=='年'){
		var year = timePlay.options.datetimes[index];
		if(((year%4==0)&&(year%100!=0))||(year%400==0)){
			result = 366*24*60*60;
		} else {
			result = 355*24*60*60;
		}
		return result;
	} else {
		return 1;
	}
}
	