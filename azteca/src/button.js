(function(AZ){
  "use strict"; 


  AZ.Button = function(sprite_normal, sprite_pressed){
    this.sprite_on = sprite_pressed;
    this.sprite_off = sprite_normal; 
    this.pressed = false;
  };

  /**
   *
   */ 
  AZ.Button.prototype.press = function(){
    if(this.pressed) return false; 
    this.pressed = true;
    this.sprite_on.show(true);
    this.sprite_off.show(false);
    return true; 
  };

  /**
   *
   */ 
  AZ.Button.prototype.release = function(){
   if(!this.pressed)return false;
   this.pressed = false; 
    this.sprite_on.show(false);
    this.sprite_off.show(true);
    return true;
  };

  


})(Aztec);
