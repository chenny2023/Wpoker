
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Lobby from './components/Lobby';
import CreateRoom from './components/CreateRoom';
import Events from './components/Events';
import Account, { ViewState } from './components/Account';
import GameTable from './components/GameTable';
import SessionResult from './components/SessionResult';
import SplashScreen from './components/SplashScreen';
import { Tab } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Lobby);
  const [gameMode, setGameMode] = useState<'regular' | 'host'>('regular');
  
  // Navigation State for Deep Linking to Account
  const [accountParams, setAccountParams] = useState<{ view?: ViewState, walletTab?: 'deposit' | 'withdraw' }>({});

  const handleJoinTable = (tableId: string) => {
    setGameMode('regular');
    setActiveTab(Tab.Game);
  };

  const handleCreateRoom = () => {
    setGameMode('host');
    setActiveTab(Tab.Game);
  };

  const handleLeaveTable = () => {
    // Navigate to Session Settlement instead of Lobby immediately
    setActiveTab(Tab.SessionResult);
  };

  const handleCloseSession = () => {
    setActiveTab(Tab.Lobby);
  };
  
  const handleWalletAction = (action: 'deposit' | 'withdraw' | 'view') => {
      setAccountParams({ 
          view: 'wallet', 
          walletTab: action === 'view' ? 'deposit' : action 
      });
      setActiveTab(Tab.Account);
  };

  const handleGoToProfile = () => {
      setAccountParams({ view: 'main' });
      setActiveTab(Tab.Account);
  };

  // Reset account params when changing tabs via navigation (optional, but cleaner)
  const handleTabChange = (tab: Tab) => {
      if (tab !== Tab.Account) {
          setAccountParams({});
      }
      setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Lobby:
        return <Lobby onJoinTable={handleJoinTable} onWalletAction={handleWalletAction} onGoToProfile={handleGoToProfile} />;
      case Tab.Create:
        return <CreateRoom onCreate={handleCreateRoom} />;
      case Tab.Events:
        return <Events />;
      case Tab.Account:
        return <Account key={`account-${accountParams.view}-${accountParams.walletTab}`} initialView={accountParams.view} initialWalletTab={accountParams.walletTab} />;
      case Tab.Game:
        return <GameTable mode={gameMode} onLeave={handleLeaveTable} />;
      case Tab.SessionResult:
        return <SessionResult onClose={handleCloseSession} />;
      default:
        return <Lobby onJoinTable={handleJoinTable} onWalletAction={handleWalletAction} onGoToProfile={handleGoToProfile} />;
    }
  };

  // Render Splash Screen
  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-background text-white font-sans antialiased overflow-hidden selection:bg-primary/30"
    >
        <main className="flex-1 overflow-hidden relative">
            {renderContent()}
        </main>
        {/* Hide Navigation when in Game or Session Result mode */}
        {activeTab !== Tab.Game && activeTab !== Tab.SessionResult && (
          <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        )}
    </motion.div>
  );
};

export default App;
