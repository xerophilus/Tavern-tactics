import { useGame } from '../contexts/GameContext';

export default function VictoryScreen() {
  const { startNewRun } = useGame();
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-tavern-gold/20 via-tavern-dark to-tavern-darkest p-6 text-center safe-area-inset">
      <div className="space-y-6 animate-slide-up">
        <div className="text-8xl mb-6 animate-bounce-subtle drop-shadow-2xl">🏆</div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-display font-black text-tavern-gold-light tracking-tight">
            Victory!
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-tavern-gold to-transparent" />
        </div>
        
        <p className="text-tavern-parchment text-lg font-display max-w-sm">
          You've conquered the dungeon and defeated Shadowfang the Destroyer!
        </p>
        
        <div className="panel p-5 max-w-sm space-y-2">
          <div className="text-tavern-gold-light font-display font-bold border-b border-tavern-copper/30 pb-2">
            Rewards Unlocked
          </div>
          <p className="text-tavern-parchment text-sm">
            New heroes and powerful cards await you in the tavern!
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <span className="text-3xl">🗿</span>
            <span className="text-3xl">🔮</span>
            <span className="text-3xl">🔥</span>
          </div>
        </div>
        
        <button
          onClick={startNewRun}
          className="btn-primary px-10 py-4 text-xl"
        >
          ⚔️ New Run
        </button>
      </div>
    </div>
  );
}
