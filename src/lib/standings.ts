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
    teams:[
  { teamAbbreviation: 'Riders', matches: 1, won: 1, lost: 0, nrr: 4.857, points: 2 },
  { teamAbbreviation: 'RCB', matches: 0, won: 0, lost: 0, nrr: 0.0, points: 0 },
  { teamAbbreviation: 'Phoenix', matches: 2, won: 1, lost: 1, nrr: 0.303, points: 2 },
  { teamAbbreviation: 'Bulldozers', matches: 1, won: 0, lost: 1, nrr: -3.833, points: 0 },
  { teamAbbreviation: 'USA', matches: 1, won: 1, lost: 0, nrr: 3.819, points: 2 },
  { teamAbbreviation: 'Royal Tiger', matches: 1, won: 0, lost: 1, nrr: -3.819, points: 0 },
],
  },
  {
    group: 'B',
    teams: [
  { teamAbbreviation: 'Titans',      matches: 1, won: 0, lost: 1, nrr: -12.667, points: 0 },
  { teamAbbreviation: 'Super Kings',matches: 1, won: 1, lost: 0, nrr: 3.667,   points: 2 },
  { teamAbbreviation: 'Monsters',   matches: 1, won: 0, lost: 1, nrr: -1.787,  points: 0 },
  { teamAbbreviation: 'OG',         matches: 1, won: 1, lost: 0, nrr: 1.787,   points: 2 },
  { teamAbbreviation: 'YKR',        matches: 1, won: 0, lost: 1, nrr: -3.667,  points: 0 },
  { teamAbbreviation: 'Sharks',     matches: 1, won: 1, lost: 0, nrr: 12.667,  points: 2 },
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
