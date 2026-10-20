import React from 'react';
import { Home, Gamepad2, Gift, Wallet, User } from 'lucide-react';
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
    { id: 'games' as NavTab, label: 'Play Games', icon: Gamepad2, badge: 'HOT' },
    { id: 'promotion' as NavTab, label: 'Invite & Earn', icon: Gift },
    { id: 'wallet' as NavTab, label: 'Wallet', icon: Wallet },
    { id: 'account' as NavTab, label: 'My Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-1.5 px-2 shadow-lg">
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
                  ? 'text-emerald-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Badge */}
              {item.badge && (
                <span className="absolute -top-1 right-2 text-[8px] font-black px-1 rounded-full uppercase bg-red-500 text-white">
                  {item.badge}
                </span>
              )}

              {/* Icon */}
              <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight mt-0.5 ${
                isActive ? 'font-bold text-emerald-600' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
