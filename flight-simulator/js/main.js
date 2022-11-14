// @ts-check

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
    sun, water,
    planeWingSize = 0.08,
    isFlying = true,
    showFlightVectors = false,
    planeIsUpsideDown = false
    ;

const torusScale = 0.2;
const torusRadius = 2 * torusScale;
const torusTube = 0.3 * torusScale;
const torusSpawnRadius = 100 * torusScale;
const torusAmount = 200;
const extraTorusAmount = 20;
const obstacleAmount = 300;
const obstacleRadius = 0.2;

init().then(() => {
    console.log("init done");
    animate();
});
