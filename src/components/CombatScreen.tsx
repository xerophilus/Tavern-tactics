import { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { ENEMIES } from '../data/enemies';
import { Enemy, Hero, Card } from '../data/types';
import { StarDisplay } from './StarDisplay';

interface CombatHero extends Hero {
  currentHealth: number;
  buffs: { attack: number; defense: number; health: number };
}

interface CombatEnemy extends Enemy {
  currentHealth: number;
  buffs: { attack: number; defense: number };
}

export default function CombatScreen() {
  const { state, playCard, endCombat } = useGame();
  const [allies, setAllies] = useState<CombatHero[]>([]);
  const [enemies, setEnemies] = useState<CombatEnemy[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [turnCount, setTurnCount] = useState(0);
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
        buffs: { attack: 0, defense: 0 }
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
          logs.push(`${card.emoji} ${card.name} dealt ${card.effect.value} damage to ${e.name}`);
        });
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
        logs.push(`${ally.emoji} ${ally.name} attacks ${target.name} for ${damage} damage`);
      });
      
      currentEnemies = currentEnemies.filter(e => e.currentHealth > 0);
      
      currentEnemies.forEach(enemy => {
        if (currentAllies.length === 0) return;
        const target = currentAllies[0];
        const damage = Math.max(1, enemy.stats.attack + enemy.buffs.attack - target.stats.defense - target.buffs.defense);
        target.currentHealth -= damage;
        logs.push(`${enemy.emoji} ${enemy.name} attacks ${target.name} for ${damage} damage`);
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-red-950">
      {/* Enemy Area */}
      <div className="bg-red-900 p-3 min-h-[35%]">
        <div className="text-white text-xs mb-2 text-center">Enemies</div>
        <div className="flex justify-center gap-2 flex-wrap">
          {enemies.map((enemy, idx) => (
            <button
              key={idx}
              onClick={() => handleTargetSelect(idx, true)}
              disabled={enemy.currentHealth <= 0 || selectedCard === null}
              className={`
                ${enemy.currentHealth > 0 ? 'bg-red-700' : 'bg-gray-700 opacity-50'}
                ${selectedCard !== null && state.hand[selectedCard]?.effect.target === 'enemy' ? 'ring-4 ring-yellow-400' : ''}
                p-2 rounded-lg transition-all active:scale-95 disabled:cursor-default
              `}
            >
              <div className="text-3xl mb-1">{enemy.emoji}</div>
              <div className="text-white text-[9px]">{enemy.name}</div>
              <div className="text-red-300 text-xs">
                ❤️{Math.max(0, enemy.currentHealth)}/{enemy.stats.health}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Battle Log */}
      <div className="bg-slate-800 p-2 overflow-y-auto max-h-20">
        {battleLog.slice(-3).map((log, idx) => (
          <div key={idx} className="text-amber-200 text-[10px]">{log}</div>
        ))}
      </div>
      
      {/* Ally Area */}
      <div className="bg-blue-900 p-3 flex-1">
        <div className="text-white text-xs mb-2 text-center">Your Party</div>
        <div className="flex justify-center gap-2">
          {allies.map((ally, idx) => (
            <button
              key={idx}
              onClick={() => handleTargetSelect(idx, false)}
              disabled={ally.currentHealth <= 0 || selectedCard === null}
              className={`
                ${ally.currentHealth > 0 ? 'bg-blue-700' : 'bg-gray-700 opacity-50'}
                ${selectedCard !== null && state.hand[selectedCard]?.effect.target === 'ally' ? 'ring-4 ring-green-400' : ''}
                p-2 rounded-lg transition-all active:scale-95 disabled:cursor-default relative
              `}
            >
              {ally.stars > 1 && (
                <div className="absolute top-0 left-0 right-0 text-center">
                  <StarDisplay stars={ally.stars} />
                </div>
              )}
              <div className="text-2xl mb-1">{ally.emoji}</div>
              <div className="text-white text-[9px]">{ally.name.split(' ')[0]}</div>
              <div className="text-blue-300 text-xs">
                ❤️{Math.max(0, ally.currentHealth)}/{ally.stats.health}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Hand & Mana */}
      <div className="bg-slate-800 p-3">
        <div className="flex justify-between mb-2">
          <div className="text-blue-400 font-bold">💧 {state.mana}/{state.maxMana}</div>
          {combatPhase === 'player_turn' && (
            <button
              onClick={runAutoCombat}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm active:scale-95"
            >
              End Turn ⚔️
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {state.hand.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleCardPlay(idx)}
              disabled={state.mana < card.manaCost || combatPhase !== 'player_turn' || selectedCard === idx}
              className={`
                ${selectedCard === idx ? 'bg-yellow-600 ring-4 ring-yellow-400' : 'bg-slate-700'}
                ${state.mana < card.manaCost ? 'opacity-50' : ''}
                flex-shrink-0 p-2 rounded-lg w-20 active:scale-95 disabled:cursor-not-allowed
              `}
            >
              <div className="text-2xl">{card.emoji}</div>
              <div className="text-white text-[9px] mt-1">{card.name}</div>
              <div className="text-blue-400 text-xs font-bold">{card.manaCost}💧</div>
            </button>
          ))}
        </div>
        
        {selectedCard !== null && (
          <div className="mt-2 text-amber-200 text-[10px] text-center">
            {state.hand[selectedCard]?.description}
          </div>
        )}
      </div>
    </div>
  );
}
