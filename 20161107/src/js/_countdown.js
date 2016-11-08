// setInterval(GetRTime,1000);

!function (root, factory) {
    if (typeof module === 'object' && module.exports)
        module.exports = factory(root);
    else
        root.doubleAction = factory(root);
}(typeof window !== 'undefined' ? window : this,
    function () {

        var Countdown = {
            nowTime: new Date().getTime(),
            startTime: new Date().getTime(),
            endTime: new Date('2016/11/8 14:22:00').getTime(),
            init:function(time){
                var vm = this;
                if(time){
                    time.nowTime ? vm.nowTime = time.nowTime :"";
                    time.startTime ? vm.startTime = time.startTime :"";
                    time.endTime ? vm.endTime = time.endTime :"";
                }
                vm.start();
            },
            start:function(){
                var vm = this;
                vm.nowTime = vm.nowTime + 1000;
                vm.countTime();
                setTimeout(function(){
                    vm.start();
                },1000);
            },
            isThatDay:function(){
               var vm = this;
               if(vm.nowTime < vm.startTime || vm.nowTime > vm.endTime){
                   return false;
               }
               return true;
            },
            countTime:function(){
                var vm = this;
                var el = PD("#el-double-logo");
                var elimg =  el.find(".logo-img");
                var elimgSrc = elimg.attr("data-src");
                var elimgDoubleSrc = elimg.attr("data-double-src");
                if(!vm.isThatDay()){
                    el.removeClass("double-logo-wrap");
                    elimg.attr('src',elimgSrc);
                    return false;
                }
                el.addClass("double-logo-wrap");
                elimg.attr('src',elimgDoubleSrc);
                vm.creatDom();
            },
            checkTime:function(i){
                i<0 ? i=0 :"";
                if(i<10) { 
                    i="0" + i 
                } 
                return i 
            },
            creatDom:function(){
                 var vm = this;

                 if(vm.isCreatOne == 3){
                     vm.creatDomTime();
                     return false;
                 }

                 if(vm.isCreatOne == 1){
                      vm.creatDomOne();
                 }
                 
            },
            isCreatOne:1,
            creatDomOne:function(){
                var vm = this;
                var elm = PD(".double-logo-content");
                elm.addClass("one-src");
                var gifsrc = PanLiNodeInfo.double.logo[0] + '?v='+ new Date().getTime();
                var stc = '<img class="double-logo-gif" src="'+ gifsrc +'" alt="">';
                elm.html(stc);
                vm.isCreatOne = 2;
                setTimeout(function(){
                    vm.isCreatOne = 3;
                    vm.creatDomTime();
                },2320)
            },
            creatDomTime:function(){
                var vm = this;
                var deff = vm.endTime - vm.nowTime;
                var d = vm.checkTime(Math.floor(deff / 1000 / 60 / 60 / 24));
                var h = vm.checkTime(Math.floor(deff / 1000 / 60 / 60 % 24));
                var m = vm.checkTime(Math.floor(deff / 1000 / 60 % 60));
                var s = vm.checkTime(Math.floor(deff / 1000 % 60));

                var elm = PD(".double-logo-content");
                elm.addClass("animated bounceInDown");
                
                var stcbox = '<div class="double-time-box"><span class="double-time-h">'+ h +'</span><span class="double-time-m">'+ m +'</span><span class="double-time-s">'+ s +'</span></div>';
                
                elm.removeClass("one-src");
                
                elm.html(stcbox);

                elm.addClass("time-src");
            },
            setInterval:function(){
                var vm = this;
                vm.start();
            },
        }
        // var EndTime = Countdown.endTime;
        // var NowTime = Countdown.startTime;
        // var t = EndTime.getTime() - NowTime.getTime();
        // var d = Math.floor(t / 1000 / 60 / 60 / 24);
        // var h = Math.floor(t / 1000 / 60 / 60 % 24);
        // var m = Math.floor(t / 1000 / 60 % 60);
        // var s = Math.floor(t / 1000 % 60);

        // console.log(d + "天");
        // console.log(h + "时");
        // console.log(m + "分");
        // console.log(s + "秒");

        return Countdown;
    });