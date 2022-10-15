// @ts-check

async function animate() {
  requestAnimationFrame(animate);

  handleWalking();


  renderer.render(scene, camera);

  await new Promise(resolve => setTimeout(resolve, animationTimeoutMs));
}
