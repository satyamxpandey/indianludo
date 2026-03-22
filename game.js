let bar = document.getElementById("moving-bar");
let result = document.getElementById("result");
let scoreText = document.getElementById("score");
let streakText = document.getElementById("streak");

let position = 0;
let direction = 1;
let speed = 4;

let interval;

let score = 0;
let streak = 0;

const perfectStart = 280; // pixel range
const perfectEnd = 320;

// Start moving automatically
function startGame() {
  clearInterval(interval);

  interval = setInterval(() => {
    position += speed * direction;

    if (position >= 380 || position <= 0) {
      direction *= -1;
    }

    bar.style.left = position + "px";
  }, 16);
}

// Stop bar
function stopBar() {
  clearInterval(interval);

  if (position >= perfectStart && position <= perfectEnd) {
    result.innerText = "🔥 PERFECT!";
    score += 10;
    streak++;

    // Increase difficulty
    speed += 0.5;

  } else if (
    position >= perfectStart - 30 &&
    position <= perfectEnd + 30
  ) {
    result.innerText = "😮 ALMOST!";
    score += 3;
    streak++;

  } else {
    result.innerText = "❌ MISS!";
    streak = 0;
    speed = 4;
  }

  scoreText.innerText = "Score: " + score;
  streakText.innerText = "Streak: " + streak;

  setTimeout(() => {
    result.innerText = "Go Again!";
    startGame();
  }, 1000);
}

// Start first time
startGame();
