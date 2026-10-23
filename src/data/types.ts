export type HeroClass = 'Tank' | 'Healer' | 'Mage' | 'Rogue' | 'Warrior';
export type HeroRace = 'Orc' | 'Human' | 'Undead' | 'Elf' | 'Dwarf';

export interface BaseHero {
  id: string;
  name: string;
  class: HeroClass;
  race: HeroRace;
  emoji: string;
  cost: number;
  stats: {
    health: number;
    attack: number;
    defense: number;
  };
}

export interface Hero extends BaseHero {
  stars: 1 | 2 | 3;
  instanceId: string;
}

export interface Card {
  id: string;
  name: string;
  manaCost: number;
  emoji: string;
  description: string;
  effect: CardEffect;
}

export interface CardEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'taunt';
  value: number;
  target: 'enemy' | 'ally' | 'all_enemies' | 'all_allies' | 'random_enemy';
  buffType?: 'attack' | 'defense' | 'health';
  duration?: number;
}

export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
  };
}

export interface RoomNode {
  id: string;
  type: 'combat' | 'shop' | 'rest' | 'elite' | 'boss';
  completed: boolean;
  connections: string[];
}

export interface GameState {
  phase: 'map' | 'shop' | 'combat' | 'victory' | 'defeat';
  gold: number;
  health: number;
  maxHealth: number;
  round: number;
  board: (Hero | null)[];
  bench: Hero[];
  shop: Hero[];
  deck: Card[];
  hand: Card[];
  mana: number;
  maxMana: number;
  currentRoom: string | null;
  map: RoomNode[];
  unlockedHeroes: string[];
  unlockedCards: string[];
}
