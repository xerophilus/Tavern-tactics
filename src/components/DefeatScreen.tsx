import { useGame } from '../contexts/GameContext';

export default function DefeatScreen() {
  const { startNewRun, state } = useGame();
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-red-900 to-gray-900 p-6 text-center">
      <div className="text-8xl mb-6">💀</div>
      <h1 className="text-4xl font-bold text-white mb-4">Defeated</h1>
      <p className="text-red-200 text-lg mb-4">
        Your party has fallen...
      </p>
      <div className="bg-gray-800 p-4 rounded-lg mb-8 text-gray-200">
        <p className="text-sm">You reached Round {state.round}</p>
        <p className="text-sm">Better luck next time, adventurer!</p>
      </div>
      <button
        onClick={startNewRun}
        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-bold active:scale-95 transition-transform"
      >
        Try Again ⚔️
      </button>
    </div>
  );
}
