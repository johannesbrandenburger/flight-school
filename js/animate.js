// @ts-check

async function animate() {
  requestAnimationFrame(animate);

  handleWalking();
  handleFlying();
  //handleAnimateChairs();
  renderer.render(scene, camera);
  await new Promise(resolve => setTimeout(resolve, animationTimeoutMs));
}
