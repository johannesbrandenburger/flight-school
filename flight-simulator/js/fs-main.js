// global variables
var container,
    stats,
    scene,
    camera,
    renderer,
    controls,
    sceneObjects = {},
    isMouseDown = false,
    clock,
    deltaTime,
    planeLookAt,
    headingTo = { right: 0, up: 0 },
    invertedControls = false,
    torusScore = 0,
    hasScored = false,
    startTime = null,
    timeLeft = 60,
    sun,
    water,
    isFlying = true,
    showFlightVectors = false,
    planeIsUpsideDown = false,
    invertedControlsDivTimeout = null,
    isGameOver = false,
    speed = 0;

// global constants
const torusScale = 0.2;
const torusRadius = 2 * torusScale;
const torusTube = 0.3 * torusScale;
const torusSpawnRadius = 120 * torusScale;
const torusAmount = 200;
const extraTorusAmount = 20;
const obstacleAmount = 300;
const obstacleRadius = 0.2;
const planeWingSize = 0.08;
const distanceOfCameraFromPlane = 1.5;
const basePlaneRotateFactor = 0.01;

// initialize the scene and run the animation loop
init().then(() => {
    animate();
});
