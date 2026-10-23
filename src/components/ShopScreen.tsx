import { useGame } from '../contexts/GameContext';
import { Hero } from '../data/types';
import { calculateSynergies, getSynergyBonuses } from '../utils/gameLogic';
import { StarDisplay } from './StarDisplay';

export default function ShopScreen() {
  const { state, buyHero, sellHero, placeHero, removeHero, refreshShop, selectRoom } = useGame();
  
  const synergies = calculateSynergies(state.board);
  const bonuses = getSynergyBonuses(synergies);
  
  const handleProceed = () => {
    const nextRooms = state.map.filter(r => 
      !r.completed && state.map.some(prev => 
        prev.completed && prev.connections.includes(r.id)
      )
    );
    
    if (nextRooms.length > 0) {
      selectRoom(nextRooms[0].id);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-amber-900 to-amber-950">
      {/* Top Section - Stats */}
      <div className="bg-amber-800 p-3 shadow-lg">
        <div className="flex justify-between text-white text-sm mb-2">
          <div>❤️ {state.health}/{state.maxHealth}</div>
          <div className="font-bold text-lg">💰 {state.gold}</div>
          <div>🎯 Round {state.round}</div>
        </div>
        {bonuses.length > 0 && (
          <div className="text-xs text-amber-200">
            {bonuses.map((b, i) => <div key={i}>✨ {b}</div>)}
          </div>
        )}
      </div>
      
      {/* Board Area */}
      <div className="bg-gradient-to-b from-slate-700 to-slate-800 p-3">
        <div className="text-white text-xs mb-2 text-center">Your Party</div>
        <div className="flex justify-center gap-2">
          {state.board.map((hero, idx) => (
            <div
              key={idx}
              onClick={() => hero && removeHero(idx)}
              className={`
                w-16 h-20 rounded-lg flex flex-col items-center justify-center text-2xl
                ${hero ? 'bg-blue-600 cursor-pointer active:scale-95' : 'bg-slate-600 border-2 border-dashed border-slate-500'}
                transition-all relative
              `}
            >
              {hero ? (
                <>
                  {hero.stars > 1 && (
                    <div className="absolute top-0 left-0 right-0 text-center">
                      <StarDisplay stars={hero.stars} />
                    </div>
                  )}
                  <div>{hero.emoji}</div>
                  <div className="text-[8px] text-white mt-1">{hero.name.split(' ')[0]}</div>
                </>
              ) : (
                <div className="text-slate-400">+</div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Shop */}
      <div className="flex-1 bg-amber-900 p-3 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-bold">Shop</h3>
          <button
            onClick={refreshShop}
            disabled={state.gold < 2}
            className="bg-amber-700 text-white px-3 py-1 rounded text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Refresh (2💰)
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {state.shop.map((hero, idx) => (
            <button
              key={idx}
              onClick={() => buyHero(hero)}
              disabled={state.gold < hero.cost}
              className="bg-amber-800 p-2 rounded-lg text-left active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl">{hero.emoji}</div>
                <div className="flex-1">
                  <div className="text-white text-xs font-bold">{hero.name}</div>
                  <div className="text-amber-300 text-[10px]">{hero.class} • {hero.race}</div>
                </div>
                <div className="text-yellow-400 font-bold">{hero.cost}💰</div>
              </div>
              <div className="text-[9px] text-amber-200">
                ❤️{hero.stats.health} ⚔️{hero.stats.attack} 🛡️{hero.stats.defense}
              </div>
            </button>
          ))}
        </div>
        
        {/* Bench */}
        <div className="bg-slate-800 p-2 rounded-lg">
          <div className="text-white text-xs mb-2">Bench ({state.bench.length}/8)</div>
          <div className="grid grid-cols-4 gap-2">
            {state.bench.map((hero, idx) => (
              <div key={idx} className="relative">
                <button
                  onClick={() => {
                    const emptySlot = state.board.findIndex(h => h === null);
                    if (emptySlot !== -1) placeHero(idx, emptySlot);
                  }}
                  className="w-full aspect-square bg-blue-600 rounded-lg flex flex-col items-center justify-center text-xl active:scale-95 relative"
                >
                  {hero.stars > 1 && (
                    <div className="absolute top-0 left-0 right-0 text-center">
                      <StarDisplay stars={hero.stars} />
                    </div>
                  )}
                  <div>{hero.emoji}</div>
                  <div className="text-[7px] text-white">{hero.name.split(' ')[0]}</div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sellHero(idx);
                  }}
                  className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="bg-amber-800 p-3">
        <button
          onClick={handleProceed}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold active:scale-95"
        >
          Ready for Battle ⚔️
        </button>
      </div>
    </div>
  );
}
