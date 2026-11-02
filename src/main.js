// ALQUIMIA DOS ERROS - SISTEMA COMPLETO EXPANDIDO
class Game {
  constructor() {
    this.player = {
      level: 1, xp: 0, xpToNext: 50, hp: 100, maxHp: 100, atk: 15, def: 5, bits: 0,
      class: null, dodgeChance: 0.05, critChance: 0.1, regen: 0
    };
    this.inventory = { syntaxError: 0, nullPointer: 0, memoryLeak: 0, potions: { heal: 2, buffAtk: 1, shield: 1 } };
    this.upgrades = { maxHp: 0, atk: 0, crit: 0 };
    this.talents = { hacker: 0, engenheiro: 0, arquiteto: 0 };
    this.achievements = {
      firstKill: { name: "Primeiro Bug Purificado", unlocked: false, desc: "+5 ATK" },
      alchemist: { name: "Mestre Alquimista", unlocked: false, desc: "+20 HP Máx" },
      rich: { name: "Investidor de Bits", unlocked: false, desc: "+5% Crítico" }
    };
    this.currentEnemy = null;
    this.stage = 1;
    this.init();
  }

  init() {
    console.log("Alquimia dos Erros - Motor Roguelite Expandido Carregado");
    this.spawnEnemy();
  }

  spawnEnemy() {
    const names = ["Bug de Sintaxe", "Erro de Memória", "Null Pointer Exception", "Stack Overflow", "BOSS: Kernel Panic"];
    const isBoss = this.stage % 5 === 0;
    const name = isBoss ? names[4] : names[Math.floor(Math.random() * 4)];
    this.currentEnemy = {
      name: name,
      hp: (30 + this.stage * 15) * (isBoss ? 2.5 : 1),
      maxHp: (30 + this.stage * 15) * (isBoss ? 2.5 : 1),
      atk: (8 + this.stage * 4) * (isBoss ? 1.5 : 1),
      isBoss: isBoss
    };
  }

  craftPotion(type) {
    if (type === 'heal' && this.inventory.syntaxError >= 2) {
      this.inventory.syntaxError -= 2;
      this.inventory.potions.heal++;
      return true;
    }
    if (type === 'buffAtk' && this.inventory.nullPointer >= 2) {
      this.inventory.nullPointer -= 2;
      this.inventory.potions.buffAtk++;
      return true;
    }
    if (type === 'shield' && this.inventory.memoryLeak >= 2) {
      this.inventory.memoryLeak -= 2;
      this.inventory.potions.shield++;
      return true;
    }
    return false;
  }

  buyUpgrade(type) {
    const cost = (this.upgrades[type] + 1) * 50;
    if (this.player.bits >= cost) {
      this.player.bits -= cost;
      this.upgrades[type]++;
      if (type === 'maxHp') { this.player.maxHp += 20; this.player.hp += 20; }
      if (type === 'atk') { this.player.atk += 5; }
      if (type === 'crit') { this.player.critChance += 0.05; }
      return true;
    }
    return false;
  }

  selectTalent(path) {
    if (this.talents[path] < 5) {
      this.talents[path]++;
      if (path === 'hacker') this.player.dodgeChance += 0.05;
      if (path === 'engenheiro') this.player.atk += 8;
      if (path === 'arquiteto') this.player.regen += 2;
      return true;
    }
    return false;
  }

  checkAchievements() {
    if (this.stage > 1 && !this.achievements.firstKill.unlocked) {
      this.achievements.firstKill.unlocked = true;
      this.player.atk += 5;
    }
    if ((this.inventory.potions.heal + this.inventory.potions.buffAtk + this.inventory.potions.shield) >= 5 && !this.achievements.alchemist.unlocked) {
      this.achievements.alchemist.unlocked = true;
      this.player.maxHp += 20;
    }
    if (this.player.bits >= 200 && !this.achievements.rich.unlocked) {
      this.achievements.rich.unlocked = true;
      this.player.critChance += 0.05;
    }
  }
}

window.gameInstance = new Game();
