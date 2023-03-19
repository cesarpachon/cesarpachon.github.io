(function(AZ){
  "use strict"; 
  /**
   * @class Sprite
   * @constructor
   */ 
  AZ.Sprite = function(name, img, x, y, w, h){
   this.name = name;
   this.img = img;
   this.x = x; 
   this.y = y; 
   this.w = w; 
   this.h = h; 
   this.visible = true;
   this.children = [];

   if(!this.w && !this.h){
    this.w = this.img.width;
    this.h = this.img.height; 
   }
  };

  /**
   * 
   */ 
  AZ.Sprite.prototype.center = function(viewport){
    //always work on reference coordinates
    this.x = viewport.WIDTH/2 - this.w/2; //viewport.scaleW(this.w)/2; 
    this.y = viewport.HEIGHT/2 - this.h/2; //viewport.scaleH(this.h)/2; 
    return this; 
  };

  /**
   *
   */ 
  AZ.Sprite.prototype.displace = function(dx, dy){
    this.x += dx;
    this.y += dy; 
    return this; 
  };


  /**
   *
   */ 
  AZ.Sprite.prototype.show = function(flag){
    this.visible = flag;
    return this;
  };

  /**
   * render
  AZ.Sprite.prototype.render = function(ctx, viewport){
      if(this.visible){
        var x = viewport.x + (this.x/viewport.WIDTH * viewport.w);
        var y = viewport.y + (this.y/viewport.HEIGHT * viewport.h);  
        var w = this.w/viewport.WIDTH * viewport.w;
        var h = this.h/viewport.HEIGHT * viewport.h; 
       ctx.drawImage(this.img, x, y, w, h);
      }
  };
  */ 
  

})(Aztec);
