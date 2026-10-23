import { useGame } from '../contexts/GameContext';

export default function VictoryScreen() {
  const { startNewRun } = useGame();
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-yellow-600 to-yellow-800 p-6 text-center">
      <div className="text-8xl mb-6">🏆</div>
      <h1 className="text-4xl font-bold text-white mb-4">Victory!</h1>
      <p className="text-yellow-100 text-lg mb-8">
        You've conquered the dungeon and defeated Shadowfang!
      </p>
      <div className="bg-yellow-900 p-4 rounded-lg mb-8 text-yellow-100">
        <p className="text-sm">New heroes and cards have been unlocked!</p>
      </div>
      <button
        onClick={startNewRun}
        className="bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold active:scale-95 transition-transform"
      >
        New Run ⚔️
      </button>
    </div>
  );
}
