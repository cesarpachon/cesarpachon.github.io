(function($, THREE, FS){
"use strict";

var MAX_SPEED = 1;

  /**
   * @constructor
   */ 
  FS.Robot = function(){
    this.parts = {};
    //THREE.js root
    this.root = null;
    this.ft = 0; 
    this.speed = 0;
    this.particles = new FS.Particles(50);
  };

  /*
   * Robot.load
   * load async assets, initialize object.
   * fires done callback with err=null if done
  */
  FS.Robot.prototype.init = function(cb){
   var _self = this;  
   this.root = new THREE.Object3D();
   
   this.material = new THREE.MeshStandardMaterial({
            color: 0x401A07,
            side : THREE.DoubleSide
              });
   
   var loaderOBJ = new THREE.OBJLoader( );
   loaderOBJ.load( 'obj/robot.obj', function ( object ) {
      console.log(object);
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          console.log("got child "+ child.name);
          _self.parts[child.name] = child; 
          child.material = _self.material;
          child.castShadow = true;
          child.receiveShadow = true;
          //child.material.map = texture;
        }
      });
      _self.root = object; 
      object.position.y = 21; 
      //obj did not preserve parenting! lets reparenting everything
      _self.parts.head.parent = _self.parts.neck;
      _self.parts.neck.parent = _self.parts.body;
      _self.parts.body.parent = _self.parts.axis;
      _self.parts.axis.parent = _self.root;
      
      _self.parts.foot_left.parent = _self.parts.leg_lower_left;
      _self.parts.leg_lower_left.parent = _self.parts.leg_upper_left;
      _self.parts.leg_upper_left.parent = _self.parts.axis;
      _self.parts.foot_right.parent = _self.parts.leg_lower_right;
      _self.parts.leg_lower_right.parent = _self.parts.leg_upper_right;
      _self.parts.leg_upper_right.parent = _self.parts.axis;
      
      //repositioning..
                  _self.parts.head.position.set(0, -4, -7);
                  _self.parts.neck.position.set(0, -5.5, 1.5);
                  _self.parts.body.position.set(0, 0, 0);
                  _self.parts.axis.position.set(0, 0, 0);
      
             _self.parts.foot_left.position.set(0, -7, -9);
        _self.parts.leg_lower_left.position.set(0, -10, 6);
        _self.parts.leg_upper_left.position.set(-6, 0, 0);

            _self.parts.foot_right.position.set(0, -7, -9);
       _self.parts.leg_lower_right.position.set(0, -10, 6);
       _self.parts.leg_upper_right.position.set(6, 0, 0);
  
       _self.parts.axis.rotation.y = -Math.PI;

      _self.setStatus("enter_idle");
      cb();
    });
  };

  
  /**
   * fire
   */ 
  FS.Robot.prototype.fire = function(){
    if(this.firing) return; 
    console.log("fire!");
    this.fire_elapsed_time = 0; 
    this.fire_total_time = 1500; 
    this.firing = true; 
    this.fired = false;
  };

  /**
   * onForward
   */ 
  FS.Robot.prototype.onForward = function(){
   if(this.status === "idle"){
     this.setStatus("enter_walking");  
    }
  };

  /**
   * onStop
   */ 
  FS.Robot.prototype.onStop = function(){
    if(this.status === "walking" || this.status === "enter_walking"){
      this.setStatus("enter_idle");
    }
  };


  /**
   * onTurn
   */ 
  FS.Robot.prototype.onTurn = function(side){
    this.turning = side; 
  }

  /**
   * enter a new status
   */ 
  FS.Robot.prototype.setStatus = function(status){
    console.log("setStatus " + status); 
    if(status === "enter_idle"){
      this.enterIdle();
     /* this.elapsed_time = 0;
      this.total_time = 10;
      this.next_status = "idle";
      */
    }else if(status === "idle"){
      this.elapsed_time = 0; 
      this.total_time = 3000;
      this.next_status = null; //indicates loop
    }
    else if(status === "enter_walking"){
      this.enterWalking();
      /*this.elapsed_time = 0;
      this.total_time = 20;
      this.next_status = "walking";*/
    }else if(status === "walking"){
      this.elapsed_time = 0; 
      this.total_time = 2000;
      this.next_status = null; //indicates loop
    }
    this.status = status;
  };


  /**
   * update
   */
  FS.Robot.prototype.update = function(dt){

    //handling walking status
    this.elapsed_time+=dt;
    if(this.total_time){
      if(this.elapsed_time < this.total_time){
        //stay on current state..
        this.t = this.elapsed_time / this.total_time; 
      }else{
        if(!this.next_status){ //loop
          console.log("new loop of "+ this.status);
         this.elapsed_time -= this.total_time; 
         this.t = this.elapsed_time / this.total_time; 
        }else{
          this.setStatus(this.next_status);
        }
      } 
    }else{
      //no total_time means looping, so no t is computed
    }

    //handling procedural animations
    if(this.status === "idle"){
      this.updateIdle(dt);
    }
    else if(this.status === "walking"){
      this.updateWalking(dt);
    }
    this.updateFiring(dt);

    //handling position updates
    if(this.speed>0){
      var dir = this.root.getWorldDirection();
      this.root.position.x += dir.x*this.speed*dt*0.1;
      this.root.position.z += dir.z*this.speed*dt*0.1;
    }
      if(this.turning){
        if(this.turning === "right"){
          this.root.rotation.y -= dt*Math.PI*0.001;
          
        }else{
          this.root.rotation.y += dt*Math.PI*0.001;
        }
      }
  };


  /**
   *
   */ 
  FS.Robot.prototype.updateFiring = function(dt){
    //handle firing status
    this.particles.update(dt);
    if(this.firing){
      this.fire_elapsed_time  += dt; 
      if(this.fire_elapsed_time < this.fire_total_time){
        this.ft = this.fire_elapsed_time / this.fire_total_time;
      }else{
        this.ft = 0; 
        this.fire_elapsed_time = 0; 
        this.firing = false; 
      }
    }
    var angle = this.ft * 2*Math.PI;
    if(this.ft < 0.5){
      robot.parts.body.rotation.x = 2*this.ft * angle;  
      robot.parts.neck.rotation.y = 2*this.ft * angle;  
      robot.parts.head.rotation.z = 2*this.ft * angle;  
    }else{
      if(!this.fired){
        this.fired = true;
        this.particles.fire(this.parts.head.getWorldPosition(),
            this.parts.head.getWorldDirection(),
            10, 1, 1, 10, 3); 
      }
      robot.parts.body.rotation.x = 2*this.ft * (2*Math.PI - angle);  
      robot.parts.neck.rotation.y = 2*this.ft * (2*Math.PI - angle);  
      robot.parts.head.rotation.z = 2*this.ft * (2*Math.PI - angle);  
    }
  
  };

  /**
   * updateEnterWalking 
   */ 
  FS.Robot.prototype.enterWalking = function(){
    var _self = this; 
    var ini = {
      speed: this.speed,
      root_y: this.root.position.y,
      axis_y: this.parts.axis.position.y, 
      leg_upper_left_rotx : this.parts.leg_upper_left.rotation.x, 
      leg_lower_left_rotx : this.parts.leg_lower_left.rotation.x, 
      foot_left_rotx: this.parts.foot_left.rotation.x, 
      
      leg_upper_right_rotx : this.parts.leg_upper_right.rotation.x, 
      leg_lower_right_rotx : this.parts.leg_lower_right.rotation.x, 
      foot_right_rotx : this.parts.foot_right.rotation.x 
    };
    var end = {
      speed: MAX_SPEED,
      root_y: 25,
      axis_y: 0, 
      leg_upper_left_rotx : 0, 
      leg_lower_left_rotx : 0, 
      foot_left_rotx: 0.5,
      
      leg_upper_right_rotx : 0, 
      leg_lower_right_rotx : 0, 
      foot_right_rotx : -0.5 
    };
    var tween = new TWEEN.Tween(ini)
      .to(end, 200)
      .onUpdate(function(){
        _self.speed = ini.speed;
        _self.root.position.y = ini.root_y;
        _self.parts.axis.position.y =ini.axis_y; 
        _self.parts.leg_upper_left.rotation.x = ini.leg_upper_left_rotx; 
        _self.parts.leg_lower_left.rotation.x = ini.leg_lower_left_rotx; 
        _self.parts.foot_left.rotation.x = ini.foot_left_rotx; 
        _self.parts.leg_upper_right.rotation.x = ini.leg_upper_right_rotx; 
        _self.parts.leg_lower_right.rotation.x = ini.leg_lower_right_rotx; 
        _self.parts.foot_right.rotation.x = ini.foot_right_rotx;
      })
      .onComplete(function(){
        _self.setStatus("walking");
      })
      .start();
  };

  /**
   * updateWalking 
   */ 
  FS.Robot.prototype.updateWalking = function(){


    //convert the 0..1 factor into an angle
    var angle1  = this.t * (4.0*Math.PI);
    //move the axis up-down
    this.parts.axis.position.y = Math.sin(angle1)*3.0; 
    
    var angle  = this.t * (2*Math.PI);
    var sin_angle = Math.sin(angle);
    var cos_angle = Math.cos(angle);
    
    //compensate in legs (forward kinematic, sorry, no time for IK..)
    this.parts.leg_upper_left.rotation.x = sin_angle*1.0; 
    this.parts.leg_lower_left.rotation.x = -sin_angle*1.0; 
    this.parts.foot_left.rotation.x = cos_angle*0.5; 
    
    var t2 = this.t + 0.5;
    if(t2>1.0) t2 -= 1.0;
    
    //var t2 = this.t;
    
    var angle2  =  t2  * (2.0*Math.PI);
    var sin_angle2 = Math.sin(angle2 );
    var cos_angle2 = Math.cos(angle2 );
    this.parts.leg_upper_right.rotation.x = sin_angle2*1.0; 
    this.parts.leg_lower_right.rotation.x = -sin_angle2*1.0; 
    this.parts.foot_right.rotation.x = cos_angle2*0.5; 
    
    };

  /**
   * updateEnterIdle 
   */ 
  FS.Robot.prototype.enterIdle = function(){
    var _self = this; 
    var ini = {
      speed: this.speed,
      root_y: this.root.position.y,
      axis_y: this.parts.axis.position.y, 
      leg_upper_left_rotx : this.parts.leg_upper_left.rotation.x, 
      leg_lower_left_rotx : this.parts.leg_lower_left.rotation.x, 
      foot_left_rotx: this.parts.foot_left.rotation.x, 
      
      leg_upper_right_rotx : this.parts.leg_upper_right.rotation.x, 
      leg_lower_right_rotx : this.parts.leg_lower_right.rotation.x, 
      foot_right_rotx : this.parts.foot_right.rotation.x 
    };
    var end = {
      speed: 0,
      root_y: 21,
      axis_y: 0, 
      leg_upper_left_rotx : 0, 
      leg_lower_left_rotx : 0, 
      foot_left_rotx: 0, 
      
      leg_upper_right_rotx : 0, 
      leg_lower_right_rotx : 0, 
      foot_right_rotx : 0 
    };
    var tween = new TWEEN.Tween(ini)
      .to(end, 200)
      .onUpdate(function(){
        _self.speed = ini.speed;
        _self.root.position.y = ini.root_y;
        _self.parts.axis.position.y =ini.axis_y; 
        _self.parts.leg_upper_left.rotation.x = ini.leg_upper_left_rotx; 
        _self.parts.leg_lower_left.rotation.x = ini.leg_lower_left_rotx; 
        _self.parts.foot_left.rotation.x = ini.foot_left_rotx; 
        _self.parts.leg_upper_right.rotation.x = ini.leg_upper_right_rotx; 
        _self.parts.leg_lower_right.rotation.x = ini.leg_lower_right_rotx; 
        _self.parts.foot_right.rotation.x = ini.foot_right_rotx;
      })
      .onComplete(function(){
        _self.setStatus("idle");
      })
      .start();
  };

  /**
   * updateIdle 
   */ 
  FS.Robot.prototype.updateIdle = function(){
    //convert the 0..1 factor into an angle
    var angle  = this.t * (2*Math.PI);
    var sin_angle = Math.sin(angle);
    var cos_angle = Math.cos(angle);
   // console.log("dt "+ this.t + " angle " + angle);
    //move the axis up-down
    this.parts.axis.position.y = sin_angle*0.5; 
    //compensate in legs (forward kinematic, sorry, no time for IK..)
    this.parts.leg_upper_left.rotation.x = sin_angle*0.05; 
    this.parts.leg_lower_left.rotation.x = -sin_angle*0.05; 
    this.parts.foot_left.rotation.x = -sin_angle*0.05; 
    
    this.parts.leg_upper_right.rotation.x = sin_angle*0.05; 
    this.parts.leg_lower_right.rotation.x = -sin_angle*0.05; 
    this.parts.foot_right.rotation.x = -sin_angle*0.05; 
  };

})($, THREE, FS);
