// @ts-check

function placeLights() {

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
    const roomLightHeight = 2.9;

    myObjects.bulbLights = [];

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

    roomLightConfig.forEach((lightConfig) => {
        const bulbLight = new THREE.PointLight(roomLightColor, roomLightIntensity, 100, roomLightDecay);
        bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
        bulbLight.position.set(lightConfig.x, roomLightHeight, lightConfig.z);
        bulbLight.castShadow = true;
        bulbLight.name = lightConfig.cluster;
        scene.add(bulbLight);
        myObjects.bulbLights.push(bulbLight);
    });

    // hemispheric light
    let hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.2);
    scene.add(hemiLight);

    // daylight
    let dayLight = new THREE.PointLight(0xffffff, 0.2);
    dayLight.position.set(-16, 3, 6);
    dayLight.castShadow = true;
    dayLight.shadow.mapSize.width = 1024 * 2;
    dayLight.shadow.mapSize.height = 1024 * 2;
    scene.add(dayLight);


}