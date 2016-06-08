
//testing

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;

    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }

    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }


    var locX = x;
    var locY = y - 10;

    var offset = vindex === 0 ? this.startX : 0;

    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy * 2,
                  this.frameHeight * scaleBy * 2);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


//====================================================================
function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}


//====================================================================
function Panda(game, x, y, thePid) {

    Entity.call(this, game, x, y);
    this.pid = thePid;
    this.throwing = false;
    this.snowballTimer = 0;
    this.hold = 20;
    this.speed = 10;
    //this.stillAnimation = new Animation(ASSET_MANAGER.getAsset("./img/snowman.png"),0, 0, 48, 48,/*frame speed*/ 0.5, /*# of frames*/2, true, false);
    //this.throwAnimation = new Animation(ASSET_MANAGER.getAsset("./img/snowman.png"),96, 0, 48, 48, 0.5, 2, true, false);

    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/panda still.png"),0, 0, 90, 92,/*frame speed*/ 0.9, /*# of frames*/2, true, false);
    this.stillAnimation = new Animation(ASSET_MANAGER.getAsset("./img/panda still.png"),0, 0, 90, 92,/*frame speed*/ 0.9, /*# of frames*/2, true, false);
    this.walkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/panda-walk-belly.png"), 0, 0, 110, 115, 0.1, 10, true, false);
    this.walkbackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/panda-walkback-belly.png"), 0, 0, 110, 115, 0.1, 10, true, false);
    this.flyAnimation = new Animation(ASSET_MANAGER.getAsset("./img/panda-flyup.png"), 0, 0, 175, 180, 0.1, 4, true, false);



    /*
    //function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/panda-walk.png"), 0, 0, 110, 115, 0.2, 6, true, false);
    this.walkbackAnimation = new Animation(ASSET_MANAGER.getAsset("./img/panda-walkback.png"), 0, 0, 110, 115, 0.2, 6, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/panda-jump.png"), 0, 0, 100, 110, 0.1, 6, false, false);
    */
}

Panda.prototype = new Entity();
Panda.prototype.constructor = Panda;


Panda.prototype.update = function () {

    if (this.game.up) {
        this.animation = this.flyAnimation;
        if (this.y > 0)
            this.y -= this.speed;

    } else if (this.game.down) {
        this.animation = this.flyAnimation;
        if(this.y <500)
            this.y += this.speed;

    } else if (this.game.left) {
        console.log(this.x);
        this.animation = this.walkbackAnimation;
        if(this.x > 0)
            this.x -= this.speed;

    } else if (this.game.right) {
        console.log(this.x);
        this.animation = this.walkAnimation;
        if (this.x < 700) {
            this.x += this.speed;
        }
    } else {
        this.animation = this.stillAnimation;
    }


    this.direction = 1;
    if (this.hold === 0) this.throwing = false;

    if (this.snowballTimer < 0) { //throwing
        console.log("Throwing!!! ");
        this.throwing = true;
        this.hold = 20;
        var snowball = new Snowball(this.game, this.x+70, this.y+20, 2);
        this.game.addEntity(snowball);
        this.snowballTimer = 100;
    }

    if(this.snowballTimer >= 0) {//not throwing
        if (this.throwing){
            this.hold--;
        }
        else{
            this.snowballTimer -= 1;
            //this.x += 0.1;
        }
    }
    Entity.prototype.update.call(this);
}

Panda.prototype.draw = function (ctx) {
    // if (this.throwing && this.hold > 0){
    //     this.throwAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    // }
    // else {
    //     this.stillAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    // }
     if (this.game.up && this.game.down) {
         this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 0.2);
     } else {
         this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 0.6);
     }

    Entity.prototype.draw.call(this);
}



//====================================================================
// the "main" code begins here

var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./img/snowman.png");
ASSET_MANAGER.queueDownload("./img/bb8.png");
ASSET_MANAGER.queueDownload("./img/panda still.png");
ASSET_MANAGER.queueDownload("./img/panda-walk-belly.png");
ASSET_MANAGER.queueDownload("./img/panda-walkback-belly.png");
ASSET_MANAGER.queueDownload("./img/panda-flyup.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var unicorn = new Panda(gameEngine, 10, 400, 1);
    gameEngine.addEntity(bg);
    gameEngine.addEntity(unicorn);
    gameEngine.init(ctx);
    gameEngine.start();
});













































