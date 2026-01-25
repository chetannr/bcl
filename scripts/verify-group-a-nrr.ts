/**
 * Verify Group A NRR calculations
 */

import { SCHEDULE } from '../src/lib/schedule';
import { calculateStandings } from '../src/lib/standings';

// Parse score string
function parseScore(scoreStr: string): { runs: number; overs: number; wickets: number; isAllOut: boolean } {
  const scoreMatch = scoreStr.match(/^(\d+)\/(\d+)\s*\(/);
  if (!scoreMatch) throw new Error(`Could not parse score from: ${scoreStr}`);
  const runs = parseInt(scoreMatch[1], 10);
  const wickets = parseInt(scoreMatch[2], 10);
  
  const oversMatch = scoreStr.match(/\((\d+)\.(\d+)\s*Ov\)/);
  if (!oversMatch) throw new Error(`Could not parse overs from: ${scoreStr}`);
  const oversInt = parseInt(oversMatch[1], 10);
  const balls = parseInt(oversMatch[2], 10);
  const overs = oversInt + balls / 6;
  
  const isAllOut = wickets >= 8;
  
  return { runs, overs, wickets, isAllOut };
}

console.log('=== Group A NRR Verification ===\n');

// Get calculated standings
const standings = calculateStandings(SCHEDULE);
const groupA = standings.find(s => s.group === 'A');

if (!groupA) {
  console.error('Group A not found!');
  process.exit(1);
}

console.log('Current Calculated Standings:');
console.log('| Team                   | M | W | L | Pts | NRR    |');
console.log('| ---------------------- | - | - | - | --- | ------ |');

for (const team of groupA.teams) {
  const teamName = team.teamAbbreviation.padEnd(22);
  console.log(
    `| ${teamName} | ${team.matches} | ${team.won} | ${team.lost} | ${team.points.toString().padStart(3)} | ${team.nrr.toFixed(3).padStart(6)} |`
  );
}

console.log('\n=== Expected Standings ===\n');
console.log('| Team                   | M | W | L | T | NR | Pts | NRR    |');
console.log('| ---------------------- | - | - | - | - | -- | --- | ------ |');
console.log('| Bellandur Riders       | 3 | 2 | 1 | 0 | 0  | 4   | 0.609  |');
console.log('| Bellandur Phonixs      | 3 | 2 | 1 | 0 | 0  | 4   | 0.204  |');
console.log('| RCB                    | 1 | 1 | 0 | 0 | 0  | 2   | 2.833  |');
console.log('| USA                    | 2 | 1 | 1 | 0 | 0  | 2   | 1.698  |');
console.log('| Bellandur Bulldozers   | 2 | 0 | 2 | 0 | 0  | 0   | -2.701 |');
console.log('| Royal Tigers Bellandur | 1 | 0 | 1 | 0 | 0  | 0   | -3.819 |');

console.log('\n=== Comparison ===\n');
const expected: Record<string, { matches: number; won: number; lost: number; points: number; nrr: number }> = {
  'Riders': { matches: 3, won: 2, lost: 1, points: 4, nrr: 0.609 },
  'Phoenix': { matches: 3, won: 2, lost: 1, points: 4, nrr: 0.204 },
  'RCB': { matches: 1, won: 1, lost: 0, points: 2, nrr: 2.833 },
  'USA': { matches: 2, won: 1, lost: 1, points: 2, nrr: 1.698 },
  'Bulldozers': { matches: 2, won: 0, lost: 2, points: 0, nrr: -2.701 },
  'Royal Tiger': { matches: 1, won: 0, lost: 1, points: 0, nrr: -3.819 },
};

let allMatch = true;
for (const team of groupA.teams) {
  const exp = expected[team.teamAbbreviation];
  if (exp) {
    const nrrMatch = Math.abs(team.nrr - exp.nrr) < 0.001;
    const matchesMatch = team.matches === exp.matches;
    const wonMatch = team.won === exp.won;
    const lostMatch = team.lost === exp.lost;
    const pointsMatch = team.points === exp.points;
    
    const status = (nrrMatch && matchesMatch && wonMatch && lostMatch && pointsMatch) ? '✓' : '✗';
    if (!(nrrMatch && matchesMatch && wonMatch && lostMatch && pointsMatch)) {
      allMatch = false;
    }
    
    console.log(`${team.teamAbbreviation}: ${status}`);
    if (!matchesMatch) console.log(`  Matches: ${team.matches} (expected ${exp.matches})`);
    if (!wonMatch) console.log(`  Won: ${team.won} (expected ${exp.won})`);
    if (!lostMatch) console.log(`  Lost: ${team.lost} (expected ${exp.lost})`);
    if (!pointsMatch) console.log(`  Points: ${team.points} (expected ${exp.points})`);
    if (!nrrMatch) {
      console.log(`  NRR: ${team.nrr.toFixed(3)} (expected ${exp.nrr.toFixed(3)})`);
      console.log(`  NRR DIFFERENCE: ${(team.nrr - exp.nrr).toFixed(3)}`);
    }
    console.log('');
  }
}

if (allMatch) {
  console.log('✅ All Group A NRR calculations are correct!');
} else {
  console.log('❌ Some NRR calculations do not match expected values.');
}

// Also show Group A matches for reference
console.log('\n=== Group A Matches ===\n');
for (const day of SCHEDULE) {
  for (const match of day.matches) {
    if (match.group === 'A' && match.result) {
      console.log(`Match ${match.slot}: ${match.team1} vs ${match.team2}`);
      console.log(`  ${match.team1}: ${match.result.team1Score}`);
      console.log(`  ${match.team2}: ${match.result.team2Score}`);
      console.log(`  Winner: ${match.result.winner}, Margin: ${match.result.margin}`);
      
      const team1Score = parseScore(match.result.team1Score);
      const team2Score = parseScore(match.result.team2Score);
      console.log(`  Team1 all-out: ${team1Score.isAllOut} (${team1Score.wickets} wickets)`);
      console.log(`  Team2 all-out: ${team2Score.isAllOut} (${team2Score.wickets} wickets)`);
      console.log('');
    }
  }
}
