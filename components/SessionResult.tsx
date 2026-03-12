
import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Share2, Home, Clock, History, Trophy, CheckCircle, X } from './ui/Icons';

interface SessionResultProps {
  onClose: () => void;
}

const SessionResult: React.FC<SessionResultProps> = ({ onClose }) => {
  // Mock Data for the session
  const sessionData = {
    profit: 420.50,
    currency: 'USDT',
    duration: '1h 45m',
    hands: 124,
    vpip: '28%',
    date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    chartData: [
      { hand: 0, stack: 1000 },
      { hand: 20, stack: 1150 },
      { hand: 35, stack: 1120 },
      { hand: 50, stack: 1300 },
      { hand: 65, stack: 1280 },
      { hand: 80, stack: 1450 },
      { hand: 95, stack: 1380 },
      { hand: 110, stack: 1520 },
      { hand: 124, stack: 1420.50 },
    ]
  };

  const isWin = sessionData.profit >= 0;

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#1A1B1E] to-background z-0" />
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 z-0 ${isWin ? 'bg-primary' : 'bg-danger'}`} />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col relative z-10 px-4 pt-8 pb-6 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold text-white tracking-tight">Session Result</h1>
                <span className="text-xs text-textSecondary font-mono">{sessionData.date} • Table #8821</span>
            </div>
            <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center text-textSecondary hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Receipt Card */}
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-surface border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-2xl"
        >
            {/* Top Border Gradient */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isWin ? 'from-primary via-green-400 to-primary' : 'from-danger via-red-500 to-danger'}`} />

            {/* Net Profit Section */}
            <div className="text-center mb-8">
                <div className="text-xs font-bold text-textSecondary uppercase tracking-[0.2em] mb-2">Net Profit</div>
                <div className={`text-4xl md:text-5xl font-mono font-bold tracking-tighter ${isWin ? 'text-primary drop-shadow-[0_0_15px_rgba(0,200,83,0.3)]' : 'text-danger drop-shadow-[0_0_15px_rgba(255,59,48,0.3)]'}`}>
                    {isWin ? '+' : ''}{sessionData.profit.toFixed(2)} <span className="text-lg text-textSecondary font-medium align-top mt-2 inline-block">{sessionData.currency}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center p-3 bg-background/50 rounded-xl border border-white/5">
                    <Clock size={18} className="text-textSecondary mb-2" />
                    <span className="text-lg font-bold text-white leading-none">{sessionData.duration}</span>
                    <span className="text-[10px] text-textSecondary uppercase tracking-wider mt-1">Duration</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-background/50 rounded-xl border border-white/5">
                    <History size={18} className="text-textSecondary mb-2" />
                    <span className="text-lg font-bold text-white leading-none">{sessionData.hands}</span>
                    <span className="text-[10px] text-textSecondary uppercase tracking-wider mt-1">Hands</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-background/50 rounded-xl border border-white/5">
                    <Trophy size={18} className="text-gold mb-2" />
                    <span className="text-lg font-bold text-white leading-none">{sessionData.vpip}</span>
                    <span className="text-[10px] text-textSecondary uppercase tracking-wider mt-1">VPIP</span>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-48 mb-4 relative">
                 <div className="absolute top-0 left-0 text-[10px] text-textSecondary font-bold uppercase">Stack Trend</div>
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sessionData.chartData}>
                        <defs>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isWin ? '#00C853' : '#FF3B30'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={isWin ? '#00C853' : '#FF3B30'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1E1E24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(value: number) => [`${value} USDT`, 'Stack']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="stack" 
                            stroke={isWin ? '#00C853' : '#FF3B30'} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorProfit)" 
                        />
                    </AreaChart>
                 </ResponsiveContainer>
            </div>

            {/* Receipt Footer */}
            <div className="border-t border-dashed border-white/10 pt-4 flex justify-between items-center opacity-60">
                <span className="text-[10px] text-textSecondary">ID: 8829104-5592</span>
                <div className="flex items-center gap-1 text-[10px] text-textSecondary">
                    <CheckCircle size={10} className="text-primary" /> Verified Game
                </div>
            </div>

            {/* Receipt Jagged Edge (Visual only) */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-background [mask-image:linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] [mask-size:16px_16px] [mask-position:0_0,8px_0]"></div>
        </motion.div>

      </div>

      {/* Bottom Actions */}
      <div className="p-4 pb-8 bg-surface/50 backdrop-blur-md border-t border-surfaceHighlight relative z-20">
          <div className="flex flex-col gap-3 max-w-md mx-auto">
             <button className="w-full bg-gradient-to-r from-primary to-[#00963F] hover:from-[#00B048] hover:to-[#008535] text-white font-bold py-4 rounded-xl shadow-[0_5px_20px_rgba(0,200,83,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                <span>Share Image</span>
             </button>
             
             <button 
                onClick={onClose}
                className="w-full bg-surfaceHighlight hover:bg-surfaceHighlight/80 text-white font-bold py-3.5 rounded-xl border border-white/5 transition-colors flex items-center justify-center gap-2"
             >
                <Home size={18} className="text-textSecondary" />
                <span className="text-sm">Back to Lobby</span>
             </button>
          </div>
      </div>
    </div>
  );
};

export default SessionResult;
