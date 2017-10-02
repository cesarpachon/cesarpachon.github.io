//let's create a "Final Assault" global namespace for hold our stuff..
window.FS = {};



// Initialize variables.
var scene, camera, renderer, WIDTH, HEIGHT;
var PI = Math.PI;
var angle = 0;
var radius = 10;
var cube;
var cos = Math.cos;
var sin = Math.sin;
var controls = null; 
var robot = null; 
var keyboard = new KeyboardState();
var clock = new THREE.Clock();

function init(event) {
  // Get the container that will hold the animation.
  var container = document.getElementById('world');

  // Get window size.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create a three.js scene; set up the camera and the renderer.
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 50, WIDTH / HEIGHT, 1, 2000 );
  camera.position.z = 100;
  camera.position.y = 40; 
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  container.appendChild(renderer.domElement);

  // Create the cube.
  var geom = new THREE.CubeGeometry(16,8,8, 1);
  var material = new THREE.MeshStandardMaterial({
    color: 0x401A07
  });
  cube = new THREE.Mesh(geom, material);

  // Add the cube to the scene.
  scene.add(cube);

  // Create and add a light source.
  var globalLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(globalLight);


 var light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    light.shadowCameraVisible = true;
    light.position.set(-3, 1, 5);
    scene.add(light);
    scene.add( new THREE.DirectionalLightHelper(light, 0.2) );


  controls = new THREE.OrbitControls( camera, renderer.domElement );


  // Listen to the window resize.
  window.addEventListener('resize', handleWindowResize, false);

  var grid = new THREE.GridHelper(100, 100);
  grid.name = "grid";
  //grid.rotation.x = - Math.PI / 2;
  grid.scale.setScalar(5);
  scene.add(grid);
  
  robot = new FS.Robot();
  robot.init(function(err){
    if(!err){
      scene.add(robot.root);
      loop();
    }
  });
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}



function update(){

  keyboard.update();
  if(keyboard.pressed("W")){
    robot.onForward();
  }

  var dt  = this.clock.getDelta();
  robot.update(dt);
  
  // The angle is incremented by 0.1 every frame. Try higher values for faster animation.
  angle += .1;

  // Try modifying the angle and/or radius for a different movement.
  cube.position.x = cos(angle) * radius;
  cube.position.y = sin(angle) * radius;

  // You might want to use the same principle on the rotation property of an object. Uncomment the next line to see what happens.
  //cube.rotation.z = cos(angle) * PI/4;

  //Or vary the scale. Note that 1 is added as an offset to avoid a negative scale value.
  //cube.scale.y = 1 + cos(angle) * .5;

}


function loop(){
  update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

