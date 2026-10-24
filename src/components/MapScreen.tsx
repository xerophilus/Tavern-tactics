import { useGame } from '../contexts/GameContext';

export default function MapScreen() {
  const { state, selectRoom } = useGame();
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'combat': return 'bg-gradient-to-br from-red-700 to-red-900 border-red-500';
      case 'shop': return 'bg-gradient-to-br from-yellow-600 to-yellow-800 border-yellow-400';
      case 'rest': return 'bg-gradient-to-br from-green-700 to-green-900 border-green-500';
      case 'elite': return 'bg-gradient-to-br from-purple-700 to-purple-900 border-purple-500';
      case 'boss': return 'bg-gradient-to-br from-red-950 to-black border-red-600';
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
    
    // First layer is always available
    if (state.round === 1) {
      const firstLayerIds = ['node_0', 'node_1', 'node_2'];
      return firstLayerIds.includes(node.id);
    }
    
    // Check if any connected previous node is completed
    const previousLayerNodes = state.map.filter(n => 
      n.connections.includes(node.id)
    );
    
    return previousLayerNodes.some(n => n.completed);
  };
  
  // Group nodes into layers by checking their position in the map
  const layers: typeof state.map[number][][] = [];
  const nodeToLayer = new Map<string, number>();
  
  // Build layers using BFS from first nodes
  const firstNodes = state.map.filter(n => {
    const hasNoPrevious = !state.map.some(other => other.connections.includes(n.id));
    return hasNoPrevious;
  });
  
  let currentLayerNodes = firstNodes;
  let layerIndex = 0;
  
  while (currentLayerNodes.length > 0) {
    layers.push(currentLayerNodes);
    currentLayerNodes.forEach(n => nodeToLayer.set(n.id, layerIndex));
    
    // Find next layer
    const nextLayerIds = new Set<string>();
    currentLayerNodes.forEach(node => {
      node.connections.forEach(id => nextLayerIds.add(id));
    });
    
    currentLayerNodes = Array.from(nextLayerIds)
      .map(id => state.map.find(n => n.id === id))
      .filter((n): n is typeof state.map[number] => n !== undefined);
    
    layerIndex++;
  }
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-tavern-darkest via-tavern-dark to-tavern-wood safe-area-inset w-full" style={{ width: '100%', maxWidth: '100%' }}>
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
      <div className="text-center py-3">
        <h2 className="text-xl font-display font-bold text-tavern-gold-light">
          Choose Your Path
        </h2>
        <div className="h-0.5 w-20 mx-auto mt-2 bg-gradient-to-r from-transparent via-tavern-gold to-transparent" />
      </div>
      
      {/* Map - Branching structure */}
      <div className="flex-1 flex flex-col justify-start px-3 py-2 overflow-y-auto gap-6">
        {layers.map((layer, layerIdx) => (
          <div key={layerIdx} className="relative">
            {/* Nodes in this layer */}
            <div className="flex justify-center items-center gap-3" style={{ minHeight: '100px' }}>
              {layer.map(node => {
                const selectable = canSelectNode(node);
                return (
                  <button
                    key={node.id}
                    onClick={() => selectable && selectRoom(node.id)}
                    disabled={!selectable || node.completed}
                    className={`
                      relative flex-1 max-w-[80px] h-24 rounded-2xl flex flex-col items-center justify-center text-3xl
                      border-4 shadow-card
                      ${getNodeColor(node.type)}
                      ${node.completed ? 'opacity-40 grayscale' : selectable ? 'opacity-100' : 'opacity-30'}
                      ${selectable && !node.completed ? 'ring-4 ring-tavern-gold-light scale-105 animate-bounce-subtle' : ''}
                      transition-all duration-200 active:scale-95
                      disabled:cursor-not-allowed
                    `}
                  >
                    <span className="drop-shadow-lg relative z-10 text-4xl">{getNodeEmoji(node.type)}</span>
                    <span className="text-[10px] text-white font-display font-semibold mt-1">
                      {node.type === 'boss' ? 'BOSS' : ''}
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {node.completed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
                        <span className="text-5xl text-green-400">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Hint */}
      <div className="text-center py-3 px-4 text-tavern-parchment-dark text-xs font-display">
        {state.round === 1 ? 'Choose your first encounter' : 'Tap a glowing node to continue'}
      </div>
    </div>
  );
}
