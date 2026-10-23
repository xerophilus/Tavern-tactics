import type { Enemy } from './types';

export const ENEMIES: Record<string, Enemy[]> = {
  normal: [
    { id: 'goblin', name: 'Goblin Scout', emoji: '👺', stats: { health: 50, attack: 10, defense: 3 } },
    { id: 'skeleton', name: 'Skeleton Warrior', emoji: '💀', stats: { health: 60, attack: 12, defense: 4 } },
    { id: 'spider', name: 'Giant Spider', emoji: '🕷️', stats: { health: 45, attack: 15, defense: 2 } },
    { id: 'orc_raider', name: 'Orc Raider', emoji: '👹', stats: { health: 70, attack: 14, defense: 6 } },
    { id: 'wolf', name: 'Dire Wolf', emoji: '🐺', stats: { health: 55, attack: 16, defense: 3 } }
  ],
  elite: [
    { id: 'ogre', name: 'Cave Ogre', emoji: '👿', stats: { health: 150, attack: 20, defense: 10 } },
    { id: 'necromancer', name: 'Dark Necromancer', emoji: '🧟', stats: { health: 120, attack: 25, defense: 5 } },
    { id: 'troll', name: 'Forest Troll', emoji: '👾', stats: { health: 180, attack: 18, defense: 12 } }
  ],
  boss: [
    { id: 'dragon', name: 'Shadowfang the Destroyer', emoji: '🐉', stats: { health: 400, attack: 35, defense: 20 } }
  ]
};
