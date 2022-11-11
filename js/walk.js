// @ts-check

// create config
const headHeight = 1.50;
const startPoint = new THREE.Vector3(9, headHeight, 11);
const mouseRotateSpeed = 0.2;
const playerWidth = 0.4;
const mouseZoomSpeed = 0.8;
const baseDistancePerWalk = 4
let distancePerWalk = baseDistancePerWalk;

/**
 * Initialize the walking controls
 */
function initWalk() {

  camera.lookAt(new THREE.Vector3(0, headHeight, 0));

  // register key events
  window.addEventListener("keydown", event => {
    switch (event.key) {
      case "ArrowUp":
      case "w":
      case "W":
        isWalking.forward = true;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        isWalking.backward = true;
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        isWalking.left = true;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        isWalking.right = true;
        break;
      case "Shift":
      case "shift":
        distancePerWalk = baseDistancePerWalk * 2;
        break;
      // TEMP: remove later
      case "f":
        window.location.href = "/flight-simulator";
        break;
    }
  });

  window.addEventListener("keyup", event => {
    switch (event.key) {
      case "ArrowUp":
      case "w":
      case "W":
        isWalking.forward = false;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        isWalking.backward = false;
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        isWalking.left = false;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        isWalking.right = false;
        break;
      case "Shift":
      case "shift":
        distancePerWalk = baseDistancePerWalk;
        break;
    }
  });
  createPlayer();
}


/**
 * Get the new position of the player/camera
 * @param {THREE.Vector3} position
 * @param {THREE.Vector3} lookAt
 * @param {number} distance
 * @param { { forward: boolean, backward: boolean, left: boolean, right: boolean } } isWalking
 */
function getNewPosition(position, lookAt, distance, isWalking) {
  const newPosition = new THREE.Vector3(position.x, position.y, position.z);

  // check if two keys are pressed at the same time
  if ((isWalking.forward && (isWalking.left || isWalking.right)) || (isWalking.backward && (isWalking.left || isWalking.right))) {
    distance = distance / 2;
  }

  if (isWalking.forward === true) {
    newPosition.add(lookAt.clone().multiplyScalar(distance));
  }

  if (isWalking.backward === true) {
    newPosition.add(lookAt.clone().multiplyScalar(-distance));
  }

  if (isWalking.left === true) {
    newPosition.add(
      lookAt
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(90))
        .multiplyScalar(distance)
    );
  }

  if (isWalking.right === true) {
    newPosition.add(
      lookAt
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(-90))
        .multiplyScalar(distance)
    );
  }

  newPosition.y = position.y;
  return newPosition;
}


/**
 * Creates a player mesh and adds it to the scene
 */
function createPlayer() {
  const playerGeometry = new THREE.BoxGeometry(playerWidth, headHeight, playerWidth);
  const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 });
  const player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.set(startPoint.x, headHeight / 2 + 0.2, startPoint.z);
  scene.add(player);
  myObjects.player = player;
}


/**
 * Handle the walking of the player
 * Is called every frame in animate.js
 */
function handleWalking() {

  // store previous position of player to check for collision
  const previousPosition = new THREE.Vector3(
    myObjects.player.position.x,
    myObjects.player.position.y,
    myObjects.player.position.z
  );
  let isCollision = false;

  // walk if the user is pressing a key
  if (isWalking.forward || isWalking.backward || isWalking.left || isWalking.right) {
    const newPosition = getNewPosition(
      myObjects.player.position,
      getCameraLookAt(camera),
      distancePerWalk * deltaTime,
      isWalking
    );
    myObjects.player.position.set(newPosition.x, newPosition.y, newPosition.z);
    // console.log(myObjects.player.position);
  }

  // check if the player is inside a mesh
  let allMeshs = getAllMeshsFromNestedGroup(scene);
  for (let i = 0; i < allMeshs.length; i++) {
    if (allMeshs[i] !== myObjects.player) {

      // TODO: exceptions can be removed later
      if (checkCollision(myObjects.player, allMeshs[i])
        && allMeshs[i].name !== "Floor"
        && allMeshs[i].name !== "Ground_Material007_0"
        && allMeshs[i].name !== "Trunk_Material001_0"
        && allMeshs[i].name !== "Trunk_Trunk_0"
        && allMeshs[i].name !== "Grass_Material_0"
        && allMeshs[i].name !== "Mud_Material004_0"
        && allMeshs[i].name !== "Watter_Material005_0"
        && allMeshs[i].name !== ""
      ) {
        // console.log("collision with");
        // console.log(allMeshs[i]);
        isCollision = true;
        break;
      }
    }
  }

  // if the player is inside a mesh, set the position back to the previous position
  // if (isCollision === true) {
  //   myObjects.player.position.set(
  //     previousPosition.x,
  //     previousPosition.y,
  //     previousPosition.z
  //   );
  // }

  // update the camera position
  camera.position.set(
    myObjects.player.position.x,
    headHeight,
    myObjects.player.position.z
  );
}


/**
 * Lets user rotate the camera with the mouse
 */
function initMouseClickMove() {

  window.addEventListener("mousedown", event => {
    isMouseDown = true;
  });

  window.addEventListener("mouseup", event => {
    isMouseDown = false;
    isMouseOnBlackboardBoard1 = false;
    isMouseOnBlackboardBoard2 = false;
  });

  window.addEventListener("mousemove", event => {
    if (!isMouseDown || isMouseOnBlackboardBoard1 || isMouseOnBlackboardBoard2) return;
    isMovingCamera = true;
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), event.movementX * mouseRotateSpeed * deltaTime);
    camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), event.movementY * mouseRotateSpeed * deltaTime);
  });

  window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
    if ((camera.fov + delta * mouseZoomSpeed) < 135 && (camera.fov + delta * mouseZoomSpeed) > 20) {
      camera.fov += delta * mouseZoomSpeed;
      camera.updateProjectionMatrix();
    }
  });

}