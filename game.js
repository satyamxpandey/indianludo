// --- Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Lighting ---
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(5, 15, 10);
scene.add(sun);

// --- Assets ---
// Ground
const ground = new THREE.Mesh(new THREE.CircleGeometry(80, 64), new THREE.MeshPhongMaterial({ color: 0x228B22 }));
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Pitch
const pitch = new THREE.Mesh(new THREE.BoxGeometry(4, 0.05, 30), new THREE.MeshPhongMaterial({ color: 0xedc9af }));
pitch.position.y = 0.02;
scene.add(pitch);

// Stumps (Wickets)
const createStumps = (zPos) => {
    const group = new THREE.Group();
    for(let i = -0.4; i <= 0.4; i += 0.4) {
        const s = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5), new THREE.MeshPhongMaterial({color: 0xffffff}));
        s.position.set(i, 1.25, zPos);
        group.add(s);
    }
    scene.add(group);
    return group;
};
const playerStumps = createStumps(13); // Stumps behind batsman

// Batsman (Simple Box) & Bat Group
const batsman = new THREE.Mesh(new THREE.BoxGeometry(1, 3.5, 1), new THREE.MeshPhongMaterial({color: 0x0055ff}));
batsman.position.set(1.2, 1.75, 12);
scene.add(batsman);

const batPivot = new THREE.Group();
batPivot.position.set(0.5, 1.5, 12);
scene.add(batPivot);
const bat = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.8, 0.6), new THREE.MeshPhongMaterial({color: 0x654321}));
bat.position.y = -1; // Pivot from top
batPivot.add(bat);

// The Ball
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), new THREE.MeshPhongMaterial({color: 0xcc0000}));
scene.add(ball);

// --- Game Logic ---
let score = 0;
let ballState = "idle"; // idle, bowling, hit, out
let vel = { x: 0, y: 0, z: 0 };
const gravity = -0.006;

function resetBall() {
    ball.position.set(0, 4, -14); // Bowler end
    vel = { x: (Math.random()-0.5)*0.08, y: -0.05, z: 0.35 }; 
    ballState = "bowling";
    document.getElementById("status").innerText = "INCOMING!";
}

function swingBat() {
    if (batPivot.rotation.x !== 0) return; // Prevent spamming
    
    // Animation
    batPivot.rotation.x = -Math.PI / 1.5;
    setTimeout(() => { batPivot.rotation.x = 0; }, 250);

    // Hit Detection
    const dist = ball.position.distanceTo(new THREE.Vector3(0, 1, 12));
    if (ballState === "bowling" && dist < 2.5) {
        performHit();
    }
}

function performHit() {
    ballState = "hit";
    const runs = [1, 2, 4, 6];
    const r = runs[Math.floor(Math.random() * runs.length)];
    
    // Ball physics after hit
    vel.z = -0.6 - (Math.random() * 0.2);
    vel.y = 0.15 + (Math.random() * 0.1);
    vel.x = (Math.random() - 0.5) * 0.6;

    score += r;
    document.getElementById("score").innerText = "Score: " + score;
    showBanner(r >= 4 ? (r === 6 ? "SIX!" : "FOUR!") : "NICE SHOT!");
}

function showBanner(txt) {
    const b = document.getElementById("banner");
    b.innerText = txt;
    b.style.display = "block";
    setTimeout(() => b.style.display = "none", 1000);
}

function animate() {
    requestAnimationFrame(animate);

    if (ballState === "bowling" || ballState === "hit") {
        ball.position.x += vel.x;
        ball.position.y += vel.y;
        ball.position.z += vel.z;
        vel.y += gravity; // Gravity effect

        // Bounce on pitch
        if (ball.position.y < 0.22 && ball.position.z < 12) {
            ball.position.y = 0.22;
            vel.y *= -0.8; 
        }

        // Out Check: Ball hits stumps
        if (ballState === "bowling" && ball.position.z > 12.8 && Math.abs(ball.position.x) < 0.5) {
            ballState = "out";
            showBanner("BOWLED OUT!");
            setTimeout(resetBall, 2000);
        }

        // Reset if ball goes far away
        if (ball.position.z > 20 || ball.position.z < -30) {
            resetBall();
        }
    }

    // Camera follow ball slightly
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, ball.position.x * 0.5, 0.05);
    renderer.render(scene, camera);
}

// Controls
camera.position.set(0, 6, 22);
camera.lookAt(0, 2, 0);

document.getElementById("hit-btn").addEventListener("click", swingBat);
window.addEventListener("keydown", (e) => { if(e.code === "Space") swingBat(); });

resetBall();
animate();
