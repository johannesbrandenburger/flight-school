// @ts-check

// create config
const headHeight = 4;
const startPoint = new THREE.Vector3(-10, headHeight, -3);
const distancePerWalk = 0.2;

function walk() {
  camera.position.set(startPoint.x, startPoint.y, startPoint.z);

  // look 45 degrees to the right
  camera.lookAt(new THREE.Vector3(0, headHeight, 0));

  // create a walk control
  /**
     * at w walk in direktion of lookAt
     * at s walk in opposite direktion of lookAt
     * at a walk in direktion of lookAt rotated by 90°
     * at d walk in direktion of lookAt rotated by -90°
     * at space jump
     */
  window.addEventListener("keydown", event => {
    switch (event.key) {
      case "w":
        isWalking.forward = true;
        break;
      case "s":
        isWalking.backward = true;
        break;
      case "a":
        isWalking.left = true;
        break;
      case "d":
        isWalking.right = true;
        break;
    }
  });
  window.addEventListener("keyup", event => {
    switch (event.key) {
      case "w":
        isWalking.forward = false;
        break;
      case "s":
        isWalking.backward = false;
        break;
      case "a":
        isWalking.left = false;
        break;
      case "d":
        isWalking.right = false;
        break;
    }
  });
  createPlayerPyramide();
}

// create new enum for directions
const directions = {
  forward: 0,
  backward: 1,
  left: 2,
  right: 3
};

/**
 * @param {THREE.Vector3} position
 * @param {THREE.Vector3} lookAt
 * @param {number} distance
 * @param {number} direction
 */
function getNewPosition(
  position,
  lookAt,
  distance,
  direction = directions.forward
) {
  const newPosition = new THREE.Vector3(position.x, position.y, position.z);
  switch (direction) {
    case directions.forward:
      newPosition.add(lookAt.clone().multiplyScalar(distance));
      break;
    case directions.backward:
      newPosition.add(lookAt.clone().multiplyScalar(-distance));
      break;
    case directions.left:
      newPosition.add(
        lookAt
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(90))
          .multiplyScalar(distance)
      );
      break;
    case directions.right:
      newPosition.add(
        lookAt
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(-90))
          .multiplyScalar(-distance)
      );
      break;
  }
  newPosition.y = position.y;
  return newPosition;
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}

/**
 * @param {THREE.PerspectiveCamera} cam
 */
function getCameraLookAt(cam) {
  var vector = new THREE.Vector3(0, 0, -1);
  vector.applyQuaternion(cam.quaternion);
  console.log(vector);
  return vector;
}

function createPlayerPyramide() {
  // create a player pyramid
  const playerGeometry = new THREE.BoxGeometry(1, headHeight, 1);
  const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.set(startPoint.x, headHeight / 2 + 0, startPoint.z);
  scene.add(player);
  myObjects.player = player;
}

/**
 * @param {THREE.Mesh} mesh1
 * @param {THREE.Mesh} mesh2
 */
function checkCollision(mesh1, mesh2) {
  const box1 = new THREE.Box3().setFromObject(mesh1);
  const box2 = new THREE.Box3().setFromObject(mesh2);
  return box1.intersectsBox(box2);
}

function handleWalking() {

  // check if the camera is inside mash
  getAllMeshsFromNestedGroup(scene).forEach(mesh => {
    if (checkIfPointIsInsideMesh(camera.position, mesh)) console.log("inside");
  });

  // store previeous position of player to check for collision
  const previousPosition = new THREE.Vector3(
    myObjects.player.position.x,
    myObjects.player.position.y,
    myObjects.player.position.z
  );
  let isCollision = false;

  // walk if the user is pressing a key TODO: Optimize if
  if (isWalking.forward) {
    const newPosition = getNewPosition(
      myObjects.player.position,
      getCameraLookAt(camera),
      distancePerWalk
    );
    myObjects.player.position.set(newPosition.x, newPosition.y, newPosition.z);
  } else if (isWalking.backward) {
    const newPosition = getNewPosition(
      myObjects.player.position,
      getCameraLookAt(camera),
      -distancePerWalk
    );
    myObjects.player.position.set(newPosition.x, newPosition.y, newPosition.z);
  } else if (isWalking.left) {
    const newPosition = getNewPosition(
      myObjects.player.position,
      getCameraLookAt(camera),
      distancePerWalk,
      directions.left
    );
    myObjects.player.position.set(newPosition.x, newPosition.y, newPosition.z);
  } else if (isWalking.right) {
    const newPosition = getNewPosition(
      myObjects.player.position,
      getCameraLookAt(camera),
      -distancePerWalk,
      directions.right
    );
    myObjects.player.position.set(newPosition.x, newPosition.y, newPosition.z);
  }

  // check if the player is inside a mesh
  getAllMeshsFromNestedGroup(scene).forEach(mesh => {
    if (mesh === myObjects.player) return;
    if (checkCollision(myObjects.player, mesh)) {
      console.log("overleap at ", mesh);
      isCollision = true;
    }
  });

  // if the player is inside a mesh, set the position back to the previous position
  if (isCollision === true) {
    myObjects.player.position.set(
      previousPosition.x,
      previousPosition.y,
      previousPosition.z
    );
  }

  // update the camera position
  camera.position.set(
    myObjects.player.position.x,
    headHeight,
    myObjects.player.position.z
  );
}
