(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();class a{constructor(){this.player={level:1,xp:0,xpToNext:50,hp:100,maxHp:100,atk:15,def:5,bits:0,dodgeChance:.05,critChance:.1,regen:0},this.inventory={syntaxError:2,nullPointer:1,memoryLeak:1,potions:{heal:3,buffAtk:1,shield:1}},this.upgrades={maxHp:0,atk:0,crit:0},this.talents={hacker:0,engenheiro:0,arquiteto:0},this.achievements={firstKill:{name:"Primeiro Bug Purificado",unlocked:!1,desc:"+5 ATK"},alchemist:{name:"Mestre Alquimista",unlocked:!1,desc:"+20 HP Máx"},rich:{name:"Investidor de Bits",unlocked:!1,desc:"+5% Crítico"}},this.currentEnemy=null,this.stage=1,this.activeTab="combat",this.logs=["Sistema iniciado. Boa sorte na depuração!"],this.initUI()}initUI(){this.spawnEnemy(),this.render()}spawnEnemy(){const e=["Bug de Sintaxe","Erro de Memória","Null Pointer Exception","Stack Overflow","BOSS: Kernel Panic"],t=this.stage%5===0,n=(30+this.stage*15)*(t?2.5:1);this.currentEnemy={name:t?e[4]:e[Math.floor(Math.random()*4)],hp:Math.round(n),maxHp:Math.round(n),atk:Math.round((8+this.stage*4)*(t?1.5:1)),isBoss:t}}log(e){this.logs.unshift(e),this.logs.length>4&&this.logs.pop()}setTab(e){this.activeTab=e,this.render()}attackEnemy(){const e=Math.random()<this.player.critChance;let t=this.player.atk;if(e&&(t*=2),this.currentEnemy.hp-=t,this.log(`Causou ${t} de dano no ${this.currentEnemy.name}${e?" (CRÍTICO!)":""}.`),this.currentEnemy.hp<=0){const n=20+this.stage*5,i=25+this.stage*5;this.player.bits+=n,this.player.xp+=i;const o=Math.random();o<.4?this.inventory.syntaxError++:o<.7?this.inventory.nullPointer++:this.inventory.memoryLeak++,this.log(`✨ Derrotou ${this.currentEnemy.name}! +${n} Bits, +${i} XP.`),this.checkLevelUp(),this.checkAchievements(),this.stage++,this.spawnEnemy(),this.render();return}if(Math.random()<this.player.dodgeChance)this.log(`💨 Esquivou-se do ataque de ${this.currentEnemy.name}!`);else{const n=Math.max(1,this.currentEnemy.atk-this.player.def);this.player.hp-=n,this.log(`💥 ${this.currentEnemy.name} causou ${n} de dano.`)}if(this.player.regen>0&&(this.player.hp=Math.min(this.player.maxHp,this.player.hp+this.player.regen)),this.player.hp<=0){alert("❌ GAME OVER! O sistema crashou."),location.reload();return}this.render()}usePotion(e){this.inventory.potions[e]>0&&(this.inventory.potions[e]--,e==="heal"?(this.player.hp=Math.min(this.player.maxHp,this.player.hp+50),this.log("🧪 Poção usada: +50 HP recuperado!")):e==="buffAtk"?(this.player.atk+=10,this.log("🧪 Poção usada: +10 ATK Permanente!")):e==="shield"&&(this.player.def+=5,this.log("🧪 Poção usada: +5 DEF Permanente!")),this.render())}craftPotion(e){e==="heal"&&this.inventory.syntaxError>=2?(this.inventory.syntaxError-=2,this.inventory.potions.heal++,this.log("⚗️ Criou 1x Poção de Cura!")):e==="buffAtk"&&this.inventory.nullPointer>=2?(this.inventory.nullPointer-=2,this.inventory.potions.buffAtk++,this.log("⚗️ Criou 1x Poção de Dano!")):e==="shield"&&this.inventory.memoryLeak>=2?(this.inventory.memoryLeak-=2,this.inventory.potions.shield++,this.log("⚗️ Criou 1x Poção de Escudo!")):this.log("⚠️ Reagentes insuficientes para criar poção!"),this.render()}buyUpgrade(e){const t=(this.upgrades[e]+1)*40;this.player.bits>=t&&(this.player.bits-=t,this.upgrades[e]++,e==="maxHp"&&(this.player.maxHp+=20,this.player.hp+=20),e==="atk"&&(this.player.atk+=4),e==="crit"&&(this.player.critChance+=.05),this.log("🛍️ Melhoria comprada!"),this.checkAchievements()),this.render()}selectTalent(e){this.talents[e]<5&&(this.talents[e]++,e==="hacker"&&(this.player.dodgeChance+=.04),e==="engenheiro"&&(this.player.atk+=6),e==="arquiteto"&&(this.player.regen+=2),this.log("⭐ Talento aprimorado!")),this.render()}checkLevelUp(){this.player.xp>=this.player.xpToNext&&(this.player.level++,this.player.xp-=this.player.xpToNext,this.player.xpToNext=Math.round(this.player.xpToNext*1.5),this.player.maxHp+=15,this.player.hp=this.player.maxHp,this.player.atk+=3,this.log(`🎉 SUBIU PARA O NÍVEL ${this.player.level}! Status aumentados.`))}checkAchievements(){this.stage>1&&!this.achievements.firstKill.unlocked&&(this.achievements.firstKill.unlocked=!0,this.player.atk+=5,this.log(`🏆 Conquista: ${this.achievements.firstKill.name}! (+5 ATK)`)),this.inventory.potions.heal+this.inventory.potions.buffAtk+this.inventory.potions.shield>=5&&!this.achievements.alchemist.unlocked&&(this.achievements.alchemist.unlocked=!0,this.player.maxHp+=20,this.player.hp+=20,this.log(`🏆 Conquista: ${this.achievements.alchemist.name}! (+20 HP Máx)`)),this.player.bits>=200&&!this.achievements.rich.unlocked&&(this.achievements.rich.unlocked=!0,this.player.critChance+=.05,this.log(`🏆 Conquista: ${this.achievements.rich.name}! (+5% Crítico)`))}render(){const e=this.player;this.currentEnemy,document.body.innerHTML=`
      <div style="background:#090d16; color:#00ffcc; font-family:'Courier New', monospace; padding:15px; min-height:100vh; max-width:500px; margin:0 auto; box-sizing:border-box;">
        <h2 style="text-align:center; text-shadow:0 0 10px #00ffcc; margin-top:5px;">ALQUIMIA DOS ERROS</h2>
        
        <!-- Status Bar -->
        <div style="background:#111827; border:1px solid #00ffcc; border-radius:8px; padding:10px; margin-bottom:12px; font-size:13px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Nível ${e.level} (XP: ${e.xp}/${e.xpToNext})</span>
            <span>💰 Bits: <b>${e.bits}</b></span>
          </div>
          <div style="margin-top:5px;">❤️ HP: <b>${e.hp}/${e.maxHp}</b> | ⚡ ATK: <b>${e.atk}</b> | 🛡️ DEF: <b>${e.def}</b></div>
          <div style="margin-top:3px; font-size:11px; color:#a7f3d0;">🎯 Crítico: ${(e.critChance*100).toFixed(0)}% | 💨 Esquiva: ${(e.dodgeChance*100).toFixed(0)}% | 🔄 Regen: ${e.regen}/turno</div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display:flex; gap:4px; margin-bottom:12px;">
          <button onclick="window.gameInstance.setTab('combat')" style="flex:1; padding:8px 2px; font-size:11px; font-weight:bold; background:${this.activeTab==="combat"?"#00ffcc":"#1f2937"}; color:${this.activeTab==="combat"?"#000":"#fff"}; border:none; border-radius:4px; cursor:pointer;">Combate</button>
          <button onclick="window.gameInstance.setTab('alchemy')" style="flex:1; padding:8px 2px; font-size:11px; font-weight:bold; background:${this.activeTab==="alchemy"?"#00ffcc":"#1f2937"}; color:${this.activeTab==="alchemy"?"#000":"#fff"}; border:none; border-radius:4px; cursor:pointer;">Alquimia</button>
          <button onclick="window.gameInstance.setTab('shop')" style="flex:1; padding:8px 2px; font-size:11px; font-weight:bold; background:${this.activeTab==="shop"?"#00ffcc":"#1f2937"}; color:${this.activeTab==="shop"?"#000":"#fff"}; border:none; border-radius:4px; cursor:pointer;">Loja</button>
          <button onclick="window.gameInstance.setTab('talents')" style="flex:1; padding:8px 2px; font-size:11px; font-weight:bold; background:${this.activeTab==="talents"?"#00ffcc":"#1f2937"}; color:${this.activeTab==="talents"?"#000":"#fff"}; border:none; border-radius:4px; cursor:pointer;">Talentos</button>
          <button onclick="window.gameInstance.setTab('achievements')" style="flex:1; padding:8px 2px; font-size:11px; font-weight:bold; background:${this.activeTab==="achievements"?"#00ffcc":"#1f2937"}; color:${this.activeTab==="achievements"?"#000":"#fff"}; border:none; border-radius:4px; cursor:pointer;">Troféus</button>
        </div>

        <!-- Dynamic Content -->
        <div style="background:#111827; border:1px solid #374151; border-radius:8px; padding:12px; min-height:220px;">
          ${this.renderTabContent()}
        </div>

        <!-- Terminal Log -->
        <div style="margin-top:12px; background:#000; border:1px solid #1f2937; border-radius:6px; padding:8px; font-size:11px; color:#10b981; height:70px; overflow-hidden;">
          ${this.logs.map(t=>`<div>> ${t}</div>`).join("")}
        </div>
      </div>
    `}renderTabContent(){this.player;const e=this.currentEnemy;if(this.activeTab==="combat")return`
        <div style="text-align:center;">
          <h3 style="color:${e.isBoss?"#ef4444":"#f59e0b"}; margin:0 0 5px 0;">Fase ${this.stage}: ${e.name}</h3>
          <div style="font-size:14px; margin-bottom:10px;">❤️ HP Inimigo: <b>${Math.max(0,e.hp)}</b> / ${e.maxHp}</div>
          <button onclick="window.gameInstance.attackEnemy()" style="width:100%; background:#00ffcc; color:#000; font-weight:bold; padding:12px; border:none; border-radius:6px; font-size:15px; margin-bottom:10px; cursor:pointer;">⚔️ ATACAR</button>
          <div style="display:flex; gap:5px;">
            <button onclick="window.gameInstance.usePotion('heal')" style="flex:1; background:#10b981; color:#fff; padding:8px; border:none; border-radius:4px; font-size:11px; cursor:pointer;">🧪 Curar (${this.inventory.potions.heal})</button>
            <button onclick="window.gameInstance.usePotion('buffAtk')" style="flex:1; background:#3b82f6; color:#fff; padding:8px; border:none; border-radius:4px; font-size:11px; cursor:pointer;">⚡ +ATK (${this.inventory.potions.buffAtk})</button>
            <button onclick="window.gameInstance.usePotion('shield')" style="flex:1; background:#8b5cf6; color:#fff; padding:8px; border:none; border-radius:4px; font-size:11px; cursor:pointer;">🛡️ Escudo (${this.inventory.potions.shield})</button>
          </div>
        </div>
      `;if(this.activeTab==="alchemy")return`
        <h4 style="margin:0 0 10px 0; color:#00ffcc;">Laboratório de Alquimia</h4>
        <p style="font-size:11px; color:#9ca3af;">Reagentes: 🔴 Syntax (${this.inventory.syntaxError}) | 🟡 Null (${this.inventory.nullPointer}) | 🔵 Memory (${this.inventory.memoryLeak})</p>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
          <button onclick="window.gameInstance.craftPotion('heal')" style="background:#1f2937; color:#fff; border:1px solid #10b981; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">Sintetizar Poção de Cura (Custo: 2x Syntax)</button>
          <button onclick="window.gameInstance.craftPotion('buffAtk')" style="background:#1f2937; color:#fff; border:1px solid #3b82f6; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">Sintetizar Poção de Dano (Custo: 2x Null)</button>
          <button onclick="window.gameInstance.craftPotion('shield')" style="background:#1f2937; color:#fff; border:1px solid #8b5cf6; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">Sintetizar Poção de Escudo (Custo: 2x Memory)</button>
        </div>
      `;if(this.activeTab==="shop")return`
        <h4 style="margin:0 0 10px 0; color:#00ffcc;">Cyber-Loja de Passivas</h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button onclick="window.gameInstance.buyUpgrade('maxHp')" style="background:#1f2937; color:#fff; border:1px solid #00ffcc; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">+20 HP Máximo (${(this.upgrades.maxHp+1)*40} Bits)</button>
          <button onclick="window.gameInstance.buyUpgrade('atk')" style="background:#1f2937; color:#fff; border:1px solid #00ffcc; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">+4 Dano de Ataque (${(this.upgrades.atk+1)*40} Bits)</button>
          <button onclick="window.gameInstance.buyUpgrade('crit')" style="background:#1f2937; color:#fff; border:1px solid #00ffcc; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">+5% Taxa de Crítico (${(this.upgrades.crit+1)*40} Bits)</button>
        </div>
      `;if(this.activeTab==="talents")return`
        <h4 style="margin:0 0 10px 0; color:#00ffcc;">Árvore de Especialização</h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button onclick="window.gameInstance.selectTalent('hacker')" style="background:#1f2937; color:#fff; border:1px solid #f59e0b; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">🥷 Hacker Ético (${this.talents.hacker}/5) -> +4% Esquiva</button>
          <button onclick="window.gameInstance.selectTalent('engenheiro')" style="background:#1f2937; color:#fff; border:1px solid #ef4444; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">💥 Engenheiro Caótico (${this.talents.engenheiro}/5) -> +6 Ataque</button>
          <button onclick="window.gameInstance.selectTalent('arquiteto')" style="background:#1f2937; color:#fff; border:1px solid #10b981; padding:8px; border-radius:4px; text-align:left; cursor:pointer; font-size:12px;">🛡️ Arquiteto de Sistemas (${this.talents.arquiteto}/5) -> +2 Regen/Turno</button>
        </div>
      `;if(this.activeTab==="achievements")return`
        <h4 style="margin:0 0 10px 0; color:#00ffcc;">Conquistas & Troféus</h4>
        <div style="display:flex; flex-direction:column; gap:6px; font-size:12px;">
          ${Object.values(this.achievements).map(t=>`
            <div style="background:#1f2937; padding:8px; border-radius:4px; border-left:3px solid ${t.unlocked?"#10b981":"#6b7280"};">
              <b>${t.unlocked?"✅":"🔒"} ${t.name}</b>: ${t.desc}
            </div>
          `).join("")}
        </div>
      `}}window.gameInstance=new a;
