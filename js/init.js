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

  // place all objects/lights and enable its interactions
  await placeObjects();
  placeLights();
  initInteractions();

  // enable walking with the keyboard
  initWalk();

  // enable orientation controls
  initMouseClickMove();

  // init stats and gui
  initStats();
  initDevControls();


  // check if the user was redirected from the flight simulator if so look at the monitor
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get("redirect-from");
  if (redirect === "flight-simulator") {
    myObjects.player.position.set(3.6, myObjects.player.position.y, 1.5);
    camera.lookAt(myObjects.monitor.position.x, -10, 100);
    camera.updateProjectionMatrix()
    window.history.replaceState({}, document.title, "/");
  }

}


/**
 * Initialize the FPS stats
 */
function initStats() {
  stats = new Stats();
  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0';
  stats.domElement.style.top = '50px';
  document.body.appendChild(stats.domElement);
}


/**
 * Initialize developer controls and experimental features
 * such as the ability to turn on/off all lights by pressing l
 * or the ability to turn on/off shadows of the chairs by pressing c
 */
function initDevControls() {

  window.addEventListener("keydown", event => {
    switch (event.key) {

      case "l":
      case "L":
      
        myObjects.bulbLights.forEach(light => light.visible = !light.visible);
        break;


      case "c":
      case "C":

        [...myObjects.chairs, myObjects.profChair].forEach((chair) => {
          chair.traverse((child) => { child.castShadow = !child.castShadow; });
        });

        break;
    }
  });

}