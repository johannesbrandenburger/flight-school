// @ts-check

const distancePerFly = 0.2;

function initFlying() {

    // add a crosshair in the middle of the screen
    const crossWidth = "20px";
    const crossThickness = "5px";
    const crossColor = "green";
    const crossVertical = document.createElement("div");
    crossVertical.style.position = "absolute";
    crossVertical.style.top = "50%";
    crossVertical.style.left = "50%";
    crossVertical.style.width = crossWidth;
    crossVertical.style.height = crossThickness;
    crossVertical.style.backgroundColor = crossColor
    crossVertical.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(crossVertical);
    const crossHorizontal = document.createElement("div");
    crossHorizontal.style.position = "absolute";
    crossHorizontal.style.top = "50%";
    crossHorizontal.style.left = "50%";
    crossHorizontal.style.width = crossThickness;
    crossHorizontal.style.height = crossWidth;
    crossHorizontal.style.backgroundColor = crossColor
    crossHorizontal.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(crossHorizontal);

    // as further the mouse is right/left of the cross the more the plane is moving right/left
    // headingTo = { right: int, up: int } stores values from 0 to 100 
    // headingTo = { right: -80, up: 5 } would move the plane a bit up and strongly to the left

    let headingTo = { right: 0, up: 0 };

    // change cursor to crosshair
    document.body.style.cursor = "crosshair";

    window.addEventListener("mousemove", event => {
        headingTo.right = (event.clientX - window.innerWidth / 2) / 2;
        headingTo.up = (window.innerHeight / 2 - event.clientY) / 2;
        document.body.style.cursor = "crosshair";
        if (headingTo.right > 100) { headingTo.right = 100; document.body.style.cursor = "e-resize"; }
        if (headingTo.right < -100) { headingTo.right = -100; document.body.style.cursor = "w-resize"; }
        if (headingTo.up > 100) { headingTo.up = 100; document.body.style.cursor = "n-resize"; }
        if (headingTo.up < -100) { headingTo.up = -100; document.body.style.cursor = "s-resize"; }
        console.log(headingTo);
    });
}


function handleFlying() {

    // TODO: collision detection later

    const newPosition = new THREE.Vector3(position.x, position.y, position.z);
}

function getNewFlyingPosition() {

}