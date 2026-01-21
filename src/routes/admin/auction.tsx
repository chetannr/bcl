import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { TeamBudgetPanel } from '../../components/admin/TeamBudgetPanel';
import { PlayerQueue } from '../../components/admin/PlayerQueue';
import { AuctionControls } from '../../components/admin/AuctionControls';
import { PlayerCard } from '../../components/admin/PlayerCard';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Home, Radio, Power } from 'lucide-react';
import type { Player } from '../../lib/types';

export const Route = createFileRoute('/admin/auction')({
  component: () => (
    <ProtectedRoute>
      <AdminAuction />
    </ProtectedRoute>
  ),
});

function AdminAuction() {
  console.log('[Route: /admin/auction] Admin auction component rendered');
  const navigate = useNavigate();
  const auctionState = useQuery(api.queries.getAuctionState);
  console.log('[Route: /admin/auction] Auction state:', auctionState);
  const currentPlayer = useQuery(api.queries.getPlayer, {
    playerId: auctionState?.current_player_id ?? null,
  });
  console.log('[Route: /admin/auction] Current player:', currentPlayer);
  const unsoldPlayers = useQuery(api.queries.getPlayers, { status: "unsold" });
  console.log('[Route: /admin/auction] Unsold players count:', unsoldPlayers?.length || 0);
  const setNextPlayer = useMutation(api.mutations.setNextPlayer);
  const updateAuctionState = useMutation(api.mutations.updateAuctionState);

  const handleNextPlayer = async () => {
    console.log('[Route: /admin/auction] handleNextPlayer called');
    try {
      // Find next unsold player
      const currentIndex = currentPlayer
        ? unsoldPlayers?.findIndex((p) => p._id === currentPlayer._id) ?? -1
        : -1;
      console.log('[Route: /admin/auction] Current player index:', currentIndex);
      
      const nextPlayer = unsoldPlayers?.find(
        (p, index) => p.status === 'unsold' && index > currentIndex
      );
      console.log('[Route: /admin/auction] Next player found:', nextPlayer);
      
      if (nextPlayer) {
        console.log('[Route: /admin/auction] Setting next player to:', nextPlayer._id);
        await setNextPlayer({ playerId: nextPlayer._id });
        console.log('[Route: /admin/auction] Successfully set next player');
      } else {
        console.log('[Route: /admin/auction] No next player, setting to null');
        await setNextPlayer({ playerId: null });
        console.log('[Route: /admin/auction] Successfully cleared current player');
      }
    } catch (error) {
      console.error('[Route: /admin/auction] Error:', error);
      alert(`Failed to set next player: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSelectPlayer = async (player: Player) => {
    console.log('[Route: /admin/auction] handleSelectPlayer called with player:', player._id, player.name);
    try {
      await setNextPlayer({ playerId: player._id });
      console.log('[Route: /admin/auction] Successfully set next player');
    } catch (error) {
      console.error('[Route: /admin/auction] Error setting next player:', error);
      alert(`Failed to set next player: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleToggleAuctionState = async () => {
    const newState = !auctionState?.is_auction_active;
    console.log('[Route: /admin/auction] Toggling auction state to:', newState);
    try {
      await updateAuctionState({ is_auction_active: newState });
      console.log('[Route: /admin/auction] Successfully updated auction state');
    } catch (error) {
      console.error('[Route: /admin/auction] Error updating auction state:', error);
      alert(`Failed to ${newState ? 'start' : 'stop'} auction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClearPlayer = async () => {
    console.log('[Route: /admin/auction] Clearing current player');
    try {
      await setNextPlayer({ playerId: null });
      console.log('[Route: /admin/auction] Successfully cleared current player');
    } catch (error) {
      console.error('[Route: /admin/auction] Error clearing current player:', error);
      alert(`Failed to clear player: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">BCL 2025 Auction Control</h1>
          <div className="flex items-center gap-3">
            {/* Auction State Toggle */}
            <button
              onClick={handleToggleAuctionState}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${auctionState?.is_auction_active
                  ? 'bg-success-500 text-white hover:bg-success-600'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {auctionState?.is_auction_active ? (
                <>
                  <Radio className="w-5 h-5" />
                  <span>LIVE</span>
                </>
              ) : (
                <>
                  <Power className="w-5 h-5" />
                  <span>Start Auction</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                console.log('[Route: /admin/auction] Navigating to /home');
                navigate({ to: '/home' });
              }}
              className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>
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
              currentPlayerId={currentPlayer?._id}
            />
          </div>

          <div className="lg:col-span-9 flex flex-col gap-4">
            {/* Current Player Display - Center */}
            <PlayerCard onRemove={handleClearPlayer} />
            {/* Auction Controls - Right Sidebar */}
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
