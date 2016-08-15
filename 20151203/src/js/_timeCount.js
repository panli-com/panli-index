

    var duaEndTime = '2015-12-12 23:59:59';
    
    function countDown(endTime, timeData) {

        function p(s) { 
            return s < 10 ? '0' + s : s;
        }

        var Time_Rule = /^[\d]{4}-[\d]{1,2}-[\d]{1,2}( [\d]{1,2}:[\d]{1,2}(:[\d]{1,2})?)?$/ig, str = '', conn, s;
        if (!endTime.match(Time_Rule)) {
            return false;
        }


        var sec = (new Date(endTime.replace(/-/ig, '/')).getTime() - timeData) / 1000;


        var timeDay = sec / 24 / 3600;
        var timeJson = {
            'Hour': sec / 3600 % 24,
            'Minute': sec / 60 % 60,
            'Second': sec % 60
        }


        var textTime = '';

        for (i in timeJson) {
            var i = p(Math.floor(timeJson[i])).toString() + ":";
            textTime += i;
        }
        
        var _h = p(Math.floor(timeJson.Hour)).toString(),
            _m = p(Math.floor(timeJson.Minute)).toString(),
            _s = p(Math.floor(timeJson.Second)).toString();
        
        textTime = textTime.substring(0, textTime.length - 1);

        var timeHtml = '<span class="time-hour">'+ _h +'</span><span class="time-minute">'+ _m +'</span><span class="time-second">'+ _s +'</span>';
        if (Math.floor(sec) < 0) { textTime = '00:00:00'; $("#dual-october-time").remove(); }

        var _timeBox = $("#dual-october-time");

        /* 还剩一天的时候 */
        if (timeDay < 1) {
            _timeBox.addClass("dual-october-time-2");
            $("#dual-text-time").html(timeHtml);
            setTimeout(function () {
                timeData = timeData + 1000;
                countDown(duaEndTime, timeData);
            }, 1000);
        } else {
            var _day = (Math.floor(timeDay) + 0).toString();
               
            _timeBox.addClass("dual-october-time-1");
            var htmDay = $('<div class="time-day"></div>').html(_day);
            $("#dual-text-time").html(htmDay);
        }

        return timeJson;
    }


   
    function dualDong(host) {
        var _dbox = $(".dual-october-wrap");
        if (_dbox.length < 1) {
            
            return;
        }
        if(host == "www"){
            
            getServerTimeStamp(function (timeData) {            
             countDown(duaEndTime, timeData);
            });
            
        }else{
          var getTime = $("#GetDateTimeStamp").val();
            countDown(duaEndTime, Number(getTime)*1000);  
        }       
        
        
    };


