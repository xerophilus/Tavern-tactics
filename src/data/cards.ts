import type { Card } from './types';

export const CARDS: Card[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    manaCost: 3,
    emoji: '🔥',
    description: 'Deal 30 damage to a random enemy',
    effect: { type: 'damage', value: 30, target: 'random_enemy' }
  },
  {
    id: 'heal',
    name: 'Holy Light',
    manaCost: 2,
    emoji: '✨',
    description: 'Heal an ally for 40 HP',
    effect: { type: 'heal', value: 40, target: 'ally' }
  },
  {
    id: 'shield',
    name: 'Shield Wall',
    manaCost: 2,
    emoji: '🛡️',
    description: 'Give an ally +10 defense',
    effect: { type: 'buff', value: 10, target: 'ally', buffType: 'defense', duration: 1 }
  },
  {
    id: 'rage',
    name: 'Battle Rage',
    manaCost: 2,
    emoji: '💪',
    description: 'Give an ally +15 attack',
    effect: { type: 'buff', value: 15, target: 'ally', buffType: 'attack', duration: 1 }
  },
  {
    id: 'mass_heal',
    name: 'Mass Healing',
    manaCost: 4,
    emoji: '🌟',
    description: 'Heal all allies for 25 HP',
    effect: { type: 'heal', value: 25, target: 'all_allies' }
  },
  {
    id: 'lightning',
    name: 'Chain Lightning',
    manaCost: 3,
    emoji: '⚡',
    description: 'Deal 20 damage to all enemies',
    effect: { type: 'damage', value: 20, target: 'all_enemies' }
  },
  {
    id: 'weakness',
    name: 'Curse of Weakness',
    manaCost: 2,
    emoji: '😵',
    description: 'Reduce an enemy\'s attack by 10',
    effect: { type: 'debuff', value: -10, target: 'enemy', buffType: 'attack', duration: 2 }
  },
  {
    id: 'frost_bolt',
    name: 'Frost Bolt',
    manaCost: 2,
    emoji: '❄️',
    description: 'Deal 25 damage to a random enemy',
    effect: { type: 'damage', value: 25, target: 'random_enemy' }
  },
  {
    id: 'blessing',
    name: 'Divine Blessing',
    manaCost: 3,
    emoji: '🙏',
    description: 'Give an ally +20 health',
    effect: { type: 'buff', value: 20, target: 'ally', buffType: 'health', duration: 1 }
  },
  {
    id: 'meteor',
    name: 'Meteor Strike',
    manaCost: 5,
    emoji: '☄️',
    description: 'Deal 50 damage to a random enemy',
    effect: { type: 'damage', value: 50, target: 'random_enemy' }
  },
  {
    id: 'rejuvenation',
    name: 'Rejuvenation',
    manaCost: 1,
    emoji: '🍃',
    description: 'Heal an ally for 20 HP',
    effect: { type: 'heal', value: 20, target: 'ally' }
  },
  {
    id: 'smite',
    name: 'Smite',
    manaCost: 1,
    emoji: '⚔️',
    description: 'Deal 15 damage to a random enemy',
    effect: { type: 'damage', value: 15, target: 'random_enemy' }
  },
  {
    id: 'armor_break',
    name: 'Armor Break',
    manaCost: 2,
    emoji: '🔨',
    description: 'Reduce an enemy\'s defense by 8',
    effect: { type: 'debuff', value: -8, target: 'enemy', buffType: 'defense', duration: 2 }
  },
  {
    id: 'rally',
    name: 'Rally the Troops',
    manaCost: 4,
    emoji: '📯',
    description: 'Give all allies +8 attack',
    effect: { type: 'buff', value: 8, target: 'all_allies', buffType: 'attack', duration: 1 }
  },
  {
    id: 'death_coil',
    name: 'Death Coil',
    manaCost: 3,
    emoji: '💀',
    description: 'Deal 35 damage to a random enemy',
    effect: { type: 'damage', value: 35, target: 'random_enemy' }
  }
];
