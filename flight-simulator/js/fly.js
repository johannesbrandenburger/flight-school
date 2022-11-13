// @ts-check

/** @type {THREE.Vector3} */
const planeStartPoint = new THREE.Vector3(4, 0.85, 3);

/** @type {number} */
const distanceOfCameraFromPlane = 1.5;

/** @type {boolean} */
let checkForPlaneCollision = true;


let speed = 1.5;

/**
 * Initializes the flying controls
 */
async function initFlying() {

    camera.lookAt(planeStartPoint);

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

    // add touch support for mobile devices
    window.addEventListener("touchmove", event => {
        headingTo.right = - (event.touches[0].clientX - window.innerWidth / 2) / 2;
        headingTo.up = - (window.innerHeight / 2 - event.touches[0].clientY) / 2;
        document.body.style.cursor = "crosshair";
        if (headingTo.right > 100) { headingTo.right = 100; document.body.style.cursor = "e-resize"; }
        if (headingTo.right < -100) { headingTo.right = -100; document.body.style.cursor = "w-resize"; }
        if (headingTo.up > 100) { headingTo.up = 100; document.body.style.cursor = "n-resize"; }
        if (headingTo.up < -100) { headingTo.up = -100; document.body.style.cursor = "s-resize"; }
    });

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

    // manipulate the lookAt vector by the headingTo values
    planeLookAt = turnVectorAroundVerticalAxis(planeLookAt, degToRad(headingTo.right * - 0.01));
    planeLookAt = turnVectorAroundHorizontalAxis(planeLookAt, degToRad(headingTo.up * 0.03));
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

    // move the camera behind the plane -lookAt
    camera.position.set(newPlanePosition.x, newPlanePosition.y, newPlanePosition.z);
    camera.position.addScaledVector(planeLookAt, -distanceOfCameraFromPlane);
    camera.lookAt(newPlanePosition);

    // tend the plane a little bit to the right/left depending on the headingTo.right value
    sceneObjects.modelPlane.rotateOnWorldAxis(planeLookAt, degToRad(headingTo.right * 0.4));

    if (!checkForPlaneCollision) return;

    // check for collision
    let planeCollided = false;
    let allMeshs = getAllMeshsFromNestedGroup(scene);
    for (let i = 0; i < allMeshs.length; i++) {
        if (allMeshs[i] !== sceneObjects.modelPlane && !meshIsChildOf(allMeshs[i], sceneObjects.modelPlane) && allMeshs[i].name !== "" && !getAllMeshsFromNestedGroup(sceneObjects.environment).includes(allMeshs[i])) {
            if (checkCollision(sceneObjects.modelPlane, allMeshs[i])) {
                console.log("collision with ", allMeshs[i]);
                planeCollided = true;
                break;
            }
        }
    }
    if (planeCollided) {
        speed = 0;

        // show the plane in red
        sceneObjects.modelPlane.traverse(function (child) {
            if (child.isMesh) {
                child.material.color.setHex(0xff0000);
            }
        });

        // timeout for 1 second
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

}


/**
 * Creates the plane model and adds it to the scene
 */
async function createModelPlane() {

    // load the plane model
    const modelPlane = await getMashFromBlenderModel("../low-poly_airplane.glb-low", "https://download1591.mediafire.com/1ukswzole2ag/2otcm1ju178d63g/basic_plane.glb");
    scene.add(modelPlane);

    /** @type { THREE.Mesh } */
    sceneObjects.modelPlane = modelPlane;

    // set the plane position
    sceneObjects.modelPlane.position.set(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z);
    sceneObjects.modelPlane.scale.set(0.002, 0.003, 0.003);
    sceneObjects.modelPlane.lookAt(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z - 1);
}


/**
 * Calculates the speed depending on the y value of the planeLookAt vector and the previous speed
 * @param {number} speed previous speed
 * @param {*} y y value of the planeLookAt vector 1 = straight up, -1 = straight down
 */
function calcSpeed(speed, y) {

    const minSpeed = 1.5;
    const maxSpeed = 3.5;
    const baseSpeed = 2;
    const yFactor = 0.1;

    let newSpeed = speed * 0.9 + baseSpeed * 0.1;
    newSpeed -= y * yFactor;

    if (newSpeed < minSpeed) newSpeed = minSpeed;
    if (newSpeed > maxSpeed) newSpeed = maxSpeed;

    return newSpeed;
}
