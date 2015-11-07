// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Ball image
var ballReady = false;
var ballImage = new Image();
ballImage.onload = function () {
  ballReady = true;
};

ballImage.src = "images/monster.png";

//brick image
var brickReady = false;
var brickImage = new Image();
brickImage.onload = function() {
  brickReady = true;
};

brickImage.src = "images/monster.png";

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

function brick(health, x, y) {
  this.health = health;
  this.x = x;
  this.y = y;
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
	for( var i = 0; i < 10; i++ ) {
	  var b = new brick(3, i * ( canvas.width / 10 ), 50 );
	  brickArray[i] = b;
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
	if ( 32 in keysDown && !ballMoving ) {
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
	for( var i = 0; i < 10; i++) {
	  var b = brickArray[i];
	  if( ball.x <= (b.x + 32)
	      && b.x <= (ball.x + 32)
	      && ball.y <= (b.y + 32)
	      && b.y <= (ball.y + 32) ) {
	    ballMovingUp = false;
	  }
	}
	if( ball.x <= (hero.x + 32)
	    && hero.x <= (ball.x + 32)
	    && ball.y <= (hero.y + 32)
	    && hero.y <= (ball.y + 32)) {
	  ball.xSpeed = (hero.x -  ball.x) / 10;
	  ballMovingUp = true;
	}

	if( ball.y <= 0 || ball.y >= canvas.height ) {
	  ballMovingUp = !ballMovingUp;
	}
	if (ball.x <= 0 || ball.x >= canvas.width ) {
	  ball.xSpeed = -ball.xSpeed;
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
	  ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
	  ctx.drawImage(heroImage, hero.x, hero.y);
	}
	if (ballReady && !ballMoving) {
	  ctx.drawImage(ballImage, hero.x, hero.y - 36);
	  ball.x = hero.x;
	  ball.y = hero.y - 36;
	}
	else if ( ballMoving && ballReady ) {
	  ctx.drawImage(ballImage, ball.x, ball.y);
	}
	if (brickReady) {
	  for( var i = 0; i < 10; i++){
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
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
