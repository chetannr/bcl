/**
 * Standings data for BCL 2025 tournament
 * Static standings data - can be replaced with database queries later
 */

export interface TeamStanding {
  teamAbbreviation: string;
  matches: number;
  won: number;
  lost: number;
  nrr: number; // Net Run Rate
  points: number;
}

export interface GroupStandings {
  group: 'A' | 'B';
  teams: TeamStanding[];
}

export const STANDINGS: GroupStandings[] = [
  {
    group: 'A',
    teams: [
      { teamAbbreviation: 'Riders', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'RCB', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'Phonix', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'Bulldozers', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'USA', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'Tigers', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
    ],
  },
  {
    group: 'B',
    teams: [
      { teamAbbreviation: 'MR', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'BSK', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'Monstig', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'OG', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'YKR', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
      { teamAbbreviation: 'Sharks', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
    ],
  },
];

/**
 * Get team abbreviation from full team name
 */
export function getTeamAbbreviation(fullName: string): string {
  const abbreviationMap: Record<string, string> = {
    'Bellandur Riders': 'Riders',
    'RCB': 'RCB',
    'MR Titans': 'MR',
    'Bellandur Sharks': 'BSK',
    'Bellandur Phoenix': 'Phonix',
    'Bellandur Bulldozers': 'Bulldozers',
    'Bellandur Monsters': 'Monstig',
    'OG Cricketers': 'OG',
    'Uppi Super Avengers': 'USA',
    'Royal Tiger Bellandur': 'Tigers',
    'YKR Cricketers': 'YKR',
  };
  return abbreviationMap[fullName] || fullName;
}
