
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Globe,
  Edit2,
  CreditCard,
  Wallet,
  Volume2,
  Smartphone,
  Shield,
  Lock,
  Mail,
  LogOut,
  Camera,
  X,
  CheckCircle,
  Gem,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Bitcoin,
  Banknote,
  HelpCircle,
  Copy,
  Info,
  Landmark,
  Link,
  Clock,
  XCircle,
  ExternalLink,
  DollarSign,
  FileText
} from './ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';

export type ViewState = 'main' | 'edit' | 'email' | 'wallet' | 'history' | 'transaction_detail';

interface AccountProps {
    initialView?: ViewState;
    initialWalletTab?: 'deposit' | 'withdraw';
}

// Extended Transaction Type for UI
interface TransactionDetail {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'game_pnl';
  amount: number;
  currency: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  network?: string;
  address?: string;
  txId?: string;
  fee?: number;
}

const Account: React.FC<AccountProps> = ({ initialView = 'main', initialWalletTab = 'deposit' }) => {
  const [currentView, setCurrentView] = useState<ViewState>(initialView);
  const [selectedTx, setSelectedTx] = useState<TransactionDetail | null>(null);
  
  // Internal state to control which tab the Wallet View opens on (Deposit vs Withdraw)
  const [targetWalletTab, setTargetWalletTab] = useState<'deposit' | 'withdraw'>(initialWalletTab);

  // Profile State
  const [nickname, setNickname] = useState('CryptoShark');
  const [bio, setBio] = useState('All in or fold.');
  
  // Settings State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [theme, setTheme] = useState<'classic' | 'dark' | 'cyber'>('dark');

  // Security State
  const [isEmailBound, setIsEmailBound] = useState(false);
  const [boundEmail, setBoundEmail] = useState('');
  
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

  // --- SUB-COMPONENT: EDIT PROFILE ---
  const EditProfileView = () => (
    <div className="flex flex-col h-full bg-background relative z-50 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center px-4 py-4 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={() => setCurrentView('main')} 
          className="flex items-center text-textSecondary hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium ml-1">Cancel</span>
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">Edit Profile</h1>
        <button 
          onClick={() => setCurrentView('main')} 
          className="text-sm font-bold text-primary hover:text-primaryHover transition-colors px-2"
        >
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
        <div className="self-center relative group cursor-pointer">
          <div className="w-28 h-28 rounded-full p-1 bg-surface border border-surfaceHighlight shadow-2xl relative overflow-hidden">
            <img 
              src="https://picsum.photos/200/200" 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/30 p-3 rounded-full backdrop-blur-sm border border-white/10">
                <Camera size={28} className="text-white" />
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
             <span className="text-xs font-medium text-primary">Change Photo</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 block ml-1">UID</label>
            <div className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-inner">
              <span className="text-textSecondary font-mono tracking-widest text-sm opacity-70">8829104</span>
              <Lock size={14} className="text-textSecondary/30" />
            </div>
            <p className="text-[10px] text-textSecondary/50 mt-1.5 ml-1">Unique Identifier cannot be changed.</p>
          </div>

          <div>
            <label className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 block ml-1">Nickname</label>
            <div className="relative group">
              <input 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-surface border border-surfaceHighlight rounded-xl p-4 pr-10 text-white font-medium focus:border-primary focus:bg-surfaceHighlight/50 outline-none transition-all placeholder:text-textSecondary/30"
              />
              {nickname && (
                <button 
                  onClick={() => setNickname('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2 ml-1">
                <Gem size={12} className="text-blue-400" />
                <span className="text-[10px] text-blue-400 font-medium">Cost: 50 Diamonds to change</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 block ml-1">Bio / Signature</label>
            <div className="relative">
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 50))}
                className="w-full bg-surface border border-surfaceHighlight rounded-xl p-4 text-white text-sm focus:border-primary focus:bg-surfaceHighlight/50 outline-none transition-all h-28 resize-none placeholder:text-textSecondary/30"
                placeholder="Tell others about your playstyle..."
              />
              <div className={`absolute bottom-3 right-3 text-[10px] font-mono ${bio.length === 50 ? 'text-danger' : 'text-textSecondary'}`}>
                {bio.length}/50
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- SUB-COMPONENT: BIND EMAIL VIEW ---
  const BindEmailView = () => {
    const [emailInput, setEmailInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [timer, setTimer] = useState(0);

    const isValid = emailInput.includes('@') && emailInput.includes('.') && codeInput.length >= 4;

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleGetCode = () => {
        if (!emailInput) return;
        setTimer(60);
        // Simulate API call
    };

    const handleBind = () => {
        setBoundEmail(emailInput);
        setIsEmailBound(true);
        // Don't close immediately, show success state
    };

    const handleChangeEmail = () => {
        setIsEmailBound(false);
        setBoundEmail('');
        setEmailInput('');
        setCodeInput('');
    };

    return (
      <div className="flex flex-col h-full bg-background relative z-50 animate-in slide-in-from-right duration-300">
        <div className="flex items-center px-4 py-4 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <button 
            onClick={() => setCurrentView('main')} 
            className="p-2 -ml-2 text-textSecondary hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-white tracking-tight ml-2">Bind Email</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            
            {isEmailBound ? (
                // SUCCESS / BOUND STATE
                <div className="flex flex-col items-center justify-center h-[60%] animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                        <CheckCircle size={40} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Verified</h2>
                    <p className="text-textSecondary text-sm mb-8 font-mono">
                        {boundEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                    </p>
                    <button 
                        onClick={handleChangeEmail}
                        className="px-6 py-2 rounded-full border border-surfaceHighlight text-white text-sm font-medium hover:bg-white/5 transition-colors"
                    >
                        Change Email
                    </button>
                </div>
            ) : (
                // FORM STATE
                <div className="space-y-8">
                    <div className="text-sm text-textSecondary leading-relaxed">
                        Secure your account by linking a verified email address. This will be used for account recovery and security alerts.
                    </div>

                    <div className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 block ml-1">Email Address</label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    placeholder="example@mail.com"
                                    className="w-full bg-surface border border-surfaceHighlight rounded-xl p-4 text-white placeholder:text-textSecondary/30 focus:border-primary focus:bg-surfaceHighlight/50 outline-none transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary/50">
                                    <Mail size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Code Input */}
                        <div>
                            <label className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2 block ml-1">Verification Code</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={codeInput}
                                    onChange={(e) => setCodeInput(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    className="w-full bg-surface border border-surfaceHighlight rounded-xl p-4 pr-32 text-white placeholder:text-textSecondary/30 focus:border-primary focus:bg-surfaceHighlight/50 outline-none transition-all font-mono"
                                />
                                <button 
                                    onClick={handleGetCode}
                                    disabled={!emailInput || timer > 0}
                                    className={`absolute right-2 top-2 bottom-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                                        !emailInput || timer > 0 
                                            ? 'border-transparent text-textSecondary/50 cursor-not-allowed' 
                                            : 'border-primary/30 text-primary hover:bg-primary/10'
                                    }`}
                                >
                                    {timer > 0 ? `${timer}s` : 'Get Code'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleBind}
                        disabled={!isValid}
                        className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all ${
                            isValid 
                                ? 'bg-primary text-white hover:bg-primaryHover shadow-primary/20 active:scale-[0.98]' 
                                : 'bg-surfaceHighlight text-textSecondary cursor-not-allowed opacity-50'
                        }`}
                    >
                        Bind Email
                    </button>
                </div>
            )}
        </div>
      </div>
    );
  };

  // --- SUB-COMPONENT: WALLET HISTORY VIEW ---
  const TransactionHistoryView = () => {
    // Mock Transaction Data
    const transactions: TransactionDetail[] = [
      { id: '1', type: 'withdraw', amount: 500.00, currency: 'USDT', date: '2023-10-25 14:30:00', status: 'success', network: 'TRC20', address: 'TE2Y...9kXq', txId: 'a1b2...9999', fee: 1.00 },
      { id: '2', type: 'deposit', amount: 1000.00, currency: 'USDT', date: '2023-10-24 09:15:22', status: 'success', network: 'TRC20', address: 'TE2Y...9kXq', txId: 'c3d4...8888' },
      { id: '3', type: 'game_pnl', amount: 125.50, currency: 'USDT', date: '2023-10-23 21:45:00', status: 'success' },
      { id: '4', type: 'withdraw', amount: 200.00, currency: 'USDT', date: '2023-10-22 18:00:00', status: 'pending', network: 'ERC20', address: '0x12...3456', fee: 5.00 },
      { id: '5', type: 'game_pnl', amount: -50.00, currency: 'USDT', date: '2023-10-21 11:20:00', status: 'success' },
      { id: '6', type: 'deposit', amount: 500.00, currency: 'TON', date: '2023-10-20 10:10:10', status: 'failed', network: 'TON', address: 'EQD...j1s', txId: 'f5g6...7777' },
    ];

    const getIcon = (type: string) => {
        switch(type) {
            case 'deposit': return <ArrowDownLeft size={20} className="text-primary" />;
            case 'withdraw': return <ArrowUpRight size={20} className="text-white" />;
            case 'game_pnl': return <Gem size={20} className="text-blue-400" />;
            default: return <Clock size={20} className="text-textSecondary" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch(type) {
            case 'deposit': return 'Deposit';
            case 'withdraw': return 'Withdrawal';
            case 'game_pnl': return 'Game P&L';
            default: return 'Transaction';
        }
    };

    return (
        <div className="flex flex-col h-full bg-background relative z-50 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center px-4 py-4 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
                <button 
                  onClick={() => setCurrentView('wallet')} 
                  className="p-2 -ml-2 text-textSecondary hover:text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-white tracking-tight ml-2">History</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {transactions.map((tx) => (
                    <button 
                        key={tx.id}
                        onClick={() => { setSelectedTx(tx); setCurrentView('transaction_detail'); }}
                        className="w-full bg-surface border border-surfaceHighlight p-4 rounded-xl flex items-center justify-between hover:bg-surfaceHighlight/30 transition-colors active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-surfaceHighlight/50 border border-white/5`}>
                                {getIcon(tx.type)}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white">{getTypeLabel(tx.type)}</div>
                                <div className="text-[10px] text-textSecondary font-mono">{tx.date.split(' ')[0]}</div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className={`text-sm font-mono font-bold ${
                                 tx.amount > 0 ? 'text-primary' : tx.type === 'withdraw' ? 'text-white' : 'text-danger'
                             }`}>
                                 {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                             </div>
                             <div className="flex items-center justify-end gap-1">
                                {tx.status === 'pending' && <Clock size={10} className="text-yellow-500" />}
                                {tx.status === 'failed' && <XCircle size={10} className="text-danger" />}
                                <span className={`text-[10px] uppercase font-medium ${
                                    tx.status === 'success' ? 'text-textSecondary' : 
                                    tx.status === 'pending' ? 'text-yellow-500' : 'text-danger'
                                }`}>
                                    {tx.status}
                                </span>
                             </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
  };

  // --- SUB-COMPONENT: TRANSACTION DETAIL VIEW ---
  const TransactionDetailView = () => {
    if (!selectedTx) return null;

    const StatusIcon = () => {
        if (selectedTx.status === 'success') return <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4"><CheckCircle size={32} /></div>;
        if (selectedTx.status === 'pending') return <div className="w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mb-4 animate-pulse"><Clock size={32} /></div>;
        return <div className="w-16 h-16 rounded-full bg-danger/20 text-danger flex items-center justify-center mb-4"><XCircle size={32} /></div>;
    };

    const StatusLabel = () => {
        if (selectedTx.status === 'success') return 'Success';
        if (selectedTx.status === 'pending') return 'Processing';
        return 'Failed';
    };

    const getTypeLabel = (type: string) => {
        switch(type) {
            case 'deposit': return 'Deposit';
            case 'withdraw': return 'Withdrawal';
            case 'game_pnl': return 'Game P&L';
            default: return 'Transaction';
        }
    };

    return (
        <div className="flex flex-col h-full bg-background relative z-50 animate-in slide-in-from-right duration-300">
             {/* Header */}
             <div className="flex items-center px-4 py-4 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
                <button 
                  onClick={() => setCurrentView('history')} 
                  className="p-2 -ml-2 text-textSecondary hover:text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-bold text-white tracking-tight ml-2">Transaction Details</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                
                {/* Status Hero */}
                <div className="flex flex-col items-center py-6">
                    <StatusIcon />
                    <h2 className="text-lg font-bold text-white mb-2">{StatusLabel()}</h2>
                    <div className={`text-3xl font-mono font-bold tracking-tight mb-8 ${
                        selectedTx.type === 'withdraw' || selectedTx.amount < 0 ? 'text-white' : 'text-primary'
                    }`}>
                        {selectedTx.amount > 0 ? '+' : ''}{selectedTx.amount.toFixed(2)} <span className="text-sm text-textSecondary">{selectedTx.currency}</span>
                    </div>
                </div>

                {/* Details List */}
                <div className="bg-surface border border-surfaceHighlight rounded-2xl p-6 space-y-6 shadow-lg">
                    
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">Type</span>
                        <span className="text-sm font-bold text-white">{getTypeLabel(selectedTx.type)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">Time</span>
                        <span className="text-sm font-mono text-white">{selectedTx.date}</span>
                    </div>

                    <div className="w-full h-px bg-white/5"></div>

                    {selectedTx.network && (
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">Network</span>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{selectedTx.network}</span>
                        </div>
                    )}

                    {selectedTx.address && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">Address</span>
                            <div className="flex items-center justify-between bg-surfaceHighlight/30 p-3 rounded-xl border border-white/5">
                                <span className="text-xs font-mono text-textSecondary break-all pr-2">{selectedTx.address}</span>
                                <button className="text-textSecondary hover:text-white p-1">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedTx.txId && (
                         <div className="flex flex-col gap-2">
                            <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">TxID</span>
                            <div className="flex items-center justify-between bg-surfaceHighlight/30 p-3 rounded-xl border border-white/5">
                                <span className="text-xs font-mono text-textSecondary break-all pr-2">{selectedTx.txId}</span>
                                <div className="flex items-center gap-2">
                                    <button className="text-textSecondary hover:text-white p-1">
                                        <ExternalLink size={14} />
                                    </button>
                                    <button className="text-textSecondary hover:text-white p-1">
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTx.fee && (
                         <div className="flex justify-between items-center">
                            <span className="text-xs text-textSecondary font-bold uppercase tracking-wider">Network Fee</span>
                            <span className="text-sm font-mono text-textSecondary">{selectedTx.fee.toFixed(2)} {selectedTx.currency}</span>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="mt-8 text-center">
                    <button className="flex items-center justify-center gap-2 text-textSecondary hover:text-primary transition-colors text-sm font-medium w-full py-3">
                        <HelpCircle size={16} />
                        Contact Support about this order
                    </button>
                </div>
            </div>
        </div>
    );
  };

  // --- SUB-COMPONENT: WALLET DEPOSIT/WITHDRAW VIEW ---
  const WalletView = () => {
    // Initialise activeTab based on targetWalletTab set in the parent Account component
    const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(targetWalletTab);
    const [selectedChannel, setSelectedChannel] = useState<'ton' | 'crypto' | 'fiat'>('crypto');
    const [withdrawChannel, setWithdrawChannel] = useState<'to_wallet' | 'to_address' | 'to_fiat'>('to_address');
    
    return (
        <div className="flex flex-col h-full bg-background relative z-50 animate-in slide-in-from-right duration-300">
             {/* Header */}
             <div className="flex justify-between items-center px-4 py-4 border-b border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
                <button 
                  onClick={() => setCurrentView('main')} 
                  className="flex items-center text-textSecondary hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-bold text-white tracking-tight">My Wallet</h1>
                <button 
                  onClick={() => setCurrentView('history')}
                  className="text-textSecondary hover:text-white p-2"
                >
                    <History size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                
                {/* Balance Card - Header Container */}
                <div className="mx-4 mt-6 mb-5 bg-[#1A1B1E] rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-end relative z-10">
                        <div>
                            <div className="text-xs text-textSecondary uppercase tracking-widest mb-1.5 font-bold opacity-60">Main Balance</div>
                            <div className="text-3xl font-mono font-bold text-white tracking-tight">
                                42,500.00 <span className="text-sm text-primary">USDT</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-textSecondary uppercase tracking-widest mb-1 font-bold opacity-60">Bonus / Locked</div>
                            <div className="text-sm font-mono font-bold text-gold tracking-tight">
                                50.00 <span className="text-[10px]">USDT</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher Container */}
                <div className="mx-4 mb-[30px] bg-surfaceHighlight/30 p-1 rounded-full flex relative">
                    {/* Sliding Background */}
                    <motion.div 
                        className="absolute top-1 bottom-1 rounded-full bg-primary shadow-lg z-0"
                        initial={false}
                        animate={{ 
                            left: activeTab === 'deposit' ? '4px' : '50%',
                            width: 'calc(50% - 4px)',
                            backgroundColor: '#00C853' // Always green as per requested design
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    
                    <button 
                        onClick={() => setActiveTab('deposit')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full relative z-10 transition-colors ${activeTab === 'deposit' ? 'text-white' : 'text-textSecondary'}`}
                    >
                        <ArrowDownLeft size={18} strokeWidth={2.5} />
                        <span className="text-sm font-bold">Deposit</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('withdraw')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full relative z-10 transition-colors ${activeTab === 'withdraw' ? 'text-white' : 'text-textSecondary'}`}
                    >
                        <ArrowUpRight size={18} strokeWidth={2.5} />
                        <span className="text-sm font-bold">Withdraw</span>
                    </button>
                </div>

                {/* Content based on Active Tab */}
                {activeTab === 'deposit' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-4"
                    >
                        
                        {/* Options Container */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            <button
                                onClick={() => setSelectedChannel('ton')}
                                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                                    selectedChannel === 'ton' 
                                        ? 'bg-surfaceHighlight/60 border-primary shadow-[0_0_15px_rgba(0,200,83,0.15)]' 
                                        : 'bg-surface border-surfaceHighlight hover:bg-surfaceHighlight/30'
                                }`}
                            >
                                <Wallet size={24} className={selectedChannel === 'ton' ? 'text-primary' : 'text-textSecondary'} />
                                <span className={`text-[10px] font-bold ${selectedChannel === 'ton' ? 'text-white' : 'text-textSecondary'}`}>
                                    TON Wallet
                                </span>
                            </button>

                            <button
                                onClick={() => setSelectedChannel('crypto')}
                                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                                    selectedChannel === 'crypto' 
                                        ? 'bg-surfaceHighlight/60 border-primary shadow-[0_0_15px_rgba(0,200,83,0.15)]' 
                                        : 'bg-surface border-surfaceHighlight hover:bg-surfaceHighlight/30'
                                }`}
                            >
                                <div className="flex -space-x-2">
                                    <div className="w-5 h-5 rounded-full bg-[#F7931A] flex items-center justify-center border border-surface text-[8px] text-white">₿</div>
                                    <div className="w-5 h-5 rounded-full bg-[#627EEA] flex items-center justify-center border border-surface text-[8px] text-white">Ξ</div>
                                    <div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center border border-surface text-[8px] text-white">T</div>
                                </div>
                                <span className={`text-[10px] font-bold ${selectedChannel === 'crypto' ? 'text-white' : 'text-textSecondary'}`}>
                                    Transfer Crypto
                                </span>
                            </button>

                            <button
                                onClick={() => setSelectedChannel('fiat')}
                                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                                    selectedChannel === 'fiat' 
                                        ? 'bg-surfaceHighlight/60 border-primary shadow-[0_0_15px_rgba(0,200,83,0.15)]' 
                                        : 'bg-surface border-surfaceHighlight hover:bg-surfaceHighlight/30'
                                }`}
                            >
                                <Banknote size={24} className={selectedChannel === 'fiat' ? 'text-primary' : 'text-textSecondary'} />
                                <span className={`text-[10px] font-bold ${selectedChannel === 'fiat' ? 'text-white' : 'text-textSecondary'}`}>
                                    Fiat Payment
                                </span>
                            </button>
                        </div>

                        {/* List Container - Token Grid */}
                        <div className="mb-5">
                            <div className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3 pl-1">
                                Select Token <span className="text-danger">*</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { symbol: 'USDT', name: 'Tether', color: 'bg-[#26A17B]' },
                                    { symbol: 'TON', name: 'Toncoin', color: 'bg-[#0098EA]' },
                                    { symbol: 'BTC', name: 'Bitcoin', color: 'bg-[#F7931A]' },
                                    { symbol: 'ETH', name: 'Ethereum', color: 'bg-[#627EEA]' },
                                    { symbol: 'SOL', name: 'Solana', color: 'bg-[#14F195]' },
                                    { symbol: 'TRX', name: 'Tron', color: 'bg-[#FF0013]' }
                                ].map((token) => (
                                    <button 
                                        key={token.symbol}
                                        className="bg-surfaceHighlight/20 border border-white/5 hover:bg-surfaceHighlight/40 rounded-xl p-3 flex flex-col items-center gap-2 group transition-all active:scale-95 shadow-sm"
                                    >
                                        <div className={`w-8 h-8 rounded-full ${token.color} text-white flex items-center justify-center text-[10px] font-bold shadow-lg`}>
                                            {token.symbol[0]}
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{token.symbol}</div>
                                            <div className="text-[9px] text-textSecondary opacity-70">{token.name}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Network Warning or Tip */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-3">
                            <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-200/80 leading-relaxed">
                                Ensure you select the correct network (TRC20, ERC20, TON) to avoid loss of funds. Deposits typically arrive within 2-5 minutes.
                            </p>
                        </div>

                    </motion.div>
                )}
                 
                 {/* Withdraw View */}
                 {activeTab === 'withdraw' && (
                     <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="px-4"
                     >
                         {/* Options Container for Withdraw */}
                         <div className="grid grid-cols-3 gap-3 mb-5">
                             {[
                                 { id: 'to_wallet', label: 'To Wallet', icon: Wallet },
                                 { id: 'to_address', label: 'To Crypto Address', icon: Link },
                                 { id: 'to_fiat', label: 'To Fiat', icon: Landmark }
                             ].map((c) => (
                                 <button
                                     key={c.id}
                                     onClick={() => setWithdrawChannel(c.id as any)}
                                     className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                                         withdrawChannel === c.id 
                                             ? 'bg-surfaceHighlight/60 border-primary shadow-[0_0_15px_rgba(0,200,83,0.15)]' 
                                             : 'bg-surface border-surfaceHighlight hover:bg-surfaceHighlight/30'
                                     }`}
                                 >
                                     <c.icon size={24} className={withdrawChannel === c.id ? 'text-primary' : 'text-textSecondary'} />
                                     <span className={`text-[10px] font-bold text-center leading-tight ${withdrawChannel === c.id ? 'text-white' : 'text-textSecondary'}`}>
                                         {c.label}
                                     </span>
                                 </button>
                             ))}
                         </div>

                         {/* List Container - Withdrawal Network Grid - Fixed Structure (3 Columns) */}
                         <div className="mb-5">
                             <div className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-3 pl-1">
                                 Select Withdrawal Network <span className="text-danger">*</span>
                             </div>
                             <div className="grid grid-cols-3 gap-3">
                                 {[
                                     { id: 'trc20', name: 'USDT', network: 'Tron', color: 'bg-[#26A17B]' },
                                     { id: 'erc20', name: 'USDT', network: 'ETH', color: 'bg-[#627EEA]' },
                                     { id: 'ton', name: 'TON', network: 'TON', color: 'bg-[#0098EA]' },
                                     { id: 'btc', name: 'BTC', network: 'BTC', color: 'bg-[#F7931A]' },
                                     { id: 'eth', name: 'ETH', network: 'ETH', color: 'bg-[#627EEA]' },
                                     { id: 'sol', name: 'SOL', network: 'SOL', color: 'bg-[#14F195]' },
                                 ].map((token) => (
                                     <button 
                                         key={token.id}
                                         className="bg-surfaceHighlight/20 border border-white/5 hover:bg-surfaceHighlight/40 rounded-xl p-3 flex flex-col items-center gap-2 group transition-all active:scale-95 shadow-sm"
                                     >
                                         <div className={`w-8 h-8 rounded-full ${token.color} text-white flex items-center justify-center text-[10px] font-bold shadow-lg`}>
                                             {token.name[0]}
                                         </div>
                                         <div className="text-center">
                                             <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{token.name}</div>
                                             <div className="text-[9px] text-textSecondary opacity-70">{token.network}</div>
                                         </div>
                                     </button>
                                 ))}
                             </div>
                         </div>
                         
                         {/* Info */}
                         <div className="bg-surfaceHighlight/30 border border-white/5 rounded-xl p-3 flex items-start gap-3">
                            <Lock size={16} className="text-textSecondary mt-0.5 shrink-0" />
                            <p className="text-xs text-textSecondary leading-relaxed">
                                Minimum withdrawal amount is 10.00 USDT. Network fees are deducted automatically.
                            </p>
                        </div>

                     </motion.div>
                 )}

            </div>

            {/* Footer Floating Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-max">
                <button className="flex items-center gap-2 bg-surfaceHighlight/80 backdrop-blur-md border border-white/10 pl-2 pr-4 py-2 rounded-full shadow-lg hover:bg-surfaceHighlight transition-colors">
                     <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center">
                         <HelpCircle size={14} className="text-white" />
                     </div>
                     <span className="text-xs font-medium text-white">Need Help? Chat with Support</span>
                </button>
            </div>

        </div>
    );
  };

  // Main Account View Rendering
  if (currentView === 'edit') return <EditProfileView />;
  if (currentView === 'email') return <BindEmailView />;
  if (currentView === 'wallet') return <WalletView />;
  if (currentView === 'history') return <TransactionHistoryView />;
  if (currentView === 'transaction_detail') return <TransactionDetailView />;

  return (
    <div className="flex flex-col h-full pt-8 pb-24 px-4 max-w-md mx-auto overflow-y-auto no-scrollbar">
      
      {/* Section 1: User Identity (Top) */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full p-1 bg-surface border border-surfaceHighlight shadow-2xl">
                <img 
                    src="https://picsum.photos/200/200" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                />
            </div>
            <button 
                onClick={() => setCurrentView('edit')}
                className="absolute bottom-0 right-0 p-2 bg-surfaceHighlight border border-surface rounded-full text-white hover:bg-primary hover:text-white transition-colors"
            >
                <Edit2 size={14} />
            </button>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">{nickname}</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-surfaceHighlight/50 rounded-full border border-white/5">
            <span className="text-xs text-textSecondary font-mono">UID:</span>
            <span className="text-xs text-white font-mono font-bold tracking-wider">8829104</span>
        </div>
        <p className="text-xs text-textSecondary mt-2 italic">"{bio}"</p>
      </div>

      {/* Section 2: Asset Card (Redesigned) */}
      <div className="w-full bg-[#1E1E24] border border-surfaceHighlight rounded-2xl p-5 mb-8 shadow-lg relative overflow-hidden flex flex-col">
         {/* Background Effect */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

         {/* Row 1: Balance Entry (Grid Layout) */}
         <button 
            onClick={() => setCurrentView('history')}
            className="relative z-10 w-full grid grid-cols-[auto_1fr_auto] items-center mb-6 group"
         >
            <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">My Assets</span>
            <div className="flex items-center justify-center gap-1.5">
                 <span className="text-2xl font-mono font-bold text-white tracking-tight">42,500.00</span>
                 <span className="text-xs font-bold text-textSecondary pt-1">USDT</span>
            </div>
            <div className="p-1 rounded-full bg-surfaceHighlight/50 group-hover:bg-primary group-hover:text-white transition-colors text-textSecondary">
                <ChevronRight size={16} />
            </div>
         </button>

         {/* Row 2: Actions (Side-by-Side) */}
         <div className="flex gap-3 relative z-10 w-full">
             <button 
                onClick={() => {
                    setTargetWalletTab('deposit');
                    setCurrentView('wallet');
                }}
                className="flex-1 bg-primary hover:bg-primaryHover text-white font-bold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(0,200,83,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
             >
                <ArrowDownLeft size={18} />
                <span className="text-sm">Deposit</span>
             </button>
             <button 
                onClick={() => {
                    setTargetWalletTab('withdraw');
                    setCurrentView('wallet');
                }}
                className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
             >
                <ArrowUpRight size={18} />
                <span className="text-sm">Withdraw</span>
             </button>
         </div>
      </div>

      {/* Section 3: Menu List */}
      <div className="space-y-6">
        
        {/* Main List */}
        <div className="space-y-1">
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider ml-2 mb-2">General</h3>
            
            {/* Hand History (New) */}
            <button 
                onClick={() => setCurrentView('history')}
                className="w-full flex items-center justify-between bg-surface p-4 rounded-xl border border-surfaceHighlight active:bg-surfaceHighlight/50 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-surfaceHighlight/50 rounded-lg text-white group-hover:text-primary transition-colors">
                        <FileText size={18} />
                    </div>
                    <span className="text-sm font-medium text-white">Hand History</span>
                </div>
                <ChevronRight size={16} className="text-textSecondary" />
            </button>

            {/* Language */}
            <button className="w-full flex items-center justify-between bg-surface p-4 rounded-xl border border-surfaceHighlight active:bg-surfaceHighlight/50 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-surfaceHighlight/50 rounded-lg text-white group-hover:text-primary transition-colors">
                        <Globe size={18} />
                    </div>
                    <span className="text-sm font-medium text-white">Language</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-lg">🇺🇸</span>
                    <ChevronRight size={16} className="text-textSecondary" />
                </div>
            </button>
        </div>

        {/* Preferences */}
        <div className="space-y-1">
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider ml-2 mb-2">Preferences</h3>

            {/* Sound */}
            <div className="w-full flex items-center justify-between bg-surface p-4 rounded-xl border border-surfaceHighlight">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-surfaceHighlight/50 rounded-lg text-white">
                        <Volume2 size={18} />
                    </div>
                    <span className="text-sm font-medium text-white">Sound Effects</span>
                </div>
                <Toggle checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
            </div>

            {/* Vibration */}
            <div className="w-full flex items-center justify-between bg-surface p-4 rounded-xl border border-surfaceHighlight">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-surfaceHighlight/50 rounded-lg text-white">
                        <Smartphone size={18} />
                    </div>
                    <span className="text-sm font-medium text-white">Haptic Feedback</span>
                </div>
                <Toggle checked={vibrationEnabled} onChange={() => setVibrationEnabled(!vibrationEnabled)} />
            </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-1">
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider ml-2 mb-2">Table Theme</h3>
            <div className="grid grid-cols-3 gap-3">
                {[
                    { id: 'classic', label: 'Classic', color: 'bg-green-900' },
                    { id: 'dark', label: 'Matte', color: 'bg-[#121212]' },
                    { id: 'cyber', label: 'Cyber', color: 'bg-blue-900' }
                ].map((t) => (
                    <button 
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={`p-3 rounded-xl border transition-all ${
                            theme === t.id 
                                ? 'bg-surfaceHighlight border-primary' 
                                : 'bg-surface border-surfaceHighlight'
                        }`}
                    >
                        <div className={`w-full h-8 ${t.color} rounded mb-2 border border-white/10 shadow-inner`}></div>
                        <div className={`text-xs font-medium text-center ${
                            theme === t.id ? 'text-primary' : 'text-textSecondary'
                        }`}>
                            {t.label}
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Security */}
        <div className="space-y-1">
            <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider ml-2 mb-2">Security</h3>
            
            <button 
                onClick={() => setCurrentView('email')}
                className="w-full flex items-center justify-between bg-surface p-4 rounded-xl border border-surfaceHighlight active:bg-surfaceHighlight/50 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isEmailBound ? 'bg-primary/20 text-primary' : 'bg-surfaceHighlight/50 text-textSecondary group-hover:text-primary'}`}>
                        <Mail size={18} />
                    </div>
                    <span className="text-sm font-medium text-white">Bind Email</span>
                </div>
                <div className="flex items-center gap-2">
                    {isEmailBound ? (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                             Verified <CheckCircle size={10} />
                        </span>
                    ) : (
                        <span className="text-xs text-danger bg-danger/10 px-2 py-0.5 rounded">Unbound</span>
                    )}
                    <ChevronRight size={16} className="text-textSecondary" />
                </div>
            </button>

            <button className="w-full flex items-center justify-between bg-surface p-4 rounded-xl border border-surfaceHighlight active:bg-surfaceHighlight/50 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-surfaceHighlight/50 rounded-lg text-textSecondary group-hover:text-primary transition-colors">
                        <Lock size={18} />
                    </div>
                    <span className="text-sm font-medium text-white">Change Password</span>
                </div>
                <ChevronRight size={16} className="text-textSecondary" />
            </button>
        </div>

        {/* Footer */}
        <div className="pt-6 pb-2 text-center">
            <button className="flex items-center justify-center gap-2 text-danger hover:text-red-400 font-medium text-sm w-full py-3 rounded-xl hover:bg-danger/5 transition-colors mb-4">
                <LogOut size={18} />
                Log Out
            </button>
            <div className="text-[10px] text-textSecondary opacity-50 font-mono">
                v1.2.0 (Build 4829)
            </div>
        </div>

      </div>
    </div>
  );
};

export default Account;
