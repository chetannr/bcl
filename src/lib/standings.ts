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
      { teamAbbreviation: 'Riders', matches: 3, won: 2, lost: 1, nrr: 1.112, points: 4 },
      { teamAbbreviation: 'Phoenix', matches: 3, won: 2, lost: 1, nrr: -0.356, points: 4 },
      { teamAbbreviation: 'RCB', matches: 1, won: 1, lost: 0, nrr: 1.9, points: 2 },
      { teamAbbreviation: 'USA', matches: 2, won: 1, lost: 1, nrr: 1.698, points: 2 },
      { teamAbbreviation: 'Bulldozers', matches: 2, won: 0, lost: 2, nrr: -2.247, points: 0 },
      { teamAbbreviation: 'Royal Tiger', matches: 1, won: 0, lost: 1, nrr: -3.819, points: 0 },
    ],
  },
  {
    group: 'B',
    teams: [
      { teamAbbreviation: 'Sharks', matches: 2, won: 2, lost: 0, nrr: 4.3, points: 4 },
      { teamAbbreviation: 'OG', matches: 2, won: 2, lost: 0, nrr: 2.42, points: 4 },
      { teamAbbreviation: 'Super Kings', matches: 2, won: 1, lost: 1, nrr: 1.417, points: 2 },
      { teamAbbreviation: 'YKR', matches: 2, won: 1, lost: 1, nrr: -0.978, points: 2 },
      { teamAbbreviation: 'Monsters', matches: 2, won: 0, lost: 2, nrr: -2.103, points: 0 },
      { teamAbbreviation: 'Titans', matches: 2, won: 0, lost: 2, nrr: -6.686, points: 0 },
    ],
  },
];

/**
 * Get team abbreviation from full team name
 */
export function getTeamAbbreviation(fullName: string): string {
  const abbreviationMap: Record<string, string> = {
    'Bellandur Riders': 'Riders',
    'Royal Challengers Bellandur': 'RCB',
    'MR Titans': 'Titans',
    'Bellandur Super Kings': 'Super Kings',
    'Bellandur Sharks': 'Sharks',
    'Bellandur Phoenix': 'Phoenix',
    'Bellandur Bulldozers': 'Bulldozers',
    'Bellandur Monsters': 'Monsters',
    'OG Cricketers': 'OG',
    'Uppi Super Avengers': 'USA',
    'Royal Tiger Bellandur': 'Royal Tiger',
    'YKR Cricketers': 'YKR',
  };
  return abbreviationMap[fullName] || fullName;
}
