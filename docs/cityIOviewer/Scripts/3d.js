function threeModel(jsonData) {
    // console.log(jsonData)

    ///////////////SETUP SCENE///////////////////////

    var CANVAS_WIDTH = document.getElementById('threeDiv').clientWidth,
        CANVAS_HEIGHT = document.getElementById('threeDiv').clientHeight;
    var frustumSize = 20;


    var camera, scene, renderer;
    var mesh;
    var holder = [];
    init();
    animate();

    function init() {
        //set up the camera 
        // camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);


        cancelAnimationFrame(this.id); // Stop the animation
        renderer = null;



        var aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 5000);
        camera.position.y = 400;
        scene = new THREE.Scene();
        // set up the renderer
        renderer = window.renderer = new THREE.WebGLRenderer({
            alpha: true
        });

        renderer.setClearColor('#ff0000', 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        document.body.appendChild(renderer.domElement);
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);


        var gridHelper = new THREE.GridHelper(100, 100, 'white', '#404040');
        scene.add(gridHelper);


        /////////////// LIGHTS ///////////////////////

        //Create a PointLight and turn on shadows for the light
        var light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 30, 45);
        light.up = new THREE.Vector3(0, 1, 1);
        light.lookAt(new THREE.Vector3(0, 0, 0));
        light.castShadow = true; // default false
        scene.add(light);

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500 // default

        var lightAmb = new THREE.AmbientLight(0xffffff, .5);
        // Add the light to the scene
        scene.add(lightAmb);


        /////////////// GEOMETRY ///////////////////////

        var i = 0;
        var voxelDim = 1;
        for (var x = 0; x < Math.sqrt(jsonData.grid.length); x++) {
            for (var y = 0; y < Math.sqrt(jsonData.grid.length); y++) {
                var geometry = new THREE.BoxBufferGeometry(voxelDim * 0.8, (jsonData.grid[i].type + 3) / 3, voxelDim * 0.8);
                if (jsonData.grid[i].type > -1 && jsonData.grid[i].type < 10) {
                    thisCol = globalColors[jsonData.grid[i].type];
                } else {
                    thisCol = 'gray'
                }
                var material = new THREE.MeshStandardMaterial({
                    color: thisCol
                });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x * voxelDim, (jsonData.grid[i].type + 3) / 2 / 2, y * voxelDim);
                mesh.castShadow = true; //default is false
                mesh.receiveShadow = true; //default
                holder.push(mesh);
                scene.add(mesh);
                i += 1;
            }
        }
    }

    /////////////// ANIMATION ///////////////////////

    // var direction = new THREE.Vector3(0.2, 0, 0); // amount to move per frame
    function animate() {
        requestAnimationFrame(animate);
        render();
    }



    function render() {
        var timer = Date.now() * 0.0001;
        camera.position.x = Math.sin(timer) * 800;
        camera.position.z = Math.cos(timer) * 800;
        camera.lookAt(new THREE.Vector3(7.5, 2.5, 5));
        renderer.render(scene, camera);
    }

    // //window resizing method 

    function onWindowResize() {
        var aspect = window.innerWidth / window.innerHeight;
        camera.left = -frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('DOMMouseScroll', mousewheel, false);
    window.addEventListener('mousewheel', mousewheel, false);

    function mousewheel(event) {
        event.preventDefault();
        event.stopPropagation();
        camera.zoom -= event.wheelDeltaY * 0.001;
        camera.updateProjectionMatrix();
    }

    document.getElementById('threeDiv').appendChild(renderer.domElement);
}