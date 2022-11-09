// @ts-check

/**
 * Calls the init functions to initialize the interactions
 */
function initInteractions() {

    initTriggerFlightSimulator();
    initPutChairOnTable();
    initOpenCloset();

}


/**
 * Adds the on click event listener to monitor to start the flight simulator
 */
function initTriggerFlightSimulator() {
    if (myObjects.monitor === undefined) return
    domEvents.addEventListener(myObjects.monitor, "click", () => {
        location.href = "/flight-simulator";
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
            chairAnimation.startTime = clock.getElapsedTime();
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
            closetAnimation.activeCloset = closet;
            closetAnimation.startTime = clock.getElapsedTime();
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
 * 
 */
function handleAnimateChairs() {
    if (chairAnimation.activeChair === null) return;

    let chair = chairAnimation.activeChair;
    let initPos = chairAnimation.initialPosition;
    let animationComplete = false;
    const distanceBack = 0.3;
    const distanceUp = 0.4;
    const timeSinceAnimationStart = clock.getElapsedTime() - chairAnimation.startTime;
    const animationDuration = 1;  // 3 in total
    const distanceFraction = timeSinceAnimationStart / animationDuration;

    switch (chair.moveDirection) {
        case 1:
            console.log("moveDirection: 1 move back means in positive z direction");
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

            console.log("moveDirection: 2 move back means in positiv x direction");

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

            console.log("moveDirection: 3 move back means in negativ z direction");

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

            console.log("moveDirection: 4 move back means in negativ x direction");

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

            console.log("moveDirection: ," + chair.moveDirection + " is not valid");
            break;
    }

    if (animationComplete) {
        chair.isOnTable = chairAnimation.up;
        chairAnimation = {
            activeChair: null,
            initialPosition: null,
            moveStep: 1,
            startTime: null,
            up: true,
        };
    }

}


/**
 * Is called every frame and handles the animation of the closets
 */
function handleAnimateClosets() {
    if (closetAnimation.activeCloset === null) return;



}