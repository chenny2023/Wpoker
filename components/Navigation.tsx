import React from 'react';
import { Tab } from '../types';
import { Home, PlusCircle, Trophy, User } from './ui/Icons';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: Tab.Lobby, label: 'Lobby', icon: Home },
    { id: Tab.Create, label: 'Create', icon: PlusCircle, highlight: true },
    { id: Tab.Events, label: 'Activity', icon: Trophy },
    { id: Tab.Account, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-surfaceHighlight px-6 pb-6 pt-3 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`group flex flex-col items-center gap-1 transition-all duration-200 relative -top-3`}
              >
                <div className={`p-3 rounded-full shadow-lg transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-glow-green scale-110' 
                    : 'bg-surfaceHighlight border border-white/10 text-textSecondary hover:text-white'
                }`}>
                  <Icon size={26} strokeWidth={2.5} />
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-primary' : 'text-textSecondary'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-textSecondary hover:text-white'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;