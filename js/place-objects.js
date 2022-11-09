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
    myObjects.room.position.set(5.213, 0, 5.750);
    getAllMeshsFromNestedGroup(myObjects.room).forEach(mesh => {
        mesh.castShadow = true;
        if (mesh.name === "") {
            mesh.name = "part of room";
        }
    });

    // windows
    // add a cube to the scene
    const windowMaterial = new THREE.MeshPhysicalMaterial({
        metalness: 0,  
        roughness: 0,
        transmission: 1,
        thickness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
      });
    const bigWindowGeometry = new THREE.BoxGeometry(0.02, 1, 2.45);
    const bigWindow = new THREE.Mesh(bigWindowGeometry, windowMaterial)
    bigWindow.position.set(-0.075, 1.5, 3.975);
    scene.add(bigWindow);
    const smallWindowGeometry = new THREE.BoxGeometry(0.02, 1, 1.5);
    const smallWindow = new THREE.Mesh(smallWindowGeometry, windowMaterial)
    smallWindow.position.set(-0.075, 1.5, 8.750);
    scene.add(smallWindow);

    // blackboard
    let blackboard = await getMashFromBlenderModel("../blender/blackboard.glb");
    scene.add(blackboard); myObjects.blackboard = blackboard;
    myObjects.blackboard.position.set(3.400, 0, 0.4);
    getAllMeshsFromNestedGroup(myObjects.blackboard).forEach(mesh => {
        mesh.receiveShadow = true;
    });

    // closet 1
    let closetOne = await getMashFromBlenderModel("../blender/Closet.glb");
    scene.add(closetOne); myObjects.closetOne = closetOne;
    myObjects.closetOne.rotateY(degToRad(180));
    myObjects.closetOne.position.set(8.926, 0, 0);

    // closet 2
    let closetTwo = await getMashFromBlenderModel("../blender/Closet.glb");
    scene.add(closetTwo); myObjects.closetTwo = closetTwo;
    myObjects.closetTwo.rotateY(degToRad(180));
    myObjects.closetTwo.position.set(9.926, 0, 0);
    myObjects.closetTwo.castShadow = true;

    // sideboard 1
    let sideboardOne = await getMashFromBlenderModel("../blender/sideboard.glb");
    scene.add(sideboardOne); myObjects.sideboardOne = sideboardOne;
    myObjects.sideboardOne.rotateY(degToRad(270));
    myObjects.sideboardOne.position.set(0, 0, 0);
    myObjects.sideboardOne.receiveShadow = true;

    // sideboard 2
    let sideboardTwo = await getMashFromBlenderModel("../blender/sideboard.glb");
    scene.add(sideboardTwo); myObjects.sideboardTwo = sideboardTwo;
    myObjects.sideboardTwo.rotateY(degToRad(270));
    myObjects.sideboardTwo.position.set(1.5, 0, 0);
    myObjects.sideboardTwo.receiveShadow = true;

    // sideboard 3
    let sideboardThree = await getMashFromBlenderModel("../blender/sideboard.glb");
    scene.add(sideboardThree); myObjects.sideboardThree = sideboardThree;
    myObjects.sideboardThree.rotateY(degToRad(0));
    myObjects.sideboardThree.position.set(0, 0, 7.45);
    myObjects.sideboardThree.receiveShadow = true;

    // prof chair
    let profChair = await getMashFromBlenderModel("../blender/chair.glb");
    scene.add(profChair); myObjects.profChair = profChair;
    myObjects.profChair.rotateY(degToRad(180));
    myObjects.profChair.position.set(3.6, 0, 2.2);

    // prof table
    let profTable = await getMashFromBlenderModel("../blender/table.glb");
    scene.add(profTable); myObjects.profTable = profTable;
    myObjects.profTable.position.set(3, 0, 2.5);

    // keyboard
    let keyboard = await getMashFromBlenderModel("../blender/Keyboard.glb");
    scene.add(keyboard); myObjects.keyboard = keyboard;
    myObjects.keyboard.position.set(3.8, 0.79, 2.8);
    myObjects.keyboard.rotateY(degToRad(180));
    getAllMeshsFromNestedGroup(myObjects.keyboard).forEach(mesh => {
        mesh.receiveShadow = true;
    });

    // monitor
    let monitor = await getMashFromBlenderModel("../blender/Monitor.glb");
    scene.add(monitor); myObjects.monitor = monitor;
    myObjects.monitor.position.set(3.6, 0.79, 3.2);
    myObjects.monitor.rotateY(degToRad(270));
    getAllMeshsFromNestedGroup(myObjects.monitor).forEach(mesh => {
        mesh.receiveShadow = true;
    });

    //#region tables

    myObjects.tables = [];

    // table 1
    let tableOne = await getMashFromBlenderModel("../blender/table.glb");
    tableOne.rotateY(degToRad(90));
    tableOne.position.set(2.026, 0, 5.9);
    scene.add(tableOne);
    myObjects.tables.push(tableOne);

    // table 2
    let tableTwo = await getMashFromBlenderModel("../blender/table.glb");
    tableTwo.rotateY(degToRad(90));
    tableTwo.position.set(2.026, 0, 7.7);
    scene.add(tableTwo);
    myObjects.tables.push(tableTwo);

    // table 3
    let tableThree = await getMashFromBlenderModel("../blender/table.glb");
    tableThree.rotateY(degToRad(90));
    tableThree.position.set(2.026, 0, 9.5);
    scene.add(tableThree);
    myObjects.tables.push(tableThree);

    // table 4
    let tableFour = await getMashFromBlenderModel("../blender/table.glb");
    tableFour.position.set(2.926, 0, 4.1);
    scene.add(tableFour);
    myObjects.tables.push(tableFour);

    // table 5
    let tableFive = await getMashFromBlenderModel("../blender/table.glb");
    tableFive.position.set(2.926, 0, 6.5);
    scene.add(tableFive);
    myObjects.tables.push(tableFive);

    // table 6
    let tableSix = await getMashFromBlenderModel("../blender/table.glb");
    tableSix.position.set(2.926, 0, 8.6);
    scene.add(tableSix);
    myObjects.tables.push(tableSix);

    // table 7
    let tableSeven = await getMashFromBlenderModel("../blender/table.glb");
    tableSeven.rotateY(degToRad(90));
    tableSeven.position.set(7.726, 0, 5.9);
    scene.add(tableSeven);
    myObjects.tables.push(tableSeven);

    // table 8
    let tableEight = await getMashFromBlenderModel("../blender/table.glb");
    tableEight.rotateY(degToRad(90));
    tableEight.position.set(7.726, 0, 7.7);
    scene.add(tableEight);
    myObjects.tables.push(tableEight);

    // table 9
    let tableNine = await getMashFromBlenderModel("../blender/table.glb");
    tableNine.rotateY(degToRad(90));
    tableNine.position.set(7.726, 0, 9.5);
    scene.add(tableNine);
    myObjects.tables.push(tableNine);

    // table 10
    let tableTen = await getMashFromBlenderModel("../blender/table.glb");
    tableTen.position.set(5.926, 0, 4.1);
    scene.add(tableTen);
    myObjects.tables.push(tableTen);

    // table 11
    let tableEleven = await getMashFromBlenderModel("../blender/table.glb");
    tableEleven.position.set(5.926, 0, 6.5);
    scene.add(tableEleven);
    myObjects.tables.push(tableEleven);

    // table 12
    let tableTwelve = await getMashFromBlenderModel("../blender/table.glb");
    tableTwelve.position.set(5.926, 0, 8.6);
    scene.add(tableTwelve);
    myObjects.tables.push(tableTwelve);

    // add shadow to tables
    myObjects.tables.forEach(table => {
        getAllMeshsFromNestedGroup(table).forEach(mesh => {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        });
    });

    //#endregion

    //#region chairs

    myObjects.chairs = [];

    // chair 1
    let chairOne = await getMashFromBlenderModel("../blender/chair.glb");
    chairOne.rotateY(degToRad(270));
    chairOne.position.set(1.8, 0, 4.65);
    scene.add(chairOne);
    myObjects.chairs.push(chairOne);
    
    // chair 2
    let chairTwo = await getMashFromBlenderModel("../blender/chair.glb");
    chairTwo.rotateY(degToRad(270));
    chairTwo.position.set(1.8, 0, 5.35);
    scene.add(chairTwo);
    myObjects.chairs.push(chairTwo);

    // chair 3
    let chairThree = await getMashFromBlenderModel("../blender/chair.glb");
    chairThree.rotateY(degToRad(270));
    chairThree.position.set(1.8, 0, 6.45);
    scene.add(chairThree);
    myObjects.chairs.push(chairThree);

    // chair 4
    let chairFour = await getMashFromBlenderModel("../blender/chair.glb");
    chairFour.rotateY(degToRad(270));
    chairFour.position.set(1.8, 0, 7.15);
    scene.add(chairFour);
    myObjects.chairs.push(chairFour);

    // chair 5
    let chairFive = await getMashFromBlenderModel("../blender/chair.glb");
    chairFive.rotateY(degToRad(270));
    chairFive.position.set(1.8, 0, 8.25);
    scene.add(chairFive);
    myObjects.chairs.push(chairFive);

    // chair 6
    let chairSix = await getMashFromBlenderModel("../blender/chair.glb");
    chairSix.rotateY(degToRad(270));
    chairSix.position.set(1.8, 0, 8.95);
    scene.add(chairSix);
    myObjects.chairs.push(chairSix);

    // chair 7
    let chairSeven = await getMashFromBlenderModel("../blender/chair.glb");
    chairSeven.rotateY(degToRad(0));
    chairSeven.position.set(3.5, 0, 5.3);
    scene.add(chairSeven);
    myObjects.chairs.push(chairSeven);

    // chair 8
    let chairEight = await getMashFromBlenderModel("../blender/chair.glb");
    chairEight.rotateY(degToRad(0));
    chairEight.position.set(4.2, 0, 5.3);
    scene.add(chairEight);
    myObjects.chairs.push(chairEight);

    // chair 9
    let chairNine = await getMashFromBlenderModel("../blender/chair.glb");
    chairNine.rotateY(degToRad(0));
    chairNine.position.set(3.5, 0, 7.65);
    scene.add(chairNine);
    myObjects.chairs.push(chairNine);

    // chair 10
    let chairTen = await getMashFromBlenderModel("../blender/chair.glb");
    chairTen.rotateY(degToRad(0));
    chairTen.position.set(4.2, 0, 7.65);
    scene.add(chairTen);
    myObjects.chairs.push(chairTen);

    // chair 11
    let chairEleven = await getMashFromBlenderModel("../blender/chair.glb");
    chairEleven.rotateY(degToRad(0));
    chairEleven.position.set(3.5, 0, 9.75);
    scene.add(chairEleven);
    myObjects.chairs.push(chairEleven);

    // chair 12
    let chairTwelve = await getMashFromBlenderModel("../blender/chair.glb");
    chairTwelve.rotateY(degToRad(0));
    chairTwelve.position.set(4.2, 0, 9.75);
    scene.add(chairTwelve);
    myObjects.chairs.push(chairTwelve);

    // chair 13
    let chairThirteen = await getMashFromBlenderModel("../blender/chair.glb");
    chairThirteen.rotateY(degToRad(90));
    chairThirteen.position.set(8.9, 0, 4.65);
    scene.add(chairThirteen);
    myObjects.chairs.push(chairThirteen);

    // chair 14
    let chairFourteen = await getMashFromBlenderModel("../blender/chair.glb");
    chairFourteen.rotateY(degToRad(90));
    chairFourteen.position.set(8.9, 0, 5.35);
    scene.add(chairFourteen);
    myObjects.chairs.push(chairFourteen);

    // chair 15
    let chairFifteen = await getMashFromBlenderModel("../blender/chair.glb");
    chairFifteen.rotateY(degToRad(90));
    chairFifteen.position.set(8.9, 0, 6.45);
    scene.add(chairFifteen);
    myObjects.chairs.push(chairFifteen);

    // chair 16
    let chairSixteen = await getMashFromBlenderModel("../blender/chair.glb");
    chairSixteen.rotateY(degToRad(90));
    chairSixteen.position.set(8.9, 0, 7.15);
    scene.add(chairSixteen);
    myObjects.chairs.push(chairSixteen);

    // chair 17
    let chairSeventeen = await getMashFromBlenderModel("../blender/chair.glb");
    chairSeventeen.rotateY(degToRad(90));
    chairSeventeen.position.set(8.9, 0, 8.25);
    scene.add(chairSeventeen);
    myObjects.chairs.push(chairSeventeen);

    // chair 18
    let chairEighteen = await getMashFromBlenderModel("../blender/chair.glb");
    chairEighteen.rotateY(degToRad(90));
    chairEighteen.position.set(8.9, 0, 8.95);
    scene.add(chairEighteen);
    myObjects.chairs.push(chairEighteen);

    // chair 19
    let chairNineteen = await getMashFromBlenderModel("../blender/chair.glb");
    chairNineteen.rotateY(degToRad(0));
    chairNineteen.position.set(6.5, 0, 5.3);
    scene.add(chairNineteen);
    myObjects.chairs.push(chairNineteen);

    // chair 20
    let chairTwenty = await getMashFromBlenderModel("../blender/chair.glb");
    chairTwenty.rotateY(degToRad(0));
    chairTwenty.position.set(7.2, 0, 5.3);
    scene.add(chairTwenty);
    myObjects.chairs.push(chairTwenty);

    // chair 21
    let chairTwentyOne = await getMashFromBlenderModel("../blender/chair.glb");
    chairTwentyOne.rotateY(degToRad(0));
    chairTwentyOne.position.set(6.5, 0, 7.65);
    scene.add(chairTwentyOne);
    myObjects.chairs.push(chairTwentyOne);

    // chair 22
    let chairTwentyTwo = await getMashFromBlenderModel("../blender/chair.glb");
    chairTwentyTwo.rotateY(degToRad(0));
    chairTwentyTwo.position.set(7.2, 0, 7.65);
    scene.add(chairTwentyTwo);
    myObjects.chairs.push(chairTwentyTwo);

    // chair 23
    let chairTwentyThree = await getMashFromBlenderModel("../blender/chair.glb");
    chairTwentyThree.rotateY(degToRad(0));
    chairTwentyThree.position.set(6.5, 0, 9.75);
    scene.add(chairTwentyThree);
    myObjects.chairs.push(chairTwentyThree);

    // chair 24
    let chairTwentyFour = await getMashFromBlenderModel("../blender/chair.glb");
    chairTwentyFour.rotateY(degToRad(0));
    chairTwentyFour.position.set(7.2, 0, 9.75);
    scene.add(chairTwentyFour);
    myObjects.chairs.push(chairTwentyFour);
    





    // add window glass
    // let squareGeometry = new THREE.PlaneGeometry(1, 0.5);
    // const glassMaterial = new THREE.MeshPhysicalMaterial( {
    //     color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
    // } );
    // let square = new THREE.Mesh(squareGeometry, glassMaterial);
    // square.receiveShadow = true;
    // scene.add(square); myObjects.square = square;
    // myObjects.square.position.set(0, 1.5, 4);
    // myObjects.square.rotateY(degToRad(90));



    // const mirrorBack1 = new THREE.Reflector(
    //     new THREE.PlaneBufferGeometry(1, 0.5),
    //     {
    //         color: new THREE.Color(0x7f7f7f),
    //         textureWidth: window.innerWidth * window.devicePixelRatio,
    //         textureHeight: window.innerHeight * window.devicePixelRatio
    //     }
    // )

    // scene.add(mirrorBack1); myObjects.mirrorBack1 = mirrorBack1;
    // myObjects.mirrorBack1.position.set(0, 1.5, 4);
    // myObjects.mirrorBack1.rotateY(degToRad(90));


    // // set opacity of mirror
    // myObjects.mirrorBack1.material.opacity = 0.5;
    // myObjects.mirrorBack1.material.transparent = true;










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