 //---------------------------------------------Global Variables-----------------------------//
 // Create the canvas
 //New js and html page for new idea for game
 var canvas = document.createElement("canvas");
 canvas.width = 800;
 canvas.height = 600;

 document.body.appendChild(canvas);
 var ctx = canvas.getContext("2d");
 //Frames per second
 var FPS = 30;
 //key handling: keysDown = all keys pressed. Listeners add/subtract from it
 var keysDown = {};
 var entityList = new Array();
 var menuStates = ["Main", "Game", "Pause", "Scores", "Credits", "Howto"];
 var gameState = "Main";
 addEventListener("keydown", function(e) {
 	keysDown[e.keyCode] = true;
}, false);
 addEventListener("keyup", function(e) {
 	delete keysDown[e.keyCode];
 }, false);

 /*
-For 0.0.1.0: Start Menu, Goal, Character, Enemies, Get projectiles working, Sounds

-Menus/Diff Screens
	Level Select
-Key Pattern System
-Tetris
-Bullet Hell Game
-Platformer
-Simulator
-ZTD/Tanks
-Collisions
	Take from Lasagna Town
-Graphics and Audio
-Enemy spawns
	be able to remove and add from array.
-Entities
	-Knight: Fix ground collision
	-Enemies: Shoot and make multiple
	-Enemies: Hardcode patterns then just call them?
-Boss
-Projectile
	figure out how to make multiple on screen
	figure out how to specify patterns
	
	?var bullets = [ //for Tanks
    [xpos, ypos, radian], // first bullet
    [xpos, ypos, radian], // second bullet
    [xpos, ypos, radian]  // third bullet
	]
	speed = 5.0; // pixels per tick
	xVelocity = speed * cos(radian);
	yVelocity = speed * sin(radian);

-Animations, add alpha
-Scrolling background?

128,174
*/

/*
New Project Idea
Tetris:

*/
 var timer = 0;
 var counter = 0;
 var score = 0;
 var canShoot = true; //boolean for laser being shot
 var ecanShoot = true;
 var summoned = false;
 var groundLevel = canvas.height;
 var mMod = 1.0; //Will be used to modify speeds
 var gameWin = false;
 var gameOver = false;
 var lives = 5;
 var gameRunning = false;
 var blindMode = false;
 var flip = false;
 var rebinded = false;
 var shiftValue = 0;

 //Spawning
 var spawnedEnemies = 0;
 var spawn = false;

 //----------------------------------------------Images--------------------------------------//
 var background = new Image();
 background.src = 'spiral.jpg';
 var scrollBG = new Image();
 scrollBG.src = 'longwall.jpg';
 var win = new Image();
 win.src = 'gamewin.jpg';
 var loss = new Image();
 loss.src = 'gameover.jpg';
 var tetrinoT1 = new Image();
 tetrinoT1.src = 'tetrinoT1.png';
 var tetrinoT2 = new Image();
 tetrinoT2.src = 'tetrinoT1.png';
 var tetrinoT3 = new Image();
 tetrinoT3.src = 'tetrinoT1.png';
 var tetrinoT4 = new Image();
 tetrinoT4.src = 'tetrinoT1.png';

 var gar = new Image();
 gar.src = 'Garfield.bmp';
 var las = new Image();
 las.src = 'lasagna.jpg';
 var laslaser = new Image();
 laslaser.src = 'laser2.png';
 var knightly = new Image();
 knightly.src = 'knight.jpg';
 var odie = new Image();
 odie.src = 'odie.png';

 var monday = new Image();
 var monday_center = new Image();
 monday.src = 'monday.jpg';
 monday_center.src = 'monday_center.jpg';
 var drone = new Image();
 drone.src = 'star1.png';
 
 //Sounds
 var eatingone = new buzz.sound("eating1.wav");
 var eatingtwo = new buzz.sound("eating2.wav");

 //----------------------------------------------Player--------------------------------------//
 var player = {
 	color: "orange",
 	x: 100,
 	y: 100,
 	width: 40,
 	height: 40,
 	isLeft: false,
 	isRight: false,
 	isTop: false,
 	isBot: false,
 	tag: "player",
 	draw: function() {
 		//ctx.fillStyle = this.color;
 		// Using width/2 and height/2 so the x and y coordinates are at the player's center. Otherwise stuff is drawn from the top left corner
 		ctx.drawImage(gar, this.x - this.width / 2, this.y - this.height / 2);
 	},
 	respawn: function() {
 		this.x = canvas.width / 2;
 		this.y = 400;
		lives--;
 	},
	
	reset: function(){
		this.x = 100;
		this.y = 100;
	 	this.isLeft = false;
	 	this.isRight = false;
	 	this.isTop = false;
	 	this.isBot = false;
	},
 };
 //entityList[0] = player;

 var laser = {
 	color: "red",
 	x: -100,
 	y: -100,
 	width: 10,
 	height: 15,
 	isShot: false,
 	tag: "aprojectile",
 	draw: function() {
 		//The reason you had the if statement before was because of the static location
 		//ctx.fillStyle = this.color;
 		if (canShoot) {
 			if (this.y > 0) this.isShot = false;
 			if (this.isShot == true) {
 				this.x = player.x;
 				this.y = player.y
 				//ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
 				ctx.drawImage(laslaser, this.x - this.width / 2, this.y - this.height / 2);
 				this.isShot = false;
 			} else {
 				this.y -= 10;
 				//ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
 				ctx.drawImage(laslaser, this.x - this.width / 2, this.y - this.height / 2);
 			}
 		}
 	},
 	rearm: function() {
 		this.isShot = false;
 		this.x = -100;
 		this.y = -100;
 	},
	reset: function(){
		this.x = 600;
		this.y = 550;
	 	this.isShot = false;
	},
 };

 var laser2 = {
 	color: "red",
 	x: -100,
 	y: -100,
 	width: 5,
 	height: 15,
 	isShot: false,
 	tag: "aprojectile",
 	draw: function() {
 		ctx.fillStyle = this.color;
 		if (canShoot) {
 			if (this.y > 0) this.isShot = false;
 			if (this.isShot == true) {
 				this.x = player.x;
 				this.y = player.y;
 				ctx.drawImage(laslaser, this.x - this.width / 2, this.y - this.height / 2);
 				this.isShot = false;
 			} else {
 				this.y -= 3;
 				this.x -= 3;
 				//this.y += 3; //For if I change it to eProjectile
 				ctx.drawImage(laslaser, this.x - this.width / 2, this.y - this.height / 2);
 			}
 		}
 	},
 	rearm: function() {
 		this.isShot = false;
 		this.x = -100;
 		this.y = -100;
 	},
	reset: function(){
		this.x = 600;
		this.y = 550;
	 	this.isShot = false;
	},

 };
 //entityList[4] = laser2;
 //entityList[3] = laser;

 var player2 = {
 	color: "red",
 	x: 150,
 	y: 150,
 	dx: 1,
 	dy: 1,
 	width: 20,
 	height: 20,
	intTimer: 5,
	isActive: false,
 	tag: "lasagna",
 	draw: function() {
 		ctx.fillStyle = this.color;
 		// Using width/2 and height/2 so the x and y coordinates are at the player's center. Otherwise stuff is drawn from the top left corner
 		ctx.drawImage(las, player2.x - player2.width / 2, player2.y - player2.height / 2);
 		if (this.x - this.width == 0) this.dx = 1;
 		if (this.x + this.width == canvas.width) //Maybe methodize this?
 			this.dx = -1;
 		if (this.y - this.height == 0) this.dy = 1;
 		if (this.y + this.height == canvas.height) this.dy = -1;
 	},
	respawn:function(){
		//Use RNG to determine placement of lasagna
		//Could use some algorithm involving player position
		var positionX = Math.floor((Math.random()*canvas.width)+1);
		var positionY = Math.floor((Math.random()*canvas.height)+1);
		this.x = positionX;
		this.y = positionY;
		this.isActive = true;
	},
	reset:function(){
		this.x = -30;
		this.y = -30;
		this.isActive = false;
		score++;
	},
	changeDif:function(level){
		this.intTimer = this.intTimer - level;
	},
	
 };
 entityList[0] = player2;
 spawnedEnemies++;

 var player3 = {
  	color: "red",
  	x: 300,
  	y: 50,
  	dx: 1,
  	dy: 1,
  	width: 20,
  	height: 20,
 	intTimer: 5,
 	isActive: false,
  	tag: "lasagna",
  	draw: function() {
  		ctx.fillStyle = this.color;
  		// Using width/2 and height/2 so the x and y coordinates are at the player's center. Otherwise stuff is drawn from the top left corner
  		ctx.drawImage(las, player3.x - player3.width / 2, player3.y - player3.height / 2);
  		if (this.x - this.width == 0) this.dx = 1;
  		if (this.x + this.width == canvas.width) //Maybe methodize this?
  			this.dx = -1;
  		if (this.y - this.height == 0) this.dy = 1;
  		if (this.y + this.height == canvas.height) this.dy = -1;
  	},
 	respawn:function(){
 		//Use RNG to determine placement of lasagna
 		//Could use some algorithm involving player position
 		var positionX = Math.floor((Math.random()*canvas.width)+1);
 		var positionY = Math.floor((Math.random()*canvas.height)+1);
 		this.x = positionX;
 		this.y = positionY;
 		this.isActive = true;
 	},
 	reset:function(){
 		this.x = -30;
 		this.y = -30;
 		this.isActive = false;
 		score++;
 	},
 	changeDif:function(level){
 		this.intTimer = this.intTimer - level;
 	},
 	
 };
 entityList[1] = player3;
 spawnedEnemies++;

 var enemy1 = {
 	color: "black",
 	x: 250,
 	y: -100,
 	dx: 4.0,
 	dy: -4.0,
 	width: 38,
 	height: 38,
 	tag: 'enemy',
 	isLeft: false,
 	isRight: false,
 	isTop: false,
 	isBot: false,

 	draw: function() {
 		ctx.fillStyle = this.color;
 		ctx.drawImage(drone, this.x - this.width / 2, this.y - this.height / 2);
 		if (this.y >= canvas.height) this.respawn();
 	},
 	mover: function() {
 		this.y += 3;
 	},
 	respawn: function() {
 		this.x = 250;
 		this.y = -100;
 		score++;
 	},
	reset: function(){
		this.x = 250;
		this.y = -100;
	 	this.dx = 4.0;
		this.dy = -4.0;
		this.isLeft = false;
		this.isRight = false;
		this.isTop = false;
		this.Bot = false;
	},
 };
 //entityList[3] = enemy1;
 //spawnedEnemies++;
 /*for(var s = 5; s < 10;s++){
	entityList[s] = enemy1;
	entityList[s].x = 100 + ((s - 4) * 50);
	console.log(entityList[s].x);
} //Not working, all arent moving either*/


 var knight = {
 	color: "teal",
 	x: 150,
 	y: 250,
 	dx: 4.0,
 	dy: -4.0,
 	width: 20,
 	height: 20,
 	tag: 'player',
 	//Could put booleans into an array?
 	isLeft: false,
 	isRight: false,
 	isTop: false,
 	isBot: false,
 	mayJumpAgain: true,
 	isKnightOnGround: false,
 	draw: function() {
 		ctx.fillStyle = this.color;
 		// Using width/2 and height/2 so the x and y coordinates are at the player's center. Otherwise stuff is drawn from the top left corner
 		ctx.drawImage(knightly, this.x - this.width / 2, this.y - this.height / 2);
		//ctx.drawImage(gar, this.x - this.width / 2, this.y - this.height / 2);
 	},
 	respawn: function() {
 		this.x = 100;
 		this.y = 100;
 	},
 	isPlayerOnGround: function() {
 		if (this.y + this.height < groundLevel) this.isKnightOnGround = false;
 		else //If player is on the ground then return true
 		this.isKnightOnGround = true;
 	},
	reset: function(){
		this.x = 150;
		this.y = 250;
	 	this.dx = 4.0;
		this.dy = -4.0;
	 	this.isLeft = false;
	 	this.isRight = false;
	 	this.isTop = false;
	 	this.isBot = false;
	 	this.mayJumpAgain = true;
	 	this.isKnightOnGround = false;
	},
 };
 entityList[2] = knight;

 var tetrino = {
	
	color:'red',
	x:400,
	y:50,
	dx: 2.0,
	dy: -2.0,
	width: 20,
	height: 20,
	pieces: {},
	tag: 'tetrino',
	isOnGround: false,
	draw: function(){
		ctx.fillStyle = this.color;
 		// Using width/2 and height/2 so the x and y coordinates are at the player's center. Otherwise stuff is drawn from the top left corner
 		ctx.drawImage(tetrino1, this.x - this.width / 2, this.y - this.height / 2);
	},
	respawn: function() {
 		this.x = 400;
 		this.y = 50;
 	},
 	isPieceOnGround: function() {
 		if (this.y + this.height <= 575) this.isOnGround = false;
 		else //If player is on the ground then return true
 		this.isOnGround = true;
 	},
 };
 entityList[3] = tetrino;

 //------------------------------------------------Key Actions-------------------------------//
 var keys = function() {
 	//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
 	/*if (39 in keysDown && player.isBot == false) player.x += 10; //Arrow Keys
 	if (38 in keysDown && player.isLeft == false) player.y -= 10;
 	if (40 in keysDown && player.isRight == false) player.y += 10;
 	if (37 in keysDown && player.isTop == false) player.x -= 10;*/
	if (37 in keysDown && !tetrino.isOnGround) tetrino.x -= 5;
	if (39 in keysDown && !tetrino.isOnGround) tetrino.x += 5;
 	if (68 in keysDown && knight.isBot == false) knight.x += 10; //Wasd
 	if (87 in keysDown && knight.isLeft == false) knight.y -= 10;
 	if (83 in keysDown && knight.isRight == false) knight.y += 10;
 	if (65 in keysDown && knight.isTop == false) knight.x -= 10;
 	if (79 in keysDown) summoned = true;
 	/*if (90 in keysDown && canShoot == true) {
 		laser2.isShot = true;
 		laser.isShot = true;
 	}*/
	if(gameState == "Main"){
		//if (83 in keysDown) 
			//stateSwitch("Scores"); //Scores - S
		if (67 in keysDown) //Credits - C
			stateSwitch("Credits");
		if (72 in keysDown) //How to - H
			stateSwitch("Howto");
	}
 	if (49 in keysDown) background.src = 'lasagnatown.jpg';
 	if (50 in keysDown) background.src = 'lasagnatownsqr.jpg';
	if (66 in keysDown){ //Blind Mode - B
		 blindMode = true;
	}	
 	/*if (77 in keysDown) {
 		ctx.drawImage(monday, 0, 0);
 		ctx.drawImage(monday_center, 128, 174);
 	}*/
 	if (13 in keysDown) { //Main Menu - Enter
		if(gameState == "Main" || gameState == "Pause")
			stateSwitch("Game");
 	}
	if (80 in keysDown) { //Pause
		if(gameState == "Game")
			stateSwitch("Pause");
	}
	if(27 in keysDown){ //Menu - Escape
	
		//If gameWin then escape returns to the Main
		//If escape is pressed during game then nothing
		//If escape is basically pressed anywhere else then go to Main
 		if (gameWin == true) {
 			stateSwitch("Main");
			resetGame();
 		}
 		if (gameRunning == false) {
 			stateSwitch("Main");
			resetGame();
 		}
	}
 };
 
 var stateSwitch = function(state_val){
	var sSwitch = 0;
 		if (state_val == "Main") sSwitch = 0;
 		if (state_val == "Game") sSwitch = 1;
 		if (state_val == "Pause") sSwitch = 2;
		if (state_val == "Scores") sSwitch = 3;
		if (state_val == "Credits") sSwitch = 4;
		if (state_val == "Howto") sSwitch = 5;
 		gameState = menuStates[sSwitch];
 };
 
 //------------------------------------------------- Clear the canvas------------------------//
 var clear = function() {
 	ctx.clearRect(0, 0, canvas.width, canvas.height);
 };
 //-------------------------------------------------Utility---------------------------------//
 var resetGame = function() {
	 score = 0;
	 timer = 0;
	 lives = 5;
	 counter = 0;
	 canShoot = true;
	 summoned = false;
	 gameWin = false;
	 gameOver = false;
	 spawnedEnemies = 0;
	 spawn = false;
	 blindMode = false;
	 
	 for(var i = 0; i < entityList.length; i++){
		 entityList[i].reset();
	 }
 };
 
 var keyRebinder = function(shift){
	
	//If X is in keysDown then do what X+shift would do
	//Figure out range of keys / algorithm to shift keys better
	//Figure out how to get code,bool pairs then finish
	for(var i = 0; i < keysDown.length; i++){
		var tempKey = String.fromCharCode(keysDown[i]);
		var tempCode = tempKey.keyCode;
		console.log(tempKey);
		console.log(keysDown[i]);
		tempCode += shift;
		if(tempCell > 90)
			tempCell -= 42;
		delete keysDown[tempCode];
		keysDown[tempCode] = true;
	}
	//Second Idea
	//Figure out how to dynamically map keys
	
 }
 
 
 /*var deltaTime = function(var start, var differ) {
	 //Figure out how much time has past since X time.
	 //Figure out how to keep start constant
	 var delta = timer - start;
	 if(delta == differ)
	 return true;
 };*/
 
 //------------------------------------------------Animate-----------------------------------//
 //This function animates the game
 var flicker = true; //boolean for the flicker
 setInterval(function() {
 	// Clear the canvas so things won't be repeated if moved
 	if (gameWin == false){
		if(gameOver == false) {
 		clear();
 		//Everything that happens on a frame-by-frame basis goes in here:
 		if (gameState == "Main") {
 			ctx.fillStyle = '#4682B4';
 			ctx.fillRect(0, 0, 800, 600);
 			ctx.fillStyle = '#00FFFF';
 			ctx.font = 'italic bold 30px sans-serif';
 			ctx.textBaseline = 'middle';
 			ctx.fillText('PBC', canvas.width / 2 - 50, canvas.height / 2);
 			if (flicker) {
 				ctx.fillText('Press Start', canvas.width / 2 - 100.0, canvas.height / 2 + 50);
 				flicker = false;
 			} else flicker = true;
			
			//randomly assign 48-90, 42
		//shift = Math.floor((Math.random()*42));
			shiftValue = 1;
 			keys();
 		}

 		if (gameState == "Pause") {
			gameRunning = false;
 			ctx.fillStyle = '#708090';
 			ctx.fillRect(0, 0, 800, 600);
 			ctx.fillStyle = '#00FFFF';
 			ctx.font = 'italic bold 30px sans-serif';
 			ctx.textBaseline = 'middle';
 			ctx.fillText('Paused', canvas.width / 2 - 60.0, canvas.height / 2);
 			//keys();
 		}

 		if (gameState == "Game") {
			
			//Jumping?
 			knight.isPlayerOnGround();
 			//if(knight.isKnightOnGround == true){
 			if (knight.y + 100.0 >= groundLevel) {
 				knight.dx *= 0.9;
 				knight.dy = 0;
 				if (32 in keysDown) {
 					if (knight.mayJumpAgain == true) {
 						knight.dy = -10;
 						knight.mayJumpAgain = false;
 					}
 				} else knight.mayJumpAgain = true;
 			}
 			if (knight.y + 100.0 < groundLevel) knight.dy += 0.3;
 			//if(32 in keysDown && knight.y + knight.height >= groundLevel && knight.dy > 0)
				knight.dy -= 0.1;

 			if (knight.dy > 5) knight.dy = 5;
			
 			knight.x += knight.dx;
 			knight.y += knight.dy;
			
			if(knight.x == canvas.width - knight.width)
				knight.x -= knight.dx;
			
			tetrino.isPieceOnGround();
			if(!tetrino.isOnGround)
				tetrino.y++;
				
			gameRunning = true;
 			drawBG();
 			detectCollision();
			//scrollHandler();
			
			shiftValue = 1;
			keyRebinder(shiftValue);
 			keys();

 			// for (var i = 0; i < entityList.length; i++) {
//  				if (entityList[i].tag == 'enemy') entityList[i].mover(); //This works
//  			}
			if(!player2.isActive)
 				player2.respawn();
			if(!player3.isActive)
 				player3.respawn();
 			//enemy1.mover();
 			//enemyList[i].mover()? Possibility make an enemyList, characterList, projectileList?
 			if (summoned) ctx.drawImage(odie, canvas.height / 2 - 16, canvas.width / 2 - 25);
 			drawAll();
 			updateTimer();
 		}
		
		if (gameState == "Scores") {
			ctx.fillStyle = '#4682B4';
 			ctx.fillRect(0, 0, 500, 500);
 			ctx.fillStyle = '#00FFFF';
 			ctx.font = 'italic bold 30px sans-serif';
 			ctx.textBaseline = 'middle';
 			ctx.fillText('Garfield in Lasagna Town',50, 50);
			ctx.fillText('Scores:',50,100);
			for(var i = 0; i < scoreList.length; i++){
				ctx.fillText(scoreList[i],75,(150 + (50*i)));
			}
			//Fix setting up scores
 			
		}
		
		if (gameState == "Credits") {
			ctx.fillStyle = '#4682B4';
 			ctx.fillRect(0, 0, 500, 500);
 			ctx.fillStyle = '#00FFFF';
 			ctx.font = 'italic bold 30px sans-serif';
 			ctx.textBaseline = 'middle';
 			ctx.fillText('Garfield in Lasagna Town',50, 50);
			ctx.fillText('Featuring Garfield',50,100);
			ctx.fillText('Made by Stephen Ferrari',canvas.wdith / 2 - 100, canvas.height / 2);
			
		}
		
		if (gameState == "Howto") {
			ctx.fillStyle = '#4682B4';
 			ctx.fillRect(0, 0, 500, 500);
 			ctx.fillStyle = '#00FFFF';
 			ctx.font = 'italic bold 30px sans-serif';
 			ctx.textBaseline = 'middle';
 			ctx.fillText('Garfield in Lasagna Town',50, 50);
			ctx.fillText('How to Play',50,100);
			ctx.fillText('Use the Arrow Keys to move Garfield around and collect the Lasagna',10,250);
			ctx.fillText('Be hasty though, you only have 30 seconds to collect as much as you can',10,350);
			
		}
		
	}
	keys();
 } 
	else {
 		keys();
 	}

 }, 1000 / FPS);

 var scrolling = 0;
 
 var updateTimer = function() {
 	if (score >= 120) {
 		ctx.drawImage(win, canvas.width / 2 - 200, canvas.height / 2 - 100);
 		gameWin = true;
 	}
	if(lives <= 0){
		gameOver = true;
		ctx.drawImage(loss,canvas.width / 2 - 200, canvas.height / 2 - 100);
	}
	if(timer == 30){
		gameOver = true;
		gameRunning = false;
		ctx.drawImage(loss,canvas.width/2 - 200, canvas.height/2 - 100);
	}
 	counter++;
 	if (counter % 30 == 0) {
 		timer++;
 		//score++;
		//scrolling+=5;
 		counter = 0;
 	}
 };

 var drawBG = function() {
 	ctx.drawImage(background, 0, 0);
	//ctx.drawImage(scrollBG, 0, -500 + scrolling);
 	ctx.lineWidth = "5";
 	ctx.strokeStyle = "black";
 	ctx.strokeRect(0, 0, canvas.width, canvas.height); //For border
 };

 var drawAll = function() {
	 //Make it so entities draw in order.  Ie projectiles > characters > terrain
	if(!blindMode){
 	for (var x = 0; x < entityList.length; x++)
		entityList[x].draw();
	}
	else{
		ctx.fillStyle = '#000000';
		ctx.fillRect(0,0,800,600);
		entityList[0].draw();
	}
 	ctx.fillStyle = '#00FFFF';
 	ctx.font = 'italic bold 30px sans-serif';
 	ctx.textBaseline = 'bottom';
 	ctx.fillText('Score: ' + score, canvas.width / 2 - 80.0, canvas.height);
	ctx.fillText('Time: ' + (30 - timer), 20,40);
 	ctx.fillRect(0, 575, 800, 575);

 };

 var detectCollision = function() {
 	//collision detection
 	//Booleans for noclip?

 	if (entityList.length != 1) {
 		for (var i = 0; i < entityList.length; i++) {
 			for (var j = i + 1; j < entityList.length; j++) {
 				if (detectUnitColl(entityList[i].x, entityList[i].y, entityList[i].width, entityList[i].height, entityList[j].x, entityList[j].y, entityList[j].width, entityList[j].height)) {
 					detectCollHandler(entityList[i], entityList[j]);
 				}
 			}
 		}
 	}

 	//Can turn these bool checks into its own method
 	if (player.x - player.width < 0) player.isTop = true;
 	else player.isTop = false;
 	if (player.x + player.width > canvas.width) player.isBot = true;
 	else player.isBot = false;
 	if (player.y - player.height < 0) player.isLeft = true;
 	else player.isLeft = false;
 	if (player.y + player.height > canvas.height) player.isRight = true;
 	else player.isRight = false;

 	if (knight.x - knight.width < 0) knight.isTop = true;
 	else knight.isTop = false;
 	if (knight.x + knight.width > canvas.width) knight.isBot = true;
 	else knight.isBot = false;
 	if (knight.y - knight.height < 0) knight.isLeft = true;
 	else knight.isLeft = false;
 	if (knight.y + knight.height > groundLevel) //canvas.height)
 	knight.isRight = true;
 	else knight.isRight = false;
 	if (player2.x > canvas.width || player2.y > canvas.height) player2.reset();
	if (player3.x > canvas.width || player3.y > canvas.height) player3.reset();

 };

 var detectUnitColl = function(x1, y1, w1, h1, x2, y2, w2, h2) {
 	w2 += x2;
 	w1 += x1;
 	if (x2 > w1 || x1 > w2) return false;
 	h2 += y2;
 	h1 += y1;
 	if (y2 > h1 || y1 > h2) return false;
 	return true;
 }

 var detectCollHandler = function(unit1, unit2) {
 	//Will handle the type of collision, ie Player to Enemy, Player to power up, Projectile to Enemy etc
 	//Passed in two classes? Compares them, reacts accordingly

 	//Types: Player, Enemy, aProjectile, eProjectile, Item, Lasagna, Boss
 	//Maybe if they don't collide, else move? Have the movement call in detection instead of main
 	//Do I need 'playerenemy' and 'enemyplayer'? Might not because of how the loops works checking the collisions for each object. Better way to do it?

 	var str1 = unit1.tag;
 	var str2 = unit2.tag;
 	var handle = str1.concat(str2);
 	if (handle == "playerenemy") unit1.respawn();
 	if (handle == "enemyplayer") unit2.respawn();
 	if (handle == "aprojectileenemy") {
 		unit2.respawn();
 		unit1.rearm();
 	}
 	if (handle == "enemyaprojectile") {
 		unit1.respawn();
 		unit2.rearm();
 	}
 	if (handle == "playereprojectile") unit1.respawn();
 	if (handle == "eprojectileplayer") unit2.respawn();
 	if (handle == "playerlasagna") unit2.reset();
 	if (handle == "lasagnaplayer") unit1.reset();
 	/*
	if(handle == "playerplayer") //Probably nothing
	if(handle == "playeritem")
		//W/e item does
	if(handle == "itemplayer")
		//W/e item does
	if(handle == "playerboss")
		unit1.respawn();
	if(handle == "bossplayer")
		unit2.respawn();
	*/
 }
 //For Later

 
var scrollHandler = function(){
	if((knight.x + knight.width/2 + 1) >= canvas.width){
		//change to next screen
		knight.x = 5;
		return;
	}
	if((knight.x - knight.width/2 - 1) <= 0){
		//change to previous screen
		knight.x = canvas.width - 5;
		return;
	}
}
 
 /*
function difficulty(){
//as the game progresses, increase magnitude of the
//vertical speed
if(currentScore % 1000 == 0){
if(dy > 0)
dy += 1;
else
dy -= 1;
}
}
function gameOver(){
//end the game by clearing the timer and modifying
//the score label
ctx.fillStyle = '#00FFFF';
ctx.font = 'italic bold 30px sans-serif';
ctx.textBaseline = 'bottom';
ctx.fillText('Game Over: ' + score, canvas.width / 2 - 80.0, canvas.height);
ctx.fillRect(0, 400, 500, 5);
ctx.draw
resetGame();
}*/

 //Spawning
