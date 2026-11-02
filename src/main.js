class Game {
  constructor() {
    this.player = {
      level: 1, xp: 0, xpToNext: 50, hp: 100, maxHp: 100, atk: 15, def: 5, bits: 0,
      dodgeChance: 0.05, critChance: 0.1, regen: 0
    };
    this.inventory = { syntaxError: 0, nullPointer: 0, memoryLeak: 0, potions: { heal: 2, buffAtk: 1, shield: 1 } };
    this.currentEnemy = null;
    this.stage = 1;
    this.initUI();
  }

  initUI() {
    const btn = document.querySelector('button, .btn, #start-btn') || document.querySelector('div[style*="border"]');
    if (btn) {
      btn.style.cursor = 'pointer';
      btn.onclick = () => this.startGame();
    }
  }

  startGame() {
    console.log("Jogo Iniciado!");
    this.spawnEnemy();
    this.renderGameScreen();
  }

  spawnEnemy() {
    const names = ["Bug de Sintaxe", "Erro de Memória", "Null Pointer Exception", "Stack Overflow", "BOSS: Kernel Panic"];
    const isBoss = this.stage % 5 === 0;
    this.currentEnemy = {
      name: isBoss ? names[4] : names[Math.floor(Math.random() * 4)],
      hp: (30 + this.stage * 15) * (isBoss ? 2.5 : 1),
      maxHp: (30 + this.stage * 15) * (isBoss ? 2.5 : 1),
      atk: (8 + this.stage * 4) * (isBoss ? 1.5 : 1),
      isBoss: isBoss
    };
  }

  renderGameScreen() {
    document.body.innerHTML = `
      <div style="background:#0b0f19; color:#00ffcc; font-family:monospace; padding:20px; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <h2 style="text-shadow: 0 0 10px #00ffcc;">ALQUIMIA DOS ERROS - NÍVEL ${this.stage}</h2>
        <div style="border: 2px solid #00ffcc; padding:15px; border-radius:10px; width:90%; max-width:400px; margin-bottom:20px; background:#111827;">
          <p>❤️ HP: ${this.player.hp} / ${this.player.maxHp}</p>
          <p>⚡ ATK: ${this.player.atk} | 💰 Bits: ${this.player.bits}</p>
          <hr style="border-color:#00ffcc; opacity:0.3;">
          <h3 style="color:#ff5555;">Inimigo: ${this.currentEnemy.name}</h3>
          <p>❤️ HP Inimigo: Math.round(${this.currentEnemy.hp})</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
          <button onclick="window.gameInstance.attackEnemy()" style="background:#00ffcc; color:#0b0f19; border:none; padding:10px 20px; font-weight:bold; border-radius:5px; cursor:pointer;">Atacar</button>
          <button onclick="window.gameInstance.usePotion()" style="background:#3b82f6; color:#fff; border:none; padding:10px 20px; font-weight:bold; border-radius:5px; cursor:pointer;">Usar Poção</button>
        </div>
      </div>
    `;
  }

  attackEnemy() {
    this.currentEnemy.hp -= this.player.atk;
    if (this.currentEnemy.hp <= 0) {
      alert("Inimigo derrotado! Ganhou 20 Bits e 25 XP.");
      this.player.bits += 20;
      this.stage++;
      this.spawnEnemy();
    } else {
      this.player.hp -= this.currentEnemy.atk;
      if (this.player.hp <= 0) {
        alert("Game Over! O sistema crashou.");
        location.reload();
        return;
      }
    }
    this.renderGameScreen();
  }

  usePotion() {
    if (this.inventory.potions.heal > 0) {
      this.inventory.potions.heal--;
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 40);
      alert("Poção usada! HP recuperado.");
      this.renderGameScreen();
    } else {
      alert("Sem poções de cura disponíveis!");
    }
  }
}

window.gameInstance = new Game();
