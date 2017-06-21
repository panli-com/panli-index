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