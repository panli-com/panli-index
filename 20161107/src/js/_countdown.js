// setInterval(GetRTime,1000);

!function (root, factory) {
    if (typeof module === 'object' && module.exports)
        module.exports = factory(root);
    else
        root.doubleAction = factory(root);
}(typeof window !== 'undefined' ? window : this,
    function () {

        var Countdown = {
            startTime: new Date(),
            nowTime: new Date(),
            endTime: new Date('2016/11/12 00:00:00'),
            init:function(time){
                var vm = this;
                vm.startTime = time.startTime;
                vm.startTime = time.endTime;
                vm.setInterval();
            },
            start:function(){
                
            },
            setInterval:function(){
                var vm = this;
                setInterval(vm.start(),1000);
            },
        }
        var EndTime = Countdown.endTime;
        var NowTime = Countdown.startTime;
        var t = EndTime.getTime() - NowTime.getTime();
        var d = Math.floor(t / 1000 / 60 / 60 / 24);
        var h = Math.floor(t / 1000 / 60 / 60 % 24);
        var m = Math.floor(t / 1000 / 60 % 60);
        var s = Math.floor(t / 1000 % 60);

        console.log(d + "天");
        console.log(h + "时");
        console.log(m + "分");
        console.log(s + "秒");

        return Countdown;
    });