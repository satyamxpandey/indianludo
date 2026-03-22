const players = ['red', 'green', 'yellow', 'blue'];
let currentTurn = 0;
let diceValue = 0;
let canRoll = true;

function rollDice() {
    if (!canRoll) return;
    
    diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-value').innerText = diceValue;
    
    // Simple Rule: If not a 6 and no pieces are out, skip turn (Logic stub)
    if (diceValue !== 6) {
        setTimeout(nextTurn, 1000);
    } else {
        alert(players[currentTurn].toUpperCase() + " rolled a 6! You can move a piece out.");
        canRoll = true; // In a full game, you'd wait for a piece click
    }
}

function nextTurn() {
    currentTurn = (currentTurn + 1) % 4;
    document.getElementById('status').innerText = players[currentTurn].toUpperCase() + "'s Turn";
    document.getElementById('status').style.color = players[currentTurn];
    canRoll = true;
}

// Initialization
document.getElementById('status').style.color = players[currentTurn];
