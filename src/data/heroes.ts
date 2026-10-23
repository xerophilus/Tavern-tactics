import { BaseHero } from './types';

export const HEROES: BaseHero[] = [
  {
    id: 'orc_warrior',
    name: 'Throk the Mighty',
    class: 'Warrior',
    race: 'Orc',
    emoji: '🗿',
    cost: 2,
    stats: { health: 120, attack: 15, defense: 8 }
  },
  {
    id: 'human_tank',
    name: 'Sir Reginald',
    class: 'Tank',
    race: 'Human',
    emoji: '🛡️',
    cost: 3,
    stats: { health: 180, attack: 8, defense: 15 }
  },
  {
    id: 'elf_mage',
    name: 'Aelindra',
    class: 'Mage',
    race: 'Elf',
    emoji: '🔮',
    cost: 3,
    stats: { health: 80, attack: 25, defense: 3 }
  },
  {
    id: 'undead_rogue',
    name: 'Shadowbane',
    class: 'Rogue',
    race: 'Undead',
    emoji: '💀',
    cost: 2,
    stats: { health: 90, attack: 20, defense: 5 }
  },
  {
    id: 'dwarf_healer',
    name: 'Gimrik',
    class: 'Healer',
    race: 'Dwarf',
    emoji: '⛏️',
    cost: 4,
    stats: { health: 100, attack: 5, defense: 10 }
  },
  {
    id: 'human_mage',
    name: 'Merlin',
    class: 'Mage',
    race: 'Human',
    emoji: '🧙',
    cost: 3,
    stats: { health: 75, attack: 28, defense: 2 }
  },
  {
    id: 'orc_tank',
    name: 'Gromm Ironhide',
    class: 'Tank',
    race: 'Orc',
    emoji: '🪓',
    cost: 3,
    stats: { health: 200, attack: 10, defense: 12 }
  },
  {
    id: 'elf_healer',
    name: 'Sylvara',
    class: 'Healer',
    race: 'Elf',
    emoji: '🌿',
    cost: 4,
    stats: { health: 90, attack: 6, defense: 8 }
  }
];
