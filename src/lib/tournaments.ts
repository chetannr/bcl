/**
 * Tournament configuration system
 * Manages tournament data loaded from JSON files
 */

import shortCricket2026 from '../data/tournaments/short-cricket-2026.json';
import longPitch2026 from '../data/tournaments/long-pitch-2026.json';

export interface Tournament {
  id: string;
  name: string;
  type: 'short-cricket' | 'long-pitch';
  year: number;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate?: string;
  groupStructure: 'single' | 'two-groups' | 'four-groups';
  totalTeams: number;
  groups: string[];
  teams: {
    [group: string]: string[];
  };
}

// All tournament configurations
const TOURNAMENTS: Tournament[] = [
  shortCricket2026 as Tournament,
  longPitch2026 as Tournament,
];

/**
 * Get tournament by ID
 */
export function getTournament(id: string): Tournament | undefined {
  return TOURNAMENTS.find(t => t.id === id);
}

/**
 * Get all tournaments
 */
export function getAllTournaments(): Tournament[] {
  return TOURNAMENTS;
}

/**
 * Get active tournament (if any)
 */
export function getActiveTournament(): Tournament | undefined {
  return TOURNAMENTS.find(t => t.status === 'active');
}

/**
 * Check if tournament is active
 */
export function isTournamentActive(id: string): boolean {
  const tournament = getTournament(id);
  return tournament?.status === 'active';
}

/**
 * Get default tournament (most recent completed or active)
 */
export function getDefaultTournament(): Tournament {
  const active = getActiveTournament();
  if (active) return active;
  
  // Get most recent completed tournament
  const completed = TOURNAMENTS
    .filter(t => t.status === 'completed')
    .sort((a, b) => {
      const dateA = new Date(a.endDate || a.startDate);
      const dateB = new Date(b.endDate || b.startDate);
      return dateB.getTime() - dateA.getTime();
    });
  
  return completed[0] || TOURNAMENTS[0];
}
