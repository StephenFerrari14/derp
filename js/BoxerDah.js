(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
width = 500;
height = 200;
keysDown = [];
entityList = [];
friction = 0.8;
gravity = 0.2;

/*

-Work on physics engine
For Physics
	Try directional detection
	Check 
Change entityList to check player to entityList while player isn't in entityList
*/
	
    player = {
		x : width/2,
		y : height - 5,
		width : 15,
		height : 15,
		velX: 0,
		velY: 0,
		jumping: false,
		tag: 'player',
		speed: 5,
		canDoubleJump: true,
		reset: function(){
			this.x = 10;
			this.y = 100;
		},
    };
   
    platform1 = {
		x: canvas.width/2,
		y: canvas.height/2,
		width: 100,
		height: 5,
		tag: 'platform',
		reset: function(){console.log("Reset");},
    };
	platform2 = {
		x: 350,
		y: 150,
		width: 100,
		height: 10,
		tag: 'platform',
		reset: function(){console.log("Reset");},
    };
	entityList[0] = player;
	entityList[1] = platform1;
	entityList[2] = platform2;
 
canvas.width = width;
canvas.height = height;

function keys(){

	if(32 in keysDown){
		
		if(!player.jumping){
			player.jumping = true;
			player.velY = -player.speed*2;
		}
		if(player.jumping && player.canDoubleJump){
			player.canDoubleJump = false;
			player.velY = -player.speed*2;
			//Frame problems
		}
	}
	if(38 in keysDown){
		if(!player.jumping){
			player.jumping = true;
			player.velY = -player.speed*2;
      }
	}
	if(39 in keysDown){
		if (player.velX < player.speed) {
			player.velX++;         
		}  
	}
	if(37 in keysDown){
		if (player.velX > -player.speed) {
            player.velX--;
        }
	}
}

function clear(){
	ctx.clearRect(0,0,width,height);
}

function drawAll(){
	ctx.fillStyle = "red";
	ctx.fillRect(platform1.x - platform1.width/2, platform1.y - platform1.height/2, platform1.width, platform1.height);
	ctx.fillRect(platform2.x - platform2.width/2, platform2.y - platform2.height/2, platform2.width, platform2.height);
	ctx.fillRect(player.x - player.width/2, player.y - player.height/2, player.width, player.height);
  
	ctx.lineWidth = "5";
	ctx.strokeStyle = "black";
 	ctx.strokeRect(0, 0, 500, 500);
}
 
function update(){
	keys();
 
    player.velX *= friction;
 
    player.velY += gravity;
    //console.log("velX: "+ player.velX);
    //console.log("velY: "+ player.velY);
    player.x += player.velX;
    player.y += player.velY;
 
    if (player.x >= width-player.width) {
        player.x = width-player.width;
    } else if (player.x <= 0) {         
		player.x = 0;     
	}     
	if(player.y >= height-player.height){
        player.y = height - player.height;
        player.jumping = false;
		player.canDoubleJump = true;
    }
 
	clear();
	detectCollision();
	drawAll();
	
  requestAnimationFrame(update);
}

var detectCollision = function() {
 	//collision detection
 	if (entityList.length != 1) {
 		for (var i = 0; i < entityList.length; i++) {
 			for (var j = i + 1; j < entityList.length; j++) {
 				if (detectUnitColl(entityList[i], entityList[j])) {
 					var didCol = DirCollision(entityList[i].velX, entityList[i].velY, entityList[i], entityList[j]);
 					console.log("Collision");
 					console.log(didCol);
 					detectCollHandler(entityList[i], entityList[j], didCol);
 				}
 			}
 		}
 	}

 	//Can turn these bool checks into its own method
	/*
 	if (player.x - player.width < 0) player.isTop = true;
 	else player.isTop = false;
 	if (player.x + player.width > canvas.width) player.isBot = true;
 	else player.isBot = false;
 	if (player.y - player.height < 0) player.isLeft = true;
 	else player.isLeft = false;
 	if (player.y + player.height > canvas.height) player.isRight = true;
 	else player.isRight = false;
	*/

 };

 function detectUnitColl(a, b) {
 	return a.x < b.x + b.width &&
 	a.x + a.width > b.x &&
 	a.y < b.y + b.height &&
 	a.y + a.height > b.y;
 }

 var detectCollHandler = function(unit1, unit2, det) {
 	//Will handle the type of collision, ie Player to Enemy, Player to power up, Projectile to Enemy etc
 	//Passed in two classes? Compares them, reacts accordingly

 	//Types: Player, Enemy, aProjectile, eProjectile, Item, Lasagna, Boss
 	//Maybe if they don't collide, else move? Have the movement call in detection instead of main
 	//Do I need 'playerenemy' and 'enemyplayer'? Might not because of how the loops works checking the collisions for each object. Better way to do it?
 	var str1 = unit1.tag;
 	var str2 = unit2.tag;
 	var handle = str1.concat(str2);
	//Should I have this logic here?
	//If they collide then check the players position relative to the platform
 	if (handle == "playerplatform"){
 		if(det == 1){
			unit2.reset();
		//DirCollision(unit1.velX,unit1.velY,unit1,unit2); Not here?
		if(unit1.dirY > 0) {
			//Down
			unit1.y -= Math.floor(unit1.speed)*0.75;
		}
		if(unit1.dirX > 0) {
			//Right
			unit1.x += unit1.speed;
		}
		if(unit1.dirY < 0) {
			//Down
			unit1.y += Math.floor(unit1.speed)*0.75;
		}
		if(unit1.dirX < 0) {
			//Left
			unit1.x -= unit1.speed;
		}
		}
	}
 	if (handle == "platformplayer"){ 
 		if(det == 1){
			unit1.reset();
		//DirCollision(unit1.velX,unit1.velY,unit1,unit2); Not here?
		if(unit2.dirY > 0) {
			//Down
			unit2.y -= Math.floor(unit2.speed)*0.75;
		}
		if(unit2.dirX > 0) {
			//Right
			unit2.x += unit2.speed;
		}
		if(unit2.dirY < 0) {
			//Down
			unit2.y += Math.floor(unit2.speed)*0.75;
		}
		if(unit2.dirX < 0) {
			//Left
			unit2.x -= unit2.speed;
		}
		}
	}
 	
}

//Don't think I will need
function checkCornerCollision(player,entity){
	var ACx = player.x - player.width/2;
	var BDx = player.x + player.width/2;
	var ABy = player.y - player.height/2;
	var CDy = player.y + player.height/2;
	//A
	if(ACx > entity.x - entity.width/2 && ACx < entity.x + entity.width/2 && ABy > entity.y - entity.height/2 && ABy < entity.y + entity.height/2){
		//Determine where player should get pushed out
		console.log("A");
		if(entity.y + entity/2 - ABy < ACx - entity.x - entity/2){
			//Then push player downward
			player.y = entity.y + entity.height/2 + 1;
			player.velY = 0;
		}
		else{
			if(ACx - entity.x - entity/2 < entity.x + entity/2 - ACx){
				//Push Left
			}
			else{
				//Push Right
			}
		}
	}
	//B
	if(BDx > entity.x - entity.width/2 && BDx < entity.x + entity.width/2 && ABy > entity.y - entity.height/2 && ABy < entity.y + entity.height/2){
		//Determine where player should get pushed out
		console.log("B");
	}
	//C
	if(ACx > entity.x - entity.width/2 && ACx < entity.x + entity.width/2 && CDy > entity.y - entity.height/2 && CDy < entity.y + entity.height/2){
		//Determine where player should get pushed out
		console.log("C");
	}
	//D
	if(BDx > entity.x - entity.width/2 && BDx < entity.x + entity.width/2 && CDy > entity.y - entity.height/2 && CDy < entity.y + entity.height/2){
		//Determine where player should get pushed out
		console.log("D");
	}
}

//Brett's Directional Collision detection, will work for platforms
//Implement directional tracking
//Inplement one way platforms
//Returns 1 if collided 0 if it didn't
function DirCollision(dirX,dirY, p1, p2){
	var one = p1;
	var two = p2;
	//Should be using velocities now
	//Implement based on X and Y velocity
	//console.log("dirX: "+dirX);
	//console.log("dirY: "+dirY);
	if(dirY <= 0){
		if(one.y <= two.y + two.height*0.5){
			return 0;
		}
		if((one.x-one.width*0.5<two.x+two.width*0.5 && one.x+one.width*0.5>two.x-two.width*0.5) &&
			one.y - (one.height * 0.5) - one.speed < two.y + two.height * 0.5){
			return 1;
		}else{
			return 0;
		}
	}
	if(dirX <= 0){
		if(one.x <= two.x - two.width*0.5){
			return 0;
		}
		if((one.y-one.height*0.5 < two.y+two.height*0.5 && one.y+one.height*0.5>two.y-two.height*0.5) &&
			one.x - (one.width * 0.5) - one.speed < two.x + two.width * 0.5){
			return 1;
		}else{
			return 0;
		}
	}
	if(dirY >= 0){
		if(one.y >= two.y + two.height*0.5){
			return 0;
		}
		if((one.x-one.width*0.5 < two.x+two.width*0.5 && one.x+one.width*0.5>two.x-two.width*0.5) &&
			one.y + (one.height * 0.5) + one.speed > two.y - two.height * 0.5){
			return 1;
		}else{
			return 0;
		}
	}
	if(dirX >= 0){
		if(one.x >= two.x + two.width*0.5){
			return 0;
		}
		if((one.y-one.height*0.5 < two.y+two.height*0.5 && one.y+one.height*0.5>two.y-two.height*0.5) &&
			one.x + (one.height * 0.5) + one.speed > two.x - two.width * 0.5){
			return 1;
		}else{
			return 0;
		}
	}
	return 0;
};
 
document.body.addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
});
 
window.addEventListener("load",function(){
    update();
});