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
const torusAmount = 500;
let torusScore = 0;
let hasScored = false;
let startTime = null;
let timeLeft = 60;
let sun, water;


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

    // remove the loading div
    document.body.removeChild(loadingDiv);

    // add the renderer to the dom
    camera.position.set(4, 8, 17);
    document.body.appendChild(renderer.domElement);

    // orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // place 30 random torus objects (rotate them randomly)
    for (let i = 0; i < torusAmount; i++) {
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
        torus.setRotationFromMatrix(
            new THREE.Matrix4().makeRotationFromEuler(
                new THREE.Euler(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                )
            )
        );
        scene.add(torus);
        torus.name = "torus";

        // check if torus intersects with another torus
        let torusIntersects = false
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

}

function handleScore() {

    if (hasScored) return;

    if (!myObjects.modelPlane) return;

    if (myObjects.modelPlane.position.y < 0) {
        gameOver();
        return;
    }

    // check if plane intersects with a torus
    for (let i = 0; i < scene.children.length; i++) {
        const element = scene.children[i];
        if (element.name === "torus") {

            // check if the planes position is inside the torus
            const boundingBox = new THREE.Box3().setFromObject(element);
            const planePosition = myObjects.modelPlane.position;
            if (boundingBox.containsPoint(planePosition)) {

                // check the distance to the center of the torus
                const distanceToCenter = planePosition.distanceTo(element.position);
                if (distanceToCenter < torusRadius - 0.5 * torusTube && !hasScored) {

                    element.material.color.set(0x00ff00);
                    element.material.needsUpdate = true;
                    scene.background = new THREE.Color(0x003300);
                    torusScore += 1;
                    hasScored = true;
                    document.getElementById("score").innerHTML = "Score: " + torusScore;

                    // remove the torus after 1 second
                    setTimeout(() => {
                        scene.remove(element);
                        scene.background = new THREE.Color(0x330000);
                        hasScored = false;
                    }, 1000);
                    return;
                }
            }
        }
    }
}

async function animate() {
    requestAnimationFrame(animate);
    handleFlying();
    handleScore();
    handleTime();
    renderer.render(scene, camera);
    await new Promise(resolve => setTimeout(resolve, animationTimeoutMs));
}

function handleTime() {

    // calculate the time left
    const currentTime = new Date().getTime();
    timeLeft = 60 - Math.floor((currentTime - startTime) / 1000);
    document.getElementById("time").innerHTML = "Time left: " + timeLeft;

    if (timeLeft <= 0) {
        gameOver();
        return;
    }
}

function gameOver() {
    alert("Game over! Your score is: " + torusScore);
    window.location.reload();
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

