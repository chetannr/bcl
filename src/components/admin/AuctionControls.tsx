import { useState, useEffect, useRef } from 'react';
import { useTeams, useSellPlayer, useMarkPlayerUnsold, useAuctionResults } from '../../lib/queries';
import type { Player } from '../../lib/types';
import { validateBidAmount, validateTeamBalance } from '../../utils/validation';
import { formatCurrency } from '../../utils/currency';
import { getAssetPath } from '../../utils/assets';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface AuctionControlsProps {
  currentPlayer: Player | null;
  onNext: () => void;
}

export function AuctionControls({ currentPlayer, onNext }: AuctionControlsProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { data: teams } = useTeams();
  const { data: results } = useAuctionResults();
  const sellPlayer = useSellPlayer();
  const markUnsold = useMarkPlayerUnsold();
  const previousPlayerIdRef = useRef<string | undefined>(currentPlayer?.id);

  useEffect(() => {
    if (previousPlayerIdRef.current !== currentPlayer?.id) {
      previousPlayerIdRef.current = currentPlayer?.id;
      setBidAmount('');
      setSelectedTeamId('');
      setError('');
    }
  }, [currentPlayer?.id]);

  if (!currentPlayer) {
    return (
      <div className="bg-white rounded-lg shadow px-8 py-8">
        <p className="text-neutral-500 text-center">No player selected</p>
      </div>
    );
  }

  const handleSell = () => {
    setError('');
    
    if (!selectedTeamId) {
      setError('Please select a team');
      return;
    }

    const amount = parseFloat(bidAmount);
    
    if (!validateBidAmount(amount, currentPlayer.base_price)) {
      setError(`Bid must be at least ${formatCurrency(currentPlayer.base_price)}`);
      return;
    }

    const selectedTeam = teams?.find((t) => t.id === selectedTeamId);
    if (!selectedTeam) {
      setError('Team not found');
      return;
    }

    if (!validateTeamBalance(amount, selectedTeam.current_balance)) {
      setError(`Team balance insufficient. Available: ${formatCurrency(selectedTeam.current_balance)}`);
      return;
    }

    const nextOrder = (results?.length || 0) + 1;

    sellPlayer.mutate(
      {
        playerId: currentPlayer.id,
        teamId: selectedTeamId,
        amount,
        auctionOrder: nextOrder,
      },
      {
        onSuccess: () => {
          console.log('[AuctionControls] Player sold successfully, keeping current player displayed');
          setBidAmount('');
          setSelectedTeamId('');
          // Removed onNext() - keep current player displayed so user can manually select next player
        },
        onError: (err: Error) => {
          console.error('[AuctionControls] Error selling player:', err);
          setError(err.message || 'Failed to sell player');
        },
      }
    );
  };

  const handleMarkUnsold = () => {
    markUnsold.mutate(currentPlayer.id, {
      onSuccess: () => {
        onNext();
      },
    });
  };

  const selectedTeam = teams?.find((t) => t.id === selectedTeamId);
  const amount = parseFloat(bidAmount) || 0;
  const isValidBid =
    amount >= currentPlayer.base_price &&
    selectedTeam &&
    amount <= selectedTeam.current_balance;

  const eligibleTeams = teams?.filter((team) => team.current_balance >= currentPlayer.base_price) || [];

  return (
    <div className="bg-white rounded-lg shadow px-8 py-8 space-y-2">
      <h3 className="text-lg font-bold text-neutral-900">Auction Controls</h3>

      {/* Bid Amount Input */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Bid Amount
        </label>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => {
            setBidAmount(e.target.value);
            setError('');
          }}
          min={currentPlayer.base_price}
          step="100"
          placeholder={`Min: ${formatCurrency(currentPlayer.base_price)}`}
          className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {bidAmount && (
          <div className="mt-2 text-sm text-neutral-600">
            {formatCurrency(amount)}
          </div>
        )}
      </div>

      {/* Team Selector - Mini Cards */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Select Team
        </label>
        <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
          {eligibleTeams.length === 0 ? (
            <div className="col-span-2 text-sm text-neutral-500 text-center py-4">
              No teams with sufficient balance
            </div>
          ) : (
            eligibleTeams.map((team) => {
              const isSelected = selectedTeamId === team.id;
              const canAfford = amount > 0 ? amount <= team.current_balance : true;
              
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => {
                    setSelectedTeamId(team.id);
                    setError('');
                  }}
                  disabled={!canAfford}
                  className={`
                    relative p-1 rounded-lg border-2 transition-all text-left
                    min-h-[88px] flex flex-row items-center gap-3
                    ${isSelected
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
                    }
                    ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  `}
                >
                  <img
                    src={getAssetPath(team.logo_url)}
                    alt={team.name}
                    className="w-full max-w-16 max-h-16 h-full object-contain flex-shrink-0 rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                    }}
                  />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="text-xs font-semibold text-neutral-900">
                      {team.name}
                    </div>
                    <div className="text-md font-semibold text-neutral-600 font-mono">
                      {formatCurrency(team.current_balance)}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Team Balance Info */}
      {selectedTeam && (
        <div className="p-4 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-600 space-y-1">
            <div>Team: <span className="font-semibold text-neutral-900">{selectedTeam.name}</span></div>
            <div>
              Current Balance: <span className="font-semibold text-neutral-900">{formatCurrency(selectedTeam.current_balance)}</span>
            </div>
            {amount > 0 && (
              <div>
                After Purchase: <span className="font-semibold text-neutral-900">
                  {formatCurrency(selectedTeam.current_balance - amount)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleSell}
          disabled={!isValidBid || sellPlayer.isPending}
          className="w-full bg-success-500 text-white py-4 px-4 rounded-lg font-medium hover:bg-success-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
        >
          <CheckCircle className="w-5 h-5" />
          {sellPlayer.isPending ? 'Processing...' : 'Mark as SOLD'}
        </button>

        <button
          onClick={handleMarkUnsold}
          disabled={markUnsold.isPending}
          className="w-full bg-neutral-200 text-neutral-700 py-4 px-4 rounded-lg font-medium hover:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
        >
          <XCircle className="w-5 h-5" />
          {markUnsold.isPending ? 'Processing...' : 'Mark as UNSOLD'}
        </button>

        <button
          onClick={onNext}
          className="w-full bg-primary-500 text-white py-4 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 min-h-[52px]"
        >
          <ArrowRight className="w-5 h-5" />
          Next Player
        </button>
      </div>
    </div>
  );
}
