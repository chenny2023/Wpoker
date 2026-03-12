
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Menu, X, Signal, RotateCcw, Plus, LogOut, UserX, Settings, History, 
  Clock, Square, CheckSquare, Ban, Tag, Target, Smile, MessageSquare, Keyboard, Send,
  Share2, UserPlus, Play, UserCheck, XCircle, Download, Link, QrCode, Share, CheckCircle,
  AlertTriangle
} from './ui/Icons';

interface GameTableProps {
  onLeave: () => void;
  mode?: 'regular' | 'host';
}

interface Opponent {
  id: number;
  name: string;
  stack: number;
  position: { top: string; left?: string; right?: string };
  status: string;
  country: string;
  action?: string;
  isTurn?: boolean;
  label?: string;
  hasMessage?: boolean;
}

interface GameSettings {
  fourColorDeck: boolean;
  tableTheme: 'black' | 'green' | 'blue';
  autoMuck: boolean;
  sound: boolean;
  vibration: boolean;
  blockChat: boolean;
  showEmojis: boolean;
}

// Minimalist Card Component
const Card = ({ rank, suit, highlight = false, index = 0, faceDown = false, useFourColor = false }: { rank?: string, suit?: 'H'|'D'|'C'|'S', highlight?: boolean, index?: number, faceDown?: boolean, useFourColor?: boolean }) => {
  let suitColor = 'text-black';
  if (suit === 'H' || suit === 'D') suitColor = 'text-danger';
  
  // 4-Color Deck Logic
  if (useFourColor) {
    if (suit === 'C') suitColor = 'text-green-500'; // Clubs Green
    if (suit === 'D') suitColor = 'text-blue-500';  // Diamonds Blue
    if (suit === 'H') suitColor = 'text-red-500';   // Hearts Red
    if (suit === 'S') suitColor = 'text-black';     // Spades Black
  }

  const suitIcon = suit ? { 'H': '♥', 'D': '♦', 'C': '♣', 'S': '♠' }[suit] : '';
  
  return (
    <motion.div 
      initial={{ scale: 0, y: -50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.1 
      }}
      className={`
        relative w-10 h-14 md:w-12 md:h-16 rounded-[4px] flex flex-col items-center justify-center shadow-md select-none
        ${faceDown 
            ? 'bg-surfaceHighlight border border-white/10' 
            : 'bg-gray-200'
        }
        ${highlight ? 'ring-2 ring-primary shadow-[0_0_15px_rgba(0,200,83,0.5)]' : ''}
      `}
    >
      {!faceDown ? (
          <>
            <span className={`text-base font-bold font-mono leading-none ${suitColor}`}>
                {rank}
            </span>
            <span className={`text-sm leading-none ${suitColor}`}>
                {suitIcon}
            </span>
          </>
      ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10">
              <div className="w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
      )}
    </motion.div>
  );
};

// Timer Ring Component
const TimerRing = ({ duration = 15, isPlaying = false }: { duration?: number, isPlaying?: boolean }) => {
  return (
    <div className="absolute inset-0 -m-1 pointer-events-none">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#2C2E33"
          strokeWidth="4"
        />
        {isPlaying && (
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#00C853"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: 0 }}
            transition={{ duration: duration, ease: "linear" }}
          />
        )}
      </svg>
    </div>
  );
};

// Toggle Switch Component
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${
        checked ? 'bg-primary' : 'bg-surfaceHighlight border border-white/10'
      }`}
    >
      <motion.div 
        initial={false}
        animate={{ x: checked ? 20 : 0 }}
        className="w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
);

const GameTable: React.FC<GameTableProps> = ({ onLeave, mode = 'regular' }) => {
  // Game States
  const [isPlaying, setIsPlaying] = useState(mode === 'regular');
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [betAmount, setBetAmount] = useState(50);
  const [isDealt, setIsDealt] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInviteOverlay, setShowInviteOverlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Sit Out State
  const [isSittingOut, setIsSittingOut] = useState(false);
  const [kickTimer, setKickTimer] = useState(299); // 4:59

  // Settings State
  const [settings, setSettings] = useState<GameSettings>({
    fourColorDeck: false,
    tableTheme: 'black',
    autoMuck: true,
    sound: true,
    vibration: true,
    blockChat: false,
    showEmojis: true
  });
  
  // Interaction States
  const [showChat, setShowChat] = useState(false);
  const [chatTab, setChatTab] = useState<'emoji' | 'quick' | 'text'>('emoji');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  // Pre-action States
  const [preActions, setPreActions] = useState({
    checkFold: false,
    foldAny: false,
    sitOut: false
  });

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => setIsDealt(true), 500);
    }
  }, [isPlaying]);

  // Sit Out Timer Logic
  useEffect(() => {
    let interval: any;
    if (isSittingOut && kickTimer > 0) {
      interval = setInterval(() => {
        setKickTimer((prev) => prev - 1);
      }, 1000);
    } else if (!isSittingOut) {
      setKickTimer(299);
    }
    
    if (kickTimer === 0 && isSittingOut) {
      onLeave();
    }
    
    return () => clearInterval(interval);
  }, [isSittingOut, kickTimer, onLeave]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartGame = () => {
    setIsPlaying(true);
  };

  const handleImBack = () => {
    setIsSittingOut(false);
    setPreActions(prev => ({ ...prev, sitOut: false }));
  };

  // Mock Opponents - Different sets for Host vs Regular
  const regularOpponents: Opponent[] = [
    { id: 1, name: 'Empty', stack: 0, position: { top: '35%', left: '5%' }, status: 'empty', country: '' }, 
    { id: 2, name: 'Alpha99', stack: 1250.50, position: { top: '12%', left: '15%' }, status: 'active', action: 'CHECK', isTurn: !isMyTurn, country: '🇬🇧', label: 'red' }, 
    { id: 3, name: 'Whale', stack: 5400.00, position: { top: '5%', left: '50%' }, status: 'active', action: '', country: '🇨🇳' }, 
    { id: 4, name: 'Bot_01', stack: 890.25, position: { top: '12%', right: '15%' }, status: 'folded', action: 'FOLD', country: '🇷🇺' }, 
    { id: 5, name: 'NitGuy', stack: 2100.00, position: { top: '35%', right: '5%' }, status: 'active', hasMessage: true, country: '🇩🇪' }, 
  ];

  const hostOpponents: Opponent[] = [
    { id: 1, name: 'Empty', stack: 0, position: { top: '35%', left: '5%' }, status: 'waiting', country: '' }, 
    { id: 2, name: 'Empty', stack: 0, position: { top: '12%', left: '15%' }, status: 'waiting', country: '' }, 
    { id: 3, name: 'Empty', stack: 0, position: { top: '5%', left: '50%' }, status: 'waiting', country: '' }, 
    { id: 4, name: 'Empty', stack: 0, position: { top: '12%', right: '15%' }, status: 'waiting', country: '' }, 
    { id: 5, name: 'Empty', stack: 0, position: { top: '35%', right: '5%' }, status: 'waiting', country: '' }, 
  ];

  // Use appropriate opponents list
  const activeOpponents = isPlaying ? regularOpponents : hostOpponents;

  const handlePreActionToggle = (key: keyof typeof preActions) => {
    setPreActions(prev => {
        const newState = { ...prev, [key]: !prev[key] };
        
        // Demo logic: If "Sit Out" is checked, trigger the state immediately for visual feedback
        if (key === 'sitOut' && newState.sitOut) {
            setTimeout(() => {
                setIsSittingOut(true);
            }, 600);
        }
        
        return newState;
    });
  };

  const getLabelColor = (color?: string) => {
    switch(color) {
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      case 'yellow': return 'bg-yellow-500';
      default: return null;
    }
  };

  // Get table color based on settings
  const getTableColor = () => {
      switch(settings.tableTheme) {
          case 'green': return 'bg-[#0f3a22]'; // Classic Green
          case 'blue': return 'bg-[#0f1e3a]';  // Cyber Blue
          case 'black': 
          default: return 'bg-[#16171A]';      // Midnight Black
      }
  };

  return (
    <div className="relative w-full h-full bg-background overflow-hidden flex flex-col font-sans" onClick={() => setSelectedPlayerId(null)}>
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full h-14 bg-surface/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center px-4 z-40">
         <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="text-textSecondary hover:text-white p-2 -ml-2">
                <Menu size={24} />
            </button>
            {/* Dev Tool */}
            {isPlaying && (
              <button onClick={() => setIsMyTurn(!isMyTurn)} className="text-[9px] bg-white/5 px-2 py-1 rounded text-textSecondary hover:text-white">
                  {isMyTurn ? 'My Turn' : 'Wait'}
              </button>
            )}
         </div>

         <div className="flex flex-col items-center">
             <span className="text-sm font-bold text-white tracking-wide">
                {!isPlaying ? 'Waiting (1/6)' : 'NLH 5/10 (6-Max)'}
             </span>
             <span className="text-[10px] text-textSecondary uppercase tracking-widest">Table #8821</span>
         </div>

         <div className="flex items-center gap-4">
             <button className="text-textSecondary hover:text-white">
                <RotateCcw size={20} />
             </button>
             <div className="flex items-end gap-0.5 h-4 text-primary">
                 <Signal size={18} />
             </div>
         </div>
      </div>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
            <motion.div 
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                exit={{ x: -250 }}
                onClick={(e) => e.stopPropagation()}
                className="fixed top-0 left-0 h-full w-64 bg-surface border-r border-surfaceHighlight shadow-2xl z-50 p-4"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Menu</h2>
                    <button onClick={() => setMenuOpen(false)} className="text-textSecondary"><X size={20} /></button>
                </div>
                <div className="space-y-2">
                    <button onClick={onLeave} className="w-full flex items-center gap-3 p-3 rounded-lg text-danger hover:bg-danger/10 transition-colors">
                        <LogOut size={18} />
                        <span className="font-medium">Leave Table</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg text-textSecondary hover:text-white hover:bg-white/5 transition-colors">
                        <UserX size={18} />
                        <span className="font-medium">Stand Up</span>
                    </button>
                    <div className="h-px bg-white/10 my-2"></div>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg text-textSecondary hover:text-white hover:bg-white/5 transition-colors">
                        <History size={18} />
                        <span className="font-medium">Hand History</span>
                    </button>
                    <button 
                        onClick={() => { setMenuOpen(false); setShowSettings(true); }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-textSecondary hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <Settings size={18} />
                        <span className="font-medium">Table Settings</span>
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSettings(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                />
                <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surfaceHighlight rounded-t-2xl z-[70] max-h-[85vh] overflow-y-auto"
                >
                    <div className="p-4 border-b border-surfaceHighlight flex justify-between items-center sticky top-0 bg-surface z-10">
                        <h3 className="text-lg font-bold text-white">Table Settings</h3>
                        <button onClick={() => setShowSettings(false)} className="text-textSecondary hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-8 pb-10">
                        
                        {/* Section 1: Visuals */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider">Visuals</h4>
                            
                            {/* 4-Color Deck */}
                            <div className="bg-surfaceHighlight/30 rounded-xl p-4 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-medium text-white">4-Color Deck</span>
                                    <Toggle checked={settings.fourColorDeck} onChange={() => setSettings(s => ({...s, fourColorDeck: !s.fourColorDeck}))} />
                                </div>
                                {/* Preview */}
                                <div className="flex justify-center gap-2 bg-black/20 p-3 rounded-lg">
                                    <div className="w-8 h-10 bg-gray-200 rounded text-center flex items-center justify-center text-black font-bold text-xs">A♠</div>
                                    <div className="w-8 h-10 bg-gray-200 rounded text-center flex items-center justify-center text-red-500 font-bold text-xs">K♥</div>
                                    <div className={`w-8 h-10 bg-gray-200 rounded text-center flex items-center justify-center font-bold text-xs ${settings.fourColorDeck ? 'text-green-500' : 'text-black'}`}>Q♣</div>
                                    <div className={`w-8 h-10 bg-gray-200 rounded text-center flex items-center justify-center font-bold text-xs ${settings.fourColorDeck ? 'text-blue-500' : 'text-red-500'}`}>J♦</div>
                                </div>
                            </div>

                            {/* Table Felt */}
                            <div className="bg-surfaceHighlight/30 rounded-xl p-4 border border-white/5">
                                <span className="text-sm font-medium text-white block mb-3">Table Felt</span>
                                <div className="flex gap-4">
                                    {[
                                        { id: 'green', color: 'bg-[#0f3a22]', label: 'Classic' },
                                        { id: 'black', color: 'bg-[#16171A]', label: 'Midnight' },
                                        { id: 'blue', color: 'bg-[#0f1e3a]', label: 'Cyber' }
                                    ].map(theme => (
                                        <button 
                                            key={theme.id}
                                            onClick={() => setSettings(s => ({...s, tableTheme: theme.id as any}))}
                                            className="flex flex-col items-center gap-2 group"
                                        >
                                            <div className={`w-12 h-12 rounded-full ${theme.color} border-2 transition-all shadow-lg flex items-center justify-center ${
                                                settings.tableTheme === theme.id 
                                                    ? 'border-primary scale-110' 
                                                    : 'border-white/10 group-hover:border-white/30'
                                            }`}>
                                                {settings.tableTheme === theme.id && <CheckCircle size={16} className="text-white" />}
                                            </div>
                                            <span className={`text-[10px] font-medium ${
                                                settings.tableTheme === theme.id ? 'text-primary' : 'text-textSecondary'
                                            }`}>
                                                {theme.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Gameplay */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider">Gameplay</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                                    <span className="text-sm font-medium text-white">Auto Muck Hand</span>
                                    <Toggle checked={settings.autoMuck} onChange={() => setSettings(s => ({...s, autoMuck: !s.autoMuck}))} />
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                                    <span className="text-sm font-medium text-white">Sound Effects</span>
                                    <Toggle checked={settings.sound} onChange={() => setSettings(s => ({...s, sound: !s.sound}))} />
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                                    <span className="text-sm font-medium text-white">Haptic Vibration</span>
                                    <Toggle checked={settings.vibration} onChange={() => setSettings(s => ({...s, vibration: !s.vibration}))} />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Chat */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider">Chat</h4>
                             <div className="space-y-1">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                                    <span className="text-sm font-medium text-white">Block All Chat</span>
                                    <Toggle checked={settings.blockChat} onChange={() => setSettings(s => ({...s, blockChat: !s.blockChat}))} />
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-surfaceHighlight/30 border border-white/5">
                                    <span className="text-sm font-medium text-white">Show Emojis</span>
                                    <Toggle checked={settings.showEmojis} onChange={() => setSettings(s => ({...s, showEmojis: !s.showEmojis}))} />
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>

      {/* Invite & Share Overlay */}
      <AnimatePresence>
        {showInviteOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-6"
            onClick={() => setShowInviteOverlay(false)}
          >
             <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm flex flex-col gap-6"
             >
                {/* Share Card */}
                <div className="bg-gradient-to-br from-[#1A1B1E] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,200,83,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    
                    <div className="flex flex-col items-center text-center">
                        <div className="text-2xl font-bold text-white font-mono mb-1">5/10 USDT</div>
                        <div className="text-xs text-textSecondary uppercase tracking-widest mb-6">Private Room</div>
                        
                        <div className="w-20 h-20 rounded-full p-1 border-2 border-primary mb-4 relative">
                            <img src="https://picsum.photos/200/200" className="w-full h-full rounded-full object-cover" />
                            <div className="absolute bottom-0 right-0 bg-primary text-[10px] text-white font-bold px-1.5 rounded-full border border-black">HOST</div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Join my table, Shark!</h3>
                        <p className="text-sm text-textSecondary mb-6">Waiting for players...</p>

                        <div className="bg-white p-2 rounded-lg mb-4">
                            <QrCode size={80} className="text-black" />
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-50">
                             <div className="w-4 h-4 rounded-full bg-primary"></div>
                             <span className="text-xs font-bold font-mono">wpoker.fun</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button className="w-full bg-[#24A1DE] hover:bg-[#2090C7] text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                        <Send size={20} />
                        <span>Send to Telegram Chat</span>
                    </button>

                    <div className="grid grid-cols-3 gap-3">
                         <button className="flex flex-col items-center justify-center gap-1 bg-surfaceHighlight hover:bg-surfaceHighlight/80 py-3 rounded-xl transition-colors">
                             <Link size={20} className="text-white" />
                             <span className="text-[10px] text-textSecondary">Copy Link</span>
                         </button>
                         <button className="flex flex-col items-center justify-center gap-1 bg-surfaceHighlight hover:bg-surfaceHighlight/80 py-3 rounded-xl transition-colors">
                             <Download size={20} className="text-white" />
                             <span className="text-[10px] text-textSecondary">Save Image</span>
                         </button>
                         <button className="flex flex-col items-center justify-center gap-1 bg-surfaceHighlight hover:bg-surfaceHighlight/80 py-3 rounded-xl transition-colors">
                             <Share size={20} className="text-white" />
                             <span className="text-[10px] text-textSecondary">More</span>
                         </button>
                    </div>
                </div>
                
                <button 
                  onClick={() => setShowInviteOverlay(false)}
                  className="mx-auto text-textSecondary hover:text-white p-2"
                >
                   Close
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Area */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        
        {/* Table Oval Surface */}
        <div className={`absolute w-[88%] h-[68%] border border-white/5 rounded-[120px] shadow-2xl transition-colors duration-500 ${getTableColor()}`}>
            {/* Inner Ring */}
            <div className="absolute inset-8 border border-white/5 rounded-[100px]"></div>
        </div>

        {/* Opponents */}
        {activeOpponents.map((player) => (
          <div 
            key={player.id}
            onClick={(e) => {
                if(player.status !== 'empty' && player.status !== 'waiting') {
                    e.stopPropagation();
                    setSelectedPlayerId(player.id === selectedPlayerId ? null : player.id);
                } else if (player.status === 'waiting') {
                    setShowInviteOverlay(true);
                }
            }}
            className="absolute transform -translate-x-1/2 flex flex-col items-center w-20 z-10 cursor-pointer"
            style={{ 
                top: player.position.top, 
                left: player.position.left, 
                right: player.position.right ? player.position.right : 'auto',
                transform: player.position.right ? 'translateX(50%)' : 'translateX(-50%)'
            }}
          >
             {/* Chat Bubble */}
             <AnimatePresence>
                {player.hasMessage && !settings.blockChat && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-12 -right-10 bg-surface border border-surfaceHighlight px-3 py-2 rounded-xl rounded-bl-none shadow-lg z-30"
                    >
                        <span className="text-[10px] text-white font-medium whitespace-nowrap">Nice hand!</span>
                    </motion.div>
                )}
             </AnimatePresence>

             {/* Player Interaction Popup */}
             <AnimatePresence>
                {selectedPlayerId === player.id && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-16 z-50 bg-surface/95 backdrop-blur-xl border border-surfaceHighlight rounded-xl shadow-2xl p-3 w-48 flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                                <img src={`https://picsum.photos/50/50?random=${player.id}`} className="w-full h-full" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white flex items-center gap-1">
                                    {player.name} <span>{player.country}</span>
                                </div>
                                <div className="text-[10px] text-primary font-mono">{player.stack.toLocaleString()}</div>
                            </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-between items-center">
                            <button className="p-2 rounded hover:bg-white/10 text-textSecondary hover:text-white" title="Mute">
                                <Ban size={16} />
                            </button>
                            <div className="h-4 w-px bg-white/10"></div>
                            
                            {/* Labels */}
                            <div className="flex gap-1">
                                {['bg-red-500', 'bg-green-500', 'bg-blue-500'].map(bg => (
                                    <button key={bg} className={`w-3 h-3 rounded-full ${bg} hover:scale-125 transition-transform`}></button>
                                ))}
                            </div>
                        </div>

                        {/* Throw Items */}
                        <div className="grid grid-cols-4 gap-1 pt-1 border-t border-white/10">
                            {['🍅', '🥚', '💣', '🍺'].map(item => (
                                <button key={item} className="text-lg hover:scale-125 transition-transform text-center">{item}</button>
                            ))}
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>

             {/* Avatar Container */}
             <div className="relative w-14 h-14">
                {player.status === 'active' && player.isTurn && <TimerRing duration={15} isPlaying={true} />}
                
                <div className={`
                    absolute inset-1 rounded-full border-2 flex items-center justify-center bg-surface overflow-hidden transition-all duration-300
                    ${player.status === 'active' ? 'border-surfaceHighlight' : 
                      player.status === 'folded' ? 'border-surfaceHighlight opacity-50 grayscale' : 
                      player.status === 'waiting' ? 'border-dashed border-white/20 bg-white/5 hover:bg-white/10' :
                      'border-dashed border-surfaceHighlight'}
                `}>
                    {player.status === 'waiting' ? (
                        <UserPlus size={16} className="text-white/30" />
                    ) : player.status !== 'empty' ? (
                        <img src={`https://picsum.photos/50/50?random=${player.id}`} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-textSecondary text-[10px]">Open</span>
                    )}
                </div>

                {/* Color Label */}
                {player.label && (
                    <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full border border-background ${getLabelColor(player.label)} z-20`}></div>
                )}

                {/* Dealer Button */}
                {player.id === 2 && isPlaying && (
                    <div className="absolute bottom-0 -right-1 w-5 h-5 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface shadow-sm z-20">D</div>
                )}
             </div>

             {/* Player Data */}
             {player.status !== 'empty' && player.status !== 'waiting' && (
                 <div className="flex flex-col items-center bg-surface/90 px-3 py-1 rounded-lg backdrop-blur-sm border border-surfaceHighlight mt-1 shadow-lg z-10 min-w-[80px]">
                    <span className="text-[10px] text-textSecondary font-medium leading-tight truncate w-full text-center">{player.name}</span>
                    <span className="text-xs font-mono font-bold text-white leading-tight">{player.stack.toLocaleString()}</span>
                 </div>
             )}

             {/* Cards */}
             {player.status === 'active' && isDealt && isPlaying && (
                 <div className="absolute top-5 left-10 flex -space-x-4 scale-75 z-0">
                    <Card index={0} faceDown useFourColor={settings.fourColorDeck} />
                    <Card index={0.1} faceDown useFourColor={settings.fourColorDeck} />
                 </div>
             )}
             
             {/* Action Pill */}
             <AnimatePresence>
                {player.action && (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute -top-6 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-20
                            ${player.action === 'FOLD' ? 'bg-danger text-white' : 'bg-surfaceHighlight text-white border border-white/10'}
                        `}
                    >
                        {player.action}
                    </motion.div>
                )}
             </AnimatePresence>
          </div>
        ))}

        {/* Center: Pot & Board (Only when Playing) */}
        {isPlaying ? (
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full z-0">
              <div className="mb-6 flex flex-col items-center">
                   <div className="text-[10px] text-textSecondary uppercase tracking-widest mb-1">Total Pot</div>
                   <div className="text-lg font-mono font-bold text-primary tracking-tight">
                      155.5 <span className="text-xs font-normal text-textSecondary">U</span>
                   </div>
                   <div className="text-[9px] text-textSecondary/50 mt-0.5">Rake: 2.5 U</div>
              </div>

              <div className="flex gap-1.5 h-16">
                  {isDealt && (
                      <>
                          <Card rank="A" suit="S" index={1} useFourColor={settings.fourColorDeck} />
                          <Card rank="10" suit="H" highlight index={2} useFourColor={settings.fourColorDeck} />
                          <Card rank="7" suit="D" index={3} useFourColor={settings.fourColorDeck} />
                          <div className="w-10 h-14 md:w-12 md:h-16 border border-white/10 rounded-[4px] flex items-center justify-center bg-surface/20"></div>
                          <div className="w-10 h-14 md:w-12 md:h-16 border border-white/10 rounded-[4px] flex items-center justify-center bg-surface/20"></div>
                      </>
                  )}
              </div>
          </div>
        ) : (
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center opacity-30">
             <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-2">
                <span className="font-serif italic text-2xl">wp</span>
             </div>
             <p className="text-xs tracking-widest uppercase font-bold">Waiting for players</p>
          </div>
        )}

        {/* Hero Section */}
        <div className="absolute bottom-[35%] md:bottom-[30%] left-1/2 -translate-x-1/2 flex flex-col items-center">
             
             {isPlaying ? (
               <>
                 {/* Time Bank */}
                 {isMyTurn && (
                    <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute -right-16 top-0 flex items-center gap-1 bg-surfaceHighlight border border-white/10 rounded-full px-2 py-1"
                    >
                        <Clock size={12} className="text-yellow-500" />
                        <span className="text-[10px] font-mono text-yellow-500">24s</span>
                    </motion.div>
                 )}

                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 backdrop-blur-sm"
                 >
                    Top Pair
                 </motion.div>

                 <div className="flex gap-1 transform scale-110 mb-2 h-16 relative">
                     {isDealt && (
                         <>
                            <div className="-rotate-3 origin-bottom-right">
                                <Card rank="J" suit="H" highlight index={4} useFourColor={settings.fourColorDeck} />
                            </div>
                            <div className="rotate-3 origin-bottom-left">
                                <Card rank="J" suit="S" highlight index={5} useFourColor={settings.fourColorDeck} />
                            </div>
                         </>
                     )}
                 </div>
                 
                 <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-primary shadow-glow-green"></span>
                    <span className="text-sm font-mono font-bold text-white">850.00</span>
                    <button className="w-5 h-5 flex items-center justify-center bg-yellow-500 rounded-full text-black hover:bg-yellow-400 transition-colors -mr-1">
                        <Plus size={12} strokeWidth={3} />
                    </button>
                 </div>
               </>
             ) : (
               /* Host Seated State */
               <div className="flex flex-col items-center scale-110 relative top-6">
                 <div className="w-16 h-16 rounded-full p-1 bg-primary shadow-[0_0_20px_rgba(0,200,83,0.3)] border-2 border-white">
                     <img src="https://picsum.photos/200" className="w-full h-full rounded-full object-cover" />
                 </div>
                 <div className="mt-2 bg-surfaceHighlight px-3 py-1 rounded-lg border border-white/10 shadow-lg text-center">
                    <div className="text-[10px] text-primary font-bold">HOST</div>
                    <div className="text-xs font-bold text-white">You</div>
                 </div>
               </div>
             )}
        </div>

      </div>

      {/* CHAT INTERFACE - Expanding Layer */}
      <AnimatePresence>
        {showChat && !settings.blockChat && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-[220px] left-4 w-72 bg-surface/95 backdrop-blur-xl border border-surfaceHighlight rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Chat Tabs */}
                <div className="flex border-b border-surfaceHighlight">
                    {[
                        { id: 'emoji', icon: Smile, visible: settings.showEmojis },
                        { id: 'quick', icon: MessageSquare, visible: true },
                        { id: 'text', icon: Keyboard, visible: true }
                    ].filter(t => t.visible).map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setChatTab(tab.id as any)}
                            className={`flex-1 py-3 flex items-center justify-center transition-colors ${
                                chatTab === tab.id ? 'bg-surfaceHighlight text-primary' : 'text-textSecondary hover:text-white'
                            }`}
                        >
                            <tab.icon size={18} />
                        </button>
                    ))}
                    <button onClick={() => setShowChat(false)} className="px-3 text-textSecondary hover:text-white"><X size={16} /></button>
                </div>

                {/* Content Area */}
                <div className="p-3 h-48 overflow-y-auto no-scrollbar">
                    {chatTab === 'emoji' && settings.showEmojis && (
                        <div className="grid grid-cols-5 gap-2 text-2xl">
                            {['😀','😎','🤑','🤔','😡','🤮','🤡','👻','💀','💩','👍','👎','👋','👀','🔥'].map(e => (
                                <button key={e} className="hover:scale-125 transition-transform p-1">{e}</button>
                            ))}
                        </div>
                    )}
                    
                    {chatTab === 'quick' && (
                        <div className="flex flex-col gap-2">
                            {['Nice Hand', 'Good Game', 'Unlucky', 'Thinking...', 'All in!', 'Show them!', 'Oops'].map(msg => (
                                <button key={msg} className="text-left px-3 py-2 rounded-lg bg-surfaceHighlight/50 hover:bg-surfaceHighlight text-xs text-white transition-colors">
                                    {msg}
                                </button>
                            ))}
                        </div>
                    )}

                    {chatTab === 'text' && (
                        <div className="flex flex-col h-full justify-end gap-2">
                             <div className="flex-1 text-[10px] text-textSecondary space-y-1">
                                <p><span className="text-primary font-bold">You:</span> Nice hand!</p>
                                <p><span className="text-white font-bold">Alpha99:</span> Thanks</p>
                             </div>
                             <div className="flex gap-2">
                                <input type="text" placeholder="Type..." className="flex-1 bg-surfaceHighlight/50 rounded-lg px-3 py-1.5 text-xs text-white border border-white/5 focus:border-primary outline-none" />
                                <button className="bg-primary p-1.5 rounded-lg text-white"><Send size={14} /></button>
                             </div>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>


      {/* Control Panel (Bottom) */}
      <motion.div 
        className="bg-surface border-t border-surfaceHighlight p-4 pb-8 z-40 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)] relative min-h-[160px]"
        onClick={(e) => e.stopPropagation()}
      >
          {isPlaying ? (
            <>
              {/* Chat Toggle Bubble */}
              {!settings.blockChat && (
                  <motion.button 
                     whileTap={{ scale: 0.9 }}
                     onClick={() => setShowChat(!showChat)}
                     className={`absolute -top-14 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-50 transition-colors border ${
                         showChat 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-surface/80 backdrop-blur-md border-surfaceHighlight text-textSecondary hover:text-white'
                     }`}
                   >
                       <MessageCircle size={20} />
                   </motion.button>
               )}

              {!isMyTurn ? (
                  // STATE A: PRE-ACTIONS
                  <div className="h-full flex items-center justify-between px-2 pt-4">
                      <div className="text-xs text-textSecondary animate-pulse">Waiting for action...</div>
                      <div className="flex gap-4">
                          {[
                            { id: 'checkFold', label: 'Check/Fold' },
                            { id: 'foldAny', label: 'Fold to any' },
                            { id: 'sitOut', label: 'Sit out' }
                          ].map((opt) => (
                            <button 
                                key={opt.id}
                                onClick={() => handlePreActionToggle(opt.id as any)}
                                className="flex items-center gap-2 text-textSecondary hover:text-white group"
                            >
                                {preActions[opt.id as keyof typeof preActions] 
                                    ? <CheckSquare size={18} className="text-primary" /> 
                                    : <Square size={18} className="text-surfaceHighlight group-hover:text-white/50" />
                                }
                                <span className="text-[10px] font-medium uppercase tracking-wide">{opt.label}</span>
                            </button>
                          ))}
                      </div>
                  </div>
              ) : (
                  // STATE B: ACTIVE TURN
                  <div className="flex flex-col gap-4">
                    {/* Slider Row */}
                    <div className="flex items-end gap-3 px-1">
                        {/* Shortcuts */}
                        <div className="flex gap-2">
                            {['1/3', '1/2', 'POT', 'ALL'].map(amt => (
                                <button key={amt} className="px-2 py-1 rounded-md bg-surfaceHighlight border border-white/5 text-[10px] font-bold text-textSecondary hover:text-white hover:border-primary/50 transition-all">
                                    {amt}
                                </button>
                            ))}
                        </div>

                        {/* Input/Slider Combo */}
                        <div className="flex-1 bg-black/40 rounded-xl p-1.5 flex flex-col gap-1 border border-white/5">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[9px] text-textSecondary font-medium">RAISE TO</span>
                                <input 
                                    type="number" 
                                    value={betAmount} 
                                    onChange={(e) => setBetAmount(parseInt(e.target.value))}
                                    className="bg-transparent text-right text-sm font-bold font-mono text-primary w-20 outline-none"
                                />
                            </div>
                            <input 
                                type="range" 
                                min="10" 
                                max="850" 
                                value={betAmount} 
                                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                                className="w-full h-1 bg-surfaceHighlight rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    </div>

                    {/* Main Buttons */}
                    <div className="grid grid-cols-3 gap-3 h-14">
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="rounded-xl border border-danger/50 text-danger font-bold text-sm bg-danger/5 hover:bg-danger/10 transition-colors uppercase tracking-wider flex flex-col items-center justify-center leading-none gap-1"
                        >
                            <span>Fold</span>
                        </motion.button>

                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="rounded-xl bg-surfaceHighlight text-white font-bold text-sm hover:bg-surfaceHighlight/80 transition-colors uppercase tracking-wider flex flex-col items-center justify-center leading-none gap-1 border border-white/5"
                        >
                            <span>Check</span>
                            <span className="text-[9px] font-mono opacity-50">0.00</span>
                        </motion.button>

                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="rounded-xl bg-primary text-white font-bold text-sm hover:bg-primaryHover transition-colors uppercase tracking-wider flex flex-col items-center justify-center leading-none gap-1 shadow-[0_0_20px_rgba(0,200,83,0.3)]"
                        >
                            <span>Bet</span>
                            <span className="text-[10px] font-mono opacity-90">{betAmount}</span>
                        </motion.button>
                    </div>
                  </div>
              )}
            </>
          ) : (
            // STATE C: HOST WAITING PANEL
            <div className="flex flex-col gap-4">
               {/* Primary Action: Invite */}
               <motion.button 
                  whileTap={{ scale: 0.98 }}
                  animate={{ boxShadow: ["0 0 0px rgba(0,200,83,0)", "0 0 20px rgba(0,200,83,0.3)", "0 0 0px rgba(0,200,83,0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={() => setShowInviteOverlay(true)}
                  className="w-full bg-gradient-to-r from-primary to-[#00963F] text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
               >
                  <Share2 size={20} />
                  <span>Invite Friends</span>
               </motion.button>

               {/* Secondary Actions */}
               <div className="grid grid-cols-3 gap-3">
                   <button 
                       onClick={() => setShowSettings(true)}
                       className="flex flex-col items-center justify-center gap-1 bg-surfaceHighlight hover:bg-surfaceHighlight/80 py-3 rounded-xl transition-colors"
                    >
                       <Settings size={20} className="text-white" />
                       <span className="text-[10px] text-textSecondary">Settings</span>
                   </button>

                   <button className="flex flex-col items-center justify-center gap-1 bg-surfaceHighlight hover:bg-surfaceHighlight/80 py-3 rounded-xl transition-colors">
                       <UserCheck size={20} className="text-white" />
                       <span className="text-[10px] text-textSecondary">Approve</span>
                   </button>

                   <button 
                    onClick={handleStartGame}
                    className="flex flex-col items-center justify-center gap-1 bg-surfaceHighlight hover:bg-surfaceHighlight/80 py-3 rounded-xl transition-colors text-primary"
                   >
                       <Play size={20} className="fill-current" />
                       <span className="text-[10px] font-bold">Start Game</span>
                   </button>
               </div>

               <button onClick={onLeave} className="text-center text-xs text-danger hover:text-red-400 mt-1">
                  Close Room
               </button>
            </div>
          )}
      </motion.div>

      {/* Sit Out Overlay */}
      <AnimatePresence>
        {isSittingOut && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex flex-col items-center text-center max-w-xs w-full"
                >
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative">
                        <Clock size={40} className="text-textSecondary" />
                        <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-danger flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">You are Sitting Out</h2>
                    <p className="text-sm text-textSecondary mb-8">
                        Auto-kick in <span className="font-mono text-danger font-bold text-lg">{formatTime(kickTimer)}</span>
                    </p>

                    <button 
                        onClick={handleImBack}
                        className="w-full bg-primary hover:bg-primaryHover text-white font-bold text-lg py-5 rounded-2xl shadow-[0_0_30px_rgba(0,200,83,0.4)] transition-all active:scale-95 animate-pulse uppercase tracking-wider"
                    >
                        I'M BACK
                    </button>

                    <button 
                        onClick={onLeave}
                        className="mt-8 text-xs text-textSecondary hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
                    >
                        Leave Table completely
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameTable;
