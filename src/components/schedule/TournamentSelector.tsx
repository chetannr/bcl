import { getAllTournaments, type Tournament } from '../../lib/tournaments';

interface TournamentSelectorProps {
  selectedTournamentId: string;
  onTournamentChange: (tournamentId: string) => void;
  theme: 'dark' | 'light';
}

export function TournamentSelector({ selectedTournamentId, onTournamentChange, theme }: TournamentSelectorProps) {
  const isDark = theme === 'dark';
  const tournaments = getAllTournaments();

  function getStatusBadge(status: Tournament['status']) {
    const badges = {
      active: { label: 'Active', className: isDark ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-green-100 text-green-700 border-green-300' },
      completed: { label: 'Completed', className: isDark ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-neutral-100 text-neutral-600 border-neutral-300' },
      upcoming: { label: 'Upcoming', className: isDark ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' : 'bg-blue-100 text-blue-700 border-blue-300' },
    };
    return badges[status];
  }

  return (
    <div className="w-full flex items-center gap-2">
      <label 
        htmlFor="tournament-select"
        className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} sr-only sm:not-sr-only`}
      >
        Tournament:
      </label>
      <select
        id="tournament-select"
        value={selectedTournamentId}
        onChange={(e) => onTournamentChange(e.target.value)}
        className={`
          text-sm px-3 py-1.5 rounded-lg border transition-colors
          ${isDark 
            ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700' 
            : 'bg-white border-neutral-300 text-neutral-900 hover:bg-neutral-50'
          }
          focus:outline-none focus:ring-2 focus:ring-primary-500
        `}
        aria-label="Select tournament"
      >
        {tournaments.map((tournament) => {
          const badge = getStatusBadge(tournament.status);
          return (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name} ({badge.label})
            </option>
          );
        })}
      </select>
    </div>
  );
}
