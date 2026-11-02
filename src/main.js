const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// UI Elements
const mainMenu = document.getElementById('main-menu');
const gameUi = document.getElementById('game-ui');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverScreen = document.getElementById('gameover-screen');
const levelEl = document.getElementById('level');
const xpEl = document.getElementById('xp');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const highScoreMenuEl = document.getElementById('high-score-menu');
const recordMsgEl = document.getElementById('record-msg');
const healthBar = document.getElementById('health-bar');
const bossBarContainer = document.getElementById('boss-bar-container');

const bossBar = document.createElement('div');
document.getElementById('boss-bar').replaceWith(bossBar);
bossBar.id = 'boss-bar';
bossBar.style.height = '100%';
bossBar.style.background = '#ffaa00';
bossBar.style.boxShadow = '0 0 10px #ffaa00';
bossBar.style.width = '100%';

const upgradeModal = document.getElementById('upgrade-modal');
const upgradeOptions = document.getElementById('upgrade-options');

// Highscore Management
let highScore = localStorage.getItem('alquimia_highscore') || 0;
highScoreMenuEl.textContent = `RECORDE: ${highScore}`;

let gameState = 'MENU';
let level = 1;
let xp = 0;
let xpToNextLevel = 10;
let score = 0;

let player = {};
let projectiles = [];
let enemies = [];
let xpGems = [];
let activeBoss = null;

const upgradesList = [
  { id: 'fireRate', title: 'OVERCLOCKING', desc: '+20% de taxa de disparo de depuração.' },
  { id: 'multishot', title: 'DISPARO PARALELO', desc: '+1 projétil adicional por ataque.' },
  { id: 'damage', title: 'COMPILADOR PESADO', desc: '+50% de dano por disparo.' },
  { id: 'magnet', title: 'EXPANSÃO DE BUS', desc: '+40% no raio de atração de XP.' },
  { id: 'heal', title: 'PATCH DE SEGURANÇA', desc: 'Restaura 40% da vida total do sistema.' }
];

function initGame() {
  player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 12,
    color: '#00ffcc',
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,
    speed: 0.15,
    maxHp: 100,
    hp: 100,
    fireRate: 30,
    fireCooldown: 0,
    projectileCount: 1,
    damage: 1,
    magnetRange: 120
  };
  projectiles.length = 0;
  enemies.length = 0;
  xpGems.length = 0;
  activeBoss = null;
  level = 1;
  xp = 0;
  xpToNextLevel = 10;
  score = 0;

  levelEl.textContent = level;
  xpEl.textContent = xp;
  scoreEl.textContent = score;
  healthBar.style.width = '100%';
  bossBarContainer.classList.add('hidden');
}

startBtn.onclick = () => {
  mainMenu.classList.add('hidden');
  gameUi.classList.remove('hidden');
  initGame();
  gameState = 'PLAYING';
};

restartBtn.onclick = () => {
  gameOverScreen.classList.add('hidden');
  initGame();
  gameState = 'PLAYING';
};

function handlePointer(e) {
  if (gameState !== 'PLAYING') return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  player.targetX = x;
  player.targetY = y;
}

window.addEventListener('pointerdown', handlePointer);
window.addEventListener('pointermove', (e) => {
  if (e.buttons > 0 || (e.touches && e.touches.length > 0)) {
    handlePointer(e);
  }
});

function spawnEnemy() {
  if (activeBoss) return;
  if (score > 0 && score % 15 === 0 && !activeBoss) {
    activeBoss = {
      x: canvas.width / 2,
      y: -50,
      radius: 28,
      color: '#ffaa00',
      speed: 0.4,
      hp: 40 + level * 15,
      maxHp: 40 + level * 15,
      damage: 30
    };
    bossBarContainer.classList.remove('hidden');
    return;
  }

  if (enemies.length < 8 + level * 2) {
    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -20 : canvas.width + 20;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? -20 : canvas.height + 20;
    }
    const isElite = Math.random() < 0.15;
    enemies.push({
      x, y,
      radius: isElite ? 15 : 10,
      color: isElite ? '#ff00aa' : '#ff0055',
      speed: isElite ? 0.7 : 1 + Math.random() * 0.6,
      hp: isElite ? 5 : 2,
      damage: isElite ? 20 : 10,
      isElite
    });
  }
}

function getNearestEnemy() {
  if (activeBoss) return activeBoss;
  let nearest = null;
  let minDistance = Infinity;
  for (const enemy of enemies) {
    const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = enemy;
    }
  }
  return nearest;
}

function showUpgradeModal() {
  gameState = 'UPGRADE';
  upgradeOptions.innerHTML = '';
  const shuffled = [...upgradesList].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  shuffled.forEach(opt => {
    const card = document.createElement('div');
    card.className = 'upgrade-card';
    card.innerHTML = `<div class="upgrade-title">${opt.title}</div><div class="upgrade-desc">${opt.desc}</div>`;
    card.onclick = () => applyUpgrade(opt.id);
    upgradeOptions.appendChild(card);
  });
  upgradeModal.classList.remove('hidden');
}

function applyUpgrade(type) {
  switch(type) {
    case 'fireRate': player.fireRate = Math.max(10, player.fireRate * 0.8); break;
    case 'multishot': player.projectileCount += 1; break;
    case 'damage': player.damage += 0.5; break;
    case 'magnet': player.magnetRange += 50; break;
    case 'heal':
      player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.4);
      healthBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
      break;
  }
  upgradeModal.classList.add('hidden');
  gameState = 'PLAYING';
}

function update() {
  if (gameState !== 'PLAYING') return;

  player.x += (player.targetX - player.x) * player.speed;
  player.y += (player.targetY - player.y) * player.speed;

  player.fireCooldown++;
  if (player.fireCooldown >= player.fireRate) {
    const target = getNearestEnemy();
    if (target) {
      const baseAngle = Math.atan2(target.y - player.y, target.x - player.x);
      const spread = 0.2;
      for (let i = 0; i < player.projectileCount; i++) {
        const offset = (i - (player.projectileCount - 1) / 2) * spread;
        const angle = baseAngle + offset;
        projectiles.push({
          x: player.x, y: player.y,
          vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8,
          radius: 4, color: '#ffaa00', damage: player.damage
        });
      }
      player.fireCooldown = 0;
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      projectiles.splice(i, 1);
      continue;
    }

    if (activeBoss) {
      const dist = Math.hypot(p.x - activeBoss.x, p.y - activeBoss.y);
      if (dist < p.radius + activeBoss.radius) {
        activeBoss.hp -= p.damage;
        projectiles.splice(i, 1);
        if (activeBoss.hp <= 0) {
          for (let k = 0; k < 5; k++) {
            xpGems.push({ x: activeBoss.x + (Math.random()-0.5)*30, y: activeBoss.y + (Math.random()-0.5)*30, radius: 7, color: '#00ffcc' });
          }
          activeBoss = null;
          bossBarContainer.classList.add('hidden');
          score += 5;
          scoreEl.textContent = score;
        }
        break;
      }
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const dist = Math.hypot(p.x - e.x, p.y - e.y);
      if (dist < p.radius + e.radius) {
        e.hp -= p.damage;
        projectiles.splice(i, 1);
        if (e.hp <= 0) {
          xpGems.push({ x: e.x, y: e.y, radius: e.isElite ? 7 : 5, color: '#00ffcc' });
          enemies.splice(j, 1);
          score++;
          scoreEl.textContent = score;
        }
        break;
      }
    }
  }

  if (activeBoss) {
    const angle = Math.atan2(player.y - activeBoss.y, player.x - activeBoss.x);
    activeBoss.x += Math.cos(angle) * activeBoss.speed;
    activeBoss.y += Math.sin(angle) * activeBoss.speed;
    bossBar.style.width = `${Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100)}%`;

    if (Math.hypot(player.x - activeBoss.x, player.y - activeBoss.y) < player.radius + activeBoss.radius) {
      player.hp -= 0.6;
      healthBar.style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
      if (player.hp <= 0) triggerGameOver();
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const angle = Math.atan2(player.y - e.y, player.x - e.x);
    e.x += Math.cos(angle) * e.speed;
    e.y += Math.sin(angle) * e.speed;

    if (Math.hypot(player.x - e.x, player.y - e.y) < player.radius + e.radius) {
      player.hp -= e.damage;
      healthBar.style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
      enemies.splice(i, 1);
      if (player.hp <= 0) triggerGameOver();
    }
  }

  for (let i = xpGems.length - 1; i >= 0; i--) {
    const g = xpGems[i];
    const dist = Math.hypot(player.x - g.x, player.y - g.y);
    if (dist < player.magnetRange) {
      g.x += (player.x - g.x) * 0.12;
      g.y += (player.y - g.y) * 0.12;
    }
    if (dist < player.radius + g.radius) {
      xpGems.splice(i, 1);
      xp += (g.radius > 6 ? 5 : 2);
      if (xp >= xpToNextLevel) {
        level++;
        xp = 0;
        xpToNextLevel = Math.floor(xpToNextLevel * 1.6);
        levelEl.textContent = level;
        showUpgradeModal();
      }
      xpEl.textContent = xp;
    }
  }

  if (Math.random() < 0.035) spawnEnemy();
}

function triggerGameOver() {
  gameState = 'GAMEOVER';
  gameUi.classList.add('hidden');
  finalScoreEl.textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('alquimia_highscore', highScore);
    recordMsgEl.textContent = 'NOVO RECORDE PESSOAL!';
    recordMsgEl.classList.remove('hidden');
  } else {
    recordMsgEl.classList.add('hidden');
  }

  highScoreMenuEl.textContent = `RECORDE: ${highScore}`;
  gameOverScreen.classList.remove('hidden');
}

function render() {
  ctx.fillStyle = '#161b22';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === 'MENU') return;

  for (const g of xpGems) {
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
    ctx.fillStyle = g.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = g.color;
    ctx.fill();
    ctx.closePath();
  }

  for (const p of projectiles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.fill();
    ctx.closePath();
  }

  for (const e of enemies) {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fillStyle = e.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = e.color;
    ctx.fill();
    ctx.closePath();
  }

  if (activeBoss) {
    ctx.beginPath();
    ctx.arc(activeBoss.x, activeBoss.y, activeBoss.radius, 0, Math.PI * 2);
    ctx.fillStyle = activeBoss.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffaa00';
    ctx.fill();
    ctx.closePath();
  }

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.shadowBlur = 14;
  ctx.shadowColor = player.color;
  ctx.fill();
  ctx.closePath();

  ctx.shadowBlur = 0;
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
