var PLAY = 1;
var END = 0;
var gameState = PLAY;

var car, car_img;
var ground, invisibleGround, groundImage;

var obstaclesGroup, rock, rock2

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  car_img = loadImage("car.PNG");
  
  groundImage = loadImage("ground2.png");
  
  rock = loadImage("rock.PNG");
  rock2 = loadImage("ROCK 2.PNG");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(1200, 500);
  
  car = createSprite(195,445,20,50);
  
  car.addImage(car_img);
  car.scale = 0.5;
  
  ground = createSprite(200,450,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,450,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  car.debug = true;
  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
  
    if(keyDown("space") && car.y >= 159) {
      car.velocityY = -12;
    }
  
    car.velocityY = car.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    car.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(car)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    car.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);

    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(900,435,5,10);
    obstacle.debug = true;
    obstacle.velocityX = -(4 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(rock);
              break;
      case 2: obstacle.addImage(rock2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.25;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;

  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
}
