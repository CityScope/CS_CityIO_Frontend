// $(document).ready(threeModel());

function threeModel(jsonData) {
    console.log(jsonData)
    var camera, scene, renderer
    var CANVAS_WIDTH = 800,
        CANVAS_HEIGHT = 500;

    var mesh;
    var holder = [];

    init();

    function init() {
        //set up the camera 
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        scene = new THREE.Scene();
        camera.position.set(0, 0, 40);
        camera.up = new THREE.Vector3(1, 1, 1);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        // set up the renderer
        renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setClearColor('#ff0000', 1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        document.body.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


    //Create a PointLight and turn on shadows for the light
    var light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 30, 30);
    light.up = new THREE.Vector3(0, 0, 1);
    light.lookAt(new THREE.Vector3(0, 0, 0));
    light.castShadow = true; // default false
    scene.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500 // default

    var lightAmb = new THREE.AmbientLight(0xffffff, .1);
    // Add the light to the scene
    scene.add(lightAmb);


    var i = 0;
    for (var x = 0; x < Math.sqrt(jsonData.grid.length); x++) {
        for (var y = 0; y < Math.sqrt(jsonData.grid.length); y++) {
            var geometry = new THREE.BoxBufferGeometry(0.8, 0.8, 0.8);
            var material = new THREE.MeshStandardMaterial({
                color: 'white'
            })
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, jsonData.grid[i].type);
            mesh.castShadow = true; //default is false
            mesh.receiveShadow = true; //default
            holder.push(mesh);
            scene.add(mesh);
            i += 1;
        }
    }


    var direction = new THREE.Vector3(0.1, 0.1, 0); // amount to move per frame
    function animate() {
        camera.position.add(direction); // add to position
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer.render(scene, camera); // render new frame
        requestAnimationFrame(animate); // keep looping
    }
    requestAnimationFrame(animate);


    document.getElementById('threeDiv').appendChild(renderer.domElement);

    // renderer.setSize($(threeDiv).width(), $(threeDiv).height());
    // document.getElementById('body').appendChild(renderer.domElement);

}