import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getAssetPath } from '../../utils/assets';
import { formatCurrency } from '../../utils/currency';

interface TeamsTabProps {
  theme: 'dark' | 'light';
}

export function TeamsTab({ theme }: TeamsTabProps) {
  const teams = useQuery(api.queries.getTeams);
  const isDark = theme === 'dark';

  if (teams === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Loading teams...</div>
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>No teams found</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <div
          key={team.id}
          className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-lg p-4 border`}
        >
          <div className="flex items-center gap-4">
            <img
              src={getAssetPath(team.logo_url)}
              alt={team.name}
              className={`w-16 h-16 object-contain rounded-lg ${isDark ? 'bg-neutral-700' : 'bg-neutral-100'} p-2`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
              }}
            />
            <div className="flex-1">
              <h3 className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {team.name}
              </h3>
              <div className={`space-y-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {formatCurrency(team.current_balance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Players:</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {team.players_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
