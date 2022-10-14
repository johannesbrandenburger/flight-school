async function animate() {
  requestAnimationFrame(animate);

  // check if the camera is inside mash
  getAllMeshsFromNestedGroup(scene).forEach(mesh => {
    if (checkIfPointIsInsideMesh(camera.position, mesh)) console.log("inside");
  });

  renderer.render(scene, camera);

  await new Promise(resolve => setTimeout(resolve, animationTimeoutMs));
}
