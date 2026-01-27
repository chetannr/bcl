import { useMemo } from 'react';
import { getStandings } from '../../lib/standings';
import { getSchedule } from '../../lib/schedule';
import { getTournament } from '../../lib/tournaments';
import { getTeamInfo } from '../../utils/team-mapping';
import { getAssetPath } from '../../utils/assets';

interface StandingsTabProps {
  theme: 'dark' | 'light';
  tournamentId: string;
}

export function StandingsTab({ theme, tournamentId }: StandingsTabProps) {
  const isDark = theme === 'dark';

  const standings = useMemo(() => {
    const tournament = getTournament(tournamentId);
    if (!tournament) return [];
    const schedule = getSchedule(tournamentId);
    return getStandings(schedule, tournament);
  }, [tournamentId]);

  // Sort teams by rank: points (desc), then NRR (desc)
  function sortTeamsByRank(teams: typeof standings[0]['teams']) {
    return [...teams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });
  }

  return (
    <section className="space-y-8" aria-label="Tournament standings">
      {/* Standings Tables */}
      {standings.map((groupStandings) => {
        const sortedTeams = sortTeamsByRank(groupStandings.teams);
        
        return (
          <article key={groupStandings.group} className="space-y-3" aria-labelledby={`group-${groupStandings.group}-heading`}>
            {/* Group Header */}
            <h3 
              id={`group-${groupStandings.group}-heading`}
              className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}
            >
              {groupStandings.group}
            </h3>

            {/* Table */}
            <div className="overflow-x-auto">
              <table 
                className="w-full"
                role="table"
                aria-label={`${groupStandings.group} standings table`}
              >
                <thead>
                  <tr className={`border-b ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                    <th scope="col" className={`px-1.5 py-2.5 text-left text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Team
                    </th>
                    <th scope="col" className={`px-1.5 py-2.5 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      M
                    </th>
                    <th scope="col" className={`px-1.5 py-2.5 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      W
                    </th>
                    <th scope="col" className={`px-1.5 py-2.5 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      L
                    </th>
                    <th scope="col" className={`px-1.5 py-2.5 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      NRR
                    </th>
                    <th scope="col" className={`px-1.5 py-2.5 text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.map((standing, index) => {
                    const teamInfo = getTeamInfo(standing.teamAbbreviation);
                    const abbreviation = standing.teamAbbreviation;
                    const rank = index + 1;

                    return (
                      <tr
                        key={standing.teamAbbreviation}
                        className={`border-b ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}
                      >
                        <th scope="row" className="px-1.5 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                              {rank}
                            </span>
                            <img
                              src={getAssetPath(teamInfo?.logoPath || '/assets/player-template.png')}
                              alt={`${teamInfo?.fullName || abbreviation} team logo`}
                              className="w-5 h-5 object-contain rounded-full shrink-0"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                              }}
                            />
                            <span className={`text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                              {abbreviation}
                            </span>
                          </div>
                        </th>
                        <td className={`px-1.5 py-2.5 text-center text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {standing.matches}
                        </td>
                        <td className={`px-1.5 py-2.5 text-center text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {standing.won}
                        </td>
                        <td className={`px-1.5 py-2.5 text-center text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {standing.lost}
                        </td>
                        <td className={`px-1.5 py-2.5 text-center text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {standing.nrr > 0 ? '+' : ''}{standing.nrr.toFixed(3)}
                        </td>
                        <td className={`px-1.5 py-2.5 text-center text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {standing.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        );
      })}
    </section>
  );
}
