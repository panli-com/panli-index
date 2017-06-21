/*!
 * JavaScript Cookie v2.1.3
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

/* *
 * 2016年11月7日16:19:26
 * By Julian
 * 依赖 panli.js
 * zanjser@163.com
 */
;(function () {
    PD(function () {
    });
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

                vm.startLayer();
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

                var isrc = elimg.attr('src');
                if(!vm.isThatDay()){
                    el.removeClass("double-logo-wrap");
                    isrc == elimgSrc ? "" : elimg.attr('src',elimgSrc);
                    return false;
                }
                el.addClass("double-logo-wrap");
                isrc == elimgDoubleSrc ? "" : elimg.attr('src',elimgDoubleSrc);
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
            objTime:function(){
                var vm = this;
                var deff = vm.endTime - vm.nowTime;
                var d = vm.checkTime(Math.floor(deff / 1000 / 60 / 60 / 24));
                var h = vm.checkTime(Math.floor(deff / 1000 / 60 / 60 % 24));
                var m = vm.checkTime(Math.floor(deff / 1000 / 60 % 60));
                var s = vm.checkTime(Math.floor(deff / 1000 % 60));

                return {
                    day:d,
                    hours:h,
                    minute:m,
                    second:s
                }
            },
            creatDomTime:function(){
                var vm = this;
                var deff = vm.endTime - vm.nowTime;
                var time = vm.objTime();
                var d = time.day;
                var h = time.hours;
                var m = time.minute;
                var s = time.second;

                var elm = PD(".double-logo-content");
                elm.addClass("animated bounceInDown");
                
                var stcbox = '<div class="double-time-box"><span class="double-time-h">'+ h +'</span><span class="double-time-m">'+ m +'</span><span class="double-time-s">'+ s +'</span></div>';
                
                elm.removeClass("one-src");
                
                elm.html(stcbox);
                PD(".double-time-layer").html(stcbox);

                elm.addClass("time-src");
            },
            getHours:function(){
                var vm = this;
                var nowTime = vm.nowTime;
                var hours = new Date(nowTime).getHours();
                return hours;
            },
            setInterval:function(){
                var vm = this;
                vm.start();
            },
            isLogin:function(){
               return PanLiNodeInfo.isLoggedIn;
            },
            cookie:'doubleLayer',
            setCookie:function(val){
                var vm = this;
                var name = vm.cookie;
                Cookies.set(name, val, { expires: 1 });
            },
            getCookie:function(){
                var vm = this;
                var name = vm.cookie;
                return Cookies.get(name);
            },
            getHref:function(){
               return window.location.hostname + window.location.pathname
            },
            startLayer:function(){
                var vm = this;
                var hours = vm.getHours();
                var isLogin = vm.isLogin();
                if(vm.isLayer()){
                    if(hours < 22 && isLogin){
                        vm.setCookie(1);
                    }else{
                        vm.setCookie(2);  
                    }
                    vm.creatLayer();
                }

            },
            isLayer:function(){
                var vm = this;
                var cookie = vm.getCookie();
                var isLogin = vm.isLogin();
                var hours = vm.getHours();
                if(isLogin && cookie == '2' && hours<22){
                    vm.setCookie(1);
                    cookie = '1';
                }

                if(!vm.isThatDay() || cookie == '2' || !vm.isLayerPage()){
                    return false;
                }

                if(cookie == '1' && hours<23){
                    return false;
                }

                return true;
            },
            isLayerPage:function(){
                var vm = this;
                var _href = vm.getHref();
                var hrefArr = PanLiNodeInfo.double.layer.href;
                var leng = hrefArr.length;
                var isL = false;

                for(var i = 0;i<leng;i++){
                    if(hrefArr[i] == _href){
                        isL = true;
                    }
                }

                return isL; 
            },
            creatLayer:function(){
                var vm = this;
                var layer = PanLiNodeInfo.double.layer;
                var close = '<a href="javascript:void(0);" class="double-close" title="关闭" ></a>';
                var more = '<a href="'+ layer.more +'" class="double-more" title="查看"></a>';

                var time = vm.objTime();
                var d = time.day;
                var h = time.hours;
                var m = time.minute;
                var s = time.second-1;

                var timebox = '<div class="double-time-layer"><div class="double-time-box"><span class="double-time-h">'+ h +'</span><span class="double-time-m">'+ m +'</span><span class="double-time-s">'+ s +'</span></div></div>';
                var stc = '<div class="layer-double-box">'+
                            ''+ close + timebox + more +
                            '</div>';
                PL.open({
                    type: 1,
                    title: false,
                    closeBtn: false,
                    area: '410px',
                    skin: 'layui-Pan-nobg', //没有背景色
                    shadeClose: false,
                    content: stc
                });

                PD("body").on("click",".double-close",function(){
                    PL.closeAll();
                })
            }
        }

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
