// @ts-check

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

  // resize the renderer when the window is resized
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // enable THREEx dom events
  domEvents = new THREEx.DomEvents(camera, renderer.domElement);

  // add a test cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube); myObjects.cube = cube;
  domEvents.addEventListener(
    cube,
    "click",
    function(event) {
      console.log("you clicked on the mesh");
    },
    false
  );
  myObjects.cube.position.set(0, 3, 0);

  // add light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff);
  scene.add(pointLight);

  // load the blender models
  let classroom = await getMashFromBlenderModel("../blender/Physikraum.glb");
  let chair1 = await getMashFromBlenderModel("../blender/chair.glb");
  let computergrafik = await getMashFromBlenderModel(
    "../blender/computergrafik.glb"
  );

  // add the blender models to the scene
  scene.add(chair1); myObjects.chair1 = chair1;
  scene.add(classroom); myObjects.classroom = classroom;
  // scene.add(computergrafik); myObjects.computergrafik = computergrafik;

  console.log(getAllMeshsFromNestedGroup(computergrafik));

  // remove the loading div
  document.body.removeChild(loadingDiv);

  // add the renderer to the dom
  camera.position.set(4, 8, 17);
  document.body.appendChild(renderer.domElement);

  // enable walking with the keyboard
  initWalk();

  // enable orientation controls
  initMouseClickMove();

}
