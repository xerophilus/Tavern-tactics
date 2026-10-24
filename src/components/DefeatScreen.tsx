import { useGame } from '../contexts/GameContext';

export default function DefeatScreen() {
  const { startNewRun, state } = useGame();
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-red-950 via-tavern-dark to-tavern-darkest p-6 text-center safe-area-inset">
      <div className="space-y-6 animate-slide-up">
        <div className="text-8xl mb-6 opacity-80 grayscale">💀</div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-display font-black text-red-400 tracking-tight">
            Defeated
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        </div>
        
        <p className="text-tavern-parchment-dark text-lg font-display max-w-sm">
          Your party has fallen in the depths of the dungeon...
        </p>
        
        <div className="panel p-5 max-w-sm space-y-2">
          <div className="text-tavern-parchment font-display font-semibold border-b border-tavern-copper/30 pb-2">
            Run Summary
          </div>
          <div className="space-y-1 text-tavern-parchment-dark text-sm">
            <div className="flex justify-between">
              <span>Round Reached:</span>
              <span className="font-display font-bold text-tavern-gold">{state.round}</span>
            </div>
            <div className="flex justify-between">
              <span>Gold Earned:</span>
              <span className="font-display font-bold text-tavern-gold">{state.gold}</span>
            </div>
          </div>
          <p className="text-xs text-tavern-parchment-dark pt-2 italic">
            "Return to the tavern, adventurer. There's always another quest."
          </p>
        </div>
        
        <button
          onClick={startNewRun}
          className="btn-primary px-10 py-4 text-xl"
        >
          ⚔️ Try Again
        </button>
      </div>
    </div>
  );
}
