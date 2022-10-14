// @ts-check

function walk() {

    // create config
    const headHeight = 4;
    const startPoint = new THREE.Vector3(-10, headHeight, -3);

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

}

// create new enum for directions
const directions = {
    forward: 0,
    backward: 1,
    left: 2,
    right: 3,
};

/**
 * @param {THREE.Vector3} position
 * @param {THREE.Vector3} lookAt
 * @param {number} distance
 * @param {number} direction
 */
function getNewPosition(position, lookAt, distance, direction = directions.forward) {
    const newPosition = new THREE.Vector3(position.x, position.y, position.z);
    switch (direction) {
        case directions.forward:
            newPosition.add(lookAt.clone().multiplyScalar(distance));
            break;
        case directions.backward:
            newPosition.add(lookAt.clone().multiplyScalar(-distance));
            break;
        case directions.left:
            newPosition.add(lookAt.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(90)).multiplyScalar(distance));
            break;
        case directions.right:
            newPosition.add(lookAt.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(-90)).multiplyScalar(-distance));
            break;
    }
    return newPosition;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

/**
 * @param {THREE.PerspectiveCamera} cam
 */
function getCameraLookAt(cam) {
    var vector = new THREE.Vector3(0, 0, - 1);
    vector.applyQuaternion(cam.quaternion);
    console.log(vector);
    return vector;
}