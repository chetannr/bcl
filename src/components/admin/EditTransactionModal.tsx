import { useState, useEffect } from 'react';
import { useTeams } from '../../lib/queries';
import { formatCurrency } from '../../utils/currency';
import { validateBidAmount, validateTeamBalance } from '../../utils/validation';
import { X } from 'lucide-react';
import type { AuctionResult } from '../../lib/types';

interface EditTransactionModalProps {
  transaction: AuctionResult | null;
  onClose: () => void;
  onSave: (transactionId: string, teamId: string, amount: number) => void;
}

export function EditTransactionModal({
  transaction,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');

  const { data: teams } = useTeams();

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.final_amount.toString());
      setTeamId(transaction.team_id);
      setError('');
    }
  }, [transaction]);

  if (!transaction) {
    return null;
  }

  const handleSave = () => {
    setError('');

    if (!teamId) {
      setError('Please select a team');
      return;
    }

    const amountNum = parseFloat(amount);
    
    if (!validateBidAmount(amountNum, 2000)) {
      setError(`Amount must be at least ${formatCurrency(2000)}`);
      return;
    }

    const selectedTeam = teams?.find((t) => t.id === teamId);
    if (!selectedTeam) {
      setError('Team not found');
      return;
    }

    // If changing team, need to account for old team's refund
    const availableBalance = selectedTeam.id === transaction.team_id
      ? selectedTeam.current_balance + transaction.final_amount // Refund old amount
      : selectedTeam.current_balance;

    if (!validateTeamBalance(amountNum, availableBalance)) {
      setError(`Team balance insufficient. Available: ${formatCurrency(availableBalance)}`);
      return;
    }

    onSave(transaction.id, teamId, amountNum);
  };

  const selectedTeam = teams?.find((t) => t.id === teamId);
  const amountNum = parseFloat(amount) || 0;
  const availableBalance = selectedTeam?.id === transaction.team_id
    ? (selectedTeam?.current_balance || 0) + transaction.final_amount
    : selectedTeam?.current_balance || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Edit Transaction</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Player Info */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="text-sm text-neutral-600 mb-1">Player</div>
            <div className="text-lg font-semibold text-neutral-900">
              {transaction.player?.name || 'Unknown'}
            </div>
            <div className="text-sm text-neutral-600">
              {transaction.player?.category} • {transaction.player?.age}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Bid Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              min="2000"
              step="100"
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {amount && (
              <div className="mt-1 text-sm text-neutral-600">
                {formatCurrency(amountNum)}
              </div>
            )}
          </div>

          {/* Team Selector */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Team
            </label>
            <select
              value={teamId}
              onChange={(e) => {
                setTeamId(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose a team...</option>
              {teams?.map((team) => {
                const balance = team.id === transaction.team_id
                  ? team.current_balance + transaction.final_amount
                  : team.current_balance;
                return (
                  <option key={team.id} value={team.id}>
                    {team.name} (Balance: {formatCurrency(balance)})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Balance Info */}
          {selectedTeam && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="text-sm text-neutral-700 space-y-1">
                <div>
                  Current Balance: <span className="font-semibold">
                    {formatCurrency(selectedTeam.current_balance)}
                  </span>
                </div>
                {selectedTeam.id === transaction.team_id && (
                  <div>
                    + Refund from old transaction: <span className="font-semibold">
                      {formatCurrency(transaction.final_amount)}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-primary-200">
                  Available Balance: <span className="font-semibold text-primary-600">
                    {formatCurrency(availableBalance)}
                  </span>
                </div>
                {amountNum > 0 && (
                  <div>
                    After Purchase: <span className="font-semibold">
                      {formatCurrency(availableBalance - amountNum)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 text-danger-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedTeam || amountNum < 2000 || amountNum > availableBalance}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
