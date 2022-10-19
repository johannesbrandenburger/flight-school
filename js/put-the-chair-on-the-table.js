// @ts-check

const chairAnimationSpeed = 1;
const tableHeight = 3;
let chairAnimationIsActive = { up: false, down: false };
let chairAnimationInitialPosition = new THREE.Vector3(0, 0, 0);
let chairAnimationStartTime = 0;

function initPutChairOnTheTable() {
  myObjects.chairs.forEach(chair => {
    domEvents.addEventListener(
      chair,
      "click",
      function (event) {
        console.log("you clicked on the chair", chair);

        if (!chair.isOnTable && !chair.isOnGround) return;

        chairAnimationIsActive = { up: chair.isOnGround, down: chair.isOnTable };
        chair.isOnTable = chair.isOnGround = false;
        chairAnimationInitialPosition = chair.position;
        chairAnimationStartTime = clock.getElapsedTime();
      },
      false
    );
  });
}

function handleAnimateChairs() {
  myObjects.chairs.forEach((chair) => {
    if (chair.isOnTable || chair.isOnGround) return;

    const timeSinceAnimationStart = clock.getElapsedTime() - chairAnimationStartTime;

    const newChairPos = getChairAnimationPosition(chairAnimationInitialPosition, timeSinceAnimationStart);
    chair.position.set(newChairPos.x, newChairPos.y, newChairPos.z)

  });
}

/**
 * @param {THREE.Vector3} initialPosition
 * @param {number} timeSinceAnimationStart
 */
function getChairAnimationPosition(initialPosition, timeSinceAnimationStart) {
  
  const timeSinceAnimationStartInMs = timeSinceAnimationStart * 1000;
  const chairAnimationDurationInMs = 2000;
  const chairHeight = getHeightOfMesh(myObjects.chairs[0]);
  const distanceToMove = tableHeight;
  const distanceToMovePerMs = distanceToMove / chairAnimationDurationInMs;
  let distanceNow = distanceToMovePerMs * timeSinceAnimationStartInMs;
  distanceNow = chairAnimationIsActive.up ? distanceNow : -distanceNow;

  
  if (initialPosition.y + distanceNow - 0.5*chairHeight > tableHeight) {
    chairAnimationIsActive = { up: false, down: false };
    myObjects.chairs[0].isOnTable = true;
    return new THREE.Vector3(initialPosition.x, tableHeight+0.5*chairHeight, initialPosition.z);
  }
  if (initialPosition.y + distanceNow < 0.5*chairHeight) {
    chairAnimationIsActive = { up: false, down: false };
    myObjects.chairs[0].isOnGround = true;
    return new THREE.Vector3(initialPosition.x, 0.5*chairHeight, initialPosition.z);
  }

  // const chairDistanceZ = 1.5;
  // const zToMovePerMs = chairDistanceZ / chairAnimationDurationInMs;
  // let zNow = zToMovePerMs * timeSinceAnimationStartInMs;
  // zNow = timeSinceAnimationStart * 10000 > chairAnimationDurationInMs ? - zNow : zNow;
  // console.log("zNow", zNow);
  // console.log("timeSinceAnimationStart", timeSinceAnimationStart * 10000);
  // console.log("chairAnimationDurationInMs", chairAnimationDurationInMs);

  const newChairPos = new THREE.Vector3(
    initialPosition.x,
    initialPosition.y + distanceNow,
    initialPosition.z
  );

  return newChairPos;
}