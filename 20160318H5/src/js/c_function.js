function layerBtn(str){
    
  
    PL.open({
    type: 1, //1代表页面层
    content: str,
    
    success: function(oPan){
        $(".layer-box-title").on("touchend",function(){
            PL.closeAll();
            
            return false; 
        })
    }
    });
}
// 1
function layerBtnT1(list){
   
   var str = '<div class="layer-box-1 layer-box-all">'+
        '<div class="layer-box-title"></div>'+
        '<div class="layer-box-main">'+
         '   <div class="layer-box-main-border">'+
          '      <div class="layer-box-text">'+
           '       <div class="layer-box-list">'+
            '          <ul>'+  list +        
                     ' </ul>'+
                 ' </div>'+
               ' </div>'+
            '</div>'+
        '</div>'+
   ' </div>';
   
     
   return str;
    
}

function layerBtnT2(){
    
  var str = '<div class="layer-box-2 layer-box-all"><div class="layer-box-title"></div>'+
       ' <div class="layer-box-main">'+
           ' <div class="layer-box-main-border">'+
                '<div class="layer-box-text">'+
                   ' <div class="rule-title">'+
                       ' <div class="line"></div>'+
                       ' <span>抽奖资格获取说明</span>'+
                    '</div>'+
                  '  <ol>'+
                    '    <li>每天登录Panli可获得1次抽奖机会，当天有效;</li>'+
                    '    <li>每天成功提交订单可获得1次抽奖机会，多个订单 也仅限1次机会，活动期间有效，可累计；</li>'+
                   '     <li>每次成功提交运单，并待状态为“已发货”时，可获得1次抽奖机会，活动期间有效，可累计。</li>'+
                   ' </ol>'+
                  '   <div class="rule-title">'+
                   '     <div class="line"></div>'+
                    '    <span>奖品说明</span>'+
                   ' </div>'+
                  '  <ol>'+
                   '     <li>抽到的代金券，系统自动发放到您的Panli账户，可以在“我的-代金券”查看到账情况；</li>'+
                   '     <li>抽到的番币，系统自动发放到您的Panli账户，可以在“我的-番币”查看到账情况；</li>'+
                   '     <li>抽到的免服务费1个月和运费85折1个月，系统自动发放特权，提交运单时即可享受优惠；</li>'+
                    '    <li>抽到的iPhone 6s，将在1个工作日通过邮件私信获奖者，告知奖品发放的明细信息。</li>'+
                  '      <li>本活动最终解释权归Panli所有。</li>'+
                 '   </ol>'+
               ' </div>'+
          '  </div>'+
     '   </div>'+
  '  </div>';
    
    
     return str;
    

}


function UserBalance(uName,callback) {  
     $.ajax({
            type: "POST",
            url: "/App_Services/wsSendMessage.asmx/Testsum5",
            dataType: "json",
            data: '{userName:"' + uName + '"}',
            contentType: "application/json;utf-8",
            timeout: 20000,
            error: function () {
                //alert("500"); 
            },
            success: function (data) {
                callback(data);         

            }
        });    
}


function callmyInfo(i,n){
    
    var index = Number(i)-1,
        numb = '';
        
    if(Number(n) > 0){
        
       numb +=    '<div class="layer-my-popup-btn">'+
            '    继续抽奖'+
            '</div>';
    
    }
  
    
   var arrar = [
       {
           "title":"恭喜您~<br/>抽中了运费85折1个月！",
           "info":"提交运单时即可享受优惠，30天后失效。"
       },
       {
           "title":"恭喜您~<br/>抽中了免服务费1个月特权！",
           "info":"提交运单时即可享受优惠，30天后失效。"
       },       
       {
           "title":"恭喜您~<br/>抽中了11元无门槛代金券！",
           "info":"提交订单时即可享受优惠，14天后失效。"
       },
       {
           "title":"恭喜您~<br/>抽中了一张满299减100元代金券！",
           "info":"提交订单时即可享受优惠，14天后失效。"
       },
       {
           "title":"恭喜您~<br/>抽中了一张满199减20元代金券！",
           "info":"提交订单时即可享受优惠，14天后失效。"
       }, 
       {
           "title":"恭喜您~<br/>抽中了一张满99减10元代金券！",
           "info":"提交订单时即可享受优惠，14天后失效。"
       },
       {
           "title":"恭喜您~抽中了11个番币！",
           "info":"提交运单时，可直接抵扣服务费。"
       }  
   ];
   
   
   var title = arrar[index]["title"];
   var info = arrar[index]["info"];
    
    
  var str = '<div class="layer-my-popup">'+
       ' <div class="layer-border">'+
        '    <span class="close"></span>'+
         '   <div class="layer-my-popup-info">'+
          '      <p class="p1">'+ title +
             '   </p>'+
              '  <p class="p2">'+ info +  
              '  </p>'+
            '</div>'+ numb +           
        '</div>'+
    '</div> ';
    
     
    
    
    PL.open({
    type: 1, //1代表页面层
    content: str,
    
    success: function(oPan){
        // $(".layer-my-popup-btn").on("touchend",function(){
            
        //     // $(".jiugong li").removeClass("current");
        //     PL.closeAll();
        // });
        
        
        $(".layer-my-popup").on("touchend",function(){
            // $(".jiugong li").removeClass("current");
            PL.closeAll();
        })
    }
    });
    
    
    
    
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

//获取服务端数据 
function getSeverData(url,obj,callback) {
    var radNub = randomWord(false, 18);
     $.ajax({
            type: "POST",
            url: url+"?time="+radNub,
            dataType: "json",
            data: obj,
            contentType: "application/json;utf-8",
            timeout: 20000,
            error: function () {
                PL.open({
                    content: '请求错误，请再试',
                    time: 2
                });
               
            },
            success: function (data) {
                callback(data);
            }
        });    
}


// 这里是一些常用的函数
// 2015年9月25日 11:38:51



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


function removeEle(removeObj) {
    removeObj.parentNode.removeChild(removeObj);
};


// JavaScript Document
function loadjscssfile(filename,filetype){

    if(filetype == "js"){
        var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src",filename);
    }else if(filetype == "css"){
    
        var fileref = document.createElement('link');
        fileref.setAttribute("rel","stylesheet");
        fileref.setAttribute("type","text/css");
        fileref.setAttribute("href",filename);
    }
   if(typeof fileref != "undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
    
}

function htmlScroll(data,call){   
    
    var _html = '';     
    for(var i= 0;i<data.length;i++){
        var name = data[i].Name,
            proName = data[i].ProductName,
            url = 'javascript:void(0);';
            if(data[i].Url){
              url = data[i].Url;
            }
         _html +=  '<li><span class="name">'+ name +': </span>'+
                       '<a href="'+ url +'" target="_blank" class="pro-name">'+
                        '' + proName + '</a></li>';
                      
                    
        
    }    
    $("#scroll-main-u1").html(_html);
    call(); 
    return _html;
}

//滚动动画
function scrollAnmi(e) {
    $(e).ZScroll({ line: 1, speed: 1000, timer: 3000, up: "but_up", down: "but_down" });
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