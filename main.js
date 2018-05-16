var game = new Phaser.Game(1820, 600, Phaser.CANVAS, "game", {
	preload: preload,
	create: create,
	update: update
});
var cos;
var len = 1;
var pig;
var spaceKey;
var jumpSound, falling, getStarSound;
var leftarrow, rightarrow;
var heart, background,textLives;
var lives=3;
var score = 0,
	totalScore = 0;
var scoreText, levelText, totalScoreText;
var getItem;
var points;
var level = 1;
var progressStarPos = 350;
var fontColor = "#25A2F4";
var machines;
var Table = new Array("1", "2", "3");

var bodyVel = -500; //star Speed
var bgVel = 2; //bg speed
var levelPoints = 0;

var timeSinceLastIncrement = 0;
var spacekey;

//groups
var hearts, stars;

function init() {
	//CENTER CANVAS
	// if(!game.device.desktop) {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	//game.scale.setMinMax(game.width/2, game.height/2, game.width, game.height);
	//}
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.scale.setScreenSize(true);

	//Game Physics
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.gravity.y = 100;
}

function preload() {
	init();
	//PIG
	this.load.spritesheet(
		"pig",
		"https://rawgit.com/MEJSIK/Game/master/pig.png",
		108,
		60,
		6
	);

	/*   MACHINES   */
	this.load.spritesheet(
		"mach1",
		"https://rawgit.com/MEJSIK/Game/master/mach1.png",
		400,
		450,
		53
	);


	this.load.spritesheet(
		"mach2",
		"https://rawgit.com/MEJSIK/Game/master/mach2.png",
		500,
		500,
		16
	);

	this.load.spritesheet(
		"mach3",
		"https://rawgit.com/MEJSIK/Game/master/mach3.png",
		650,
		411,
		6
	);
	this.load.spritesheet(
		"mach4",
		"https://rawgit.com/MEJSIK/Game/master/mach4.png",
		500,
		500,
		56
	);
	this.load.spritesheet(
		"mach5",
		"https://rawgit.com/MEJSIK/Game/master/mach5.png",
		300,
		449,
		12
	);

	// Background
	this.load.image(
		"background",
		"https://rawgit.com/MEJSIK/Game/master/Asset%205.png"
	);

	//Heart
	this.load.image("heart", "https://rawgit.com/MEJSIK/Game/master/heart.png");

	//Star
	this.load.image(
		"star",
		"https://static1.squarespace.com/static/544c1964e4b0dd27d701dd68/t/55f85ed4e4b0f3e154b9ecb0/1442340582763/"
	);

	/* #### SOUNDS ####*/

	//FlyUp sound
	game.load.audio("jump", "https://rawgit.com/MEJSIK/Game/master/flyUp.mp3");

	//Falling sound
	game.load.audio(
		"falling",
		"https://rawgit.com/MEJSIK/Game/master/endLife.mp3"
	);

	//GetStar sound
	game.load.audio(
		"getStar",
		"https://rawgit.com/MEJSIK/Game/master/getStar.mp3"
	);
}

function create() {
	
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.world.setBounds(0, 0, 1820, 600);

	//spacekey

	spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	spacekey.onDown.add(jump, this);
	
	
	
	
	//leftarrow
	leftarrow = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	

	//rightarrow
	rightarrow = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	
	
	//Background
	background = this.add.tileSprite(
		0,
		0,
		this.stage.bounds.width,
		this.cache.getImage("background").height,
		"background"
	);
	this.game.physics.arcade.enable(background);
	background.body.allowGravity = false;

	// Create PIG
	pig = this.add.sprite(60, this.world.centerY, "pig");
	pig.animations.add("fly");

	pig.animations.play("fly", 20, true);

	//pig.body.gravity.y = 100;
	pig.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enable(pig);

	pig.body.gravity.y = 1000;

	/* CREATING MACHINES*/
	machines = game.add.group();
	

	
	//machines.enableBody = true;
	//machines.physicsBodyType = Phaser.Physics.ARCADE;
	machines.callAll("anchor.setTo","anchor", 0.5);
	
	// for (var i = 0; i < 50; i++)
	// {
	// machines.create(game.world.randomX, game.world.randomY, 'mach1', 0);
	// }
	

	//stars
	stars = game.add.group();

	stars.enableBody = true;



	/*###################### Topbar####################################### */
	var topbar = game.add.graphics(0, 0);
	topbar.beginFill(0x2a2444);

	// draw a shape
	topbar.moveTo(0, 0);
	topbar.lineTo(1820, 0);
	topbar.lineTo(1820, 100);
	topbar.lineTo(0, 100);
	topbar.lineTo(0, 0);
	topbar.endFill();
	window.graphics = topbar;

	/*###################### END Topbar####################################### */
	//Line header
	var topLine = game.add.graphics(0, 0);
	topLine.beginFill(0xf047fb);
	topLine.lineStyle(2, 0x0033e0, 1);
	topLine.moveTo(64, 55);
	topLine.lineTo(700, 55);
	topLine.endFill();
	window.graphics = topLine;

	
	//SCORES
	scoreText = game.add.text(170, 16, "0", {
		fontSize: "32px",
		fill: fontColor
	});

	//TOTAL SCORE
	totalScoreText = game.add.text(300, 16, "TOTAL SCORE: 0", {
		fontSize: "32px",
		fill: fontColor
	});

	//LEVEL
	levelText = game.add.text(
		game.world.centerX - 50,
		50,
		"Level " + level,
		{
			fontSize: "120",
			fill: "#fff"
		}
	);

	//Heart
	game.add.sprite(64, 16, "heart").scale.setTo(0.3);
	game.add.sprite(128, 16, "star").scale.setTo(0.1);
	
	//Lives
	
	textLives = game.add.text(85,25,"x"+lives,{
		fontSize: "16px",
		fill: fontColor
	});
	
		//Sounds
	this.jumpSound = game.add.audio("jump");
	this.jumpSound.volume = 0.2;

	//getStar
	this.getStarSound = game.add.audio("getStar");
	this.getStarSound.volume = 0.2;
}

function update() {
	//Touch pointer
	this.game.input.onDown.add(jump, this);
	
	if (leftarrow.isDown) pig.x-=2;
		else if(rightarrow.isDown) pig.x+=2;
	 
	//background moving left
	background.tilePosition.x -= bgVel;

	if (pig.angle < 20) pig.angle += 1;
	if (pig.y > 600) {
		lives--;
		if(lives < 0){
			game.paused = true;
			restartGame();
			
			}else{
				textLives.setText("x"+lives); 
				pig.y = 300;
			}
	
		
		
	}

	//STARS
	// Update the variable that tracks total time elapsed
	timeSinceLastIncrement += game.time.elapsed;
	//console.log(timeSinceLastIncrement);
	if (timeSinceLastIncrement % 10 == 0) {
		// eg, update every 10 seconds
		timeSinceLastIncrent = 0; 

		createStar();
	}
	if (timeSinceLastIncrement >= 2000) {
		//console.log("przed: "+timeSinceLastIncrement);
		timeSinceLastIncrement = 0;
		//console.log("po:"+timeSinceLastIncrement);
		createMachine();
	}
	//  Run collision
	game.physics.arcade.overlap(pig, stars, collisionHandler, null, this);
	//game.physics.arcade.overlap(pig, machines, colisionMach, null, this);

	function colisionMach() {
		//game.paused = true;
			console.log(lives);
		lives--;
		if(lives<0){
			game.paused = true;
			restartGame();
			}
		
		livesText.setText("x"+lives);
		
	}

	

	/*  MACHINES POS */
	machines.x -= 4;

	// if (machines.x < 0)
	// {
	//     machines.x = game.world.width;
	// }
}
function createMachine() {
		

		switch (game.rnd.integerInRange(0, 4)) {
			case 0:
				var machine = machines.create(game.width*len*0.5, 100, "mach1",0);
				machine.scale.setTo(0.7);
				machine.animations.add("move", null, 7,true, true);
		machine.animations.play("move",true);
				len++;
				break;
			case 1:
				var machine = machines.create(game.width*len*0.5, 250, "mach2",0);
				machine.scale.setTo(0.7);
				machine.animations.add("move", null, 7,true, true);
		machine.animations.play("move",true);
				len++; 
				break;
			case 2:
				var machine = machines.create(game.width*len*0.5, 320, "mach3",0);
				machine.scale.setTo(0.7);
				machine.animations.add("move", null, 7,true, true);
		machine.animations.play("move",true);
				len++;
				break;
				case 3:
				var machine = machines.create(game.width*len*0.5,  250, "mach4",0);
				machine.scale.setTo(0.7);
				machine.animations.add("move", null, 7,true, true);
		machine.animations.play("move",true);
				len++;
				break;
				case 4:
				var machine = machines.create(game.width*len*0.5,  300, "mach5",0);
				machine.scale.setTo(0.7);
				machine.animations.add("move", null, 7,true, true); 
		machine.animations.play("move",true);
				len++;
				break;
				defautl:
		 		len++;
		}
	
	}
function createStar() {
	var star = stars.create(game.width, 150 + game.world.randomY, "star");
	star.scale.setTo(0.1);
	moveIndividual(star);
}
function moveIndividual(moved) {
	moved.body.velocity.x = bodyVel; //body velocity
}

function collisionHandler(pig, star) {
	this.getStarSound.play();
	//  when pig getStar the will dissaper
	star.kill();
	//  Increase the score
	score += 10;
	totalScore += 10;
	scoreText.setText(score);
	totalScoreText.setText("TOTAL SCORE:" + totalScore);


	if (score >= 400 * level) {
		level++;
		levelText.setText("Level"+level);
		bodyVel -= 200;
		bgVel *= 2;
		score = 0;
	}
}

function jump() {
		this.jumpSound.play();
	pig.body.velocity.y = -350;
	game.add
		.tween(pig)
		.to({ angle: -20 }, 100)
		.start();


}

function restartGame() {
	var restarGame = game.add
		.text(
			game.world.centerX,
			game.world.centerY,
			"Press ENTER to start game again !!!",
			{
				fontSize: "120",
				fill: "#fff"
			}
		)
		.anchor.setTo(0.5);

	game.input.keyboard.onUpCallback = function(e) {};
		this.game.input.onDown.add(function(){
			game.paused = false;
			game.state.restart();
			lives=3;
			level=1;
			bodyVel = -500;
			bgVel = 2;
		});
		// if (e.keyCode == 13) {
		// 	game.paused = false;
		// 	game.state.restart();
		// 	lives=3;
		// 	level=1;
		// 	bodyVel = -500;
		// 	bgVel = 2;
		// }
	// };
}