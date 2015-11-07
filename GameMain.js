var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Change these to get the current window height/width
canvas.width = document.body.clientHeight;
canvas.height = document.body.clientWidth;
document.body.appendChild(canvas);

// Images if needed
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};

bgImage.src = "images/imgurl.png";

// Game Objects

var paddle = {
  speed: 20;
  x: 0,
  y: 0,
  lives: 3
};

var brick = {
  x: 0,
  y: 0,
  hits: 3
};


// Keyboard Controls

var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false );

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);


// Start the game/reset
var start = function () {
  paddle.x = canvas.width / 2;
  padd.y = 0;

  // Set up the bricks here
};

var update = function() {
  if ( 37 in keysDown ) { // left
    paddle.x -= paddle.speed;
  }
  if (39 in keysDown ) { // right
    paddle.x += paddle.speed; 
  }

  // Need colision code here
};

// Render things
var render = function () {
  if (bgRead) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (paddleReady) {
    ctx.drawImage(paddleImage, paddle.x, paddle.y );
  }

  // Render scoreboard as well

};

// Main game loop

var main = function () {
  var now = Date.now();
  var delta = now - time;
  update( delta / 1000 );
  render();
  then = now;

  requestAnimationFrame(main);
};

var then = Date.now();
start();
main();





