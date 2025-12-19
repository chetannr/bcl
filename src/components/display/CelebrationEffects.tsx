import { useEffect, useState } from 'react';
import { usePlayer, useAuctionState, useAuctionResults } from '../../lib/queries';

interface ConfettiParticle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
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
];

function generateConfetti(): ConfettiParticle[] {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

function generateSparkles(): Array<{ id: number; left: number; top: number; delay: number }> {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 1.5,
  }));
}

export function CelebrationEffects() {
  const { data: auctionState } = useAuctionState();
  const { data: player } = usePlayer(auctionState?.current_player_id || null);
  const { data: results } = useAuctionResults();
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebratingPlayerId, setCelebratingPlayerId] = useState<number | null>(null);

  useEffect(() => {
    if (!player || !results) return;

    const playerResult = results.find((r) => r.player_id === player.id);
    const isSold = player.status === 'sold' && playerResult;

    // Start celebration when a new player is sold
    if (isSold && player.id !== celebratingPlayerId) {
      setIsCelebrating(true);
      setConfetti(generateConfetti());
      setSparkles(generateSparkles());
      setCelebratingPlayerId(player.id);
    } 
    // Stop celebration when we move to a different player (next player appears)
    else if (player.id !== celebratingPlayerId && celebratingPlayerId !== null) {
      setIsCelebrating(false);
      setCelebratingPlayerId(null);
    }
    // Keep celebrating if current player is still sold
    else if (!isSold && celebratingPlayerId === player.id) {
      setIsCelebrating(false);
      setCelebratingPlayerId(null);
    }
  }, [player, results, celebratingPlayerId]);

  // Continuously regenerate confetti while celebrating
  useEffect(() => {
    if (!isCelebrating) return;

    const interval = setInterval(() => {
      setConfetti((prev) => {
        // Keep some existing particles and add new ones
        const existing = prev.filter((p) => {
          // Keep particles that are still animating (rough estimate)
          return Math.random() > 0.3;
        });
        const newParticles = generateConfetti().map((p, i) => ({
          ...p,
          id: Date.now() + i, // Unique IDs for new particles
        }));
        return [...existing, ...newParticles].slice(0, 100); // Limit total particles
      });
    }, 2000); // Regenerate every 2 seconds

    return () => clearInterval(interval);
  }, [isCelebrating]);

  if (!isCelebrating) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Confetti Particles */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            backgroundColor: particle.color,
            animation: `confettiFall ${particle.duration}s ease-in ${particle.delay}s forwards`,
            boxShadow: `0 0 6px ${particle.color}`,
          }}
        />
      ))}

      {/* Sparkle Effects */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute w-2 h-2"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animation: `sparkle 2s ease-in-out ${sparkle.delay}s infinite`,
          }}
        >
          <div className="w-full h-full bg-white rounded-full" style={{ boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)' }} />
        </div>
      ))}

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
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
