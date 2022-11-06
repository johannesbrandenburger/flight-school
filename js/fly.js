// @ts-check

const distancePerFly = 0.02;
const planeStartPoint = new THREE.Vector3(4, 0.85, 5);
const distanceOfCameraFromPlane = 1.5;

async function initFlying() {

    // TEMP cam position
    // camera.position.set(0.97, 1.70, 3);
    camera.lookAt(planeStartPoint);

    createCrosshair();

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

    await createModelPlane();

    camera.lookAt(myObjects.modelPlane.position);


}


function handleFlying() {

    // rotate the plane along the plane position to planeLookAt axis headingTo.right -> 90°
    // let planeRotation1 = new THREE.Vector3();
    // planeRotation1.subVectors(planeLookAt, myObjects.modelPlane.position);
    // planeRotation1.normalize();

    // // show vector in scene
    // let planeRotation1Arrow = new THREE.ArrowHelper(planeRotation1, myObjects.modelPlane.position, 1, 0xff0000);
    // scene.add(planeRotation1Arrow);

    // // rotate the plane
    // myObjects.modelPlane.setRotationFromAxisAngle(planeRotation1, degToRad(headingTo.right * 0.3));

    // // plane is now backwards -> rotate it 180°
    // myObjects.modelPlane.rotateY(degToRad(180));

    // // rotate the plane along the plane position to planeLookAt axis headingTo.up -> 90°
    // let planeRotation2 = new THREE.Vector3();
    // planeRotation2.subVectors(planeLookAt, myObjects.modelPlane.position);
    // planeRotation2.normalize();

    // get the planes lookAt vector
    // planeLookAt = getLookAtByRotation(myObjects.modelPlane.position, myObjects.modelPlane.rotation);
    movePlane();
    // myObjects.modelPlane.position.set(newPlanePosition.x, newPlanePosition.y, newPlanePosition.z);
    // console.log(newPlanePosition);

}

function movePlane() {

    if (!myObjects.modelPlane) return;

    // get the planes lookAt vector by its quaternion
    let quaternion = myObjects.modelPlane.quaternion;
    let planeLookAt = new THREE.Vector3(0, 0, 1);
    planeLookAt.applyQuaternion(quaternion);
    planeLookAt.normalize();

    console.log(planeLookAt);

    // manipulate the lookAt vector by the headingTo values
    planeLookAt = new THREE.Vector3(planeLookAt.x + headingTo.right * 0.0001, planeLookAt.y + headingTo.up * 0.0001, planeLookAt.z);
    planeLookAt.normalize();

    // set the new lookAt vector
    let newPointToLookAt = new THREE.Vector3(myObjects.modelPlane.position.x + planeLookAt.x, myObjects.modelPlane.position.y + planeLookAt.y, myObjects.modelPlane.position.z + planeLookAt.z);
    myObjects.modelPlane.lookAt(newPointToLookAt);


    // move the plane forward (always)
    let newPlanePosition = myObjects.modelPlane.position.clone();
    newPlanePosition.addScaledVector(planeLookAt, distancePerFly);

    // show vector in scene
    deleteLastArrowHelper();
    showVector(myObjects.modelPlane.position, planeLookAt, 0xff0000);

    // apply the new position
    myObjects.modelPlane.position.set(newPlanePosition.x, newPlanePosition.y, newPlanePosition.z);

    // move the camera behind the plane -lookAt
    camera.position.set(newPlanePosition.x, newPlanePosition.y, newPlanePosition.z);
    camera.position.addScaledVector(planeLookAt, -distanceOfCameraFromPlane);
    camera.lookAt(newPlanePosition);


}

async function createModelPlane() {

    // load the plane model
    const modelPlane = await getMashFromBlenderModel("../blender/basic_plane.glb");
    scene.add(modelPlane);

    /** @type { THREE.Mesh } */
    myObjects.modelPlane = modelPlane;

    // set the plane position
    myObjects.modelPlane.position.set(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z);
    myObjects.modelPlane.scale.set(0.05, 0.05, 0.05);
    myObjects.modelPlane.lookAt(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z - 1);

    // set the plane look at
    // planeLookAt = new THREE.Vector3(planeStartPoint.x, planeStartPoint.y, 0);
    // myObjects.modelPlane.lookAt(planeLookAt);


}

// function getLookAtByRotation(position, rotation) {
//     let planeLookAt = new THREE.Vector3(0, 0, -1);
//     planeLookAt.applyQuaternion(rotation);
//     planeLookAt.add(position);
//     return planeLookAt;
// }


function showVector(position, vector, color) {
    let arrow = new THREE.ArrowHelper(vector, position, 1, color);
    scene.add(arrow);
    arrowHelpers.push(arrow);
}

function deleteLastArrowHelper() {
    if (arrowHelpers.length > 0) {
        scene.remove(arrowHelpers[arrowHelpers.length - 1]);
        arrowHelpers.pop();
    }
}