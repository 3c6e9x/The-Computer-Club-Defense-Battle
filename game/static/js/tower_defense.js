const towers = [
  { id: 1, name: 'Archer Tower', damage: 10, range: 3, cost: 50 },
  { id: 2, name: 'Mage Tower', damage: 18, range: 2, cost: 80 },
  { id: 3, name: 'Cannon Tower', damage: 25, range: 1, cost: 120 },
];

const towerList = document.getElementById('tower-list');
const gameLog = document.getElementById('game-log');
const spawnWave = document.getElementById('spawnWave');
let selectedTower = null;

function renderTowerList() {
  towerList.innerHTML = '';
  towers.forEach((tower) => {
    const item = document.createElement('li');
    item.className = 'tower-item';
    item.textContent = `${tower.name} (DMG: ${tower.damage}, COST: ${tower.cost})`;
    item.addEventListener('click', () => selectTower(tower));
    towerList.appendChild(item);
  });
}

function selectTower(tower) {
  selectedTower = tower;
  gameLog.textContent = `Selected ${tower.name}. Click Spawn Wave to deploy.`;
  document.querySelectorAll('.tower-item').forEach((item) => {
    item.classList.toggle('active', item.textContent.startsWith(tower.name));
  });
}

function spawnEnemyWave() {
  if (!selectedTower) {
    gameLog.textContent = 'Choose a tower first to defend the path.';
    return;
  }
  const enemyStrength = Math.floor(Math.random() * 40) + 20;
  const result = selectedTower.damage >= enemyStrength ? 'Victory' : 'Hold the line';
  gameLog.textContent = `${result}! ${selectedTower.name} dealt ${selectedTower.damage} damage against enemy strength ${enemyStrength}.`;
}

spawnWave.addEventListener('click', spawnEnemyWave);
renderTowerList();
