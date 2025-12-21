import type { Team } from '../../lib/types';
import { formatCurrency } from '../../utils/currency';
import { getAssetPath } from '../../utils/assets';

interface TeamBadgeProps {
  team: Team;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function TeamBadge({ team, size = 'md', showDetails = false }: TeamBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className="flex items-center gap-3">
      <img
        src={team.logo_url}
        alt={team.name}
        className={`${sizeClasses[size]} object-contain rounded-lg border border-neutral-200 bg-white p-1`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
        }}
      />
      {showDetails && (
        <div>
          <div className="font-semibold text-neutral-900">{team.name}</div>
          <div className="text-sm text-neutral-600">
            Balance: {formatCurrency(team.current_balance)}
          </div>
          <div className="text-sm text-neutral-600">
            Players: {team.players_count}
          </div>
        </div>
      )}
    </div>
  );
}
