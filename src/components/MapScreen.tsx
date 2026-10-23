import { useGame } from '../contexts/GameContext';

export default function MapScreen() {
  const { state, selectRoom } = useGame();
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'combat': return 'bg-red-600';
      case 'shop': return 'bg-yellow-600';
      case 'rest': return 'bg-green-600';
      case 'elite': return 'bg-purple-600';
      case 'boss': return 'bg-red-900';
      default: return 'bg-gray-600';
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
  
  const canSelectNode = (node: typeof state.map[0]) => {
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
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900 p-4 overflow-y-auto">
      <div className="mb-4 bg-slate-700 p-3 rounded-lg">
        <div className="flex justify-between text-white text-sm">
          <div>❤️ {state.health}/{state.maxHealth}</div>
          <div>💰 {state.gold}</div>
          <div>🎯 Round {state.round}</div>
        </div>
      </div>
      
      <div className="text-center text-white mb-4">
        <h2 className="text-xl font-bold">Choose Your Path</h2>
      </div>
      
      <div className="flex-1 flex flex-col justify-around space-y-4 pb-4">
        {layers.map((layer, layerIdx) => (
          <div key={layerIdx} className="flex justify-center gap-4">
            {layer.map(node => {
              const selectable = canSelectNode(node);
              return (
                <button
                  key={node.id}
                  onClick={() => selectable && selectRoom(node.id)}
                  disabled={!selectable || node.completed}
                  className={`
                    ${getNodeColor(node.type)}
                    ${node.completed ? 'opacity-30' : selectable ? 'opacity-100' : 'opacity-50'}
                    ${selectable && !node.completed ? 'scale-110 ring-4 ring-yellow-400' : ''}
                    w-16 h-16 rounded-full flex items-center justify-center text-2xl
                    transition-all duration-200 active:scale-95
                    disabled:cursor-not-allowed
                  `}
                >
                  {getNodeEmoji(node.type)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
