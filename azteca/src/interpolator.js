(function(AZ){
  "use strict"; 

  /**
   * @constructor
   */ 
  AZ.Interpolator = function(total_time, loop){
   this.total_time = total_time;
   this.loop = loop; 
   this.running = false; 
   this.elapsed_time = 0; 
  };

  /**
   * run
   */ 
  AZ.Interpolator.prototype.start = function(){
   this.elapsed_time = 0; 
   this.running = true; 
  };

  /**
   * update
   */ 
  AZ.Interpolator.prototype.update = function(dt){
    if(!this.running) return; 
    this.elapsed_time += dt; 
    if(this.elapsed_time >= this.total_time){
      if(this.loop){
        this.elapsed_time = this.elapsed_time % this.total_time;
      }else{
        this.running = false; 
      }
    }
  };

  /**
   * getStep
   */ 
  AZ.Interpolator.prototype.getStep = function(){
    return this.elapsed_time / this.total_time; 
  };

  /**
   * returns the step as sin function in 0 .. PI
   */ 
  AZ.Interpolator.prototype.getStepPI = function(){
    var s = this.getStep();
    return s*Math.PI;
  };

})(Aztec);
