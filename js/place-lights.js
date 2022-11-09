// @ts-check

function placeLights() {

    // add glowing sphere to the scene
    const pointLight = new THREE.PointLight(0xfffff0, 2, 100);
    pointLight.position.set(-25, 20, 10);
    pointLight.castShadow = true;
    scene.add(pointLight);

    pointLight.shadow.mapSize.width = 1024 * 2;
    pointLight.shadow.mapSize.height = 1024 * 2;
    pointLight.shadow.camera.near = 0.5; // default
    pointLight.shadow.camera.far = 500; // default

    const helper = new THREE.CameraHelper(pointLight.shadow.camera);
    scene.add(helper);

    // add env light
    const envLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(envLight);

    // light on top of room
    const roomLight = new THREE.PointLight(0xffffff, 0.5, 100);
    roomLight.position.set(5.213, 2, 5.750);
    roomLight.castShadow = true;
    roomLight.shadow.mapSize.width = 1024 * 2;
    roomLight.shadow.mapSize.height = 1024 * 2;
    scene.add(roomLight);

    // light directed on blackboard
    const blackboardLight = new THREE.SpotLight(0xffffff, 0.5, 100, degToRad(30), 0.1);
    blackboardLight.position.set(5.213, 2, 3.7);
    blackboardLight.castShadow = true;
    blackboardLight.target.position.set(5.213, 1, 0);
    blackboardLight.shadow.mapSize.width = 1024 * 2;
    blackboardLight.shadow.mapSize.height = 1024 * 2;
    scene.add(blackboardLight);
    scene.add(blackboardLight.target);

}