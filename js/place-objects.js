// @ts-check

/**
 * places all objects in the scene and adds them to the myObjects object
 */
async function placeObjects() {

    // room walls
    let room = await getMashFromBlenderModel("../blender/room_door.glb");
    scene.add(room); myObjects.room = room;
    myObjects.room.position.set(5.213, 0, 5.750);

    // adjust the shadow based on the mash
    myObjects.room.children.find(child => child.name === "Floor").receiveShadow = true;
    myObjects.room.children.find(child => child.name === "Floor_Outside").castShadow = true;
    myObjects.room.children.find(child => child.name === "Door").receiveShadow = true;
    myObjects.room.children.find(child => child.name === "Door_Outside").castShadow = true;
    myObjects.room.children.find(child => child.name === "Ceiling").receiveShadow = true;
    myObjects.room.children.find(child => child.name === "Ceiling_Outside").castShadow = true;
    myObjects.room.children.find(child => child.name === "Wall_1").traverse(child => { child.receiveShadow = true; });
    myObjects.room.children.find(child => child.name === "Wall_2").traverse(child => { child.receiveShadow = true; });
    myObjects.room.children.find(child => child.name === "Wall_3").traverse(child => { child.receiveShadow = true; });
    myObjects.room.children.find(child => child.name === "Wall_4").traverse(child => { child.receiveShadow = true; });
    myObjects.room.children.find(child => child.name === "Wall_1_Outside").castShadow = true;
    myObjects.room.children.find(child => child.name === "Wall_2_Outside").castShadow = true;
    myObjects.room.children.find(child => child.name === "Wall_3_Outside").castShadow = true;
    myObjects.room.children.find(child => child.name === "Wall_4_Outside").castShadow = true;

    console.log("room", myObjects.room);

    // windows
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        metalness: 0,
        roughness: 0,
        transmission: 1,
        // thickness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
    });

    // bigwindow
    const bigWindowGeometry = new THREE.BoxGeometry(0.02, 1, 2.45);
    const bigWindow = new THREE.Mesh(bigWindowGeometry, windowMaterial)
    bigWindow.position.set(-0.075, 1.5, 3.975);
    scene.add(bigWindow); myObjects.bigWindow = bigWindow;

    // smallwindow
    const smallWindowGeometry = new THREE.BoxGeometry(0.02, 1, 1.5);
    const smallWindow = new THREE.Mesh(smallWindowGeometry, windowMaterial)
    smallWindow.position.set(-0.075, 1.5, 8.750);
    scene.add(smallWindow); myObjects.smallWindow = smallWindow;

    // blackboard
    let blackboard = await getMashFromBlenderModel("../blender/blackboard.glb");
    scene.add(blackboard); myObjects.blackboard = blackboard;
    myObjects.blackboard.position.set(3.400, 0, 0.4);
    getAllMeshsFromNestedGroup(myObjects.blackboard).forEach(mesh => {
        mesh.receiveShadow = true;
    });

    // closet 1
    myObjects.closets = [];
    let closetOne = await getMashFromBlenderModel("../blender/Closet.glb");
    scene.add(closetOne);
    closetOne.rotateY(degToRad(180));
    closetOne.position.set(8.926, 0, 0);
    myObjects.closets.push(closetOne);

    // closet 2
    let closetTwo = closetOne.clone();
    scene.add(closetTwo);
    closetTwo.position.set(9.926, 0, 0);
    closetTwo.castShadow = true;
    myObjects.closets.push(closetTwo);

    // sideboard 1
    let sideboardOne = await getMashFromBlenderModel("../blender/sideboard.glb");
    scene.add(sideboardOne); myObjects.sideboardOne = sideboardOne;
    myObjects.sideboardOne.rotateY(degToRad(270));
    myObjects.sideboardOne.position.set(0, 0, 0);
    myObjects.sideboardOne.receiveShadow = true;

    // sideboard 2
    let sideboardTwo = sideboardOne.clone();
    scene.add(sideboardTwo); myObjects.sideboardTwo = sideboardTwo;
    myObjects.sideboardTwo.position.set(1.5, 0, 0);
    myObjects.sideboardTwo.receiveShadow = true;

    // sideboard 3
    let sideboardThree = sideboardOne.clone();
    scene.add(sideboardThree); myObjects.sideboardThree = sideboardThree;
    myObjects.sideboardThree.rotateY(degToRad(-270));
    myObjects.sideboardThree.position.set(0, 0, 7.45);
    myObjects.sideboardThree.receiveShadow = true;

    // load chair and table model one time and clone it for each char
    let chairModel = await getMashFromBlenderModel("../blender/chair.glb");
    let tableModel = await getMashFromBlenderModel("../blender/table.glb");

    // prof chair
    let profChair = chairModel.clone();
    scene.add(profChair); myObjects.profChair = profChair;
    myObjects.profChair.rotateY(degToRad(180));
    myObjects.profChair.position.set(3.6, 0, 2.2);

    // prof table
    let profTable = tableModel.clone();
    scene.add(profTable); myObjects.profTable = profTable;
    myObjects.profTable.position.set(3, 0, 2.5);

    // keyboard
    let keyboard = await getMashFromBlenderModel("../blender/Keyboard.glb");
    scene.add(keyboard); myObjects.keyboard = keyboard;
    myObjects.keyboard.position.set(3.8, 0.79, 2.8);
    myObjects.keyboard.rotateY(degToRad(180));
    myObjects.keyboard.traverse(child => {
        child.receiveShadow = true;
        child.castShadow = true;
    });

    // monitor
    let monitor = await getMashFromBlenderModel("../blender/Monitor.glb");
    scene.add(monitor); myObjects.monitor = monitor;
    myObjects.monitor.position.set(3.6, 0.79, 3.2);
    myObjects.monitor.rotateY(degToRad(270));
    myObjects.monitor.traverse(child => { child.castShadow = true; });

    // #region tables

    myObjects.tables = [];

    const tablePositions = [
        {x: 2.026, y: 0, z: 5.9, rotation: 90},
        {x: 2.026, y: 0, z: 7.7, rotation: 90},
        {x: 2.026, y: 0, z: 9.5, rotation: 90},
        {x: 2.926, y: 0, z: 4.1, rotation: 0},
        {x: 2.926, y: 0, z: 6.5, rotation: 0},
        {x: 2.926, y: 0, z: 8.6, rotation: 0},
        {x: 7.726, y: 0, z: 5.9, rotation: 90},
        {x: 7.726, y: 0, z: 7.7, rotation: 90},
        {x: 7.726, y: 0, z: 9.5, rotation: 90},
        {x: 5.926, y: 0, z: 4.1, rotation: 0},
        {x: 5.926, y: 0, z: 6.5, rotation: 0},
        {x: 5.926, y: 0, z: 8.6, rotation: 0},  
    ];

    // create tables 
    tablePositions.forEach(position => {
        let table = tableModel.clone();
        table.rotateY(degToRad(position.rotation));
        table.position.set(position.x, position.y, position.z);
        scene.add(table);
        myObjects.tables.push(table);
    });

    // add shadow to tables
    [...myObjects.tables, myObjects.profTable].forEach(table => {
        table.traverse((child) => {
            child.castShadow = true;
            if (child.name == "Tischplatte_Top") {
                child.receiveShadow = true;
                child.castShadow = false;
            }
        });
    });

    // #endregion

    // #region chairs

    myObjects.chairs = [];

    const chairPositions = [
        {x: 1.8, y: 0, z: 4.65, rotation: 270},
        {x: 1.8, y: 0, z: 5.35, rotation: 270},
        {x: 1.8, y: 0, z: 6.45, rotation: 270},
        {x: 1.8, y: 0, z: 7.15, rotation: 270},
        {x: 1.8, y: 0, z: 8.25, rotation: 270},
        {x: 1.8, y: 0, z: 8.95, rotation: 270},
        {x: 3.5, y: 0, z: 5.3, rotation: 0},
        {x: 4.2, y: 0, z: 5.3, rotation: 0},
        {x: 3.5, y: 0, z: 7.65, rotation: 0},
        {x: 4.2, y: 0, z: 7.65, rotation: 0},
        {x: 3.5, y: 0, z: 9.75, rotation: 0},
        {x: 4.2, y: 0, z: 9.75, rotation: 0},
        {x: 8.9, y: 0, z: 4.65, rotation: 90},
        {x: 8.9, y: 0, z: 5.35, rotation: 90},
        {x: 8.9, y: 0, z: 6.45, rotation: 90},
        {x: 8.9, y: 0, z: 7.15, rotation: 90},
        {x: 8.9, y: 0, z: 8.25, rotation: 90},
        {x: 8.9, y: 0, z: 8.95, rotation: 90},
        {x: 6.5, y: 0, z: 5.3, rotation: 0},
        {x: 7.2, y: 0, z: 5.3, rotation: 0},
        {x: 6.5, y: 0, z: 7.65, rotation: 0},
        {x: 7.2, y: 0, z: 7.65, rotation: 0},
        {x: 6.5, y: 0, z: 9.75, rotation: 0},
        {x: 7.2, y: 0, z: 9.75, rotation: 0},
    ];

    // create chairs
    chairPositions.forEach(position => {
        let chair = chairModel.clone();
        chair.rotateY(degToRad(position.rotation));
        chair.position.set(position.x, position.y, position.z);
        scene.add(chair);
        myObjects.chairs.push(chair);
    });

    // add shadow to chairs (to low performance to add shadows to all chairs)
    // [...myObjects.chairs, myObjects.profChair].forEach((chair) => {
    //     chair.traverse((child) => { child.castShadow = true; });
    // });

    // #endregion

    // lightswitch 1
    let lightSwitchOne = await getMashFromBlenderModel("../blender/lightswitch.glb")
    scene.add(lightSwitchOne); myObjects.lightSwitchOne = lightSwitchOne;
    lightSwitchOne.scale.set(1.4, 1.4, 1.4);
    lightSwitchOne.position.set(9.6, 0.9, 11.5);

    // lightswitch 2
    let lightSwitchTwo = lightSwitchOne.clone();
    scene.add(lightSwitchTwo); myObjects.lightSwitchTwo = lightSwitchTwo;
    lightSwitchTwo.position.set(9.6, 1.05, 11.5);

    // lightswitch 3
    let lightSwitchThree = lightSwitchOne.clone();
    scene.add(lightSwitchThree); myObjects.lightSwitchThree = lightSwitchThree;
    lightSwitchThree.position.set(9.6, 1.2, 11.5);


    // #region 360 degree environment/background

    // sphere shape
    let geometry = new THREE.SphereGeometry(400, 800, 800);
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    const texture = loader.load("./../textures/background.jpeg")
    let material = new THREE.MeshBasicMaterial({ map: texture });

    let backgroundSphere = new THREE.Mesh(geometry, material);
    backgroundSphere.position.set(5.213, 10, 5.75);
    scene.add(backgroundSphere);

    // #endregion

    // create blue sky box
    const skyBox = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.MeshBasicMaterial({ color: 0x5c5cf2, side: THREE.BackSide })
    );
    scene.add(skyBox); myObjects.skyBox = skyBox;
    myObjects.skyBox.position.set(0, 0, 0);
}