---
name: Tournament Management System
overview: Create a tournament management system to handle multiple tournaments, archive completed ones, and prepare for the new Long Pitch BCL tournament. Remove/hide PREDICTIONS tab for completed tournaments and add a tournament selector.
todos:
  - id: create-tournament-config
    content: Create src/lib/tournaments.ts with tournament configuration system, interfaces, and helper functions. Create JSON files in src/data/tournaments/ for tournament configs
    status: completed
  - id: create-schedule-json
    content: Extract current schedule data to src/data/schedules/short-cricket-2026.json and create placeholder for long-pitch-2026.json
    status: pending
  - id: update-schedule-tournament-aware
    content: Update src/lib/schedule.ts to load schedule data from JSON files based on tournamentId
    status: completed
  - id: update-standings-tournament-aware
    content: Update src/lib/standings.ts to use tournament configuration from JSON for group structure and teams
    status: completed
  - id: create-tournament-selector
    content: Create src/components/schedule/TournamentSelector.tsx component for switching tournaments
    status: completed
  - id: update-index-route
    content: Update src/routes/index.tsx to add tournament state, selector UI, and conditional PREDICTIONS tab
    status: completed
  - id: update-match-schedule-component
    content: Update MatchSchedule.tsx to accept and use tournamentId prop
    status: completed
  - id: update-standings-tab-component
    content: Update StandingsTab.tsx to accept and use tournamentId prop
    status: completed
  - id: update-teams-tab-component
    content: Update TeamsTab.tsx to accept and use tournamentId prop
    status: completed
  - id: update-predictions-tab-component
    content: Update PredictionTab.tsx to accept tournamentId prop and conditionally render based on tournament status
    status: completed
---

# Tournament Management System Implementation

## Overview

The current system is hardcoded for a single tournament (Short Cricket 2026). We need to:

1. Create a tournament configuration system
2. Add tournament selector/switcher UI
3. Make PREDICTIONS tab conditional (only for active tournaments)
4. Archive the completed Short Cricket 2026 tournament
5. Prepare structure for the new Long Pitch BCL tournament (Oct 2026, 8 teams)

## Architecture Changes

### 1. Tournament Configuration System (JSON-based)

**New directory: `src/data/tournaments/`**

- Create JSON files for each tournament:
  - `short-cricket-2026.json` - Completed tournament config
  - `long-pitch-2026.json` - Upcoming tournament config (placeholder)

**New file: `src/lib/tournaments.ts`**

- Define tournament interface matching JSON structure:
  - `id`: unique identifier
  - `name`: display name (e.g., "BCL Short Cricket 2026", "BCL Long Pitch 2026")
  - `type`: tournament type (e.g., "short-cricket", "long-pitch")
  - `year`: year (2026)
  - `status`: "active" | "completed" | "upcoming"
  - `startDate`: tournament start date
  - `endDate`: tournament end date
  - `groupStructure`: "single" | "two-groups" | "four-groups"
  - `teamsPerGroup`: number of teams per group
  - `totalTeams`: total number of teams
  - `groups`: array of group configurations (e.g., ['A', 'B'] or ['All'])
  - `teams`: object mapping groups to team arrays

- Import tournament JSON files
- Export helper functions:
  - `getTournament(id)`: get tournament by ID from JSON
  - `getActiveTournament()`: get currently active tournament
  - `getAllTournaments()`: get all tournaments from JSON files
  - `isTournamentActive(id)`: check if tournament is active

### 2. Schedule Data (JSON-based)

**New directory: `src/data/schedules/`**

- Create JSON files for each tournament schedule:
  - `short-cricket-2026.json` - Schedule data for Short Cricket 2026
  - `long-pitch-2026.json` - Placeholder for Long Pitch 2026 schedule

**Update: `src/lib/schedule.ts`**

- Change `SCHEDULE` to be a function: `getSchedule(tournamentId: string): DaySchedule[]`
- Import schedule JSON files dynamically based on tournamentId
- Keep current schedule data structure but load from JSON
- Export helper: `loadSchedule(tournamentId)`: loads schedule from JSON file

### 3. Standings Calculation (Tournament-Aware)

**Update: `src/lib/standings.ts`**

- Update `calculateStandings()` to accept tournament configuration
- Get team lists from tournament JSON config instead of hardcoded
- Make group structure dynamic based on tournament config
- Function signature: `calculateStandings(schedule: DaySchedule[], tournament: Tournament): GroupStandings[]`

### 3. Tournament Selector Component

**New file: `src/components/schedule/TournamentSelector.tsx`**

- Dropdown/select component to switch between tournaments
- Shows tournament name, year, and status badge
- Filters to show only relevant tournaments (completed + active)
- Mobile-first design matching current UI

### 4. Update Main Landing Page

**Update: `src/routes/index.tsx`**

- Add tournament state management
- Integrate TournamentSelector component in header
- Pass selected tournament to child components
- Conditionally show PREDICTIONS tab only for active tournaments
- Update tab list to exclude PREDICTIONS when tournament is completed

### 5. Update Child Components

**Update: `src/components/schedule/MatchSchedule.tsx`**

- Accept `tournamentId` prop
- Use tournament-specific schedule data

**Update: `src/components/schedule/StandingsTab.tsx`**

- Accept `tournamentId` prop
- Use tournament-specific standings calculation

**Update: `src/components/schedule/TeamsTab.tsx`**

- Accept `tournamentId` prop
- Display teams based on tournament configuration

**Update: `src/components/schedule/PredictionTab.tsx`**

- Accept `tournamentId` prop
- Only render if tournament status is "active"
- Use tournament-specific group structure

### 6. Team Mapping Updates

**Update: `src/utils/team-mapping.ts`**

- Make team mapping tournament-aware if needed
- Or keep it global if teams are consistent across tournaments

## Implementation Details

### Tournament Data Structure Example

```typescript
interface Tournament {
  id: string;
  name: string;
  type: 'short-cricket' | 'long-pitch';
  year: number;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  endDate?: string;
  groupStructure: 'single' | 'two-groups';
  groups: string[];
  teams: {
    [group: string]: string[]; // e.g., { 'A': ['Team1', 'Team2'], 'B': [...] }
  };
}
```

### Tournament Selector UI

- Place in header, next to theme toggle
- Dropdown shows: "Short Cricket 2026 (Completed)" and "Long Pitch 2026 (Upcoming)"
- Default to most recent completed or active tournament

### PREDICTIONS Tab Logic

- Check tournament status before showing tab
- If status is "completed" or "upcoming", hide PREDICTIONS tab
- Only show for "active" tournaments

## Files to Create/Modify

### New Files

- `src/lib/tournaments.ts` - Tournament configuration system and JSON loaders
- `src/data/tournaments/short-cricket-2026.json` - Short Cricket 2026 tournament config
- `src/data/tournaments/long-pitch-2026.json` - Long Pitch 2026 tournament config (placeholder)
- `src/data/schedules/short-cricket-2026.json` - Short Cricket 2026 schedule data
- `src/data/schedules/long-pitch-2026.json` - Long Pitch 2026 schedule data (placeholder)

### Modified Files

- `src/routes/index.tsx` - Add tournament selector and conditional PREDICTIONS tab
- `src/lib/schedule.ts` - Make schedule tournament-aware
- `src/lib/standings.ts` - Make standings tournament-aware
- `src/components/schedule/MatchSchedule.tsx` - Accept tournament prop
- `src/components/schedule/StandingsTab.tsx` - Accept tournament prop
- `src/components/schedule/TeamsTab.tsx` - Accept tournament prop
- `src/components/schedule/PredictionTab.tsx` - Accept tournament prop, conditional rendering

### Optional New Component

- `src/components/schedule/TournamentSelector.tsx` - Tournament switcher UI

## Migration Strategy

1. **Phase 1**: Create tournament system without breaking existing functionality

   - Add tournaments.ts with current tournament as "completed"
   - Make schedule/standings accept optional tournament parameter (defaults to current)

2. **Phase 2**: Add tournament selector UI

   - Add selector component
   - Update index.tsx to use tournament state

3. **Phase 3**: Make components tournament-aware

   - Update all schedule components to use tournament data
   - Add conditional PREDICTIONS tab logic

4. **Phase 4**: Prepare for new tournament

   - Add LONG_PITCH_2026 tournament config (placeholder)
   - Structure ready for 8 teams (configurable group structure)

## Data Management (JSON-based)

### JSON File Structure

**Tournament Config (`src/data/tournaments/*.json`):**

```json
{
  "id": "short-cricket-2026",
  "name": "BCL Short Cricket 2026",
  "type": "short-cricket",
  "year": 2026,
  "status": "completed",
  "startDate": "2026-01-24",
  "endDate": "2026-01-26",
  "groupStructure": "two-groups",
  "totalTeams": 12,
  "groups": ["A", "B"],
  "teams": {
    "A": ["Riders", "RCB", "Royal Tiger", "Phoenix", "Bulldozers", "USA"],
    "B": ["Sharks", "Super Kings", "OG", "Monsters", "YKR", "Titans"]
  }
}
```

**Schedule Data (`src/data/schedules/*.json`):**

- Same structure as current `DaySchedule[]` array
- One JSON file per tournament
- Imported dynamically based on tournamentId

### Data Loading Strategy

- Use Vite's static imports for JSON files
- All tournament and schedule data loaded at build time (no runtime fetches)
- Type-safe with TypeScript interfaces
- Easy to edit: just update JSON files to modify tournament data

## Notes

- Keep backward compatibility during migration
- Tournament selector should persist selection (localStorage) for better UX
- Champions image can stay on landing page as it's specific to Short Cricket 2026
- New tournament structure will be flexible to handle different group configurations
- All data is managed via JSON files - no database connections needed
- JSON files are version-controlled and can be easily edited/managed