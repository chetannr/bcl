import { STANDINGS } from '../../lib/standings';
import { getTeamInfo } from '../../utils/team-mapping';
import { getAssetPath } from '../../utils/assets';

interface StandingsTabProps {
  theme: 'dark' | 'light';
}

export function StandingsTab({ theme }: StandingsTabProps) {
  const isDark = theme === 'dark';

  return (
    <section className="space-y-6" aria-label="Tournament standings">
      {/* Header */}
      <header className="mb-4">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Group stage
        </h2>
      </header>

      {/* Standings Tables */}
      {STANDINGS.map((groupStandings) => (
        <article key={groupStandings.group} className="mb-6" aria-labelledby={`group-${groupStandings.group}-heading`}>
          {/* Group Header */}
          <header className="mb-3">
            <h3 
              id={`group-${groupStandings.group}-heading`}
              className={`text-base font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}
            >
              {groupStandings.group}
            </h3>
          </header>

          {/* Table */}
          <div className={`${isDark ? 'bg-neutral-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-neutral-700' : 'border-neutral-200'} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table 
                className="w-full"
                role="table"
                aria-label={`${groupStandings.group} standings table`}
              >
                <thead>
                  <tr className={`border-b ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}>
                    <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      Team
                    </th>
                    <th scope="col" className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      <abbr title="Matches Played">M</abbr>
                    </th>
                    <th scope="col" className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      <abbr title="Won">W</abbr>
                    </th>
                    <th scope="col" className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      <abbr title="Lost">L</abbr>
                    </th>
                    <th scope="col" className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      <abbr title="Net Run Rate">NRR</abbr>
                    </th>
                    <th scope="col" className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                      <abbr title="Points">Pts</abbr>
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
                        <th scope="row" className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={getAssetPath(teamInfo?.logoPath || '/assets/player-template.png')}
                              alt={`${teamInfo?.fullName || abbreviation} team logo`}
                              className="w-6 h-6 object-contain rounded-full shrink-0"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                              }}
                            />
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                              {abbreviation}
                            </span>
                          </div>
                        </th>
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
        </article>
      ))}
    </section>
  );
}
