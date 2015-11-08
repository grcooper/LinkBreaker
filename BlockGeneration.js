/* Blocks and stuff */
$(document).ready(function () {
var colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

var blocks = [];
var numBlocks = 0;

var $ = jQuery;
var w = $('body').width();
var h = $('body').height();

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
  }, 1738, function(){
    reset();
    main();
  });
  $el.remove();
  return $block;
}

var xoff = 5;
var yoff = 5;

$('a').each(function(idx, el){
  var $el = $(el);
  var color = assignColor();
  console.log(color);
  blocks[numBlocks] = createBlockFromElement($el, xoff, yoff, assignColor());
  numBlocks++;
  xoff += 135;
  if(xoff > w){
    yoff += 50;
    xoff = 5;
  }
});
/* Game Logic */

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = w;//$(document).width;
canvas.height = 400;//h;//$(document).height;
console.log(canvas.width + " " + canvas.height);
console.log(w + " " + h);
document.body.appendChild(canvas);

/*// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/background.png";*/

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = "http://www.stickylife.com/images/u/78ba77768fe749bead0d52bf596117d1-50.png";

// Ball image
var ballReady = false;
var ballImage = new Image();
ballImage.onload = function () {
  ballReady = true;
};

ballImage.src = "http://ecx.images-amazon.com/images/I/01ufnXgq5RL._SS36_.jpg";

//brick image
var brickReady = false;
var brickImage = new Image();
brickImage.onload = function() {
  brickReady = true;
};

brickImage.src = "http://scrawl.bplaced.net/perm/bar.png";

// Game objects
var hero = {
  speed: 256 // movement in pixels per second
};

var ball = {
  xSpeed: 0,
  ySpeed: 5,
  x: 0,
  y: 0
};

function brick(health, x, y, block) {
  this.health = health;
  this.x = x;
  this.y = y;
  this.block = block;
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

var ballMoving = false;
var ballMovingUp = true;
var brickArray = [];

// Reset the game when the player catches a monster
var reset = function () {
  ballMoving = false;
  hero.x = canvas.width / 2;
  hero.y = canvas.height - 36;
  for( var i = 0; i < numBlocks; i++ ) {
    var offset = blocks[i].offset();
    console.log(blocks[i].offset());
    console.log(offset.left);
    var b = new brick(2, offset.left, offset.top, blocks[i] );
    brickArray[i] = b;
    blocks[i].show();
    console.log(blocks[i]);
    console.log(b);
  }
  console.log(brickArray);
};

// Update game objects
var update = function (modifier) {
  if ( 37 in keysDown) { // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if ( 39 in keysDown) { // Player holding right
    hero.x += hero.speed * modifier;
  }
  if ( 38 in keysDown && !ballMoving ) {
    ballMoving = true;
  }
  if ( ballMoving ) {
    ball.x -= ball.xSpeed;
    if (ballMovingUp ) {
      ball.y -= ball.ySpeed;
    }
    else {
      ball.y += ball.ySpeed;
    }
  }
// collision
  for( var i = 0; i < numBlocks; i++) {
    var numDead = 0;
    var b = brickArray[i];
    if ( b.health <= 0 ) {
      b.x = -100;
      b.y = -100;
      numDead++;
      b.block.hide();
      if( numDead == numBlocks ) {
        reset();
      }
    }
    if( ball.x <= (b.x + 32)
        && b.x <= (ball.x + 36)
        && ball.y <= (b.y + 32)
        && b.y <= (ball.y + 36) ) {
      ballMovingUp = false;
      b.health--;
      console.log("hit");
    }
  }
  if( ball.x <= (hero.x + 50)
      && hero.x <= (ball.x + 36)
      && ball.y <= (hero.y + 20)
      && hero.y <= (ball.y + 36)) {
    ball.xSpeed = (hero.x -  ( ball.x - 7)) / 10;
    ballMovingUp = true;
  }
  if( ball.y > canvas.height ) {
    reset();
  }
  if( ball.y <= 0 ) {
    ballMovingUp = !ballMovingUp;
  }
  if (ball.x <= 0 || ball.x + 36 >= canvas.width ) {
    ball.xSpeed = -ball.xSpeed;
  }
};

// Draw everything
var render = function () {
  /*if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }*/
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }
  if (ballReady && !ballMoving) {
    ctx.drawImage(ballImage, hero.x + 7, hero.y - 36);
    ball.x = hero.x + 7;
    ball.y = hero.y - 36;
  }
  else if ( ballMoving && ballReady ) {
    ctx.drawImage(ballImage, ball.x, ball.y);
  }
  if (brickReady) {
    for( var i = 0; i < numBlocks; i++){
      var b = brickArray[i];
      ctx.drawImage(brickImage, b.x, b.y );
    }
  }
};

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var win = window;
requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame || win.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();

});
