(function(AZ){
  "use strict"; 


  AZ.Viewport = function(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx; 
    this.rot = 0; 
    this.x= 0;
    this.y= 0;
    this.w= 200;
    this.h= 200;
    /*
     * with the responsive viewport on place; we can
     * safely treat all coordinates as if they were fixed
     * pixels in a constant resolution.. renderer will
     * take care of adapt to diferent resolutions while 
     * keeping the aspect ratio and the scene centered on screen.
     */
    this.WIDTH = 1024;
    this.HEIGHT = 768;
    this.RATIO = 1.33333 
  };

  
  /**
   * renderSprite
   */ 
  AZ.Viewport.prototype.renderSprite = function(sprite){
      if(sprite.visible){
        var x = this.scaleX(sprite.x);
        var y = this.scaleY(sprite.y);  
        var w = this.scaleW(sprite.w);
        var h = this.scaleH(sprite.h); 
        this.ctx.save();
        this.ctx.setTransform(1,0,0,1,0,0);
        var rootx = x + w/2;
        var rooty = y + h/2;
        this.ctx.translate(rootx, rooty);
        this.ctx.rotate(sprite.rot);
        this.ctx.drawImage(sprite.img, -w/2, -h/2, w, h);
        //this.ctx.translate(-w/2, -h/2);
        for(var i=0; i<sprite.children.length; ++i){
          var child = sprite.children[i];
          var cx = this.scaleX(child.x);
          var cy = this.scaleY(child.y);  
          var cw = this.scaleW(child.w);
          var ch = this.scaleH(child.h); 
          this.ctx.save();
          this.ctx.rotate(child.angle);
          //we expect that sprites with children has a radius att too.
          //this is a hack. 
          this.ctx.translate(this.scaleW(sprite.radius), 0);
          //this.ctx.translate(cx, cy);
          //this.ctx.translate(cx + cw/2, cy + ch/2);
          //this.ctx.drawImage(child.img, -cw/2, -ch/2, cw, ch);
          this.ctx.drawImage(child.img, -cw/2, -ch/2, cw, ch);
          this.ctx.restore();
        }
        this.ctx.restore();
      }
  };

  /**
   * renderAnimatedSprite
   */ 
  AZ.Viewport.prototype.renderAnimatedSprite = function(sprite){
    var x = this.scaleX(sprite.x);
    var y = this.scaleY(sprite.y);  
    var w = this.scaleW(sprite.w);
    var h = this.scaleH(sprite.h); 
    this.ctx.drawImage(sprite.img, 
        sprite.currframe*128, sprite.curraction*128, 128, 128, 
        x, y, w, h);
  };


  /**
   * unscaleX
   *  screen to reference coordinates
   */ 
  AZ.Viewport.prototype.unscaleX = function(x){
    x = x - this.x;
    return (x/this.w) * this.WIDTH; 
  };


  /**
   * unscaleY
   *  screen to reference coordinates
   */ 
  AZ.Viewport.prototype.unscaleY = function(y){
    y = y - this.y;
    return (y/this.h) * this.HEIGHT; 
  };

  /**
   * scaleX
   * reference to screen coordinates
   */ 
  AZ.Viewport.prototype.scaleX = function(x){
    return this.x + this.scaleW(x); 
  };


  /**
   * scaleY
   * reference to screen coordinates
   */ 
  AZ.Viewport.prototype.scaleY = function(y){
    return this.y + this.scaleH(y); 
  };


  /**
   * scaleW
   * reference to screen coordinates
   */ 
  AZ.Viewport.prototype.scaleW = function(w){
    return w/this.WIDTH * this.w; 
  };

  /**
   * scaleH
   * reference to screen coordinates
   */ 
  AZ.Viewport.prototype.scaleH = function(h){
    return h/this.HEIGHT * this.h; 
  };


  /**
   * onResize
   * recompute viewport
   */ 
  AZ.Viewport.prototype.onResize = function(width, height){
    this.canvas.width = width; 
    this.canvas.height = height; 
    var ratio = width / height; 
    if(ratio > this.RATIO){
      //wider.. 
      this.h = height; 
      this.w = height * this.RATIO; 
      this.x = (width - this.w)/2;
      this.y = 0; 
    }else{
      //taller
      this.w = width;
      this.h = width / this.RATIO; 
      this.y = (height - this.h)/2;
      this.x = 0; 
    }
  };

  

})(Aztec);
