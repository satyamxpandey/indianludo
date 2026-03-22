let scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

let camera = new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
)

let renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

let light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(10,20,10)
scene.add(light)

scene.add(new THREE.AmbientLight(0x404040))

// stadium ground
let ground = new THREE.Mesh(
new THREE.CircleGeometry(60,64),
new THREE.MeshPhongMaterial({color:0x2e8b57})
)
ground.rotation.x = -Math.PI/2
scene.add(ground)

// pitch
let pitch = new THREE.Mesh(
new THREE.BoxGeometry(3,0.1,24),
new THREE.MeshPhongMaterial({color:0xcaa472})
)
pitch.position.y=0.05
scene.add(pitch)

// batsman
let batsman = new THREE.Mesh(
new THREE.BoxGeometry(1,3,1),
new THREE.MeshPhongMaterial({color:0x0000ff})
)
batsman.position.set(-2,1.5,0)
scene.add(batsman)

// bat
let bat = new THREE.Mesh(
new THREE.BoxGeometry(0.2,2,0.2),
new THREE.MeshPhongMaterial({color:0x8b4513})
)
bat.position.set(-1.2,2,0)
scene.add(bat)

// bowler
let bowler = new THREE.Mesh(
new THREE.BoxGeometry(1,3,1),
new THREE.MeshPhongMaterial({color:0xff0000})
)
bowler.position.set(6,1.5,0)
scene.add(bowler)

// ball
let ball = new THREE.Mesh(
new THREE.SphereGeometry(0.25,32,32),
new THREE.MeshPhongMaterial({color:0xffffff})
)
ball.position.set(6,1,0)
scene.add(ball)

camera.position.set(8,5,10)
camera.lookAt(0,1,0)

let speed = 0.12
let score = 0
let overBall = 0

function animate(){
requestAnimationFrame(animate)

ball.position.x -= speed
ball.position.y = 1 + Math.sin(Date.now()*0.005)*0.2

if(ball.position.x < -2.3){
resetBall()
}

renderer.render(scene,camera)
}
animate()

function swing(){
bat.rotation.z = -1

setTimeout(()=>{
bat.rotation.z = 0
},150)

if(ball.position.x < -1.5 && ball.position.x > -2.5){
hit()
}
}

function hit(){
let runs=[1,2,3,4,6]
let r=runs[Math.floor(Math.random()*runs.length)]

score += r

document.getElementById("score").innerHTML="Score: "+score

if(r==4) show("FOUR")
if(r==6) show("SIX")

resetBall()
}

function resetBall(){
ball.position.set(6,1,0)
overBall++

document.getElementById("over").innerHTML=
"Over: "+Math.floor(overBall/6)+"."+(overBall%6)
}

function show(t){
let b=document.getElementById("banner")
b.innerHTML=t
b.style.display="block"

setTimeout(()=>{
b.style.display="none"
},700)
}

document.getElementById("hit").onclick = swing
document.addEventListener("click",swing)
document.addEventListener("touchstart",swing)
