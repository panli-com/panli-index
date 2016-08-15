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


/**
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

;(function(){
    
    PD(function(){
        
        
    
    if (!supportCss3('transform')) {
        document.body.className += 'no_transform'
    }

    var urlRel = /^(http(s)?:\/\/)?([\w-]+\.)+([\w-\.]+)(\/[\w-.\/\?%&=]*)?/,
           errerText = '您输入的链接地址不正确，请核实后再填写！';
           
           
    $('#topSearch').on('click', function () {
        var $input = $(this).prevAll('input'),
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
    
    
    $('#headSearch').on('click', function () {
        var $input = $(this).prevAll('input'),
                url = $.trim($input.val());
        if (urlRel.test(url)) {
            if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0)
                url = "http://" + url;
            url = url.replace(/&#/gi, '&'); //特殊地址报错
            
           var urV = $(".tab-sel-clk").attr("data-val");
           
           var urlFe = ["","http://www.panli.com/Crawler.aspx?purl=","http://www.panli.com/mypanli/SelfPurchase/Order.aspx?szURL="]
            
            
            window.open(urlFe[urV] + encodeURIComponent(url));
        } else {
            $input.addClass('red').val(errerText);
            return false;
        }
    }); 


    $('.search input').on({ '  ': function () {
            if ($(this).hasClass('red')) {
                $(this).removeClass('red').val('');
            }
        },
            'click': function (e) {
                if ($(this).hasClass('red')) {
                    $(this).removeClass('red').val('');
                }
            },
            'keyup': function (e) {
                if (e.keyCode == 13) {
                    $(this).next().click();
                    return false;
                }
            }
    });


    new hover($('*[data-hover]'));

    $('#r_download').hover(function () {
        $('.icon_code_h', this).show();
        $('.icon_code_p', this).animate({ left: 0 }, 300);
    }, function () {
        var _this = this;
        $('.icon_code_p', this).animate({ left: '121px' }, 300, function () {
            $('.icon_code_h', _this).hide();
        });
    }); 



   })
    
    
    
})()






/**
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