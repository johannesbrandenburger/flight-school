// @ts-check

/**
 * places all objects in the scene and adds them to the myObjects object
 */
async function placeObjects() {

    // add a test cube
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube); myObjects.cube = cube;
    // domEvents.addEventListener(
    //     cube,
    //     "click",
    //     function (event) {
    //         console.log("you clicked on the mesh");
    //     },
    //     false
    // );
    // myObjects.cube.position.set(0, 3, 0);

    // axes Helper
    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);

    // room walls
    let room = await getMashFromBlenderModel("../blender/room_door.glb");
    scene.add(room); myObjects.room = room;
    myObjects.room.position.set(0, 0, 0);
    getAllMeshsFromNestedGroup(myObjects.room).forEach(mesh => {
        mesh.castShadow = true;
        if (mesh.name === "") {
            mesh.name = "part of room";
        }
    });

    // landscape environment
    let environment = await getMashFromBlenderModel("../blender/mountain_landscape.glb");
    scene.add(environment); myObjects.environment = environment;
    myObjects.environment.position.set(-25, -1.5, -1);
    myObjects.environment.rotation.y = 147 * Math.PI / 180;

    // turn castShadow on for all meshes of the environment
    getAllMeshsFromNestedGroup(myObjects.environment).forEach(mesh => {
        console.log(mesh);
        if (mesh.isMesh && mesh.name == "Trunk_Material001_0") {
            mesh.castShadow = true;
        }
    });

    // create blue sky box
    const skyBox = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.MeshBasicMaterial({ color: 0x5c5cf2, side: THREE.BackSide })
    );
    scene.add(skyBox); myObjects.skyBox = skyBox;
    myObjects.skyBox.position.set(0, 0, 0);
}