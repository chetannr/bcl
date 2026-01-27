/**
 * Match schedule data
 * Tournament-aware schedule loading from JSON files
 */

import shortCricket2026Schedule from '../data/schedules/short-cricket-2026.json';
import longPitch2026Schedule from '../data/schedules/long-pitch-2026.json';

export interface MatchResult {
  team1Score: string;
  team2Score: string;
  winner: string;
  margin: string;
}

export interface Match {
  slot: number;
  time: string;
  team1: string;
  team2: string;
  group: 'A' | 'B' | string;
  matchType?: string;
  result?: MatchResult;
}

export interface DaySchedule {
  date: string;
  day: string;
  timeRange: string;
  matchCount: number;
  matches: Match[];
}

// Schedule data by tournament ID
const SCHEDULE_DATA: Record<string, DaySchedule[]> = {
  'short-cricket-2026': shortCricket2026Schedule as DaySchedule[],
  'long-pitch-2026': longPitch2026Schedule as DaySchedule[],
};

/**
 * Get schedule for a specific tournament
 */
export function getSchedule(tournamentId: string): DaySchedule[] {
  return SCHEDULE_DATA[tournamentId] || [];
}

/**
 * Legacy export for backward compatibility
 * Defaults to short-cricket-2026
 */
export const SCHEDULE: DaySchedule[] = getSchedule('short-cricket-2026');
