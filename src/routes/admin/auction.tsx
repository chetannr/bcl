import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useRealtimeAuction } from '../../hooks/useRealtimeAuction';
import { TeamBudgetPanel } from '../../components/admin/TeamBudgetPanel';
import { PlayerQueue } from '../../components/admin/PlayerQueue';
import { AuctionControls } from '../../components/admin/AuctionControls';
import { PlayerCard } from '../../components/admin/PlayerCard';
import { usePlayers, useSetNextPlayer, useAuctionState, usePlayer } from '../../lib/queries';
import { Home } from 'lucide-react';
import type { Player } from '../../lib/types';

export const Route = createFileRoute('/admin/auction')({
  component: AdminAuction,
});

function AdminAuction() {
  console.log('[Route: /admin/auction] Admin auction component rendered');
  const navigate = useNavigate();
  const { data: auctionState } = useAuctionState();
  console.log('[Route: /admin/auction] Auction state:', auctionState);
  const { data: currentPlayer } = usePlayer(auctionState?.current_player_id || null);
  console.log('[Route: /admin/auction] Current player:', currentPlayer);
  const { data: unsoldPlayers } = usePlayers('unsold');
  console.log('[Route: /admin/auction] Unsold players count:', unsoldPlayers?.length || 0);
  const setNextPlayer = useSetNextPlayer();
  
  // Enable real-time updates
  console.log('[Route: /admin/auction] Enabling real-time updates...');
  useRealtimeAuction();

  const handleNextPlayer = () => {
    console.log('[Route: /admin/auction] handleNextPlayer called');
    // Find next unsold player
    const currentIndex = currentPlayer
      ? unsoldPlayers?.findIndex((p) => p.id === currentPlayer.id) ?? -1
      : -1;
    console.log('[Route: /admin/auction] Current player index:', currentIndex);
    
    const nextPlayer = unsoldPlayers?.find(
      (p, index) => p.status === 'unsold' && index > currentIndex
    );
    console.log('[Route: /admin/auction] Next player found:', nextPlayer);
    
    if (nextPlayer) {
      console.log('[Route: /admin/auction] Setting next player to:', nextPlayer.id);
      setNextPlayer.mutate(nextPlayer.id, {
        onError: (error: any) => {
          console.error('[Route: /admin/auction] Error setting next player:', error);
          alert(`Failed to set next player: ${error.message || 'Unknown error'}`);
        },
        onSuccess: () => {
          console.log('[Route: /admin/auction] Successfully set next player');
        },
      });
    } else {
      console.log('[Route: /admin/auction] No next player, setting to null');
      setNextPlayer.mutate(null, {
        onError: (error: any) => {
          console.error('[Route: /admin/auction] Error clearing current player:', error);
          alert(`Failed to clear current player: ${error.message || 'Unknown error'}`);
        },
        onSuccess: () => {
          console.log('[Route: /admin/auction] Successfully cleared current player');
        },
      });
    }
  };

  const handleSelectPlayer = (player: Player) => {
    console.log('[Route: /admin/auction] handleSelectPlayer called with player:', player.id, player.name);
    setNextPlayer.mutate(player.id, {
      onError: (error: any) => {
        console.error('[Route: /admin/auction] Error setting next player:', error);
        alert(`Failed to set next player: ${error.message || 'Unknown error'}`);
      },
      onSuccess: () => {
        console.log('[Route: /admin/auction] Successfully set next player');
      },
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">BCL 2025 Auction Control</h1>
          <button
            onClick={() => {
              console.log('[Route: /admin/auction] Navigating to /');
              navigate({ to: '/' });
            }}
            className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Team Budget Panel */}
        <div className="mb-4">
          <TeamBudgetPanel />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-300px)]">
          {/* Player Queue - Left Sidebar */}
          <div className="lg:col-span-3">
            <PlayerQueue
              onSelectPlayer={handleSelectPlayer}
              currentPlayerId={currentPlayer?.id}
            />
          </div>

          {/* Current Player Display - Center */}
          <div className="lg:col-span-6">
            <PlayerCard />
          </div>

          {/* Auction Controls - Right Sidebar */}
          <div className="lg:col-span-3">
            <AuctionControls
              currentPlayer={currentPlayer ?? null}
              onNext={handleNextPlayer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
