/**
 * animateicon v0.1 (jQuery is required)
 * by Gao Liang
 **/

jQuery.fn.animateIcon = function(action){
  switch(action){
    case "init":
      $(this).addClass("menu");
      $(this).append("<span class='top'></span><span class='bottom'></span>");
      break;
    case "open":
      $(this).removeClass("menu");
      $(this).addClass("close");
      break;
    case "close":
      $(this).removeClass("close");
      $(this).addClass("menu");
      break;
  }
};
