/**
 * Standings data for BCL 2026 tournament
 * Automatically calculated from schedule.ts at runtime
 */

import { SCHEDULE, type DaySchedule } from './schedule';

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

// Parse score string like "51/3 (6.0 Ov)" or "35/4 (5.1 Ov)" to get runs, overs, and wickets
function parseScore(scoreStr: string): { runs: number; overs: number; wickets: number; isAllOut: boolean } {
  const scoreMatch = scoreStr.match(/^(\d+)\/(\d+)\s*\(/);
  if (!scoreMatch) {
    throw new Error(`Could not parse score from: ${scoreStr}`);
  }
  const runs = parseInt(scoreMatch[1], 10);
  const wickets = parseInt(scoreMatch[2], 10);
  
  const oversMatch = scoreStr.match(/\((\d+)\.(\d+)\s*Ov\)/);
  if (!oversMatch) {
    throw new Error(`Could not parse overs from: ${scoreStr}`);
  }
  const oversInt = parseInt(oversMatch[1], 10);
  const balls = parseInt(oversMatch[2], 10);
  // Convert to decimal: X.Y where Y is balls (0-5), so X.Y = X + Y/6
  const overs = oversInt + balls / 6;
  
  // Teams have 9 players max, so 8 wickets lost = all out
  // (8 players dismissed, 9th player remains not out)
  const isAllOut = wickets >= 8;
  
  return { runs, overs, wickets, isAllOut };
}

/**
 * Calculate standings from schedule results
 * This function processes all matches with results and calculates:
 * - Matches played, wins, losses
 * - Net Run Rate (NRR)
 * - Points (2 points per win)
 */
export function calculateStandings(schedule: DaySchedule[]): GroupStandings[] {
  const teamStats = new Map<string, {
    group: 'A' | 'B';
    matches: number;
    won: number;
    lost: number;
    runsFor: number;
    oversFor: number;
    runsAgainst: number;
    oversAgainst: number;
  }>();

  // Initialize all teams
  const allTeams = {
    'A': ['Riders', 'RCB', 'Royal Tiger', 'Phoenix', 'Bulldozers', 'USA'],
    'B': ['Sharks', 'Super Kings', 'OG', 'Monsters', 'YKR', 'Titans']
  };

  for (const [group, teams] of Object.entries(allTeams)) {
    for (const team of teams) {
      teamStats.set(team, {
        group: group as 'A' | 'B',
        matches: 0,
        won: 0,
        lost: 0,
        runsFor: 0,
        oversFor: 0,
        runsAgainst: 0,
        oversAgainst: 0,
      });
    }
  }

  // Process all matches with results
  for (const day of schedule) {
    for (const match of day.matches) {
      if (!match.result || match.matchType) continue; // Skip matches without results or playoff matches
      
      const { team1, team2, result } = match;
      
      if (team1 === 'No Match' || team2 === 'No Match') continue;
      
      try {
        const team1Score = parseScore(result.team1Score);
        const team2Score = parseScore(result.team2Score);
        const winner = result.winner;
        
        // NRR calculation rules:
        // 1. If a team is all out (loses all wickets), use full overs quota (6.0) for NRR
        // 2. If a team wins by wickets, winner uses actual overs, loser uses full quota (6.0)
        // 3. Otherwise, use actual overs faced
        const maxOvers = 6.0; // Maximum overs per innings
        const wonByWickets = result.margin.toLowerCase().includes('wicket');
        
        // Determine overs to use for NRR calculation
        let team1OversFor = team1Score.overs;
        let team2OversFor = team2Score.overs;
        
        if (wonByWickets) {
          // When match is won by wickets:
          // Winner uses actual overs faced (they completed the chase)
          // Loser uses full overs quota (6.0) - they bowled the full quota
          if (winner === team1) {
            // Team1 won by wickets - use actual overs
            team1OversFor = team1Score.overs;
            // Team2 lost - use full quota
            team2OversFor = maxOvers;
          } else {
            // Team2 won by wickets - use actual overs
            team2OversFor = team2Score.overs;
            // Team1 lost - use full quota
            team1OversFor = maxOvers;
          }
        } else {
          // If team1 was all out, use full overs quota
          if (team1Score.isAllOut) {
            team1OversFor = maxOvers;
          }
          
          // If team2 was all out, use full overs quota
          if (team2Score.isAllOut) {
            team2OversFor = maxOvers;
          }
        }
        
        // Update team1 stats
        const team1Stats = teamStats.get(team1);
        if (team1Stats) {
          team1Stats.matches++;
          team1Stats.runsFor += team1Score.runs;
          team1Stats.oversFor += team1OversFor;
          team1Stats.runsAgainst += team2Score.runs;
          team1Stats.oversAgainst += team2OversFor; // Use adjusted overs for runs against
          if (winner === team1) {
            team1Stats.won++;
          } else {
            team1Stats.lost++;
          }
        }
        
        // Update team2 stats
        const team2Stats = teamStats.get(team2);
        if (team2Stats) {
          team2Stats.matches++;
          team2Stats.runsFor += team2Score.runs;
          team2Stats.oversFor += team2OversFor;
          team2Stats.runsAgainst += team1Score.runs;
          team2Stats.oversAgainst += team1OversFor; // Use adjusted overs for runs against
          if (winner === team2) {
            team2Stats.won++;
          } else {
            team2Stats.lost++;
          }
        }
      } catch (error) {
        // Skip matches with invalid score format
        console.warn(`Skipping match ${match.slot} due to score parsing error:`, error);
      }
    }
  }

  // Calculate NRR and points
  const standings: GroupStandings[] = [
    { group: 'A', teams: [] },
    { group: 'B', teams: [] }
  ];

  for (const [team, stats] of teamStats.entries()) {
    const runRateFor = stats.oversFor > 0 ? stats.runsFor / stats.oversFor : 0;
    const runRateAgainst = stats.oversAgainst > 0 ? stats.runsAgainst / stats.oversAgainst : 0;
    const nrr = runRateFor - runRateAgainst;
    const points = stats.won * 2;
    
    const standing: TeamStanding = {
      teamAbbreviation: team,
      matches: stats.matches,
      won: stats.won,
      lost: stats.lost,
      nrr: Math.round(nrr * 1000) / 1000, // Round to 3 decimal places
      points,
    };
    
    standings.find(s => s.group === stats.group)?.teams.push(standing);
  }

  // Sort by points (desc), then NRR (desc)
  for (const group of standings) {
    group.teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });
  }

  return standings;
}

/**
 * Get current standings calculated from schedule
 * This is computed at runtime, so standings always reflect the latest match results
 */
export function getStandings(): GroupStandings[] {
  return calculateStandings(SCHEDULE);
}

/**
 * Exported for backward compatibility
 * Now automatically calculated from schedule
 */
export const STANDINGS: GroupStandings[] = getStandings();

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
