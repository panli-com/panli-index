;(function(){
  // ontouchstart
  // ontouchmove
  // ontouchend
  $(function(){
    // onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"
    $(".moneytxt").on("blur focus input",function(t){
      var _t = $(this),
          _tV = _t.val(),
          _dV = _t.attr("data-v");
      if(isNaN(_tV)){
        _t.val(_dV);
        return;
      }else{      
        console.log(toNumTwo(_tV));
        _t.attr("data-v",_t.val());
      }
      verificationInput(_t);
    });

    $("#goto-result").on('click',function(){
      var _ck = $(this).attr("btn-no");
      if(!_ck){
        return false;
      }
      console.log(verificationInput());
    });
    $('input, textarea, button, a, select').off('touchstart mousedown').on('touchstart mousedown', function(e) {
          e.stopPropagation();
      });
    })

  function verificationInput(t){
    var price = $(".price-val"),
        weight = $(".weight-val"),
        priceVal = price.val(),
        weightVal = weight.val();
      if(!isNull(priceVal) || !isNull(weightVal) || isNaN(priceVal) || isNaN(weightVal)){
        btnG(false);
        return false;
      }
      btnG(true);
      return true;
  };

  function toNumTwo(num){
    if(!num.indexOf(".")){
      return num;
    }
    var nubA =num.split('.');
    if(nubA.length <= 1 || nubA == undefined || nubA == ''){
      return num;
    }

    return parseFloat(num).toFixed(2);

    //return num;

  }

  function btnG(a){
    var goBtn = $("#goto-result");
    if(a == false){
      goBtn.attr("btn-no",false);
      goBtn.addClass("no-click");
    }else {
      goBtn.attr("btn-no",true);
      goBtn.removeClass("no-click");
    }
  }

  function isNull(data) {
    return (data == "" || data == undefined || data == null) ? false : data;
  }

})();
