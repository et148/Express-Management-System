(function( $ ){
  var methods = {
    init: function(options) {
      var settings = {
        color: "rgba(0, 255, 0, 1)",
        reach: 20,
        speed: 500,
        pause: 0,
        glow: true,
        repeat: true,
        onHover: false
      };
      $(this).css({
        "-moz-outline-radius": $(this).css("border-top-left-radius"),
        "-webkit-outline-radius": $(this).css("border-top-left-radius"),
        "outline-radius": $(this).css("border-top-left-radius")
      });
      $(this).html('<div class="level1"></div><div class="level2"></div><div class="level3"></div>');
      if (options) {
        $.extend(settings, options);
      }
      settings.color = $("<div style='background:" + settings.color + "'></div>").css("background-color");
      if(settings.repeat !== true && !isNaN(settings.repeat) && settings.repeat > 0) {
        settings.repeat -=1;
      }

      return this.each(function() {
    	  pulse(settings, this, 0);
      });
    },
    destroy: function() {
      return this.each(function() {
        clearTimeout(this.timer);
        $(this).css("display","none");
      });
    }
  };

  var pulse = function(options, el, count) {
    $(el).css("display","block");
    var colorarr = options.color.split(",");
    var l1=$(el).find(".level1");
    var l2=$(el).find(".level2");
    var l3=$(el).find(".level3");
    
    var minWidth1=20;
    var minWidth2=70;
    var minWidth3=120;
    var widthStr1=l1.get(0).style.width||(minWidth1+"px");
    var widthStr2=l2.get(0).style.width||(minWidth2+"px");
    var widthStr3=l3.get(0).style.width||(minWidth3+"px");
    
    var width1=widthStr1.substr(0,widthStr1.length-2)-0+(1);
    var width2=widthStr2.substr(0,widthStr2.length-2)-0+(1);
    var width3=widthStr3.substr(0,widthStr3.length-2)-0+(1);
    
    var widthOffset=50;
    
    if(width1>widthOffset+minWidth1) width1=minWidth1;
    if(width2>widthOffset+minWidth2) width2=minWidth2;
    if(width3>widthOffset+minWidth3) width3=minWidth3;
    
    var cssObj1={
		"top":"-"+width1/2+"px",
		"left":"-"+width1/2+"px",
		"width":width1+"px",
		"height":width1+"px"
    }
    var cssObj2={
		"top":"-"+width2/2+"px",
		"left":"-"+width2/2+"px",
		"width":width2+"px",
		"height":width2+"px"
    }
    var cssObj3={
		"top":"-"+width3/2+"px",
		"left":"-"+width3/2+"px",
		"width":width3+"px",
		"height":width3+"px"
    }
    var shadowColor="rgba(" + colorarr[0].split("(")[1] + "," + colorarr[1] + "," + colorarr[2].split(")")[0] + "," + (1*((width1-minWidth1)/(widthOffset))) + ")";
    cssObj1["box-shadow"] = "0px 0px 30px "+0+"px "+shadowColor+"inset, 0px 0px 30px "+0+"px "+shadowColor;
    shadowColor="rgba(" + colorarr[0].split("(")[1] + "," + colorarr[1] + "," + colorarr[2].split(")")[0] + "," + (1) + ")";
    cssObj2["box-shadow"] = "0px 0px 30px "+0+"px "+shadowColor+"inset, 0px 0px 30px "+0+"px "+shadowColor;
    shadowColor="rgba(" + colorarr[0].split("(")[1] + "," + colorarr[1] + "," + colorarr[2].split(")")[0] + "," + (1*(1-(width3-minWidth3)/(widthOffset))) + ")";
    cssObj3["box-shadow"] = "0px 0px 30px "+0+"px "+shadowColor+"inset, 0px 0px 30px "+0+"px "+shadowColor;
    l1.css(cssObj1);
    l2.css(cssObj2);
    l3.css(cssObj3);
    var reach=options.reach;

    var innerfunc = function () {
        if(count>=reach && !options.repeat) {
          $(el).halo("destroy");
          return false;
        } else if(count>=reach && options.repeat !== true && !isNaN(options.repeat) && options.repeat > 0) {
          options.repeat = options.repeat-1;
        } else if(options.pause && count>=reach) {
          pause(options, el, count+1);
          return false;
        }
        pulse(options, el, count+1);
      };
      
    if(el.timer){
      clearTimeout(el.timer);
    }
    el.timer = setTimeout(innerfunc, options.speed/reach);
  };
  
 

  var pause = function (options, el, count) {
    innerfunc = function () {
      pulse(options, el, count);
    };
    el.timer = setTimeout(innerfunc, options.pause);
  };

  $.fn.halo = function( method ) {
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.halo' );
    }

  };
})( jQuery );