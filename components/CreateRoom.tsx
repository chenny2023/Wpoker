
import React, { useState, useMemo } from 'react';
import { Copy, Info } from './ui/Icons';

interface CreateRoomProps {
  onCreate?: () => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreate }) => {
  const [blinds, setBlinds] = useState('1/2');
  const [tableSize, setTableSize] = useState(6);
  const [rake, setRake] = useState(3); // %
  const [commission, setCommission] = useState(50); // % of rake

  const estimatedEarnings = useMemo(() => {
    // Dummy calculation logic
    // Avg pot 50bb * 100 hands * rake% * commission%
    const bigBlind = parseFloat(blinds.split('/')[1]);
    const avgPot = bigBlind * 40; 
    const totalRakeCollected = avgPot * 100 * (rake / 100); 
    const myShare = totalRakeCollected * (commission / 100);
    return myShare.toFixed(2);
  }, [blinds, rake, commission]);

  return (
    <div className="flex flex-col h-full pt-6 pb-24 px-4 max-w-md mx-auto overflow-y-auto">
      <h1 className="text-2xl font-bold text-white mb-6 tracking-tight">Agent Hub</h1>

      {/* Basic Settings */}
      <div className="space-y-6 mb-8">
        <div>
          <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3 block">Stakes (USDT)</label>
          <div className="grid grid-cols-3 gap-3">
            {['0.5/1', '1/2', '2/4', '5/10', '10/20', '25/50'].map((opt) => (
              <button
                key={opt}
                onClick={() => setBlinds(opt)}
                className={`py-3 rounded-xl text-sm font-mono font-medium transition-all border ${
                  blinds === opt
                    ? 'bg-surfaceHighlight border-primary text-primary shadow-[0_0_10px_rgba(38,161,123,0.1)]'
                    : 'bg-surface border-surfaceHighlight text-textSecondary hover:border-white/20'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3 block">Table Size</label>
          <div className="flex bg-surface rounded-xl p-1 border border-surfaceHighlight">
            {[2, 6, 9].map((size) => (
              <button
                key={size}
                onClick={() => setTableSize(size)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tableSize === size
                    ? 'bg-surfaceHighlight text-white shadow-sm'
                    : 'text-textSecondary hover:text-white'
                }`}
              >
                {size}-Max
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Control Panel */}
      <div className="bg-surface border border-surfaceHighlight rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
        
        <div className="flex items-center gap-2 mb-6">
            <h2 className="text-white font-semibold">Commission Settings</h2>
            <Info size={14} className="text-textSecondary" />
        </div>

        {/* Rake Slider */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-textSecondary">Table Rake</span>
            <span className="text-white font-mono">{rake}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={rake}
            onChange={(e) => setRake(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-surfaceHighlight rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* My Commission Slider */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-textSecondary">My Rebate</span>
            <span className="text-primary font-mono">{commission}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={commission}
            onChange={(e) => setCommission(parseInt(e.target.value))}
            className="w-full h-1.5 bg-surfaceHighlight rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-textSecondary mt-1">
             <span>0%</span>
             <span>Max 80%</span>
          </div>
        </div>

        {/* Dynamic Preview */}
        <div className="bg-[#101113] rounded-xl p-4 border border-surfaceHighlight/50">
            <div className="text-xs text-textSecondary mb-1">Est. Earnings / 100 Hands</div>
            <div className="text-2xl font-bold text-primary font-mono tracking-tight flex items-baseline gap-1">
                +{estimatedEarnings} <span className="text-sm font-normal text-textSecondary">USDT</span>
            </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-auto pt-6">
        <button 
          onClick={onCreate}
          className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Create & Share</span>
          <Copy size={18} className="opacity-70" />
        </button>
        <p className="text-center text-[10px] text-textSecondary mt-3">
            Room link will be generated automatically for Telegram sharing.
        </p>
      </div>
    </div>
  );
};

export default CreateRoom;
