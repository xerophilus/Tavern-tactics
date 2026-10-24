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
      <div className="fixed inset-0 bg-tavern-darkest overflow-hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100dvh' }}>
        <div className="h-full w-full relative bg-gradient-to-b from-tavern-darkest to-tavern-dark" style={{ width: '100%', height: '100%', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <GameContent />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
