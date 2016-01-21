/* outliner.js v0.1.0, (c) 2015 ~ 2016 Gao Liang. - https://github.com/gaoxiaoliangz/outliner
 * @license MIT */

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Outliner = factory();
  }
})(this, function() {
  var version = "0.1.0";
  var Outliner = function(selector, config){
    return new Outliner.prototype.init(selector, config);
  }

  Outliner.isIE = function(ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
  }

  Outliner.lockScroll = function(){
    $("body").css({"overflow": "hidden"});
  }

  Outliner.unlockScroll = function(){
    $("body").css({"overflow": "auto"});
  }

  Outliner.prototype = {
    outliner: version,
    init:function(selector, config){
      var s = this;
      s.selector = selector;
      s.contentTable = null;
      s.hTags = [];
      s.config = {
        hasNavMenu: config.hasNavMenu || false
      }
      s.mountComponent();

      $(s.contentTable.find(".item>a")).on("click",s.handleLinkClick);
    },
    genContentTable:function(){
      var contentTable = $("<div class='nav-gen-by-outliner'><div class='title'>目录</div></div>");
      var domPinter = contentTable.append("<ul></ul>").find(">ul");
      var list = [];
      var content = $(this.selector);
      var s = this;

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
            domPinter.find("."+parent[1]).append("<ul><li class='item "+id+"'>"+link+"</li></ul>");
            parent = null;
          }else{
            for(var i=0;i<=(h-2);i++){
              if(i==(h-2)){
                domPinter.append("<li class='item "+id+"'>"+link+"</li>");
                domPinter = contentTable.find(">ul");
              }else{
                domPinter.append("<li><ul></ul></li>");
                domPinter = domPinter.find(">li:last-child ul");
              }
            }
          }
        }
      });

      // get h tag position info
      $(s.selector).find(".outlined-h-tag").each(function(){
        s.hTags.push([$(this).attr("id"),$(this).offset().top]);
      });

      this.contentTable = contentTable;
      return contentTable;
    },
    mountComponent:function(){
      this.genContentTable();
      this.contentTable.insertBefore($(this.selector));

      if(this.config.hasNavMenu){
        this.navMenu.init(this);
      }
    },
    handleLinkClick:function(){
      var tar_id = $(this).parent().attr("class").split(" ")[1];
      var top = $("#"+tar_id).offset().top;
      if(Outliner.isIE()){
        $("html").animate({scrollTop: top},300);
      }else{
        $("body").animate({scrollTop: top},300);
      }
      return false;
    },

    navMenu: {
      init:function(context){
        var s = this;
        s.dom = null;
        s.isNavShown = false;
        s.id = null;
        s.mount(context);

        // nav menu event handling
        $("#"+s.id).find(".item>a").on("click",context.handleLinkClick,function(){
          s.close(context);
        });
        $("body").on("mouseenter","#"+s.id+".closed .icon",function(){
          s.open(context);
        });
        $("body").on("click","#"+s.id+".closed .icon",function(){
          s.open(context);
        });
        $("body").on("mouseleave","#"+s.id+".open",function(){
          s.close(context);
        });
        $("body").on("click","#"+s.id+".open .icon",function(){
          s.close(context);
        });
        $(window).scroll(function () {
          s.handleScroll(context);
        });
      },
      mount:function(context){
        // todo
        if(!$.fn.animateIcon){
          alert("animateicon.js is required!");
        }

        var h_tag_info = [];
        var nav_id = this.id = "nav-gen-by-outliner-fixed-"+parseInt(Math.random()*Math.pow(10,6));
        $("body").append("<div style='display:none;' class='nav-gen-by-outliner-fixed closed' id='"+nav_id+"'>"+
          "<div class='icon icon-menu-animated'></div>"+
          "<div class='container'>"+
            "<div class='current-item'></div>"+
            "<div class='wrap' style='display:none;'>"+context.contentTable.html()+"</div>"+
          "</div>"+
        "</div>");
        var nav = $("#"+nav_id);
        nav.find(".icon").animateIcon("init");

        this.dom = $("#"+nav_id);
      },
      handleScroll:function(context){
        var wrap = context.contentTable;
        var nav = this.dom;
        var hId = this.getCurrentHTagId(context);

        if((wrap.offset().top+wrap.outerHeight()) < $(document).scrollTop() && !this.isNavShown){
          nav.slideDown();
          this.isNavShown = true;
        }else if((wrap.offset().top+wrap.outerHeight()) >= $(document).scrollTop() && this.isNavShown){
          nav.slideUp();
          this.isNavShown = false;
        }

        if(hId){
          var tar_item_class = ".h"+hId.substr(1,6);
          nav.find(".item").not(tar_item_class).removeClass("active");
          nav.find(tar_item_class).addClass("active");
          nav.find(".current-item").html(nav.find(tar_item_class).find(">a").text());
        }
      },
      getCurrentHTagId:function(context){
        var result = null;
        var scl_top = $(document).scrollTop() + 20;
        for(var i = 0;i<context.hTags.length-1;i++){
          if(context.hTags[i][1] <= scl_top && context.hTags[i+1][1] > scl_top){
            result = context.hTags[i][0];
            break;
          }else if(i==context.hTags.length-2 && context.hTags[i+1][1] < scl_top){
            result = context.hTags[i+1][0];
            break;
          }
        }
        return result;
      },
      open:function(context){
        var nav = context.navMenu.dom;

        Outliner.lockScroll();
        nav.find(".wrap").slideDown("fast",function(){
          nav.removeClass("closed");
          nav.addClass("open");
          nav.find(".current-item").hide();
          nav.find(".icon").animateIcon("open");
          nav.find(".container").css({"height": $(window).height()+100});
          nav.css({"height": "999em"});
        });
      },
      close:function(context){
        var nav = context.navMenu.dom;

        Outliner.unlockScroll();
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
    },
  };
  Outliner.prototype.init.prototype = Outliner.prototype;

  return Outliner;
});
