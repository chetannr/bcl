import type { Player } from '../../lib/types';
import { formatCurrency } from '../../utils/currency';
import { getAssetPath } from '../../utils/assets';

interface PlayerInfoProps {
  player: Player;
  showStatus?: boolean;
}

export function PlayerInfo({ player, showStatus = false }: PlayerInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <img
          src={getAssetPath(player.photo_url)}
          alt={player.name}
          className="w-32 h-32 object-cover rounded-lg border-2 border-neutral-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
          }}
        />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-neutral-900">{player.name}</h3>
          <div className="flex gap-4 mt-2 text-neutral-600">
            <span>Age: {player.age}</span>
            <span>Category: {player.category}</span>
            <span>Base: {formatCurrency(player.base_price)}</span>
          </div>
          <div className="mt-1 text-sm text-neutral-500">Phone: {player.phone}</div>
          {showStatus && (
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  player.status === 'sold'
                    ? 'bg-success-500 text-white'
                    : player.status === 'bidding'
                    ? 'bg-warning-500 text-white'
                    : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                {player.status === 'sold' ? 'SOLD' : player.status === 'bidding' ? 'BIDDING' : 'UNSOLD'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
