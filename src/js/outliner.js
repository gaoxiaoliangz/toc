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

  Outliner.prototype = {
    outliner: version,
    init:function(selector, config){


      this.selector = selector;
      this.config = {
        hasFixedNav: config.hasFixedNav || false
      }

      this.mountComponent();

    },
    genTree:function(){
      var treeDom = $("<div class='nav-gen-by-outliner'><div class='title'>目录</div></div>");
      var domPinter = treeDom.append("<ul></ul>").find(">ul");
      var list = [];
      var content = $(this.selector);

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
                domPinter = treeDom.find(">ul");
              }else{
                domPinter.append("<li><ul></ul></li>");
                domPinter = domPinter.find(">li:last-child ul");
              }
            }
          }
        }
      });

      return treeDom;
    },
    genFixedNav:function(){
      var fixedNavHtml;


      return fixedNavHtml;
    },
    mountComponent:function(){
      var treeDom = this.genTree();
      treeDom.insertBefore($(this.selector));
    },
    handleLinkClick:function(){

    },
    handleScroll:function(){

    }
  };

  Outliner.prototype.init.prototype = Outliner.prototype;


  return Outliner;
});

Outliner(".content",{});


//
// function Abc(){
//   var s = this;
//   s.a = 123;
//
//   s.fuc1 = function(){
//     console.log(s.a);
//     console.log(this);
//   }
// }
// Abc.prototype.fuc2 = function(){
//   console.log(this.a);
//   console.log(this);
// }
// var a = new Abc();
//
// a.fuc1();
// a.fuc2();


//
// var kitX = (function(obj){
//   console.log(obj);
//
//   obj.isIE = function(ver){
//     var b = document.createElement('b')
//     b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
//     return b.getElementsByTagName('i').length === 1
//   }
//
//   obj.sealScroll = function(){
//     $("body").css({"overflow":"hidden"});
//   };
//
//   obj.unlockScroll = function(){
//     $("body").css({"overflow":"visible"});
//   }
//
//   obj.excAndExcOnResizing = function(func,args){
//     func.apply(null,args);
//     $(window).resize(function(){
//       func.apply(null,args);
//     })
//   }
//
//   return obj;
// }(kitX || {}));
//
//
//
// kitX = (function(obj){
//
//   console.log(obj);
//
//   obj.hahah = function(){
//
//   }
//
//   return obj;
// }(kitX || {}));

//
// (function(){
//   var abc = function(){
//     console.log("abc is exed");
//   };
//
//   return abc();
//
// }());


//
// function Fuck(){
//   return new Fuck.prototype.init();
// }
// Fuck.prototype.init = function(){
//   var obj = {};
// }
// Fuck.prototype.init.prototype = Fuck.prototype;
//
// var a = Fuck("abc");
// var b = new Fuck();
// console.log(a instanceof Fuck);
// console.log(b instanceof Fuck);
//
//
//
// function abc(){
//
// }
//
// var bcd = new abc();
// console.log(bcd instanceof abc);


// var aQuery = function(selector, context) {
//        return  new aQuery.prototype.init();
// }
// aQuery.prototype = {
//     init: function() {
//         return this;
//     },
//     name: function() {
//         return this.age
//     },
//     age: 20
// }
//
// aQuery.prototype.init.prototype = aQuery.prototype;
//
// console.log(aQuery().name()) //20
//
// var a = aQuery("ajfeijf");
// console.log(a instanceof aQuery);
