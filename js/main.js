// global variables
var container,
  stats,
  scene,
  camera,
  renderer,
  controls,
  effect,
  animationTimeoutMs,
  domEvents;

init().then(() => {
  console.log("init done");
  animate();
});

async function init() {

  // add a loading div
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";
  loadingDiv.innerHTML = "Loading...";
  document.body.appendChild(loadingDiv);


  // config for three.js
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer();
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // log the camera position while moving
  controls.addEventListener("change", () => {
    console.log(camera.position);
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // enable THREEx dom events
  domEvents = new THREEx.DomEvents(camera, renderer.domElement);

  // add a test cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  domEvents.addEventListener(
    cube,
    "click",
    function(event) {
      console.log("you clicked on the mesh");
    },
    false
  );

  // add light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff);
  scene.add(pointLight);

  // load the classroom from blender model ../blender/Physikraum.glb
  console.log("loading classroom model");
  let classroom = await getMashFromBlenderModel("../blender/Physikraum.glb");
  // let classroom = await getMashFromBlenderModel("https://download1488.mediafire.com/6p4faoyy98zg/k3ox1euptin3g8i/Physikraum.glb");
  scene.add(classroom);

  // remove the loading div
  document.body.removeChild(loadingDiv);

  // add the renderer to the dom
  camera.position.set(4, 8, 17);
  document.body.appendChild(renderer.domElement);
}

async function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  await new Promise(resolve => setTimeout(resolve, animationTimeoutMs));
}

async function getMashFromBlenderModel(path) {
  const loader = new THREE.GLTFLoader();
  console.log("loading blender model");
  console.time("getMashFromBlenderModel");

  let mesh;

  await loader.load(
    path,
    function(gltf) {
      console.log("inside loader.load");
      console.timeEnd("getMashFromBlenderModel");
      mesh = gltf.scene;
      dispatchEvent(new Event("modelLoaded"));
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  // wait till the model is loaded
  await new Promise(resolve => {
    addEventListener("modelLoaded", resolve, { once: true });
  });
 
  console.log("loaded blender model");
  console.log("mesh", mesh);
  return mesh;
}
