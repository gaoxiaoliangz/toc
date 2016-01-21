/**
 * outliner v0.1 (jQuery is required)
 * by Gao Liang
 **/

$.fn.genOutline = function(wrap, hasFixedNav){

  var list = [];
  if(!wrap){
    var tar = $(this);
    $("<div class='nav-gen-by-outliner'><div class='title'>目录</div></div>").insertBefore(tar);
    var wrap = $(".nav-gen-by-outliner");
  }
  var list_markup = wrap.append("<ul></ul>").find(">ul");
  var content = $(this);

  // generate tree
  content.children().each(function(){
    if($(this).prop("tagName") in {"H1":1,"H2":2,"H3":3,"H4":4,"H5":5,"H6":6}){
      var id = "h"+parseInt(Math.random()*(Math.pow(10,6)));
      var h_text = $(this).text();
      var h = parseInt($(this).prop("tagName").substr(1,1));
      var parent;
      var h_markup;
      var list_copy = list.concat();
      var link = "<a href='#"+id+"''>"+h_text+"</a>";

      list_copy.reverse();
      list.push([h,id]);
      $(this).attr("id",id).attr("class","outlined-h-tag");

      var has_parent = list_copy.some(function(i){
        if(i[0]<h){
          parent = i;
          return true;
        }
      });

      if(has_parent){
        var level = h-parent;
        list_markup.find("."+parent[1]).append("<ul><li class='item "+id+"'>"+link+"</li></ul>");
        parent = null;
      }else{
        for(var i=0;i<=(h-2);i++){
          if(i==(h-2)){
            list_markup.append("<li class='item "+id+"'>"+link+"</li>");
            list_markup = wrap.find(">ul");
          }else{
            list_markup.append("<li><ul></ul></li>");
            list_markup = list_markup.find(">li:last-child ul");
          }
        }
      }
    }
  });

  function isIE(ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
  }

  function handleLinkClick(that){
    var tar_id = that.parent().attr("class").split(" ")[1];
    var top = $("#"+tar_id).offset().top;
    if(isIE()){
      $("html").animate({scrollTop: top},300);
    }else{
      $("body").animate({scrollTop: top},300);
    }
    return false;
  }

  function handleArticleLinkClick(){
    var that = $(this);
    handleLinkClick(that);
    return false;
  }

  // event handler link click
  $(wrap.find(".item>a")).on("click",handleArticleLinkClick);


  if(hasFixedNav){

    if(!$.fn.animateIcon){
      alert("animateicon.js is required!");
    }

    var is_included = false;
    var h_tag_info = [];
    var nav_id = "nav-gen-by-outliner-fixed-"+parseInt(Math.random()*Math.pow(10,6));
    $("body").append("<div style='display:none;' class='nav-gen-by-outliner-fixed closed' id='"+nav_id+"'>"+
      "<div class='icon icon-menu-animated'></div>"+
      "<div class='container'>"+
        "<div class='current-item'></div>"+
        "<div class='wrap' style='display:none;'>"+wrap.html()+"</div>"+
      "</div>"+
    "</div>");
    var nav = $("#"+nav_id);
    nav.find(".icon").animateIcon("init");


    // get h tag position info
    content.find(".outlined-h-tag").each(function(){
      h_tag_info.push([$(this).attr("id"),$(this).offset().top]);
    });

    // event handler scroll
    $(window).scroll(function () {
      if((wrap.offset().top+wrap.outerHeight()) < $(document).scrollTop() && !is_included){
        nav.slideDown();
        is_included = true;
      }else if((wrap.offset().top+wrap.outerHeight()) >= $(document).scrollTop() && is_included){
        nav.slideUp();
        is_included = false;
      }

      var cur_h_id = getCurHId();
      if(cur_h_id){
        var tar_item_class = ".h"+cur_h_id.substr(1,6);
        nav.find(".item").not(tar_item_class).removeClass("active");
        nav.find(tar_item_class).addClass("active");
        nav.find(".current-item").html(nav.find(tar_item_class).find(">a").text());
      }

    });

    // event handler link click in fixed nav
    $(nav).find(".item>a").on("click",handleFixedNavLinkClick);

    // event handler fixed nav
    $("body").on("mouseenter","#"+nav_id+".closed .icon",openFixedNav);
    $("body").on("click","#"+nav_id+".closed .icon",openFixedNav);

    $("body").on("mouseleave","#"+nav_id+".open",closeFixedNav);
    $("body").on("click","#"+nav_id+".open .icon",closeFixedNav);

    function handleFixedNavLinkClick(){
      var that = $(this);
      closeFixedNav();
      handleLinkClick(that);
      return false;
    }

    function closeFixedNav(){
      unlockScroll();
      nav.find(".wrap").slideUp("fast",function(){
        nav.css({"height": "auto"});
        nav.find(".container").css({"height": "auto"});
        nav.removeClass("open");
        nav.addClass("closed");
        nav.find(".current-item").fadeIn();
        nav.find(".icon").animateIcon("close");
        $(this).clearQueue();
      });
    }

    function openFixedNav(){
      lockScroll();
      nav.find(".wrap").slideDown("fast",function(){
        nav.removeClass("closed");
        nav.addClass("open");
        nav.find(".current-item").hide();
        nav.find(".icon").animateIcon("open");
        nav.find(".container").css({"height": $(window).height()+100});
        nav.css({"height": "999em"});
      });
    }

    function getCurHId(){
      var result = null;
      var scl_top = $(document).scrollTop() + 20;
      for(var i = 0;i<h_tag_info.length-1;i++){
        if(h_tag_info[i][1] <= scl_top && h_tag_info[i+1][1] > scl_top){
          result = h_tag_info[i][0];
          break;
        }else if(i==h_tag_info.length-2 && h_tag_info[i+1][1] < scl_top){
          result = h_tag_info[i+1][0];
          break;
        }
      }
      return result;
    }

    function lockScroll(){
      $("body").css({"overflow": "hidden"});
    }
    function unlockScroll(){
      $("body").css({"overflow": "auto"});
    }
  }
};
