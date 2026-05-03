/* ============================================================
   SECTION 1 — Config & Constants
   ============================================================ */

const CONFIG = {
    GRID_COLS: 20,
    GRID_ROWS: 14,
    CELL_SIZE: 40,

    STARTING_GOLD: 200,
    TOTAL_WAVES: 10,
    BARRICADE_COUNT: 8,

    SPAWN_INTERVAL_BASE: 0.8,
    WAVE_COOLDOWN: 0.5,

    // 门口和电脑的格子坐标
    DOOR_COL: 0, DOOR_ROW: 1,
    COMPUTER_COL: 19, COMPUTER_ROW: 12,

    // Colors
    COLOR_BG:           '#1a1d2e',
    COLOR_GRID_LINE:    'rgba(255,255,255,0.08)',
    COLOR_DESK:         'rgba(255,255,255,0.12)',
    COLOR_DESK_BORDER:  'rgba(255,255,255,0.18)',
    COLOR_BARRICADE:    'rgba(248,113,113,0.35)',
    COLOR_DOOR:         '#4ade80',
    COLOR_COMPUTER:     '#38bdf8',
    COLOR_PATH:         'rgba(107,122,255,0.22)',
    COLOR_HOVER_VALID:  'rgba(107,122,255,0.30)',
    COLOR_HOVER_INVALID:'rgba(248,113,113,0.25)',
    COLOR_RANGE:        'rgba(107,122,255,0.10)',
    COLOR_RANGE_BORDER: 'rgba(107,122,255,0.35)',

    TOWER_COLORS: { Archer: '#4ade80', Mage: '#a78bfa', Cannon: '#f87171' },
};

/* ============================================================
   SECTION 1b — Classroom Obstacle Map
   0=走道  1=课桌(固定障碍)
   门口(D)在(0,1)  电脑(C)在(19,12)
   课桌4排，每排3组，组间留竖走道，排间留横过道
   ============================================================ */

const OBSTACLE_MAP = [
    // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // r0  顶部墙壁(封死)
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r1  门口行
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r2  课桌排1
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r3  课桌排1
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r4  横过道
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r5  课桌排2
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r6  课桌排2
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r7  横过道
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r8  课桌排3
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r9  课桌排3
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r10 横过道
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1], // r11 课桌排4
    [ 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0], // r12 课桌排4+电脑
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // r13 底部走道
];

/* ============================================================
   SECTION 1c — BFS Pathfinding Algorithms
   核心：防堵死检测 + 最短路径提取 + 路径简化
   ============================================================ */

const DIRS = [[0,1],[1,0],[0,-1],[-1,0]];

// 判断某个格是否为障碍（固定课桌 OR 玩家路障 OR 边界外）
function isBlocked(col, row, barricades) {
    if (col < 0 || col >= CONFIG.GRID_COLS || row < 0 || row >= CONFIG.GRID_ROWS) return true;
    if (OBSTACLE_MAP[row][col] === 1) return true;
    if (barricades && barricades.has(`${col},${row}`)) return true;
    return false;
}

// 计算距离地图：BFS 从电脑出发，给每个可通行格子赋值"到电脑的步数"
// 存为二维数组 distanceMap[row][col]，不可达为 -1
function computeDistanceMap(barricades) {
    const dist = Array.from({ length: CONFIG.GRID_ROWS }, () =>
        Array(CONFIG.GRID_COLS).fill(-1)
    );
    const startC = CONFIG.COMPUTER_COL, startR = CONFIG.COMPUTER_ROW;
    dist[startR][startC] = 0;
    const queue = [[startC, startR]];
    while (queue.length > 0) {
        const [c, r] = queue.shift();
        for (const [dc, dr] of DIRS) {
            const nc = c + dc, nr = r + dr;
            if (!isBlocked(nc, nr, barricades) && dist[nr][nc] === -1) {
                dist[nr][nc] = dist[r][c] + 1;
                queue.push([nc, nr]);
            }
        }
    }
    return dist;
}

// BFS 连通性检测：门口→电脑 是否可达
function hasPath(barricades) {
    const dm = computeDistanceMap(barricades);
    return dm[CONFIG.DOOR_ROW][CONFIG.DOOR_COL] >= 0;
}

// 从距离地图提取路径格子集合（用于渲染）
function extractPathCells(distanceMap) {
    const cells = new Set();
    // 从门口出发，沿距离递减走到电脑
    let c = CONFIG.DOOR_COL, r = CONFIG.DOOR_ROW;
    const maxSteps = CONFIG.GRID_COLS * CONFIG.GRID_ROWS;
    let steps = 0;
    while (!(c === CONFIG.COMPUTER_COL && r === CONFIG.COMPUTER_ROW) && steps < maxSteps) {
        cells.add(`${c},${r}`);
        steps++;
        let best = null, bestDist = distanceMap[r][c];
        for (const [dc, dr] of DIRS) {
            const nc = c + dc, nr = r + dr;
            if (distanceMap[nr] && distanceMap[nr][nc] >= 0 && distanceMap[nr][nc] < bestDist) {
                best = [nc, nr];
                bestDist = distanceMap[nr][nc];
            }
        }
        if (!best) break;
        [c, r] = best;
    }
    cells.add(`${CONFIG.COMPUTER_COL},${CONFIG.COMPUTER_ROW}`);
    return cells;
}

/* ============================================================
   SECTION 1d — Helpers
   ============================================================ */

function isDesk(col, row) {
    if (col < 0 || col >= CONFIG.GRID_COLS || row < 0 || row >= CONFIG.GRID_ROWS) return true;
    return OBSTACLE_MAP[row][col] === 1;
}

function isBarricade(col, row) {
    return state.barricades.has(`${col},${row}`);
}

function isWalkable(col, row) {
    if (isDesk(col, row)) return false;
    if (state.barricades.has(`${col},${row}`)) return false;
    if (col === CONFIG.DOOR_COL && row === CONFIG.DOOR_ROW) return true;
    if (col === CONFIG.COMPUTER_COL && row === CONFIG.COMPUTER_ROW) return true;
    return col >= 0 && col < CONFIG.GRID_COLS && row >= 0 && row < CONFIG.GRID_ROWS;
}

function isPathCell(col, row) {
    return state.pathCells.has(`${col},${row}`);
}

function isBuildable(col, row) {
    if (!isWalkable(col, row)) return false;
    // 门口和电脑格不可部署
    if (col === CONFIG.DOOR_COL && row === CONFIG.DOOR_ROW) return false;
    if (col === CONFIG.COMPUTER_COL && row === CONFIG.COMPUTER_ROW) return false;
    return true;
}

function cellCenter(col, row) {
    return {
        x: col * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
        y: row * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
    };
}

/* ============================================================
   SECTION 2 — Sprite Registry
   收集所有 ENEMY_CONFIGS 和 DEFAULT_TOWERS 中的 sprite 路径，
   统一预加载。后期换图只需改配置里的 sprite 字段。
   ============================================================ */

const SPRITES = {};

function loadAllSprites() {
    // 收集所有需要加载的图片路径
    const paths = new Set();
    ENEMY_CONFIGS.forEach(c => { if (c.sprite) paths.add(c.sprite); });
    DEFAULT_TOWERS.forEach(t => { if (t.sprite) paths.add(t.sprite); });

    const promises = [];
    for (const path of paths) {
        const img = new Image();
        img.src = '/static/' + path;
        SPRITES[path] = img;
        promises.push(new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => {
                console.warn('[TD] Failed to load sprite:', path, '(fallback to shape)');
                resolve(); // 不阻塞启动，fallback 到几何图形
            };
        }));
    }
    console.log('[TD] Preloading', promises.length, 'sprites...');
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
    phase: 'barricade',
    gold:   CONFIG.STARTING_GOLD,
    wave:   0,
    score:  0,

    towers:       [],
    enemies:      [],
    projectiles:  [],

    // 路障系统
    barricades:           new Set(),        // "col,row" 字符串集合
    barricadesRemaining:  CONFIG.BARRICADE_COUNT,

    // 动态路径（路障阶段结束后 BFS 计算）
    distanceMap:   null,      // 二维数组 distanceMap[row][col] = 到电脑的步数
    pathCells:     new Set(), // 路径经过的所有格子（用于渲染）

    selectedTower: null,
    waveActive: false,
    waveEnemiesRemaining: [],
    spawnTimer: 0,

    gameOver: false,
    gameWon:  false,

    mouseCell: null,
    nextId: 1,
};

/* ============================================================
   SECTION 10 — Rendering
   ============================================================ */

function render() {
    ctx.fillStyle = CONFIG.COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawDesks();
    drawBarricades();
    drawDoor();
    drawComputer();
    if (state.phase === 'barricade') {
        drawBarricadeHover();
    } else {
        drawRangePreview();
        drawTowers();
        drawEnemies();
        drawProjectiles();
    }
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
                drawDeskCell(c, r);
            }
        }
    }
}

function drawDeskCell(c, r) {
    const x = c * CONFIG.CELL_SIZE, y = r * CONFIG.CELL_SIZE;
    ctx.fillStyle = CONFIG.COLOR_DESK;
    ctx.fillRect(x + 2, y + 2, CONFIG.CELL_SIZE - 4, CONFIG.CELL_SIZE - 4);
    ctx.strokeStyle = CONFIG.COLOR_DESK_BORDER;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 2, y + 2, CONFIG.CELL_SIZE - 4, CONFIG.CELL_SIZE - 4);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath();
    ctx.arc(x + CONFIG.CELL_SIZE / 2, y + CONFIG.CELL_SIZE - 8, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawBarricades() {
    for (const key of state.barricades) {
        const [c, r] = key.split(',').map(Number);
        const x = c * CONFIG.CELL_SIZE, y = r * CONFIG.CELL_SIZE;
        ctx.fillStyle = CONFIG.COLOR_BARRICADE;
        ctx.fillRect(x + 3, y + 3, CONFIG.CELL_SIZE - 6, CONFIG.CELL_SIZE - 6);
        ctx.strokeStyle = 'rgba(248,113,113,0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 3, y + 3, CONFIG.CELL_SIZE - 6, CONFIG.CELL_SIZE - 6);
        // X 标记
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1.5;
        const cx = x + CONFIG.CELL_SIZE / 2, cy = y + CONFIG.CELL_SIZE / 2;
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy - 5); ctx.lineTo(cx + 5, cy + 5);
        ctx.moveTo(cx + 5, cy - 5); ctx.lineTo(cx - 5, cy + 5);
        ctx.stroke();
    }
}

function drawDoor() {
    const x = CONFIG.DOOR_COL * CONFIG.CELL_SIZE, y = CONFIG.DOOR_ROW * CONFIG.CELL_SIZE;
    ctx.fillStyle = CONFIG.COLOR_DOOR;
    ctx.fillRect(x + 4, y + 4, CONFIG.CELL_SIZE - 8, CONFIG.CELL_SIZE - 8);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('门', x + CONFIG.CELL_SIZE / 2, y + CONFIG.CELL_SIZE / 2 + 5);
    ctx.textAlign = 'start';
}

function drawComputer() {
    const x = CONFIG.COMPUTER_COL * CONFIG.CELL_SIZE, y = CONFIG.COMPUTER_ROW * CONFIG.CELL_SIZE;
    ctx.fillStyle = CONFIG.COLOR_COMPUTER;
    ctx.fillRect(x + 4, y + 4, CONFIG.CELL_SIZE - 8, CONFIG.CELL_SIZE - 8);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PC', x + CONFIG.CELL_SIZE / 2, y + CONFIG.CELL_SIZE / 2 + 5);
    ctx.textAlign = 'start';
}

function drawBarricadeHover() {
    if (!state.mouseCell) return;
    const { col, row } = state.mouseCell;
    if (!canPlaceBarricade(col, row)) {
        ctx.fillStyle = CONFIG.COLOR_HOVER_INVALID;
        ctx.fillRect(col * CONFIG.CELL_SIZE, row * CONFIG.CELL_SIZE, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
        return;
    }
    ctx.fillStyle = CONFIG.COLOR_HOVER_VALID;
    ctx.fillRect(col * CONFIG.CELL_SIZE, row * CONFIG.CELL_SIZE, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
}

function drawPath() {
    // 路径格子高亮
    for (const key of state.pathCells) {
        const [c, r] = key.split(',').map(Number);
        ctx.fillStyle = CONFIG.COLOR_PATH;
        ctx.fillRect(c * CONFIG.CELL_SIZE, r * CONFIG.CELL_SIZE, CONFIG.CELL_SIZE, CONFIG.CELL_SIZE);
    }
    // 距离数字（调试用，部署阶段显示）
    if (state.phase === 'deploy' && state.distanceMap) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        for (const key of state.pathCells) {
            const [c, r] = key.split(',').map(Number);
            ctx.fillText(state.distanceMap[r][c],
                c * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                r * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2 + 4);
        }
        ctx.textAlign = 'start';
    }
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
        const size = CONFIG.CELL_SIZE * 0.7;
        const sx = t.x - size / 2;
        const sy = t.y - size / 2;

        const img = t.type.sprite ? SPRITES[t.type.sprite] : null;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, sx, sy, size, size);
        } else {
            ctx.fillStyle = t.type.color;
            ctx.fillRect(sx, sy, size, size);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(sx, sy, size, size);
        }

        // Firing cooldown bar
        const cdPct = 1 - (t.cooldownRemaining / (1.0 / t.type.fireRate));
        ctx.fillStyle = '#fff';
        ctx.fillRect(sx, t.y - CONFIG.CELL_SIZE / 2 - 3, size * cdPct, 3);
    }
}

function drawEnemies() {
    for (const e of state.enemies) {
        const img = e.sprite ? SPRITES[e.sprite] : null;
        if (img && img.complete && img.naturalWidth > 0) {
            const sz = e.size * 2.5;
            ctx.save();
            if (e.flipX) {
                ctx.translate(e.x, e.y);
                ctx.scale(-1, 1);
                ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
            } else {
                ctx.drawImage(img, e.x - sz / 2, e.y - sz / 2, sz, sz);
            }
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            ctx.fillStyle = e.color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // HP bar (始终显示)
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
    domWave.textContent  = state.wave;
    domScore.textContent = state.score;
    if (state.phase === 'barricade') {
        document.getElementById('total-waves').textContent = state.barricadesRemaining + '障';
    } else {
        document.getElementById('total-waves').textContent = CONFIG.TOTAL_WAVES;
    }
}

function setMessage(text) {
    domMsg.textContent = text;
}

/* ============================================================
   SECTION 6b — Barricade Logic
   ============================================================ */

function canPlaceBarricade(col, row) {
    if (state.phase !== 'barricade') return false;
    if (state.barricadesRemaining <= 0) return false;
    // 必须是可以走路的空格
    if (!isWalkable(col, row)) return false;
    if (isDesk(col, row)) return false;
    // 不能放在门口或电脑格
    if (col === CONFIG.DOOR_COL && row === CONFIG.DOOR_ROW) return false;
    if (col === CONFIG.COMPUTER_COL && row === CONFIG.COMPUTER_ROW) return false;
    // 不能重复放置
    if (state.barricades.has(`${col},${row}`)) return false;
    // BFS 检测：放了这个路障后门口→电脑是否仍连通
    const testSet = new Set(state.barricades);
    testSet.add(`${col},${row}`);
    if (!hasPath(testSet)) return false;
    return true;
}

function finalizeBarricades() {
    const dm = computeDistanceMap(state.barricades);
    if (dm[CONFIG.DOOR_ROW][CONFIG.DOOR_COL] < 0) {
        setMessage('错误：门口到电脑没有通路！请移除一些路障。');
        return false;
    }
    state.distanceMap = dm;
    state.pathCells = extractPathCells(dm);
    state.phase = 'deploy';
    btnWave.textContent = '开始波次';
    setMessage('请部署社员来防守。');
    updateHUD();
    return true;
}

/* ============================================================
   SECTION 14 — Game Loop
   ============================================================ */

let lastTime = 0;

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    let dt = (timestamp - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1;
    lastTime = timestamp;

    // 只在战斗阶段更新敌人和战斗
    if (!state.gameOver && state.phase === 'battle') {
        updateEnemies(dt);
        updateCombat(dt);
        updateWaveSpawning(dt);
    }

    render();
    requestAnimationFrame(gameLoop);
}

/* ============================================================
   SECTION 7 — Enemy Data & Spawning
   数组驱动，新增敌人只需在此数组加一条记录即可。
   key: 唯一标识  name: 中文名
   hp/speed/value/damage/size: 基础属性
   color: 无图片时的几何图形颜色（fallback）
   sprite: 图片路径，null = 使用几何图形
   appearWave: 首次出现波次   ratio: 该波次中占比权重
   ============================================================ */

const ENEMY_CONFIGS = [
    { key: 'grunt',   name: '阿虚',     hp: 30,  speed: 60,  value: 10, damage: 1, size: 10, color: '#fbbf24', sprite: 'images/kyon.png',      flipX: true,  appearWave: 1, ratio: 5 },
    { key: 'runner',  name: '1096',     hp: 22,  speed: 110, value: 15, damage: 1, size: 8,  color: '#38bdf8', sprite: 'images/1096_1.png',    flipX: true,  appearWave: 2, ratio: 3 },
    { key: 'tank',    name: '古泉',     hp: 130, speed: 40,  value: 30, damage: 3, size: 14, color: '#ef4444', sprite: 'images/Koizumi.png',   flipX: true,  appearWave: 4, ratio: 2 },
    { key: 'elite',   name: '有希',     hp: 80, speed: 50,  value: 50, damage: 2, size: 12, color: '#a855f7', sprite: 'images/yuki.png',       flipX: false, appearWave: 6, ratio: 1 },
    { key: 'boss',    name: '凉宫春日', hp: 350, speed: 35, value: 100, damage: 5, size: 20, color: '#ec4899', sprite: 'images/haruhi.png',    flipX: false, appearWave: 5, ratio: 0 },
];

function createEnemy(configIndex, waveNum) {
    const cfg = ENEMY_CONFIGS[configIndex];
    const hpScale = 1 + (waveNum - 1) * 0.20;
    return {
        id: state.nextId++,
        configIndex: configIndex,
        x: CONFIG.DOOR_COL * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
        y: CONFIG.DOOR_ROW * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
        hp: Math.round(cfg.hp * hpScale),
        maxHp: Math.round(cfg.hp * hpScale),
        speed: cfg.speed,
        value: cfg.value,
        damage: cfg.damage,
        size: cfg.size,
        color: cfg.color,
        sprite: cfg.sprite,
        flipX: cfg.flipX || false,
    };
}

function generateWave(waveNum) {
    const pool = [];
    // 根据每类敌人的 appearWave 和 ratio 构建候选池
    for (let i = 0; i < ENEMY_CONFIGS.length; i++) {
        const cfg = ENEMY_CONFIGS[i];
        if (waveNum >= cfg.appearWave && cfg.ratio > 0) {
            for (let j = 0; j < cfg.ratio; j++) {
                pool.push(i);
            }
        }
    }
    // boss 固定出现（波次5和10各来一个）
    const bossIndex = ENEMY_CONFIGS.findIndex(c => c.key === 'boss');
    const totalCount = 3 + Math.floor(waveNum * 1.8);
    const enemies = [];
    if (waveNum % 5 === 0 && bossIndex >= 0) {
        enemies.push(createEnemy(bossIndex, waveNum));
    }
    for (let i = 0; i < totalCount; i++) {
        const idx = pool[Math.floor(Math.random() * pool.length)];
        enemies.push(createEnemy(idx, waveNum));
    }
    // 洗牌
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
    const dm = state.distanceMap;
    if (!dm) return;

    for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];

        // 尚未锁定目标格子，或已到达目标 → 选择新目标
        if (e.targetCol == null || (e.x === e.targetX && e.y === e.targetY)) {
            const curCol = Math.round((e.x - CONFIG.CELL_SIZE / 2) / CONFIG.CELL_SIZE);
            const curRow = Math.round((e.y - CONFIG.CELL_SIZE / 2) / CONFIG.CELL_SIZE);

            // 到达电脑 → 直接失败
            if (curCol === CONFIG.COMPUTER_COL && curRow === CONFIG.COMPUTER_ROW) {
                state.enemies.splice(i, 1);
                endGame(false);
                continue;
            }

            // 找邻居中距离电脑最近的
            let bestNeighbors = [];
            let bestDist = Infinity;
            for (const [dc, dr] of DIRS) {
                const nc = curCol + dc, nr = curRow + dr;
                if (nc < 0 || nc >= CONFIG.GRID_COLS || nr < 0 || nr >= CONFIG.GRID_ROWS) continue;
                if (dm[nr][nc] < 0) continue;
                if (dm[nr][nc] < bestDist) {
                    bestDist = dm[nr][nc];
                    bestNeighbors = [[nc, nr]];
                } else if (dm[nr][nc] === bestDist) {
                    bestNeighbors.push([nc, nr]);
                }
            }

            if (bestNeighbors.length === 0) {
                state.enemies.splice(i, 1);
                continue;
            }

            // 均匀随机选（分叉口平均概率）
            const [tc, tr] = bestNeighbors[Math.floor(Math.random() * bestNeighbors.length)];
            e.targetCol = tc;
            e.targetRow = tr;
            e.targetX = tc * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
            e.targetY = tr * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
        }

        // 向锁定目标移动
        const dx = e.targetX - e.x, dy = e.targetY - e.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const move = e.speed * dt;

        if (d < move + 1) {
            e.x = e.targetX; e.y = e.targetY;
            // 到达目标格——检查是否踩到社员
            for (let ti = state.towers.length - 1; ti >= 0; ti--) {
                if (state.towers[ti].col === e.targetCol && state.towers[ti].row === e.targetRow) {
                    const removed = state.towers.splice(ti, 1)[0];
                    setMessage(`${removed.type.name} 被敌人拿下了！`);
                }
            }
            // 清除目标，下一帧重新选择
            e.targetCol = null;
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
    if (won) {
        setMessage('塔防胜利！返回逃脱战……');
        setTimeout(() => { window.location.href = '/escape/'; }, 1500);
    } else {
        setMessage('敌人碰到了电脑……活动室被凉宫春日占领了……');
        localStorage.removeItem('escapeResume');
        setTimeout(() => { window.location.href = '/defeat/'; }, 2000);
    }
}

/* ============================================================
   SECTION 5 — Tower Data
   ============================================================ */

const DEFAULT_TOWERS = [
    { id: 1, name: '社长',   damage: 20, range: 3.5, cost: 50,  fireRate: 1.0, color: CONFIG.TOWER_COLORS.Archer, sprite: 'images/社长.png',  description: '均衡型，射程远' },
    { id: 2, name: '社员A',  damage: 30, range: 2.5, cost: 80,  fireRate: 0.6, color: CONFIG.TOWER_COLORS.Mage,   sprite: 'images/社员1.png', description: '高伤害，攻速较慢' },
    { id: 3, name: '社员B',  damage: 50, range: 2.0, cost: 120, fireRate: 0.4, color: CONFIG.TOWER_COLORS.Cannon, sprite: 'images/社员2.png', description: '毁灭性打击，射程短' },
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

    if (state.phase === 'barricade') {
        if (canPlaceBarricade(col, row)) {
            state.barricades.add(`${col},${row}`);
            state.barricadesRemaining--;
            updateHUD();
            const remain = state.barricadesRemaining;
            setMessage(remain > 0
                ? `路障已放置。还剩 ${remain} 个。点击「确认路线」开始部署社员。`
                : '路障已用完！点击「确认路线」开始部署社员。');
        } else if (state.barricades.has(`${col},${row}`)) {
            state.barricades.delete(`${col},${row}`);
            state.barricadesRemaining++;
            updateHUD();
            setMessage(`路障已移除。还剩 ${state.barricadesRemaining} 个。`);
        } else {
            setMessage('此处无法放置路障（会堵死通路或已是障碍）。');
        }
    } else if (state.phase === 'deploy' || (state.phase === 'battle' && !state.waveActive)) {
        tryPlaceTower(col, row);
    }
});

btnWave.addEventListener('click', () => {
    if (state.gameOver) return;

    if (state.phase === 'barricade') {
        if (finalizeBarricades()) {
            btnWave.textContent = '开始波次';
        }
        return;
    }

    if (state.phase === 'deploy') {
        if (state.waveActive) {
            setMessage('敌人还在入侵中！');
            return;
        }
        if (state.wave >= CONFIG.TOTAL_WAVES) {
            setMessage('所有波次已经结束！');
            return;
        }
        state.phase = 'battle';
        startWave();
        return;
    }

    if (state.phase === 'battle') {
        if (state.waveActive) {
            setMessage('敌人还在入侵中！');
            return;
        }
        if (state.wave >= CONFIG.TOTAL_WAVES) {
            setMessage('所有波次已经结束！');
            return;
        }
        startWave();
    }
});

// 右键移除路障（仅 barricade 阶段）
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (state.phase !== 'barricade') return;
    const { x, y } = canvasCoords(e);
    const { col, row } = pixelToCell(x, y);
    if (state.barricades.has(`${col},${row}`)) {
        state.barricades.delete(`${col},${row}`);
        state.barricadesRemaining++;
        updateHUD();
        setMessage(`路障已移除。还剩 ${state.barricadesRemaining} 个。`);
    }
});

/* ============================================================
   SECTION 14 — Game Loop & Init
   ============================================================ */

function initGame() {
    updateHUD();
    renderTowerList();
    setMessage(`放置路障（剩 ${state.barricadesRemaining} 个）——点击空格堵路来设计敌人路线。右键可移除。完成后点「确认路线」。`);
    btnWave.textContent = '确认路线';
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

// 停止任何来自故事页的残留音乐
const anyMusic = document.querySelector('audio');
if (anyMusic) { anyMusic.pause(); anyMusic.src = ''; }

// Start
console.log('[TD] Starting game...');
fetchTowers().then(() => {
    console.log('[TD] Towers loaded:', towerTypes.length);
    return loadAllSprites();
}).then(() => {
    console.log('[TD] Sprites ready, starting game loop');
    initGame();
});

