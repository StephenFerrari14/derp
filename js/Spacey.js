 /*------------Spaceman: Underwater Bullet Hell Game (TBA)
 orrrr Hell Bullet Hell Game? Huh Huh
 */

 //------------ Globals
 
 var canvas = document.createElement("canvas");
 canvas.width = 500;
 canvas.height = 500;

 document.body.appendChild(canvas);
 var ctx = canvas.getContext("2d");
 //Frames per second
 var FPS = 30;
 //key handling: keysDown = all keys pressed. Listeners add/subtract from it
 var keysDown = {};

 addEventListener("keydown", function(e) {
 	keysDown[e.keyCode] = true;
 }, false);
 addEventListener("keyup", function(e) {
 	delete keysDown[e.keyCode];
 }, false);

 var scrolling = 0;
 var counter = 0;
 var timer = 0;
 var score = 0;
 var firePatterns = ['centersingle','twoprong','trifan']; //Maybe
 var powerUpValues = ['ability','points','firepattern1'];
 var attackPatterns = 2;
 var currentAttack = 1;
 
 /*
 To Do:
 -Enemy Movement Pattern System
 -Power Up Effects
 -Score
 -Shooting Pattern System
 
 */
 
 //---------Images
 var playerImg = new Image();
 playerImg.src = 'images/Garfield.bmp';
 var enemyImg = new Image();
 enemyImg.src = 'images/m1.png';
 var powerupImg = new Image();
 powerupImg.src = 'images/m4.gif';

 var scrollBG = new Image();
 scrollBG.src = 'images/longwall.jpg';

 var player = {
  color: "blue",
  x: 50,
  y: 270,
  width: 15,
  height: 15,
  ability: 5,
  isShieldUp: false,
  isInvis: false,
  mMod: 1.0,
  draw: function() {
	if(!this.isInvis){
		ctx.fillStyle = this.color;
		//ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(playerImg, this.x - this.width/2 , this.y - this.height/2);
	}
  },
  respawn: function(){
   this.x = 50;
   this.y = 270;
 }
};

var playerBullets = [];
var enemyBullets = [];

function Bullet(I) {
  I.active = true;

  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 3;
  I.height = 3;
  I.color = "#000";

  I.inBounds = function() {
    return I.x >= 0 && I.x <= canvas.width &&
    I.y >= 0 && I.y <= canvas.height;
  };

  I.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;
    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
    this.active = false;
            // Extra Credit: Add an explosion graphic
          };

          return I;
}

function EBullet(I) {
  I.active = true;

  I.xVelocity = 0;
  I.yVelocity = -I.speed;
  I.width = 3;
  I.height = 3;
  I.color = "#000";

  I.inBounds = function() {
    return I.x >= 0 && I.x <= canvas.width &&
    I.y >= 0 && I.y <= canvas.height;
  };

  I.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;
    I.active = I.active && I.inBounds();
  };

  I.explode = function() {
    this.active = false;
            // Extra Credit: Add an explosion graphic
          };

          return I;
}
        
        enemies = [];
		powerups = [];
/*
        var Enemy = {

          x: canvas.width / 4 + Math.random() * canvas.width / 2,
          y: 0,
          xVelocity: 0,
          yVelocity: 2,
          width: 20,
          height: 20,
          active: true,
          age: Math.floor(Math.random() * 128),
          draw: function() {
            //this.sprite.draw(canvas, this.x, this.y);
             //ctx.drawImage(enemyImg,this.x, this.y);
             ctx.fillStyle = this.color;
             ctx.fillRect(this.x, this.y, this.width,this.height);
           },

           update: function() {
            this.x += this.xVelocity;
            this.y += this.yVelocity;

            this.xVelocity = 3 * Math.sin(this.age * Math.PI / 64);

            this.age++;

            this.active = this.active && this.inBounds();
          },
    //Figure out movement pattern sets system

          explode: function() {
            //Sound.play("explosion");

            this.active = false;
            // Extra Credit: Add an explosion graphic
          },
        };
        */
        
		function Enemy(I) {
			I = I || {};

			I.active = true;
			I.age = Math.floor(Math.random() * 128);

			I.color = "red";

			I.x = canvas.width / 4 + Math.random() * canvas.width / 2;
			I.y = 0;
			I.xVelocity = 0;
			I.yVelocity = 2;

			I.width = 20;
			I.height = 20;

			I.inBounds = function() {
				return I.x >= 0 && I.x <= canvas.width &&
				I.y >= 0 && I.y <= canvas.height;
			};

			//I.sprite = Sprite("enemy");

			I.draw = function() {
				//this.sprite.draw(canvas, this.x, this.y);
				ctx.drawImage(enemyImg,this.x, this.y);
				ctx.fillStyle = I.color;
				//ctx.fillRect(I.x, I.y, I.width,I.height);
			};

			I.update = function() {
				I.x += I.xVelocity;
				I.y += I.yVelocity;

				I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

				I.age++;

				I.active = I.active && I.inBounds();
			};
			//Figure out movement pattern system

			I.explode = function() {
				//Sound.play("explosion");
				this.active = false;
				score++;
			};

			I.shoot = function(){
				//Sound.play("shoot");
				var bulletPosition = this.midpoint();

				enemyBullets.push(EBullet({
					speed: -5,
					x: bulletPosition.x,
					y: bulletPosition.y, 
				}));
			};

			I.midpoint = function(){
				return {
					x: this.x + this.width/2,
					y: this.y + this.height/2
				};
			};

			return I;
		};
        
		function PowerUp(I){

			I = I || {};

			I.active = true;

			I.color = "red";

			I.x = canvas.width / 4 + Math.random() * canvas.width / 2;
			I.y = 0;
			I.xVelocity = 0;
			I.yVelocity = 5;
			I.containedUp = powerUpValues[Math.floor((Math.random()*(powerUpValues.length - 1)))];

			I.width = 20;
			I.height = 20;

			I.inBounds = function() {
				return I.x >= 0 && I.x <= canvas.width &&
				I.y >= 0 && I.y <= canvas.height;
			};

			//I.sprite = Sprite("enemy");

			I.draw = function() {
				//this.sprite.draw(canvas, this.x, this.y);
				ctx.drawImage(powerupImg,this.x, this.y);
				ctx.fillStyle = I.color;
				//ctx.fillRect(I.x, I.y, I.width,I.height);
			};

			I.update = function() {
				I.y += I.yVelocity;
				I.active = I.active && I.inBounds();
			};
			//Figure out movement pattern system

			I.explode = function() {
				//Sound.play("explosion");
				//Activate Power Up Type
				if(I.containedUp == "ability")
					player.ability++;
				if(I.containedUp == "points")
					score++;
				//do other ifs for attack patterns
				this.active = false;
				// Extra Credit: Add an explosion graphic
				console.log(score);
			};
				  
			I.midpoint = function(){
				return {
					x: this.x + this.width/2,
					y: this.y + this.height/2
				};
			};

			return I;

		};
		
		/*
        var canvasElement = $("<canvas width='" + canvas.width + 
          "' height='" + canvas.height + "'></canvas");
         */
         Number.prototype.clamp = function(min, max) {
           return Math.min(Math.max(this, min), max);
         };

        setInterval(function() {
          update();
          draw();
        }, 1000/FPS);

	var keys = function(){
	//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		if(32 in keysDown) {
			player.shoot();
		}
		if(90 in keysDown){
			enemies.forEach(function(enemy){
				enemy.shoot();
			});
		}
		if(37 in keysDown) {
			player.x -= 5;
		}
		if(39 in keysDown) {
			player.x += 5;
		}
		if(38 in keysDown){
			player.y -= 5;
		}
		if(40 in keysDown){
			player.y += 5;
		}
		if(66 in keysDown){
			bombAway();
		}
		if(86 in keysDown){
			shieldUp();
		}
		if(78 in keysDown){
			invisHero();
		}
		if(16 in keysDown){
			//switch attack patterns
			currentAttack++;
			currentAttack = currentAttack % attackPatterns;
		}
	};
	
	function bombAway(){
		//play bomb explosion and sound effect
		if(player.ability > 0){
			player.ability--;
			enemies.forEach(function(enemy) {
				enemy.explode();
			});
		}
	};
	
	function shieldUp(){
		//Add increased hitbox and duration
		player.isShieldUp = true;
	};
	
	function invisHero(){
		player.isInvis = true;
	};

 var drawBG = function() {
	//ctx.drawImage(background, 0, 0);
	ctx.drawImage(scrollBG, 0, -500 + scrolling);
	ctx.lineWidth = "5";
	ctx.strokeStyle = "black";
	ctx.strokeRect(0, 0, canvas.width, canvas.height); //For border
	ctx.fillStyle = '#FF0000';
	ctx.font = 'italic bold 30px sans-serif';
	ctx.textBaseline = 'bottom';
	ctx.fillText('Score: ' + score, canvas.width / 2 - 80.0, canvas.height);
	ctx.fillText('Bomb: ' + player.ability, 30.0, canvas.height);
 };       

function update() {

	 keys();

	 player.x = player.x.clamp(0, canvas.width - player.width);
	 player.y = player.y.clamp(0,canvas.height - player.height);

	 playerBullets.forEach(function(bullet) {
	  bullet.update();
	});

	 playerBullets = playerBullets.filter(function(bullet) {
	  return bullet.active;
	});

	 enemies.forEach(function(enemy) {
	  enemy.update();
	});

	 enemies = enemies.filter(function(enemy) {
	  return enemy.active;

	});
	enemyBullets.forEach(function(bullet){
	  bullet.update();
	});
	
	powerups.forEach(function(pu){
	  pu.update();
	});
	
	powerups = powerups.filter(function(pu){
		return pu.active;
	});
	
	enemyBullets = enemyBullets.filter(function(bullet){
	  return bullet.active;
	});


	 handleCollisions();

	 if(Math.random() < 0.1) {
	  enemies.push(Enemy());
	}

	counter++;
	  if (counter % 30 == 0) {
		timer++;
		powerups.push(PowerUp());
		//score++;
		//scrolling+=10;
		counter = 0;
	  }

	scrolling+=1;

}

player.shoot = function() {
          //Sound.play("shoot");

          var bulletPosition = this.midpoint();

          playerBullets.push(Bullet({
            speed: 5,
            x: bulletPosition.x,
            y: bulletPosition.y,
          }));
};
        
        player.midpoint = function() {
          return {
            x: this.x + this.width/2,
            y: this.y + this.height/2
          };
        };
		
Enemy.shoot = function() {
          //Sound.play("shoot");

          var bulletPosition = this.midpoint();

          enemyBullets.push(EBullet({
            speed: -5,
            x: bulletPosition.x,
            y: bulletPosition.y,
          }));
};
        
Enemy.midpoint = function() {
          return {
            x: this.x + this.width/2,
            y: this.y + this.height/2
          };
        };

        function clear(){
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        function draw() {
			clear();

			drawBG();

			player.draw();

			playerBullets.forEach(function(bullet) {
				bullet.draw();
			});

			enemies.forEach(function(enemy) {
				enemy.draw();
			});

			enemyBullets.forEach(function(bullet){
				bullet.draw();
			});

			powerups.forEach(function(pu){
				pu.draw();
			});
        }
        
        function collides(a, b) {
          return a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
        }
        
        function handleCollisions() {
			playerBullets.forEach(function(bullet) {
				enemies.forEach(function(enemy) {
				if(collides(bullet, enemy)) {
					enemy.explode();
					bullet.active = false;
				}
            });
			enemyBullets.forEach(function(bullet) {
				if(collides(bullet,player)){
					player.explode();
					bullet.active = false;
				}
			});
          });

          enemies.forEach(function(enemy) {
            if(collides(enemy, player)) {
				if(player.isShieldUp){
					enemy.explode();
				}
				else{
					enemy.explode();
					player.explode();
				}
            }
          });
		  powerups.forEach(function(pu){
			if(collides(pu, player)){
				pu.explode();
			}
		  });
        }
        
        player.explode = function() {
          this.active = false;
          this.respawn();
          // Extra Credit: Add an explosion graphic and then end the game
        };
        
        /*player.sprite = Sprite("player");
        
        player.draw = function() {
          this.sprite.draw(canvas, this.x, this.y);
        };*/