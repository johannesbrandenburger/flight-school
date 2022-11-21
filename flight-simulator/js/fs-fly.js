/**
 * Initializes the flying controls
 */
async function initFlying() {

    // as further the mouse is right/left of the cross the more the plane is moving right/left
    // headingTo = { right: int, up: int } stores values from 0 to 100 
    // headingTo = { right: -80, up: 5 } would move the plane a bit up and strongly to the left

    // change cursor to crosshair
    document.body.style.cursor = "crosshair";

    window.addEventListener("mousemove", event => {
        headingTo.right = invertedControls ? (event.clientX - window.innerWidth / 2) / 2 : - (event.clientX - window.innerWidth / 2) / 2;
        headingTo.up = invertedControls ? (window.innerHeight / 2 - event.clientY) / 2 : - (window.innerHeight / 2 - event.clientY) / 2;
        document.body.style.cursor = "crosshair";
        if (headingTo.right > 100) { headingTo.right = 100; document.body.style.cursor = "e-resize"; }
        if (headingTo.right < -100) { headingTo.right = -100; document.body.style.cursor = "w-resize"; }
        if (headingTo.up > 100) { headingTo.up = 100; document.body.style.cursor = "n-resize"; }
        if (headingTo.up < -100) { headingTo.up = -100; document.body.style.cursor = "s-resize"; }
    });

    // if its a mobile device, use touch controls
    if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
        let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
        window.addEventListener("touchstart", event => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });
        window.addEventListener("touchmove", event => {
            touchEndX = event.touches[0].clientX;
            touchEndY = event.touches[0].clientY;
            headingTo.right = invertedControls ? (touchEndX - touchStartX) * 1 : -(touchEndX - touchStartX) * 1;
            headingTo.up = invertedControls ? (touchStartY - touchEndY) * 1 : -(touchStartY - touchEndY) * 1;
            if (headingTo.right > 100) { headingTo.right = 100; }
            if (headingTo.right < -100) { headingTo.right = -100; }
            if (headingTo.up > 100) { headingTo.up = 100; }
            if (headingTo.up < -100) { headingTo.up = -100; }
        });
    }

    await createModelPlane();

    camera.lookAt(sceneObjects.modelPlane.position);
}


/**
 * Moves the Plane and the Camera
 */
function handleFlying() {

    if (!sceneObjects.modelPlane) return;

    // get the planes lookAt vector by its quaternion
    let quaternion = sceneObjects.modelPlane.quaternion;
    let planeLookAt = new THREE.Vector3(0, 0, 1);
    planeLookAt.applyQuaternion(quaternion);
    planeLookAt.normalize();

    // planeRotationFactor
    let planeRotationFactor = basePlaneRotateFactor;
    if (planeIsUpsideDown) {
        planeRotationFactor = -basePlaneRotateFactor;
    }

    // manipulate the lookAt vector by the headingTo values
    let turnedBeyondYAxis = false;
    planeLookAt = turnVectorAroundVerticalAxis(planeLookAt, degToRad(headingTo.right * - planeRotationFactor));
    let horizontalTurn = turnVectorAroundHorizontalAxis(planeLookAt, degToRad(headingTo.up * planeRotationFactor));
    planeLookAt = horizontalTurn.newVector;
    turnedBeyondYAxis = horizontalTurn.turnedBeyondYAxis;
    if (turnedBeyondYAxis) planeIsUpsideDown = !planeIsUpsideDown;
    planeLookAt.normalize();

    // set the new lookAt vector
    let newPointToLookAt = new THREE.Vector3(sceneObjects.modelPlane.position.x + planeLookAt.x, sceneObjects.modelPlane.position.y + planeLookAt.y, sceneObjects.modelPlane.position.z + planeLookAt.z);
    sceneObjects.modelPlane.lookAt(newPointToLookAt);

    // move the plane forward (always)
    speed = calcSpeed(speed, planeLookAt.y);
    let newPlanePosition = sceneObjects.modelPlane.position.clone();
    newPlanePosition.addScaledVector(planeLookAt, speed * deltaTime);

    // apply the new position
    sceneObjects.modelPlane.position.set(newPlanePosition.x, newPlanePosition.y, newPlanePosition.z);

    // turn the camera and plane
    if (turnedBeyondYAxis) {
        camera.up.set(0, -camera.up.y, 0);
    }
    if (planeIsUpsideDown) {
        sceneObjects.modelPlane.rotateOnWorldAxis(planeLookAt, degToRad(180));
    }

    // move the camera behind the plane -lookAt
    camera.position.set(newPlanePosition.x, newPlanePosition.y, newPlanePosition.z);
    camera.position.addScaledVector(planeLookAt, -distanceOfCameraFromPlane);
    camera.lookAt(newPlanePosition);

    // tend the plane a little bit to the right/left depending on the headingTo.right value
    sceneObjects.modelPlane.rotateOnWorldAxis(planeLookAt, degToRad(headingTo.right * 0.5));
    sceneObjects.modelPlane.updateMatrixWorld();

}


/**
 * Creates the plane model and adds it to the scene
 */
async function createModelPlane() {

    const planeStartPoint = new THREE.Vector3(torusSpawnRadius * 0.5 + 2, 8, torusSpawnRadius * 0.5 + 2);

    // load the plane model
    const modelPlane = await getMashFromBlenderModel("./low-poly_airplane.glb-low", "https://download1591.mediafire.com/1ukswzole2ag/2otcm1ju178d63g/basic_plane.glb");
    scene.add(modelPlane);

    /** @type { THREE.Mesh } */
    sceneObjects.modelPlane = modelPlane;

    // set the plane position
    sceneObjects.modelPlane.position.set(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z);
    sceneObjects.modelPlane.scale.set(0.002, 0.003, 0.003);
    sceneObjects.modelPlane.lookAt(planeStartPoint.x - 1, planeStartPoint.y, planeStartPoint.z - 1);
}


/**
 * Calculates the speed depending on the y value of the planeLookAt vector and the previous speed
 * @param {number} v0 previous speed
 * @param {*} y y value of the planeLookAt vector 1 = straight up, -1 = straight down
 */
function calcSpeed(v0, y) {

    const g = 9.81;
    const aGravity = g * -y;
    const aThrust = 10;
    const aAirResistance = - v0 * v0 * 0.9;

    const a = aGravity + aThrust + aAirResistance;

    const v1 = v0 + a * deltaTime;

    return v1;
}