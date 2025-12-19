import { useState } from 'react';
import { useAuctionResults } from '../../lib/queries';
import { formatCurrency } from '../../utils/currency';
import { Edit, Trash2, Search } from 'lucide-react';
import type { AuctionResult } from '../../lib/types';

interface TransactionTableProps {
  onEdit: (result: AuctionResult) => void;
  onDelete: (result: AuctionResult) => void;
}

export function TransactionTable({ onEdit, onDelete }: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: results, isLoading } = useAuctionResults();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-neutral-500">
        Loading transactions...
      </div>
    );
  }

  const filteredResults = (results || []).filter((result) => {
    const playerName = result.player?.name || '';
    const teamName = result.team?.name || '';
    const query = searchQuery.toLowerCase();
    return (
      playerName.toLowerCase().includes(query) ||
      teamName.toLowerCase().includes(query) ||
      result.final_amount.toString().includes(query)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search */}
      <div className="p-4 border-b border-neutral-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by player name, team, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Sold At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    #{result.auction_order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">
                      {result.player?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {result.player?.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {result.team?.logo_url && (
                        <img
                          src={result.team.logo_url}
                          alt={result.team.name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/player-template.png';
                          }}
                        />
                      )}
                      <span className="text-sm text-neutral-900">
                        {result.team?.name || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">
                    {formatCurrency(result.final_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {new Date(result.sold_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(result)}
                        className="text-primary-600 hover:text-primary-900 p-2 rounded hover:bg-primary-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(result)}
                        className="text-danger-500 hover:text-danger-700 p-2 rounded hover:bg-danger-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-neutral-600">
            Total Transactions: <span className="font-semibold">{filteredResults.length}</span>
          </div>
          <div className="text-sm text-neutral-600">
            Total Amount: <span className="font-semibold text-success-600">
              {formatCurrency(
                filteredResults.reduce((sum, r) => sum + r.final_amount, 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
