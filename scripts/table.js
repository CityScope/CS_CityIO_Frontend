var THREE = require('three');

function threeModel(jsonData) {

    ///////////////SETUP SCENE///////////////////////

    var CANVAS_WIDTH = 300;
    var CANVAS_HEIGHT = 300;
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
        cancelAnimationFrame(this.id); // Stop the animation


        //set up the camera
        aspect = window.innerWidth / window.innerHeight;
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
        light.shadow.mapSize.width = 1000; // default
        light.shadow.mapSize.height = 1000; // default
        light.shadow.camera.near = 1; // default
        light.shadow.camera.far = 500 // default

        lightAmb = new THREE.AmbientLight(0xc8d6d8, .5);
        // Add the light to the scene
        scene.add(lightAmb);


        /////////////// GEOMETRY ///////////////////////

        var i = 0;
        var voxelDim = 1;
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

        renderer.setSize(document.getElementById('3d').clientWidth, document.getElementById('3d').clientHeight);
    }

    window.addEventListener('DOMMouseScroll', mousewheel, false);
    window.addEventListener('mousewheel', mousewheel, false);

    function mousewheel(event) {
        event.preventDefault();
        event.stopPropagation();
        camera.zoom -= event.wheelDeltaY * 0.001;
        camera.updateProjectionMatrix();
    }
    document.getElementById('3d').appendChild(renderer.domElement);
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
    // circleGrid(json);
    // pieChart(json);
    treeMap(json);
}

/////////////////////////////////////////////////
///////////////d3 plus treemap //////////////////
/////////////////////////////////////////////////
function treeMap(json) {

    //drawing treemap 
    google.charts.load('current', {
        'packages': ['treemap']
    });

    google.charts.setOnLoadCallback(drawChart);


    function drawChart() {

        var data = new google.visualization.DataTable();
        // Declare columns
        data.addColumn('string', 'label');
        data.addColumn('number', 'value');

        // Data prep
        gridWithTypes = JSON.parse(JSON.stringify(json.grid));
        gridWithTypes.forEach(function (cell, index) {
            //building types in data 
            if (cell.type > -1 && cell.type < 6) {
                //make 'Value' term for Desity
                cell.value = json.objects.density[cell.type];
            } else {
                //if this cell is not a type, give it an arb. value
                cell.value = 1;
            }
            cell.type = cell.type + 2;
            //removes useless data 
            delete cell.x;
            delete cell.y;
            delete cell.rot;
            //make 'Value' term for Desity
            cell.label = typeId[cell.type];
            cell.color = globalColors[cell.type];
            delete cell.type;
            // Add data
            data.addRows([
                [cell.label, cell.value]
            ]);
        });

        console.log(data)

        // draw
        tree = new google.visualization.TreeMap(document.getElementById('2d'));
        tree.draw(data, {
            minColor: '#f00',
            midColor: '#ddd',
            maxColor: '#0d0',
            headerHeight: 15,
            fontColor: 'black',
            showScale: true
        });
    }
}


/////////////////////////////////////////////////
///////////////d3 Grid Visulazation /////////////
/////////////////////////////////////////////////
function circleGrid(json) {

    d3Grid = JSON.parse(JSON.stringify(json.grid));

    // this loop pushes value data from json.object field to each 
    // x,y gridcell so that d3 could use this data
    d3Grid.forEach(function (cell, index) {
        delete cell.rot; //removes useless data 
        if (cell.type > -1 && cell.type < 6) { //building types in data 
            cell.value = json.objects.density[cell.type]; //make 'Value' term for Desity, so d3plus will fill good 
        } else {
            cell.value = 1; //if this cell is not a type, give it an arb. value
        }
    });

    ///////////////////////////////////////////////////////

    var divHeight = document.getElementById("d3Div").offsetHeight;
    var divWidth = document.getElementById("d3Div").offsetWidth;

    //Draw CS grid 
    // load SVG container on load of page 
    svgContainer = d3.select("#d3Div").append("svg");
    var circles = svgContainer.selectAll("circle")
        .data(d3Grid)
        .enter()
        .append("circle");


    var circlesLocation = circles
        .attr("cx", function (d) {
            return 0.9 * divHeight / Math.sqrt(d3Grid.length) * (d.x);
        })
        .attr("cy", function (d) {
            return 0.9 * divWidth / Math.sqrt(d3Grid.length) * (d.y);
        });

    var circlesAttr = circles
        .style("fill", function (d) {
            var color = globalColors[d.type + 2];
            return color;

        }) // set the fill colour 
        .style("stroke", "none")
        .transition()
        .duration(1000)
        .attr("r", function (d) {
            if (d.value > 1) {
                return d.value / 5;
            } else
                return d.value;
        })
}

/////////////////////////////////////////////////
////////////////////////////pie chart //////////
/////////////////////////////////////////////////

function pieChart(json) {
    var resCount = 0,
        officeCount = 0

    pieGrid = JSON.parse(JSON.stringify(json.grid));
    pieGrid.forEach(function (cell, index) {
        delete cell.rot; //removes useless data 
        delete cell.x; //removes useless data 
        delete cell.y; //removes useless data 
        // delete cell.value; //removes useless data 
        cell.label = typeId[cell.type + 2]; //make 'Value' term for Desity, so d3plus will fill good 

        if (cell.type > 0 && cell.type < 3) {
            resCount = resCount + 1;
        } else if (cell.type > 3 && cell.type < 7) {
            officeCount = officeCount + 1;
        }
    });
}