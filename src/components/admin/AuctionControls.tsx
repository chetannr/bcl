import { useState, useEffect } from 'react';
import { useTeams, useSellPlayer, useMarkPlayerUnsold, useAuctionResults } from '../../lib/queries';
import type { Player } from '../../lib/types';
import { validateBidAmount, validateTeamBalance } from '../../utils/validation';
import { formatCurrency } from '../../utils/currency';
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

  useEffect(() => {
    setBidAmount('');
    setSelectedTeamId('');
    setError('');
  }, [currentPlayer?.id]);

  if (!currentPlayer) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
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

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-bold text-neutral-900">Auction Controls</h3>

      {/* Bid Amount Input */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
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
          className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {bidAmount && (
          <div className="mt-1 text-sm text-neutral-600">
            {formatCurrency(amount)}
          </div>
        )}
      </div>

      {/* Team Selector */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Select Team
        </label>
        <select
          value={selectedTeamId}
          onChange={(e) => {
            setSelectedTeamId(e.target.value);
            setError('');
          }}
          className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Choose a team...</option>
          {teams
            ?.filter((team) => team.current_balance >= currentPlayer.base_price)
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} (Balance: {formatCurrency(team.current_balance)})
              </option>
            ))}
        </select>
      </div>

      {/* Team Balance Info */}
      {selectedTeam && (
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-600">
            <div>Team: <span className="font-semibold">{selectedTeam.name}</span></div>
            <div>
              Current Balance: <span className="font-semibold">{formatCurrency(selectedTeam.current_balance)}</span>
            </div>
            {amount > 0 && (
              <div>
                After Purchase: <span className="font-semibold">
                  {formatCurrency(selectedTeam.current_balance - amount)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleSell}
          disabled={!isValidBid || sellPlayer.isPending}
          className="w-full bg-success-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-success-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          {sellPlayer.isPending ? 'Processing...' : 'Mark as SOLD'}
        </button>

        <button
          onClick={handleMarkUnsold}
          disabled={markUnsold.isPending}
          className="w-full bg-neutral-200 text-neutral-700 py-3 px-4 rounded-lg font-medium hover:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <XCircle className="w-5 h-5" />
          {markUnsold.isPending ? 'Processing...' : 'Mark as UNSOLD'}
        </button>

        <button
          onClick={onNext}
          className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          Next Player
        </button>
      </div>
    </div>
  );
}
