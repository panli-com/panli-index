/* *
 * 2016年11月7日16:19:26
 * By Julian
 * 依赖 panli.js
 * zanjser@163.com
 */
;(function () {
    PD(function () {
      
    })
})()
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




function preloadimages(arr){   
    var newimages=[], loadedimages=0
    var postaction=function(){}  //此处增加了一个postaction函数
    var arr=(typeof arr!="object")? [arr] : arr
    function imageloadpost(){
        loadedimages++
        if (loadedimages==arr.length){
            postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image()
        newimages[i].src=arr[i]
        newimages[i].onload=function(){
            imageloadpost()
        }
        newimages[i].onerror=function(){
            imageloadpost()
        }
    }
    return { //此处返回一个空白对象的done方法
        done:function(f){
            postaction=f || postaction
        }
    }
}
preloadimages(PanLiNodeInfo.doubleLogo).done(function(images){
   console.log(images.length)
   console.log(images[0].src+" "+images[0].width)
})