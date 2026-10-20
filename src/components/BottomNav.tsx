import React from 'react';
import { Home, Gamepad2, Users, Wallet, User } from 'lucide-react';
import { NavTab } from '../types';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useGame();

  const handleTabChange = (tab: NavTab) => {
    sound.playTap();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'games' as NavTab, label: 'Games', icon: Gamepad2, badge: 'HOT' },
    { id: 'promotion' as NavTab, label: 'Promotion', icon: Users, badge: 'Agent' },
    { id: 'wallet' as NavTab, label: 'Wallet', icon: Wallet },
    { id: 'account' as NavTab, label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-lg border-t border-slate-800/90 py-1.5 px-3">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Badge */}
              {item.badge && (
                <span className={`absolute -top-1 right-2 text-[8px] font-black px-1 rounded-full uppercase tracking-tighter ${
                  item.badge === 'HOT' 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-amber-500 text-slate-950'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Icon Container */}
              <div className={`p-1 rounded-lg transition-colors ${
                isActive ? 'bg-amber-400/10' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight mt-0.5 ${
                isActive ? 'font-bold text-amber-400' : 'font-medium'
              }`}>
                {item.label}
              </span>

              {/* Active Dot Indicator */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5 shadow-sm shadow-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
