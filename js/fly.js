// @ts-check

let distancePerFly = 1.5;
const planeStartPoint = new THREE.Vector3(4, 0.85, 3);
const distanceOfCameraFromPlane = 1.5;
let checkForPlaneCollision = true;

/**
 * Initializes the flying controls
 */
async function initFlying() {

    camera.lookAt(planeStartPoint);

    // createCrosshair();

    // as further the mouse is right/left of the cross the more the plane is moving right/left
    // headingTo = { right: int, up: int } stores values from 0 to 100 
    // headingTo = { right: -80, up: 5 } would move the plane a bit up and strongly to the left

    // change cursor to crosshair
    document.body.style.cursor = "crosshair";

    window.addEventListener("mousemove", event => {
        headingTo.right = - (event.clientX - window.innerWidth / 2) / 2;
        headingTo.up = - (window.innerHeight / 2 - event.clientY) / 2;
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

    camera.lookAt(myObjects.modelPlane.position);
}


/**
 * Moves the Plane and the Camera
 */
function handleFlying() {

    if (!myObjects.modelPlane) return;
    
    // get the planes lookAt vector by its quaternion
    let quaternion = myObjects.modelPlane.quaternion;
    let planeLookAt = new THREE.Vector3(0, 0, 1);
    planeLookAt.applyQuaternion(quaternion);
    planeLookAt.normalize();
    
    // manipulate the lookAt vector by the headingTo values
    planeLookAt = turnVectorAroundVerticalAxis(planeLookAt, degToRad(headingTo.right * - 0.01));
    planeLookAt = turnVectorAroundHorizontalAxis(planeLookAt, degToRad(headingTo.up * 0.03));
    planeLookAt.normalize();

    // set the new lookAt vector
    let newPointToLookAt = new THREE.Vector3(myObjects.modelPlane.position.x + planeLookAt.x, myObjects.modelPlane.position.y + planeLookAt.y, myObjects.modelPlane.position.z + planeLookAt.z);
    myObjects.modelPlane.lookAt(newPointToLookAt);

    // move the plane forward (always)
    let newPlanePosition = myObjects.modelPlane.position.clone();
    newPlanePosition.addScaledVector(planeLookAt, distancePerFly * deltaTime);

    // apply the new position
    myObjects.modelPlane.position.set(newPlanePosition.x, newPlanePosition.y, newPlanePosition.z);

    // move the camera behind the plane -lookAt
    camera.position.set(newPlanePosition.x, newPlanePosition.y, newPlanePosition.z);
    camera.position.addScaledVector(planeLookAt, -distanceOfCameraFromPlane);
    camera.lookAt(newPlanePosition);

    // tend the plane a little bit to the right/left depending on the headingTo.right value
    myObjects.modelPlane.rotateOnWorldAxis(planeLookAt, degToRad(headingTo.right * 0.4));

    if (!checkForPlaneCollision) return;

    // check for collision
    let planeCollided = false;
    let allMeshs = getAllMeshsFromNestedGroup(scene);
    for (let i = 0; i < allMeshs.length; i++) {
        if (allMeshs[i] !== myObjects.modelPlane && !meshIsChildOf(allMeshs[i], myObjects.modelPlane) && allMeshs[i].name !== "" && !getAllMeshsFromNestedGroup(myObjects.environment).includes(allMeshs[i])) {
            if (checkCollision(myObjects.modelPlane, allMeshs[i])) {
                console.log("collision with ");
                console.log(allMeshs[i]);
                planeCollided = true;
                break;
            }
        }
    }
    if (planeCollided) {
        distancePerFly = 0;

        // show the plane in red
        myObjects.modelPlane.traverse(function (child) {
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
    myObjects.modelPlane = modelPlane;

    // set the plane position
    myObjects.modelPlane.position.set(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z);
    myObjects.modelPlane.scale.set(0.002, 0.003, 0.003);
    myObjects.modelPlane.lookAt(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z - 1);
}


/**
 * Turns a vector around the vertical axis (for plane movement)
 * @param { THREE.Vector3 } vector
 * @param { number } angle 
 * @returns 
 */
function turnVectorAroundVerticalAxis(vector, angle) {
    let newVector = new THREE.Vector3(vector.x, vector.y, vector.z);
    newVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    return newVector;
}


/**
 * Turns a vector around the horizontal axis (for plane movement)
 * @param {*} vector 
 * @param {*} angle 
 * @returns 
 */
function turnVectorAroundHorizontalAxis(vector, angle) {

    let newVector = new THREE.Vector3(vector.x, vector.y + 0.5 * angle, vector.z);
    return newVector;

    // TODO: check if more complex calculation is needed

    // // get the horizontal vector
    // let horizontalVector = new THREE.Vector3(vector.x, 0, vector.z);
    // horizontalVector.normalize();

    // // get the vertical vector
    // let verticalVector = new THREE.Vector3(0, vector.y, 0);
    // verticalVector.normalize();

    // // get the cross product of the horizontal and vertical vector
    // let crossProduct = new THREE.Vector3();
    // crossProduct.crossVectors(horizontalVector, verticalVector);
    // crossProduct.normalize();

    // // rotate the vector around the cross product
    // let newVector = new THREE.Vector3(vector.x, vector.y, vector.z);
    // newVector.applyAxisAngle(crossProduct, angle);

    // return newVector;
}


/**
 * Checks if a mesh is a child of another mesh (recursive)
 * @param {THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>} possibleChild
 * @param {THREE.Mesh} parent
 */
function meshIsChildOf(possibleChild, parent) {
    if (possibleChild.parent === parent) return true;
    if (possibleChild.parent === null) return false;
    // @ts-ignore
    return meshIsChildOf(possibleChild.parent, parent);
}
