import { useGame } from '../contexts/GameContext';

export default function MapScreen() {
  const { state, selectRoom } = useGame();
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'combat': return 'from-red-700 to-red-900 border-red-500';
      case 'shop': return 'from-yellow-600 to-yellow-800 border-yellow-400';
      case 'rest': return 'from-green-700 to-green-900 border-green-500';
      case 'elite': return 'from-purple-700 to-purple-900 border-purple-500';
      case 'boss': return 'from-red-950 to-black border-red-600';
      default: return 'from-tavern-wood to-tavern-wood-light border-tavern-copper';
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
  
  // Group nodes into layers
  const layers: typeof state.map[number][][] = [];
  const nodeToLayer = new Map<string, number>();
  
  const firstNodes = state.map.filter(n => {
    const hasNoPrevious = !state.map.some(other => other.connections.includes(n.id));
    return hasNoPrevious;
  });
  
  let currentLayerNodes = firstNodes;
  let layerIndex = 0;
  
  while (currentLayerNodes.length > 0) {
    layers.push(currentLayerNodes);
    currentLayerNodes.forEach(n => nodeToLayer.set(n.id, layerIndex));
    
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
      <div className="text-center py-2">
        <h2 className="text-lg font-display font-bold text-tavern-gold-light">
          Choose Your Path
        </h2>
      </div>
      
      {/* Map - Slay-the-Spire style with BIG nodes */}
      <div className="flex-1 flex flex-col justify-start px-4 py-2 overflow-y-auto space-y-8">
        {layers.map((layer, layerIdx) => (
          <div key={layerIdx} className="relative">
            {/* Connecting lines to previous layer */}
            {layerIdx > 0 && (
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ transform: 'translateY(-4rem)' }}>
                {layers[layerIdx - 1].map((prevNode, prevIdx) => 
                  prevNode.connections
                    .map(connId => layer.findIndex(n => n.id === connId))
                    .filter(idx => idx !== -1)
                    .map(currIdx => {
                      const prevTotal = layers[layerIdx - 1].length;
                      const currTotal = layer.length;
                      const x1 = (100 / (prevTotal + 1)) * (prevIdx + 1);
                      const x2 = (100 / (currTotal + 1)) * (currIdx + 1);
                      return (
                        <line
                          key={`${prevNode.id}-${layer[currIdx].id}`}
                          x1={`${x1}%`}
                          y1="70%"
                          x2={`${x2}%`}
                          y2="30%"
                          stroke={prevNode.completed ? '#d4af37' : '#666'}
                          strokeWidth="3"
                          strokeLinecap="round"
                          opacity={prevNode.completed ? '0.8' : '0.3'}
                        />
                      );
                    })
                )}
              </svg>
            )}
            
            {/* Nodes in this layer */}
            <div className="flex justify-center items-center gap-4">
              {layer.map(node => {
                const selectable = canSelectNode(node);
                const colors = getNodeColor(node.type);
                return (
                  <button
                    key={node.id}
                    onClick={() => selectable && selectRoom(node.id)}
                    disabled={!selectable || node.completed}
                    className={`
                      relative w-20 h-20 rounded-full flex flex-col items-center justify-center
                      border-4 shadow-2xl
                      bg-gradient-to-br ${colors}
                      ${node.completed ? 'opacity-40 grayscale' : selectable ? 'opacity-100' : 'opacity-30'}
                      ${selectable && !node.completed ? 'ring-4 ring-tavern-gold-light scale-110 shadow-[0_0_20px_rgba(212,175,55,0.6)]' : ''}
                      transition-all duration-200 active:scale-95
                      disabled:cursor-not-allowed
                    `}
                  >
                    <span className="drop-shadow-lg text-4xl">{getNodeEmoji(node.type)}</span>
                    
                    {node.completed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                        <span className="text-4xl text-green-400">✓</span>
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
