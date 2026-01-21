import { STANDINGS } from '../../lib/standings';
import { getTeamInfo } from '../../utils/team-mapping';
import { getAssetPath } from '../../utils/assets';

interface StandingsTabProps {
  theme: 'dark' | 'light';
}

export function StandingsTab({ theme }: StandingsTabProps) {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Group stage
        </h2>
      </div>

      {/* Standings Tables */}
      {STANDINGS.map((groupStandings) => (
        <div key={groupStandings.group} className="mb-6">
          {/* Group Header */}
          <div className="mb-3">
            <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {groupStandings.group}
            </h3>
          </div>

          {/* Table */}
          <div className={`${isDark ? 'bg-neutral-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-neutral-700' : 'border-neutral-200'} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      Team
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      M
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      W
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      L
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      NRR
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-neutral-700' : 'divide-neutral-200'}`}>
                  {groupStandings.teams.map((standing) => {
                    const teamInfo = getTeamInfo(standing.teamAbbreviation);
                    const abbreviation = standing.teamAbbreviation;

                    return (
                      <tr
                        key={standing.teamAbbreviation}
                        className={`${isDark ? 'hover:bg-neutral-700/50' : 'hover:bg-neutral-50'} transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={getAssetPath(teamInfo?.logoPath || '/assets/player-template.png')}
                              alt={teamInfo?.fullName || abbreviation}
                              className="w-6 h-6 object-contain rounded-full flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                              }}
                            />
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                              {abbreviation}
                            </span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-center text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {standing.matches}
                        </td>
                        <td className={`px-4 py-3 text-center text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {standing.won}
                        </td>
                        <td className={`px-4 py-3 text-center text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {standing.lost}
                        </td>
                        <td className={`px-4 py-3 text-center text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {standing.nrr > 0 ? '+' : ''}{standing.nrr.toFixed(3)}
                        </td>
                        <td className={`px-4 py-3 text-center text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {standing.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
