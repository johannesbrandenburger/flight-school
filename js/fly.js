// @ts-check

let distancePerFly = 0.015;
const planeStartPoint = new THREE.Vector3(4, 0.85, 3);
const distanceOfCameraFromPlane = 1.5;
let checkForPlaneCollision = true;

async function initFlying() {

    // TEMP cam position
    // camera.position.set(0.97, 1.70, 3);
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
    
    // manipulate the lookAt vector by the headingTo values
    planeLookAt = turnVectorAroundVerticalAxis(planeLookAt, degToRad(headingTo.right * - 0.01));
    planeLookAt = turnVectorAroundHorizontalAxis(planeLookAt, degToRad(headingTo.up * 0.03));
    planeLookAt.normalize();

    // set the new lookAt vector
    let newPointToLookAt = new THREE.Vector3(myObjects.modelPlane.position.x + planeLookAt.x, myObjects.modelPlane.position.y + planeLookAt.y, myObjects.modelPlane.position.z + planeLookAt.z);
    myObjects.modelPlane.lookAt(newPointToLookAt);

    // move the plane forward (always)
    let newPlanePosition = myObjects.modelPlane.position.clone();
    newPlanePosition.addScaledVector(planeLookAt, distancePerFly);

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

async function createModelPlane() {

    // load the plane model
    const modelPlane = await getMashFromBlenderModel("../blender/basic_plane.glb");
    scene.add(modelPlane);

    /** @type { THREE.Mesh } */
    myObjects.modelPlane = modelPlane;

    // set the plane position
    myObjects.modelPlane.position.set(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z);
    myObjects.modelPlane.scale.set(0.02, 0.02, 0.02);
    myObjects.modelPlane.lookAt(planeStartPoint.x, planeStartPoint.y, planeStartPoint.z - 1);

}

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

function turnVectorAroundVerticalAxis(vector, angle) {
    let newVector = new THREE.Vector3(vector.x, vector.y, vector.z);
    newVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    return newVector;
}

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
 * @param {THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>} possibleChild
 * @param {THREE.Mesh} parent
 */
function meshIsChildOf(possibleChild, parent) {
    if (possibleChild.parent === parent) return true;
    if (possibleChild.parent === null) return false;
    // @ts-ignore
    return meshIsChildOf(possibleChild.parent, parent);
}
