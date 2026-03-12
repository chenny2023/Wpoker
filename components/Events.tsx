import React, { useEffect, useState } from 'react';
import { LeaderboardPlayer } from '../types';
import { Trophy } from './ui/Icons';

const TOP_PLAYERS: LeaderboardPlayer[] = [
  { id: '1', rank: 1, username: 'WhaleHunter99', country: '🇬🇧', profit: 42590.00, avatarUrl: 'https://picsum.photos/60/60?random=1' },
  { id: '2', rank: 2, username: 'FoldPre', country: '🇧🇷', profit: 38200.50, avatarUrl: 'https://picsum.photos/60/60?random=2' },
  { id: '3', rank: 3, username: 'SatoshiStack', country: '🇯🇵', profit: 29150.25, avatarUrl: 'https://picsum.photos/60/60?random=3' },
  { id: '4', rank: 4, username: 'LooseCannon', country: '🇨🇦', profit: 15400.00, avatarUrl: 'https://picsum.photos/60/60?random=4' },
  { id: '5', rank: 5, username: 'NitBox', country: '🇩🇪', profit: 12300.75, avatarUrl: 'https://picsum.photos/60/60?random=5' },
];

const Events: React.FC = () => {
  const [jackpot, setJackpot] = useState(45290.55);

  // Animate jackpot subtly
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + (Math.random() * 0.05));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full pt-4 pb-24 px-4 max-w-md mx-auto overflow-y-auto">
      {/* Bad Beat Jackpot Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-900/40 via-[#1A1B1E] to-[#1A1B1E] border border-yellow-700/30 p-6 mb-8 shadow-glow-gold">
        <div className="absolute top-0 right-0 p-3 opacity-20">
            <Trophy size={64} className="text-yellow-500" />
        </div>
        
        <div className="relative z-10 text-center">
            <h2 className="text-yellow-500/80 text-xs font-bold uppercase tracking-[0.2em] mb-2">Bad Beat Jackpot</h2>
            <div className="text-4xl font-mono font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                ${jackpot.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
                 <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                 <span className="text-[10px] text-yellow-200">Qualify with Quad 8s or better</span>
            </div>
        </div>
      </div>

      {/* Leaderboard Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Profit Leaderboard</h3>
        <span className="text-xs text-textSecondary bg-surfaceHighlight px-2 py-1 rounded">Weekly</span>
      </div>

      {/* Top 3 Podium (Stylized List for Mobile) */}
      <div className="space-y-3">
        {TOP_PLAYERS.map((player) => (
          <div 
            key={player.id}
            className={`flex items-center p-3 rounded-xl border transition-all ${
              player.rank === 1 
                ? 'bg-gradient-to-r from-yellow-900/20 to-surface border-yellow-700/30' 
                : 'bg-surface border-surfaceHighlight'
            }`}
          >
             {/* Rank */}
             <div className={`w-8 font-mono font-bold text-lg ${
                 player.rank === 1 ? 'text-yellow-400' : 
                 player.rank === 2 ? 'text-gray-300' : 
                 player.rank === 3 ? 'text-amber-700' : 'text-textSecondary'
             }`}>
                #{player.rank}
             </div>

             {/* Avatar */}
             <div className="relative mr-3">
                <img src={player.avatarUrl} alt={player.username} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <span className="absolute -bottom-1 -right-1 text-xs">{player.country}</span>
             </div>

             {/* Info */}
             <div className="flex-1">
                <div className="text-sm font-bold text-white">{player.username}</div>
             </div>

             {/* Profit */}
             <div className="text-right">
                <div className="text-sm font-bold text-primary font-mono">
                    +{player.profit.toLocaleString()}
                </div>
                <div className="text-[10px] text-textSecondary">USDT</div>
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-xs text-textSecondary opacity-60">
        Leaderboard updates every 15 minutes.
      </div>
    </div>
  );
};

export default Events;