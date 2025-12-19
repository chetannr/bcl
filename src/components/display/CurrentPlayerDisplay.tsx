import { memo } from 'react';
import { usePlayer, useAuctionState, useAuctionResults } from '../../lib/queries';
import { formatCurrency } from '../../utils/currency';
import { Loader2, Mic, CheckCircle, ArrowRight } from 'lucide-react';

export const CurrentPlayerDisplay = memo(function CurrentPlayerDisplay() {
  const { data: auctionState } = useAuctionState();
  const { data: player, isLoading } = usePlayer(auctionState?.current_player_id || null);
  const { data: results } = useAuctionResults();

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 items-center justify-center h-full">
        <Loader2 className="w-16 h-16 col-span-6 animate-spin text-white" />
        <div className='col-span-6 flex justify-center items-center'>
        <img
            src="/assets/teams/bcl-bidding.jpg"
            alt="BCL Bellandur Cricket Logo"
            className="w-full object-contain drop-shadow-xl max-w-96"
          />
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className='grid grid-cols-12 items-center justify-center h-full'>
        <div className='col-span-6'>
          <div className="flex flex-col items-center justify-center h-full text-white">
            <ArrowRight className="w-24 h-24 mb-4 opacity-50" />
            <h2 className="text-4xl font-bold mb-2">Waiting for Next Player</h2>
            <p className="text-2xl opacity-75">Auction will begin shortly...</p>
          </div>
        </div>
        <div className='col-span-6'>
          
        </div>
      </div>
    );
  }

  const playerResult = results?.find((r) => r.player_id === player.id);
  const isSold = player.status === 'sold' && playerResult;

  return (
    <div className='grid grid-cols-12 items-center justify-center h-full'>
        <div className='col-span-6'>
          <div className="flex flex-col items-center justify-center h-full text-white px-8">
            {/* Player Name */}
            <h1 className={`text-5xl md:text-6xl font-bold mb-4 text-center drop-shadow-lg ${isSold ? 'animate-celebration-text' : ''}`}>
              {player.auction_serial_number}{' : '}{player.name}
            </h1>
      {/* Player Details */}
      <div className="flex flex-col justify-center items-center gap-6 text-2xl md:text-3xl mb-8">
        <span className="bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
          {player.age}
        </span>
        <span className="bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
          {player.category}
        </span>
        <span className="bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
          Base: {formatCurrency(player.base_price)}
        </span>
        {/* Status Display */}
        {isSold && playerResult ? (
          <div className="backdrop-blur-sm p-2 rounded-2xl shadow-2xl relative overflow-hidden radium-glow">
            {/* Radium glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/90 via-[#7fff00]/95 to-[#32cd32]/90 rounded-2xl" />
            {/* Celebration glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            <div className="flex items-center gap-6 relative z-10 pr-6">
              <CheckCircle className="w-10 h-10 absolute top-0 right-0 flex-shrink-0 animate-bounce text-neutral-900" />
              {playerResult.team?.logo_url && (
                <div className="flex-shrink-0 animate-scale-in">
                  <img
                    src={playerResult.team.logo_url}
                    alt={playerResult.team.name}
                    className="w-36 h-36 md:w-36 md:h-36 object-contain rounded-xl border-2 border-neutral-900/30 bg-black p-0.5 shadow-lg animate-pulse-glow"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/player-template.png';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1 animate-bounce-subtle drop-shadow-lg" style={{ color: '#1b398b' }}>
                  SOLD
                </div>
                <div className="text-xl md:text-2xl text-neutral-900 font-semibold drop-shadow-md">
                  <span className='text-2xl'>{playerResult.team?.name}</span> <br /> 
                  <span className='text-6xl'>{formatCurrency(playerResult.final_amount)}</span>
                </div>
              </div>
            </div>
            <style>{`
              .radium-glow {
                box-shadow: 
                  0 0 30px rgba(57, 255, 20, 0.8),
                  0 0 60px rgba(57, 255, 20, 0.6),
                  0 0 90px rgba(127, 255, 0, 0.4),
                  0 0 120px rgba(57, 255, 20, 0.3),
                  inset 0 0 40px rgba(57, 255, 20, 0.3);
              }
              .radium-border-glow {
                box-shadow: 
                  0 0 20px rgba(57, 255, 20, 0.9),
                  0 0 40px rgba(57, 255, 20, 0.7),
                  0 0 60px rgba(127, 255, 0, 0.5),
                  inset 0 0 20px rgba(57, 255, 20, 0.4);
              }
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .animate-shimmer {
                animation: shimmer 2s ease-in-out infinite;
              }
              @keyframes scale-in {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); opacity: 1; }
              }
              .animate-scale-in {
                animation: scale-in 0.6s ease-out;
              }
              @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
                50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4); }
              }
              .animate-pulse-glow {
                animation: pulse-glow 2s ease-in-out infinite;
              }
              @keyframes bounce-subtle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
              }
              .animate-bounce-subtle {
                animation: bounce-subtle 1s ease-in-out infinite;
              }
              @keyframes celebration-text {
                0%, 100% { 
                  transform: scale(1);
                  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                }
                25% { 
                  transform: scale(1.05);
                  text-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6);
                }
                50% { 
                  transform: scale(1.02);
                  text-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
                }
                75% { 
                  transform: scale(1.05);
                  text-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6);
                }
              }
              .animate-celebration-text {
                animation: celebration-text 2s ease-in-out infinite;
              }
              @keyframes celebration-photo {
                0%, 100% { 
                  transform: scale(1);
                  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
                }
                50% { 
                  transform: scale(1.02);
                  box-shadow: 0 0 50px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.4);
                }
              }
              .animate-celebration-photo {
                animation: celebration-photo 2s ease-in-out infinite;
              }
            `}</style>
          </div>
        ) : auctionState?.is_bidding_open ? (
          <div className="bg-warning-500/90 backdrop-blur-sm px-12 py-6 rounded-2xl shadow-2xl animate-pulse">
            <div className="flex items-center gap-4">
              <Mic className="w-12 h-12 animate-bounce" />
              <div className="text-3xl md:text-4xl font-bold">
                BIDDING OPEN
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary-500/90 backdrop-blur-sm px-12 py-6 rounded-2xl shadow-2xl">
            <div className="text-2xl md:text-3xl font-bold">
              Ready to Bid
            </div>
          </div>
        )}
        </div>
        </div>
        
      </div>
    
      <div className='col-span-6 flex justify-center items-center'>
          {/* Player Photo */}
            <img
              src={player.photo_url}
              alt={player.name}
              className={`w-full max-h-[388px] max-w-[384px] box-border object-contain border-8 shadow-2xl ${isSold ? 'border-[#39ff14] radium-border-glow' : 'border-white'}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/player-template.png';
              }}
            />
        </div>
      
    </div>
  );
});
