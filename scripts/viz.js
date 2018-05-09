
import * as THREE from 'THREE';
// global holder for theme colors 
var globalColors = [
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

export function getCityIO() {

    fetch('https://cityio.media.mit.edu/api/table/citymatrix_volpe',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            console.log(response);
            try {
                JSON.parse(response)
            }
            catch (err) {
                console.log("parsing err ", err)
            }
        })
        .catch((err) => {
            console.log("err ", err)
        });


}


function threeModel(jsonData) {

    ///////////////SETUP SCENE///////////////////////

    var CANVAS_WIDTH = '100';
    var CANVAS_HEIGHT = '100';
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
    var timer = null;
    var geometry = null;
    var material = null;

    init();
    animate();

    function init() {

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

        gridHelper = new THREE.GridHelper(100, 100, 'white', '#404040');
        scene.add(gridHelper);

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

        /////////////// GEOMETRY ///////////////////////

        var i = 0;
        var voxelDim = 1;
        var thisCol;
        for (var x = 0; x < Math.sqrt(jsonData.grid.length); x++) {
            for (var y = 0; y < Math.sqrt(jsonData.grid.length); y++) {
                geometry = new THREE.BoxBufferGeometry(voxelDim * 0.8, (jsonData.grid[i].type + 6) / 3, voxelDim * 0.8);
                if (jsonData.grid[i].type > -1 && jsonData.grid[i].type < 10) {
                    thisCol = globalColors[jsonData.grid[i].type];
                } else {
                    thisCol = 'gray'
                }
                material = new THREE.MeshStandardMaterial({
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
        timer = Date.now() * 0.0001;
        camera.position.x = Math.sin(timer) * 800;
        camera.position.z = Math.cos(timer) * 800;
        camera.lookAt(new THREE.Vector3(7.5, 2.5, 5));
        renderer.render(scene, camera);
    }
    // //window resizing method
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        aspect = window.innerWidth / window.innerHeight;
        camera.left = -frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(document.getElementById('threeDiv').clientWidth, document.getElementById('threeDiv').clientHeight);
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


///////////////////////////////////////////////////////////////////////////
////////////////////////////2d GRAPHIC/////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
var svgContainer;
var typeId = [
    'PARKING',
    'PARK',
    'Residential Large',
    'Residential Medium',
    'Residential Small',
    'Office Large',
    'Office Medium',
    'Office Small',
    'ROAD',
    'AMENITIES',
    'MISC'
]

// draw to SVG container 
function drawJSON(json) {

}

