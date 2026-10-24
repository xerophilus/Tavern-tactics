import { createContext, useContext, useState, type ReactNode } from 'react';
import type { GameState, Hero } from '../data/types';
import { CARDS } from '../data/cards';
import { generateShop, drawCards, generateMap, loadProgress } from '../utils/gameLogic';
import { createHeroInstance, checkAndCombineHeroes } from '../utils/heroLeveling';

interface GameContextType {
  state: GameState;
  startNewRun: () => void;
  buyHero: (hero: Hero) => void;
  sellHero: (index: number) => void;
  placeHero: (benchIndex: number, boardIndex: number) => void;
  removeHero: (boardIndex: number) => void;
  refreshShop: () => void;
  startCombat: (roomId: string) => void;
  playCard: (cardIndex: number, targetIndex?: number) => void;
  selectRoom: (roomId: string) => void;
  endCombat: (victory: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}

function createInitialState(): GameState {
  const progress = loadProgress();
  const map = generateMap();
  
  return {
    phase: 'shop',  // Start with shop to recruit heroes
    gold: 15,  // Extra gold for initial recruitment
    health: 100,
    maxHealth: 100,
    round: 1,
    board: Array(5).fill(null),
    bench: [],
    shop: generateShop(progress.heroes),  // Generate initial shop
    deck: [],
    hand: [],
    mana: 3,
    maxMana: 3,
    currentRoom: null,
    map,
    unlockedHeroes: progress.heroes,
    unlockedCards: progress.cards
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(createInitialState());

  const startNewRun = () => {
    setState(createInitialState());
  };

  const buyHero = (hero: Hero) => {
    if (state.gold >= hero.cost && state.bench.length < 8) {
      const newHero = createHeroInstance(hero);
      const allHeroes = [...state.board.filter((h): h is Hero => h !== null), ...state.bench, newHero];
      const { heroes: combinedHeroes } = checkAndCombineHeroes(allHeroes);
      
      const newBoard = state.board.map(slot => {
        if (slot === null) return null;
        const found = combinedHeroes.find(h => h.instanceId === slot.instanceId);
        return found || null;
      });
      
      const newBench = combinedHeroes.filter(h => 
        !newBoard.some(boardHero => boardHero?.instanceId === h.instanceId)
      );
      
      setState(prev => ({
        ...prev,
        gold: prev.gold - hero.cost,
        bench: newBench,
        board: newBoard,
        shop: prev.shop.filter(h => h.instanceId !== hero.instanceId)
      }));
    }
  };

  const sellHero = (index: number) => {
    const hero = state.bench[index];
    if (hero) {
      setState(prev => ({
        ...prev,
        gold: prev.gold + Math.floor(hero.cost * 0.7),
        bench: prev.bench.filter((_, i) => i !== index)
      }));
    }
  };

  const placeHero = (benchIndex: number, boardIndex: number) => {
    const hero = state.bench[benchIndex];
    if (hero && boardIndex >= 0 && boardIndex < 5) {
      const newBoard = [...state.board];
      const displaced = newBoard[boardIndex];
      newBoard[boardIndex] = hero;
      
      const newBench = state.bench.filter((_, i) => i !== benchIndex);
      if (displaced) newBench.push(displaced);
      
      setState(prev => ({ ...prev, board: newBoard, bench: newBench }));
    }
  };

  const removeHero = (boardIndex: number) => {
    const hero = state.board[boardIndex];
    if (hero) {
      setState(prev => ({
        ...prev,
        board: prev.board.map((h, i) => i === boardIndex ? null : h),
        bench: [...prev.bench, hero]
      }));
    }
  };

  const refreshShop = () => {
    if (state.gold >= 2) {
      setState(prev => ({
        ...prev,
        gold: prev.gold - 2,
        shop: generateShop(prev.unlockedHeroes)
      }));
    }
  };

  const startCombat = (roomId: string) => {
    const availableCards = CARDS.filter(c => state.unlockedCards.includes(c.id));
    const { drawn, remaining } = drawCards(availableCards, 3);
    
    setState(prev => ({
      ...prev,
      phase: 'combat',
      currentRoom: roomId,
      deck: remaining,
      hand: drawn,
      mana: prev.maxMana
    }));
  };

  const playCard = (cardIndex: number, _targetIndex?: number) => {
    const card = state.hand[cardIndex];
    if (card && state.mana >= card.manaCost) {
      setState(prev => ({
        ...prev,
        mana: prev.mana - card.manaCost,
        hand: prev.hand.filter((_, i) => i !== cardIndex)
      }));
    }
  };

  const selectRoom = (roomId: string) => {
    // Special case: going to map from initial shop
    if (roomId === 'map') {
      setState(prev => ({ ...prev, phase: 'map' }));
      return;
    }
    
    const room = state.map.find(r => r.id === roomId);
    if (!room) return;
    
    if (room.type === 'shop') {
      setState(prev => ({
        ...prev,
        phase: 'shop',
        currentRoom: roomId,
        shop: generateShop(prev.unlockedHeroes),
        gold: prev.gold + 10
      }));
    } else if (room.type === 'rest') {
      setState(prev => ({
        ...prev,
        health: Math.min(prev.health + 30, prev.maxHealth),
        map: prev.map.map(r => r.id === roomId ? { ...r, completed: true } : r),
        phase: 'map'
      }));
    } else {
      startCombat(roomId);
    }
  };

  const endCombat = (victory: boolean) => {
    if (victory) {
      const room = state.map.find(r => r.id === state.currentRoom);
      const goldReward = room?.type === 'boss' ? 20 : room?.type === 'elite' ? 15 : 10;
      
      setState(prev => ({
        ...prev,
        phase: 'map',
        gold: prev.gold + goldReward,
        round: prev.round + 1,
        map: prev.map.map(r => 
          r.id === prev.currentRoom ? { ...r, completed: true } : r
        )
      }));
    } else {
      setState(prev => ({ ...prev, phase: 'defeat' }));
    }
  };

  return (
    <GameContext.Provider value={{
      state,
      startNewRun,
      buyHero,
      sellHero,
      placeHero,
      removeHero,
      refreshShop,
      startCombat,
      playCard,
      selectRoom,
      endCombat
    }}>
      {children}
    </GameContext.Provider>
  );
}
