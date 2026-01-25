/**
 * Verify all standings (Group A and B)
 */

import { calculateStandings } from '../src/lib/standings';
import { SCHEDULE } from '../src/lib/schedule';

console.log('=== All Standings Verification ===\n');

const standings = calculateStandings(SCHEDULE);

// Group A expected
const groupAExpected: Record<string, { matches: number; won: number; lost: number; points: number; nrr: number }> = {
  'Riders': { matches: 3, won: 2, lost: 1, points: 4, nrr: 0.609 },
  'Phoenix': { matches: 3, won: 2, lost: 1, points: 4, nrr: 0.204 },
  'RCB': { matches: 1, won: 1, lost: 0, points: 2, nrr: 2.833 },
  'USA': { matches: 2, won: 1, lost: 1, points: 2, nrr: 1.698 },
  'Bulldozers': { matches: 2, won: 0, lost: 2, points: 0, nrr: -2.701 },
  'Royal Tiger': { matches: 1, won: 0, lost: 1, points: 0, nrr: -3.819 },
};

// Group B expected
const groupBExpected: Record<string, { matches: number; won: number; lost: number; points: number; nrr: number }> = {
  'Sharks': { matches: 2, won: 2, lost: 0, points: 4, nrr: 4.300 },
  'OG': { matches: 2, won: 2, lost: 0, points: 4, nrr: 2.420 },
  'Super Kings': { matches: 2, won: 1, lost: 1, points: 2, nrr: 1.417 },
  'YKR': { matches: 2, won: 1, lost: 1, points: 2, nrr: -0.978 },
  'Monsters': { matches: 2, won: 0, lost: 2, points: 0, nrr: -2.103 },
  'Titans': { matches: 2, won: 0, lost: 2, points: 0, nrr: -6.686 },
};

for (const group of standings) {
  console.log(`\n=== Group ${group.group} ===\n`);
  console.log('| Team                   | M | W | L | Pts | NRR    | Status |');
  console.log('| ---------------------- | - | - | - | --- | ------ | ------ |');
  
  const expected = group.group === 'A' ? groupAExpected : groupBExpected;
  
  for (const team of group.teams) {
    const exp = expected[team.teamAbbreviation];
    const nrrMatch = exp ? Math.abs(team.nrr - exp.nrr) < 0.001 : false;
    const allMatch = exp && 
      team.matches === exp.matches &&
      team.won === exp.won &&
      team.lost === exp.lost &&
      team.points === exp.points &&
      nrrMatch;
    
    const status = allMatch ? '✓' : '✗';
    const teamName = team.teamAbbreviation.padEnd(22);
    
    console.log(
      `| ${teamName} | ${team.matches} | ${team.won} | ${team.lost} | ${team.points.toString().padStart(3)} | ${team.nrr.toFixed(3).padStart(6)} | ${status.padStart(6)} |`
    );
    
    if (exp && !allMatch) {
      if (team.matches !== exp.matches) console.log(`  → Matches: ${team.matches} (expected ${exp.matches})`);
      if (team.won !== exp.won) console.log(`  → Won: ${team.won} (expected ${exp.won})`);
      if (team.lost !== exp.lost) console.log(`  → Lost: ${team.lost} (expected ${exp.lost})`);
      if (team.points !== exp.points) console.log(`  → Points: ${team.points} (expected ${exp.points})`);
      if (!nrrMatch) {
        console.log(`  → NRR: ${team.nrr.toFixed(3)} (expected ${exp.nrr.toFixed(3)}, diff: ${(team.nrr - exp.nrr).toFixed(3)})`);
      }
    }
  }
}

console.log('\n=== Summary ===\n');
let groupACorrect = 0;
let groupBCorrect = 0;

const groupA = standings.find(s => s.group === 'A');
const groupB = standings.find(s => s.group === 'B');

if (groupA) {
  for (const team of groupA.teams) {
    const exp = groupAExpected[team.teamAbbreviation];
    if (exp && Math.abs(team.nrr - exp.nrr) < 0.001 && 
        team.matches === exp.matches && team.won === exp.won && 
        team.lost === exp.lost && team.points === exp.points) {
      groupACorrect++;
    }
  }
}

if (groupB) {
  for (const team of groupB.teams) {
    const exp = groupBExpected[team.teamAbbreviation];
    if (exp && Math.abs(team.nrr - exp.nrr) < 0.001 && 
        team.matches === exp.matches && team.won === exp.won && 
        team.lost === exp.lost && team.points === exp.points) {
      groupBCorrect++;
    }
  }
}

console.log(`Group A: ${groupACorrect}/6 teams correct`);
console.log(`Group B: ${groupBCorrect}/6 teams correct`);
console.log(`Total: ${groupACorrect + groupBCorrect}/12 teams correct`);
