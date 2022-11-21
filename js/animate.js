/**
 * Animates the scene
 */
async function animate() {

  stats.update();

  handleWalking();
  handleAnimateChairs();
  handleAnimateClosets();
  handleInfoDiv();
  handleBlackboardInertia()

  deltaTime = clock.getDelta();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
