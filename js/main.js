import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

var scene = new THREE.Scene();
var scene2 = new THREE.Scene();
var camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let cardObject;
let knifeObject;

let controlsCard;
let controlsKnife;
let controlsActive = false;
let objToRender = 'card';
const loader = new GLTFLoader();

// Load the card 3D model
loader.load(
	`model/${objToRender}/scene.gltf`,
	function (gltf) {
		cardObject = gltf.scene;
		cardObject.updateMatrix(); // Update the object's matrix

		scene.add(cardObject);
	},
	function (xhr) {
		// While it is loading, log the progress
		console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
	},
	function (error) {
		// If there is an error, log it
		console.error(error);
	}
);

const renderer1 = new THREE.WebGLRenderer({ alpha: true, exposure: 1.0 }); // Alpha: true allows for the transparent background
renderer1.setSize(window.innerWidth, window.innerHeight);

document.getElementById('container3D').appendChild(renderer1.domElement);

camera1.position.z = objToRender === 'card' ? 60 : 500;

if (objToRender === 'card') {
	controlsCard = new OrbitControls(camera1, renderer1.domElement);
	controlsCard.enableZoom = false;
	controlsCard.enablePan = false;

	// Detect when controls are being used
	controlsCard.addEventListener('start', function () {
		controlsActive = true;
	});

	// Detect when controls stop being used
	controlsCard.addEventListener('end', function () {
		controlsActive = false;
	});

	controlsCard.addEventListener('change', function () {
		// Update is required after changes
		renderer1.render(scene, camera1);
	});
}

renderer1.outputEncoding = THREE.sRGBEncoding;
renderer1.toneMapping = THREE.ReinhardToneMapping;
const fixedWidth = 800;
const fixedHeight = 600;

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === 'card' ? 5 : 1);
scene.add(ambientLight);

// Set the initial size of the renderer
renderer1.setSize(fixedWidth, fixedHeight);

// Update the camera's aspect ratio based on the fixed size
camera1.aspect = fixedWidth / fixedHeight;
camera1.updateProjectionMatrix();

let exposure = 1.0; // Initial exposure value

function animateCard() {
	requestAnimationFrame(animateCard);
	if (!controlsActive) {
		// Rotate the object (adjust the rotation speed as needed)
		if (cardObject) {
			cardObject.rotation.y += 0.004; // You can adjust the rotation speed here
		}
	}
	renderer1.toneMappingExposure = exposure;
	// Ensure that controls are updated
	if (controlsCard) {
		controlsCard.update();
	}
	// Ensure that controls are updated
	renderer1.render(scene, camera1);
}
// Start the animation loop for the card
animateCard();
