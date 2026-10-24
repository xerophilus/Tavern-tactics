import type { Hero, Card, RoomNode } from '../data/types';
import { HEROES } from '../data/heroes';
import { CARDS } from '../data/cards';
import { createHeroInstance } from './heroLeveling';

export function generateShop(availableHeroes: string[]): Hero[] {
  const pool = HEROES.filter(h => availableHeroes.includes(h.id));
  const shop: Hero[] = [];
  for (let i = 0; i < 5; i++) {  // Increased from 4 to 5 heroes
    if (pool.length > 0) {
      const random = pool[Math.floor(Math.random() * pool.length)];
      shop.push(createHeroInstance(random));
    }
  }
  return shop;
}

export function drawCards(deck: Card[], count: number): { drawn: Card[], remaining: Card[] } {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  const drawn = shuffled.slice(0, count);
  const remaining = shuffled.slice(count);
  return { drawn, remaining };
}

export function calculateSynergies(board: (Hero | null)[]): { classes: Map<string, number>, races: Map<string, number> } {
  const classes = new Map<string, number>();
  const races = new Map<string, number>();
  
  board.forEach(hero => {
    if (hero) {
      classes.set(hero.class, (classes.get(hero.class) || 0) + 1);
      races.set(hero.race, (races.get(hero.race) || 0) + 1);
    }
  });
  
  return { classes, races };
}

export function getSynergyBonuses(synergies: { classes: Map<string, number>, races: Map<string, number> }): string[] {
  const bonuses: string[] = [];
  
  synergies.classes.forEach((count, className) => {
    if (count >= 2) bonuses.push(`${className} x${count}: +${count * 5}% damage`);
  });
  
  synergies.races.forEach((count, raceName) => {
    if (count >= 2) bonuses.push(`${raceName} x${count}: +${count * 10} HP`);
  });
  
  return bonuses;
}

export function generateMap(): RoomNode[] {
  const map: RoomNode[] = [];
  let nodeId = 0;
  
  // Slay the Spire style branching map
  // Each row has 2-4 nodes, with connections spreading out
  const structure = [
    { types: ['combat', 'combat', 'combat'], count: 3 },
    { types: ['combat', 'shop', 'combat', 'rest'], count: 4 },
    { types: ['combat', 'combat', 'elite'], count: 3 },
    { types: ['shop', 'combat', 'rest'], count: 3 },
    { types: ['combat', 'elite', 'combat'], count: 3 },
    { types: ['shop', 'combat'], count: 2 },
    { types: ['boss'], count: 1 }
  ];
  
  structure.forEach((layer, layerIndex) => {
    for (let i = 0; i < layer.count; i++) {
      const id = `node_${nodeId++}`;
      const type = layer.types[i % layer.types.length];
      
      // Determine connections
      let connections: string[] = [];
      
      if (layerIndex < structure.length - 1) {
        const nextLayerCount = structure[layerIndex + 1].count;
        const baseNextId = nodeId;
        
        // Each node connects to 1-3 nodes in next layer
        if (layer.count === 1) {
          // Boss or single node connects to all in next layer
          for (let j = 0; j < nextLayerCount; j++) {
            connections.push(`node_${baseNextId + j}`);
          }
        } else if (i === 0) {
          // Leftmost node connects to left half
          connections.push(`node_${baseNextId}`);
          if (nextLayerCount > 1) connections.push(`node_${baseNextId + 1}`);
        } else if (i === layer.count - 1) {
          // Rightmost node connects to right half
          if (nextLayerCount > 1) connections.push(`node_${baseNextId + nextLayerCount - 2}`);
          connections.push(`node_${baseNextId + nextLayerCount - 1}`);
        } else {
          // Middle nodes connect to nearby nodes
          const centerNext = Math.floor((i / layer.count) * nextLayerCount);
          connections.push(`node_${baseNextId + centerNext}`);
          if (centerNext > 0) connections.push(`node_${baseNextId + centerNext - 1}`);
          if (centerNext < nextLayerCount - 1) connections.push(`node_${baseNextId + centerNext + 1}`);
        }
      }
      
      map.push({
        id,
        type: type as any,
        completed: false,
        connections
      });
    }
  });
  
  return map;
}

export function saveProgress(unlockedHeroes: string[], unlockedCards: string[]) {
  localStorage.setItem('tavern_tactics_heroes', JSON.stringify(unlockedHeroes));
  localStorage.setItem('tavern_tactics_cards', JSON.stringify(unlockedCards));
}

export function loadProgress(): { heroes: string[], cards: string[] } {
  const heroes = localStorage.getItem('tavern_tactics_heroes');
  const cards = localStorage.getItem('tavern_tactics_cards');
  
  return {
    heroes: heroes ? JSON.parse(heroes) : HEROES.map(h => h.id),  // Unlock all heroes by default
    cards: cards ? JSON.parse(cards) : CARDS.map(c => c.id)  // Unlock all cards by default
  };
}
