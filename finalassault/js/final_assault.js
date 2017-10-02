(function($, THREE, FS){

  /**
   * @constructor
   */ 
  FS.Robot = function(){
    this.parts = {};
    //THREE.js root
    this.root = null;
    this.enterStatus("idle");
  };

  /*
   * Robot.load
   * load async assets, initialize object.
   * fires done callback with err=null if done
  */
  FS.Robot.prototype.init = function(cb){
   var _self = this;  
   this.root = new THREE.Object3D();
   var loaderOBJ = new THREE.OBJLoader( );
   
   this.material = new THREE.MeshStandardMaterial({
            color: 0x401A07,
            side : THREE.DoubleSide
              });
   
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
    if(status === "entering_idle"){
      this.elapsed_time = 0;
      this.total_time = 300;
      this.loop = false; 
      this.status = "entering_idle";
      this.next_status = "idle";
    }else if(status === "idle"){
      this.elapsed_time = 0; 
      this.total_time = 1000;
      this.loop = true;
    }

  };


  /**
   * update
   */
  FS.Robot.prototype.update = function(dt){
    this.elapsed_time++;
    if(this.total_time){
      if(this.elapsed_time > this.total_time){
        this.t = this.elapsed_time / this.total_time; 
      }else{
        this.elapsed_time = this.total_time; 
        this.t = 1.0; 
      } 
    }else{
      //no total_time means looping, so no t is computed
    }
    if(this.status === "entering_idle"){
      console.log("entering idle");
      this.updateEnteringIdle(dt);
    }
    else if(this.status === "idle"){
      this.updateIdle(dt);
    }
  };

  /**
   * updateEnteringIdle 
   */ 
  FS.Robot.prototype.updateEnteringIdle = function(dt){
    //just jump to idle..
    this.setStatus("idle");
  };

  /**
   * updateIdle 
   */ 
  FS.Robot.prototype.updateIdle = function(dt){
    this.parts.axis.position.y = Math.sin(dt)*5; 
  };
  

})($, THREE, FS);
