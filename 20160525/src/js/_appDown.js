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