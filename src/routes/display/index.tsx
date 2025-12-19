import { createFileRoute } from '@tanstack/react-router';
import { useRealtimeAuction } from '../../hooks/useRealtimeAuction';
import { CurrentPlayerDisplay } from '../../components/display/CurrentPlayerDisplay';
import { TeamStatsPanel } from '../../components/display/TeamStatsPanel';
import { AuctionStatus } from '../../components/display/AuctionStatus';
import { CelebrationEffects } from '../../components/display/CelebrationEffects';
import { useAuctionState, usePlayer } from '../../lib/queries';

export const Route = createFileRoute('/display/')({
  component: DisplayView,
});

function DisplayView() {
  console.log('[Route: /display] Display view component rendered');
  // Enable real-time updates
  console.log('[Route: /display] Enabling real-time updates...');
  useRealtimeAuction();
  
  const { data: auctionState } = useAuctionState();
  const { data: currentPlayer } = usePlayer(auctionState?.current_player_id || null);
  const hasPlayer = !!currentPlayer;

  return (
    <div
      className="h-screen bg-cover bg-center bg-fixed overflow-y-auto"
      style={{
        backgroundImage: "url('/assets/stadium-bg.jpg')",
      }}
    >
      {/* Celebration Effects */}
      <CelebrationEffects />
      
      {/* Overlay for better text readability */}
      <div className="min-h-full bg-gradient-to-b from-black/60 via-black/40 to-black/60">
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-4 md:p-6">
            
            <AuctionStatus />
          </div>

          {/* Main Player Display */}
          <div className="grid grid-cols-12 items-center justify-center px-4 py-8 min-h-[60vh]">
            {hasPlayer ? (
              <>
                <div className='col-span-4 flex justify-center items-center'>
                  <img
                    src="/assets/teams/bcl-bidding.jpg"
                    alt="BCL Bellandur Cricket Logo"
                    className="w-full object-contain drop-shadow-xl  max-w-96"
                  />
                </div>
                <div className='col-span-8'>
                  <CurrentPlayerDisplay />
                </div>
              </>
            ) : (
              <div className='col-span-12'>
                <CurrentPlayerDisplay />
              </div>
            )}
          </div>

          {/* Team Stats Panel */}
          <div className="p-4 md:p-6">
            <TeamStatsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
