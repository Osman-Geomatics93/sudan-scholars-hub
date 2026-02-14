interface StudySessionRecord {
  date: Date | string;
  duration: number; // minutes
  subject: string;
}

/**
 * Generate heatmap data for the last N days
 * Returns array of { date: 'YYYY-MM-DD', minutes: number, level: 0-4 }
 */
export function generateHeatmapData(
  sessions: StudySessionRecord[],
  days: number = 365,
) {
  const now = new Date();
  const map = new Map<string, number>();

  // Initialize all days
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    map.set(key, 0);
  }

  // Sum sessions
  for (const s of sessions) {
    const key = new Date(s.date).toISOString().split('T')[0];
    if (map.has(key)) {
      map.set(key, (map.get(key) || 0) + s.duration);
    }
  }

  const entries = Array.from(map.entries()).map(([date, minutes]) => ({
    date,
    minutes,
    level: minutes === 0 ? 0 : minutes < 30 ? 1 : minutes < 60 ? 2 : minutes < 120 ? 3 : 4,
  }));

  return entries;
}

/**
 * Weekly stats: total minutes per day for the current week
 */
export function getWeeklyStats(sessions: StudySessionRecord[]) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = days.map((name, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const total = sessions
      .filter((s) => new Date(s.date).toISOString().split('T')[0] === dateStr)
      .reduce((sum, s) => sum + s.duration, 0);
    return { name, minutes: total, date: dateStr };
  });

  return result;
}

/**
 * Subject breakdown: total minutes per subject
 */
export function getSubjectBreakdown(sessions: StudySessionRecord[]) {
  const map = new Map<string, number>();
  for (const s of sessions) {
    const subject = s.subject || 'Other';
    map.set(subject, (map.get(subject) || 0) + s.duration);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate total study time for a date range
 */
export function getTotalMinutes(sessions: StudySessionRecord[], startDate?: Date, endDate?: Date) {
  let filtered = sessions;
  if (startDate) {
    filtered = filtered.filter((s) => new Date(s.date) >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((s) => new Date(s.date) <= endDate);
  }
  return filtered.reduce((sum, s) => sum + s.duration, 0);
}
