import { useEffect, useRef } from 'react';
import { useAuctionResults } from '../../lib/queries';
import { formatCurrency } from '../../utils/currency';
import { X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Team } from '../../lib/types';

interface TeamPlayersModalProps {
  team: Team | null;
  teams: Team[];
  onClose: () => void;
  onNavigateTeam: (team: Team) => void;
}

export function TeamPlayersModal({ team, teams, onClose, onNavigateTeam }: TeamPlayersModalProps) {
  const { data: auctionResults, isLoading } = useAuctionResults();
  const modalRef = useRef<HTMLDivElement>(null);

  if (!team) {
    return null;
  }

  // Find current team index
  const currentTeamIndex = teams.findIndex((t) => t.id === team.id);
  const hasPrevious = currentTeamIndex > 0;
  const hasNext = currentTeamIndex < teams.length - 1;

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft' && hasPrevious) {
        event.preventDefault();
        onNavigateTeam(teams[currentTeamIndex - 1]);
      } else if (event.key === 'ArrowRight' && hasNext) {
        event.preventDefault();
        onNavigateTeam(teams[currentTeamIndex + 1]);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }

    // Focus the modal when it opens for keyboard events
    if (modalRef.current) {
      modalRef.current.focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentTeamIndex, hasPrevious, hasNext, teams, onNavigateTeam, onClose]);

  // Filter auction results to get players for this team
  const teamPlayers = auctionResults?.filter((result) => result.team_id === team.id) || [];

  // Check if all teams have purchased at least 12 players
  const allTeamsHaveMinPlayers = teams.every((t) => t.players_count >= 12);

  // Separate 13th slot from other placeholders
  // Regular placeholders are for slots 1-12 (if team has less than 12 players)
  const slotsNeededUpTo12 = Math.max(0, 12 - teamPlayers.length);
  const regularPlaceholders = Array.from({ length: slotsNeededUpTo12 });
  // 13th slot should be shown if team has less than 13 players
  const hasThirteenthSlot = teamPlayers.length < 13;

  function handlePrevious() {
    if (hasPrevious) {
      onNavigateTeam(teams[currentTeamIndex - 1]);
    }
  }

  function handleNext() {
    if (hasNext) {
      onNavigateTeam(teams[currentTeamIndex + 1]);
    }
  }

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 outline-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Players for ${team.name}`}
    >
      <div
        className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl max-w-[80%] w-full max-h-[90vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation buttons */}
        {hasPrevious && (
          <button
            type="button"
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 text-neutral-700 hover:bg-white hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 shadow-lg"
            aria-label="Previous team"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 text-neutral-700 hover:bg-white hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 shadow-lg"
            aria-label="Next team"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-4">
            <img
              src={team.logo_url}
              alt={team.name}
              className="w-16 h-16 object-contain bg-black rounded p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/player-template.png';
              }}
            />
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{team.name}</h2>
              <p className="text-neutral-600">
                {teamPlayers.length} player{teamPlayers.length !== 1 ? 's' : ''} • Team {currentTeamIndex + 1} of {teams.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600 font-mono">
                {formatCurrency(team.current_balance)}
              </div>
              <div className="text-sm text-neutral-500 mt-1">Balance</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Render actual players */}
                {teamPlayers
                  .sort((a, b) => a.auction_order - b.auction_order)
                  .map((result) => {
                    const player = result.player;
                    if (!player) return null;

                    return (
                      <div
                        key={result.id}
                        className="bg-white border-2 border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={player.photo_url}
                            alt={player.name}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-neutral-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/player-template.png';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-neutral-900">{player.auction_serial_number}{' : '}{player.name}</h3>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-neutral-600">
                              <span>Age: {player.age}</span>
                              <span>Category: {player.category}</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-lg font-bold text-primary-600">
                                {formatCurrency(result.final_amount)}
                              </span>
                              <span className="text-xs text-neutral-500">#{result.auction_order}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                
                {/* Render regular placeholder slots (1-12) */}
                {regularPlaceholders.map((_, index) => {
                  const slotNumber = teamPlayers.length + index + 1;

                  return (
                    <div
                      key={`placeholder-${slotNumber}`}
                      className="bg-white border-2 border-neutral-200 border-dashed rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src="/assets/player-template.png"
                          alt="Empty slot"
                          className="w-24 h-24 object-contain rounded-lg border-2 border-neutral-200 shrink-0 opacity-50"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-neutral-400 truncate">Slot {slotNumber}</h3>
                          <div className="mt-2 text-sm text-neutral-500">
                            <p>Available slot</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Render 13th slot as full-width card */}
              {hasThirteenthSlot && (
                <div className="mt-6">
                  <div className="border-4 border-amber-400 bg-amber-50/50 rounded-lg p-8 shadow-lg">
                    <div className="flex items-center gap-8">
                      <img
                        src="/assets/player-template.png"
                        alt="Empty slot 13"
                        className="w-48 h-48 object-contain rounded-lg border-4 border-amber-300 shrink-0 opacity-60"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-4xl font-bold text-neutral-700 mb-4">Slot 13</h3>
                        <div className="space-y-3">
                          <p className="text-2xl text-amber-800 font-bold leading-relaxed">
                            This slot can be purchased only if all teams have purchased a minimum of 12 players each.
                          </p>
                          <p className="text-xl text-neutral-700">
                            {allTeamsHaveMinPlayers ? (
                              <span className="text-green-600 font-bold">✓ Condition met - Available for purchase</span>
                            ) : (
                              <span className="text-amber-700 font-semibold">Waiting for all teams to reach 12 players...</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
