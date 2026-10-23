import { Hero, BaseHero } from '../data/types';

export function createHeroInstance(baseHero: BaseHero): Hero {
  return {
    ...baseHero,
    stars: 1,
    instanceId: `${baseHero.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
}

export function upgradeHero(hero: Hero): Hero {
  const newStars = Math.min(3, hero.stars + 1) as 1 | 2 | 3;
  const statMultiplier = newStars === 2 ? 1.8 : 2.7;
  
  return {
    ...hero,
    stars: newStars,
    stats: {
      health: Math.round(hero.stats.health * (statMultiplier / (hero.stars === 1 ? 1 : 1.8))),
      attack: Math.round(hero.stats.attack * (statMultiplier / (hero.stars === 1 ? 1 : 1.8))),
      defense: Math.round(hero.stats.defense * (statMultiplier / (hero.stars === 1 ? 1 : 1.8)))
    },
    instanceId: `${hero.id}_${newStars}star_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
}

export function checkAndCombineHeroes(heroes: Hero[]): { heroes: Hero[], combined: boolean } {
  const heroGroups = new Map<string, Hero[]>();
  
  heroes.forEach(hero => {
    const key = `${hero.id}_${hero.stars}`;
    if (!heroGroups.has(key)) {
      heroGroups.set(key, []);
    }
    heroGroups.get(key)!.push(hero);
  });
  
  let combined = false;
  let result: Hero[] = [];
  
  heroGroups.forEach((group, key) => {
    const [baseId, starsStr] = key.split('_');
    const stars = parseInt(starsStr) as 1 | 2 | 3;
    
    if (group.length >= 3 && stars < 3) {
      const numUpgrades = Math.floor(group.length / 3);
      const remaining = group.length % 3;
      
      for (let i = 0; i < numUpgrades; i++) {
        result.push(upgradeHero(group[0]));
        combined = true;
      }
      
      result.push(...group.slice(group.length - remaining));
    } else {
      result.push(...group);
    }
  });
  
  if (combined) {
    return checkAndCombineHeroes(result);
  }
  
  return { heroes: result, combined };
}
