(function($){
$.fn.extend({
        ZScroll:function(opt,callback){
                //参数初始化
                if(!opt) var opt={};
                var _btnUp = $("#"+ opt.up);//Shawphy:向上按钮
                var _btnDown = $("#"+ opt.down);//Shawphy:向下按钮
                var timerID;
                var lengQ = 10;
                var _this=this.eq(0).find("ul:first");
                var     lineH= 41, //获取行高
                        line=opt.line?parseInt(opt.line,10):parseInt(this.height()/lineH,10), //每次滚动的行数，默认为一屏，即父容器高度
                        speed=opt.speed?parseInt(opt.speed,10):500; //卷动速度，数值越大，速度越慢（毫秒）
                        timer=opt.timer //?parseInt(opt.timer,10):3000; //滚动的时间间隔（毫秒）
                if(line==0) line=1;
                var upHeight=0-line*lineH;
                //滚动函数 
                var scrollUp=function(){
                        _btnUp.unbind("click",scrollUp); //Shawphy:取消向上按钮的函数绑定
                        _this.animate({
                                marginTop:upHeight
                        },speed,function(){
                                for(i=1;i<=line;i++){
                                        _this.find("li:first").appendTo(_this);
                                }
                                _this.css({marginTop:0});
                                _btnUp.bind("click",scrollUp); //Shawphy:绑定向上按钮的点击事件
                        });

                }
                //Shawphy:向下翻页函数 
                var scrollDown=function(){
                    
                        _btnDown.unbind("click",scrollDown);
                        
                        console.log(line);
                        for(i=1;i<=line;i++){
                                _this.find("li:last").show().prependTo(_this);
                        }
                        _this.css({marginTop:upHeight});
                        _this.animate({
                                marginTop:0
                        },speed,function(){
                                _btnDown.bind("click",scrollDown);
                        });
                }
               //Shawphy:自动播放
                var autoPlay = function(){
                        if(timer)timerID = window.setInterval(scrollDown,timer);
                };
                var autoStop = function(){
                        if(timer)window.clearInterval(timerID);
                };
                 //鼠标事件绑定
                _this.hover(autoStop,autoPlay).mouseout();
                _btnUp.css("cursor","pointer").click( scrollUp ).hover(autoStop,autoPlay);//Shawphy:向上向下鼠标事件绑定
                _btnDown.css("cursor","pointer").click( scrollDown ).hover(autoStop,autoPlay);

        }
})
})(jQuery);

/**
 * opts.idPart 集合中每一项的id中相同的部分 必需设置
 * opts.idDigit 集合中每一项的id中不同的部分 第一项开始的数字 必需设置
 * opts.legnth 集合中共有几项 必需设置
 * opts.current 集合中当前项添加的类名 默认'current'
 * opts.index 从哪一项开始 索引值 从0开始 最后一项为opts.length-1
 * opts.count 滚动的圈数 默认10圈
 * opts.duration 持续时间 默认5000(毫秒)
 * opts.easing 动画效果 
 * this.start(index, fn) 开始调用动画 
 * index 集合中哪一项为中奖结果 索引值 从0开始 最后一项为opts.length-1
 * fn 动画完成后 
 **/
(function(window, document) {
	'use strict';
	var zhuanQuan = function(opts) {
		opts = opts || {};
		this.idPart = opts.idPart;
		this.idDigit = opts.idDigit;
		this.length = opts.length;
		this.current = opts.current || 'current';
		this.duration = opts.duration || 5000;
		this.easing = (opts.easing && this.tween[opts.easing]) || this.tween.easeInOutCirc;
		this.count = opts.count || 10;
		this.index = opts.index || 0;
		this.index > this.length - 1 && (this.index = 0);
		this.oIndex = 0;
		this.els = [];
		this.animated = false;
		this.init();
	};
	zhuanQuan.prototype = {
		init: function() {
			var start = this.idDigit,
				end = this.length + start - 1,
				i = start;
			for (; i <= end; i++) this.els.push(document.getElementById(this.idPart + i));
		},
		start: function(index, fn) {
			this.animate(index, function() {
				fn && fn();
			});
		},        
		animate: function(index, fn) {
			if (this.animated) return;
			var start = this.index,
				end = index + this.length * this.count,
				change = end - start,
				duration = this.duration,
				startTime = +new Date(),
				ease = this.easing,
				_this = this;
			this.animated = true;
			!function animate() {
				var nowTime = +new Date(),
					timestamp = nowTime - startTime,
					delta = ease(timestamp / duration),
					result = start + delta * change;
				result > end && (result = end);
				_this.scroll(result);
				if (duration <= timestamp) {
					_this.scroll(end);
					_this.animated = false;
					fn && fn();
				} else {
					setTimeout(animate, 30); 
				}
			}();
		},
		scroll: function(v) {
			//  console.log(v + '=01')
			this.index = Math.round(v) % this.length;
			if (this.index === this.oIndex) return;
			// console.log(this.index + '=02')
			this.index < 0 && (this.index = 0);
			this.index > this.length - 1 && (this.index = 0);
			this.next();
		},
		next: function() { 
           
            if(this.els[this.index]){
                
               
                
                this.els[this.index].className.indexOf(this.current) < 0 && (this.els[this.index].className += ' ' + this.current);
                this.els[this.oIndex].className = this.els[this.oIndex].className.replace(this.current, '');
                this.oIndex = this.index;
                
                
            }else{
            //    this.restart();
             
                 window.location.href = window.location.href; 
            }
			
		},
		tween: {
			easeInOutQuad: function(pos) {
				if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
				return -0.5 * ((pos -= 2) * pos - 2);
			},
			easeInOutCubic: function(pos) {
				if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);
				return 0.5 * (Math.pow((pos - 2), 3) + 2);
			},
			easeInOutSine: function(pos) {
				return (-0.5 * (Math.cos(Math.PI * pos) - 1));
			},
			easeInOutCirc: function(pos) {
				if ((pos /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
				return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
			}
		}
	};
	if (typeof define === 'function' && define.amd) {
		define('zhuanQuan', [], function() {
			return zhuanQuan;
		});
	} else {
		window.zhuanQuan = zhuanQuan;
	}
}(window, document));
var console=console||{log:function(){return;}}  
// 1
function layerBtnT1(list){
   
   var str = '<div class="page-layer-wrap">'+
        '<span class="m-close"></span>'+
        '<div class="layer-my-pin-img"></div>'+
        '<div class="page-layer-main">'+
        '    <div class="page-layer-border">'+    
        '        <div class="layer-box-list">'+
        '              <ul>'+ list +                      
        '              </ul>'+
        '          </div>'+  
        '    </div>'+
        '</div>'+
    '</div>';
   
     
   return str;
    
}

function listNameAnmi(){
    
    $(".list-name").ZScroll({ line: 1, speed: 1000, timer: 3000, up: "but_up", down: "but_down" });    
    
}

function layerMyPin(list) {
    
    
    PL.open({
    type: 1,
    title: false,
    closeBtn: false,
    area: '486px',
    skin: 'layui-Pan-nobg', //没有背景色
    shadeClose: true,
    content: layerBtnT1(list)
    });
    
    
    
}

function callmyInfo(i,n){
    
    var index = Number(i)-1,
        numb = '';
        
    if(Number(n) > 0){
        
       numb +=    '<div class="layer-btn layer-btn-jixu">'+
            '    继续抽奖'+
            '</div>';
    
    }
  
    
   var arrar = [
       {
           "title":"恭喜您~<br/>抽中了运费85折1个月！",
           "info":"提交运单时即可享受优惠，30天后失效。",
           "src":"http://www.panli.com/mypanli/OrderCart.aspx",
           "btn":"马上提交运单"
       },
       {
           "title":"恭喜您~<br/>抽中了免服务费1个月特权！",
           "info":"提交运单时即可享受优惠，30天后失效。",
           "src":"http://www.panli.com/mypanli/OrderCart.aspx",
           "btn":"马上提交运单"
       },       
       {
           "title":"恭喜您~<br/>抽中了11元无门槛代金券！",
           "info":"提交订单时即可享受优惠，14天后失效。",
           "src":"http://www.panli.com/Special/TopicColumn.aspx",
           "btn":"马上代购"
       },
       {
           "title":"恭喜您~<br/>抽中了一张满299减100元代金券！",
           "info":"提交订单时即可享受优惠，14天后失效。",
           "src":"http://www.panli.com/Special/TopicColumn.aspx",
           "btn":"马上代购"
       },
       {
           "title":"恭喜您~<br/>抽中了一张满199减20元代金券！",
           "info":"提交订单时即可享受优惠，14天后失效。",
           "src":"http://www.panli.com/Special/TopicColumn.aspx",
           "btn":"马上代购"
       }, 
       {
           "title":"恭喜您~<br/>抽中了一张满99减10元代金券！",
           "info":"提交订单时即可享受优惠，14天后失效。",
           "src":"http://www.panli.com/Special/TopicColumn.aspx",
           "btn":"马上代购"
       },
       {
           "title":"恭喜您~抽中了11个番币！",
           "info":"提交运单时，可直接抵扣服务费。",
           "src":"http://www.panli.com/mypanli/OrderCart.aspx",
           "btn":"马上提交运单"
       }  
   ];
   
   
   var title = arrar[index]["title"];
   var info = arrar[index]["info"];
   var src = arrar[index]["src"];
   var btn = arrar[index]["btn"];
    
    
  var str = '<div class="page-layer-main">'+
            '<div class="page-layer-border">'+
             '   <span class="l-close"></span>'+
              '  <div class="layer-my-popup-info">'+
               '     <p class="p1">'+ title +            
               '     </p>'+
               '     <p class="p2">'+ info + 
               '     </p>'+
               '</div>'+
               ' <div class="layer-btn-wrap">'+
               '     <a href="'+ src +'" class="layer-btn layer-btn-1">'+ btn +
               '     </a>'+ numb + 
               ' </div>'+
           ' </div>'+
        '</div>';
    
     
    
    
     
    PL.open({
    type: 1,
    title: false,
    closeBtn: false,
    area: '478px',
    skin: 'layui-Pan-nobg', //没有背景色
    shadeClose: true,
    content: str
    });
    
    
    // PL.open({
    // type: 1, //1代表页面层
    // content: str,
    
    // success: function(oPan){
    //     $(".layer-my-popup-btn").on("touchend",function(){
            
    //         // $(".jiugong li").removeClass("current");
    //         PL.closeAll();
    //     });
        
        
    //     $(".layer-my-popup .close").on("touchend",function(){
    //         // $(".jiugong li").removeClass("current");
    //         PL.closeAll();
    //     })
    // }
    // });
    
    
    
    
}



// 奖项对应关系
function correspondIndex(){
    
    return {
        "1": "8",
        "2": "4",
        "3": "1",
        "4": "3",
        "5": "5",
        "6": "7",
        "7": "6",      
        "8": "2"        
    }
    
}


// 渲染中奖名单
function readerlistName(data){
    
    
    
    if(data.length > 0 ){
        var str = '';
        
        
        
        for(var i = 0;i<data.length;i++){
            
           str += ' <li class="flex flex-left flex-main-justify flex-cross-top">'+
                   ' <div class="text-info">'+
                   '     <span class="name">'+ data[i].Name +'</span>抽中了<span class="wupin">data[i].Name </span>'+
                   ' </div>'+
                 '   <div class="la-time">data[i].CreateDate</div>'+
                '</li>';
            
            
        }
        
        
        $(".winners-list ul").html(str);
        
    }

}
// 获取数据函数
function getServeData(src,obj,call){
    $.ajax({
            type: "POST",
            url: src,
            dataType: "json",
            data:obj,
            contentType: "application/json;utf-8",
            
            error: function (ms) { 
                call(ms)
            },
            success: function (data) {
                call(data)               
            }
   });
    
    
}     

 

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
使用方法

生成3-32位随机串：randomWord(true, 3, 32)
生成88位随机串：randomWord(false, 88)
*/
 
function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

function GetRandomNum(Min,Max){   
var Range = Max - Min;   
var Rand = Math.random();   
return(Min + Math.round(Rand * Range));   
}   



// v  
function appV(){
  return "0.0.2";
}


// 获取服务器时间
function getServerTime(callback){
  $.ajax({
       type: "POST",
       cache: false,
       async: false,
       url: "/App_Services/wsDefault.asmx/GetDateTime",
       dataType: "json",
       contentType: "application/json;utf-8",
       timeout: 10000,
       error: function () {
       },
       success: function (data) {
           if(data){
             callback(parseInt(data.d));
           }
       }
    });
}
// 获取服务器时间 
function getServerTimeStamp(callback){
  $.ajax({
       type: "POST",
       cache: false,
       async: false,
       url: "/App_Services/wsDefault.asmx/GetDateTimeStamp",
       dataType: "json",
       contentType: "application/json;utf-8",
       timeout: 10000,
       error: function () {
       },
       success: function (data) {
           if(data){
             callback(parseInt(data.d * 1000));
           }
       }
    });
}



// 今日 结束时间
function getDateEnd(date) {
    var _date = new Date(date);
    var year = _date.getFullYear(),
       month = _date.getMonth(),
       day = _date.getDate();
    return new Date(year, month, day, 23, 59, 59);
}
//这是有设定过期时间的使用示例：
//s20是代表20秒
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30



//倒计时 PLCountdown(1451404800000)
function PLCountdown(end,sta,i){
   function p(s) {
            return s < 10 ? '0' + s : s;
   } 
    
  if(!i){
    i = 1
  }
  if(!sta){
    sta = new Date().getTime();
  }
  var t = parseInt(end) - parseInt(sta),
   d=Math.floor(t/1000/60/60/24),
   h=Math.floor(t/1000/60/60%24),
   m=Math.floor(t/1000/60%60),
   s=Math.floor(t/1000%60),
   index = i+1;
  if(t < 0){
    d = h = m = s = '00';
  }

  var time = {
    d:p(d),
    h:p(h),
    m:p(m),
    s:p(s),
    i:p(index),
    end:p(end),
    sta:p(sta)
  };
  return time;
}




function enTimeF(endTime,nowTime){
		var TimeJson = PLCountdown(endTime,nowTime),
			d = TimeJson.d,
			h = TimeJson.h,
			m = TimeJson.m,
			s = TimeJson.s;
			
			if( parseInt(d) == 0){
				
				$('.banner7').hide();
				$('.banner8').fadeIn("slow");
			}
		$(".time-day").text(d);
		$(".time-hour").text(h);
		$(".time-minute").text(m);
		$(".time-second").text(s);
		
		setTimeout(function(){
			enTimeF(endTime-1000,nowTime)
		},1000)
}
;(function(){
  
  $(function(){
     
    $("body").on("click",".m-close,.l-close,.layer-btn-jixu",function(){
        PL.closeAll();
    })
     
    //  我的奖品
    //   $(".my-pin-btn").on("click",function(){               
           
    //   });
      

  });
    

})();
