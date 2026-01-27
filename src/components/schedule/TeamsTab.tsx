import { useMemo } from 'react';
import { getTournament } from '../../lib/tournaments';
import { getTeamInfo } from '../../utils/team-mapping';
import { getAssetPath } from '../../utils/assets';

interface TeamsTabProps {
  theme: 'dark' | 'light';
  tournamentId: string;
}

export function TeamsTab({ theme, tournamentId }: TeamsTabProps) {
  const isDark = theme === 'dark';
  const tournament = useMemo(() => getTournament(tournamentId), [tournamentId]);

  if (!tournament) {
    return (
      <section className="space-y-8" aria-label="Tournament teams">
        <p className={`text-center ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Tournament not found
        </p>
      </section>
    );
  }

  // Get teams from tournament config
  const teamsByGroup = useMemo(() => {
    const result: Record<string, Array<{ abbreviation: string; name: string; logoPath: string }>> = {};
    for (const group of tournament.groups) {
      result[group] = (tournament.teams[group] || []).map(abbreviation => {
        const teamInfo = getTeamInfo(abbreviation);
        return {
          abbreviation,
          name: teamInfo?.fullName || abbreviation,
          logoPath: teamInfo?.logoPath || '/assets/player-template.png',
        };
      });
    }
    return result;
  }, [tournament]);

  return (
    <section className="space-y-8" aria-label="Tournament teams">
      {/* Header */}
      <header className="text-center space-y-2">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          {tournament.name} Teams
        </h2>
        <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          {tournament.groupStructure === 'two-groups' ? 'Competing in two groups for ultimate glory' : 'All teams competing for ultimate glory'}
        </p>
      </header>

      {/* Groups */}
      {tournament.groups.map((group) => (
        <article key={group} className="space-y-4" aria-labelledby={`group-${group}-heading`}>
          <header>
            <h3 
              id={`group-${group}-heading`}
              className={`inline-flex items-center px-4 py-2 rounded-full ${
                isDark 
                  ? 'bg-primary-900/30 text-white border border-primary-700/50' 
                  : 'bg-primary-100 text-primary-900 border border-primary-200'
              }`}
            >
              <span className="text-lg font-bold">Group {group}</span>
            </h3>
          </header>
          
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
            role="list"
            aria-label={`Group ${group} teams`}
          >
            {teamsByGroup[group]?.map((team) => (
            <article
              key={team.abbreviation}
              className={`${
                isDark ? 'bg-neutral-800 border-neutral-700 hover:border-primary-600' : 'bg-white border-neutral-200 hover:border-primary-400'
              } rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center space-y-4`}
              role="listitem"
              aria-label={`${team.name} team card`}
            >
              {/* Emphasized Logo */}
              <div className={`w-32 h-32 flex items-center justify-center  ${
                isDark ? 'bg-neutral-900/50' : 'bg-neutral-50'
              } p-4 ring-4 ${
                isDark ? 'ring-primary-900/30' : 'ring-primary-100'
              }`}>
                <img
                  src={getAssetPath(team.logoPath)}
                  alt={`${team.name} team logo`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                  }}
                />
              </div>
              
              {/* Team Info */}
              <div className="space-y-2">
                <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {team.name}
                </h4>
              </div>
            </article>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
