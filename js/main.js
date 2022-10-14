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
  testBall
  let isWalking = { forward: false, backward: false, left: false, right: false }
  ;

init().then(() => {
  console.log("init done");
  animate();
});