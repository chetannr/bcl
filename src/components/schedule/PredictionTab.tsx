import { useMemo } from 'react';
import { getStandings } from '../../lib/standings';
import { getSchedule } from '../../lib/schedule';
import { getTournament, isTournamentActive } from '../../lib/tournaments';
import { getTeamInfo } from '../../utils/team-mapping';
import { getAssetPath } from '../../utils/assets';

interface PredictionTabProps {
  theme: 'dark' | 'light';
  tournamentId: string;
}

interface TeamPrediction {
  team: string;
  currentRank: number;
  currentPoints: number;
  currentNRR: number;
  remainingMatches: number;
  maxPossiblePoints: number;
  qualificationStatus: 'qualified' | 'can-qualify' | 'eliminated' | 'uncertain';
  keyMatches: Array<{
    opponent: string;
    slot: number;
    date: string;
    importance: 'critical' | 'important' | 'normal';
  }>;
}

export function PredictionTab({ theme, tournamentId }: PredictionTabProps) {
  const isDark = theme === 'dark';
  const tournament = useMemo(() => getTournament(tournamentId), [tournamentId]);

  // Only show predictions for active tournaments
  if (!tournament || !isTournamentActive(tournamentId)) {
    return (
      <section className="space-y-6" aria-label="Tournament predictions">
        <div className={`text-center py-8 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          <p>Predictions are only available for active tournaments.</p>
        </div>
      </section>
    );
  }

  const schedule = useMemo(() => getSchedule(tournamentId), [tournamentId]);
  const standings = useMemo(() => {
    if (!tournament) return [];
    return getStandings(schedule, tournament);
  }, [schedule, tournament]);

  // Get all teams and their remaining matches
  function getTeamPredictions(group: string): TeamPrediction[] {
    const groupStandings = standings.find(s => s.group === group);
    if (!groupStandings) return [];

    // Sort teams by rank
    const sortedTeams = [...groupStandings.teams].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });

    // Get all matches for this group
    const allMatches = schedule.flatMap(day => day.matches)
      .filter(m => m.group === group && !m.matchType);

    // Calculate total matches per team (should be 5 in round-robin)
    const totalMatchesPerTeam = 5;

    return sortedTeams.map((standing, index) => {
      const team = standing.teamAbbreviation;
      
      // Find remaining matches for this team
      const remainingMatches = allMatches.filter(m => 
        !m.result && 
        (m.team1 === team || m.team2 === team) &&
        m.team1 !== 'No Match' && m.team2 !== 'No Match'
      );

      // Find key matches (against teams in top 4 or direct competitors)
      const top4Teams = sortedTeams.slice(0, 4).map(t => t.teamAbbreviation);
      const keyMatches = remainingMatches.map(match => {
        const opponent = match.team1 === team ? match.team2 : match.team1;
        const opponentRank = sortedTeams.findIndex(t => t.teamAbbreviation === opponent) + 1;
        const daySchedule = schedule.find(day => day.matches.includes(match));
        
        let importance: 'critical' | 'important' | 'normal' = 'normal';
        if (top4Teams.includes(opponent) && opponentRank <= 3) {
          importance = 'critical';
        } else if (top4Teams.includes(opponent)) {
          importance = 'important';
        }

        return {
          opponent,
          slot: match.slot,
          date: daySchedule?.date || '',
          importance,
        };
      });

      const maxPossiblePoints = standing.points + (remainingMatches.length * 2);
      
      // Determine qualification status
      // Top 2 qualify (assuming 2 teams per group qualify)
      let qualificationStatus: 'qualified' | 'can-qualify' | 'eliminated' | 'uncertain' = 'uncertain';
      const currentRank = index + 1;
      
      if (currentRank <= 2 && maxPossiblePoints >= standing.points) {
        qualificationStatus = 'can-qualify';
        if (standing.points >= 6 && currentRank <= 2) {
          qualificationStatus = 'qualified';
        }
      } else if (maxPossiblePoints < 4 && currentRank > 3) {
        qualificationStatus = 'eliminated';
      }

      return {
        team,
        currentRank,
        currentPoints: standing.points,
        currentNRR: standing.nrr,
        remainingMatches: remainingMatches.length,
        maxPossiblePoints,
        qualificationStatus,
        keyMatches,
      };
    });
  }

  function getStatusColor(status: TeamPrediction['qualificationStatus']) {
    switch (status) {
      case 'qualified':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'can-qualify':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'eliminated':
        return isDark ? 'text-red-400' : 'text-red-600';
      default:
        return isDark ? 'text-neutral-400' : 'text-neutral-600';
    }
  }

  function getStatusBadgeColor(status: TeamPrediction['qualificationStatus']) {
    switch (status) {
      case 'qualified':
        return isDark ? 'bg-green-900/30 border-green-700/50 text-green-400' : 'bg-green-100 border-green-300 text-green-700';
      case 'can-qualify':
        return isDark ? 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400' : 'bg-yellow-100 border-yellow-300 text-yellow-600';
      case 'eliminated':
        return isDark ? 'bg-red-900/30 border-red-700/50 text-red-400' : 'bg-red-100 border-red-300 text-red-600';
      default:
        return isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : 'bg-neutral-100 border-neutral-300 text-neutral-600';
    }
  }

  return (
    <section className="space-y-6" aria-label="Tournament predictions">
      {/* Header */}
      <header className="mb-4">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Qualification Predictions
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Track remaining matches and qualification scenarios for each team
        </p>
      </header>

      {/* Predictions for each group */}
      {tournament.groups.map((group) => {
        const predictions = getTeamPredictions(group);
        
        return (
          <article key={group} className="mb-6" aria-labelledby={`prediction-group-${group}-heading`}>
            {/* Group Header */}
            <header className="mb-3">
              <h3 
                id={`prediction-group-${group}-heading`}
                className={`text-base font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}
              >
                Group {group}
              </h3>
            </header>

            {/* Team Predictions */}
            <div className="space-y-4">
              {predictions.map((prediction) => {
                const teamInfo = getTeamInfo(prediction.team);
                
                return (
                  <div
                    key={prediction.team}
                    className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-lg border p-4`}
                  >
                    {/* Team Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAssetPath(teamInfo?.logoPath || '/assets/player-template.png')}
                          alt={`${teamInfo?.fullName || prediction.team} team logo`}
                          className="w-8 h-8 object-contain rounded-full shrink-0"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                          }}
                        />
                        <div>
                          <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            {prediction.team}
                          </h4>
                          <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            Rank #{prediction.currentRank} • {prediction.currentPoints} pts • NRR: {prediction.currentNRR > 0 ? '+' : ''}{prediction.currentNRR.toFixed(3)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(prediction.qualificationStatus)}`}>
                        {prediction.qualificationStatus === 'qualified' && 'Qualified'}
                        {prediction.qualificationStatus === 'can-qualify' && 'Can Qualify'}
                        {prediction.qualificationStatus === 'eliminated' && 'Eliminated'}
                        {prediction.qualificationStatus === 'uncertain' && 'Uncertain'}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className={`${isDark ? 'bg-neutral-900/50' : 'bg-neutral-50'} rounded p-2`}>
                        <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Remaining Matches</p>
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {prediction.remainingMatches}
                        </p>
                      </div>
                      <div className={`${isDark ? 'bg-neutral-900/50' : 'bg-neutral-50'} rounded p-2`}>
                        <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Max Possible Points</p>
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {prediction.maxPossiblePoints}
                        </p>
                      </div>
                    </div>

                    {/* Key Matches */}
                    {prediction.keyMatches.length > 0 && (
                      <div>
                        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          Upcoming Matches:
                        </p>
                        <div className="space-y-1">
                          {prediction.keyMatches.map((match, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between text-xs p-2 rounded ${
                                match.importance === 'critical'
                                  ? isDark ? 'bg-red-900/20 border border-red-800/50' : 'bg-red-50 border border-red-200'
                                  : match.importance === 'important'
                                  ? isDark ? 'bg-yellow-900/20 border border-yellow-800/50' : 'bg-yellow-50 border border-yellow-200'
                                  : isDark ? 'bg-neutral-900/50' : 'bg-neutral-50'
                              }`}
                            >
                              <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                                vs {match.opponent}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
                                  {match.date}
                                </span>
                                {match.importance === 'critical' && (
                                  <span className={`text-xs ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                    ⚠ Critical
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </section>
  );
}
