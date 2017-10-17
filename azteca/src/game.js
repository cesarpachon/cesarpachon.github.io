(function(AZ){
  "use strict"; 

  /**
   * @class Game
   * @constructor
   */ 
  AZ.Game = function(){
   var _self = this; 
   this.canvas = document.getElementById("renderer");
   this.ctx = this.canvas.getContext('2d');
   //viewport will be used to transform uniform coordinates
   //from sprites to window coordinates plus responsive features
   this.viewport = new AZ.Viewport(this.canvas, this.ctx); 
   this.loading = true; 
   window.addEventListener("resize",  function(){
    _self.viewport.onResize(window.innerWidth, window.innerHeight);
   });
   //create a periodic clock of 1sg 
   this.clock1s = new AZ.Interpolator(1000, true); 
  };

  /**
   * load
   */ 
  AZ.Game.prototype.load = function(cb){
   this.viewport.onResize(window.innerWidth, window.innerHeight);
   var _self = this; 
   AZ.getData("data/symbols.json", function(err, data){
    if(!err){
      _self.symbols =JSON.parse(data);
      //need a second instance of the array, not a reference
      var paths = JSON.parse(data); 
      //let's append other required sprites.. 
      paths.push("BG");
      paths.push("snake");
      paths.push("button_normal");
      paths.push("button_pressed");
      paths.push("circlebig");
      paths.push("circlesmall");
      paths.push("selector");
      _self.loadImages(paths, cb);
    }else{
      console.log("error loading symbols");
    }
   });
  };

  /**
   * addSPrite
   */ 
  AZ.Game.prototype.addSprite = function(name, img, x, y, w, h){
    var sprite = new AZ.Sprite(name,img, x, y,w, h);
    this.sprites.push(sprite);
    return sprite;
  };

  /**
   * start
   */
  AZ.Game.prototype.start = function(){
   this.status = "idle";
   this.clock1s.start();
   var _self = this;
   //instantiate objects
   this.sprites = [];
   this.addSprite("BG", this.images.BG, 0, 0, this.viewport.WIDTH, this.viewport.HEIGHT); 
   var circlebig = this.addSprite("circlebig", this.images.circlebig, 0, 0).center(this.viewport);
   
   var circlesmall = this.addSprite("circlesmall", this.images.circlesmall, 0, 0).center(this.viewport);
   
   this.addSprite("selector", this.images.selector, 0, 0)
     .center(this.viewport)
     .displace(185, 0);
  
   var btn_normal = this.addSprite("button_normal", this.images.button_normal, 0, 0).center(this.viewport);
   var btn_pressed = this.addSprite("button_pressed", this.images.button_pressed, 0, 0)
     .center(this.viewport)
     .show(false);
   
  this.button = new AZ.Button(btn_normal, btn_pressed);
  
  var sprites = [];
  this.symbols.forEach(function(symbol){
    sprites.push(new AZ.Sprite(symbol, _self.images[symbol], 0, 0));
  });
  this.wheel1 = new AZ.Wheel(circlesmall, 150, sprites);
  sprites = [];
  this.symbols.forEach(function(symbol){
    sprites.push(new AZ.Sprite(symbol, _self.images[symbol], 0, 0));
  });
  this.wheel2 = new AZ.Wheel(circlebig, 260, sprites);

  this.snake = new AZ.AnimatedSprite(_self.images.snake, 100, 100, 128, 128, 4);

   //start the main loop
   var t = Date.now();
   function step(){
     var _t = Date.now();
     var dt = _t - t;
     t = _t; 
     _self.update(dt);
     _self.render();
     window.requestAnimationFrame(step);
   };
  this.canvas.addEventListener("touchstart", function(ev){
    ev.stopPropagation();
    var x = ev.changedTouches.item(0).clientX;
    var y = ev.changedTouches.item(0).clientY;
    _self.onClick(x, y);
    return ev.preventDefault();
  }, false);
  this.canvas.addEventListener("click", function(ev){
    var x = ev.clientX;
    var y = ev.clientY;
    _self.onClick(x, y);
    return ev.preventDefault();
  });

   window.requestAnimationFrame(step);
  };

  /**
   * loadSprites
   * @param data: array of names of sprites to preload
   */ 
  AZ.Game.prototype.loadImages = function(data, cb){
    var _self = this;
    this.images = {};
    var loaded = 0; 
    function _onLoad(){
      loaded++;
      if(loaded === data.length){
        console.log("loaded done!");
        _self.loading = false;
        cb(null);
      }
    };
    data.forEach(function(name){
      var image = new Image();
      image.src = "img/"+name+".png";
      image.addEventListener('load', _onLoad);
      _self.images[name] = image;
    });
  };


  /**
   * update
   */ 
  AZ.Game.prototype.update = function(dt){
    this.clock1s.update(dt);
    this.wheel1.update(dt);
    this.wheel2.update(dt);
    this.snake.update(dt);
  };

  /*
   * onCLick
   */
  AZ.Game.prototype.onClick = function(x, y){
    //device to viewport coordinates
    x = this.viewport.unscaleX(x);
    y = this.viewport.unscaleY(y);

    /*
     * in a "real" game engine we will propagate the collision
     * event through the graph hierarchy, but for this demo
     * as we know the unique button is in the middle we can
     * just hard-wire collision against the center.
     */

    //distance to the center.. 
    var cx = this.viewport.WIDTH/2;// + (this.viewport.x);
    var cy = this.viewport.HEIGHT/2;// + (this.viewport.y);
    var diff = (cx - x)*(cx - x) + (cy-y)*(cy-y);
    diff = Math.sqrt(diff);
    
     /* notice that we use the magic value of 177 because
     * that is the size of the button sprite. 
     */
     var colision =  (diff <= 177/2);
     if(colision){
      this.onSpin();
     }
  };

  /*
   * checkWin
   */
  AZ.Game.prototype.checkWin = function(){
    if(
        (this.wheel1.target_symbol === 0 || this.wheel2.target_symbol === 0)
        || 
        this.wheel1.target_symbol === this.wheel2.target_symbol)
    {
      console.log("WIN!");
      this.snake.play(2);
    }else{
      console.log("lost");
      this.snake.play(3);
    }
  };

  /*
   * onSpin
   */
  AZ.Game.prototype.onSpin = function(){
   var _self = this; 
   if(this.button.press()){
     if(this.status === "idle"){
       this.status = "wheel1";
       this.snake.play(1);
       this.wheel1.spin(function(){
         _self.snake.play(0);
        _self.button.release();
       });
     }else if(this.status === "wheel1"){
        this.status = "wheel2";
        this.snake.play(1);
        this.wheel2.spin(function(){
          _self.button.release();
          _self.status = "idle";
          _self.checkWin();
        });
     }
   }
  };

  /**
   * render
   */ 
  AZ.Game.prototype.render = function(){
    var _self = this; 
    var x,y, w, h;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.rect(20,20,150,100);
    this.ctx.stroke();
    
    this.ctx.rect(this.viewport.x, this.viewport.y,
        this.viewport.w, this.viewport.h);
    this.ctx.stroke();
    
    if(this.loading){
      var step = this.clock1s.getStep();
      var grd=this.ctx.createLinearGradient(0,0,this.viewport.w*step,0);
      grd.addColorStop(0,"yellow");
      grd.addColorStop(1,"orange");
      this.ctx.fillStyle=grd;
      this.ctx.fillRect(this.viewport.x, this.viewport.y,
          this.viewport.w, this.viewport.h);
      x = this.viewport.x + this.viewport.w*0.4;
      y = this.viewport.y + this.viewport.h*0.5;
      this.ctx.font = '58px serif';
      this.ctx.strokeText('Loading...', x, y);

    }else{
      for(var i=0; i<this.sprites.length; ++i){
        this.viewport.renderSprite(this.sprites[i]);
      };
    }
    
    this.viewport.renderAnimatedSprite(this.snake);
  
  };
  

})(Aztec);
