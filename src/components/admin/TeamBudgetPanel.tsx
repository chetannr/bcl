import { memo } from 'react';
import { useTeams } from '../../lib/queries';
import { formatCurrency } from '../../utils/currency';
import { getAssetPath } from '../../utils/assets';

export const TeamBudgetPanel = memo(function TeamBudgetPanel() {
  const { data: teams, isLoading } = useTeams();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-neutral-500">Loading teams...</div>
      </div>
    );
  }

  if (!teams) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 text-neutral-900">Team Budgets</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="border border-neutral-200 rounded-lg p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <img
                src={getAssetPath(team.logo_url)}
                alt={team.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-neutral-900 truncate">
                  {team.name}
                </div>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-neutral-600">
                Balance: <span className="font-semibold text-success-600">
                  {formatCurrency(team.current_balance)}
                </span>
              </div>
              <div className="text-neutral-600">
                Players: <span className="font-semibold">{team.players_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
