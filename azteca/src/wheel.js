(function(AZ){
  "use strict"; 

  /**
   * @constructor
   * @param root {Sprite} root sprite (background of wheel)
   * @param children {Array[Sprite]} children sprites
   */ 
AZ.Wheel = function(root, radius, children){
  this.root = root;
  this.radius = radius; 
  this.children = children; 
  //this is a hack! 
  //we store the radius in the root sprite to 
  //facilitate the rendering of children
  this.root.radius = radius;
  this.status = "idle"; 
  this.interpolator = new AZ.Interpolator(1000, false);
  
  this.step = 2*Math.PI / children.length; 
  this.target_symbol = 0; 

  for(var i=0; i<children.length; ++i){
    var child = children[i];
    child.angle = this.step*i;
    child.x = this.radius * Math.cos(child.angle);
    child.y = this.radius * Math.sin(child.angle);
    this.root.children.push(child);
  }
};

AZ.Wheel.prototype.spin = function(cb){
  if(this.status !== "idle") return; 
  this.status = "spinning"; 
  //how much spin? 
  
  //whole spins..
  var spins = 1 + Math.floor(Math.random()*3);

  this.target_symbol = Math.floor(Math.random()*this.children.length);
  console.log("target symbol: "+ this.target_symbol);

  this.target_spin = spins*Math.PI*2;
  this.target_spin +=  this.target_symbol*this.step; 
  
  this.interpolator.start();
  this.cb = cb; 
};

AZ.Wheel.prototype.update = function(dt){
  if(this.status === "spinning"){
    this.interpolator.update(dt);
    var rad = this.target_spin * this.interpolator.getStep();
    this.root.rot = rad; 
    //console.log(this.root.rot);
    if(!this.interpolator.running){
      this.root.rot = this.target_symbol*this.step; 
      this.status = "idle"; 
      console.log("done spinning");
      this.cb();
    }
  }
};


})(Aztec);
