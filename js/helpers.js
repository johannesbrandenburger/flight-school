// @ts-check

async function getMashFromBlenderModel(path) {
  // @ts-ignore
  const loader = new THREE.GLTFLoader();
  console.log("loading blender model");
  console.time("getMashFromBlenderModel");

  let mesh;

  await loader.load(
    path,
    function(gltf) {
      console.log("inside loader.load");
      console.timeEnd("getMashFromBlenderModel");
      mesh = gltf.scene;
      dispatchEvent(new Event("modelLoaded"));
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  // wait till the model is loaded
  await new Promise(resolve => {
    addEventListener("modelLoaded", resolve, { once: true });
  });

  console.log("loaded blender model");
  console.log("mesh", mesh);
  return mesh;
}

/**
 * @param { THREE.Vector3 } point
 * @param { THREE.Mesh } mesh
 */
function checkIfPointIsInsideMesh(point, mesh) {
  try {
    mesh.updateMatrixWorld();
    var localPt = mesh.worldToLocal(point.clone());

    // TOFIX: got boundingBox is undefined at some meshes
    return mesh.geometry?.boundingBox?.containsPoint(localPt);
  } catch (error) {
    console.warn(error);
    return false;
  }
}


/**
 * @param group
 * @returns { THREE.Mesh[] }
 */
function getAllMeshsFromNestedGroup(group) {
  let meshs = [];
  try {
    if (group.children.length === 0 || group.children === undefined)
      return meshs;
    group.children.forEach(element => {
      if (element.children.length === 0 || group.children === undefined) {
        meshs.push(element);
      } else {
        meshs.push(...getAllMeshsFromNestedGroup(element));
      }
    });
    return meshs;
  } catch (error) {
    console.warn(error);
    return [];
  }
}
