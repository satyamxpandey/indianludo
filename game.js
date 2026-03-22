// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 10, 7.5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// --- Game Objects ---
// Grass
const ground = new THREE.Mesh(
    new THREE.CircleGeometry(100, 64),
    new THREE.MeshPhongMaterial({ color: 0x2e8b57 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Pitch
const pitch = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.1, 30),
    new THREE.MeshPhongMaterial({ color: 0xdbb07d })
);
pitch.position.y = 0.01;
scene.add(pitch);

// Batsman (Blue)
const batsman = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
batsman.position.set(0, 1.5, 12);
scene.add(batsman);

// Bat (Pivot for rotation)
const batGroup = new THREE.Group();
batGroup.position.set(0.8, 1.5, 12);
scene.add(batGroup);
const bat = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.5, 0.6), new THREE.MeshPhongMaterial({ color: 0x8b4513 }));
bat.position.y = 0.5; // Offset so it swings from top
batGroup.add(bat);

// Wickets
const wicketGeo = new THREE.BoxGeometry(0.1, 2.5, 0.1);
const wicketMat = new THREE.MeshPhongMaterial({color: 0xffffff});
for(let i = -0.4; i <= 0.4; i += 0.4) {
    let w = new THREE.Mesh(wicketGeo, wicketMat);
    w.position.set(i, 1.25, 13);
    scene.add(w);
}

// Ball
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshPhongMaterial({ color: 0xcc0000 }));
scene.add(ball);

// --- Game Variables ---
let ballSpeedZ = 0;
let ballSpeedX = 0;
let ballSpeedY = 0;
let isBallInPlay = false;
let score = 0;
let overBall = 0;
let canHit = true;

camera.position.set(0, 6, 20);
camera.lookAt(0, 0, 0);

// --- Functions ---
function deliverBall() {
    if (isBallInPlay) return;
    
    ball.position.set(0, 4, -12); // Start at bowler end
    ballSpeedZ = 0.35; // Speed toward batsman
    ballSpeedY = -0.05; // Dropping down
    ballSpeedX = (Math.random() - 0.5) * 0.05; // Slight random angle
    isBallInPlay = true;
    canHit = true;
    document.getElementById("status").innerText = "Incoming!";
}

function swing() {
    if (!canHit) return;
    
    // Animation
    batGroup.rotation.x = -Math.PI / 2;
    setTimeout(() => { batGroup.rotation.x = 0; }, 200);

    // Hit Logic: Distance check
    const dist = ball.position.distanceTo(batsman.position);
    if (dist < 2.5 && isBallInPlay) {
        hit();
    }
}

function hit() {
    canHit = false;
    let runs = [1, 2, 3, 4, 6];
    let r = runs[Math.floor(Math.random() * runs.length)];
    
    // Send ball flying away
    ballSpeedZ = -0.6; 
    ballSpeedY = 0.2;
    ballSpeedX = (Math.random() - 0.5) * 0.4;

    score += r;
    updateUI();
    if (r >= 4) showBanner(r === 4 ? "FOUR!" : "SIXER!");
    document.getElementById("status").innerText = "Great Shot!";
}

function resetPlay(message) {
    isBallInPlay = false;
    overBall++;
    updateUI();
    document.getElementById("status").innerText = message;
    setTimeout(deliverBall, 1500);
}

function updateUI() {
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("over").innerText = "Over: " + Math.floor(overBall / 6) + "." + (overBall % 6);
}

function showBanner(text) {
    const b = document.getElementById("banner");
    b.innerText = text;
    b.style.display = "block";
    setTimeout(() => { b.style.display = "none"; }, 1000);
}

// --- Main Loop ---
function animate() {
    requestAnimationFrame(animate);
    
    if (isBallInPlay) {
        ball.position.z += ballSpeedZ;
        ball.position.y += ballSpeedY;
        ball.position.x += ballSpeedX;

        // Bounce on pitch
        if (ball.position.y < 0.2 && ball.position.z < 10) {
            ballSpeedY = 0.1;
        } else {
            ballSpeedY -= 0.005; // Gravity
        }

        // Missed it?
        if (ball.position.z > 15) {
            resetPlay("Dot Ball");
        }
        
        // Out of bounds (after hit)
        if (ball.position.z < -20 || Math.abs(ball.position.x) > 30) {
            resetPlay("Ready for next...");
        }
    }

    renderer.render(scene, camera);
}

// Controls
document.getElementById("hit-btn").onclick = (e) => { e.stopPropagation(); swing(); };
window.addEventListener("keydown", (e) => { if(e.code === "Space") swing(); });

// Start
deliverBall();
animate();
