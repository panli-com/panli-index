function getCookie(t){var n,e=new RegExp("(^| )"+t+"=([^;]*)(;|$)");return(n=document.cookie.match(e))?unescape(n[2]):null}function hover(t){if(t.length>1)return t.each(function(t,n){new hover($(n))}),!1;var n=t.attr("data-hover"),e="";t.hover(function(){clearTimeout(e),t.addClass(n)},function(){e=setTimeout(function(){t.removeClass(n)},200)})}function RightK(){var t=$("body,html").width(),n=$(".r_l_nav");t>=1484?n.css({right:"50%",marginRight:"-742px"}):n.css({right:"25px",marginRight:"0"})}function browserRedirect(){var t=navigator.userAgent.toLowerCase(),n="ipad"==t.match(/ipad/i),e="iphone os"==t.match(/iphone os/i),a="midp"==t.match(/midp/i),i="rv:1.2.3.4"==t.match(/rv:1.2.3.4/i),o="ucweb"==t.match(/ucweb/i),r="android"==t.match(/android/i),s="windows ce"==t.match(/windows ce/i),c="windows mobile"==t.match(/windows mobile/i);return n||e||a||i||o||r||s||c?"phone":"pc"}function detectOS(){var t=navigator.userAgent,n="Win32"==navigator.platform||"Windows"==navigator.platform,e="Mac68K"==navigator.platform||"MacPPC"==navigator.platform||"Macintosh"==navigator.platform||"MacIntel"==navigator.platform;if(e)return"Mac";var a="X11"==navigator.platform&&!n&&!e;if(a)return"Unix";var i=String(navigator.platform).indexOf("Linux")>-1,o="android"==t.toLowerCase().match(/android/i);if(i)return o?"Android":"Linux";if(n){var r=t.indexOf("Windows NT 5.0")>-1||t.indexOf("Windows 2000")>-1;if(r)return"Win2000";var s=t.indexOf("Windows NT 5.1")>-1||t.indexOf("Windows XP")>-1;if(s)return"WinXP";var c=t.indexOf("Windows NT 5.2")>-1||t.indexOf("Windows 2003")>-1;if(c)return"Win2003";var d=t.indexOf("Windows NT 6.0")>-1||t.indexOf("Windows Vista")>-1;if(d)return"WinVista";var l=t.indexOf("Windows NT 6.1")>-1||t.indexOf("Windows 7")>-1;if(l)return"Win7"}return"other"}function removeDown(){PD("#appDown").remove()}!function(){PD(function(){var t="https://ad.apps.fm/GNZfabs7arqCu1oRxT3gDvE7og6fuV2oOMeOQdRqrE2nBK5AVcI9-S-10UZoq7P_urjYv6TX1wm8e-coWvUlas00Sjy-9REIf-KqzixCY4U",n="https://ad.apps.fm/tkfd04r4dxcGudYs0BPY2q5px440Px0vtrw1ww5B54zLvIIEY2TL1pcyA09eK7cfiGoUv6ck5zsybPsRVqKMKw",e=t;if("phone"==browserRedirect()){"Android"==detectOS()&&(e=n);var a='<div class="appDown" id="appDown"><div class="downLogo"></div><a ctarget="_blank" href="'+e+'"><span class="s1">下载手机 App, 让代购更轻松！</span><span class="down"  >立即下载</span></a></div>';PD("body").append(a)}})}(),supportCss3=function(t){function n(t){return t.replace(/-(\w)/g,function(t,n){return n.toUpperCase()})}for(var e=["webkit","moz","o","ms"],a=document.documentElement.style,i=0,o=e.length+1;o>i;i++){var r="";if(r=0==i?t:n(e[i-1]+"-"+t),r in a)return r}return!1},String.prototype.replaces=function(t,n){t&&""!=t||(t="\\w+");var e=new RegExp("{{"+t+"}}","g");return n&&"null"!=n&&"undefined"!=n||(n=""),this.replace(e,n)},function(){PD(function(){supportCss3("transform")||(document.body.className+="no_transform");var t=/^(http(s)?:\/\/)?([\w-]+\.)+([\w-\.]+)(\/[\w-.\/\?%&=]*)?/,n="您输入的链接地址不正确，请核实后再填写！";$("#topSearch").on("click",function(){var e=$(this).prevAll("input"),a=$.trim(e.val());return t.test(a)?(a.indexOf("http://")<0&&a.indexOf("https://")<0&&(a="http://"+a),a=a.replace(/&#/gi,"&"),window.location.href="/Crawler.aspx?purl="+encodeURIComponent(a),void 0):(e.addClass("red").val(n),!1)}),$("#headSearch").on("click",function(){var e=$(this).prevAll("input"),a=$.trim(e.val());if(!t.test(a))return e.addClass("red").val(n),!1;a.indexOf("http://")<0&&a.indexOf("https://")<0&&(a="http://"+a),a=a.replace(/&#/gi,"&");var i=$(".tab-sel-clk").attr("data-val"),o=["","http://www.panli.com/Crawler.aspx?purl=","http://www.panli.com/mypanli/SelfPurchase/Order.aspx?szURL="];window.open(o[i]+encodeURIComponent(a))}),$(".search input").on({"  ":function(){$(this).hasClass("red")&&$(this).removeClass("red").val("")},click:function(t){$(this).hasClass("red")&&$(this).removeClass("red").val("")},keyup:function(t){return 13==t.keyCode?($(this).next().click(),!1):void 0}}),new hover($("*[data-hover]")),$("#r_download").hover(function(){$(".icon_code_h",this).show(),$(".icon_code_p",this).animate({left:0},300)},function(){var t=this;$(".icon_code_p",this).animate({left:"121px"},300,function(){$(".icon_code_h",t).hide()})})})}(),function(){function t(){var t=$(window).scrollTop();if($("#nav_list").length>0){var n=$("#nav_list").offset().top+48;$(".overHead")[t>n?"addClass":"removeClass"]("top_Show")}$("#black_Top")[t>400?"show":"hide"](),window.IsIndex&&$("#index_message")[t>400?"show":"hide"]()}$(window).resize(RightK),$(window).scroll(function(){t()}),PD(function(){function t(t){"2"==t?n():e()}function n(){o.attr("data-val","1").text(s),r.attr("data-val","1").text(c),PD(".search-val-text").text(s),a(s),PD(".search-help-wrap").hide()}function e(){r.attr("data-val","2").text(s),o.attr("data-val","2").text(c),PD(".search-val-text").text(c),a(c),PD(".search-help-wrap").show()}function a(t){PD(".head-search-text").attr("placeholder","已经找好要"+t+"的宝贝了吗？快把宝贝的网址粘贴过来～")}RightK();var i={1:{text:"代购"},2:{text:"转运"}},o=PD(".tab-sel-clk"),r=PD(".tab-sel-2"),s=i[1].text,c=i[2].text;o.on("click",function(){r.slideToggle("fast")}),r.on("click",function(){var n=PD(this),e=n.attr("data-val").toString();t(e),r.slideToggle("100")})})}();