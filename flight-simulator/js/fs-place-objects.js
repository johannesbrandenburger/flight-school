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
 * Places other objects which the plane can collide with
 * Object types:
 *  - DodecahedronGeometry
 *  - IcosahedronGeometry
 *  - OctahedronGeometry
 *  - TetrahedronGeometry
 */
function placeObstaclesObjects() {
    for (let i = 0; i < obstacleAmount; i++) {

        // switch case to choose a random object type
        const randomObjectType = Math.floor(Math.random() * 4);
        let geometry;
        switch (randomObjectType) {
            case 0:
                geometry = new THREE.DodecahedronGeometry(obstacleRadius, 0);
                break;
            case 1:
                geometry = new THREE.IcosahedronGeometry(obstacleRadius, 0);
                break;
            case 2:
                geometry = new THREE.OctahedronGeometry(obstacleRadius, 0);
                break;
            case 3:
                geometry = new THREE.TetrahedronGeometry(obstacleRadius, 0);
                break;
        }

        // create the object with random grayscale color, position and rotation
        const colorVal = Math.floor(Math.random() * 255);
        const color = "rgb(" + colorVal + "," + colorVal + "," + colorVal + ")";
        const material = new THREE.MeshPhongMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * torusSpawnRadius,
            (Math.random()) * torusSpawnRadius,
            (Math.random() - 0.5) * torusSpawnRadius
        );
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        mesh.name = "obstacle";
        scene.add(mesh);
    }

}
