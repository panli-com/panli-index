
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





