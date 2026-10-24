import { useState } from 'react';
import { GameProvider, useGame } from './contexts/GameContext';
import TitleScreen from './components/TitleScreen';
import MapScreen from './components/MapScreen';
import ShopScreen from './components/ShopScreen';
import CombatScreen from './components/CombatScreen';
import VictoryScreen from './components/VictoryScreen';
import DefeatScreen from './components/DefeatScreen';

function GameContent() {
  const { state } = useGame();
  const [hasStarted, setHasStarted] = useState(false);
  
  if (!hasStarted) {
    return <TitleScreen onStart={() => setHasStarted(true)} />;
  }
  
  switch (state.phase) {
    case 'map':
      return <MapScreen />;
    case 'shop':
      return <ShopScreen />;
    case 'combat':
      return <CombatScreen />;
    case 'victory':
      return <VictoryScreen />;
    case 'defeat':
      return <DefeatScreen />;
    default:
      return <MapScreen />;
  }
}

function App() {
  return (
    <GameProvider>
      <div className="fixed inset-0 bg-tavern-darkest overflow-hidden">
        <div className="h-full max-w-md mx-auto relative bg-gradient-to-b from-tavern-darkest to-tavern-dark">
          <GameContent />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
