// $(document).ready(function () {});

function threeModel() {
    var camera, scene, renderer, CANVAS_WIDTH = 200,
        CANVAS_HEIGHT = 200;
    var mesh;
    var holder = [];

    init();
    animate();

    function init() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 200;
        scene = new THREE.Scene();

        for (var index = 0; index < 10; index++) {
            var geometry = new THREE.BoxBufferGeometry((10 * index) + 10, (10 * index) + 10, 20);
            var material = new THREE.MeshStandardMaterial({
                color: 'white'
            })
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(index + 30, index + 30, index);
            mesh.castShadow = true; //default is false
            mesh.receiveShadow = true; //default
            holder.push(mesh);
            scene.add(mesh);
        }

        renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setClearColor(0xff0000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        document.body.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
    }


    //Create a PointLight and turn on shadows for the light
    var light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(100, 45, 45);
    light.castShadow = true; // default false
    scene.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500 // default


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        // mesh.rotation.x += 0.005;
        for (var index = 0; index < holder.length; index++) {
            spd = 0.1 * Math.random();
            holder[index].rotation.y += spd;
        }

        renderer.render(scene, camera);
    }
    document.getElementById('popup').appendChild(renderer.domElement);
}