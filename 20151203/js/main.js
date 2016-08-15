;(function(){
  $(function(){

    var NowTime = new Date();
    var EndTime = new Date('2015/11/12 23:59:59');
    FndoubleElevenLayer(NowTime,EndTime);

  });
})();


function FndoubleElevenLayer(FNowTime,FendTime){
  var DayNow = parseInt(FNowTime.getTime());
  var DayEnd = parseInt(FendTime.getTime());

  var stc = '<div class="i-double-eleven" data="'+ FNowTime.getTime() +'">'+
            '<span class="double-time-h">00</span>'+
            '<span class="double-time-m">00</span>'+
            '<span class="double-time-s">00</span>'+
            '</div>';
  PL.open({
    type: 1,
    title: false,
    area: ['380px', '372px'],
    closeBtn: true,
    shadeClose: false,
    skin: 'i-double-eleven-wp',
    content: stc
  });

  $("head").append("<style type='text/css'></style>");

  var doubleElevenLayer = {
    pZ:function(s){
      return s < 10 ? '0' + s: s;
    },
    DId:function(id){
      return document.getElementById(id);
    },
    less:function(n){
      return n < 0 ? '0': n;
    },
    GetRTime:function(){
      var t = parseInt(DayEnd) - parseInt(DayNow);

      var d=Math.floor(t/1000/60/60/24);
      var h=Math.floor(t/1000/60/60%24);
      var m=Math.floor(t/1000/60%60);
      var s=Math.floor(t/1000%60);
      DayNow += 1000;
     //  t < 0 ?  clearInterval(Time) : '';
      if(t < 0){
        d = h = m = s = '0';
        clearInterval(doubleElevenTime);
      }

      $(".double-time-h").html(doubleElevenLayer.pZ(h));
      $(".double-time-m").html(doubleElevenLayer.pZ(m));
      $(".double-time-s").html(doubleElevenLayer.pZ(s));

    }
  }
  var doubleElevenTime = setInterval(function(){
    doubleElevenLayer.GetRTime()
  },2000);
}



// (function($){
// $.fn.TimeSt=function(){
// 	var data="";
// 	var _DOM=null;
// 	var TIMER;
// 	createdom =function(dom){
// 		_DOM=dom;
// 		data=$(dom).attr("data");
// 		data = data.replace(/-/g,"/");
// 		data = Math.round((new Date(data)).getTime()/1000);
// 		$(_DOM).append("<ul class='yomi'><li class='yomiday'></li><li class='yomihour'></li><li class='split'>:</li><li class='yomimin'></li><li class='split'>:</li><li class='yomisec'></li></ul>")
// 		reflash();
//
// 	};
// 	reflash=function(){
// 		var	range  	= data-Math.round((new Date()).getTime()/1000),
// 					secday = 86400, sechour = 3600,
// 					days 	= parseInt(range/secday),
// 					hours	= parseInt((range%secday)/sechour),
// 					min		= parseInt(((range%secday)%sechour)/60),
// 					sec		= ((range%secday)%sechour)%60;
//
// 		$(_DOM).find(".yomihour").html(nol(hours));
// 		$(_DOM).find(".yomimin").html(nol(min));
// 		$(_DOM).find(".yomisec").html(nol(sec));
//
// 	};
// 	TIMER = setInterval( reflash,1000 );
// 	nol = function(h){
// 					return h>9?h:'0'+h;
// 	}
// 	return this.each(function(){
// 		var $box = $(this);
// 		createdom($box);
// 	});
// }
// })(jQuery);
//
//
// function Log(d){
//   return console.log(d);
// }
