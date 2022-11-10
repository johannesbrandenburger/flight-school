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
  isMovingCamera = false,
  clock,
  deltaTime,
  timeSinceAnimationStart = 0,
  planeLookAt,
  headingTo = { right: 0, up: 0 },
  arrowHelpers = [],
  chairAnimation = {
    activeChair: null,
    initialPosition: null,
    moveStep: 1,
    up: true,
  },
  closetAnimation = { 
    activeCloset: null,
    open: true,
  };

init().then(() => {
  console.log("init done");
  animate();
});