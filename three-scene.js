// three-scene.js

const canvas = document.getElementById('bg-canvas');

// Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0f172a, 0.002);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0f172a, 1);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const mainLight = new THREE.PointLight(0x6366f1, 2, 100);
mainLight.position.set(0, 0, 10);
scene.add(mainLight);

const secondaryLight = new THREE.PointLight(0xec4899, 1.5, 100);
secondaryLight.position.set(20, 20, -10);
scene.add(secondaryLight);

// Objects (Floating Geometry)
const objects = [];
const geometry = new THREE.IcosahedronGeometry(1, 0);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    metalness: 0.5,
    roughness: 0.1,
    transmission: 0.5,
    thickness: 1.5,
    wireframe: true
});

for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.x = (Math.random() - 0.5) * 80;
    mesh.position.y = (Math.random() - 0.5) * 80;
    mesh.position.z = (Math.random() - 0.5) * 50 - 10;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Custom properties for animation
    mesh.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        floatSpeed: (Math.random() - 0.5) * 0.05,
        floatOffset: Math.random() * Math.PI * 2
    };
    
    scene.add(mesh);
    objects.push(mesh);
}

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();

    // Smooth camera movement based on mouse
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Animate objects
    objects.forEach((obj, i) => {
        obj.rotation.x += obj.userData.rotationSpeed;
        obj.rotation.y += obj.userData.rotationSpeed;
        obj.position.y += Math.sin(time + obj.userData.floatOffset) * 0.02;
    });

    // Reset light color gradually back to primary
    mainLight.color.lerp(new THREE.Color(0x6366f1), 0.05);

    renderer.render(scene, camera);
}

animate();

// Expose API for game feedback
window.trigger3DFeedback = function(type) {
    if (type === 'error') {
        mainLight.color.setHex(0xef4444); // Flash red
    } else if (type === 'success') {
        mainLight.color.setHex(0x10b981); // Flash green
    } else if (type === 'warning') {
        mainLight.color.setHex(0xf59e0b); // Flash orange
    }
};
