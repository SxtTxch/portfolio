const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight*2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight/2);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('threejs-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

function createTextTexture(text, color, backgroundColor) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = '48px Arial';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
}

const geometry = new THREE.BoxGeometry();
const materials = [
    new THREE.MeshStandardMaterial({ map: createTextTexture('GitHub', '#ffffff', '#1e90ff') }), // Front face
    new THREE.MeshStandardMaterial({ map: createTextTexture('Github', '#ffffff', '#32cd32') }), // Back face
    new THREE.MeshStandardMaterial({ map: createTextTexture('Github', '#ffffff', '#ff4500') }), // Top face
    new THREE.MeshStandardMaterial({ map: createTextTexture('Discord', '#ffffff', '#8a2be2') }), // Bottom face
    new THREE.MeshStandardMaterial({ map: createTextTexture('Discord', '#ffffff', '#ffd700') }), // Right face
    new THREE.MeshStandardMaterial({ map: createTextTexture('Discord', '#ffffff', '#dc143c') })  // Left face
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

camera.position.z = 5;

const faceLinks = [
    "https://github.com/SxtTxch",// Front face
    "https://github.com/SxtTxch",       // Back face
    "https://github.com/SxtTxch",        // Top face
    "https://discord.com/users/995743379193331743",       // Bottom face
    "https://discord.com/users/995743379193331743",      // Right face
    "https://discord.com/users/995743379193331743"         // Left face
];

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
        isDragging = true;
    } else if (event.button === 0) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight*2) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(cube);

        if (intersects.length > 0) {
            const intersectedFace = intersects[0].face.materialIndex;
            const link = faceLinks[intersectedFace];
            window.open(link, "_blank");
        }
    }
});

window.addEventListener('mouseup', (event) => {
    if (event.button === 2) {
        isDragging = false;
    }
});

window.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        cube.rotation.y += deltaMove.x * 0.005;
        cube.rotation.x += deltaMove.y * 0.005;
    }

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

window.addEventListener('contextmenu', (event) => event.preventDefault());

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight/2;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
