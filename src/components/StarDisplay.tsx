interface StarDisplayProps {
  stars: 1 | 2 | 3;
  size?: 'sm' | 'md';
}

export function StarDisplay({ stars, size = 'sm' }: StarDisplayProps) {
  const starChar = '⭐';
  const sizeClass = size === 'sm' ? 'text-[10px]' : 'text-xs';
  
  return (
    <div className={`${sizeClass} leading-none text-tavern-gold-light drop-shadow-lg`}>
      {starChar.repeat(stars)}
    </div>
  );
}
