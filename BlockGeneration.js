/* Blocks and stuff */

var colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

var $ = jQuery;
var w = $('body').width();

var baseBlock = {
  "position":"absolute",
  "height":"30px",
  "width":"100px",
  "z-index": "420",
  "overflow": "hidden",
  "box-shadow": "5px 5px 5px"
};

var assignColor = function(){
  return colors[Math.floor(Math.random() * 6)];
}

var createBlockFromElement = function($el, Xoffset, Yoffset, color) {
  var blockProps = {
    "background-color":color // set to assignColor later
  };
  console.log($el);
  var $block = $('<div/>');
  $block.appendTo('body');
  $block.html($el.html());
  $block.css($.extend(baseBlock, blockProps));
  $block.animate({    
    "left":Xoffset,
    "top":Yoffset
  }, 1738);
  $el.remove();
}

var xoff = 5;
var yoff = 5;

$('a').each(function(idx, el){
  var $el = $(el);
  var color = assignColor();
  console.log(color);
  createBlockFromElement($el, xoff, yoff, assignColor());
  xoff += 135;
  if(xoff > w){
    yoff += 50;
    xoff = 5;
  }
});

/* Game Logic */
