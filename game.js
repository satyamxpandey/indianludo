const battlefield = document.getElementById('battlefield');
const manaBar = document.getElementById('mana-bar');
const manaText = document.getElementById('mana-text');
const cards = document.querySelectorAll('.card');

let mana = 0;
const maxMana = 10;
let selectedCard = null;

// 1. Mana Regeneration (Increases every second)
setInterval(() => {
    if (mana < maxMana) {
        mana += 0.5;
        updateManaUI();
    }
}, 500);

function updateManaUI() {
    const percentage = (mana / maxMana) * 100;
    manaBar.style.width = percentage + '%';
    manaText.innerText = `Amrit: ${Math.floor(mana)}`;
}

// 2. Card Selection
cards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Deselect others
        cards.forEach(c => c.classList.remove('selected'));
        
        // Select this one
        selectedCard = {
            type: card.dataset.unit,
            cost: parseInt(card.dataset.cost)
        };
        card.classList.add('selected');
        e.stopPropagation();
    });
});

// 3. Spawning Units
battlefield.addEventListener('click', (e) => {
    if (!selectedCard) return;

    if (mana >= selectedCard.cost) {
        mana -= selectedCard.cost;
        updateManaUI();
        spawnUnit(selectedCard.type, e.clientX, e.clientY);
    } else {
        alert("Not enough Amrit!");
    }
});

function spawnUnit(type, x, y) {
    const unit = document.createElement('div');
    unit.className = `unit ${type}`;
    
    // Position the unit where clicked
    unit.style.left = (x - 15) + 'px';
    unit.style.top = (y - 15) + 'px';
    
    document.body.appendChild(unit);

    // Simple AI: Move toward the enemy side (top of screen)
    setTimeout(() => {
        unit.style.top = "-100px";
    }, 100);

    // Remove unit after it leaves the screen
    setTimeout(() => {
        unit.remove();
    }, 5000);
}
