/**
 * Match schedule data
 * Static schedule for BCL 2025 tournament
 * Round Robin: 30 group stage matches (15 per group) + 3 playoffs = 33 total
 */

export interface Match {
  slot: number;
  time: string;
  team1: string;
  team2: string;
  group: 'A' | 'B';
  matchType?: string;
}

export interface DaySchedule {
  date: string;
  day: string;
  timeRange: string;
  matchCount: number;
  matches: Match[];
}

export const SCHEDULE: DaySchedule[] = [
  {
    date: '24 Jan',
    day: 'Sat',
    timeRange: '7:00 AM – 5:30 PM',
    matchCount: 12,
    matches: [
      { slot: 1, time: '7:00 AM', team1: 'Phoenix', team2: 'Bulldozers', group: 'A' },
      { slot: 2, time: '7:50 AM', team1: 'Monsters', team2: 'OG', group: 'B' },
      { slot: 3, time: '8:40 AM', team1: 'USA', team2: 'Royal Tiger', group: 'A' },
      { slot: 4, time: '9:30 AM', team1: 'YKR', team2: 'Super Kings', group: 'B' },
      { slot: 5, time: '10:20 AM', team1: 'Phoenix', team2: 'Riders', group: 'A' },
      { slot: 6, time: '11:10 AM', team1: 'Titans', team2: 'Sharks', group: 'B' },
      { slot: 7, time: '12:00 PM', team1: 'Riders', team2: 'RCB', group: 'A' },
      { slot: 8, time: '12:50 PM', team1: 'Super Kings', team2: 'Sharks', group: 'B' },
      { slot: 9, time: '1:40 PM', team1: 'Phoenix', team2: 'USA', group: 'A' },
      { slot: 10, time: '2:30 PM', team1: 'Titans', team2: 'OG', group: 'B' },
      { slot: 11, time: '3:20 PM', team1: 'Riders', team2: 'Bulldozers', group: 'A' },
      { slot: 12, time: '4:10 PM', team1: 'Monsters', team2: 'YKR', group: 'B' },
    ],
  },
  {
    date: '25 Jan',
    day: 'Sun',
    timeRange: '7:00 AM – 3:30 PM',
    matchCount: 10,
    matches: [
     { slot: 13, time: '7:00 AM', team1: 'Monsters', team2: 'Sharks', group: 'B' },
     { slot: 14, time: '7:50 AM', team1: 'RCB', team2: 'Royal Tiger', group: 'A' },
     { slot: 15, time: '8:40 AM', team1: 'Titans', team2: 'Super Kings', group: 'B' },
     { slot: 16, time: '9:30 AM', team1: 'Royal Tiger', team2: 'Phoenix', group: 'A' },
     { slot: 17, time: '10:20 AM', team1: 'OG', team2: 'YKR', group: 'B' },
     { slot: 18, time: '11:10 AM', team1: 'Bulldozers', team2: 'USA', group: 'A' },
     { slot: 19, time: '12:00 PM', team1: 'Super Kings', team2: 'Monsters', group: 'B' },
     { slot: 20, time: '12:50 PM', team1: 'RCB', team2: 'Phoenix', group: 'A' },
     { slot: 21, time: '1:40 PM', team1: 'YKR', team2: 'Sharks', group: 'B' },
     { slot: 22, time: '2:30 PM', team1: 'RCB', team2: 'USA', group: 'A' },
    ],
  },
  {
    date: '26 Jan',
    day: 'Mon',
    timeRange: '7:00 AM – 5:00 PM',
    matchCount: 11,
    matches: [
      { slot: 23, time: '7:00 AM', team1: 'OG', team2: 'Super Kings', group: 'B' },
      { slot: 24, time: '7:50 AM', team1: 'RCB', team2: 'Bulldozers', group: 'A' },
      { slot: 25, time: '8:40 AM', team1: 'Titans', team2: 'YKR', group: 'B' },
      { slot: 26, time: '9:30 AM', team1: 'Royal Tiger', team2: 'Bulldozers', group: 'A' },
      { slot: 27, time: '10:20 AM', team1: 'OG', team2: 'Sharks', group: 'B' },
      { slot: 28, time: '11:10 AM', team1: 'Riders', team2: 'Royal Tiger', group: 'A' },
      { slot: 29, time: '12:00 PM', team1: 'Monsters', team2: 'Titans', group: 'B' },
      { slot: 30, time: '12:50 PM', team1: 'Riders', team2: 'USA', group: 'A' },
      // Playoff matches
      { slot: 31, time: '2:00 PM', team1: 'TBD', team2: 'TBD', group: 'A', matchType: 'Semi-Final 1' },
      { slot: 32, time: '2:50 PM', team1: 'TBD', team2: 'TBD', group: 'B', matchType: 'Semi-Final 2' },
      { slot: 33, time: '3:50 PM', team1: 'TBD', team2: 'TBD', group: 'A', matchType: 'Final' },
    ],
  },
];
