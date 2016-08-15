$(function(){
  var floor4 = $(".floor-4");
  var floor4Top = floor4.offset().top;
  var winH = $(window).height();
  var swbtn = true;


    $(window).scroll(function () {
      var scrollTop = $(window).scrollTop();
      console.log(swbtn);
        if(scrollTop+winH/2-50 >= floor4Top){
          floor4.addClass("scroll")
          swbtn = false;
            console.log(scrollTop+"z");

        }
    });


});
