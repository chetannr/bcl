import { useState, useMemo } from 'react';
import { usePlayers } from '../../lib/queries';
import { Edit, Plus, Search, X } from 'lucide-react';
import type { Player } from '../../lib/types';

interface PlayerManagementProps {
  onEditPlayer: (player: Player) => void;
  onAddPlayer: () => void;
}

export function PlayerManagement({ onEditPlayer, onAddPlayer }: PlayerManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsold' | 'sold' | 'bidding'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [playerTypeFilter, setPlayerTypeFilter] = useState<string>('all');
  const [isValidPlayerFilter, setIsValidPlayerFilter] = useState<string>('all');
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  const { data: allPlayers, isLoading } = usePlayers();

  const filteredPlayers = useMemo(() => {
    if (!allPlayers) return [];
    
    let players = allPlayers;
    
    // Filter by status
    if (statusFilter !== 'all') {
      players = players.filter((player) => player.status === statusFilter);
    }

    // Filter by search, category, player type, and is valid player
    return players.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.phone.includes(searchQuery);
      const matchesCategory = categoryFilter === 'all' || player.category === categoryFilter;
      const matchesPlayerType = playerTypeFilter === 'all' || player.player_type === playerTypeFilter;
      const matchesIsValidPlayer = isValidPlayerFilter === 'all' || player.is_valid_player === isValidPlayerFilter;
      return matchesSearch && matchesCategory && matchesPlayerType && matchesIsValidPlayer;
    });
  }, [allPlayers, searchQuery, statusFilter, categoryFilter, playerTypeFilter, isValidPlayerFilter]);

  const categories = useMemo(() => ['all', 'Batsman', 'Bowler', 'All Rounder'], []);
  const playerTypes = useMemo(() => ['all', 'Regular', 'ICON'], []);
  const isValidPlayerOptions = useMemo(() => ['all', 'Y', 'N'], []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-neutral-500">
        Loading players...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Player Management</h2>
        <button
          onClick={onAddPlayer}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Player
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-neutral-200 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-neutral-700 self-center">Status:</span>
          {(['all', 'unsold', 'sold', 'bidding'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-neutral-700 self-center">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Player Type Filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-neutral-700 self-center">Player Type:</span>
          {playerTypes.map((type) => (
            <button
              key={type}
              onClick={() => setPlayerTypeFilter(type)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                playerTypeFilter === type
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>

        {/* Is Valid Player Filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-neutral-700 self-center">Is Valid Player:</span>
          {isValidPlayerOptions.map((option) => (
            <button
              key={option}
              onClick={() => setIsValidPlayerFilter(option)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                isValidPlayerFilter === option
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {option === 'all' ? 'All' : option === 'Y' ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </div>

      {/* Player List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Player Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Auction Serial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Is Valid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Jersey Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Jersey Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-8 text-center text-neutral-500">
                  No players found
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setViewingPlayer(player)}
                      className="group relative"
                      title="Click to view large photo"
                    >
                      <img
                        src={player.photo_url}
                        alt={player.name}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-neutral-200 group-hover:border-primary-400 transition-all cursor-pointer shadow-sm group-hover:shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/player-template.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">{player.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{player.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{player.age || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{player.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{player.player_type || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{player.auction_serial_number ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        player.is_valid_player === 'Y'
                          ? 'bg-success-500 text-white'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {player.is_valid_player === 'Y' ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{player.jersey_number ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-600">{player.jersey_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        player.status === 'sold'
                          ? 'bg-success-500 text-white'
                          : player.status === 'bidding'
                          ? 'bg-warning-500 text-white'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {player.status === 'sold' ? 'SOLD' : player.status === 'bidding' ? 'BIDDING' : 'UNSOLD'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEditPlayer(player)}
                      className="text-primary-600 hover:text-primary-900 p-2 rounded hover:bg-primary-50"
                      title="Edit Player"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="text-sm text-neutral-600">
          Showing <span className="font-semibold">{filteredPlayers.length}</span> player{filteredPlayers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Large Photo View Modal */}
      {viewingPlayer && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" onClick={() => setViewingPlayer(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{viewingPlayer.name}</h2>
                <div className="text-sm text-neutral-600 mt-1">
                  {viewingPlayer.category} • {viewingPlayer.age || 'Age not specified'}
                </div>
              </div>
              <button
                onClick={() => setViewingPlayer(null)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Photo */}
            <div className="p-6 flex items-center justify-center bg-neutral-50">
              <img
                src={viewingPlayer.photo_url}
                alt={viewingPlayer.name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/player-template.png';
                }}
              />
            </div>

            {/* Player Info */}
            <div className="p-6 border-t border-neutral-200 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-neutral-500 mb-1">Phone</div>
                  <div className="font-medium text-neutral-900">{viewingPlayer.phone}</div>
                </div>
                <div>
                  <div className="text-neutral-500 mb-1">Base Price</div>
                  <div className="font-medium text-neutral-900">₹{viewingPlayer.base_price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-neutral-500 mb-1">Status</div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      viewingPlayer.status === 'sold'
                        ? 'bg-success-500 text-white'
                        : viewingPlayer.status === 'bidding'
                        ? 'bg-warning-500 text-white'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {viewingPlayer.status === 'sold' ? 'SOLD' : viewingPlayer.status === 'bidding' ? 'BIDDING' : 'UNSOLD'}
                  </span>
                </div>
                <div>
                  <div className="text-neutral-500 mb-1">Player Type</div>
                  <div className="font-medium text-neutral-900">{viewingPlayer.player_type}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={() => {
                  setViewingPlayer(null);
                  onEditPlayer(viewingPlayer);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Player
              </button>
              <button
                onClick={() => setViewingPlayer(null)}
                className="px-4 py-2 text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
