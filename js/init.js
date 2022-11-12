// @ts-check

async function init() {

  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get("redirect-from");
  if (redirect === "flight-simulator") redirectFromFlightSimulator = true;

  initStartScreen();

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

  // add the renderer to the dom
  camera.position.set(4, 8, 17);

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

  // if the user was redirected from the flight simulator look at the monitor
  if (redirectFromFlightSimulator) {
    redirectFromFlightSimulator = true;
    myObjects.player.position.set(3.6, myObjects.player.position.y, 1.5);
    camera.lookAt(myObjects.monitor.position.x, -10, 100);
    camera.updateProjectionMatrix()
    window.history.replaceState({}, document.title, "/");
  }

  const startImmediately = putStartScreenOnReady();

  if (!startImmediately) {

    // wait till the user clicks on the start button or presses enter
    await new Promise((resolve) => {
      document.getElementById("start-button").addEventListener("click", () => {
        startScene();
        resolve();
      });
      window.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          startScene();
          resolve();
        }
      });
    });
  } else {
    startScene();
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
  stats.domElement.id = "stats";
  stats.domElement.style.display = "none";
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

      case "j":
      case "J":

        // toggle stats visibility
        stats.domElement.style.display = stats.domElement.style.display === "none" ? "block" : "none";

        break;

      case "c":
      case "C":

        [...myObjects.chairs, myObjects.profChair].forEach((chair) => {
          chair.traverse((child) => { child.castShadow = !child.castShadow; });
        });

        break;

      case "h":
      case "H":

        // toggle help screen visibility
        document.getElementById("start-screen").style.display = document.getElementById("start-screen").style.display === "none" ? "block" : "none";
        break;

      case "j":
      case "J":

        // toggle stats visibility
        stats.domElement.style.display = stats.domElement.style.display === "none" ? "block" : "none";

        break;
    }
  });

}


/**
 * Initialize the start screen / landing page (no js needed so far)
 */
function initStartScreen() {}


/**
 * Hides the start screen and starts the scene
 */
function startScene() {
  document.body.appendChild(renderer.domElement);
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("stats").style.display = "block";
}


/**
 * Sets the button from "Loading..." to "Start" and enables it
 * @returns {boolean} true if the start button should be clicked immediately (if the user was redirected from the flight simulator)
 */
function putStartScreenOnReady() {

  // remove the loading icon
  document.getElementById("loading-icon").style.display = "none";

  if (redirectFromFlightSimulator) return true;

  // change button text to "Start" and enable the button
  document.getElementById("start-button").innerText = "Start";
  document.getElementById("start-button").removeAttribute("disabled");

  return false;
}
