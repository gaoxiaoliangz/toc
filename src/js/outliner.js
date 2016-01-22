/* outliner.js v0.2.0, (c) 2015 ~ 2016 Gao Liang. - https://github.com/gaoxiaoliangz/outliner
 * @license MIT */

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof jQuery === "undefined"){
    console.error("Error:", "jQuery is needed to run Outliner!");
  }else {
    root.Outliner = factory(root);
  }
})(this, function(root) {
  var version = "0.2.0";

  var Outliner = function(selector, config){
    var s = this;
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
      s.tableClass = "outliner-content-table";
      s.config = {
        hasNavMenu: config.hasNavMenu || false
      }
      s.mountComponent();

      if(s.config.hasNavMenu){
        s.navMenu.init(s);
      }

      $(s.contentTable.find(".item>a")).on("click",function(){
        s.handleLinkClick(this);
        return false;
      });
    },
    genContentTable:function(){
      var contentTable = $("<div class='"+this.tableClass+"'><div class='title'>目录</div></div>");
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
          $(this).attr("id",id).attr("class","outline-h-tag");

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

      this.contentTable = contentTable;
      return contentTable;
    },
    mountComponent:function(){
      var s = this;
      s.genContentTable();
      s.contentTable.insertBefore($(s.selector));

      // get h tag position info
      $(s.selector).find(".outline-h-tag").each(function(){
        s.hTags.push([$(this).attr("id"),$(this).offset().top]);
      });
    },
    handleLinkClick:function(context){
      var tar_id = $(context).parent().attr("class").split(" ")[1];
      var top = $("#"+tar_id).offset().top;
      if(Outliner.isIE()){
        $("html").animate({scrollTop: top},300);
      }else{
        $("body").animate({scrollTop: top},300);
      }
    },

    navMenu: {
      init:function(context){
        var s = this;
        s.dom = null;
        s.isNavShown = false;
        s.id = null;
        s.class = "outliner-nav-menu";
        s.mount(context);

        // nav menu event handling
        $("#"+s.id).find(".item>a").on("click",function(){
          context.handleLinkClick(this);
          s.close(context);
          return false;
        });

        $("body")
          .on("click","#"+s.id+".closed .icon",function(){s.open()})
          .on("click","#"+s.id+".open .icon",function(){s.close()})
          .on("keydown",function(e){
            if($("#"+s.id).hasClass("open") && e.keyCode == 27) s.close();
          })

        $(window).scroll(function () {s.handleScroll(context)});
      },
      mount:function(context){
        var h_tag_info = [];
        var nav_id = this.id = "nav-gen-by-outliner-fixed-"+parseInt(Math.random()*Math.pow(10,6));
        $("body").append("<div style='display:none;' class='"+this.class+" closed' id='"+nav_id+"'>"+
          "<span class='icon icon-animated icon-animated-menu state-1'></span>"+
          "<div class='container'>"+
            "<div class='current-item'></div>"+
            "<div class='wrap' style='display:none;'>"+context.contentTable.html()+"</div>"+
          "</div>"+
        "</div>");
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
      open:function(){
        var nav = this.dom;
        Outliner.lockScroll();
        nav.find(".wrap").slideDown("fast",function(){
          nav.css({"height": "999em"}).removeClass("closed").addClass("open");
          nav.find(".current-item").hide();
          nav.find(".icon").removeClass("state-1").addClass("state-2");
          nav.find(".container").css({"height": $(window).height()+100});
        });
      },
      close:function(){
        var nav = this.dom;
        Outliner.unlockScroll();
        nav.find(".wrap").slideUp("fast",function(){
          nav.css({"height": "auto"}).removeClass("open").addClass("closed");
          nav.find(".container").css({"height": "auto"});
          nav.find(".current-item").fadeIn();
          nav.find(".icon").removeClass("state-2").addClass("state-1");
          $(this).clearQueue();
        });
      }
    },
  };
  Outliner.prototype.init.prototype = Outliner.prototype;

  jQuery.fn.outliner = function(config){
    return new Outliner(this, config);
  }

  return Outliner;
});
