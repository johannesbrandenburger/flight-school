// @ts-check

function placeLights() {

    // add glowing sphere to the scene
    const pointLight = new THREE.PointLight(0xfffff0, 2, 100);
    pointLight.position.set(-25, 20, 10);
    pointLight.castShadow = true;
    scene.add(pointLight);

    pointLight.shadow.mapSize.width = 512; // default
    pointLight.shadow.mapSize.height = 512; // default
    pointLight.shadow.camera.near = 0.5; // default
    pointLight.shadow.camera.far = 500; // default

    const helper = new THREE.CameraHelper(pointLight.shadow.camera);
    scene.add(helper);


    // add env light
    // const envLight = new THREE.AmbientLight(0xffffff, 0.5);
    // scene.add(envLight);
}