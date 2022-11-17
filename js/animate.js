// @ts-check

/**
 * Animates the scene
 */
async function animate() {

  stats.update();

  handleWalking();
  handleAnimateChairs();
  handleAnimateClosets();
  handleInfoDiv();

  deltaTime = clock.getDelta();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
