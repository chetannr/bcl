/**
 * Team name mapping utility for match schedule
 * Maps schedule abbreviations to full team names and logo paths
 */

export interface TeamInfo {
  fullName: string;
  logoPath: string;
}

const TEAM_MAPPING: Record<string, TeamInfo> = {
  'Riders': {
    fullName: 'Bellandur Riders',
    logoPath: '/assets/teams/BellandurRiders.jpeg',
  },
  'RCB': {
    fullName: 'RCB',
    logoPath: '/assets/teams/RCB.jpeg',
  },
  'MR': {
    fullName: 'MR Titans',
    logoPath: '/assets/teams/MR-Titans.jpeg',
  },
  'BSK': {
    fullName: 'Bellandur Sharks',
    logoPath: '/assets/teams/BELLANDUR-SHARKS.jpeg',
  },
  'Phonix': {
    fullName: 'Bellandur Phoenix',
    logoPath: '/assets/teams/BellandurPhoenix.jpeg',
  },
  'Bulldozers': {
    fullName: 'Bellandur Bulldozers',
    logoPath: '/assets/teams/BellandurBulldozers.jpeg',
  },
  'Monstig': {
    fullName: 'Bellandur Monsters',
    logoPath: '/assets/teams/BM-Bellandur-Monsters.jpeg',
  },
  'OG': {
    fullName: 'OG Cricketers',
    logoPath: '/assets/teams/OG-CRICKETERS.jpeg',
  },
  'USA': {
    fullName: 'Uppi Super Avengers',
    logoPath: '/assets/teams/USA Uppi-Super-Avengers.jpeg',
  },
  'Tigers': {
    fullName: 'Royal Tiger Bellandur',
    logoPath: '/assets/teams/Royal-Tiger-Bellandur.jpeg',
  },
  'YKR': {
    fullName: 'YKR Cricketers',
    logoPath: '/assets/teams/YKR-CRICKETERS.jpeg',
  },
  'Sharks': {
    fullName: 'Bellandur Sharks',
    logoPath: '/assets/teams/BELLANDUR-SHARKS.jpeg',
  },
};

/**
 * Get team information from schedule abbreviation
 */
export function getTeamInfo(abbreviation: string): TeamInfo | null {
  return TEAM_MAPPING[abbreviation] || null;
}

/**
 * Get full team name from abbreviation
 */
export function getTeamName(abbreviation: string): string {
  return TEAM_MAPPING[abbreviation]?.fullName || abbreviation;
}

/**
 * Get team logo path from abbreviation
 */
export function getTeamLogoPath(abbreviation: string): string {
  return TEAM_MAPPING[abbreviation]?.logoPath || '/assets/player-template.png';
}
