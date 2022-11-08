// @ts-check

// global variables
var container,
    stats,
    scene,
    camera,
    renderer,
    controls,
    effect,
    animationTimeoutMs,
    domEvents,
    myObjects = {},
    testBall,
    isWalking = { forward: false, backward: false, left: false, right: false },
    isMouseDown = false,
    isMovingCamera = false,
    clock,
    planeLookAt,
    headingTo = { right: 0, up: 0 },
    arrowHelpers = []
    ;

const torusScale = 0.2;
const torusRadius = 2 * torusScale;
const torusTube = 0.3 * torusScale;
const torusSpawnRadius = 100 * torusScale;
const torusAmount = 300;
const extraTorusAmount = 30;
let torusScore = 0;
let hasScored = false;
let startTime = null;
let timeLeft = 60;
let sun, water;
let planeWingSize = 0.1;
let isFlying = true;


init().then(() => {
    console.log("init done");
    animate();
});


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
    scoreDiv.style.position = "absolute";
    scoreDiv.style.top = "10px";
    scoreDiv.style.left = "10px";
    scoreDiv.style.color = "white";
    scoreDiv.style.fontSize = "2em";
    document.body.appendChild(scoreDiv);

    // add a div for the time
    const timeDiv = document.createElement("div");
    timeDiv.id = "time";
    timeDiv.innerHTML = "Time left: " + timeLeft;
    timeDiv.style.position = "absolute";
    timeDiv.style.top = "10px";
    timeDiv.style.right = "10px";
    timeDiv.style.color = "white";
    timeDiv.style.fontSize = "2em";
    document.body.appendChild(timeDiv);

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

    // add the renderer to the dom
    camera.position.set(4, 8, 17);

    placeTorusObjects();

    // add a point light to the top of the scene
    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(0, torusSpawnRadius + 10, 0);
    scene.add(pointLight);
    scene.background = new THREE.Color(0x330000);

    // init ocean and sky
    await initOceanAndSky();

    await initFlying();
    startTime = new Date().getTime();
    checkForPlaneCollision = false;

    // add event listener on mouse down to speed up the plane by 100%
    window.addEventListener("mousedown", () => {
        distancePerFly = distancePerFly * 2;
    });

    // add event listener on mouse up to slow down the plane by 50%
    window.addEventListener("mouseup", () => {
        distancePerFly = distancePerFly / 2;
    });

    // TEMP add event listerner to redirect to homepage at pressing f
    window.addEventListener("keydown", (e) => {
        if (e.key === "f") {
            window.location.href = "/";
        }
    });

    // add event listener to pause the game
    window.addEventListener("keydown", (e) => {
        if (e.key === "p") {
            if (isFlying) {
                isFlying = false;
                document.getElementById("time").innerHTML = "Paused";
            } else {
                isFlying = true;
            }
        }
    });

    // add the canvas and remove the loading div
    document.body.appendChild(renderer.domElement);
    document.body.removeChild(loadingDiv);

}


/**
 * Places torus objects in the scene at random positions+
 */
function placeTorusObjects() {
    for (let i = 0; i < torusAmount + extraTorusAmount; i++) {
        const torus = new THREE.Mesh(
            new THREE.TorusGeometry(torusRadius, torusTube, 16, 100),
            new THREE.MeshPhongMaterial({ color: 0xff0000 })
        );
        torus.position.set(
            (Math.random() - 0.5) * torusSpawnRadius,
            (Math.random()) * torusSpawnRadius,
            (Math.random() - 0.5) * torusSpawnRadius
        );
        torus.castShadow = true;

        // rotate the torus (either 0 or 90 degrees around the x or z or y axis)
        torus.rotation.x = Math.random() > 0.5 ? Math.PI / 2 : 0;
        torus.rotation.z = Math.random() > 0.5 ? Math.PI / 2 : 0;
        torus.rotation.y = Math.random() > 0.5 ? Math.PI / 2 : 0;
        scene.add(torus);
        torus.name = "torus";

        // if torus is in the extra torus amount, make it gold and name it "extraTorus"
        if (i >= torusAmount) {
            torus.material.color.setHex(0xffd700);
            torus.name = "extraTorus";
        }

        // check if torus intersects with another torus
        let torusIntersects = false;
        for (let j = 0; j < scene.children.length; j++) {
            const otherTorus = scene.children[j];
            if (otherTorus !== torus) {
                const distance = torus.position.distanceTo(otherTorus.position);
                if (distance < 5 * torusScale) {
                    torusIntersects = true;
                }
            }
        }
        if (torusIntersects) {
            i -= 1;
            scene.remove(torus);
        }
    }
}


/**
 * Handles the collision detection between the plane and the torus objects
 * If plane collides with a torus, the torus is removed from the scene and the score is updated
 */
function handleScore() {

    if (!myObjects.modelPlane) return;


    const planePosition = myObjects.modelPlane.position;

    if (planePosition.y < 0) {
        gameOver();
        return;
    }

    let nearestTorus = null;

    // check if plane intersects with a torus
    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].name !== "torus" && scene.children[i].name !== "extraTorus") continue;

        // get nearest torus
        const torus = scene.children[i];
        if (!nearestTorus) {
            nearestTorus = torus;
        } else {
            const distanceToTorus = torus.position.distanceTo(planePosition);
            const distanceToNearestTorus = nearestTorus.position.distanceTo(planePosition);
            if (distanceToTorus < distanceToNearestTorus) {
                nearestTorus = torus;
            }
        }
    }

    // check if plane intersects with the nearest torus
    const distanceToCenter = nearestTorus.position.distanceTo(planePosition);

    // check if the planes position is inside the torus
    const boundingBox = new THREE.Box3().setFromObject(nearestTorus);
    if (boundingBox.containsPoint(planePosition)) {

        // check the distance to the center of the torus
        if (distanceToCenter < torusRadius - 0.5 * torusTube && !hasScored) {
            nearestTorus.material.color.set(0x00ff00);
            nearestTorus.material.needsUpdate = true;
            torusScore = nearestTorus.name === "extraTorus" ? torusScore + 5 : torusScore + 1;
            hasScored = true;
            document.getElementById("score").innerHTML = "Score: " + torusScore;

            // remove the torus after 1 second
            setTimeout(() => {
                scene.remove(nearestTorus);
                hasScored = false;
            }, 500);
        }

        if (distanceToCenter > torusRadius - planeWingSize - 0.5 * torusTube && distanceToCenter < torusRadius + torusTube + planeWingSize) {
            gameOver();
        }
    }
}


/**
 * Animates the scene
 */
async function animate() {

    requestAnimationFrame( animate );

    if (isFlying) {
        handleFlying();
        handleScore();
        handleTime();
    }
    water.material.uniforms[ 'time' ].value += 0.005
    renderer.render(scene, camera);
    await new Promise(resolve => setTimeout(resolve, animationTimeoutMs));
}


/**
 * Decreases the time and checks if the time is up
 */
function handleTime() {
    const currentTime = new Date().getTime();
    timeLeft = 60 - Math.floor((currentTime - startTime) / 1000);
    document.getElementById("time").innerHTML = "Time left: " + timeLeft;

    if (timeLeft <= 0) {
        gameOver();
        return;
    }
}


/**
 * Quits the game and shows a game over message TODO: add a ui for this
 */
function gameOver() {

    // remove all event listeners
    window.removeEventListener("mousedown", () => {
        distancePerFly = distancePerFly * 2;
    });
    window.removeEventListener("mouseup", () => {
        distancePerFly = distancePerFly / 2;
    });

    // remove the plane
    scene.remove(myObjects.modelPlane);

    // stop the game
    isFlying = false;

    // set cursor to default
    document.body.style.cursor = "pointer";

    // show game over message and score in the middle of the screen
    const gameOverDiv = document.createElement("div");
    gameOverDiv.id = "gameOverDiv";
    gameOverDiv.innerHTML = "Game over! Your score is: " + torusScore;
    gameOverDiv.style.position = "absolute";
    gameOverDiv.style.top = "50%";
    gameOverDiv.style.left = "50%";
    gameOverDiv.style.transform = "translate(-50%, -50%)";
    gameOverDiv.style.fontSize = "50px";
    gameOverDiv.style.color = "white";
    document.body.appendChild(gameOverDiv);

    // show restart button
    const restartButton = document.createElement("button");
    restartButton.id = "restartButton";
    restartButton.innerHTML = "Restart";
    restartButton.style.position = "absolute";
    restartButton.style.top = "50%";
    restartButton.style.left = "50%";
    restartButton.style.transform = "translate(-50%, -50%)";
    restartButton.style.fontSize = "50px";
    restartButton.style.color = "white";
    restartButton.style.backgroundColor = "black";
    restartButton.style.border = "none";
    restartButton.style.padding = "20px";
    restartButton.style.cursor = "pointer";
    restartButton.style.marginTop = "100px";
    restartButton.onclick = () => {
        location.reload();
    }
    document.body.appendChild(restartButton);


}


/**
 * Init the ocean and sky
 * This code and the textures are directly from three.js
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
        elevation: 2,
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