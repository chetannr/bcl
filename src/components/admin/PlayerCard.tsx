import { memo } from 'react';
import { usePlayer, useAuctionState } from '../../lib/queries';
import { PlayerInfo } from '../shared/PlayerInfo';
import { Loader2, X } from 'lucide-react';

interface PlayerCardProps {
  onRemove?: () => void;
}

export const PlayerCard = memo(function PlayerCard({ onRemove }: PlayerCardProps) {
  const { data: auctionState } = useAuctionState();
  const { data: player, isLoading } = usePlayer(auctionState?.current_player_id || null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center text-neutral-500">
          <p className="text-lg mb-2">No player selected</p>
          <p className="text-sm">Select a player from the queue to start bidding</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 relative">
      {/* Remove Icon */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 z-10 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors shadow-sm"
          title="Clear player selection"
        >
          <X className="w-5 h-5 text-neutral-600" />
        </button>
      )}
      <PlayerInfo player={player} showStatus />
      {player.status === 'sold' && (
        <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-lg">
          <p className="text-success-700 font-semibold">This player has been sold</p>
        </div>
      )}
    </div>
  );
});
