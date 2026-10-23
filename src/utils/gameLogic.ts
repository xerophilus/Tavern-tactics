import type { Hero, Card, RoomNode } from '../data/types';
import { HEROES } from '../data/heroes';
import { CARDS } from '../data/cards';
import { createHeroInstance } from './heroLeveling';

export function generateShop(availableHeroes: string[]): Hero[] {
  const pool = HEROES.filter(h => availableHeroes.includes(h.id));
  const shop: Hero[] = [];
  for (let i = 0; i < 4; i++) {
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
  
  const layers = [
    ['combat', 'combat', 'combat'],
    ['combat', 'shop', 'combat'],
    ['combat', 'rest', 'combat'],
    ['elite', 'combat', 'elite'],
    ['shop', 'combat', 'shop'],
    ['boss']
  ];
  
  layers.forEach((layer, layerIndex) => {
    const layerNodes: string[] = [];
    layer.forEach(type => {
      const id = `node_${nodeId++}`;
      const connections: string[] = [];
      
      if (layerIndex < layers.length - 1) {
        const nextLayerStart = map.length + layer.length;
        const nextLayerSize = layers[layerIndex + 1].length;
        for (let i = 0; i < nextLayerSize; i++) {
          connections.push(`node_${nextLayerStart + i}`);
        }
      }
      
      map.push({
        id,
        type: type as any,
        completed: false,
        connections
      });
      layerNodes.push(id);
    });
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
    heroes: heroes ? JSON.parse(heroes) : HEROES.slice(0, 4).map(h => h.id),
    cards: cards ? JSON.parse(cards) : CARDS.slice(0, 8).map(c => c.id)
  };
}
