(function(AZ){
  "use strict"; 

  
AZ.AnimatedSprite = function(img, x, y, w, h, numframes){
  this.img = img;
  this.x = x;
  this.y = y; 
  this.w = w;
  this.h = h; 
  this.numframes = numframes;
  this.interpolator = new AZ.Interpolator(300, true);
  this.currframe = 0; 
  this.curraction = 0; 
  this.interpolator.start();
};

/**
 * play
 */ 
AZ.AnimatedSprite.prototype.play = function(actionid){
  this.curraction = actionid;
};

/**
 * update
 */ 
AZ.AnimatedSprite.prototype.update = function(dt){
  this.interpolator.update(dt);
  this.currframe = Math.floor(this.interpolator.getStep()*this.numframes);
};



})(Aztec);
