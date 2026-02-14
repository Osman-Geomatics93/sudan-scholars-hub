// Focus Island — Growth point calculations, building unlock logic, weather, themes

export interface Building {
  type: string;
  emoji: string;
  level: number;
  position: { row: number; col: number };
}

const BUILDING_SCHEDULE: { level: number; type: string; emoji: string; position: { row: number; col: number } }[] = [
  { level: 1,  type: 'Small Tree',      emoji: '🌳', position: { row: 2, col: 3 } },
  { level: 2,  type: 'Flower Patch',    emoji: '🌸', position: { row: 4, col: 5 } },
  { level: 3,  type: 'Cottage',         emoji: '🏠', position: { row: 1, col: 1 } },
  { level: 5,  type: 'Pond',            emoji: '🏊', position: { row: 5, col: 2 } },
  { level: 7,  type: 'Library',         emoji: '📚', position: { row: 0, col: 4 } },
  { level: 10, type: 'Lighthouse',      emoji: '🗼', position: { row: 0, col: 7 } },
  { level: 13, type: 'Garden Maze',     emoji: '🌿', position: { row: 3, col: 0 } },
  { level: 15, type: 'Observatory',     emoji: '🔭', position: { row: 0, col: 0 } },
  { level: 20, type: 'Castle',          emoji: '🏰', position: { row: 1, col: 6 } },
  { level: 25, type: 'Dragon Nest',     emoji: '🐉', position: { row: 5, col: 7 } },
  { level: 30, type: 'Legendary Statue', emoji: '🗿', position: { row: 3, col: 3 } },
];

const THEME_UNLOCKS: Record<string, number> = {
  forest: 0,
  ocean: 5,
  desert: 10,
  space: 20,
};

/**
 * Calculate growth points earned from a study session
 */
export function calculateGrowth(studyMinutes: number, streak: number): number {
  let multiplier = 1;
  if (streak >= 15) multiplier = 3;
  else if (streak >= 8) multiplier = 2;
  else if (streak >= 3) multiplier = 1.5;

  return Math.floor(studyMinutes * multiplier);
}

/**
 * Get the growth points required for a specific level
 */
export function getPointsForLevel(level: number): number {
  return level * 100;
}

/**
 * Calculate the current level based on cumulative growth points
 */
export function getLevelFromPoints(growthPoints: number): number {
  let level = 1;
  let cumulative = 0;
  while (true) {
    cumulative += getPointsForLevel(level);
    if (growthPoints < cumulative) break;
    level++;
  }
  return level;
}

/**
 * Get cumulative points needed to reach a level
 */
export function getCumulativePointsForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getPointsForLevel(i);
  }
  return total;
}

/**
 * Get buildings unlocked at or below the given level
 */
export function getUnlockedBuildings(level: number): Building[] {
  return BUILDING_SCHEDULE
    .filter(b => b.level <= level)
    .map(b => ({ type: b.type, emoji: b.emoji, level: b.level, position: b.position }));
}

/**
 * Get the full building schedule (for gallery display)
 */
export function getAllBuildings(): (Building & { level: number })[] {
  return BUILDING_SCHEDULE.map(b => ({
    type: b.type,
    emoji: b.emoji,
    level: b.level,
    position: b.position,
  }));
}

/**
 * Get weather based on study streak
 */
export function getWeather(streak: number): { weather: string; emoji: string; label: string } {
  if (streak >= 15) return { weather: 'sunny', emoji: '☀️', label: 'Sunny' };
  if (streak >= 8)  return { weather: 'partly-sunny', emoji: '🌤️', label: 'Partly Sunny' };
  if (streak >= 4)  return { weather: 'cloudy', emoji: '☁️', label: 'Cloudy' };
  if (streak >= 1)  return { weather: 'rainy', emoji: '🌧️', label: 'Rainy' };
  return { weather: 'stormy', emoji: '⛈️', label: 'Stormy' };
}

/**
 * Get themes available at the given level
 */
export function getAvailableThemes(level: number): { theme: string; unlocked: boolean; requiredLevel: number }[] {
  return Object.entries(THEME_UNLOCKS).map(([theme, reqLevel]) => ({
    theme,
    unlocked: level >= reqLevel,
    requiredLevel: reqLevel,
  }));
}
