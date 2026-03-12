
import React from 'react';
import { Zap, Plus } from './ui/Icons';
import { PokerTable } from '../types';

const MOCK_TABLES: PokerTable[] = [
  { id: '1', stakes: '0.1/0.2 USDT', type: 'NLH', players: 6, maxPlayers: 9, avgPot: 15.5, handsPerHour: 85 },
  { id: '2', stakes: '0.5/1 USDT', type: 'NLH', players: 8, maxPlayers: 9, avgPot: 142.0, handsPerHour: 72 },
  { id: '3', stakes: '1/2 USDT', type: 'NLH', players: 3, maxPlayers: 6, avgPot: 320.5, handsPerHour: 90 },
  { id: '4', stakes: '2/4 USDT', type: 'PLO', players: 5, maxPlayers: 6, avgPot: 850.0, handsPerHour: 65 },
  { id: '5', stakes: '5/10 USDT', type: 'NLH', players: 2, maxPlayers: 6, avgPot: 2100.0, handsPerHour: 110 },
  { id: '6', stakes: '10/20 USDT', type: 'NLH', players: 9, maxPlayers: 9, avgPot: 5400.0, handsPerHour: 60 },
  { id: '7', stakes: '25/50 USDT', type: 'NLH', players: 4, maxPlayers: 6, avgPot: 12500.0, handsPerHour: 55 },
  { id: '8', stakes: '50/100 USDT', type: 'NLH', players: 5, maxPlayers: 6, avgPot: 28000.0, handsPerHour: 45 },
  { id: '9', stakes: '100/200 USDT', type: 'NLH', players: 2, maxPlayers: 6, avgPot: 65000.0, handsPerHour: 40 },
];

interface LobbyProps {
  onJoinTable: (tableId: string) => void;
  onWalletAction?: (action: 'deposit' | 'withdraw' | 'view') => void;
  onGoToProfile?: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ onJoinTable, onWalletAction, onGoToProfile }) => {
  return (
    <div className="flex flex-col h-full pt-2 pb-24 px-4 max-w-md mx-auto relative">
      
      {/* Compact Header (Top Bar) */}
      <div className="flex justify-between items-center py-2 mb-4 sticky top-0 z-20 bg-background/80 backdrop-blur-md -mx-4 px-4 border-b border-white/5">
        {/* Left: User Avatar */}
        <button 
            onClick={onGoToProfile}
            className="relative group"
        >
             <div className="w-9 h-9 rounded-full p-[1px] bg-gradient-to-tr from-gold to-yellow-600 shadow-lg group-active:scale-95 transition-transform">
                <img src="https://picsum.photos/200/200" alt="Profile" className="w-full h-full rounded-full object-cover border border-black" />
             </div>
             <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary border-2 border-background rounded-full"></div>
        </button>

        {/* Right: Compact Wallet Widget */}
        <div className="flex items-center gap-1 bg-surfaceHighlight/40 backdrop-blur-md rounded-full p-1 pl-4 border border-white/5 shadow-sm">
             <button 
                onClick={() => onWalletAction?.('view')}
                className="flex items-center mr-2 leading-none active:opacity-70 transition-opacity"
             >
                 <span className="text-sm font-mono font-bold text-white tracking-tight">1,250.00 <span className="text-primary text-xs">U</span></span>
             </button>
             
             <button 
                onClick={() => onWalletAction?.('deposit')}
                className="w-7 h-7 rounded-full bg-primary hover:bg-primaryHover text-white flex items-center justify-center shadow-[0_0_10px_rgba(0,200,83,0.4)] transition-transform active:scale-90"
             >
                <Plus size={16} strokeWidth={3} />
             </button>
        </div>
      </div>

      {/* Market Data Grid Header */}
      <div className="grid grid-cols-12 px-4 mb-2 text-[10px] font-bold text-textSecondary uppercase tracking-wider opacity-80">
        <div className="col-span-5">Blinds / Stakes</div>
        <div className="col-span-3 text-center">Players</div>
        <div className="col-span-4 text-right">Avg Pot</div>
      </div>

      {/* Tables List */}
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-20 no-scrollbar -mx-2 px-2">
        {MOCK_TABLES.map((table) => (
          <div 
            key={table.id}
            onClick={() => onJoinTable(table.id)}
            className="group grid grid-cols-12 items-center py-4 px-4 rounded-xl border border-transparent hover:bg-surfaceHighlight/40 hover:border-surfaceHighlight/50 transition-all active:scale-[0.99] cursor-pointer bg-surface/30 mb-1"
          >
            {/* Stakes */}
            <div className="col-span-5">
              <div className="text-sm font-bold text-white font-mono">{table.stakes}</div>
              <div className="flex items-center gap-1.5 mt-1">
                 <span className={`w-1.5 h-1.5 rounded-full ${table.type === 'NLH' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                 <span className="text-[10px] text-textSecondary font-medium">{table.type}</span>
              </div>
            </div>

            {/* Players */}
            <div className="col-span-3 flex justify-center">
               <div className={`px-2 py-1 rounded-md text-xs font-mono font-medium ${
                   table.players >= table.maxPlayers - 1 
                    ? 'bg-danger/10 text-danger border border-danger/20' 
                    : 'bg-surfaceHighlight/50 text-textSecondary'
               }`}>
                  {table.players}/{table.maxPlayers}
               </div>
            </div>

            {/* Avg Pot */}
            <div className="col-span-4 text-right">
              <div className="text-sm font-bold text-primary font-mono tracking-tight">{table.avgPot.toLocaleString()}</div>
              <div className="text-[10px] text-textSecondary mt-0.5">USDT</div>
            </div>
          </div>
        ))}

        <div className="text-center py-8">
            <p className="text-xs text-textSecondary mb-2">Don't see your stakes?</p>
            <button className="text-xs font-bold text-primary hover:text-primaryHover transition-colors border-b border-primary/30 pb-0.5">
                + Create Private Game
            </button>
        </div>
      </div>

      {/* Quick Seat FAB (kept for quick access) */}
      <button className="fixed bottom-24 right-6 bg-primary hover:bg-primaryHover text-white p-3.5 rounded-full shadow-glow-green transition-all hover:scale-105 active:scale-95 z-40 flex items-center justify-center">
        <Zap size={22} fill="currentColor" />
      </button>

    </div>
  );
};

export default Lobby;
