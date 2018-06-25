import * as THREE from "THREE";

export function threeJSmodel(tableData) {
  console.log(tableData);

  // global holder for theme colors
  var globalColors = [
    "#A3BFA2",
    "#ED5066",
    "#F4827D",
    "#F4B99E",
    "#FDCAA2",
    "#F6ECD4",
    "#CCD9CE",
    "#A5BBB9",
    "#A3BFA2",
    "#80ADA9",
    "#668a87",
    "#405654",
    "#263C3A",
    "#263C3A",
    "#14181a",
    "#A3BFA2",
    "#ED5066",
    "#F4827D",
    "#F4B99E",
    "#FDCAA2",
    "#F6ECD4",
    "#CCD9CE",
    "#A5BBB9",
    "#A3BFA2",
    "#80ADA9",
    "#668a87",
    "#405654",
    "#263C3A",
    "#263C3A",
    "#14181a",
    "#A3BFA2",
    "#ED5066",
    "#F4827D",
    "#F4B99E",
    "#FDCAA2",
    "#F6ECD4",
    "#CCD9CE",
    "#A5BBB9",
    "#A3BFA2",
    "#80ADA9",
    "#668a87",
    "#405654",
    "#263C3A",
    "#263C3A",
    "#14181a"
  ];
  let threeDiv = document.getElementById("threeDiv");

  var frustumSize = 10;
  var camera = null;
  var scene = null;
  var renderer = null;
  var mesh = null;
  var meshArray = [];
  var light = null;
  var lightAmb = null;
  var aspect = null;
  var geometry = null;
  var material = null;

  ///////////////SETUP SCENE///////////////////////

  //set up the camera
  aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    5000
  );
  camera.position.y = 600;
  scene = new THREE.Scene();

  // set up the renderer
  renderer = window.renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("threeDiv").appendChild(renderer.domElement);

  /////////////// LIGHTS ///////////////////////

  //Create a PointLight and turn on shadows for the light
  light = new THREE.PointLight(0xf4eaea, 0.8, 100);
  light.position.set(10, 10, 10);
  light.up = new THREE.Vector3(0, 1, 1);
  light.lookAt(new THREE.Vector3(0, 0, 0));
  light.castShadow = true; // default false
  scene.add(light);

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 1; // default
  light.shadow.camera.far = 500; // default

  lightAmb = new THREE.AmbientLight(0xc8d6d8, 0.5);
  // Add the light to the scene
  scene.add(lightAmb);

  /////////////// GEOMETRY CREATE ///////////////////////
  var voxelDim = 1;
  //get center of model for camera
  var centerOfModel = tableData.header.spatial.ncols * voxelDim;
  var thisCol;
  let i = 0;
  for (var x = 0; x < tableData.header.spatial.ncols; x++) {
    for (var y = 0; y < tableData.header.spatial.ncols; y++) {
      let keyByVal = tableData.grid[i] + 1;

      //
      geometry = new THREE.BoxBufferGeometry(
        voxelDim * 0.8,
        keyByVal / 12,
        voxelDim * 0.8
      );
      // color
      thisCol = globalColors[tableData.grid[i] + 1];
      //
      material = new THREE.MeshStandardMaterial({
        color: thisCol
      });
      //
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x * voxelDim, keyByVal / 24, y * voxelDim);
      mesh.castShadow = true; //default is false
      mesh.receiveShadow = true; //default
      meshArray.push(mesh);
      scene.add(mesh);
      i++;
    }
  }

  //return the location [key] of this obj value
  // let keyByVal = getKeyByValue(tableData.objects.types, tableData.grid[i]);
  // function getKeyByValue(object, value) {
  //   return Object.keys(object).find(key => object[key] === value);
  // }

  //put to div
  threeDiv.appendChild(renderer.domElement);
  //call loop when done
  animate();

  //loop
  function animate() {
    //keep size updated
    renderer.setSize($(threeDiv).width(), $(threeDiv).width());
    //loop
    requestAnimationFrame(animate);
    render();
  }

  /////////////// ANIMATION ///////////////////////
  //render
  function render() {
    let timer = Date.now() * 0.00005;
    camera.position.x = Math.sin(timer) * 1000;
    camera.position.z = Math.cos(timer) * 1000;
    camera.lookAt(new THREE.Vector3(centerOfModel / 2, 0, centerOfModel / 2));

    renderer.render(scene, camera);
  }

  ///////////////UPDATE SCENE///////////////////////

  this.update = function() {
    console.log(meshArray);
  };
}
