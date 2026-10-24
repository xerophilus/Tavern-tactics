import { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { ENEMIES } from '../data/enemies';
import type { Enemy, Hero, Card } from '../data/types';

interface CombatHero extends Hero {
  currentHealth: number;
  buffs: { attack: number; defense: number; health: number };
}

interface CombatEnemy extends Enemy {
  currentHealth: number;
  buffs: { attack: number; defense: number; health: number };
}

export default function CombatScreen() {
  const { state, playCard, endCombat } = useGame();
  const [allies, setAllies] = useState<CombatHero[]>([]);
  const [enemies, setEnemies] = useState<CombatEnemy[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [combatPhase, setCombatPhase] = useState<'player_turn' | 'auto_combat' | 'ended'>('player_turn');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  
  useEffect(() => {
    const room = state.map.find(r => r.id === state.currentRoom);
    if (!room) return;
    
    const initialAllies = state.board.filter((h): h is Hero => h !== null).map(hero => ({
      ...hero,
      currentHealth: hero.stats.health,
      buffs: { attack: 0, defense: 0, health: 0 }
    }));
    
    let enemyPool: Enemy[] = [];
    if (room.type === 'boss') enemyPool = ENEMIES.boss;
    else if (room.type === 'elite') enemyPool = ENEMIES.elite;
    else enemyPool = ENEMIES.normal;
    
    const numEnemies = room.type === 'boss' ? 1 : room.type === 'elite' ? 2 : 3;
    const initialEnemies = Array.from({ length: numEnemies }, () => {
      const template = enemyPool[Math.floor(Math.random() * enemyPool.length)];
      return {
        ...template,
        currentHealth: template.stats.health,
        buffs: { attack: 0, defense: 0, health: 0 }
      };
    });
    
    setAllies(initialAllies);
    setEnemies(initialEnemies);
    setBattleLog(['⚔️ Battle begins!']);
  }, [state.currentRoom]);
  
  const handleCardPlay = (cardIdx: number) => {
    const card = state.hand[cardIdx];
    if (!card || state.mana < card.manaCost) return;
    
    if (card.effect.target === 'ally' || card.effect.target === 'enemy') {
      setSelectedCard(cardIdx);
    } else {
      executeCard(card, cardIdx);
    }
  };
  
  const executeCard = (card: Card, cardIdx: number, targetIdx?: number) => {
    playCard(cardIdx);
    const logs: string[] = [];
    
    if (card.effect.type === 'damage') {
      if (card.effect.target === 'random_enemy' && enemies.length > 0) {
        const target = enemies[Math.floor(Math.random() * enemies.length)];
        target.currentHealth -= card.effect.value;
        logs.push(`${card.emoji} ${card.name} dealt ${card.effect.value} damage to ${target.name}`);
      } else if (card.effect.target === 'all_enemies') {
        enemies.forEach(e => {
          e.currentHealth -= card.effect.value;
        });
        logs.push(`${card.emoji} ${card.name} dealt ${card.effect.value} damage to all enemies`);
      } else if (card.effect.target === 'enemy' && targetIdx !== undefined) {
        enemies[targetIdx].currentHealth -= card.effect.value;
        logs.push(`${card.emoji} ${card.name} dealt ${card.effect.value} damage to ${enemies[targetIdx].name}`);
      }
    } else if (card.effect.type === 'heal') {
      if (card.effect.target === 'all_allies') {
        allies.forEach(a => {
          a.currentHealth = Math.min(a.currentHealth + card.effect.value, a.stats.health);
        });
        logs.push(`${card.emoji} ${card.name} healed all allies for ${card.effect.value}`);
      } else if (card.effect.target === 'ally' && targetIdx !== undefined) {
        allies[targetIdx].currentHealth = Math.min(
          allies[targetIdx].currentHealth + card.effect.value,
          allies[targetIdx].stats.health
        );
        logs.push(`${card.emoji} ${card.name} healed ${allies[targetIdx].name} for ${card.effect.value}`);
      }
    } else if (card.effect.type === 'buff' && card.effect.buffType) {
      if (card.effect.target === 'all_allies') {
        allies.forEach(a => {
          a.buffs[card.effect.buffType!] += card.effect.value;
        });
        logs.push(`${card.emoji} ${card.name} buffed all allies' ${card.effect.buffType}`);
      } else if (card.effect.target === 'ally' && targetIdx !== undefined) {
        allies[targetIdx].buffs[card.effect.buffType] += card.effect.value;
        logs.push(`${card.emoji} ${card.name} buffed ${allies[targetIdx].name}'s ${card.effect.buffType}`);
      }
    } else if (card.effect.type === 'debuff' && card.effect.buffType) {
      if (card.effect.target === 'enemy' && targetIdx !== undefined) {
        enemies[targetIdx].buffs[card.effect.buffType] += card.effect.value;
        logs.push(`${card.emoji} ${card.name} reduced ${enemies[targetIdx].name}'s ${card.effect.buffType}`);
      }
    }
    
    setBattleLog(prev => [...prev.slice(-4), ...logs]);
    setSelectedCard(null);
    setAllies([...allies]);
    setEnemies([...enemies]);
  };
  
  const handleTargetSelect = (targetIdx: number, isEnemy: boolean) => {
    if (selectedCard === null) return;
    const card = state.hand[selectedCard];
    if (!card) return;
    
    if ((card.effect.target === 'enemy' && isEnemy) || (card.effect.target === 'ally' && !isEnemy)) {
      executeCard(card, selectedCard, targetIdx);
    }
  };
  
  const runAutoCombat = () => {
    setCombatPhase('auto_combat');
    let currentAllies = [...allies];
    let currentEnemies = [...enemies];
    const logs: string[] = [];
    
    for (let turn = 0; turn < 10; turn++) {
      currentAllies = currentAllies.filter(a => a.currentHealth > 0);
      currentEnemies = currentEnemies.filter(e => e.currentHealth > 0);
      
      if (currentAllies.length === 0 || currentEnemies.length === 0) break;
      
      currentAllies.forEach(ally => {
        if (currentEnemies.length === 0) return;
        const target = currentEnemies[0];
        const damage = Math.max(1, ally.stats.attack + ally.buffs.attack - target.stats.defense - target.buffs.defense);
        target.currentHealth -= damage;
        logs.push(`${ally.name} attacks for ${damage}`);
      });
      
      currentEnemies = currentEnemies.filter(e => e.currentHealth > 0);
      
      currentEnemies.forEach(enemy => {
        if (currentAllies.length === 0) return;
        const target = currentAllies[0];
        const damage = Math.max(1, enemy.stats.attack + enemy.buffs.attack - target.stats.defense - target.buffs.defense);
        target.currentHealth -= damage;
        logs.push(`${enemy.name} attacks for ${damage}`);
      });
      
      currentAllies = currentAllies.filter(a => a.currentHealth > 0);
    }
    
    setAllies(currentAllies);
    setEnemies(currentEnemies);
    setBattleLog(prev => [...prev, ...logs.slice(-5)]);
    
    setTimeout(() => {
      if (currentAllies.length > 0 && currentEnemies.length === 0) {
        endCombat(true);
      } else if (currentAllies.length === 0) {
        endCombat(false);
      } else {
        setCombatPhase('ended');
      }
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-tavern-darkest to-red-950 safe-area-inset">
      {/* Enemy Area - Large Cards */}
      <div className="p-3 min-h-[30%] bg-red-950/40">
        <div className="text-red-300 font-display font-semibold text-sm text-center mb-2">
          ENEMIES
        </div>
        <div className="flex justify-center gap-2">
          {enemies.map((enemy, idx) => {
            const hpPercent = (enemy.currentHealth / enemy.stats.health) * 100;
            return (
              <button
                key={idx}
                onClick={() => handleTargetSelect(idx, true)}
                disabled={enemy.currentHealth <= 0 || selectedCard === null}
                className={`
                  panel p-3 w-28 h-36 flex flex-col items-center justify-between
                  ${enemy.currentHealth > 0 ? 'bg-red-900/60' : 'opacity-30 grayscale'}
                  ${selectedCard !== null && state.hand[selectedCard]?.effect.target === 'enemy' ? 'ring-4 ring-yellow-400 scale-105' : ''}
                  transition-all active:scale-95 disabled:cursor-default
                `}
              >
                <div className="text-5xl">{enemy.emoji}</div>
                <div className="text-center w-full">
                  <div className="text-white text-xs font-display font-bold mb-1">
                    {enemy.name}
                  </div>
                  {/* HP Bar */}
                  <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-red-600/50">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                      style={{ width: `${Math.max(0, hpPercent)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-red-200 mt-1">
                    {Math.max(0, enemy.currentHealth)}/{enemy.stats.health} HP
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Battle Log */}
      <div className="panel m-2 p-2 max-h-16 overflow-y-auto">
        <div className="text-center space-y-0.5">
          {battleLog.slice(-2).map((log, idx) => (
            <div key={idx} className="text-tavern-parchment-dark text-[10px] font-display">
              {log}
            </div>
          ))}
        </div>
      </div>
      
      {/* Ally Area - Large Cards */}
      <div className="flex-1 p-3 bg-blue-950/40">
        <div className="text-blue-300 font-display font-semibold text-sm text-center mb-2">
          YOUR PARTY
        </div>
        <div className="flex justify-center gap-2">
          {allies.map((ally, idx) => {
            const hpPercent = (ally.currentHealth / ally.stats.health) * 100;
            return (
              <button
                key={idx}
                onClick={() => handleTargetSelect(idx, false)}
                disabled={ally.currentHealth <= 0 || selectedCard === null}
                className={`
                  panel p-3 w-28 h-36 flex flex-col items-center justify-between relative
                  ${ally.currentHealth > 0 ? 'bg-blue-900/60' : 'opacity-30 grayscale'}
                  ${selectedCard !== null && state.hand[selectedCard]?.effect.target === 'ally' ? 'ring-4 ring-green-400 scale-105' : ''}
                  transition-all active:scale-95 disabled:cursor-default
                `}
              >
                {ally.stars > 1 && (
                  <div className="absolute -top-2 left-0 right-0 flex justify-center z-20">
                    <div className="bg-yellow-600 px-2 py-0.5 rounded-full text-[10px] text-white font-bold shadow-lg">
                      {'⭐'.repeat(ally.stars)}
                    </div>
                  </div>
                )}
                <div className="text-5xl">{ally.emoji}</div>
                <div className="text-center w-full">
                  <div className="text-white text-xs font-display font-bold mb-1">
                    {ally.name.split(' ')[0]}
                  </div>
                  {/* HP Bar */}
                  <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-green-600/50">
                    <div 
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300"
                      style={{ width: `${Math.max(0, hpPercent)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-green-200 mt-1">
                    {Math.max(0, ally.currentHealth)}/{ally.stats.health} HP
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Hand - Hearthstone style */}
      <div className="bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
        <div className="flex justify-between items-center mb-2">
          <div className="stat-badge text-base">💧 {state.mana}/{state.maxMana}</div>
          {combatPhase === 'player_turn' && (
            <button
              onClick={runAutoCombat}
              className="btn-primary py-2 px-6 text-sm"
            >
              End Turn ⚔️
            </button>
          )}
        </div>
        
        {/* Cards */}
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {state.hand.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleCardPlay(idx)}
              disabled={state.mana < card.manaCost || combatPhase !== 'player_turn'}
              className={`
                hero-card flex-shrink-0 w-24 h-32 p-2 flex flex-col items-center justify-between
                ${selectedCard === idx ? 'ring-4 ring-yellow-400 scale-105 -translate-y-2' : ''}
                ${state.mana < card.manaCost ? 'opacity-40 grayscale' : 'hover:-translate-y-1'}
                transition-all active:scale-95 disabled:cursor-not-allowed
              `}
            >
              <div className="text-4xl">{card.emoji}</div>
              <div className="text-center">
                <div className="text-tavern-parchment text-[10px] font-display font-bold leading-tight">
                  {card.name}
                </div>
              </div>
              <div className="stat-badge text-xs font-bold">{card.manaCost}💧</div>
            </button>
          ))}
        </div>
        
        {selectedCard !== null && (
          <div className="mt-2 text-tavern-parchment text-[10px] font-display text-center bg-black/60 p-2 rounded">
            {state.hand[selectedCard]?.description}
          </div>
        )}
      </div>
    </div>
  );
}
