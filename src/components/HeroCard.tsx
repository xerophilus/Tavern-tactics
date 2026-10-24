import type { Hero } from '../data/types';
import { StarDisplay } from './StarDisplay';

interface HeroCardProps {
  hero: Hero;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  showStats?: boolean;
  disabled?: boolean;
}

export function HeroCard({ hero, onClick, size = 'medium', showStats = true, disabled = false }: HeroCardProps) {
  const sizeClasses = {
    small: 'w-16 h-20',
    medium: 'w-20 h-28',
    large: 'w-24 h-32',
  };
  
  const emojiSizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl',
  };
  
  const rarityColor = hero.stars === 3 ? 'from-rarity-legendary/20' : hero.stars === 2 ? 'from-rarity-rare/20' : 'from-rarity-common/20';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        hero-card ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex flex-col items-center justify-between p-2
        bg-gradient-to-b ${rarityColor} to-tavern-wood
      `}
    >
      <div className="hero-card-frame" />
      
      {/* Stars at top */}
      {hero.stars > 1 && (
        <div className="absolute top-0 left-0 right-0 flex justify-center -mt-1 z-10">
          <div className="bg-black/80 px-2 py-0.5 rounded-b-lg border border-t-0 border-tavern-gold/50">
            <StarDisplay stars={hero.stars} size="sm" />
          </div>
        </div>
      )}
      
      {/* Hero Icon/Emoji */}
      <div className={`${emojiSizes[size]} mt-2 drop-shadow-lg relative z-10`}>
        {hero.emoji}
      </div>
      
      {/* Hero Name */}
      <div className="text-center flex-1 flex items-center relative z-10">
        <div className="text-[10px] font-display font-bold text-tavern-parchment leading-tight drop-shadow-md">
          {hero.name.split(' ')[0]}
        </div>
      </div>
      
      {/* Stats */}
      {showStats && size !== 'small' && (
        <div className="flex gap-1 text-[9px] relative z-10">
          <span className="stat-badge">❤️{hero.stats.health}</span>
          <span className="stat-badge">⚔️{hero.stats.attack}</span>
          <span className="stat-badge">🛡️{hero.stats.defense}</span>
        </div>
      )}
      
      {/* Class/Race badges */}
      {size === 'large' && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-1 bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-[8px] px-1.5 py-0.5 bg-tavern-copper/30 rounded text-tavern-parchment border border-tavern-copper/50">
            {hero.class}
          </span>
          <span className="text-[8px] px-1.5 py-0.5 bg-tavern-bronze/30 rounded text-tavern-parchment border border-tavern-bronze/50">
            {hero.race}
          </span>
        </div>
      )}
    </button>
  );
}
