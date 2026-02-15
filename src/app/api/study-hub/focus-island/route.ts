import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { triggerGrowthSchema, updateThemeSchema } from '@/lib/validations/focus-island';
import { awardPoints, POINT_VALUES } from '@/lib/points';
import {
  calculateGrowth,
  getUnlockedBuildings,
  getWeather,
  getAvailableThemes,
  getLevelFromPoints,
  getCumulativePointsForLevel,
  getPointsForLevel,
} from '@/lib/focus-island/growth';

export const dynamic = 'force-dynamic';

// GET — Return island state (auto-creates if none)
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    let island = await prisma.focusIsland.findUnique({ where: { userId } });
    if (!island) {
      const buildings = getUnlockedBuildings(1);
      island = await prisma.focusIsland.create({
        data: { userId, buildings: JSON.parse(JSON.stringify(buildings)) },
      });
    }

    // Fetch streak for weather
    const streak = await prisma.studyStreak.findUnique({ where: { userId } });
    const currentStreak = streak?.currentStreak || 0;
    const weatherInfo = getWeather(currentStreak);
    const unlockedBuildings = getUnlockedBuildings(island.level);
    const availableThemes = getAvailableThemes(island.level);
    const currentLevelCumulative = getCumulativePointsForLevel(island.level);
    const nextLevelTotal = currentLevelCumulative + getPointsForLevel(island.level);

    return NextResponse.json({
      island,
      weather: weatherInfo,
      streak: currentStreak,
      unlockedBuildings,
      availableThemes,
      nextLevelPoints: nextLevelTotal,
      currentLevelPoints: currentLevelCumulative,
    });
  } catch (err) {
    console.error('Error fetching focus island:', err);
    return NextResponse.json({ error: 'Failed to fetch island' }, { status: 500 });
  }
}

// POST — Trigger growth from study session
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = triggerGrowthSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Get or create island
    let island = await prisma.focusIsland.findUnique({ where: { userId } });
    if (!island) {
      const buildings = getUnlockedBuildings(1);
      island = await prisma.focusIsland.create({
        data: { userId, buildings: JSON.parse(JSON.stringify(buildings)) },
      });
    }

    // Calculate growth
    const streak = await prisma.studyStreak.findUnique({ where: { userId } });
    const currentStreak = streak?.currentStreak || 0;
    const growthEarned = calculateGrowth(result.data.studyMinutes, currentStreak);

    const newGrowthPoints = island.growthPoints + growthEarned;
    const newTotalStudyMin = island.totalStudyMin + result.data.studyMinutes;
    const oldLevel = island.level;
    const newLevel = getLevelFromPoints(newGrowthPoints);

    // Get new buildings
    const newBuildings = getUnlockedBuildings(newLevel);
    const weatherInfo = getWeather(currentStreak);

    // Update island
    const updatedIsland = await prisma.focusIsland.update({
      where: { userId },
      data: {
        growthPoints: newGrowthPoints,
        totalStudyMin: newTotalStudyMin,
        level: newLevel,
        buildings: JSON.parse(JSON.stringify(newBuildings)),
        weather: weatherInfo.weather,
      },
    });

    // Award points for level ups
    let pointsAwarded = 0;
    if (newLevel > oldLevel) {
      const levelsGained = newLevel - oldLevel;
      pointsAwarded = levelsGained * POINT_VALUES.ISLAND_LEVEL_UP;
      await awardPoints(userId, pointsAwarded);
    }

    return NextResponse.json({
      island: updatedIsland,
      growthEarned,
      leveledUp: newLevel > oldLevel,
      oldLevel,
      newLevel,
      pointsAwarded,
      weather: weatherInfo,
    });
  } catch (err) {
    console.error('Error triggering island growth:', err);
    return NextResponse.json({ error: 'Failed to trigger growth' }, { status: 500 });
  }
}

// DELETE — Reset island to level 1
export async function DELETE() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    const island = await prisma.focusIsland.findUnique({ where: { userId } });
    if (!island) {
      return NextResponse.json({ error: 'Island not found' }, { status: 404 });
    }

    const buildings = getUnlockedBuildings(1);
    const updated = await prisma.focusIsland.update({
      where: { userId },
      data: {
        level: 1,
        growthPoints: 0,
        totalStudyMin: 0,
        theme: 'forest',
        buildings: JSON.parse(JSON.stringify(buildings)),
        weather: 'sunny',
      },
    });

    return NextResponse.json({ island: updated });
  } catch (err) {
    console.error('Error resetting focus island:', err);
    return NextResponse.json({ error: 'Failed to reset island' }, { status: 500 });
  }
}

// PATCH — Change island theme
export async function PATCH(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = updateThemeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const island = await prisma.focusIsland.findUnique({ where: { userId } });
    if (!island) {
      return NextResponse.json({ error: 'Island not found' }, { status: 404 });
    }

    // Check if theme is unlocked
    const themes = getAvailableThemes(island.level);
    const selectedTheme = themes.find(t => t.theme === result.data.theme);
    if (!selectedTheme?.unlocked) {
      return NextResponse.json({ error: 'Theme not unlocked yet' }, { status: 403 });
    }

    const updated = await prisma.focusIsland.update({
      where: { userId },
      data: { theme: result.data.theme },
    });

    return NextResponse.json({ island: updated });
  } catch (err) {
    console.error('Error updating island theme:', err);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
