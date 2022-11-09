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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // resize the renderer when the window is resized
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // enable THREEx dom events
  domEvents = new THREEx.DomEvents(camera, renderer.domElement);

  // add a clock
  clock = new THREE.Clock();

  // remove the loading div
  document.body.removeChild(loadingDiv);

  // add the renderer to the dom
  camera.position.set(4, 8, 17);
  document.body.appendChild(renderer.domElement);

  // place all objects
  await placeObjects();

  // place all lights
  placeLights();

  // enable walking with the keyboard
  initWalk();

  // enable orientation controls
  initMouseClickMove();

  // enable putting the chair on the table
  //initPutChairOnTheTable();

  // enable shadow for each object
  for (const group in myObjects) {
    getAllMeshsFromNestedGroup(myObjects[group]).forEach((mesh) => {
      mesh.receiveShadow = true;
    });
  }
}
