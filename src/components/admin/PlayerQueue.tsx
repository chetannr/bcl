import { useState, useMemo, memo } from 'react';
import { usePlayers, useSetNextPlayer } from '../../lib/queries';
import type { Player } from '../../lib/types';
import { Search } from 'lucide-react';

interface PlayerQueueProps {
  onSelectPlayer: (player: Player) => void;
  currentPlayerId?: string | null;
}

export const PlayerQueue = memo(function PlayerQueue({ onSelectPlayer, currentPlayerId }: PlayerQueueProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [serialNumberSearch, setSerialNumberSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { data: players, isLoading } = usePlayers('unsold');
  const setNextPlayer = useSetNextPlayer();

  const categories = useMemo(() => ['all', 'Batsman', 'Bowler', 'All Rounder'], []);
  
  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    return players.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.phone.includes(searchQuery);
      
      // If serial number search ends with space, do exact match; otherwise use includes
      let matchesSerialNumber = true;
      if (serialNumberSearch !== '') {
        if (player.auction_serial_number === null) {
          matchesSerialNumber = false;
        } else {
          const searchValue = serialNumberSearch.trim();
          const playerSerial = player.auction_serial_number.toString();
          // If search ends with space, do exact match
          if (serialNumberSearch.endsWith(' ')) {
            matchesSerialNumber = playerSerial === searchValue;
          } else {
            matchesSerialNumber = playerSerial.includes(serialNumberSearch);
          }
        }
      }
      
      const matchesCategory = categoryFilter === 'all' || player.category === categoryFilter;
      return matchesSearch && matchesSerialNumber && matchesCategory;
    });
  }, [players, searchQuery, serialNumberSearch, categoryFilter]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <div className="text-neutral-500">Loading players...</div>
      </div>
    );
  }

  const handleSelectPlayer = (player: Player) => {
    setNextPlayer.mutate(player.id);
    onSelectPlayer(player);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-neutral-900">Player Queue</h2>
      
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Serial Number Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by serial number..."
          value={serialNumberSearch}
          onChange={(e) => setSerialNumberSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-3 flex-wrap">
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

      {/* Player List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredPlayers.length === 0 ? (
          <div className="text-center text-neutral-500 py-8">
            No unsold players found
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => handleSelectPlayer(player)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                currentPlayerId === player.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={player.photo_url}
                  alt={player.name}
                  className="w-12 h-12 object-cover rounded-lg border border-neutral-200 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/player-template.png';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-900">
                    {player.auction_serial_number !== null && (
                      <span className="ml-2 text-primary-600 font-normal">
                        #{player.auction_serial_number}
                      </span>
                    )}{' '}{player.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {player.category} • {player.age}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="mt-3 text-sm text-neutral-500 text-center">
        {filteredPlayers.length} unsold player{filteredPlayers.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
});
