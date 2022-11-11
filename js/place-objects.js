// @ts-check

/**
 * places all objects in the scene and adds them to the myObjects object
 */
async function placeObjects() {

    // room walls
    let room = await getMashFromBlenderModel("../blender/room_door.glb");
    scene.add(room); myObjects.room = room;
    myObjects.room.position.set(5.213, 0, 5.750);
    // getAllMeshsFromNestedGroup(myObjects.room).forEach(mesh => {
    //     console.log(mesh.name);
    //     mesh.receiveShadow = true;
    //     if (mesh.name === "") {
    //         mesh.name = "part of room";
    //     }
    // });

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

    //#region tables

    myObjects.tables = [];

    // table 1
    let tableOne = tableModel.clone();
    tableOne.rotateY(degToRad(90));
    tableOne.position.set(2.026, 0, 5.9);
    scene.add(tableOne);
    myObjects.tables.push(tableOne);

    // table 2
    let tableTwo = tableModel.clone();
    tableTwo.rotateY(degToRad(90));
    tableTwo.position.set(2.026, 0, 7.7);
    scene.add(tableTwo);
    myObjects.tables.push(tableTwo);

    // table 3
    let tableThree = tableModel.clone();
    tableThree.rotateY(degToRad(90));
    tableThree.position.set(2.026, 0, 9.5);
    scene.add(tableThree);
    myObjects.tables.push(tableThree);

    // table 4
    let tableFour = tableModel.clone();
    tableFour.position.set(2.926, 0, 4.1);
    scene.add(tableFour);
    myObjects.tables.push(tableFour);

    // table 5
    let tableFive = tableModel.clone();
    tableFive.position.set(2.926, 0, 6.5);
    scene.add(tableFive);
    myObjects.tables.push(tableFive);

    // table 6
    let tableSix = tableModel.clone();
    tableSix.position.set(2.926, 0, 8.6);
    scene.add(tableSix);
    myObjects.tables.push(tableSix);

    // table 7
    let tableSeven = tableModel.clone();
    tableSeven.rotateY(degToRad(90));
    tableSeven.position.set(7.726, 0, 5.9);
    scene.add(tableSeven);
    myObjects.tables.push(tableSeven);

    // table 8
    let tableEight = tableModel.clone();
    tableEight.rotateY(degToRad(90));
    tableEight.position.set(7.726, 0, 7.7);
    scene.add(tableEight);
    myObjects.tables.push(tableEight);

    // table 9
    let tableNine = tableModel.clone();
    tableNine.rotateY(degToRad(90));
    tableNine.position.set(7.726, 0, 9.5);
    scene.add(tableNine);
    myObjects.tables.push(tableNine);

    // table 10
    let tableTen = tableModel.clone();
    tableTen.position.set(5.926, 0, 4.1);
    scene.add(tableTen);
    myObjects.tables.push(tableTen);

    // table 11
    let tableEleven = tableModel.clone();
    tableEleven.position.set(5.926, 0, 6.5);
    scene.add(tableEleven);
    myObjects.tables.push(tableEleven);

    // table 12
    let tableTwelve = tableModel.clone();
    tableTwelve.position.set(5.926, 0, 8.6);
    scene.add(tableTwelve);
    myObjects.tables.push(tableTwelve);

    console.log("myObjects.tableTwelve);", tableTwelve);

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

    //#endregion

    //#region chairs

    myObjects.chairs = [];

    // chair 1
    let chairOne = chairModel.clone();
    chairOne.rotateY(degToRad(270));
    chairOne.position.set(1.8, 0, 4.65);
    scene.add(chairOne);
    myObjects.chairs.push(chairOne);

    // chair 2
    let chairTwo = chairModel.clone();
    chairTwo.rotateY(degToRad(270));
    chairTwo.position.set(1.8, 0, 5.35);
    scene.add(chairTwo);
    myObjects.chairs.push(chairTwo);

    // chair 3
    let chairThree = chairModel.clone();
    chairThree.rotateY(degToRad(270));
    chairThree.position.set(1.8, 0, 6.45);
    scene.add(chairThree);
    myObjects.chairs.push(chairThree);

    // chair 4
    let chairFour = chairModel.clone();
    chairFour.rotateY(degToRad(270));
    chairFour.position.set(1.8, 0, 7.15);
    scene.add(chairFour);
    myObjects.chairs.push(chairFour);

    // chair 5
    let chairFive = chairModel.clone();
    chairFive.rotateY(degToRad(270));
    chairFive.position.set(1.8, 0, 8.25);
    scene.add(chairFive);
    myObjects.chairs.push(chairFive);

    // chair 6
    let chairSix = chairModel.clone();
    chairSix.rotateY(degToRad(270));
    chairSix.position.set(1.8, 0, 8.95);
    scene.add(chairSix);
    myObjects.chairs.push(chairSix);

    // chair 7
    let chairSeven = chairModel.clone();
    chairSeven.rotateY(degToRad(0));
    chairSeven.position.set(3.5, 0, 5.3);
    scene.add(chairSeven);
    myObjects.chairs.push(chairSeven);

    // chair 8
    let chairEight = chairModel.clone();
    chairEight.rotateY(degToRad(0));
    chairEight.position.set(4.2, 0, 5.3);
    scene.add(chairEight);
    myObjects.chairs.push(chairEight);

    // chair 9
    let chairNine = chairModel.clone();
    chairNine.rotateY(degToRad(0));
    chairNine.position.set(3.5, 0, 7.65);
    scene.add(chairNine);
    myObjects.chairs.push(chairNine);

    // chair 10
    let chairTen = chairModel.clone();
    chairTen.rotateY(degToRad(0));
    chairTen.position.set(4.2, 0, 7.65);
    scene.add(chairTen);
    myObjects.chairs.push(chairTen);

    // chair 11
    let chairEleven = chairModel.clone();
    chairEleven.rotateY(degToRad(0));
    chairEleven.position.set(3.5, 0, 9.75);
    scene.add(chairEleven);
    myObjects.chairs.push(chairEleven);

    // chair 12
    let chairTwelve = chairModel.clone();
    chairTwelve.rotateY(degToRad(0));
    chairTwelve.position.set(4.2, 0, 9.75);
    scene.add(chairTwelve);
    myObjects.chairs.push(chairTwelve);

    // chair 13
    let chairThirteen = chairModel.clone();
    chairThirteen.rotateY(degToRad(90));
    chairThirteen.position.set(8.9, 0, 4.65);
    scene.add(chairThirteen);
    myObjects.chairs.push(chairThirteen);

    // chair 14
    let chairFourteen = chairModel.clone();
    chairFourteen.rotateY(degToRad(90));
    chairFourteen.position.set(8.9, 0, 5.35);
    scene.add(chairFourteen);
    myObjects.chairs.push(chairFourteen);

    // chair 15
    let chairFifteen = chairModel.clone();
    chairFifteen.rotateY(degToRad(90));
    chairFifteen.position.set(8.9, 0, 6.45);
    scene.add(chairFifteen);
    myObjects.chairs.push(chairFifteen);

    // chair 16
    let chairSixteen = chairModel.clone();
    chairSixteen.rotateY(degToRad(90));
    chairSixteen.position.set(8.9, 0, 7.15);
    scene.add(chairSixteen);
    myObjects.chairs.push(chairSixteen);

    // chair 17
    let chairSeventeen = chairModel.clone();
    chairSeventeen.rotateY(degToRad(90));
    chairSeventeen.position.set(8.9, 0, 8.25);
    scene.add(chairSeventeen);
    myObjects.chairs.push(chairSeventeen);

    // chair 18
    let chairEighteen = chairModel.clone();
    chairEighteen.rotateY(degToRad(90));
    chairEighteen.position.set(8.9, 0, 8.95);
    scene.add(chairEighteen);
    myObjects.chairs.push(chairEighteen);

    // chair 19
    let chairNineteen = chairModel.clone();
    chairNineteen.rotateY(degToRad(0));
    chairNineteen.position.set(6.5, 0, 5.3);
    scene.add(chairNineteen);
    myObjects.chairs.push(chairNineteen);

    // chair 20
    let chairTwenty = chairModel.clone();
    chairTwenty.rotateY(degToRad(0));
    chairTwenty.position.set(7.2, 0, 5.3);
    scene.add(chairTwenty);
    myObjects.chairs.push(chairTwenty);

    // chair 21
    let chairTwentyOne = chairModel.clone();
    chairTwentyOne.rotateY(degToRad(0));
    chairTwentyOne.position.set(6.5, 0, 7.65);
    scene.add(chairTwentyOne);
    myObjects.chairs.push(chairTwentyOne);

    // chair 22
    let chairTwentyTwo = chairModel.clone();
    chairTwentyTwo.rotateY(degToRad(0));
    chairTwentyTwo.position.set(7.2, 0, 7.65);
    scene.add(chairTwentyTwo);
    myObjects.chairs.push(chairTwentyTwo);

    // chair 23
    let chairTwentyThree = chairModel.clone();
    chairTwentyThree.rotateY(degToRad(0));
    chairTwentyThree.position.set(6.5, 0, 9.75);
    scene.add(chairTwentyThree);
    myObjects.chairs.push(chairTwentyThree);

    // chair 24
    let chairTwentyFour = chairModel.clone();
    chairTwentyFour.rotateY(degToRad(0));
    chairTwentyFour.position.set(7.2, 0, 9.75);
    scene.add(chairTwentyFour);
    myObjects.chairs.push(chairTwentyFour);

    // to low performance to add shadows to all chairs
    // [...myObjects.chairs, myObjects.profChair].forEach((chair) => {
    //     chair.traverse((child) => { child.castShadow = true; });
    // });

    //#endregion

    // lightswitch 1
    let lightSwitchOne = await getMashFromBlenderModel("../blender/lightswitch.glb")
    scene.add(lightSwitchOne); myObjects.lightSwitchOne = lightSwitchOne;
    lightSwitchOne.position.set(9.6, 0.9, 11.5);

    // lightswitch 2
    let lightSwitchTwo = lightSwitchOne.clone();
    scene.add(lightSwitchTwo); myObjects.lightSwitchTwo = lightSwitchTwo;
    lightSwitchTwo.position.set(9.6, 1.0, 11.5);

    // lightswitch 3
    let lightSwitchThree = lightSwitchOne.clone();
    scene.add(lightSwitchThree); myObjects.lightSwitchThree = lightSwitchThree;
    lightSwitchThree.position.set(9.6, 1.1, 11.5);


    //#region 360 degree environment/background

    // sphere shape
    let geometry = new THREE.SphereGeometry(400, 800, 800);
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    const texture = loader.load("./../textures/background.jpeg")
    let material = new THREE.MeshBasicMaterial({ map: texture });

    let backgroundSphere = new THREE.Mesh(geometry, material);
    backgroundSphere.position.set(5.213, 10, 5.75);
    scene.add(backgroundSphere);

    //#endregion

    // create blue sky box
    const skyBox = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.MeshBasicMaterial({ color: 0x5c5cf2, side: THREE.BackSide })
    );
    scene.add(skyBox); myObjects.skyBox = skyBox;
    myObjects.skyBox.position.set(0, 0, 0);
}