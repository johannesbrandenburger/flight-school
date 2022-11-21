/**
 * Animates the scene
 */
async function animate() {

  requestAnimationFrame(animate);
  stats.update();

  deltaTime = clock.getDelta();

  if (isFlying) {
    handleFlying();
    handleScore();
    handleObstacleCollision();
    handlePlaneOutOfBounds();
  }
  handleTime();

  water.material.uniforms['time'].value += 0.05 * deltaTime;
  renderer.render(scene, camera);
}


/**
 * Handles the collision detection between the plane and the torus objects
 * If plane collides with a torus, the torus is removed from the scene and the score is updated
 */
function handleScore() {

  if (!sceneObjects.modelPlane) return;

  const planePosition = sceneObjects.modelPlane.position;

  if (planePosition.y < 0) {
    gameOver();
    return;
  }

  let nearestTorus = null;

  // check if plane intersects with a torus
  for (let i = 0; i < scene.children.length; i++) {
    if (scene.children[i].name !== "torus" && scene.children[i].name !== "extraTorus") continue;

    // get nearest torus
    const torus = scene.children[i];
    if (!nearestTorus) {
      nearestTorus = torus;
    } else {
      const distanceToTorus = torus.position.distanceTo(planePosition);
      const distanceToNearestTorus = nearestTorus.position.distanceTo(planePosition);
      if (distanceToTorus < distanceToNearestTorus) {
        nearestTorus = torus;
      }
    }
  }

  // check if plane intersects with the nearest torus
  const distanceToCenter = nearestTorus.position.distanceTo(planePosition);

  // check if the planes position is inside the torus
  const boundingBox = new THREE.Box3().setFromObject(nearestTorus);
  if (boundingBox.containsPoint(planePosition)) {

    // check the distance to the center of the torus
    if (distanceToCenter < torusRadius - 0.5 * torusTube && !hasScored) {
      nearestTorus.material.color.set(0x00ff00);
      nearestTorus.material.needsUpdate = true;
      torusScore = nearestTorus.name === "extraTorus" ? torusScore + 5 : torusScore + 1;
      hasScored = true;
      document.getElementById("score").innerHTML = "Score: " + torusScore;

      // remove the torus after 1 second
      setTimeout(() => {
        scene.remove(nearestTorus);
        hasScored = false;
      }, 500);
    }

    if (distanceToCenter > torusRadius - planeWingSize - 0.5 * torusTube && distanceToCenter < torusRadius + torusTube + planeWingSize) {
      gameOver();
    }
  }
}


/**
 * Decreases the time and checks if the time is up
 */
function handleTime() {

  if (isFlying == false) {
    startTime += deltaTime * 1000;
    return;
  }

  const currentTime = new Date().getTime();
  timeLeft = 60 - Math.floor((currentTime - startTime) / 1000);
  document.getElementById("time").innerHTML = "Time left: " + timeLeft;

  if (timeLeft <= 0) {
    gameOver();
  }
}


/*
 * Chechs if the plane collides with an object
 */
function handleObstacleCollision() {
  for (let i = 0; i < scene.children.length; i++) {
    if (scene.children[i].name !== "obstacle") continue;
    if (scene.children[i].position.distanceTo(sceneObjects.modelPlane.position) < obstacleRadius + planeWingSize) {
      gameOver();
    }
  }
}


/**
 * Turns the plane around if to far away from the center
 * This is to prevent the plane from flying away
 */
function handlePlaneOutOfBounds() {

  if (sceneObjects.modelPlane.position.distanceTo(new THREE.Vector3(0, 0, 0)) - 10 > torusSpawnRadius) {

    // turn the plane around
    sceneObjects.modelPlane.lookAt(new THREE.Vector3(0, 10, 0));

    // show outOfBounds div for 3 seconds
    document.getElementById("outOfBounds").style.display = "block";
    setTimeout(() => {
      document.getElementById("outOfBounds").style.display = "none";
    }, 3000);
  }
}