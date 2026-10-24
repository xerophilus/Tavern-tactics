import { useGame } from '../contexts/GameContext';

export default function MapScreen() {
  const { state, selectRoom } = useGame();
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'combat': return 'bg-gradient-to-br from-red-700 to-red-900 border-red-600';
      case 'shop': return 'bg-gradient-to-br from-tavern-gold to-tavern-copper border-tavern-gold-light';
      case 'rest': return 'bg-gradient-to-br from-green-700 to-green-900 border-green-600';
      case 'elite': return 'bg-gradient-to-br from-purple-700 to-purple-900 border-purple-600';
      case 'boss': return 'bg-gradient-to-br from-red-950 to-black border-red-700';
      default: return 'bg-tavern-wood border-tavern-copper';
    }
  };
  
  const getNodeEmoji = (type: string) => {
    switch (type) {
      case 'combat': return '⚔️';
      case 'shop': return '🏪';
      case 'rest': return '🛌';
      case 'elite': return '💀';
      case 'boss': return '🐉';
      default: return '❓';
    }
  };
  
  const canSelectNode = (node: typeof state.map[number]) => {
    if (node.completed) return false;
    if (state.round === 1) return node.id === 'node_0' || node.id === 'node_1' || node.id === 'node_2';
    
    const previousLayerNodes = state.map.filter(n => {
      return n.connections.includes(node.id);
    });
    
    return previousLayerNodes.some(n => n.completed);
  };
  
  const layers: typeof state.map[number][][] = [];
  let currentLayer: typeof state.map[number][] = [];
  
  state.map.forEach((node, idx) => {
    if (idx === 0) {
      currentLayer = [node];
    } else if (node.connections.toString() === state.map[idx - 1]?.connections.toString()) {
      currentLayer.push(node);
    } else {
      layers.push([...currentLayer]);
      currentLayer = [node];
    }
  });
  if (currentLayer.length > 0) layers.push(currentLayer);
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-tavern-darkest via-tavern-dark to-tavern-wood safe-area-inset">
      {/* Top Stats */}
      <div className="panel m-2 p-3">
        <div className="flex justify-between text-tavern-parchment items-center">
          <div className="stat-badge text-sm">❤️ {state.health}/{state.maxHealth}</div>
          <div className="text-2xl font-display font-black text-tavern-gold-light">
            💰 {state.gold}
          </div>
          <div className="stat-badge text-sm">🎯 Round {state.round}</div>
        </div>
      </div>
      
      {/* Title */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-display font-bold text-tavern-gold-light">
          Choose Your Path
        </h2>
        <div className="h-0.5 w-24 mx-auto mt-2 bg-gradient-to-r from-transparent via-tavern-gold to-transparent" />
      </div>
      
      {/* Map */}
      <div className="flex-1 flex flex-col justify-around px-4 py-2 overflow-y-auto">
        {layers.map((layer, layerIdx) => (
          <div key={layerIdx} className="flex justify-center gap-4 py-2">
            {layer.map(node => {
              const selectable = canSelectNode(node);
              return (
                <button
                  key={node.id}
                  onClick={() => selectable && selectRoom(node.id)}
                  disabled={!selectable || node.completed}
                  className={`
                    relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl
                    border-4 shadow-card
                    ${getNodeColor(node.type)}
                    ${node.completed ? 'opacity-30 grayscale' : selectable ? 'opacity-100' : 'opacity-40'}
                    ${selectable && !node.completed ? 'scale-110 ring-4 ring-tavern-gold-light animate-bounce-subtle' : ''}
                    transition-all duration-200 active:scale-95
                    disabled:cursor-not-allowed
                  `}
                >
                  <span className="drop-shadow-lg relative z-10">{getNodeEmoji(node.type)}</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {node.completed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                      <span className="text-4xl">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Connection lines hint */}
      <div className="text-center py-2 px-4 text-tavern-parchment-dark text-xs font-display opacity-60">
        Tap a highlighted node to continue
      </div>
    </div>
  );
}
