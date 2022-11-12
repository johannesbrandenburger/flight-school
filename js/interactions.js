// @ts-check

/** @type { { x: number, z: number, text: string }[] }*/
let infoTable = [];
let infoDiv;
let infoStartTime = null;

/**
 * Calls the init functions to initialize the interactions
 */
function initInteractions() {

    initTriggerFlightSimulator();
    initPutChairOnTable();
    initOpenCloset();
    initSwitchLight();
    initInfoDiv();
    initAdjustBlackboardHeight()

}


/**
 * Initializes the info div
 */
function initInfoDiv() {

    // create the div (at the top left corner)
    infoDiv = document.createElement("div");
    infoDiv.style.position = "absolute";
    infoDiv.style.top = "10px";
    infoDiv.style.left = "10px";
    infoDiv.style.color = "white";
    infoDiv.style.background = "rgba(0, 0, 0, 0.5)";
    infoDiv.style.padding = "10px";
    infoDiv.innerHTML = "";
    infoDiv.style.visibility = "hidden";
    document.body.appendChild(infoDiv);

    // get all positions of the chair and add them to the info table
    myObjects.chairs.forEach(chair => {
        infoTable.push({
            x: chair.position.x,
            z: chair.position.z,
            text: "Click on the chair to put it on the table or on the floor"
        });
    });

    // get all positions of the closets and add them to the info table
    myObjects.closets.forEach(closet => {
        infoTable.push({
            x: closet.position.x,
            z: closet.position.z + 0.5,
            text: "Click on the closet to open it"
        });
    });

    // get all light switches
    infoTable.push({
        x: myObjects.lightSwitchOne.position.x,
        z: myObjects.lightSwitchOne.position.z,
        text: "Click on the light switch to turn on/off the lights"
    });

    infoTable.push({
        x: myObjects.monitor.position.x,
        z: myObjects.monitor.position.z - 0.5,
        text: "Click on the monitor to start the flight simulator"
    });

    // blackboard
    infoTable.push({
        x: myObjects.blackboard.position.x + 2,
        z: myObjects.blackboard.position.z + 1,
        text: "Move the boards with the mousea up and down to adjust the height"
    });
}



/**
 * Adds the on click event listener to monitor to start the flight simulator
 */
function initTriggerFlightSimulator() {
    if (myObjects.monitor === undefined) return;
    domEvents.addEventListener(myObjects.monitor, "click", () => {
        console.log("clicked on monitor");
        location.href = "/flight-simulator";
    });
}

function initAdjustBlackboardHeight() {
    if (myObjects.blackboard === undefined) return;

    const boardYmin = 0.7;
    const boardYmax = 1.83;

    // get the individual boards and their chalk trays
    let board1 = myObjects.blackboard.children.find(child => child.name === "Board1")
    let chalkTray1 = myObjects.blackboard.children.find(child => child.name === "Kreideablage1")
    let board2 = myObjects.blackboard.children.find(child => child.name === "Board2")
    let chalkTray2 = myObjects.blackboard.children.find(child => child.name === "Kreideablage2")
    if (board1 === undefined || chalkTray1 === undefined || board2 === undefined || chalkTray2 === undefined) return;
    const distanceBetweenBoardAndChalkTray = chalkTray1.position.y - board1.position.y;

    domEvents.addEventListener(board1, "mousedown", () => {
        isMouseDown = isMouseOnBlackboardBoard2 = false;
        isMouseOnBlackboardBoard1 = true;
    });

    domEvents.addEventListener(board2, "mousedown", () => {
        isMouseDown = isMouseOnBlackboardBoard1 = false;
        isMouseOnBlackboardBoard2 = true;
    });

    window.addEventListener("mousemove", event => {
        if (!isMouseOnBlackboardBoard1) return;
        let y = board1.position.y - event.movementY * deltaTime * 0.3;
        if (y < boardYmin) y = boardYmin;
        if (y > boardYmax) y = boardYmax;
        board1.position.y = y;
        chalkTray1.position.y = y + distanceBetweenBoardAndChalkTray;
    });

    window.addEventListener("mousemove", event => {
        if (!isMouseOnBlackboardBoard2) return;
        let y = board2.position.y - event.movementY * deltaTime * 0.3;
        if (y < boardYmin) y = boardYmin;
        if (y > boardYmax) y = boardYmax;
        board2.position.y = y;
        chalkTray2.position.y = y + distanceBetweenBoardAndChalkTray;
    });

}


/**
 * Initializes the light switchers
 */
function initSwitchLight() {
    if (myObjects.lightSwitchOne === undefined || myObjects.lightSwitchTwo === undefined || myObjects.lightSwitchThree === undefined) return

    // add the event listeners
    domEvents.addEventListener(myObjects.lightSwitchOne, "click", () => {
        console.log("clicked on light switch one");
        myObjects.bulbLights.forEach(light => {
            if (light.name === "1") {
                light.visible = !light.visible;
                if (light.visible) { 
                    myObjects.lightSwitchOne.children.find(child => child.name === "Lightswitch").rotation.x += degToRad(3.5);
                } else {
                    myObjects.lightSwitchOne.children.find(child => child.name === "Lightswitch").rotation.x -= degToRad(3.5);
                }
            }
        });
    });

    domEvents.addEventListener(myObjects.lightSwitchTwo, "click", () => {
        console.log("clicked on light switch two");
        myObjects.bulbLights.forEach(light => {
            if (light.name === "2") {
                light.visible = !light.visible;
                if (light.visible) { 
                    myObjects.lightSwitchTwo.children.find(child => child.name === "Lightswitch").rotation.x += degToRad(3.5);
                } else {
                    myObjects.lightSwitchTwo.children.find(child => child.name === "Lightswitch").rotation.x -= degToRad(3.5);
                }
            }
        });
    });

    domEvents.addEventListener(myObjects.lightSwitchThree, "click", () => {
        console.log("clicked on light switch three");
        myObjects.bulbLights.forEach(light => {
            if (light.name === "3") {
                light.visible = !light.visible;
                if (light.visible) { 
                    myObjects.lightSwitchThree.children.find(child => child.name === "Lightswitch").rotation.x += degToRad(3.5);
                } else {
                    myObjects.lightSwitchThree.children.find(child => child.name === "Lightswitch").rotation.x -= degToRad(3.5);
                }
            }
        });
    });
}


/**
 * Adds the on click event listener to the chairs and determines the direction of the chair for the animation
 */
function initPutChairOnTable() {
    if (myObjects.chairs === undefined) return
    myObjects.chairs.forEach(chair => {

        chair.isOnTable = false;

        // moveDirection: 1 for positive x 2 for negative x 3 for positive z 4 for negative z
        switch (chair.rotation.y) {
            case 0:
                chair.moveDirection = 1;
                break;
            case Math.PI / 2:
                chair.moveDirection = 2;
                break;
            case Math.PI:
                chair.moveDirection = 3;
                break;
            case -Math.PI / 2:
                chair.moveDirection = 4;
            default:
                break;
        }

        // add the event listener
        domEvents.addEventListener(chair, "click", () => {
            console.log("clicked on chair:", chair);
            if (chairAnimation.activeChair !== null) return;
            chairAnimation.activeChair = chair;
            chairAnimation.initialPosition = chair.position.clone();
            chairAnimation.up = !chair.isOnTable;
        });
    });
}


/**
 * Adds the on click event listener to the closets
 */
function initOpenCloset() {
    if (myObjects.closets === undefined) return
    myObjects.closets.forEach(closet => {
        closet.isOpen = false;
        domEvents.addEventListener(closet, "click", () => {
            console.log("clicked on closet:", closet);
            if (closetAnimation.activeCloset !== null) return;

            // check if one closet is already open
            let closetIsOpen = false;
            myObjects.closets.forEach(closet => {
                if (closet.isOpen) {
                    closetIsOpen = true;
                }
            });
            if (closetIsOpen && !closet.isOpen) return;

            closetAnimation.activeCloset = closet;
            closetAnimation.open = !closet.isOpen;
        });
    });
}


/**
 * Is called every frame and handles animation of chairs
 * There are 3 steps in the animation:
 * 1. Move the chair backwards
 * 2. Move the chair up
 * 3. Move the chair forwards
 */
function handleAnimateChairs() {
    if (chairAnimation.activeChair === null) return;

    chairAnimation.timeSinceAnimationStart = chairAnimation.timeSinceAnimationStart + deltaTime;
    let chair = chairAnimation.activeChair;
    let initPos = chairAnimation.initialPosition;
    let animationComplete = false;
    const distanceBack = 0.3;
    const distanceUp = 0.4;
    const animationDuration = 1;  // 3 in total
    const distanceFraction = chairAnimation.timeSinceAnimationStart / animationDuration;

    // 4 different directions * 3 steps = 12 cases (deep nesting)
    switch (chair.moveDirection) {
        case 1:
            if (chairAnimation.up) {

                if (chair.position.z < initPos.z + distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.z = initPos.z + distanceBack * distanceFraction;
                } else if (chair.position.z >= initPos.z + distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.z = initPos.z + distanceBack;
                    chairAnimation.moveStep = 2;
                } else if (chair.position.y < initPos.y + distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y + distanceUp * (distanceFraction - 1);
                } else if (chair.position.y >= initPos.y + distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y + distanceUp;
                    chairAnimation.moveStep = 3;
                } else if (chair.position.z > initPos.z && chairAnimation.moveStep == 3) {
                    chair.position.z = initPos.z + distanceBack - (distanceBack * (distanceFraction - 2));
                } else if (chair.position.z <= initPos.z && chairAnimation.moveStep == 3) {
                    chair.position.z = initPos.z;
                    animationComplete = true;
                }

            } else {

                if (chair.position.z < initPos.z + distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.z = initPos.z + distanceBack * distanceFraction;
                } else if (chair.position.z >= initPos.z + distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.z = initPos.z + distanceBack;
                    chairAnimation.moveStep = 2;
                } else if (chair.position.y > initPos.y - distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y - distanceUp * (distanceFraction - 1);
                } else if (chair.position.y <= initPos.y - distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y - distanceUp;
                    chairAnimation.moveStep = 3;
                } else if (chair.position.z > initPos.z && chairAnimation.moveStep == 3) {
                    chair.position.z = initPos.z + distanceBack - (distanceBack * (distanceFraction - 2));
                } else if (chair.position.z <= initPos.z && chairAnimation.moveStep == 3) {
                    chair.position.z = initPos.z;
                    animationComplete = true;
                }

            }

            break;

        case 2:

            if (chairAnimation.up) {

                if (chair.position.x < initPos.x + distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.x = initPos.x + distanceBack * distanceFraction;
                } else if (chair.position.x >= initPos.x + distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.x = initPos.x + distanceBack;
                    chairAnimation.moveStep = 2;
                } else if (chair.position.y < initPos.y + distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y + distanceUp * (distanceFraction - 1);
                } else if (chair.position.y >= initPos.y + distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y + distanceUp;
                    chairAnimation.moveStep = 3;
                } else if (chair.position.x > initPos.x && chairAnimation.moveStep == 3) {
                    chair.position.x = initPos.x + distanceBack - (distanceBack * (distanceFraction - 2));
                } else if (chair.position.x <= initPos.x && chairAnimation.moveStep == 3) {
                    chair.position.x = initPos.x;
                    animationComplete = true;
                }

            } else {

                if (chair.position.x < initPos.x + distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.x = initPos.x + distanceBack * distanceFraction;
                } else if (chair.position.x >= initPos.x + distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.x = initPos.x + distanceBack;
                    chairAnimation.moveStep = 2;
                } else if (chair.position.y > initPos.y - distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y - distanceUp * (distanceFraction - 1);
                } else if (chair.position.y <= initPos.y - distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y - distanceUp;
                    chairAnimation.moveStep = 3;
                } else if (chair.position.x > initPos.x && chairAnimation.moveStep == 3) {
                    chair.position.x = initPos.x + distanceBack - (distanceBack * (distanceFraction - 2));
                } else if (chair.position.x <= initPos.x && chairAnimation.moveStep == 3) {
                    chair.position.x = initPos.x;
                    animationComplete = true;
                }

            }

            break;

        case 3:

            if (chairAnimation.up) {

                if (chair.position.z > initPos.z - distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.z = initPos.z - distanceBack * distanceFraction;
                } else if (chair.position.z <= initPos.z - distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.z = initPos.z - distanceBack;
                    chairAnimation.moveStep = 2;
                } else if (chair.position.y < initPos.y + distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y + distanceUp * (distanceFraction - 1);
                } else if (chair.position.y >= initPos.y + distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y + distanceUp;
                    chairAnimation.moveStep = 3;
                } else if (chair.position.z < initPos.z && chairAnimation.moveStep == 3) {
                    chair.position.z = initPos.z - distanceBack + (distanceBack * (distanceFraction - 2));
                } else if (chair.position.z >= initPos.z && chairAnimation.moveStep == 3) {
                    chair.position.z = initPos.z;
                    animationComplete = true;
                }

            } else {

                if (chair.position.z > initPos.z - distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.z = initPos.z - distanceBack * distanceFraction;
                } else if (chair.position.z <= initPos.z - distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.z = initPos.z - distanceBack;
                    chairAnimation.moveStep = 2;
                } else if (chair.position.y > initPos.y - distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y - distanceUp * (distanceFraction - 1);
                } else if (chair.position.y <= initPos.y - distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y - distanceUp;
                    chairAnimation.moveStep = 3;
                } else if (chair.position.z < initPos.z && chairAnimation.moveStep == 3) {
                    chair.position.z = initPos.z - distanceBack + (distanceBack * (distanceFraction - 2));
                } else if (chair.position.z >= initPos.z && chairAnimation.moveStep == 3) {
                    chair.position.z = initPos.z;
                    animationComplete = true;
                }

            }

            break;

        case 4:

            if (chairAnimation.up) {

                if (chair.position.x > initPos.x - distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.x = initPos.x - distanceBack * distanceFraction;
                } else if (chair.position.x <= initPos.x - distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.x = initPos.x - distanceBack;
                    chairAnimation.moveStep = 2;
                } else if (chair.position.y < initPos.y + distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y + distanceUp * (distanceFraction - 1);
                } else if (chair.position.y >= initPos.y + distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y + distanceUp;
                    chairAnimation.moveStep = 3;
                } else if (chair.position.x < initPos.x && chairAnimation.moveStep == 3) {
                    chair.position.x = initPos.x - distanceBack + (distanceBack * (distanceFraction - 2));
                } else if (chair.position.x >= initPos.x && chairAnimation.moveStep == 3) {
                    chair.position.x = initPos.x;
                    animationComplete = true;
                }

            } else {

                if (chair.position.x > initPos.x - distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.x = initPos.x - distanceBack * distanceFraction;
                } else if (chair.position.x <= initPos.x - distanceBack && chairAnimation.moveStep == 1) {
                    chair.position.x = initPos.x - distanceBack;
                    chairAnimation.moveStep = 2;
                } else if (chair.position.y > initPos.y - distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y - distanceUp * (distanceFraction - 1);
                } else if (chair.position.y <= initPos.y - distanceUp && chairAnimation.moveStep == 2) {
                    chair.position.y = initPos.y - distanceUp;
                    chairAnimation.moveStep = 3;
                } else if (chair.position.x < initPos.x && chairAnimation.moveStep == 3) {
                    chair.position.x = initPos.x - distanceBack + (distanceBack * (distanceFraction - 2));
                } else if (chair.position.x >= initPos.x && chairAnimation.moveStep == 3) {
                    chair.position.x = initPos.x;
                    animationComplete = true;
                }
            }

            break;

        default:

            break;
    }

    if (animationComplete) {
        chair.isOnTable = chairAnimation.up;
        chairAnimation = {
            activeChair: null,
            initialPosition: null,
            moveStep: 1,
            up: true,
            timeSinceAnimationStart: 0
        };
    }

}


/**
 * Is called every frame and handles the animation of the closets
 */
function handleAnimateClosets() {
    if (closetAnimation.activeCloset === null) return;

    // Closet_Door_1 und Closet_Door_2 
    closetAnimation.timeSinceAnimationStart = closetAnimation.timeSinceAnimationStart + deltaTime;
    /** @type {THREE.Object3D} */
    let door1 = closetAnimation.activeCloset.children.find(child => child.name === "Closet_Door_1");
    /** @type {THREE.Object3D} */
    let door2 = closetAnimation.activeCloset.children.find(child => child.name === "Closet_Door_2");

    let animationComplete = false;
    const animationDuration = 1;
    const distanceFraction = closetAnimation.timeSinceAnimationStart / animationDuration;

    let door1RotationAroundY = - Math.PI * 0.8
    let door2RotationAroundY = Math.PI * 0.8

    // door2 of the second closet can only be opened a little bit because of the wall
    if (closetAnimation.activeCloset === myObjects.closets[1]) door2RotationAroundY = Math.PI * 0.45;

    if (closetAnimation.open) {

        if (door1.rotation.y > door1RotationAroundY) {
            door1.rotation.y = door1RotationAroundY * distanceFraction;
        } else if (door1.rotation.y <= door1RotationAroundY) {
            door1.rotation.y = door1RotationAroundY;
            animationComplete = true;
        }

        if (door2.rotation.y < door2RotationAroundY) {
            door2.rotation.y = door2RotationAroundY * distanceFraction;
        } else if (door2.rotation.y >= door2RotationAroundY) {
            door2.rotation.y = door2RotationAroundY;
            animationComplete = true;

        }

    } else {

        if (door1.rotation.y < 0) {
            door1.rotation.y = door1RotationAroundY - (door1RotationAroundY * distanceFraction);
        } else if (door1.rotation.y >= 0) {
            door1.rotation.y = 0;
            animationComplete = true;
        }

        if (door2.rotation.y > 0) {
            door2.rotation.y = door2RotationAroundY - (door2RotationAroundY * distanceFraction);
        } else if (door2.rotation.y <= 0) {
            door2.rotation.y = 0;
            animationComplete = true;
        }

    }


    if (animationComplete) {
        closetAnimation.activeCloset.isOpen = !closetAnimation.activeCloset.isOpen;
        closetAnimation = {
            activeCloset: null,
            timeSinceAnimationStart: 0,
            open: true
        };
    }
}


/**
 * Is called every frame and handles the information div about the interactions
 */
function handleInfoDiv() {

    const triggerDistance = 1.2;
    let isNearSomething = false;

    infoTable.forEach(function (entry) {

        if (isNearSomething) return;

        // get distance between camera and object (x and z)
        const distance = Math.sqrt(Math.pow(camera.position.x - entry.x, 2) + Math.pow(camera.position.z - entry.z, 2));

        // if distance is smaller than 10 show the info div
        if (distance < triggerDistance) {
            infoDiv.innerHTML = entry.text;
            infoDiv.style.visibility = "visible";
            isNearSomething = true;
        }

    });

    // if nothing is near the camera hide the info div
    if (!isNearSomething) {
        infoDiv.innerHTML = "";
        infoDiv.style.visibility = "hidden";
    }

}