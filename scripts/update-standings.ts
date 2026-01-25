/**
 * Script to automatically calculate and update standings from schedule results
 * 
 * Usage: npm run update-standings
 * or: npx tsx scripts/update-standings.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface MatchResult {
  team1Score: string;
  team2Score: string;
  winner: string;
  margin: string;
}

interface Match {
  slot: number;
  time: string;
  team1: string;
  team2: string;
  group: 'A' | 'B';
  matchType?: string;
  result?: MatchResult;
}

interface DaySchedule {
  date: string;
  day: string;
  timeRange: string;
  matchCount: number;
  matches: Match[];
}

interface TeamStanding {
  teamAbbreviation: string;
  matches: number;
  won: number;
  lost: number;
  nrr: number;
  points: number;
}

interface GroupStandings {
  group: 'A' | 'B';
  teams: TeamStanding[];
}

// Parse score string like "51/3 (6.0 Ov)" or "35/4 (5.1 Ov)" to get runs and overs
function parseScore(scoreStr: string): { runs: number; overs: number } {
  const runsMatch = scoreStr.match(/^(\d+)\//);
  if (!runsMatch) {
    throw new Error(`Could not parse runs from: ${scoreStr}`);
  }
  const runs = parseInt(runsMatch[1], 10);
  
  const oversMatch = scoreStr.match(/\((\d+)\.(\d+)\s*Ov\)/);
  if (!oversMatch) {
    throw new Error(`Could not parse overs from: ${scoreStr}`);
  }
  const oversInt = parseInt(oversMatch[1], 10);
  const balls = parseInt(oversMatch[2], 10);
  // Convert to decimal: X.Y where Y is balls (0-5), so X.Y = X + Y/6
  const overs = oversInt + balls / 6;
  
  return { runs, overs };
}

function calculateStandings(schedule: DaySchedule[]): GroupStandings[] {
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
      
      const team1Score = parseScore(result.team1Score);
      const team2Score = parseScore(result.team2Score);
      const winner = result.winner;
      
      // Update team1 stats
      const team1Stats = teamStats.get(team1);
      if (team1Stats) {
        team1Stats.matches++;
        team1Stats.runsFor += team1Score.runs;
        team1Stats.oversFor += team1Score.overs;
        team1Stats.runsAgainst += team2Score.runs;
        team1Stats.oversAgainst += team2Score.overs;
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
        team2Stats.oversFor += team2Score.overs;
        team2Stats.runsAgainst += team1Score.runs;
        team2Stats.oversAgainst += team1Score.overs;
        if (winner === team2) {
          team2Stats.won++;
        } else {
          team2Stats.lost++;
        }
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

function main() {
  const projectRoot = join(__dirname, '..');
  const schedulePath = join(projectRoot, 'src/lib/schedule.ts');
  const standingsPath = join(projectRoot, 'src/lib/standings.ts');

  console.log('📊 Updating standings from schedule...\n');

  try {
    // Read schedule file
    const scheduleFile = readFileSync(schedulePath, 'utf-8');
    
    // Extract SCHEDULE array using regex (simple approach)
    const scheduleMatch = scheduleFile.match(/export const SCHEDULE: DaySchedule\[\] = (\[[\s\S]*?\]);/);
    if (!scheduleMatch) {
      throw new Error('Could not find SCHEDULE array in schedule.ts');
    }

    // Evaluate the schedule (in a real scenario, you'd want to use a proper parser)
    // For now, we'll use eval in a controlled way
    const scheduleCode = `
      ${scheduleFile.match(/export interface.*?MatchResult[\s\S]*?}/)?.[0] || ''}
      ${scheduleFile.match(/export interface.*?Match[\s\S]*?}/)?.[0] || ''}
      ${scheduleFile.match(/export interface.*?DaySchedule[\s\S]*?}/)?.[0] || ''}
      ${scheduleMatch[1]}
    `;
    
    // Use a safer approach - read and parse manually
    // For simplicity, let's use a different approach: import the module
    const scheduleModule = require(schedulePath.replace('.ts', '.js'));
    const schedule: DaySchedule[] = scheduleModule.SCHEDULE || [];

    if (!schedule || schedule.length === 0) {
      // Fallback: try to parse from the file directly
      throw new Error('Could not load schedule. Please ensure schedule.ts is compiled.');
    }

    // Calculate standings
    const standings = calculateStandings(schedule);

    // Read current standings file
    const standingsFile = readFileSync(standingsPath, 'utf-8');

    // Generate new standings code
    const newStandingsCode = `export const STANDINGS: GroupStandings[] = [
  {
    group: 'A',
    teams: [
${standings[0].teams.map(t => `      { teamAbbreviation: '${t.teamAbbreviation}', matches: ${t.matches}, won: ${t.won}, lost: ${t.lost}, nrr: ${t.nrr}, points: ${t.points} },`).join('\n')}
    ],
  },
  {
    group: 'B',
    teams: [
${standings[1].teams.map(t => `      { teamAbbreviation: '${t.teamAbbreviation}', matches: ${t.matches}, won: ${t.won}, lost: ${t.lost}, nrr: ${t.nrr}, points: ${t.points} },`).join('\n')}
    ],
  },
];`;

    // Replace the STANDINGS array in the file
    const updatedFile = standingsFile.replace(
      /export const STANDINGS: GroupStandings\[\] = \[[\s\S]*?\];/,
      newStandingsCode
    );

    // Write updated file
    writeFileSync(standingsPath, updatedFile, 'utf-8');

    console.log('✅ Standings updated successfully!\n');
    console.log('Group A:');
    standings[0].teams.forEach((team, idx) => {
      console.log(`  ${idx + 1}. ${team.teamAbbreviation.padEnd(15)} ${team.matches}M ${team.won}W ${team.lost}L  NRR: ${team.nrr > 0 ? '+' : ''}${team.nrr.toFixed(3).padStart(7)}  ${team.points}pts`);
    });
    console.log('\nGroup B:');
    standings[1].teams.forEach((team, idx) => {
      console.log(`  ${idx + 1}. ${team.teamAbbreviation.padEnd(15)} ${team.matches}M ${team.won}W ${team.lost}L  NRR: ${team.nrr > 0 ? '+' : ''}${team.nrr.toFixed(3).padStart(7)}  ${team.points}pts`);
    });
    console.log('\n📝 File updated: src/lib/standings.ts');

  } catch (error) {
    console.error('❌ Error updating standings:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { calculateStandings, parseScore };
