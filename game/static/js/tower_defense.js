/* ============================================================
   SECTION 1 — Config & Constants
   ============================================================ */

const CONFIG = {
    GRID_COLS: 20,
    GRID_ROWS: 14,
    CELL_SIZE: 40,            // logical pixels -> canvas 800x560

    STARTING_GOLD: 200,
    STARTING_LIVES: 20,
    TOTAL_WAVES: 10,

    SPAWN_INTERVAL_BASE: 0.8, // seconds between enemies in a wave
    WAVE_COOLDOWN: 3.0,       // seconds before first enemy of next wave

    // Dark theme palette
    COLOR_BG:           '#1a1d2e',
    COLOR_GRID_LINE:    'rgba(255,255,255,0.10)',
    COLOR_DESK:         'rgba(255,255,255,0.12)',
    COLOR_DESK_BORDER:  'rgba(255,255,255,0.18)',
    COLOR_PATH:         'rgba(107,122,255,0.18)',
    COLOR_HOVER_VALID:  'rgba(107,122,255,0.30)',
    COLOR_HOVER_INVALID:'rgba(248,113,113,0.25)',
    COLOR_RANGE:        'rgba(107,122,255,0.10)',
    COLOR_RANGE_BORDER: 'rgba(107,122,255,0.35)',

    ENEMY_COLORS: { basic: '#fbbf24', fast: '#38bdf8', tank: '#ef4444', boss: '#ec4899' },
    TOWER_COLORS: { Archer: '#4ade80', Mage: '#a78bfa', Cannon: '#f87171' },
};

/* ============================================================
   SECTION 1b — Classroom Obstacle Map
   0 = walkable   1 = desk (blocked)
   Desks in horizontal rows, vertical aisles at cols 3,7,11,15
   Horizontal aisles at rows 1,4,7,10
   ============================================================ */

const OBSTACLE_MAP = [
    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r0  entry
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r1  top aisle
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r2  desk row
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r3  desk row
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r4  aisle
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r5  desk row
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r6  desk row
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r7  aisle
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r8  desk row
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r9  desk row
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r10 aisle
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r11 desk row
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r12 desk row
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r13 bottom aisle / exit
];

/* ============================================================
   SECTION 1c — Path Waypoints (serpentine through classroom aisles)
   Waypoint 0 = off-screen entry, last = off-screen exit
   ============================================================ */

const PATH_WAYPOINTS = [
    { col: 3, row: -1 },  // off-screen top
    { col: 3, row:  0 },
    { col: 3, row:  1 },
    { col: 3, row:  4 },  // turn right along aisle
    { col: 7, row:  4 },
    { col: 7, row:  7 },  // turn right along aisle
    { col: 11, row: 7 },
    { col: 11, row: 10 }, // turn right along aisle
    { col: 15, row: 10 },
    { col: 15, row: 13 },
    { col: 15, row: 14 }, // off-screen bottom
];

// Build path cell set from waypoints
function buildPathCells() {
    const set = new Set();
    for (let i = 1; i < PATH_WAYPOINTS.length - 1; i++) {
        const a = PATH_WAYPOINTS[i];
        const b = PATH_WAYPOINTS[i + 1];
        if (a.col === b.col) {
            const minR = Math.min(a.row, b.row);
            const maxR = Math.max(a.row, b.row);
            for (let r = minR; r <= maxR; r++) set.add(`${a.col},${r}`);
        } else {
            const minC = Math.min(a.col, b.col);
            const maxC = Math.max(a.col, b.col);
            for (let c = minC; c <= maxC; c++) set.add(`${c},${a.row}`);
        }
    }
    return set;
}
const PATH_CELLS = buildPathCells();

/* ============================================================
   SECTION 1d — Helpers
   ============================================================ */

function isDesk(col, row) {
    if (col < 0 || col >= CONFIG.GRID_COLS || row < 0 || row >= CONFIG.GRID_ROWS) return true;
    return OBSTACLE_MAP[row][col] === 1;
}

function isPathCell(col, row) {
    return PATH_CELLS.has(`${col},${row}`);
}

function isBuildable(col, row) {
    if (col < 0 || col >= CONFIG.GRID_COLS || row < 0 || row >= CONFIG.GRID_ROWS) return false;
    return OBSTACLE_MAP[row][col] === 0 && !isPathCell(col, row);
}

function cellCenter(col, row) {
    return {
        x: col * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
        y: row * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
    };
}

/* ============================================================
   SECTION 2 — Sprite Registry (placeholder, loaded in Step 8)
   ============================================================ */

const SPRITES = {};

function loadSprites(spriteMap) {
    const promises = [];
    for (const [key, url] of Object.entries(spriteMap)) {
        const img = new Image();
        img.src = url;
        SPRITES[key] = img;
        promises.push(new Promise((resolve) => { img.onload = resolve; }));
    }
    return Promise.all(promises);
}

/* ============================================================
   SECTION 3 — Canvas Setup
   ============================================================ */

const canvas = document.getElementById('game-canvas');
canvas.width  = CONFIG.GRID_COLS * CONFIG.CELL_SIZE;   // 800
canvas.height = CONFIG.GRID_ROWS * CONFIG.CELL_SIZE;   // 560
const ctx = canvas.getContext('2d');

const domGold   = document.getElementById('gold-display');
const domLives  = document.getElementById('lives-display');
const domWave   = document.getElementById('wave-display');
const domScore  = document.getElementById('score-display');
const domMsg    = document.getElementById('game-message');
const domTowerList = document.getElementById('tower-list');
const btnWave   = document.getElementById('spawnWave');

function canvasCoords(e) {
    const r = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - r.left) * (canvas.width  / r.width),
        y: (e.clientY - r.top)  * (canvas.height / r.height),
    };
}

function pixelToCell(px, py) {
    return {
        col: Math.floor(px / CONFIG.CELL_SIZE),
        row: Math.floor(py / CONFIG.CELL_SIZE),
    };
}

/* ============================================================
   SECTION 4 — Game State
   ============================================================ */

const state = {
    gold:   CONFIG.STARTING_GOLD,
    lives:  CONFIG.STARTING_LIVES,
    wave:   0,
    score:  0,

    towers:       [],   // {id, type, col, row, x, y, cooldownRemaining}
    enemies:      [],   // {id, type, x, y, hp, maxHp, speed, value, damage, waypointIndex, size, color, sprite}
    projectiles:  [],   // {x, y, target, speed, damage, color, traveled, maxRange}

    selectedTower: null,
    waveActive: false,
    waveEnemiesRemaining: [],
    spawnTimer: 0,

    gameOver: false,
    gameWon:  false,

    mouseCell: null,    // {col, row} of cell under cursor
    nextId: 1,
};

/* ============================================================
   SECTION 10 — Rendering
   ============================================================ */

function render() {
    // Background
    ctx.fillStyle = CONFIG.COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawDesks();
    drawPath();
    drawRangePreview();
    drawTowers();
    drawEnemies();
    drawProjectiles();
}

function drawGrid() {
    ctx.strokeStyle = CONFIG.COLOR_GRID_LINE;
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= CONFIG.GRID_COLS; c++) {
        const x = c * CONFIG.CELL_SIZE;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let r = 0; r <= CONFIG.GRID_ROWS; r++) {
        const y = r * CONFIG.CELL_SIZE;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
}

function drawDesks() {
    for (let r = 0; r < CONFIG.GRID_ROWS; r++) {
        for (let c = 0; c < CONFIG.GRID_COLS; c++) {
            if (isDesk(c, r)) {
                const x = c * CONFIG.CELL_SIZE, y = r * CONFIG.CELL_SIZE;
                // Desk body
                ctx.fillStyle = CONFIG.COLOR_DESK;
                ctx.fillRect(x + 2, y + 2, CONFIG.CELL_SIZE - 4, CONFIG.CELL_SIZE - 4);
                // Desk border
                ctx.strokeStyle = CONFIG.COLOR_DESK_BORDER;
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 2, y + 2, CONFIG.CELL_SIZE - 4, CONFIG.CELL_SIZE - 4);
                // Chair dot (small circle)
                ctx.fillStyle = 'rgba(255,255,255,0.10)';
                ctx.beginPath();
                ctx.arc(x + CONFIG.CELL_SIZE / 2, y + CONFIG.CELL_SIZE - 8, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPath() {
    // Light highlight on path cells
    for (const key of PATH_CELLS) {
        const [c, r] = key.split(',').map(Number);
        ctx.fillStyle = CONFIG.COLOR_PATH;
        ctx.fillRect(c * CONFIG.CELL_SIZE, r * CONFIG.CELL_SIZE,
                     CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
    }

    // Entry / Exit labels
    ctx.fillStyle = '#6b7aff';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    const entry = PATH_WAYPOINTS[1];
    const exit  = PATH_WAYPOINTS[PATH_WAYPOINTS.length - 2];
    ctx.fillText('IN', entry.col * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2, entry.row * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2 + 4);
    ctx.fillText('OUT', exit.col * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2, exit.row * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2 + 4);
    ctx.textAlign = 'start';
}

function drawRangePreview() {
    if (!state.mouseCell || !state.selectedTower) return;
    const { col, row } = state.mouseCell;
    const canBuild = isBuildable(col, row)
        && !state.towers.some(t => t.col === col && t.row === row);

    // Cell highlight
    ctx.fillStyle = canBuild ? CONFIG.COLOR_HOVER_VALID : CONFIG.COLOR_HOVER_INVALID;
    ctx.fillRect(col * CONFIG.CELL_SIZE, row * CONFIG.CELL_SIZE, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);

    if (!canBuild) return;

    // Range circle
    const pos = cellCenter(col, row);
    const rangePx = state.selectedTower.range * CONFIG.CELL_SIZE;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, rangePx, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.COLOR_RANGE;
    ctx.fill();
    ctx.strokeStyle = CONFIG.COLOR_RANGE_BORDER;
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawTowers() {
    for (const t of state.towers) {
        const size = CONFIG.CELL_SIZE * 0.65;
        const sx = t.x - size / 2;
        const sy = t.y - size / 2;

        // Body
        ctx.fillStyle = t.type.color;
        ctx.fillRect(sx, sy, size, size);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sx, sy, size, size);

        // Firing cooldown bar
        const cdPct = 1 - (t.cooldownRemaining / (1.0 / t.type.fireRate));
        ctx.fillStyle = '#fff';
        ctx.fillRect(sx, t.y - CONFIG.CELL_SIZE / 2 - 3, size * cdPct, 3);
    }
}

function drawEnemies() {
    for (const e of state.enemies) {
        // Body
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // HP bar
        const barW = e.size * 2;
        const barH = 4;
        const barY = e.y - e.size - 8;
        const hpPct = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(e.x - barW / 2, barY, barW, barH);
        ctx.fillStyle = hpPct > 0.5 ? '#4ade80' : hpPct > 0.25 ? '#fbbf24' : '#ef4444';
        ctx.fillRect(e.x - barW / 2, barY, barW * hpPct, barH);
    }
}

function drawProjectiles() {
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 4;
    for (const p of state.projectiles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
    ctx.shadowBlur = 0; // reset
}

/* ============================================================
   SECTION 11 — HUD Helpers
   ============================================================ */

function updateHUD() {
    domGold.textContent  = state.gold;
    domLives.textContent = state.lives;
    domWave.textContent  = state.wave;
    domScore.textContent = state.score;
    domLives.className = state.lives <= 5 ? 'hud-warning' : '';
}

function setMessage(text) {
    domMsg.textContent = text;
}

/* ============================================================
   SECTION 14 — Game Loop & Init
   ============================================================ */

let lastTime = 0;

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    let dt = (timestamp - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1; // clamp for tab-switch
    lastTime = timestamp;

    // Combat & movement (no-op until Step 7)
    if (!state.gameOver) {
        updateEnemies(dt);
        updateCombat(dt);
        updateWaveSpawning(dt);
    }

    render();
    requestAnimationFrame(gameLoop);
}

/* ============================================================
   SECTION 7 — Enemy Data & Spawning
   ============================================================ */

const ENEMY_TYPES = {
    basic: { hp: 30,  speed: 60,  value: 10, damage: 1, size: 10, color: CONFIG.ENEMY_COLORS.basic, sprite: null },
    fast:  { hp: 20,  speed: 110, value: 15, damage: 1, size: 7,  color: CONFIG.ENEMY_COLORS.fast,  sprite: null },
    tank:  { hp: 120, speed: 40,  value: 30, damage: 3, size: 14, color: CONFIG.ENEMY_COLORS.tank,  sprite: null },
    boss:  { hp: 300, speed: 35,  value: 100, damage: 5, size: 18, color: CONFIG.ENEMY_COLORS.boss,  sprite: 'images/haruhi_1.png' },
};

function createEnemy(typeKey, waveNum) {
    const proto = ENEMY_TYPES[typeKey];
    const hpScale  = 1 + (waveNum - 1) * 0.25;
    const startWp  = PATH_WAYPOINTS[0];
    return {
        id: state.nextId++,
        type: typeKey,
        x: startWp.col * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
        y: startWp.row * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
        hp: Math.round(proto.hp * hpScale),
        maxHp: Math.round(proto.hp * hpScale),
        speed: proto.speed,
        value: proto.value,
        damage: proto.damage,
        waypointIndex: 1,
        size: proto.size,
        color: proto.color,
        sprite: proto.sprite,
    };
}

function generateWave(waveNum) {
    const enemies = [];
    const basicCount = 3 + Math.floor(waveNum * 1.5);
    for (let i = 0; i < basicCount; i++) enemies.push(createEnemy('basic', waveNum));

    if (waveNum >= 3) {
        for (let i = 0; i < Math.floor((waveNum - 2) * 0.8); i++) enemies.push(createEnemy('fast', waveNum));
    }
    if (waveNum >= 5) {
        for (let i = 0; i < Math.floor((waveNum - 4) * 0.5); i++) enemies.push(createEnemy('tank', waveNum));
    }
    if (waveNum % 5 === 0) {
        enemies.push(createEnemy('boss', waveNum));
    }
    // Shuffle
    for (let i = enemies.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [enemies[i], enemies[j]] = [enemies[j], enemies[i]];
    }
    return enemies;
}

/* ============================================================
   SECTION 8 — Combat System
   ============================================================ */

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function findTarget(tower) {
    const rangePx = tower.type.range * CONFIG.CELL_SIZE;
    let best = null, bestDist = rangePx;
    for (const e of state.enemies) {
        if (e.hp <= 0) continue;
        const d = distance(tower.x, tower.y, e.x, e.y);
        if (d < bestDist) { best = e; bestDist = d; }
    }
    return best;
}

function fireProjectile(tower, target) {
    state.projectiles.push({
        x: tower.x, y: tower.y,
        target: target,
        speed: 300,
        damage: tower.type.damage,
        color: tower.type.color,
        traveled: 0,
        maxRange: tower.type.range * CONFIG.CELL_SIZE + 60,
    });
}

function updateCombat(dt) {
    // Tower cooldowns + fire
    for (const t of state.towers) {
        t.cooldownRemaining = Math.max(0, t.cooldownRemaining - dt);
        if (t.cooldownRemaining <= 0) {
            const target = findTarget(t);
            if (target) {
                fireProjectile(t, target);
                t.cooldownRemaining = 1.0 / t.type.fireRate;
            }
        }
    }

    // Projectile movement + hit detection
    for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const p = state.projectiles[i];
        if (!p.target || p.target.hp <= 0) { state.projectiles.splice(i, 1); continue; }

        const dx = p.target.x - p.x, dy = p.target.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const move = p.speed * dt;

        if (d < p.target.size + 6) {
            p.target.hp -= p.damage;
            state.projectiles.splice(i, 1);
        } else if (p.traveled + move > p.maxRange) {
            state.projectiles.splice(i, 1);
        } else {
            p.x += (dx / d) * move;
            p.y += (dy / d) * move;
            p.traveled += move;
        }
    }

    // Dead enemies → gold + score
    for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        if (e.hp <= 0) {
            state.gold += e.value;
            state.score += e.value;
            state.enemies.splice(i, 1);
            updateHUD();
        }
    }
}

/* ============================================================
   SECTION 9 — Enemy Movement & Wave Management
   ============================================================ */

function updateEnemies(dt) {
    for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        if (e.waypointIndex >= PATH_WAYPOINTS.length) {
            // Reached exit — lose life
            state.lives -= e.damage;
            state.enemies.splice(i, 1);
            updateHUD();
            if (state.lives <= 0) endGame(false);
            continue;
        }
        const wp = PATH_WAYPOINTS[e.waypointIndex];
        const tx = wp.col * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
        const ty = wp.row * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
        const dx = tx - e.x, dy = ty - e.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const move = e.speed * dt;
        if (d < move + 1) {
            e.x = tx; e.y = ty;
            e.waypointIndex++;
        } else {
            e.x += (dx / d) * move;
            e.y += (dy / d) * move;
        }
    }
}

function updateWaveSpawning(dt) {
    if (!state.waveActive) return;
    if (state.waveEnemiesRemaining.length === 0 && state.enemies.length === 0) {
        state.waveActive = false;
        setMessage(`第 ${state.wave} 波击退成功！`);
        btnWave.disabled = false;
        if (state.wave >= CONFIG.TOTAL_WAVES) {
            endGame(true);
        }
        return;
    }
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0 && state.waveEnemiesRemaining.length > 0) {
        state.enemies.push(state.waveEnemiesRemaining.shift());
        state.spawnTimer = Math.max(0.35, CONFIG.SPAWN_INTERVAL_BASE - state.wave * 0.04);
    }
}

function startWave() {
    if (state.waveActive || state.gameOver) return;
    state.wave++;
    state.waveActive = true;
    state.waveEnemiesRemaining = generateWave(state.wave);
    state.spawnTimer = 0.5;
    btnWave.disabled = true;
    updateHUD();
    setMessage(`第 ${state.wave} 波敌人来袭！共 ${state.waveEnemiesRemaining.length} 个敌人。`);
}

function endGame(won) {
    state.gameOver = true;
    state.gameWon = won;
    state.waveActive = false;
    btnWave.disabled = true;
    setMessage(won ? '胜利！电脑社守住了活动室！' : '败北……活动室被凉宫春日占领了……');
}

/* ============================================================
   SECTION 5 — Tower Data
   ============================================================ */

const DEFAULT_TOWERS = [
    { id: 1, name: '弓箭手社员', damage: 15, range: 3.5, cost: 50,  fireRate: 1.0, color: CONFIG.TOWER_COLORS.Archer, sprite: 'images/Kyon_1.png',      description: '均衡型' },
    { id: 2, name: '魔法社员',   damage: 30, range: 2.5, cost: 80,  fireRate: 0.6, color: CONFIG.TOWER_COLORS.Mage,   sprite: 'images/C_1.png',          description: '高伤害，攻速较慢' },
    { id: 3, name: '重炮社员',   damage: 50, range: 2.0, cost: 120, fireRate: 0.4, color: CONFIG.TOWER_COLORS.Cannon, sprite: 'images/C_2.png',          description: '毁灭性打击，射程短' },
];

let towerTypes = [];

async function fetchTowers() {
    try {
        const res = await fetch('/api/towers/');
        const data = await res.json();
        if (data.towers && data.towers.length > 0) {
            towerTypes = data.towers.map(t => ({
                ...t,
                fireRate: 1.0,
                color: CONFIG.TOWER_COLORS[t.name.split(' ')[0]] || '#6b7aff',
                sprite: null,
            }));
            return;
        }
    } catch (e) { /* fallback */ }
    towerTypes = DEFAULT_TOWERS;
}

/* ============================================================
   SECTION 12 — Sidebar Tower List
   ============================================================ */

function renderTowerList() {
    domTowerList.innerHTML = '';
    towerTypes.forEach(t => {
        const li = document.createElement('li');
        li.className = 'tower-item';
        li.innerHTML = `
            <div style="font-weight:600">${t.name}</div>
            <div class="tower-stats">伤害: ${t.damage} | 射程: ${t.range} | 费用: ${t.cost}G</div>`;
        li.addEventListener('click', () => {
            state.selectedTower = t;
            document.querySelectorAll('.tower-item').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            setMessage(`已选择 ${t.name}。点击地图上的高亮格子部署。（费用: ${t.cost}G）`);
        });
        domTowerList.appendChild(li);
    });
}

/* ============================================================
   SECTION 6 — Tower Placement
   ============================================================ */

function tryPlaceTower(col, row) {
    if (!state.selectedTower) {
        setMessage('请先在侧边栏选择一位社员。');
        return false;
    }
    if (!isBuildable(col, row)) {
        setMessage('这里不能部署。请选择走道旁的空位。');
        return false;
    }
    if (state.towers.some(t => t.col === col && t.row === row)) {
        setMessage('这个位置已经有人了。');
        return false;
    }
    if (state.gold < state.selectedTower.cost) {
        setMessage(`经费不足！需要 ${state.selectedTower.cost}G，当前只有 ${state.gold}G。`);
        return false;
    }

    const pos = cellCenter(col, row);
    state.towers.push({
        id: state.nextId++,
        type: state.selectedTower,
        col, row,
        x: pos.x, y: pos.y,
        cooldownRemaining: 0,
    });
    state.gold -= state.selectedTower.cost;
    updateHUD();
    setMessage(`${state.selectedTower.name} 已部署！`);
    return true;
}

/* ============================================================
   SECTION 13 — Input Handlers
   ============================================================ */

canvas.addEventListener('mousemove', (e) => {
    const { x, y } = canvasCoords(e);
    state.mouseCell = pixelToCell(x, y);
});

canvas.addEventListener('mouseleave', () => {
    state.mouseCell = null;
});

canvas.addEventListener('click', (e) => {
    if (state.gameOver) return;
    const { x, y } = canvasCoords(e);
    const { col, row } = pixelToCell(x, y);
    if (col < 0 || col >= CONFIG.GRID_COLS || row < 0 || row >= CONFIG.GRID_ROWS) return;
    tryPlaceTower(col, row);
});

btnWave.addEventListener('click', () => {
    if (state.gameOver) return;
    if (state.waveActive) {
        setMessage('敌人还在入侵中！');
        return;
    }
    if (state.wave >= CONFIG.TOTAL_WAVES) {
        setMessage('所有波次已经结束！');
        return;
    }
    startWave();
});

/* ============================================================
   SECTION 14 — Game Loop & Init
   ============================================================ */

function initGame() {
    updateHUD();
    renderTowerList();
    setMessage('请先在侧边栏选择一座塔，再点击地图上的高亮格子来部署');
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

// Start
console.log('[TD] Starting game...');
fetchTowers().then(() => {
    console.log('[TD] Towers loaded:', towerTypes.length);
    initGame();
});

