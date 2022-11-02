// @ts-check

async function placeObjects() {

    // add a test cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); myObjects.cube = cube;
    domEvents.addEventListener(
        cube,
        "click",
        function (event) {
            console.log("you clicked on the mesh");
        },
        false
    );
    myObjects.cube.position.set(0, 3, 0);

    // add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff);
    scene.add(pointLight);

    // load the blender models
    let classroom = await getMashFromBlenderModel("../blender/Physikraum.glb");
    let chair01 = await getMashFromBlenderModel("../blender/chair.glb");
    let lightSwitch = await getMashFromBlenderModel("../blender/lightswitch.glb");

    scene.add(lightSwitch); myObjects.lightSwitch = lightSwitch;

    // add the blender models to the scene
    myObjects.chairs = [];
    scene.add(chair01); myObjects.chairs.push(chair01);
    scene.add(classroom); myObjects.classroom = classroom;

    // TODO: change the position of all chairs in separate file
    myObjects.chairs[0].isOnTable = false;
    myObjects.chairs[0].isOnGround = true;
    myObjects.chairs[0].position.set(10, 0.5 * getHeightOfMesh(myObjects.chairs[0]), 10);

}