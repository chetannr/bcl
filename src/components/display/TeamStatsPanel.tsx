import { useState } from 'react';
import { useTeams } from '../../lib/queries';
import { formatCurrency } from '../../utils/currency';
import { TeamPlayersModal } from './TeamPlayersModal';
import type { Team } from '../../lib/types';

export function TeamStatsPanel() {
  const { data: teams, isLoading } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <div className="text-white text-center">Loading teams...</div>
      </div>
    );
  }

  if (!teams) {
    return null;
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white text-xl font-bold mb-4 text-center">Team Status</h3>
        <div className="grid grid-cols-4 gap-3 overflow-x-auto">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className="bg-white/20 backdrop-blur-sm flex flex-row gap-6 rounded-lg p-3 min-w-[140px] border-2 border-white/30 cursor-pointer hover:bg-white/30 hover:border-white/50 transition-all"
            >
              <img
                src={team.logo_url}
                alt={team.name}
                className="w-36 h-36 object-contain bg-black rounded p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/player-template.png';
                }}
              />
              <div className="flex flex-col items-center text-center">
                <div className="text-white text-xl font-semibold mb-1 w-full">
                  {team.name}
                </div>
                <div className="text-white/90 font-bold font-mono text-4xl">
                  {formatCurrency(team.current_balance)}
                </div>
                <div className="text-white/75 font-mono text-4xl mt-1">
                  {team.players_count} player{team.players_count !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedTeam && teams && (
        <TeamPlayersModal
          team={selectedTeam}
          teams={teams}
          onClose={() => setSelectedTeam(null)}
          onNavigateTeam={setSelectedTeam}
        />
      )}
    </>
  );
}
