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
  domEvents,
  myObjects = {},
  testBall,
  isWalking = { forward: false, backward: false, left: false, right: false },
  isMouseDown = false,
  isMouseOnBlackboardBoard1 = false,
  isMouseOnBlackboardBoard2 = false,
  isMovingCamera = false,
  clock,
  deltaTime,
  planeLookAt,
  headingTo = { right: 0, up: 0 },
  chairAnimation = {
    activeChair: null,
    initialPosition: null,
    moveStep: 1,
    up: true,
    timeSinceAnimationStart: 0,
  },
  closetAnimation = { 
    activeCloset: null,
    open: true,
    timeSinceAnimationStart: 0,
  };

init().then(() => {
  console.log("init done");
  animate();
});