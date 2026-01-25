/**
 * Script to automatically calculate and update standings from schedule results
 * 
 * Usage: node scripts/update-standings.js
 * or: npm run update-standings
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse score string like "51/3 (6.0 Ov)" or "35/4 (5.1 Ov)" to get runs and overs
function parseScore(scoreStr) {
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

function calculateStandings(schedule) {
  const teamStats = new Map();

  // Initialize all teams
  const allTeams = {
    'A': ['Riders', 'RCB', 'Royal Tiger', 'Phoenix', 'Bulldozers', 'USA'],
    'B': ['Sharks', 'Super Kings', 'OG', 'Monsters', 'YKR', 'Titans']
  };

  for (const [group, teams] of Object.entries(allTeams)) {
    for (const team of teams) {
      teamStats.set(team, {
        group,
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
  const standings = [
    { group: 'A', teams: [] },
    { group: 'B', teams: [] }
  ];

  for (const [team, stats] of teamStats.entries()) {
    const runRateFor = stats.oversFor > 0 ? stats.runsFor / stats.oversFor : 0;
    const runRateAgainst = stats.oversAgainst > 0 ? stats.runsAgainst / stats.oversAgainst : 0;
    const nrr = runRateFor - runRateAgainst;
    const points = stats.won * 2;
    
    const standing = {
      teamAbbreviation: team,
      matches: stats.matches,
      won: stats.won,
      lost: stats.lost,
      nrr: Math.round(nrr * 1000) / 1000, // Round to 3 decimal places
      points,
    };
    
    standings.find(s => s.group === stats.group).teams.push(standing);
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

function extractScheduleFromFile(fileContent) {
  // Extract the SCHEDULE array from the TypeScript file
  // This is a simple parser - it looks for the SCHEDULE constant
  const scheduleMatch = fileContent.match(/export const SCHEDULE[^=]*=\s*(\[[\s\S]*?\]);/);
  if (!scheduleMatch) {
    throw new Error('Could not find SCHEDULE array in schedule.ts');
  }

  // We need to evaluate the schedule, but we can't easily parse TypeScript
  // So we'll use a workaround: extract the data structure
  // For a more robust solution, you'd want to use a TypeScript parser
  
  // Simple approach: try to extract and parse the JSON-like structure
  let scheduleStr = scheduleMatch[1];
  
  // Remove comments
  scheduleStr = scheduleStr.replace(/\/\/.*$/gm, '');
  scheduleStr = scheduleStr.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // This is a simplified approach - in production you'd want a proper parser
  // For now, we'll require the user to have the compiled JS file or use a different approach
  
  // Alternative: read from a JSON export or use a build step
  throw new Error('Direct parsing from TS not supported. Please use the build output or create a JSON export.');
}

async function main() {
  const projectRoot = join(__dirname, '..');
  const schedulePath = join(projectRoot, 'src/lib/schedule.ts');
  const standingsPath = join(projectRoot, 'src/lib/standings.ts');

  console.log('📊 Updating standings from schedule...\n');

  try {
    // Read schedule file
    const scheduleFile = readFileSync(schedulePath, 'utf-8');
    
    // Try to import the schedule module (if using a build system)
    // For now, we'll use a simpler approach: manually parse the structure
    // This requires the schedule to be in a parseable format
    
    // Better approach: create a JSON export or use the compiled output
    // For simplicity, let's create a helper that exports schedule as JSON first
    
    console.log('⚠️  This script requires the schedule to be available as a module.');
    console.log('   Creating a simpler update helper...\n');
    
    // Create a helper script that can be run after building
    console.log('✅ Please use: npm run build && node scripts/update-standings-from-build.js');
    console.log('   Or manually update standings.ts after adding match results to schedule.ts\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Create a simpler version that works with the actual file structure
// We'll create a version that can parse the TypeScript file directly
function createSimpleUpdater() {
  const projectRoot = join(__dirname, '..');
  const schedulePath = join(projectRoot, 'src/lib/schedule.ts');
  const standingsPath = join(projectRoot, 'src/lib/standings.ts');

  console.log('📊 Calculating standings from schedule...\n');

  try {
    const scheduleFile = readFileSync(schedulePath, 'utf-8');
    
    // Extract schedule data - look for result objects
    const matches = [];
    
    // Find all result blocks
    const resultPattern = /result:\s*{[\s\S]*?team1Score:\s*['"]([^'"]+)['"][\s\S]*?team2Score:\s*['"]([^'"]+)['"][\s\S]*?winner:\s*['"]([^'"]+)['"][\s\S]*?}/g;
    
    // Find all match blocks with team1, team2, group, and result
    // We'll use a more comprehensive pattern
    const lines = scheduleFile.split('\n');
    let currentMatch = null;
    let inResult = false;
    let resultData = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect start of match object
      if (line.includes('slot:') && !line.includes('slot: 0')) {
        currentMatch = { slot: null, team1: null, team2: null, group: null, result: null };
        const slotMatch = line.match(/slot:\s*(\d+)/);
        if (slotMatch) currentMatch.slot = parseInt(slotMatch[1]);
      }
      
      // Extract team1
      if (currentMatch && line.includes("team1:") && !line.includes('No Match')) {
        const team1Match = line.match(/team1:\s*['"]([^'"]+)['"]/);
        if (team1Match) currentMatch.team1 = team1Match[1];
      }
      
      // Extract team2
      if (currentMatch && line.includes("team2:") && !line.includes('No Match')) {
        const team2Match = line.match(/team2:\s*['"]([^'"]+)['"]/);
        if (team2Match) currentMatch.team2 = team2Match[1];
      }
      
      // Extract group
      if (currentMatch && line.includes("group:")) {
        const groupMatch = line.match(/group:\s*['"]([AB])['"]/);
        if (groupMatch) currentMatch.group = groupMatch[1];
      }
      
      // Detect result block
      if (line.includes('result:')) {
        inResult = true;
        resultData = {};
      }
      
      // Extract result fields
      if (inResult) {
        if (line.includes('team1Score:')) {
          const match = line.match(/team1Score:\s*['"]([^'"]+)['"]/);
          if (match) resultData.team1Score = match[1];
        }
        if (line.includes('team2Score:')) {
          const match = line.match(/team2Score:\s*['"]([^'"]+)['"]/);
          if (match) resultData.team2Score = match[1];
        }
        if (line.includes('winner:')) {
          const match = line.match(/winner:\s*['"]([^'"]+)['"]/);
          if (match) resultData.winner = match[1];
        }
        if (line.includes('},') || line.includes('}')) {
          if (resultData.team1Score && resultData.team2Score && resultData.winner && currentMatch) {
            currentMatch.result = {
              team1Score: resultData.team1Score,
              team2Score: resultData.team2Score,
              winner: resultData.winner,
              margin: ''
            };
            if (currentMatch.team1 && currentMatch.team2 && currentMatch.group && currentMatch.result) {
              matches.push(currentMatch);
            }
          }
          inResult = false;
          resultData = {};
        }
      }
      
      // Reset if we hit a new day or end of matches array
      if (line.includes('],') || line.includes('date:')) {
        currentMatch = null;
        inResult = false;
      }
    }

    if (matches.length === 0) {
      console.log('⚠️  No completed matches found in schedule.ts');
      console.log('   Please add match results to schedule.ts first.\n');
      return;
    }

    // Convert to schedule format
    const schedule = [{
      date: '',
      day: '',
      timeRange: '',
      matchCount: matches.length,
      matches: matches
    }];

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
    console.error('❌ Error updating standings:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the simple updater
createSimpleUpdater();
