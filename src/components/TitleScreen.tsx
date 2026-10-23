import { useGame } from '../contexts/GameContext';

interface TitleScreenProps {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-900 via-blue-900 to-slate-900 p-6 text-center">
      <div className="text-6xl mb-4">🏰</div>
      <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
        Tavern Tactics
      </h1>
      <p className="text-purple-300 text-sm mb-8">
        Build your party • Cast spells • Conquer dungeons
      </p>
      
      <div className="bg-slate-800/80 p-4 rounded-lg mb-8 max-w-sm text-left">
        <h2 className="text-yellow-400 font-bold mb-2 text-center">How to Play</h2>
        <ul className="text-gray-200 text-sm space-y-2">
          <li>🏪 <span className="text-white">Shop:</span> Buy and place heroes</li>
          <li>⚔️ <span className="text-white">Combat:</span> Play cards, then auto-battle</li>
          <li>✨ <span className="text-white">Synergies:</span> Match classes & races for bonuses</li>
          <li>🗺️ <span className="text-white">Map:</span> Choose your path wisely</li>
        </ul>
      </div>
      
      <button
        onClick={onStart}
        className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-10 py-4 rounded-lg text-2xl font-bold active:scale-95 transition-transform shadow-lg"
      >
        Start Adventure
      </button>
      
      <div className="mt-8 text-gray-400 text-xs">
        Made for mobile • Portrait mode
      </div>
    </div>
  );
}
