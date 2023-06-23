import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';

// Initial setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(40);
const composer = new EffectComposer( renderer );

// Add icosahedron 

const geom = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshNormalMaterial({ color: 0xaa33ff, opacity: 0.8, transparent: true });
const form = new THREE.Mesh(geom, material);

// Add light and axes

scene.add(form);
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 10, 10);
const helper2 = new THREE.AxesHelper(20);
const helper = new THREE.PointLightHelper(pointLight);
const ambientLight = new THREE.AmbientLight(0xdbdbdb);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(helper2, helper, pointLight, ambientLight);

// stars

function addStar() {
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
	const plane = new THREE.Mesh(geometry, material);

	const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
	plane.position.set(x, y, z);
	scene.add(plane);
}

Array(2000).fill().forEach(addStar);

// cat

const loader = new GLTFLoader();
loader.load('OrigamiCat.gltf', function (gltf) {
	gltf.scene.position.y += 55;
	gltf.scene.rotation.y += 4.7;
	gltf.scene.scale.x += 5;
	gltf.scene.scale.y += 5;
	gltf.scene.scale.z += 5;
	scene.add(gltf.scene);
}, undefined, function (error) {
	console.error(error)
})

// Post processing

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(new THREE.Vector2( 256, 256 ), 0.4);
composer.addPass(bloomPass);

function animate(gltf) {
	requestAnimationFrame(animate);

	form.rotation.x += 0.01;
	form.rotation.y += 0.01;
	form.rotation.z += 0.01;
	controls.update();
	composer.render()
}

animate()