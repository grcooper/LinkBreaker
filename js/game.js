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

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};

var ball = {
  xSpeed: 256,
  ySpeed: 256,
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height - 20;
};

// Update game objects
var update = function (modifier) {
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	// collision
};

// Draw everything
var render = function () {
	if (bgReady) {
	  ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
	  ctx.drawImage(heroImage, hero.x, hero.y);
	}
	if (ballReady) {
	  ctx.drawImage(ballImage, hero.x, hero.y);
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
