import { useGame } from '../contexts/GameContext';
import { calculateSynergies, getSynergyBonuses } from '../utils/gameLogic';
import { HeroCard } from './HeroCard';

export default function ShopScreen() {
  const { state, buyHero, sellHero, placeHero, removeHero, refreshShop, selectRoom } = useGame();
  
  const synergies = calculateSynergies(state.board);
  const bonuses = getSynergyBonuses(synergies);
  
  const isInitialShop = !state.currentRoom;
  const hasHeroes = state.board.some(h => h !== null);
  
  const handleProceed = () => {
    if (!hasHeroes) return; // Safety check
    
    if (isInitialShop) {
      // Go to map for first time
      selectRoom('map');
    } else {
      // Find next room after combat
      const nextRooms = state.map.filter(r => 
        !r.completed && state.map.some(prev => 
          prev.completed && prev.connections.includes(r.id)
        )
      );
      
      if (nextRooms.length > 0) {
        selectRoom(nextRooms[0].id);
      }
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-tavern-dark via-tavern-wood to-tavern-dark safe-area-inset" style={{ width: '100%', maxWidth: '100%' }}>
      {/* Top Stats Bar */}
      <div className="panel m-2 p-3 space-y-2">
        <div className="flex justify-between items-center text-tavern-parchment">
          <div className="stat-badge text-sm">❤️ {state.health}/{state.maxHealth}</div>
          <div className="text-2xl font-display font-black text-tavern-gold-light">
            💰 {state.gold}
          </div>
          <div className="stat-badge text-sm">🎯 Round {state.round}</div>
        </div>
        
        {bonuses.length > 0 && (
          <div className="border-t border-tavern-copper/30 pt-2 space-y-1">
            {bonuses.map((b, i) => (
              <div key={i} className="text-xs text-tavern-gold-light font-display">
                ✨ {b}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Board Area */}
      <div className="panel m-2 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-tavern-gold font-display font-semibold text-sm">
            Your Party
          </div>
          {state.board.some(h => h !== null) && (
            <div className="text-tavern-parchment-dark text-[9px] font-display">
              Tap to remove ↓
            </div>
          )}
        </div>
        <div className="flex justify-center gap-2">
          {state.board.map((hero, idx) => (
            <div key={idx} className="relative">
              {hero ? (
                <HeroCard 
                  hero={hero} 
                  onClick={() => removeHero(idx)}
                  size="medium"
                />
              ) : (
                <div className="card-slot w-20 h-28 flex items-center justify-center relative">
                  <span className="text-tavern-copper/50 text-3xl">+</span>
                  {state.bench.length > 0 && (
                    <div className="absolute -bottom-2 left-0 right-0 flex justify-center text-green-400 text-xs animate-bounce">
                      ↓
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Shop */}
      <div className="flex-1 panel m-2 p-3 overflow-y-auto space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-tavern-gold font-display font-bold text-lg">Tavern Shop</h3>
            <p className="text-tavern-parchment-dark text-[10px] font-display">
              Tap to recruit heroes
            </p>
          </div>
          <button
            onClick={refreshShop}
            disabled={state.gold < 2}
            className="btn-secondary text-sm"
          >
            🔄 Refresh (2💰)
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {state.shop.map((hero, idx) => (
            <button
              key={idx}
              onClick={() => buyHero(hero)}
              disabled={state.gold < hero.cost}
              className="panel p-3 space-y-2 active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group"
            >
              {/* Purchase flash animation */}
              <div className="absolute inset-0 bg-tavern-gold opacity-0 group-active:opacity-30 transition-opacity duration-150" />
              
              <div className="flex items-center gap-2 relative z-10">
                <div className="text-3xl">{hero.emoji}</div>
                <div className="flex-1 text-left">
                  <div className="text-tavern-parchment text-xs font-display font-bold leading-tight">
                    {hero.name}
                  </div>
                  <div className="text-tavern-parchment-dark text-[10px] font-display">
                    {hero.class} • {hero.race}
                  </div>
                </div>
                <div className="text-tavern-gold-light font-display font-black text-lg">
                  {hero.cost}💰
                </div>
              </div>
              <div className="flex gap-1 justify-center relative z-10">
                <span className="stat-badge text-[10px]">❤️{hero.stats.health}</span>
                <span className="stat-badge text-[10px]">⚔️{hero.stats.attack}</span>
                <span className="stat-badge text-[10px]">🛡️{hero.stats.defense}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Bench */}
        <div className="panel p-3 space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-tavern-gold font-display font-semibold text-sm">
              Bench ({state.bench.length}/8)
            </div>
            {state.bench.length > 0 && (
              <div className="text-tavern-parchment-dark text-[9px] font-display animate-pulse">
                Tap to add to party ↑
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {state.bench.map((hero, idx) => (
              <div key={idx} className="relative">
                <HeroCard
                  hero={hero}
                  onClick={() => {
                    const emptySlot = state.board.findIndex(h => h === null);
                    if (emptySlot !== -1) placeHero(idx, emptySlot);
                  }}
                  size="small"
                  showStats={false}
                />
                {/* Up arrow indicator */}
                {state.board.some(h => h === null) && (
                  <div className="absolute -top-2 left-0 right-0 flex justify-center pointer-events-none">
                    <div className="text-green-400 text-xs animate-bounce">↑</div>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sellHero(idx);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg border border-red-400 z-20"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Ready Button */}
      <div className="p-3 space-y-2">
        {!hasHeroes && (
          <div className="text-center text-tavern-gold text-sm font-display animate-pulse">
            👆 Tap heroes above to recruit them!
          </div>
        )}
        <button
          onClick={handleProceed}
          disabled={!hasHeroes}
          className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isInitialShop ? '🗺️ Enter Dungeon' : '⚔️ Continue'}
        </button>
      </div>
    </div>
  );
}
