// @ts-check

async function init() {

  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get("redirect-from");
  if (redirect === "flight-simulator") redirectFromFlightSimulator = true;

  initStartScreen();

  window.addEventListener("keydown", event => { if (event.key === "f" || event.key === "F") window.location.href = "/flight-simulator" });

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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

  // place all objects/lights and enable its interactions
  await placeObjects();
  await placeLights();
  initInteractions();

  // enable walking with the keyboard and orientation controls
  initWalk();
  initMouseClickMove();

  // init stats and developer controls / keyboard shortcuts
  initStats();
  initDevControls();

  // if the user was redirected from the flight simulator look at the monitor
  if (redirectFromFlightSimulator) {
    redirectFromFlightSimulator = true;
    sceneObjects.player.position.set(3.6, sceneObjects.player.position.y, 1.5);
    camera.lookAt(sceneObjects.monitor.position.x, -10, 100);
    camera.updateProjectionMatrix()
    window.history.replaceState({}, document.title, "/");
  }

  const startImmediately = putStartScreenOnReady();

  if (startImmediately) {
    startScene();
    return;
  }

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
 * Initialize developer controls / keyboard shortcuts and experimental features
 * such as the ability to turn on/off all lights by pressing l
 * or the ability to turn on/off shadows of the chairs by pressing c
 */
function initDevControls() {

  window.addEventListener("keydown", event => {
    switch (event.key) {

      case "l":
      case "L":

        sceneObjects.bulbLights.forEach(light => light.visible = !light.visible);

        break;

      case "c":
      case "C":

        // toggle shadows of the chairs
        [...sceneObjects.chairs, sceneObjects.profChair].forEach((chair) => {
          chair.traverse((child) => { child.castShadow = !child.castShadow; });
        });

        break;

      case "t":
      case "T":

        // toggle shadows of the table
        [...sceneObjects.tables, sceneObjects.profTable].forEach(table => {
          table.traverse((child) => {
            child.castShadow = !child.castShadow;
            if (child.name == "Tischplatte_Top") {
              child.receiveShadow = true;
              child.castShadow = false;
            }
          });
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
function initStartScreen() { }


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

  // change button text to "Start" and enable the button
  document.getElementById("start-button").innerText = "Start";
  document.getElementById("start-button").removeAttribute("disabled");

  if (redirectFromFlightSimulator) return true;


  return false;
}
