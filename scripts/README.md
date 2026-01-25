# Update Standings Script

This script automatically calculates and updates the standings based on match results in `src/lib/schedule.ts`.

## Usage

After adding match results to `schedule.ts`, simply run:

```bash
npm run update-standings
```

Or directly:

```bash
node scripts/update-standings.js
```

## How it works

1. Reads all matches from `src/lib/schedule.ts`
2. Finds all matches with `result` data
3. Calculates:
   - Matches played
   - Wins and losses
   - Net Run Rate (NRR)
   - Points (2 points per win)
4. Sorts teams by points (descending), then by NRR (descending)
5. Updates `src/lib/standings.ts` automatically

## Example

When you add a match result like this to `schedule.ts`:

```typescript
{
  slot: 13,
  time: '7:00 AM',
  team1: 'RCB',
  team2: 'Royal Tiger',
  group: 'A',
  result: {
    team1Score: '45/3 (6.0 Ov)',
    team2Score: '42/5 (6.0 Ov)',
    winner: 'RCB',
    margin: '3 runs',
  },
},
```

Just run `npm run update-standings` and the standings will be automatically updated!

## Notes

- The script only processes matches that have a `result` object
- Playoff matches (with `matchType`) are ignored
- Teams are automatically sorted by rank (points, then NRR)
- NRR is calculated to 3 decimal places
