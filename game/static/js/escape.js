// ── 柏林噪声引擎（同 escaping 项目） ──
const PERM = new Uint8Array(512);
const GRAD = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];

function seedPermutation(seed) {
    const arr = [];
    for (let i = 0; i < 256; i++) arr[i] = i;
    let s = seed;
    for (let i = 255; i > 0; i--) {
        s = (s * 16807 + 0) % 2147483647;
        const j = s % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    for (let i = 0; i < 512; i++) PERM[i] = arr[i & 255];
}

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }

function dotGrid(ix, iy, x, y) {
    const idx = PERM[PERM[ix & 255] + (iy & 255)] % 8;
    const [gx, gy] = GRAD[idx];
    return gx * (x - ix) + gy * (y - iy);
}

function perlin2D(x, y) {
    const ix0 = Math.floor(x), iy0 = Math.floor(y);
    const ix1 = ix0 + 1, iy1 = iy0 + 1;
    const sx = fade(x - ix0), sy = fade(y - iy0);
    const n0 = dotGrid(ix0, iy0, x, y);
    const n1 = dotGrid(ix1, iy0, x, y);
    const n2 = dotGrid(ix0, iy1, x, y);
    const n3 = dotGrid(ix1, iy1, x, y);
    return lerp(lerp(n0, n1, sx), lerp(n2, n3, sx), sy);
}

function fbm(x, y, octaves) {
    let val = 0, amp = 1, freq = 1, total = 0;
    for (let i = 0; i < octaves; i++) {
        val += amp * perlin2D(x * freq, y * freq);
        total += amp;
        amp *= 0.5; freq *= 2;
    }
    return val / total;
}

// ── 配置 ──
const CONFIG = {
    WORLD_W: 3200, WORLD_H: 3200,
    VIEW_W: 800, VIEW_H: 560,
    PLAYER_SPEED: 2.5,
    HQ_X: 1600, HQ_Y: 1600,    // 总部在中心
    CATCH_DIST: 28,
};

// ── Canvas ──
const canvas = document.getElementById('game');
canvas.width = CONFIG.VIEW_W; canvas.height = CONFIG.VIEW_H;
const ctx = canvas.getContext('2d');

const minimap = document.getElementById('minimap');
const mctx = minimap.getContext('2d');
const msgEl = document.getElementById('msg');

// 预生成地形缓存（噪声计算昂贵，缓存到低分辨率网格）
const TERRAIN_RES = 4;  // 每4像素采样一次
const tCols = Math.ceil(CONFIG.WORLD_W / TERRAIN_RES);
const tRows = Math.ceil(CONFIG.WORLD_H / TERRAIN_RES);
const terrainCache = new Float32Array(tCols * tRows);

seedPermutation(Date.now() % 2147483647);

function buildTerrain() {
    const freq = 0.0015;  // 极低频 → 大块
    for (let ty = 0; ty < tRows; ty++) {
        for (let tx = 0; tx < tCols; tx++) {
            const wx = tx * TERRAIN_RES, wy = ty * TERRAIN_RES;

            // 低频fbm → 基底
            const macro = fbm(wx * freq, wy * freq, 2);

            // 山脊噪声：零点附近 = 路线（亮），远离零点 = 障碍（暗）
            const ridgeRaw = fbm(wx * freq * 1.8 + 5.7, wy * freq * 1.8 + 3.1, 2);
            const ridge = 1.0 - 2.2 * Math.abs(ridgeRaw);

            // 各半混合
            const val = macro * 0.5 + ridge * 0.5;

            // 强化对比度：把中间值推向两极
            const sharpened = Math.tanh(val * 1.8);

            terrainCache[ty * tCols + tx] = Math.max(-1, Math.min(1, sharpened));
        }
    }
}

function sampleTerrain(wx, wy) {
    const tx = Math.floor(wx / TERRAIN_RES), ty = Math.floor(wy / TERRAIN_RES);
    if (tx < 0 || ty < 0 || tx >= tCols || ty >= tRows) return 0;
    return terrainCache[ty * tCols + tx];
}

// 噪声 → 速度倍率（-1=深色/慢, 1=浅色/快）
function speedMultiplier(noiseVal) {
    // 暗区极慢、亮区快：[-1, 1] → [0.1, 1.7]
    return 0.12 + (noiseVal + 1) / 2 * 1.55;
}

// ── 游戏状态 ──
let gameState = 'playing', keys = {};
let isReturning = false;
const player = {
    x: 2800, y: 2800, size: 14, speed: CONFIG.PLAYER_SPEED,
    color: '#FFD700', hasComputer: false
};

const computer = { x: 0, y: 0, picked: false };

const resumeData = JSON.parse(localStorage.getItem('escapeResume') || 'null');
localStorage.removeItem('escapeResume');  // 只恢复一次

if (resumeData) {
    isReturning = true;
    // 恢复玩家和电脑的状态
    player.x = resumeData.playerX;
    player.y = resumeData.playerY;
    player.hasComputer = resumeData.hasComputer;
    computer.x = resumeData.computerX;
    computer.y = resumeData.computerY;
    computer.picked = resumeData.computerPicked;
    // 不恢复追兵位置，让它们重新生成
    // 重置游戏状态为playing
    gameState = 'playing';
}

function randomSpawn(minDist, preferTerrain) {
    for (let tries = 0; tries < 200; tries++) {
        const x = 200 + Math.random() * (CONFIG.WORLD_W - 400);
        const y = 200 + Math.random() * (CONFIG.WORLD_H - 400);
        if (Math.hypot(x - player.x, y - player.y) > minDist) {
            if (!preferTerrain) return { x, y };
            const n = sampleTerrain(x, y);
            if (n < 0.4) return { x, y };
        }
    }
    return { x: 200 + Math.random() * 2800, y: 200 + Math.random() * 2800 };
}

// ── 路标系统 ──
const ATTRACTOR_COUNT = 12;
const attractors = [];
for (let i = 0; i < ATTRACTOR_COUNT; i++) {
    const p = randomSpawn(100, false);
    attractors.push({ x: p.x, y: p.y });
}

// ── 追兵 ──
function spawnChaser(name, color, speed, personality, nearPlayer) {
    const dist = nearPlayer ? 300 + Math.random() * 400 : 600;
    const pos = randomSpawn(dist, false);
    return {
        name, color, size: 14,
        x: pos.x, y: pos.y,
        baseSpeed: speed, angle: Math.random() * Math.PI * 2,
        personality, timer: 0, stuckTimer: 0,
        attractorIdx: Math.floor(Math.random() * ATTRACTOR_COUNT),
    };
}

// 塔防胜利后返回时，追兵生成在离玩家较远的位置（800-1200像素）
const chasers = [
    spawnChaser('凉宫春日', '#FF69B4', 3.0, 'hunter',     false),
    spawnChaser('阿虚',     '#00CED1', 1.6, 'reluctant',  false),
    spawnChaser('学姐',     '#FF4500', 2.4, 'interceptor', false),
];

// 塔防胜利后，追兵位置重新生成，不恢复之前的位置

// 电脑：非恢复模式下随机放置
if (!resumeData) {
    const p = randomSpawn(500, true);
    computer.x = p.x; computer.y = p.y;
}

if (isReturning) {
    msgEl.textContent = '塔防胜利！继续逃脱……';
}

// ── 输入 ──
window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === ' ') { e.preventDefault(); interact(); }
    if (e.key === 'r' || e.key === 'R') location.reload();
});
window.addEventListener('keyup', e => keys[e.key] = false);

function interact() {
    if (gameState !== 'playing') return;
    if (!player.hasComputer && Math.hypot(player.x - computer.x, player.y - computer.y) < 40) {
        computer.picked = true; player.hasComputer = true;
        msgEl.textContent = '拾取成功！快回总部(地图中心)！';
    }
    if (player.hasComputer && Math.hypot(player.x - CONFIG.HQ_X, player.y - CONFIG.HQ_Y) < 40) {
        gameState = 'win'; msgEl.textContent = 'WIN! 成功锁门！';
        setTimeout(() => { window.location.href = '/victory/'; }, 1500);
    }
}

// ── 移动 ──
function calcSpeed(base, wx, wy) {
    return base * speedMultiplier(sampleTerrain(wx, wy));
}

function updatePlayer() {
    if (gameState !== 'playing') return;
    let dx = 0, dy = 0;
    if (keys['ArrowLeft']  || keys['a'] || keys['A']) dx = -1;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) dx = 1;
    if (keys['ArrowUp']    || keys['w'] || keys['W']) dy = -1;
    if (keys['ArrowDown']  || keys['s'] || keys['S']) dy = 1;
    if (dx === 0 && dy === 0) return;

    const len = Math.sqrt(dx * dx + dy * dy);
    const spd = calcSpeed(player.speed, player.x, player.y);
    const mx = (dx / len) * spd, my = (dy / len) * spd;

    player.x = Math.max(10, Math.min(CONFIG.WORLD_W - 10, player.x + mx));
    player.y = Math.max(10, Math.min(CONFIG.WORLD_H - 10, player.y + my));
}

function probeTerrain(cx, cy, angle, dist) {
    // 沿 angle 方向探测 dist 距离内的平均地形值
    let sum = 0; const steps = 5;
    for (let i = 1; i <= steps; i++) {
        const px = cx + Math.cos(angle) * (dist * i / steps);
        const py = cy + Math.sin(angle) * (dist * i / steps);
        sum += sampleTerrain(px, py);
    }
    return sum / steps;
}

function steerAround(c, targetAngle, probeDist) {
    // 探测左/中/右哪个方向地形最亮（最通畅）
    const left  = probeTerrain(c.x, c.y, targetAngle - 0.8, probeDist);
    const mid   = probeTerrain(c.x, c.y, targetAngle,        probeDist);
    const right = probeTerrain(c.x, c.y, targetAngle + 0.8, probeDist);

    if (mid >= left && mid >= right)  return targetAngle;
    if (left >= right)                return targetAngle - 0.6;
    return targetAngle + 0.6;
}

function updateChasers() {
    if (gameState !== 'playing') return;
    const chasing = player.hasComputer;

    chasers.forEach(c => {
        const spd = calcSpeed(c.baseSpeed, c.x, c.y);
        c.timer--;
        c.stuckTimer--;

        // ── 决策方向 ──
        if (chasing) {
            // 追猎模式：全局追踪玩家
            const toPlayer = Math.atan2(player.y - c.y, player.x - c.x);

            if (c.personality === 'interceptor' && c.timer <= 0) {
                c.timer = 30;
                // 预判拦截
                const px = player.x + (player.x - c.x) * 0.6;
                const py = player.y + (player.y - c.y) * 0.6;
                c.angle = Math.atan2(py - c.y, px - c.x);
            } else if (c.personality === 'reluctant') {
                c.angle = toPlayer;
                if (c.timer <= 0) { c.timer = 50; c.angle += (Math.random() - 0.5) * 0.5; }
            } else {
                c.angle = toPlayer;
            }

            // 地形感知绕障：探测前方，如果暗 → 左右找亮路
            if (c.stuckTimer <= 0) {
                const ahead = probeTerrain(c.x, c.y, c.angle, 50);
                if (ahead < -0.2) {
                    c.angle = steerAround(c, c.angle, 50);
                    c.stuckTimer = 10;
                }
            }
        } else {
            // 巡逻模式：沿路标点移动
            const at = attractors[c.attractorIdx];
            const distToAt = Math.hypot(at.x - c.x, at.y - c.y);
            if (distToAt < 80) {
                // 到达路标 → 换下一个
                c.attractorIdx = Math.floor(Math.random() * ATTRACTOR_COUNT);
            }
            c.angle = Math.atan2(at.y - c.y, at.x - c.x);

            // 也用射线探测绕障碍
            if (c.stuckTimer <= 0) {
                const ahead = probeTerrain(c.x, c.y, c.angle, 40);
                if (ahead < -0.2) {
                    c.angle = steerAround(c, c.angle, 40);
                    c.stuckTimer = 15;
                }
            }
        }

        // ── 移动 ──
        const nx = c.x + Math.cos(c.angle) * spd;
        const ny = c.y + Math.sin(c.angle) * spd;
        c.x = Math.max(10, Math.min(CONFIG.WORLD_W - 10, nx));
        c.y = Math.max(10, Math.min(CONFIG.WORLD_H - 10, ny));

        // ── 捕获判定 ──
        if (chasing && Math.hypot(player.x - c.x, player.y - c.y) < CONFIG.CATCH_DIST) {
            gameState = 'lose';
            msgEl.textContent = `被${c.name}抓住了！进入塔防战……`;
            // 保存状态到 localStorage
            localStorage.setItem('escapeResume', JSON.stringify({
                playerX: player.x, playerY: player.y,
                hasComputer: player.hasComputer,
                computerX: computer.x, computerY: computer.y,
                computerPicked: computer.picked,
                chasers: chasers.map(c => ({ x: c.x, y: c.y })),
            }));
            setTimeout(() => { window.location.href = '/battle/'; }, 1500);
        }
    });
}

// ── 渲染 ──
let camX = 0, camY = 0;

function updateCamera() {
    camX = player.x - CONFIG.VIEW_W / 2;
    camY = player.y - CONFIG.VIEW_H / 2;
    camX = Math.max(0, Math.min(CONFIG.WORLD_W - CONFIG.VIEW_W, camX));
    camY = Math.max(0, Math.min(CONFIG.WORLD_H - CONFIG.VIEW_H, camY));
}

function draw() {
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, CONFIG.VIEW_W, CONFIG.VIEW_H);

    const step = TERRAIN_RES;
    const startTX = Math.floor(camX / step), startTY = Math.floor(camY / step);
    const endTX = Math.ceil((camX + CONFIG.VIEW_W) / step);
    const endTY = Math.ceil((camY + CONFIG.VIEW_H) / step);

    for (let ty = startTY; ty <= endTY; ty++) {
        for (let tx = startTX; tx <= endTX; tx++) {
            if (tx < 0 || ty < 0 || tx >= tCols || ty >= tRows) continue;
            const val = terrainCache[ty * tCols + tx];
            const gray = Math.floor((val + 1) / 2 * 255);
            ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
            const sx = tx * step - camX, sy = ty * step - camY;
            ctx.fillRect(sx, sy, step + 1, step + 1);
        }
    }

    // 总部
    const hqx = CONFIG.HQ_X - camX, hqy = CONFIG.HQ_Y - camY;
    if (hqx > -20 && hqx < CONFIG.VIEW_W + 20) {
        ctx.fillStyle = '#4B0082'; ctx.fillRect(hqx - 15, hqy - 15, 30, 30);
        ctx.fillStyle = '#fff'; ctx.font = '10px monospace';
        ctx.fillText('HQ', hqx - 10, hqy + 4);
    }

    // 电脑
    if (!computer.picked) {
        const cx = computer.x - camX, cy = computer.y - camY;
        if (cx > -20 && cx < CONFIG.VIEW_W + 20) {
            ctx.fillStyle = '#4169E1'; ctx.fillRect(cx - 10, cy - 10, 20, 20);
            ctx.fillStyle = '#fff'; ctx.font = '9px monospace';
            ctx.fillText('PC', cx - 8, cy + 4);
        }
    }

    // 追兵
    chasers.forEach(c => {
        const sx = c.x - camX, sy = c.y - camY;
        if (sx < -20 || sx > CONFIG.VIEW_W + 20 || sy < -20 || sy > CONFIG.VIEW_H + 20) return;
        ctx.fillStyle = c.color; ctx.fillRect(sx - c.size / 2, sy - c.size / 2, c.size, c.size);
        ctx.fillStyle = '#fff'; ctx.font = '10px monospace';
        ctx.fillText(c.name, sx - c.size / 2, sy - c.size / 2 - 2);
    });

    // 玩家
    const px = player.x - camX, py = player.y - camY;
    ctx.fillStyle = player.color; ctx.fillRect(px - player.size / 2, py - player.size / 2, player.size, player.size);
    if (player.hasComputer) {
        ctx.strokeStyle = '#4169E1'; ctx.lineWidth = 2;
        ctx.strokeRect(px - player.size / 2 - 2, py - player.size / 2 - 2, player.size + 4, player.size + 4);
    }

    // 小地图
    mctx.fillStyle = '#000'; mctx.fillRect(0, 0, 160, 160);
    const ms = 160 / CONFIG.WORLD_W;
    mctx.fillStyle = '#fff';
    mctx.fillRect(player.x * ms - 1, player.y * ms - 1, 3, 3);
    mctx.fillStyle = '#4B0082'; mctx.fillRect(CONFIG.HQ_X * ms - 2, CONFIG.HQ_Y * ms - 2, 5, 5);
    if (!computer.picked) {
        mctx.fillStyle = '#4169E1'; mctx.fillRect(computer.x * ms - 1, computer.y * ms - 1, 3, 3);
    }
    chasers.forEach(c => {
        mctx.fillStyle = c.color; mctx.fillRect(c.x * ms - 1, c.y * ms - 1, 2, 2);
    });
}

// ── 游戏循环 ──
function gameLoop() {
    updatePlayer(); updateChasers(); updateCamera(); draw();
    if (gameState === 'win') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, CONFIG.VIEW_W, CONFIG.VIEW_H);
        ctx.fillStyle = '#0F0'; ctx.font = 'bold 36px monospace';
        ctx.fillText('YOU WIN!', CONFIG.VIEW_W / 2 - 100, CONFIG.VIEW_H / 2);
    } else if (gameState === 'lose') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, CONFIG.VIEW_W, CONFIG.VIEW_H);
        ctx.fillStyle = '#F00'; ctx.font = 'bold 36px monospace';
        ctx.fillText('GAME OVER', CONFIG.VIEW_W / 2 - 120, CONFIG.VIEW_H / 2);
    }
    requestAnimationFrame(gameLoop);
}

// ── 启动 ──
console.log('[NoiseEscape] Building terrain...');
buildTerrain();
console.log('[NoiseEscape] World ready:', CONFIG.WORLD_W, 'x', CONFIG.WORLD_H);
msgEl.textContent = '方向键移动，空格拾取电脑。地形越暗走得越慢！';
gameLoop();
