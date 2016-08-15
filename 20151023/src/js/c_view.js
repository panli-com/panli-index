;(function () {
    var fontsize = function () {
      var W = document.body.getBoundingClientRect().width, defaultW = 750, defaultSize = 40;
      if (W > defaultW) W = defaultW;
      if (W < 320) W = 320; 
      window.W = W; document.getElementsByTagName('html')[0].style.fontSize = (W / defaultW * defaultSize).toFixed(2) + 'px';
  };
  window.addEventListener('resize', function () { setTimeout(fontsize, 300) });
  window.addEventListener("DOMContentLoaded", fontsize);
  setTimeout(fontsize, 300);

  var myScroll;
  function loaded() {
    myScroll = new iScroll('main');
  }
  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
  document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
})();
