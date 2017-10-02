(function($, THREE, FS){

  /**
   * @constructor
   */ 
  FS.Robot = function(){
    this.parts = {};
    //THREE.js root
    this.root = null;
    this.setStatus("enter_idle");
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
      cb();
    });
  };

  
  FS.Robot.prototype.onForward = function(){
   if(this.status === "idle"){
     this.setStatus("entering_walking");  
    }
  };


  /**
   * enter a new status
   */ 
  FS.Robot.prototype.setStatus = function(status){
    console.log("setStatus " + status); 
    if(status === "enter_idle"){
      this.elapsed_time = 0;
      this.total_time = 10;
      this.next_status = "idle";
    }else if(status === "idle"){
      this.elapsed_time = 0; 
      this.total_time = 300;
      this.next_status = null; //indicates loop
    }
    this.status = status;
  };


  /**
   * update
   */
  FS.Robot.prototype.update = function(dt){
    this.elapsed_time++;
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

    if(this.status === "enter_idle"){
      this.updateEnterIdle(dt);
    }
    else if(this.status === "idle"){
      this.updateIdle(dt);
    }
  };

  /**
   * updateEnterIdle 
   */ 
  FS.Robot.prototype.updateEnterIdle = function(dt){
    
  };

  /**
   * updateIdle 
   */ 
  FS.Robot.prototype.updateIdle = function(dt){
    //convert the 0..1 factor into an angle
    var angle  = this.t * (2*PI);
   // console.log("dt "+ this.t + " angle " + angle);
    //move the axis up-down
    this.parts.axis.position.y = Math.sin(angle)*0.5; 
    //compensate in legs (forward kinematic, sorry, no time for IK..)
    //this.parts.
  };
  

})($, THREE, FS);
