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
    isFlying = true
    ;

init().then(() => {
    console.log("init done");
    animate();
});
