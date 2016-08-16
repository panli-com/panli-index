/* *
 * 2016年04月09日15:54:20
 * By Julian
 * 依赖 panli.js
 * zanjser@163.com
 */
;(function () {
    
    function topFixNav(){
        
            
            var scrollTop = $(window).scrollTop();
            
            if($('#nav_list').length > 0){
                   var  topHeight = $('#nav_list').offset().top + 48;
                     if (scrollTop > topHeight) { }
                        $('.overHead')[scrollTop > topHeight ? 'addClass' : 'removeClass']('top_Show');
             }
           
            // (scrollTop > topHeight ? $('#topSearch') : $('#headSearch')).prev().focus();
            
            
            $('#black_Top')[scrollTop > 400 ? 'show' : 'hide']();
            
            if (window['IsIndex']) {

                $('#index_message')[scrollTop > 400 ? 'show' : 'hide']();
            }
            
       
        
         
    }
    
    
    $(window).resize(RightK); 

     $(window).scroll(function () {
        topFixNav();
     });
    
    PD(function () {
        
        
        
         RightK();    
           
        
        var tabObj = {
            "1":{
                text:"代购"
            },
            "2":{
                text:"转运"
            }
        }
        
        
        var clk = PD(".tab-sel-clk"),
            clk2 =PD(".tab-sel-2"),            
            t1 = tabObj["1"]["text"],
            t2 = tabObj["2"]["text"];
            
        
        
        
        clk.on("click",function () {
           
             
             clk2.slideToggle("fast");;
            
        });
        
        clk2.on("click",function () {
            var _t = PD(this),
                _v = _t.attr("data-val").toString();              
            
       
             isTabSeach(_v);
             
             clk2.slideToggle("100");
            
        });
        
        
        
        
        // 判断切换
        function isTabSeach(_v){
           
            if(_v == "2"){
                 seachTabDaigou();
             }else{
                 seachTabZhuanyun();
             }
            
        }
        
        
        // 切换代购
        function seachTabDaigou() {
            
            
            clk.attr("data-val","1").text(t1);
            
            clk2.attr("data-val","1").text(t2);
             
            PD(".search-val-text").text(t1);
            
            searchInputPla(t1);
            PD(".search-help-wrap").hide();
        }
        
        // 切换转运
        function seachTabZhuanyun() {
           
            
            clk2.attr("data-val","2").text(t1);
            
            clk.attr("data-val","2").text(t2);
            
            PD(".search-val-text").text(t2);
            
            searchInputPla(t2);
            
            PD(".search-help-wrap").show();
        }
        
        function searchInputPla(pla){
            PD(".head-search-text").attr("placeholder",'已经找好要'+ pla +'的宝贝了吗？快把宝贝的网址粘贴过来～');
        }
        
    })
    
    
})()
/*
 *
 * 手机端访问提示 app 下载
 * 
 */
;(function(){
    PD(function(){
        
        
        var ios = 'https://ad.apps.fm/GNZfabs7arqCu1oRxT3gDvE7og6fuV2oOMeOQdRqrE2nBK5AVcI9-S-10UZoq7P_urjYv6TX1wm8e-coWvUlas00Sjy-9REIf-KqzixCY4U';
        var Android = 'https://ad.apps.fm/tkfd04r4dxcGudYs0BPY2q5px440Px0vtrw1ww5B54zLvIIEY2TL1pcyA09eK7cfiGoUv6ck5zsybPsRVqKMKw';
        
        var downUrl = ios;
        
        if(browserRedirect() == 'phone'){
            
            if(detectOS() == 'Android'){
                downUrl = Android;
            } 
            
            var str = '<div class="appDown" id="appDown"><div class="downLogo"></div>'+
                        '<a ctarget="_blank" href="'+ downUrl +'">'+
                        '<span class="s1">下载手机 App, 让代购更轻松！</span>'+
                        '<span class="down"  >立即下载</span>'+
                        '</a>'+
                        '</div>';
            
            PD("body").append(str); 
            
            // PD("body").on("click",".Downclose",function(){
            //     PD("#appDown").remove();
            // })
            
        }
        
        
        
    })
    
    
    
})()
// ;(function () {
//     var canvas = {},
//     centerX = 0,
//     centerY = 0,
//     color = '',
//     containers = document.getElementsByClassName('material-design')
//     context = {},
//     element = {},
//     radius = 0,

//     requestAnimFrame = function () {
//       return (
//         window.requestAnimationFrame       || 
//         window.mozRequestAnimationFrame    || 
//         window.oRequestAnimationFrame      || 
//         window.msRequestAnimationFrame     || 
//         function (callback) {
//           window.setTimeout(callback, 1000 / 60);
//         }
//       );
//     } (),
      
//     init = function () {
//       containers = Array.prototype.slice.call(containers);
//       for (var i = 0; i < containers.length; i += 1) {
//         canvas = document.createElement('canvas');
//         canvas.addEventListener('click', press, false);
//         containers[i].appendChild(canvas);
//         canvas.style.width ='100%';
//         canvas.style.height='100%';
//         canvas.width  = canvas.offsetWidth;
//         canvas.height = canvas.offsetHeight;
//       }
//     },
      
//     press = function (event) {
//       color = event.toElement.parentElement.dataset.color;
//       element = event.toElement;
//       context = element.getContext('2d');
//       radius = 0;
//       centerX = event.offsetX;
//       centerY = event.offsetY;
//       context.clearRect(0, 0, element.width, element.height);
//       draw();
//     },
      
//     draw = function () {
//       context.beginPath();
//       context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//       context.fillStyle = color;
//       context.fill();
//       radius += 2;
//       if (radius < element.width) {
//         requestAnimFrame(draw);
        
//       }
      
//     };

//     init();
    
    
    
// })()


/*! 
 * 整理老代码梳理结构 
 * 2016年04月08日18:03:15
 * By Julian zanjser@163.com
 * 
 */

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}

function hover(dom) {
    if (dom.length > 1) {
        dom.each(function (i, t) {
            new hover($(t));
        });
        return false;
    }
    var className = dom.attr('data-hover'),
                     settime = '';
    dom.hover(function () {
        clearTimeout(settime);
        dom.addClass(className);
    }, function () {
        settime = setTimeout(function () { dom.removeClass(className); }, 200);
    })

}

// 右边客服 位置计算
function RightK() {
    var bodyW = $('body,html').width();
    var $RightNav = $('.r_l_nav');
    if (bodyW >= 1484) {
        $RightNav.css({ 'right': '50%', 'marginRight': '-742px' });
    } else {
        $RightNav.css({ 'right': '25px', 'marginRight': '0' });
    }
}


supportCss3 = function (style) {
    var prefix = ['webkit', 'moz', 'o', 'ms'],
                humpStyle = document.documentElement.style;

    function replaces(str) {
        return str.replace(/-(\w)/g, function ($0, $1) {
            return $1.toUpperCase();
        });
    }
    for (var i = 0, len = prefix.length + 1; i < len; i++) {
        var styleName = '';

        styleName = i == 0 ? style : replaces(prefix[i - 1] + '-' + style);

        if (styleName in humpStyle) return styleName;
    }
    return false; 
}

 
String.prototype.replaces = function (oldrel, newrel) {
    if (!oldrel || oldrel == '') oldrel = '\\\w\+';
    var rel = new RegExp('{{' + oldrel + '}}', 'g');
    if (!newrel || newrel == 'null' || newrel == 'undefined') newrel = '';
    return this.replace(rel, newrel);
}


// 判断移动设备
function browserRedirect() { 
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return "phone";
      } else {
        return "pc";
      }
}


// 判断操作系统
function detectOS() { 
    var sUserAgent = navigator.userAgent; 

    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows"); 
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"); 
    if (isMac) return "Mac"; 
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac; 
    if (isUnix) return "Unix"; 
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1); 

    var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == "android";
    if (isLinux) {
    if(bIsAndroid) return "Android";
    else return "Linux"; 
    }
    if (isWin) { 
    var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1; 
    if (isWin2K) return "Win2000"; 
    var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || 
    sUserAgent.indexOf("Windows XP") > -1; 
    if (isWinXP) return "WinXP"; 
    var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1; 
    if (isWin2003) return "Win2003"; 
    var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1; 
    if (isWinVista) return "WinVista"; 
    var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1; 
    if (isWin7) return "Win7"; 
    } 
    return "other"; 
} 

function removeDown(){
    PD("#appDown").remove();
}

;(function(){
    
    PD(function(){
    
    if (!supportCss3('transform')) {
        document.body.className += 'no_transform'
    }

    var urlRel = /^(http(s)?:\/\/)?([\w-]+\.)+([\w-\.]+)(\/[\w-.\/\?%&=]*)?/,
           errerText = '您输入的链接地址不正确，请核实后再填写！';
           
           
    PD('#topSearch').on('click', function () {
        var $input = PD(this).prevAll('input'),
                url = $.trim($input.val());
        if (urlRel.test(url)) {
            if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
                url = "http://" + url;
            url = url.replace(/&#/gi, '&'); //特殊地址报错
            window.location.href = "/Crawler.aspx?purl=" + encodeURIComponent(url);
        } else {
            $input.addClass('red').val(errerText);
            return false;
        }
    }); 
    
    
    PD('#headSearch').on('click', function () {
        var $input = PD(this).prevAll('input'),
                url = $.trim($input.val());
        if (urlRel.test(url)) {
            if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
                url = "http://" + url;
            url = url.replace(/&#/gi, '&'); //特殊地址报错
            
           var urV = PD(".tab-sel-clk").attr("data-val");
           
           var urlFe = ["","http://www.panli.com/Crawler.aspx?purl=","http://www.panli.com/mypanli/SelfPurchase/Order.aspx?szURL="]
            
            
            window.open(urlFe[urV] + encodeURIComponent(url));
        } else {
            $input.addClass('red').val(errerText);
            return false;
        }
    }); 


    PD('.search input').on({ '  ': function () {
            if (PD(this).hasClass('red')) {
                PD(this).removeClass('red').val('');
            }
        },
            'click': function (e) {
                if (PD(this).hasClass('red')) {
                    PD(this).removeClass('red').val('');
                }
            },
            'keyup': function (e) {
                if (e.keyCode == 13) {
                    PD(this).next().click();
                    return false;
                }
            }
    });


    new hover(PD('*[data-hover]'));
 
    PD('#r_download').hover(function () {
        PD('.icon_code_h', this).show();
        PD('.icon_code_p', this).animate({ left: 0 }, 300);
    }, function () {
        var _this = this;
        PD('.icon_code_p', this).animate({ left: '121px' }, 300, function () {
            PD('.icon_code_h', _this).hide();
        });
    }); 

   })
    
})();






;(function(PD, window, document, undefined) {
    function Rippleria(element, options) {
        this.$element = PD(element);
        this.options = PD.extend({}, Rippleria.Defaults, this._getOptionsFromElementAttributes(), options);

        this._prepare();
        this._bind();
    }

    Rippleria.prototype._bind = function() { 
        var elem = this.$element,
            options = this.options,
            ink, d, x, y, isTouchSupported, eventType;

        isTouchSupported = 'ontouchend' in window || window.DocumentTouch && document instanceof DocumentTouch;

        eventType = isTouchSupported == true ? 'touchend.ripplems' : 'click.ripplems';

        this.$element.bind(eventType, function(e) {
            var ink = PD("<div class='ripplems-ink'/>");
            elem.append(ink);

            if (options.color != undefined) {
                ink.css('background-color', options.color);
            }

            var animation = 'ripplems ' + options.duration / 1000 + 's ' + options.easing;

            ink.css('animation', animation);
            ink.css('-webkit-animation', animation);

            setTimeout(function() {
                ink.remove();
            }, parseFloat(options.duration));

            if(!ink.height() && !ink.width()) {
                d = Math.max(elem.outerWidth(), elem.outerHeight());
                ink.css({height: d, width: d});
            }

            if (isTouchSupported == true) {
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                x = touch.pageX - elem.offset().left - ink.width() / 2;
                y = touch.pageY - elem.offset().top - ink.height() / 2;
            } else {
                x = e.pageX - elem.offset().left - ink.width() / 2;
                y = e.pageY - elem.offset().top - ink.height() / 2;
            }

            ink.css({top: y + 'px', left: x + 'px'});
        });
    };

    Rippleria.prototype._prepare = function() {
        var elem = this.$element;

        if (elem.css('position') == 'static') {
            elem.css('position', 'relative');
        }

        elem.css('overflow', 'hidden');

        if(elem.find('img')[0] != undefined) {
            elem.on('dragstart', function(e) { e.preventDefault(); });
        }

        if(this.options.detectBrightness) {
            var r,g,b,brightness,
                colour = this.$element.css("background-color");

            if(colour == 'transparent') {
                var getParentBackground = function(elem) {
                    var colour = elem.css("background-color");

                    if(elem.length != 0) {
                        if(colour == 'transparent') {
                            return getParentBackground(elem.parent());
                        }
                    }

                    return colour;
                };

                colour = getParentBackground(this.$element.parent());
            }

            if (colour.match(/^rgba/)) {
                colour = colour.match(/rgba\(([^)]+)\)/)[1];

                colour = colour.split(/ *, */).map(Number);
                r = colour[0];
                g = colour[1];
                b = colour[2];
            } else if (colour.match(/^rgb/)) {
                colour = colour.match(/rgb\(([^)]+)\)/)[1];
                colour = colour.split(/ *, */).map(Number);
                r = colour[0];
                g = colour[1];
                b = colour[2];
            } else if ('#' == colour[0] && 7 == colour.length) {
                r = parseInt(colour.slice(1, 3), 16);
                g = parseInt(colour.slice(3, 5), 16);
                b = parseInt(colour.slice(5, 7), 16);
            } else if ('#' == colour[0] && 4 == colour.length) {
                r = parseInt(colour[1] + colour[1], 16);
                g = parseInt(colour[2] + colour[2], 16);
                b = parseInt(colour[3] + colour[3], 16);
            }

            brightness = (r * 299 + g * 587 + b * 114) / 1000;

            if (brightness > 150) {
                this.$element.addClass("ripplems-dark");
            }
        }
    };

    Rippleria.prototype._getOptionsFromElementAttributes = function() {
        var base = this;
        attrs = {};

        PD.each(Rippleria.Defaults, function(option, val) {
            var attr = base.$element.attr('ju-ripplems-' + option);
            if (attr != null) {
                attrs[option] = attr;
            }
        });

        return attrs;
    };

    Rippleria.prototype.changeColor = function(color) {
        this.options.color = color;
    };

    Rippleria.prototype.changeEasing = function(easing) {
        this.options.easing = easing;
    };

    Rippleria.prototype.changeDuration = function(duration) {
        this.options.duration = duration;
    };

    Rippleria.Defaults = {
        duration: 750,
        easing: 'linear',
        color: undefined,
        detectBrightness: true
    };

    PD.fn.ripplems = function(option) { 
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = PD(this),
                data = $this.data('ripplems');

            if (!data) {
                data = new Rippleria(this, typeof option == 'object' && option);
                $this.data('ripplems', data);
            }

            if (typeof option == 'string' && option.charAt(0) !== '_') {
                data[option].apply(data, args);
            }
        });
    };

    PD(function() {
        PD('[ju-ripplems]').ripplems();
    });
})(window.PD, window, document);
