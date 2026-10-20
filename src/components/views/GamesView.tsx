import React from 'react';
import { useGame } from '../../context/GameContext';
import { GameType } from '../../types';
import { WinGo } from '../games/WinGo';
import { TRXWinGo } from '../games/TRXWinGo';
import { K3Lotre } from '../games/K3Lotre';
import { FiveDLotre } from '../games/FiveDLotre';
import { Mines } from '../games/Mines';
import { sound } from '../../utils/audio';

export const GamesView: React.FC = () => {
  const { activeGame, setActiveGame } = useGame();

  const gamesList: Array<{ id: GameType; name: string; icon: string; badge?: string }> = [
    { id: 'wingo', name: 'Win Go', icon: '🎨', badge: 'HOT' },
    { id: 'trx', name: 'TRX Hash', icon: '⚡', badge: 'VERIFIED' },
    { id: 'k3', name: 'K3 Lotre', icon: '🎲', badge: '207X' },
    { id: '5d', name: '5D Matrix', icon: '🎱' },
    { id: 'mines', name: 'Mines', icon: '💎', badge: 'CASHOUT' },
  ];

  const handleSelectGame = (game: GameType) => {
    sound.playTap();
    setActiveGame(game);
  };

  return (
    <div className="space-y-3">
      {/* Horizontal Game Switcher Tab */}
      <div className="flex gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
        {gamesList.map((g) => {
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleSelectGame(g.id)}
              className={`flex-shrink-0 py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all relative ${
                isActive
                  ? 'gradient-gold text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs'
              }`}
            >
              <span className="text-sm">{g.icon}</span>
              <span className="text-xs whitespace-nowrap">{g.name}</span>
              {g.badge && (
                <span className={`text-[8px] font-black px-1 rounded-full uppercase tracking-tighter ${
                  isActive ? 'bg-slate-950 text-amber-300' : 'bg-red-500 text-white'
                }`}>
                  {g.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active Game */}
      {activeGame === 'wingo' && <WinGo />}
      {activeGame === 'trx' && <TRXWinGo />}
      {activeGame === 'k3' && <K3Lotre />}
      {activeGame === '5d' && <FiveDLotre />}
      {activeGame === 'mines' && <Mines />}
    </div>
  );
};
