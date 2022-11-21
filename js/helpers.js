/**
 * Fetches a gltf model from the given url and returns it
 * @param { string } path the path to the gltf model
 * @param { string } alternativePath the path to the gltf model if the first path is not working
 * @returns { Promise<THREE.Mesh> } mesh mesh of the gltf model
 */
async function getMeshFromBlenderModel(path, alternativePath = "") {

  // @ts-ignore
  const loader = new THREE.GLTFLoader();
  let mesh;

  // check if file exists
  const response = await fetch(path);
  if (response.status === 404) {
    console.warn(`local file of model (${path}) not found`);
    if (alternativePath === "") {
      console.warn("no alternative path provided");
      console.error("model not found");
      return;
    }
    console.log(`trying to load model from alternative path (${alternativePath})`);
    path = alternativePath;
  }

  // use three.js to load the model
  await loader.load(
    path,
    (gltf) => {
      mesh = gltf.scene;
      dispatchEvent(new Event("modelLoaded"));
    },
    undefined, (error) => console.error(error)
  )

  // wait till the model is loaded
  await new Promise(resolve => addEventListener("modelLoaded", resolve, { once: true }));

  return mesh;
}


/**
 * Checks if a point is inside a mesh
 * @param { THREE.Vector3 } point point to check
 * @param { THREE.Mesh } mesh mesh to check
 * @returns { boolean } true if the point is inside the mesh
 */
function checkIfPointIsInsideMesh(point, mesh) {
  try {
    mesh.updateMatrixWorld();
    var localPt = mesh.worldToLocal(point.clone());
    return mesh.geometry?.boundingBox?.containsPoint(localPt);
  } catch (error) {
    return false;
  }
}


/**
 * Gets the vector where the camera is looking at
 * @param {THREE.PerspectiveCamera} cam camera to get the vector from
 * @returns {THREE.Vector3} vector where the camera is looking at
 */
function getCameraLookAt(cam) {
  var vector = new THREE.Vector3(0, 0, -1);
  vector.applyQuaternion(cam.quaternion);
  return vector;
}


/**
 * Converts degrees to radians
 * @param {number} deg The angle in degrees
 * @returns {number} The radian value of the given degree
 */
function degToRad(deg) {
  return deg * Math.PI / 180;
}


/**
 * Checks if two meshes are intersecting with each other
 * @param {THREE.Mesh} mesh1 first mesh to check
 * @param {THREE.Mesh} mesh2 second mesh to check
 * @returns {boolean} true if the two meshes are intersecting
 */
function checkCollision(mesh1, mesh2) {
  const box1 = new THREE.Box3().setFromObject(mesh1);
  const box2 = new THREE.Box3().setFromObject(mesh2);
  return box1.intersectsBox(box2);
}


/**
 * Creates a bounding box around the given mesh and shows it in the scene
 * @param { THREE.Mesh } mesh mesh to create the bounding box around
 */
function showBoundingBox(mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  // @ts-ignore
  const boxHelper = new THREE.Box3Helper(box, 0xffff00);
  boxHelper.position.copy(mesh.position);
  scene.add(boxHelper);
}


/**
 * Turns a vector around the vertical axis (for plane movement)
 * @param { THREE.Vector3 } vector vector to turn
 * @param { number } angle angle to turn
 * @returns { THREE.Vector3 } turned vector
 */
function turnVectorAroundVerticalAxis(vector, angle) {
  let newVector = new THREE.Vector3(vector.x, vector.y, vector.z);
  newVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
  return newVector;
}


/**
* Turns a vector around the horizontal axis (for plane movement)
* @param {*} vector vector to turn
* @param {*} angle angle to turn
* @returns { { newVector: THREE.Vector3, turnedBeyondYAxis: boolean  } } new vector and if the vector turned beyond the y axis (to check if the plane is upside down)
*/
function turnVectorAroundHorizontalAxis(vector, angle) {

  // get the horizontal vector
  let horizontalVector = new THREE.Vector3(vector.x, 0, vector.z);
  horizontalVector.normalize();

  if (showFlightVectors) showVector(horizontalVector, sceneObjects.modelPlane.position, "horizontalVector", 0xff0000);

  // get the vertical vector
  let verticalVector = new THREE.Vector3(0, vector.y, 0);
  verticalVector.normalize();

  if (showFlightVectors) showVector(verticalVector, sceneObjects.modelPlane.position, "verticalVector", 0x00ff00);

  // get the cross product of the horizontal and vertical vector
  let crossProduct = new THREE.Vector3();
  crossProduct.crossVectors(horizontalVector, verticalVector);
  crossProduct.normalize();

  // cross product always have to be the right vector (because of the right hand rule)
  if (crossProduct.x < 0) {
    crossProduct.x *= -1;
    crossProduct.y *= -1;
    crossProduct.z *= -1;
  }
  if (vector.z < 0) {
    crossProduct.x *= -1;
    crossProduct.y *= -1;
    crossProduct.z *= -1;
  }

  if (showFlightVectors) showVector(crossProduct, sceneObjects.modelPlane.position, "cross-product", 0x0000ff);

  // rotate the vector around the cross product
  let newVector = new THREE.Vector3(vector.x, vector.y, vector.z);
  newVector.applyAxisAngle(crossProduct, -angle);

  // check if one of the x or z values are 0 to avoid division by 0
  if (newVector.x === 0 || newVector.z === 0 || vector.x === 0 || vector.z === 0) {
    return { newVector, turnedBeyondYAxis: false };
  }

  // check if the vector turned beyond the y axis
  let turnedBeyondYAxis = false;
  if (
    (newVector.x / Math.abs(newVector.x)) !== (vector.x / Math.abs(vector.x)) ||
    (newVector.z / Math.abs(newVector.z)) !== (vector.z / Math.abs(vector.z))
  ) {
    turnedBeyondYAxis = true;
  }

  return { newVector, turnedBeyondYAxis };
}


/**
 * Shows a vector in the scene and if the vector is already shown the previous one will be removed
 * @param { THREE.Vector3 } vector vector to show
 * @param { THREE.Vector3 } position position of the vector
 * @param { string } name name of the vector
 * @param { number } color color of the vector
 */
function showVector(vector, position, name, color = 0xffffff) {
  scene.remove(scene.getObjectByName(name));
  let helper = new THREE.ArrowHelper(vector, position, 1, color);
  helper.name = name;
  scene.add(helper);
}