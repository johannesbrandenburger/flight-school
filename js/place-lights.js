// @ts-check

/**
 * Places all lights in the scene
 */
async function placeLights() {

    // room light
    const bulbGeometry = new THREE.SphereGeometry(0.04, 16, 8);
    const bulbMat = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000,
    });
    const roomLightColor = 0xffeebb;
    const roomLightIntensity = 0.18;
    const roomLightDecay = 1;
    const roomLightHeight = 2.85;
    const roomLightDistance = 10.5;

    sceneObjects.bulbLights = [];

    const roomLightConfig = [
        { x: 4.326, z: 2.5, cluster: "1" },
        { x: 3, z: 5.650, cluster: "2" },
        { x: 3, z: 7.200, cluster: "2" },
        { x: 3, z: 8.750, cluster: "2" },
        { x: 6.326, z: 2.5, cluster: "1" },
        { x: 7.426, z: 5.650, cluster: "3" },
        { x: 7.426, z: 7.200, cluster: "3" },
        { x: 7.426, z: 8.750, cluster: "3" },
    ]

    // create a light and a lamp for each light config
    const lampModel = await getMashFromBlenderModel("../blender/lamp.glb");
    roomLightConfig.forEach((lightConfig) => {

        // create the light
        const bulbLight = new THREE.PointLight(roomLightColor, roomLightIntensity, roomLightDistance, roomLightDecay);
        bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
        bulbLight.position.set(lightConfig.x, roomLightHeight, lightConfig.z);
        bulbLight.castShadow = true;
        bulbLight.name = lightConfig.cluster;
        bulbLight.shadow.mapSize.width = bulbLight.shadow.mapSize.height = 512;
        bulbLight.shadow.camera.near = 0.01;
        scene.add(bulbLight);
        sceneObjects.bulbLights.push(bulbLight);

        // create the lamp
        const lamp = lampModel.clone();
        lamp.position.set(lightConfig.x, roomLightHeight + 0.15, lightConfig.z);
        lamp.traverse((child) => { child.castShadow = true; });
        lamp.scale.set(1, 1, 1);
        scene.add(lamp);
    });

    // hemispheric light
    let hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.2);
    scene.add(hemiLight);

    // daylight
    let dayLight = new THREE.PointLight(0xffffff, 0.2);
    dayLight.position.set(-16, 4, 6);
    dayLight.castShadow = true;
    dayLight.shadow.mapSize.width = 512;
    dayLight.shadow.mapSize.height = 512;
    scene.add(dayLight);


}