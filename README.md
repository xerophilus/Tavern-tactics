# 🏰 Tavern Tactics

A mobile-first roguelite strategy game that blends Hearthstone's card play, Teamfight Tactics' auto-battler mechanics, and RPG dungeon crawling in a World of Warcraft-inspired fantasy setting.

## 🎮 How to Play

- **Shop Phase**: Buy heroes with gold, place them on your board, and combine 3 copies to level them up
- **Combat Phase**: Play 1-2 cards per turn to support your heroes, then watch the auto-battle unfold
- **Synergies**: Match hero classes (Tank, Healer, Mage, Rogue, Warrior) and races (Orc, Human, Undead, Elf, Dwarf) for powerful bonuses
- **Dungeon Map**: Navigate through fights, shops, rest stops, elite enemies, and the final boss

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
npm run dev
```

The game will start at `http://localhost:43123`

## 📱 Playing on Your Phone

### Option 1: Local Network (Quickest)
1. Start the dev server: `npm run dev`
2. Find your computer's local IP (usually something like `192.168.1.x`)
3. On your phone, open `http://YOUR_IP:43123` in your mobile browser
4. Add to home screen for the best experience

### Option 2: Deploy (Recommended for ongoing play)
Deploy to any static hosting service:

**Vercel (easiest):**
```bash
npm install -g vercel
npm run build
vercel --prod
```

**Netlify:**
```bash
npm run build
# Drag and drop the `dist` folder to netlify.com/drop
```

Then open the deployment URL on your phone and add to home screen!

## 🎨 Adding Content

All game data is in easy-to-edit files in the `src/data/` folder:

### Adding Heroes (`src/data/heroes.ts`)

```typescript
{
  id: 'unique_id',
  name: 'Hero Name',
  class: 'Tank' | 'Healer' | 'Mage' | 'Rogue' | 'Warrior',
  race: 'Orc' | 'Human' | 'Undead' | 'Elf' | 'Dwarf',
  emoji: '🗿', // Any emoji for visual representation
  cost: 3, // Gold cost to buy
  stats: { health: 150, attack: 20, defense: 10 }
}
```

**Balancing Tips:**
- Tanks: High health (150-200), low attack (8-12), high defense (10-15)
- Healers: Medium health (90-110), low attack (5-8), medium defense (8-12)
- Mages: Low health (70-90), high attack (25-30), low defense (2-4)
- Warriors: Medium-high health (110-140), high attack (18-25), medium defense (6-10)
- Rogues: Low-medium health (80-100), very high attack (20-28), low defense (3-6)

### Adding Cards (`src/data/cards.ts`)

```typescript
{
  id: 'unique_id',
  name: 'Card Name',
  manaCost: 3, // Mana cost to play
  emoji: '🔥',
  description: 'What the card does',
  effect: {
    type: 'damage' | 'heal' | 'buff' | 'debuff',
    value: 30, // Amount of damage/heal/buff
    target: 'enemy' | 'ally' | 'all_enemies' | 'all_allies' | 'random_enemy',
    buffType?: 'attack' | 'defense' | 'health', // Only for buff/debuff
    duration?: 1 // How many turns the buff lasts
  }
}
```

**Balancing Tips:**
- Single target damage: ~10-15 damage per mana
- AoE damage: ~6-8 damage per mana per target
- Healing: ~15-20 health per mana
- Buffs: +8-12 per mana for attack/defense

### Adding Enemies (`src/data/enemies.ts`)

Enemies are organized by difficulty:

```typescript
ENEMIES.normal // Regular combat encounters
ENEMIES.elite // Harder mid-boss fights
ENEMIES.boss  // Final boss only
```

## 🛠️ Tech Stack

- **React 19** + TypeScript for UI and game logic
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **localStorage** for persistent unlocks between runs
- **PWA-ready** for home screen installation

## 📦 Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 🎯 Packaging for Native Apps (Future)

This project is ready for Capacitor when you want native iOS/Android apps:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npm run build
npx cap sync
npx cap open ios  # or android
```

## 🎲 Game Progression

Progress is saved in localStorage:
- `tavern_tactics_heroes` - Unlocked heroes
- `tavern_tactics_cards` - Unlocked cards

Start with 4 heroes and 8 cards unlocked. Beating the boss unlocks more content!

## 📝 Notes for Future Development

### Easy Improvements:
1. More heroes, cards, and enemy types
2. Hero abilities that trigger during auto-combat
3. Equipment/item system between runs
4. Multiple dungeons with different themes
5. Achievements and meta-progression
6. Sound effects and music
7. Better animations with CSS transitions
8. Save/load multiple runs

### Code Organization:
- `src/data/` - All game content (heroes, cards, enemies)
- `src/components/` - UI screens (Map, Shop, Combat, etc.)
- `src/contexts/` - Game state management
- `src/utils/` - Game logic helpers

## 🐛 Known Limitations

- Auto-combat is simplified (no positioning, abilities, or complex AI)
- Cards are instant effects (no ongoing effects)
- Hero combining/leveling is not yet implemented
- No animations for attacks/damage
- Shop doesn't refresh hero pool when you buy duplicates

These are all intentional simplifications for v1 - the foundation is solid for expansion!

---

**Have fun conquering dungeons!** ⚔️🏰✨
