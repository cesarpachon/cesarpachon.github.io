(function($, THREE, FS){
"use strict";

/**
 * a very simple particle system
 */ 
FS.Particles = function(size){
  //pool of particles
  this.pool = [];
  this.init(size);

};

/**
 * initialize the particles system
 */ 
FS.Particles.prototype.init = function(size){
  var geom = new THREE.CubeGeometry(1,1,1, 1);
  var material = new THREE.MeshStandardMaterial({
    color: 0x0033bb
  });
   
  this.root = new THREE.Object3D();
  
  for(var i=0; i<size; ++i){
    var p = {
      dir: new THREE.Vector3(),
      speed: 0,
      life: 0,
      root: new THREE.Mesh(geom, material),
    };
    //we will reuse visible attribute as "alive"
    p.root.visible = false;
    this.root.add(p.root);
    this.pool.push(p);
  }
};

/**
 * @param num: {number} number of bullets to fire
 * @param parent: {3dObject} object to use as origin of the fire
 * @param l1: origin distante to parent
 * @param r1: radius around l1 for particle initial pos
 * @param l2: ref distance to parent
 * @param r2: radius around l2 for random direction assignation
 *
 */ 
FS.Particles.prototype.fire = function(pos, dir, num, l1, r1, l2, r2){
 num = Math.min(num, this.pool.length);
 var p0 = new THREE.Vector3();
 p0.copy(pos);
 var p1 = new THREE.Vector3();
 p1.copy(p0);
 p0.addScaledVector(dir, l1);
 p1.addScaledVector(dir, l2);
 console.log(p0);
 console.log(p1);
 var i=0;
 while(i < num && i < this.pool.length){
  var p = this.pool[i];
  if(!p.root.visible){
    p.root.visible = true;
    p.root.position.copy(p0);
    p.speed = 0.1+ 0.1*Math.random();
    p.life = 500 + 500*Math.random();
    p.life_acum = 0; 
    p.dir.x = p1.x+ ((Math.random()-0.5));
    p.dir.y = p1.y+ ((Math.random()-0.5));
    p.dir.z = p1.z+ ((Math.random()-0.5));

    p.root.position.copy(p1);

    p.dir.normalize();
  }
  ++i;
 }
};

/**
 *
 */ 
FS.Particles.prototype.update = function(dt){
  for(var i=0; i<this.pool.length; ++i){
    var p = this.pool[i];
    if(p.root.visible){
      p.life_acum += dt;
      if(p.life_acum >= p.life){
        p.root.visible = false;
      }else{
        p.root.position.x += p.dir.x*p.speed*dt;
        p.root.position.y += p.dir.y*p.speed*dt;
        p.root.position.z += p.dir.z*p.speed*dt;
      }
    }
  }
};

})($, THREE, FS);
