// @ts-check

// global variables
var container,
    stats,
    scene,
    camera,
    renderer,
    controls,
    effect,
    animationTimeoutMs,
    myObjects = {},
    isWalking = { forward: false, backward: false, left: false, right: false },
    isMouseDown = false,
    isMovingCamera = false,
    clock,
    deltaTime,
    planeLookAt,
    headingTo = { right: 0, up: 0 },
    arrowHelpers = []
    ;

let torusScore = 0;
let hasScored = false;
let startTime = null;
let timeLeft = 60;
let sun, water;
let planeWingSize = 0.08;
let isFlying = true;


init().then(() => {
    console.log("init done");
    animate();
});
