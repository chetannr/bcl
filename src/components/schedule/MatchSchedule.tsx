import { useState, useMemo } from 'react';
import { SCHEDULE } from '../../lib/schedule';
import { getTeamInfo } from '../../utils/team-mapping';
import { getAssetPath } from '../../utils/assets';
import { ChevronDown, Table2, LayoutGrid } from 'lucide-react';

interface MatchScheduleProps {
  theme: 'dark' | 'light';
}

type ViewMode = 'card' | 'table';

export function MatchSchedule({ theme }: MatchScheduleProps) {
  const isDark = theme === 'dark';
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Get all unique teams from schedule, sorted alphabetically by full name
  const allTeams = useMemo(() => {
    const teams = new Set<string>();
    SCHEDULE.forEach((day) => {
      day.matches.forEach((match) => {
        if (match.team1 !== 'TBD') teams.add(match.team1);
        if (match.team2 !== 'TBD') teams.add(match.team2);
      });
    });
    return Array.from(teams).sort((a, b) => {
      const teamAName = getTeamInfo(a)?.fullName || a;
      const teamBName = getTeamInfo(b)?.fullName || b;
      return teamAName.localeCompare(teamBName);
    });
  }, []);

  // Filter schedule based on selected team
  const filteredSchedule = useMemo(() => {
    if (selectedTeam === 'all') {
      return SCHEDULE;
    }

    return SCHEDULE.map((daySchedule) => ({
      ...daySchedule,
      matches: daySchedule.matches.filter(
        (match) => match.team1 === selectedTeam || match.team2 === selectedTeam
      ),
    })).filter((daySchedule) => daySchedule.matches.length > 0);
  }, [selectedTeam]);

  // Render match card
  const renderMatchCard = (match: typeof SCHEDULE[0]['matches'][0]) => {
    const team1Info = getTeamInfo(match.team1);
    const team2Info = getTeamInfo(match.team2);
    const isTBD = match.team1 === 'TBD' || match.team2 === 'TBD';
    const matchLabel = `Match ${match.slot}: ${team1Info?.fullName || match.team1} vs ${team2Info?.fullName || match.team2} at ${match.time}`;

    return (
      <article
        key={match.slot}
        className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-lg p-4 border`}
        role="listitem"
        aria-label={matchLabel}
      >
        {/* Match Type / Details */}
        <div className="mb-2 flex justify-between items-center gap-2">
          {match.matchType ? (
            <span className={`text-xs ${isDark ? 'text-white' : 'text-neutral-600'}`}>
              {match.matchType} · Match {match.slot} of {SCHEDULE.reduce((sum, day) => sum + day.matchCount, 0)}
            </span>
          ) : (
            <span className={`text-xs ${isDark ? 'text-white' : 'text-neutral-600'}`}>
              Match {match.slot} of {SCHEDULE.reduce((sum, day) => sum + day.matchCount, 0)}
            </span>
          )}
          {!match.matchType && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isDark 
                ? 'bg-primary-900/30 text-primary-300 border border-primary-700/50 text-white' 
                : 'bg-primary-100 text-primary-800 border border-primary-200 text-neutral-900'
            }`}>
              Group {match.group}
            </span>
          )}
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="text-right">
              <span className={`text-[14px] text-right font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {team1Info?.fullName || match.team1}
              </span>
              {match.result && (
                <div className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {match.result.team1Score}
                </div>
              )}
            </div>
            {isTBD ? (
              <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'} flex items-center justify-center`}>
                <svg
                  className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            ) : (
              <img
                src={getAssetPath(team1Info?.logoPath || '/assets/player-template.png')}
                alt={`${team1Info?.fullName || match.team1} team logo`}
                className="w-12 h-12 object-contain rounded"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                }}
              />
            )}
          </div>

          <span className={`mx-2 text-sm ${isDark ? 'text-white' : 'text-neutral-600'}`}>vs</span>

          <div className="flex items-center gap-3 flex-1 justify-start">
            {isTBD ? (
              <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'} flex items-center justify-center`}>
                <svg
                  className={`w-5 h-5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            ) : (
              <img
                src={getAssetPath(team2Info?.logoPath || '/assets/player-template.png')}
                alt={`${team2Info?.fullName || match.team2} team logo`}
                className="w-12 h-12 object-contain rounded"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                }}
              />
            )}
            <div className="text-left">
              <span className={`text-[14px] font-medium text-left ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {team2Info?.fullName || match.team2}
              </span>
              {match.result && (
                <div className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {match.result.team2Score}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result or Time */}
        {match.result ? (
          <div className="mt-2 flex justify-between items-center">
            <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-primary-600'}`}>
              {match.result.winner} won by {match.result.margin}
            </div>
            <time 
              className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
              dateTime={match.time}
            >
              Played at {match.time.toLowerCase()}
            </time>
          </div>
        ) : (
          <div className="mt-2">
            <time 
              className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
              dateTime={match.time}
            >
              Starts at {match.time.toLowerCase()}
            </time>
          </div>
        )}
      </article>
    );
  };

  return (
    <section className="space-y-6" aria-label="Match schedule">
      {/* Filters and View Toggle */}
      <div className="mb-4 space-y-3">
        <div className="flex items-end gap-3">
          {/* Team Filter */}
          <div className="flex-1">
            <label 
              htmlFor="team-filter"
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
            >
              Filter by Team
            </label>
            <div className="relative">
              <select
                id="team-filter"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                aria-label="Filter matches by team"
                className={`
                  w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg border text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  transition-colors
                  ${
                    isDark
                      ? 'bg-neutral-800 border-neutral-700 text-white'
                      : 'bg-white border-neutral-300 text-neutral-900'
                  }
                `}
              >
                <option value="all">All Teams</option>
                {allTeams.map((team) => {
                  const teamInfo = getTeamInfo(team);
                  return (
                    <option key={team} value={team}>
                      {teamInfo?.fullName || team}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" aria-hidden="true">
                <ChevronDown
                  className={`w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
                />
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div>
            <label 
              id="view-mode-label"
              className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
            >
              View
            </label>
            <div 
              className={`flex rounded-lg border overflow-hidden ${
                isDark ? 'border-neutral-700' : 'border-neutral-300'
              }`}
              role="group"
              aria-labelledby="view-mode-label"
            >
              <button
                onClick={() => setViewMode('card')}
                className={`
                  px-3 py-2.5 transition-colors
                  ${viewMode === 'card'
                    ? isDark
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-500 text-white'
                    : isDark
                      ? 'bg-neutral-800 text-neutral-400 hover:text-neutral-300'
                      : 'bg-white text-neutral-600 hover:text-neutral-900'
                  }
                `}
                aria-label="Switch to card view"
                aria-pressed={viewMode === 'card'}
                type="button"
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`
                  px-3 py-2.5 transition-colors border-l ${
                    isDark ? 'border-neutral-700' : 'border-neutral-300'
                  }
                  ${viewMode === 'table'
                    ? isDark
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-500 text-white'
                    : isDark
                      ? 'bg-neutral-800 text-neutral-400 hover:text-neutral-300'
                      : 'bg-white text-neutral-600 hover:text-neutral-900'
                  }
                `}
                aria-label="Switch to table view"
                aria-pressed={viewMode === 'table'}
                type="button"
              >
                <Table2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      {filteredSchedule.length === 0 ? (
        <div 
          className={`text-center py-12 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
          role="status"
          aria-live="polite"
        >
          <p>No matches found for the selected team.</p>
        </div>
      ) : (
        filteredSchedule.map((daySchedule) => (
          <article key={daySchedule.date} aria-labelledby={`date-${daySchedule.date}`}>
            {/* Date Header */}
            <header className="mb-3 px-1">
              <h2 
                id={`date-${daySchedule.date}`}
                className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}
              >
                {daySchedule.day}, {daySchedule.date}
              </h2>
            </header>

            {/* Matches List */}
            {daySchedule.matches.length === 0 ? (
              <div 
                className={`text-sm ${isDark ? 'text-white' : 'text-neutral-500'}`}
                role="status"
              >
                No matches on this day
              </div>
            ) : viewMode === 'card' ? (
              <div className="space-y-3" role="list" aria-label={`Matches on ${daySchedule.day}, ${daySchedule.date}`}>
                {daySchedule.matches.map(renderMatchCard)}
              </div>
            ) : (
              <div className={`${isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'} rounded-lg border overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table 
                    className="w-full"
                    role="table"
                    aria-label={`Match schedule table for ${daySchedule.day}, ${daySchedule.date}`}
                  >
                    <thead>
                      <tr className={`border-b ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}>
                        <th scope="col" className={`px-1 py-3 align-top text-left text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                          Slot
                        </th>
                        <th scope="col" className={`px-1 py-3 align-top text-left text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                          Time
                        </th>
                        <th scope="col" className={`px-1 py-3 align-top text-left text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                          Match
                        </th>
                        <th scope="col" className={`px-1 py-3 align-top text-left text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                          Result
                        </th>
                        <th scope="col" className={`px-1 py-3 align-top text-center text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'} uppercase tracking-wider`}>
                          Group
                        </th> 
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-neutral-700' : 'divide-neutral-200'}`}>
                      {daySchedule.matches.map((match) => {
                        const team1Info = getTeamInfo(match.team1);
                        const team2Info = getTeamInfo(match.team2);
                        const isTBD = match.team1 === 'TBD' || match.team2 === 'TBD';

                        return (
                          <tr
                            key={match.slot}
                            className={`${isDark ? 'hover:bg-neutral-700/50' : 'hover:bg-neutral-50'} transition-colors`}
                          >
                            <td className={`px-1 py-3 text-sm font-medium text-center align-top ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                              {match.slot}
                            </td>
                            <td className={`px-1 py-3 align-top text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                              {match.time}
                            </td>
                            <td className="px-1 py-3 align-top">
                              <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 justify-end">
                                <span className={`text-sm font-medium text-right ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                  {team1Info?.fullName || match.team1}
                                </span>
                                {!isTBD && (
                                  <img
                                    src={getAssetPath(team1Info?.logoPath || '/assets/player-template.png')}
                                    alt={`${team1Info?.fullName || match.team1} team logo`}
                                    className="w-10 h-10 object-contain rounded"
                                    loading="lazy"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                                    }}
                                  />
                                )}
                                </div>
                                <span className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} aria-hidden="true">vs</span>
                                <div className="flex items-center gap-2 flex-1">
                                {!isTBD && (
                                  <img
                                    src={getAssetPath(team2Info?.logoPath || '/assets/player-template.png')}
                                    alt={`${team2Info?.fullName || match.team2} team logo`}
                                    className="w-10 h-10 object-contain rounded"
                                    loading="lazy"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                                    }}
                                  />
                                )}
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                                  {team2Info?.fullName || match.team2}
                                </span></div>
                              </div>
                            </td>
                            <td className="px-1 py-3 align-top">
                              {match.result ? (
                                <div className="space-y-0.5">
                                  <div className={`text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    {match.result.team1Score}
                                  </div>
                                  <div className={`text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                    {match.result.team2Score}
                                  </div>
                                  <div className={`text-xs font-semibold mt-1 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                                    {match.result.winner} won by {match.result.margin}
                                  </div>
                                </div>
                              ) : (
                                <span className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                  —
                                </span>
                              )}
                            </td>
                            <td className="px-1 py-3 align-top text-center">
                              {!match.matchType && (
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                  isDark 
                                    ? 'bg-primary-900/30 text-white border border-primary-700/50' 
                                    : 'bg-primary-100 text-primary-800 border border-primary-200'
                                }`}>
                                  {match.group}
                                </span>
                              )}
                            </td>
                            
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </article>
        ))
      )}
    </section>
  );
}
