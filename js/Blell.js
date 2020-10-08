 //---------------------------------------------Global Variables-----------------------------//
 // Create the canvas
 var canvas = document.createElement("canvas");
 canvas.width = 500;
 canvas.height = 500;
 document.body.appendChild(canvas);
 var ctx = canvas.getContext("2d");
 //Frames per second
 var FPS = 30;
 //key handling: keysDown = all keys pressed. Listeners add/subtract from it
 var keysDown = {};
 var entityList = new Array();
 var lasagnaList = new Array();
 var scoreList = new Array();
 var menuStates = ["Main", "Game1", "Game2", "Pause", "Scores", "Credits", "Howto"];
 var gameState = "Main";
 addEventListener("keydown", function(e) {
 	keysDown[e.keyCode] = true;
 }, false);
 addEventListener("keyup", function(e) {
 	delete keysDown[e.keyCode];
 }, false);
 /*
-Graphics Overhaul
-Persistent Scorescreen
-Sounds
	eating, music
-Test Lasagna++ Bug
-Background Image
-Slow down animation cycle
-Animate Left movement
-Wall collision bug

*/

var timer = 60;
var counter = 0;
var score = 0;
var summoned = false;
var mMod = 1.0; //Will be used to modify speeds
var gameWin = false;
var gameOver = false;
var gameRunning = false;
var blindMode = false;
var newLasagnaChecker = true;

//Spawning
var spawnedEnemies = 0;
var spawn = false;

//----------------------------------------------Images--------------------------------------//
var background = new Image();
background.src = 'images/lasagnatown.jpg';
var win = new Image();
win.src = 'images/gamewin.jpg';
var loss = new Image();
loss.src = 'images/gameover.jpg';

var gar = new Image();
gar.src = 'images/Garfield.bmp';
var garfieldSpriteSheet = new Image();
garfieldSpriteSheet.src = 'images/garfSpriteSheet.png'
var las = new Image();
las.src = 'images/lasagna.jpg';
var odie = new Image();
odie.src = 'images/odie.png';

var monday = new Image();
var monday_center = new Image();
monday.src = 'images/monday.jpg';
monday_center.src = 'images/monday_center.jpg';

//Sounds
var eatingone = new buzz.sound("sounds/eating1.wav");
var eatingtwo = new buzz.sound("sounds/eating2.wav");

 //----------------------------------------------Player--------------------------------------//
 var player = {
 	color: "orange",
 	x: 100,
 	y: 100,
 	width: 50,
 	height: 50,
	active: true,
 	isLeft: false,
 	isRight: false,
 	isTop: false,
 	isBot: false,
	isStopped: true,
	isMovingL: false,
	isMovingR: false,
 	tag: "player",
	combotimer: 3,
	combomultiplier: 1,
	frameSize: 59,
	xpos: 45,
	ypos: 118,
	index: 0,
	numFrames: 8,
 	draw: function() {
 		//ctx.fillStyle = this.color;
 		// Using width/2 and height/2 so the x and y coordinates are at the player's center. Otherwise stuff is drawn from the top left corner
 		//ctx.drawImage(gar, this.x - this.width / 2, this.y - this.height / 2);
		if(this.isStopped){
			ctx.drawImage(garfieldSpriteSheet,0, this.ypos, this.frameSize-10, this.frameSize, this.x - this.width/2, this.y - this.height/2, this.frameSize-10,this.frameSize);
		}
		if(this.isMovingR){
			ctx.drawImage(garfieldSpriteSheet, this.xpos, this.ypos, this.frameSize, this.frameSize, this.x - this.width/2, this.y - this.height/2, this.frameSize, this.frameSize);
			
			this.xpos += this.frameSize;
			this.index += 1;
			if (this.index >= this.numFrames) {
				this.xpos =45;
				this.ypos =118;
				this.index=0;			
			} else if (this.xpos + this.frameSize > garfieldSpriteSheet.width){
				this.xpos =45;
				this.ypos += this.frameSize;
			}
		}
		if(this.isMovingL){
			ctx.drawImage(garfieldSpriteSheet, this.xpos, this.ypos, this.frameSize, this.frameSize, this.x - this.width/2, this.y - this.height/2, this.frameSize, this.frameSize);
			
			this.xpos += this.frameSize;
			this.index += 1;
			if (this.index >= this.numFrames) {
				this.xpos =45;
				this.ypos =118;
				this.index=0;			
			} else if (this.xpos + this.frameSize > garfieldSpriteSheet.width){
				this.xpos =45;
				this.ypos += this.frameSize;
			}
		}
 	},
 	respawn: function() {
 		this.x = canvas.width / 2;
 		this.y = 400;
 		lives--;
 	},
	update: function(){
		//Do something
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
 entityList[0] = player;
 
 //trying out lasagna prototyping
 function Lasagn(I) {
          I = I || {};

          I.active = true;          
          I.color = "red";
          I.x = -50;
          I.y = -50;
          I.width = 20;
          I.height = 20;
		  I.intTimer = 2;
		  I.tag = "lasagna";

          //I.sprite = Sprite("enemy");

          I.draw = function() {
			ctx.fillStyle = this.color;
			// Using width/2 and height/2 so the x and y coordinates are at the player's center. Otherwise stuff is drawn from the top left corner
			//ctx.fillRect(I.x - I.width/2, I.y - I.height/2, I.width, I.height);
			ctx.drawImage(las, I.x - I.width / 2, I.y - I.height / 2);
          };

          I.update = function() {
				if(this.intTimer != 0){
					this.intTimer--;
				}
				else{
					this.active = false;
					// Extra Credit: Add an explosion graphic
					//Use RNG to determine placement of lasagna
					//Could use some algorithm involving player position
					var positionX = Math.floor((Math.random()*500)+1);
					var positionY = Math.floor((Math.random()*500)+1);
					this.x = positionX;
					this.y = positionY;
					this.intTimer = 2;
				}
          };
		I.reset = function() {
            //Sound.play("explosion");
			//ie respawn
            this.active = false;
				// Extra Credit: Add an explosion graphic
				//Use RNG to determine placement of lasagna
			//Could use some algorithm involving player position
			var positionX = Math.floor((Math.random()*500)+1);
			var positionY = Math.floor((Math.random()*500)+1);
			this.x = positionX;
			this.y = positionY;
			eatingone.play();
			score = score + player.combomultiplier;
			newLasagnaChecker = true;
			player.combomultiplier++;
			player.combotimer = 3;
        };
		
        I.explode = function() {
            //Sound.play("explosion");
			//ie respawn
            this.active = false;
				// Extra Credit: Add an explosion graphic
				//Use RNG to determine placement of lasagna
			//Could use some algorithm involving player position
			var positionX = Math.floor((Math.random()*500)+1);
			var positionY = Math.floor((Math.random()*500)+1);
			this.x = positionX;
			this.y = positionY;
			eatingone.play();
        };

          return I;
        };
		
		
/*
 var lasagna1 = {
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
 		ctx.drawImage(las, lasagna1.x - lasagna1.width / 2, lasagna1.y - lasagna1.height / 2);
 		if (this.x - this.width == 0) this.dx = 1;
 		if (this.x + this.width == canvas.width) //Maybe methodize this?
 			this.dx = -1;
 		if (this.y - this.height == 0) this.dy = 1;
 		if (this.y + this.height == canvas.height) this.dy = -1;
 	},
 	respawn:function(){
		//Use RNG to determine placement of lasagna
		//Could use some algorithm involving player position
		var positionX = Math.floor((Math.random()*500)+1);
		var positionY = Math.floor((Math.random()*500)+1);
		this.x = positionX;
		this.y = positionY;
		this.isActive = true;
		eatingone.play();
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
//entityList[1] = lasagna1;
spawnedEnemies++;

var lasagna2 = {
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
  		ctx.drawImage(las, lasagna2.x - lasagna2.width / 2, lasagna2.y - lasagna2.height / 2);
  		if (this.x - this.width == 0) this.dx = 1;
  		if (this.x + this.width == canvas.width) //Maybe methodize this?
  			this.dx = -1;
  		if (this.y - this.height == 0) this.dy = 1;
  		if (this.y + this.height == canvas.height) this.dy = -1;
  	},
  	respawn:function(){
 		//Use RNG to determine placement of lasagna
 		//Could use some algorithm involving player position
 		var positionX = Math.floor((Math.random()*500)+1);
 		var positionY = Math.floor((Math.random()*500)+1);
 		this.x = positionX;
 		this.y = positionY;
 		this.isActive = true;
 		eatingtwo.play();
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
 //entityList[2] = lasagna2;
 spawnedEnemies++;
*/
 //------------------------------------------------Key Actions-------------------------------//
 var keys = function() {
 	//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
	player.isStopped = true;
	player.isMovingR = false;
	player.isMovingL = false;
 	if (39 in keysDown && player.isBot == false){ player.x += 10; player.isMovingR = true; player.isMovingL = false; player.isStopped = false;}//Arrow Keys
 	if (38 in keysDown && player.isLeft == false){ player.y -= 10; player.isMovingL = true; player.isMovingR = false; player.isStopped = false;}
 	if (40 in keysDown && player.isRight == false){ player.y += 10; player.isMovingR = true; player.isMovingL = false; player.isStopped = false;}
 	if (37 in keysDown && player.isTop == false){player.x -= 10; player.isMovingL = true; player.isMovingR = false; player.isStopped = false;}
 	//if (79 in keysDown) summoned = true;
 	if(gameState == "Main"){
 		if (83 in keysDown) 
			stateSwitch("Scores"); //Scores - S
		if (67 in keysDown)
			stateSwitch("Credits"); // - C
		if (72 in keysDown) 
			stateSwitch("Howto"); // - H
	}
	if (17 in keysDown){
		if(49 in keysDown) stateSwitch("Game1");
		if(50 in keysDown) stateSwitch("Game2");
	}
	else{
	if (49 in keysDown) background.src = 'images/lasagnatown.jpg';
	if (50 in keysDown) background.src = 'images/lasagnatownsqr.jpg';
	}
	if (66 in keysDown){
		blindMode = true;
	}	
 	/*if (77 in keysDown) {
 		ctx.drawImage(monday, 0, 0);
 		ctx.drawImage(monday_center, 128, 174);
 	}*/
 	if (13 in keysDown) { //Main Menu - Enter
 		if(gameState == "Main"){
 			stateSwitch("Game1");
			startGame();
		}
		if(gameState == "Pause")
			stateSwitch("Game1");
 	}
	if (80 in keysDown) { //Pause
		if(gameState == "Game1" || gameState == "Game2")
			stateSwitch("Pause");
	}
	if(27 in keysDown){ //Menu - Escape

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
	if (state_val == "Game1") sSwitch = 1;
	if (state_val == "Game2") sSwitch = 2;
	if (state_val == "Pause") sSwitch = 3;
	if (state_val == "Scores") sSwitch = 4;
	if (state_val == "Credits") sSwitch = 5;
	if (state_val == "Howto") sSwitch = 6;
	gameState = menuStates[sSwitch];
};

 //------------------------------------------------- Clear the canvas------------------------//
 var clear = function() {
 	ctx.clearRect(0, 0, canvas.width, canvas.height);
 };
 //-------------------------------------------------Utility---------------------------------//
 var resetGame = function() {
	 //score = 0;
	 timer = 60;
	 lives = 5;
	 counter = 0;
	 canShoot = true;
	 summoned = false;
	 gameWin = false;
	 gameOver = false;
	 spawnedEnemies = 0;
	 spawn = false;
	 blindMode = false;
	 
	//for(var i = 0; i < entityList.length; i++){
	 //	entityList[i].reset();
	 //}
	 entityList = new Array();
	 entityList[0] = player;
	 
	 score = 0;
};
	
var startGame = function(){
	timer = 60;
	score = 0;
	counter = 0;
	gameWin = false;
	gameOver = false;
	blindMode = false;
	entityList = new Array();
	entityList[0] = player;
	entityList.push(Lasagn());
	entityList.push(Lasagn());
};

 /*var deltaTime = function(var start, var differ) {
	 //Figure out how much time has past since X time.
	 //Figure out how to keep start constant
	 var delta = timer - start;
	 if(delta == differ)
	 return true;
};*/
var difficultyCheck = function(lasaga){
	//After certain score values increase the number of lasagnas on screen
	//But only once
	//Idea: some how implement a checkpoint point system
	console.log(newLasagnaChecker);
	if(lasaga == 10){
		if(newLasagnaChecker){
			entityList.push(Lasagn());
			newLasagnaChecker = false;
		}
	}
	if(lasaga == 100){
		if(newLasagnaChecker){
			entityList.push(Lasagn());
			newLasagnaChecker = false;
		}
	}
	if(lasaga == 1000){
		if(newLasagnaChecker){
			entityList.push(Lasagn());
			newLasagnaChecker = false;
		}
	}
	if(lasaga == 10000){
		if(newLasagnaChecker){
			entityList.push(Lasagn());
			newLasagnaChecker = false;
		}
	}
};

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
 			ctx.fillRect(0, 0, 500, 500);
 			ctx.fillStyle = '#00FFFF';
 			ctx.font = 'italic bold 30px sans-serif';
 			ctx.textBaseline = 'middle';
 			ctx.fillText('Garfield in Lasagna Town', canvas.width / 2 - 200.0, canvas.height / 2);
 			if (flicker) {
 				ctx.fillText('Press Enter to Start', canvas.width / 2 - 150.0, canvas.height / 2 + 50);
 				flicker = false;
 			} else flicker = true;
 			keys();
 		}

 		if (gameState == "Pause") {
 			gameRunning = false;
 			ctx.fillStyle = '#708090';
 			ctx.fillRect(0, 0, 500, 500);
 			ctx.fillStyle = '#00FFFF';
 			ctx.font = 'italic bold 30px sans-serif';
 			ctx.textBaseline = 'middle';
 			ctx.fillText('Paused', canvas.width / 2 - 60.0, canvas.height / 2);
 		}

 		if (gameState == "Game1") {
			
 			gameRunning = true;
 			drawBG();
 			detectCollision();

 			keys();

			// for (var i = 0; i < entityList.length; i++) {
			//		if (entityList[i].tag == 'enemy') entityList[i].mover(); //This works
			// }
			entityList.forEach(function(entity){
				if(!entity.active)
					entity.draw();
			});
		
 			if (summoned) ctx.drawImage(odie, canvas.height / 2 - 16, canvas.width / 2 - 25);
			difficultyCheck(score);
 			drawAll();
 			updateTimer();
 		}
		
		if (gameState == "Game2") {
			
 			gameRunning = true;
 			//drawBG();
 			detectCollision();

 			keys();

			entityList.forEach(function(entity){
				if(!entity.active)
					entity.draw();
			});
		
 			//if (summoned) ctx.drawImage(odie, canvas.height / 2 - 16, canvas.width / 2 - 25);
			difficultyCheck(score);
 			drawAll();
 			updateTimer();
			ctx.fillText('2',canvas.width - 20, 0);
 		}

 		if (gameState == "Scores") {
 			ctx.fillStyle = '#4682B4';
 			ctx.fillRect(0, 0, 500, 500);
 			ctx.fillStyle = '#00FFFF';
 			ctx.font = 'italic bold 30px sans-serif';
 			ctx.textBaseline = 'middle';
 			ctx.fillText('Garfield in Lasagna Town',50, 50);
 			ctx.fillText('Scores:',50,100);
			//Figure out how to sort the scores before displaying the list
 			for(var i = 0; i < scoreList.length; i++){
 				ctx.fillText(scoreList[i],75,(150 + (50*i)));
 			}
		}
		
		if (gameState == "Credits") {
			ctx.fillStyle = '#4682B4';
			ctx.fillRect(0, 0, 500, 500);
			ctx.fillStyle = '#00FFFF';
			ctx.font = 'italic bold 30px sans-serif';
			ctx.textBaseline = 'middle';
			ctx.fillText('Garfield in Lasagna Town',50, 50);
			ctx.fillText('Featuring Garfield',50,100);
			ctx.fillText('Made by Stove',canvas.wdith / 2 - 100, canvas.height / 2);
			
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
			ctx.fillText('Be hasty though, you only have 60 seconds to collect as much as you can',10,350);
			
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
 	
 	if(timer == 0){
 		gameOver = true;
 		gameRunning = false;
 		ctx.drawImage(loss,canvas.width/2 - 200, canvas.height/2 - 100);
 	}
 	if(gameOver == true){
 		scoreList.push(score);
 	}
 	counter++;
 	if (counter % 30 == 0) {
 		timer--;
		//If combotimer isnt 0 then decrement, will reset once enemy is killed
		for(var i = 0; i < entityList.length; i++)
			entityList[i].update();
		if(player.combotimer != 0)
			player.combotimer--;
		else
			player.combomultiplier = 1;
		console.log(player.combotimer);
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
 	ctx.strokeRect(0, 0, 500, 500); //For border
 };

 var drawAll = function() {
	 //Make it so entities draw in order.  Ie projectiles > characters > terrain
	 if(!blindMode){
	 	//for (var x = 0; x < entityList.length; x++)
	 		//entityList[x].draw();
		entityList.forEach(function(entity){
			entity.draw();
		});
	 }
	 else{
	 	ctx.fillStyle = '#000000';
	 	ctx.fillRect(0,0,500,500);
	 	entityList[0].draw();
	 }

	 ctx.fillStyle = '#00FFFF';
	 ctx.font = 'italic bold 30px sans-serif';
	 ctx.textBaseline = 'bottom';
	 ctx.fillText('Score: ' + score, canvas.width / 2 - 80.0, canvas.height);
	 ctx.fillText('Time: ' + timer, 20,40);

	};

	var detectCollision = function() {
 	//collision detection

 	if (entityList.length != 1) {
 		for (var i = 0; i < entityList.length; i++) {
 			for (var j = i + 1; j < entityList.length; j++) {
 				if (detectUnitColl(entityList[i], entityList[j])) {
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

 	//if (lasagna1.x > canvas.width || lasagna1.y > canvas.height) lasagna1.reset();
 	//if (lasagna2.x > canvas.width || lasagna2.y > canvas.height) lasagna2.reset();

 };

 function detectUnitColl(a, b) {
 	return a.x < b.x + b.width &&
 	a.x + a.width > b.x &&
 	a.y < b.y + b.height &&
 	a.y + a.height > b.y;
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
 	if (handle == "playerlasagna") unit2.reset();
 	if (handle == "lasagnaplayer") unit1.reset();
 	
 }
 //For Later

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

 //Spawning
*/