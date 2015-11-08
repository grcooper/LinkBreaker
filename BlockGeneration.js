/* Blocks and stuff */
/*$(document).ready*/(function () {
var colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

var blocks = [];
var numBlocks = 0;

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
  var $block = $('<div/>');
  $block.appendTo('body');
  $block.html($el.html());
  $block.css($.extend(baseBlock, blockProps));
  $block.animate({    
    "left":Xoffset,
    "top":Yoffset
  }, 1738 );
  $el.remove();
  return $block;
}

var xoff = 5;
var yoff = 5;

$('a').each(function(idx, el){
  var $el = $(el);
  var color = assignColor();
  blocks[numBlocks] = createBlockFromElement($el, xoff, yoff, assignColor());
  numBlocks++;
  xoff += 135;
  if(xoff > w){
    yoff += 50;
    xoff = 5;
  }
});

var h = $('body').height();
/* Game Logic */

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = w;
canvas.height = 400 > h ? 400 : h;
document.body.appendChild(canvas);

// Game objects
var hero = {
  speed: 256, 
  xSize: 100,
  ySize: 30
};

var ball = {
  xSpeed: 0,
  ySpeed: 5,
  xSize: 32,
  ySize: 32,
  x: 1000,
  y: 1000
};

function brick(health, x, y, block) {
  this.health = health;
  this.x = x;
  this.y = y;
  this.block = block;
  this.xSize = 100;
  this.ySize = 30;
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
  hero.y = canvas.height - hero.xSize;
  for( var i = 0; i < numBlocks; i++ ) {
    blocks[i].show();
    var offset = blocks[i].offset();
    var b = new brick(2, offset.left, offset.top, blocks[i] );
    brickArray[i] = b;
  }
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
  var numDead = 0;
  for( var i = 0; i < numBlocks; i++) {
    var b = brickArray[i];
    if ( b.health <= 0 ) {
      b.block.hide();
      b.x = -100;
      b.y = -100;
      numDead++;
      if( numDead >= numBlocks ) {
        reset();
        return;
      }
    }
    if( ball.x <= (b.x + b.xSize)
        && b.x <= (ball.x + ball.xSize)
        && ball.y <= (b.y + b.ySize)
        && b.y <= (ball.y + ball.xSize) ) {
      ballMovingUp = false;
      b.health--;
    }
  }
  if( ball.x <= (hero.x + hero.xSize)
      && hero.x <= (ball.x + ball.xSize)
      && ball.y <= (hero.y + hero.ySize)
      && hero.y <= (ball.y + ball.ySize)) {
    ball.xSpeed = (hero.x -  ( ball.x - (hero.xSize - ball.xSize)/2)) / 10;
    ballMovingUp = true;
  }
  if( ball.y > canvas.height ) {
    reset();
  }
  if( ball.y <= 0 ) {
    ballMovingUp = !ballMovingUp;
  }
  if (ball.x <= 0 || ball.x + ball.xSize >= canvas.width ) {
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
    ctx.beginPath();
    ctx.rect(hero.x, hero.y, hero.xSize, hero.ySize);
    ctx.stroke();
  }
  if (!ballMoving) {
    ball.x = hero.x + (hero.xSize - ball.xSize)/2;
    ball.y = hero.y - ball.ySize;
  }
  if(ballReady) {
    ctx.beginPath();
    ctx.rect(ball.x, ball.y, ball.xSize, ball.ySize); 
    ctx.stroke();
  }
  
  if (brickReady) {
    for( var i = 0; i < numBlocks; i++){
      var b = brickArray[i];
      ctx.beginPath();
      ctx.rect(b.x,b.y,b.xSize,b.ySize);
      ctx.stroke()
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
$(":animated").promise().done(function() {
    reset();
    main();
});

})();


