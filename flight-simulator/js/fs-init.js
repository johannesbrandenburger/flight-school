/**
 * Initializes the flight simulator game
 */
async function init() {

    // add a loading div
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading";
    loadingDiv.innerHTML = "Loading...";
    document.body.appendChild(loadingDiv);

    // add a div for the score
    const scoreDiv = document.createElement("div");
    scoreDiv.id = "score";
    scoreDiv.innerHTML = "Score: 0";
    document.body.appendChild(scoreDiv);

    // add a div for the time
    const timeDiv = document.createElement("div");
    timeDiv.id = "time";
    timeDiv.innerHTML = "Time left: " + timeLeft;
    document.body.appendChild(timeDiv);

    // add a div for telling the user to not fly out of bounds
    const outOfBoundsDiv = document.createElement("div");
    outOfBoundsDiv.id = "outOfBounds";
    outOfBoundsDiv.innerHTML = "Don't fly out of bounds!";
    document.body.appendChild(outOfBoundsDiv);

    // config for three.js
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // resize the renderer when the window is resized
    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // enable THREEx dom events
    domEvents = new THREEx.DomEvents(camera, renderer.domElement);

    // add a clock
    clock = new THREE.Clock();
    deltaTime = 0;

    // add the renderer to the dom
    camera.position.set(4, 8, 17);

    initStats();
    initDevControls();

    placeTorusObjects();
    placeObstaclesObjects();

    // add a point light to the top of the scene
    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(0, torusSpawnRadius, -100);
    scene.add(pointLight);
    scene.add(new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.5))

    // init ocean and sky
    await initOceanAndSky();

    // add the plane
    await initFlying();
    startTime = new Date().getTime();
    checkForPlaneCollision = false;

    // add event listener on mouse click
    document.addEventListener("click", () => {
        speed += 5;
    });

    // add the canvas and remove the loading div
    document.body.appendChild(renderer.domElement);
    document.body.removeChild(loadingDiv);

}


/**
 * Initializes the ocean and sky
 * !!! This code and the textures are directly from three.js !!!
 */
async function initOceanAndSky() {

    // sun
    sun = new THREE.Vector3();
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    // water
    water = new THREE.Water(
        waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('../textures/waternormals.jpg', function (texture) { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
    );
    water.rotation.x = - Math.PI / 2;
    scene.add(water);

    // sky
    const sky = new THREE.Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    const parameters = {
        elevation: 0.4,
        azimuth: 180
    };
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    let renderTarget;
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    sky.material.uniforms['sunPosition'].value.copy(sun);
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    if (renderTarget !== undefined) renderTarget.dispose();
    renderTarget = pmremGenerator.fromScene(sky);
    scene.environment = renderTarget.texture;

}


/**
 * Initialize the FPS stats
 */
function initStats() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '10px';
    stats.domElement.style.top = '80px';
    stats.domElement.id = "stats";
    stats.domElement.style.display = "none";
    document.body.appendChild(stats.domElement);
}


/**
 * Quits the game and shows a game over message
 */
function gameOver() {

    // remove the plane
    scene.remove(sceneObjects.modelPlane);

    // stop the game
    isFlying = false;

    // set cursor to default
    document.body.style.cursor = "pointer";

    const gameOverScreen = document.createElement("div");
    gameOverScreen.classList.add("gameOverScreen");
    document.body.appendChild(gameOverScreen);
    const gameOverContent = document.createElement("div");
    gameOverContent.classList.add("gameOverContent");
    gameOverScreen.appendChild(gameOverContent);

    // show game over message and score in the middle of the screen
    const gameOverDiv = document.createElement("div");
    gameOverDiv.innerHTML = "Game over! </br> Your score is: " + torusScore;
    gameOverDiv.classList.add("gameOverDiv");
    gameOverContent.appendChild(gameOverDiv);


    const controlPanel = document.createElement("div");
    controlPanel.classList.add("controlPanel");
    gameOverContent.appendChild(controlPanel);
    // show restart button
    const restartButton = document.createElement("button");
    restartButton.innerHTML = "Restart";
    restartButton.classList.add("restartButton");
    restartButton.onclick = () => {
        location.reload();
    }
    controlPanel.appendChild(restartButton);

    // show a exit button
    const exitButton = document.createElement("button");
    exitButton.innerHTML = "Exit Flight Simulator";
    exitButton.classList.add("exitButton");
    exitButton.onclick = () => {
        location.href = "/?redirect-from=flight-simulator";
    }
    controlPanel.appendChild(exitButton);
}

/**
 * Initialize developer controls / keyboard shortcuts and experimental features
 */
function initDevControls() {

    window.addEventListener("keydown", event => {
        switch (event.key) {

            case "j":
            case "J":


                // toggle stats visibility
                stats.domElement.style.display = stats.domElement.style.display === "none" ? "block" : "none";

                break;

            case "k":
            case "K":

                // toogle vector visibility
                showFlightVectors = !showFlightVectors;

                break;

            case "f":
            case "F":

                // go back to flight school
                location.href = "/?redirect-from=flight-simulator";

                break;

            case "i":
            case "I":

                // invert controls
                invertedControls = !invertedControls;

                break;

            case "p":
            case "P":

                // pause the game
                if (isFlying) {
                    isFlying = false;
                    document.getElementById("time").innerHTML = "Paused";
                } else {
                    isFlying = true;
                }

                break;

        }
    });

}