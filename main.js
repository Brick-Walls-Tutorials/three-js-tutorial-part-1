//npm install three and ES6 import it to get started with Three.js
import * as THREE from 'three';

//scene defines relational space that all of our 3D elements will live in
const scene = new THREE.Scene();

//renderer defines the physical space on screen that will be rendering our 3D meshes and camera views
const renderer = new THREE.WebGLRenderer();

/*
    ADD LINE BELOW to make renderer take up the full screen
 */
renderer.setSize(window.innerWidth, window.innerHeight)

//REMEMBER to append renderer.domElement, not just renderer
const canvas = document.getElementById("canvas")
canvas.appendChild(renderer.domElement)

//camera defines the perspective from which a scene is view
//we use a perspective camera here to make obejct size depend on distance
//the camera constructor takes fov, aspect, near, and far properties
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

//OBJECTS SECTION
//meshes are made up of a geometry and a material
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshLambertMaterial({color: 0x0000ff})
const cube = new THREE.Mesh(geometry, material)

//add cube to scene
scene.add(cube)

// change camera position so that we can see the cube
camera.position.set(1,1,1)
// direct camera at the cube position
camera.lookAt(cube.position)

// create directional light
const directionalLight = new THREE.DirectionalLight(0xfffff)
scene.add(directionalLight)
// change light position
directionalLight.position.set(3,2,1)

// animation cycle will recursively call requestAnimationFrame and animate your scene
function animate(){
    renderer.render(scene, camera)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01;
    requestAnimationFrame(animate)
}

animate()