import { memo, useEffect, useState } from 'react';
import { usePlayer, useAuctionState, useAuctionResults, useTeams } from '../../lib/queries';
import { formatCurrency } from '../../utils/currency';
import { getAssetPath } from '../../utils/assets';
import { Loader2, Mic, CheckCircle } from 'lucide-react';

interface ConfettiParticle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

interface Sparkle {
  id: number;
  left: number;
  top: number;
  delay: number;
  size: number;
}

const COLORS = [
  '#22c55e', // success-500
  '#fbbf24', // amber-400
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#39ff14', // neon green
  '#ff00ff', // magenta
  '#00ffff', // cyan
];

function generateConfetti(): ConfettiParticle[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

function generateSparkles(): Sparkle[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    size: 2 + Math.random() * 4,
  }));
}

function WelcomeScreen() {
  const [confetti, setConfetti] = useState<ConfettiParticle[]>(() => generateConfetti());
  const [sparkles, setSparkles] = useState<Sparkle[]>(() => generateSparkles());
  const { data: teams } = useTeams();

  // Split teams into left and right groups
  const teamsArray = teams || [];
  const midPoint = Math.ceil(teamsArray.length / 2);
  const leftTeams = teamsArray.slice(0, midPoint);
  const rightTeams = teamsArray.slice(midPoint);

  // Continuously regenerate confetti and sparkles
  useEffect(() => {
    const confettiInterval = setInterval(() => {
      setConfetti((prev) => {
        const existing = prev.filter(() => Math.random() > 0.3);
        const newParticles = generateConfetti().map((p, i) => ({
          ...p,
          id: Date.now() + i,
        }));
        return [...existing, ...newParticles].slice(0, 100);
      });
    }, 2000);

    const sparkleInterval = setInterval(() => {
      setSparkles((prev) => {
        const existing = prev.filter(() => Math.random() > 0.4);
        const newSparkles = generateSparkles().map((s, i) => ({
          ...s,
          id: Date.now() + i + 10000,
        }));
        return [...existing, ...newSparkles].slice(0, 40);
      });
    }, 3000);

    return () => {
      clearInterval(confettiInterval);
      clearInterval(sparkleInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center gap-8 px-8">
      {/* Confetti Particles */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${particle.left}%`,
              top: '-10px',
              backgroundColor: particle.color,
              animation: `confettiFall ${particle.duration}s ease-in ${particle.delay}s forwards`,
              boxShadow: `0 0 8px ${particle.color}, 0 0 12px ${particle.color}`,
            }}
          />
        ))}
      </div>

      {/* Sparkle Effects */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              animation: `sparkle 2s ease-in-out ${sparkle.delay}s infinite`,
            }}
          >
            <div
              className="w-full h-full bg-white rounded-full"
              style={{
                boxShadow: `0 0 ${sparkle.size * 3}px ${sparkle.size}px rgba(255, 255, 255, 0.9), 0 0 ${sparkle.size * 5}px ${sparkle.size * 2}px rgba(57, 255, 20, 0.6)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Left Teams */}
      <div className="relative z-20 grid grid-cols-2 grid-rows-3 gap-4 max-w-[320px]">
        {leftTeams.slice(0, 6).map((team) => (
          <div
            key={team.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all"
            style={{
              boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
            }}
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={getAssetPath(team.logo_url)}
                alt={team.name}
                className="w-32 h-32 object-contain bg-black rounded-lg p-2 mb-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                }}
              />
              <div className="text-white text-sm font-semibold">
                {team.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Image with Neon Glow */}
      <div className="relative z-20 flex items-center justify-center">
        {/* Outer Glow Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute rounded-full animate-pulse-slow"
            style={{
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(57, 255, 20, 0.3) 0%, transparent 70%)',
              animation: 'glow-pulse 3s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full animate-pulse-slow"
            style={{
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(127, 255, 0, 0.4) 0%, transparent 70%)',
              animation: 'glow-pulse 2.5s ease-in-out infinite',
              animationDelay: '0.5s',
            }}
          />
          <div
            className="absolute rounded-full animate-pulse-slow"
            style={{
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(57, 255, 20, 0.5) 0%, transparent 70%)',
              animation: 'glow-pulse 2s ease-in-out infinite',
              animationDelay: '1s',
            }}
          />
        </div>

        {/* Image Container with Neon Border */}
        <div
          className="relative rounded-2xl p-4"
          style={{
            boxShadow: `
              0 0 40px rgba(57, 255, 20, 0.8),
              0 0 80px rgba(57, 255, 20, 0.6),
              0 0 120px rgba(127, 255, 0, 0.4),
              0 0 160px rgba(57, 255, 20, 0.3),
              inset 0 0 60px rgba(57, 255, 20, 0.2)
            `,
            animation: 'neon-glow 2s ease-in-out infinite alternate',
          }}
        >
          <img
            src={getAssetPath('/assets/welcome.jpeg')}
            alt="Welcome to BCL 2025 Auction"
            className="w-full max-w-[384px] h-auto object-contain rounded-xl"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(57, 255, 20, 0.8))',
            }}
          />
        </div>
      </div>

      {/* Right Teams */}
      <div className="relative z-20 grid grid-cols-2 grid-rows-3 gap-4 max-w-[320px]">
        {rightTeams.slice(0, 6).map((team) => (
          <div
            key={team.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all"
            style={{
              boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
            }}
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={getAssetPath(team.logo_url)}
                alt={team.name}
                className="w-32 h-32 object-contain bg-black rounded-lg p-2 mb-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
                }}
              />
              <div className="text-white text-sm font-semibold">
                {team.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes neon-glow {
          0% {
            box-shadow: 
              0 0 40px rgba(57, 255, 20, 0.8),
              0 0 80px rgba(57, 255, 20, 0.6),
              0 0 120px rgba(127, 255, 0, 0.4),
              0 0 160px rgba(57, 255, 20, 0.3),
              inset 0 0 60px rgba(57, 255, 20, 0.2);
          }
          100% {
            box-shadow: 
              0 0 60px rgba(57, 255, 20, 1),
              0 0 100px rgba(57, 255, 20, 0.8),
              0 0 140px rgba(127, 255, 0, 0.6),
              0 0 180px rgba(57, 255, 20, 0.4),
              inset 0 0 80px rgba(57, 255, 20, 0.3);
          }
        }

        .animate-pulse-slow {
          animation: glow-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

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
            src={getAssetPath('/assets/teams/bcl-bidding.jpg')}
            alt="BCL Bellandur Cricket Logo"
            className="w-full object-contain drop-shadow-xl max-w-96"
          />
        </div>
      </div>
    );
  }

  if (!player) {
    return <WelcomeScreen />;
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
                    src={getAssetPath(playerResult.team.logo_url)}
                    alt={playerResult.team.name}
                    className="w-36 h-36 md:w-36 md:h-36 object-contain rounded-xl border-2 border-neutral-900/30 bg-black p-0.5 shadow-lg animate-pulse-glow"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
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
          <div className="relative">
            <img
              src={getAssetPath(player.photo_url)}
              alt={player.name}
              className={`w-full max-h-[388px] max-w-[384px] box-border object-contain border-8 shadow-2xl ${isSold ? 'border-[#39ff14] radium-border-glow' : 'border-white'}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetPath('/assets/player-template.png');
              }}
            />
            {player.player_type === 'ICON' && (
              <div className="absolute top-4 right-4 z-10">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-pulse">
                    <div className="text-white font-bold text-2xl">⭐</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/50 to-yellow-600/50 rounded-full blur-md animate-pulse"></div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-yellow-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                  ICON
                </div>
              </div>
            )}
          </div>
      </div>
      
    </div>
  );
});
