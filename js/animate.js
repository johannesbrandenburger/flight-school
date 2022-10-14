// @ts-check

const distancePerWalk = 0.4;

async function animate() {
  requestAnimationFrame(animate);

  // check if the camera is inside mash
  getAllMeshsFromNestedGroup(scene).forEach(mesh => {
    if (checkIfPointIsInsideMesh(camera.position, mesh)) console.log("inside");
  });

  // walk if the user is pressing a key TODO: Optimize if 
  if (isWalking.forward) {
    const newPosition = getNewPosition(camera.position, getCameraLookAt(camera), distancePerWalk);
    camera.position.set(newPosition.x, newPosition.y, newPosition.z);
  } else if (isWalking.backward) {
    const newPosition = getNewPosition(camera.position, getCameraLookAt(camera), -distancePerWalk);
    camera.position.set(newPosition.x, newPosition.y, newPosition.z);
  } else if (isWalking.left) {
    const newPosition = getNewPosition(camera.position, getCameraLookAt(camera), distancePerWalk, directions.left);
    camera.position.set(newPosition.x, newPosition.y, newPosition.z);
  } else if (isWalking.right) {
    const newPosition = getNewPosition(camera.position, getCameraLookAt(camera), -distancePerWalk, directions.right);
    camera.position.set(newPosition.x, newPosition.y, newPosition.z);
  }

  renderer.render(scene, camera);

  await new Promise(resolve => setTimeout(resolve, animationTimeoutMs));
}
