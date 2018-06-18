import * as THREE from 'THREE';

export class threeJSmodel {
    constructor(data) {
        this._data = data;
    }

    ///////////////SETUP SCENE///////////////////////

    init(tableData) {
        // global holder for theme colors 
        var globalColors = [
            '#A3BFA2',
            '#ED5066',
            '#F4827D',
            '#F4B99E',
            '#FDCAA2',
            '#F6ECD4',
            '#CCD9CE',
            '#A5BBB9',
            '#A3BFA2',
            '#80ADA9',
            '#668a87',
            '#405654',
            '#263C3A',
            '#263C3A',
            '#14181a'
        ];

        var CANVAS_WIDTH = '500';
        var CANVAS_HEIGHT = '500';

        var frustumSize = 10;
        var camera = null;
        var scene = null;
        var renderer = null;
        var mesh = null;
        var holder = [];
        var light = null;
        var lightAmb = null;
        var gridHelper = null;
        var aspect = null;
        var geometry = null;
        var material = null;

        //set up the camera
        aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / -2, 1, 5000);
        camera.position.y = 400;
        scene = new THREE.Scene();

        // set up the renderer
        renderer = window.renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('threeDiv')
            .appendChild(renderer.domElement);
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);


        /////////////// LIGHTS ///////////////////////

        //Create a PointLight and turn on shadows for the light
        light = new THREE.PointLight(0xf4eaea, .8, 500);
        light.position.set(0, 30, 45);
        light.up = new THREE.Vector3(0, 1, 1);
        light.lookAt(new THREE.Vector3(0, 0, 0));
        light.castShadow = true; // default false
        scene.add(light);

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 256; // default
        light.shadow.mapSize.height = 256; // default
        light.shadow.camera.near = 1; // default
        light.shadow.camera.far = 500 // default

        lightAmb = new THREE.AmbientLight(0xc8d6d8, .5);
        // Add the light to the scene
        scene.add(lightAmb);

        /////////////// GEOMETRY CREATE ///////////////////////
        var voxelDim = 1;
        var thisCol;
        let i = 0;
        for (var x = 0; x < Math.sqrt(tableData.grid.length); x++) {
            for (var y = 0; y < Math.sqrt(tableData.grid.length); y++) {

                //return the location [key] of this obj value 
                let keyByVal = getKeyByValue(tableData.objects.types, tableData.grid[i]);

                //
                geometry = new THREE.BoxBufferGeometry(voxelDim * 0.8, keyByVal / 6, voxelDim * 0.8);
                // random colors for now
                thisCol = globalColors[Math.floor(Math.random() * globalColors.length)];

                //
                material = new THREE.MeshStandardMaterial({
                    color: thisCol
                });
                //
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x * voxelDim, keyByVal / 12, y * voxelDim);
                mesh.castShadow = true; //default is false
                mesh.receiveShadow = true; //default
                holder.push(mesh);
                scene.add(mesh);
                i++;
            }
        }

        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        }

        //put to div
        document.getElementById('threeDiv').appendChild(renderer.domElement);
        //call loop when done
        animate();
        //loop
        function animate() {
            requestAnimationFrame(animate);
            render();
        }
        //render 
        function render() {
            let timer = Date.now() * 0.00025;
            camera.position.x = Math.sin(timer) * 1000;
            camera.position.z = Math.cos(timer) * 1000;
            camera.lookAt(new THREE.Vector3(7.5, 2.5, 5));
            renderer.render(scene, camera);
        }
    }

    /////////////// ANIMATION ///////////////////////

}








