interface TitleScreenProps {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-tavern-darkest via-tavern-dark to-tavern-wood p-safe" style={{ width: '100%', maxWidth: '100%' }}>
      {/* Decorative top bar */}
      <div className="h-1 bg-gradient-to-r from-transparent via-tavern-gold to-transparent" />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8">
        {/* Logo/Title Section */}
        <div className="text-center space-y-3 animate-slide-down">
          <div className="text-7xl mb-4 drop-shadow-2xl animate-bounce-subtle">🏰</div>
          <h1 className="text-5xl font-display font-black text-tavern-gold-light tracking-tight leading-none">
            Tavern Tactics
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-tavern-gold to-transparent" />
          <p className="text-tavern-parchment-dark text-sm font-display italic">
            Build • Battle • Conquer
          </p>
        </div>
        
        {/* How to Play Panel */}
        <div className="panel p-5 max-w-sm w-full space-y-3 animate-slide-up">
          <h2 className="text-tavern-gold font-display font-bold text-lg text-center border-b border-tavern-copper/30 pb-2">
            How to Play
          </h2>
          <ul className="space-y-2.5 text-sm text-tavern-parchment">
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🏪</span>
              <div>
                <span className="font-display font-semibold text-tavern-gold-light">Shop:</span>
                <span className="text-tavern-parchment-dark"> Buy heroes, combine 3 for upgrades</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">⚔️</span>
              <div>
                <span className="font-display font-semibold text-tavern-gold-light">Combat:</span>
                <span className="text-tavern-parchment-dark"> Play cards, watch the battle unfold</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✨</span>
              <div>
                <span className="font-display font-semibold text-tavern-gold-light">Synergy:</span>
                <span className="text-tavern-parchment-dark"> Match classes & races for bonuses</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🗺️</span>
              <div>
                <span className="font-display font-semibold text-tavern-gold-light">Map:</span>
                <span className="text-tavern-parchment-dark"> Choose your path through the dungeon</span>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Start Button */}
        <button
          onClick={onStart}
          className="btn-primary px-12 py-4 text-xl animate-pulse hover:animate-none w-full max-w-xs"
        >
          ⚔️ Start Adventure
        </button>
        
        {/* Footer */}
        <div className="text-tavern-parchment-dark text-xs font-display text-center pt-4 opacity-60">
          Best played in portrait mode
        </div>
      </div>
      
      {/* Decorative bottom bar */}
      <div className="h-1 bg-gradient-to-r from-transparent via-tavern-gold to-transparent" />
    </div>
  );
}
