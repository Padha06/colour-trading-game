import React from 'react';
import { Trophy, ChevronRight, Play } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameType } from '../../types';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const HomeView: React.FC = () => {
  const { setActiveTab, setActiveGame } = useGame();

  const handleLaunchGame = (game: GameType) => {
    sound.playTap();
    setActiveGame(game);
    setActiveTab('games');
  };

  const games = [
    {
      id: 'wingo' as GameType,
      title: 'Win Go',
      subtitle: 'Green, Violet, Red & Number Prediction',
      badge: 'MOST POPULAR',
      badgeColor: 'bg-red-500 text-white',
      icon: '🎨',
      players: '14,820 Playing',
    },
    {
      id: 'trx' as GameType,
      title: 'TRX Win Go',
      subtitle: 'Tron Blockchain Public Hash Results',
      badge: 'VERIFIED FAIR',
      badgeColor: 'bg-emerald-600 text-white',
      icon: '⚡',
      players: '8,210 Playing',
    },
    {
      id: 'k3' as GameType,
      title: 'K3 Dice (Sic Bo)',
      subtitle: '3-Dice Roll with Multipliers up to 207x',
      badge: 'HIGH ODDS',
      badgeColor: 'bg-amber-500 text-white',
      icon: '🎲',
      players: '6,450 Playing',
    },
    {
      id: '5d' as GameType,
      title: '5D Matrix Lottery',
      subtitle: '5-Ball Combination & Sum Betting',
      badge: 'LOTTERY',
      badgeColor: 'bg-blue-600 text-white',
      icon: '🎱',
      players: '4,190 Playing',
    },
    {
      id: 'mines' as GameType,
      title: 'Mines Game',
      subtitle: 'Find Stars & Cash Out Anytime',
      badge: 'NEW',
      badgeColor: 'bg-purple-600 text-white',
      icon: '💎',
      players: '11,340 Playing',
    },
  ];

  const recentWinners = [
    { user: 'User 98***31', amount: 28400, game: 'Win Go' },
    { user: 'User 70***82', amount: 96000, game: 'K3 Triple' },
    { user: 'User 89***14', amount: 14250, game: 'Mines' },
    { user: 'User 91***09', amount: 35000, game: 'TRX Hash' },
  ];

  return (
    <div className="space-y-3.5 pb-24">
      {/* Simple Indian Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white shadow-sm space-y-2">
        <div className="inline-block bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
          India's Trusted Prediction Hub
        </div>

        <h2 className="text-xl font-black leading-snug">
          Predict Colors & Numbers <br />
          Instant UPI Withdrawals
        </h2>

        <p className="text-xs text-emerald-100 font-medium">
          Fast 30-second rounds. Play responsibly with demo credits.
        </p>

        <div className="pt-1">
          <button
            onClick={() => handleLaunchGame('wingo')}
            className="py-2 px-4 rounded-xl bg-white text-emerald-800 font-extrabold text-xs uppercase shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-800" />
            Play Win Go Now
          </button>
        </div>
      </div>

      {/* Live Winners Strip (Clean) */}
      <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-hidden text-xs">
        <div className="flex items-center gap-1 text-amber-600 font-extrabold flex-shrink-0">
          <Trophy className="w-4 h-4" />
          <span>Winners:</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar text-slate-700">
          {recentWinners.map((w, i) => (
            <span key={i} className="inline-flex items-center gap-1 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">{w.user}</span>
              <span className="text-emerald-600 font-bold font-mono">+{formatINR(w.amount)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 5 Core Games List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-extrabold text-sm text-slate-900">Choose a Game</h3>
          <span className="text-xs text-slate-500">5 Available</span>
        </div>

        <div className="space-y-2">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => handleLaunchGame(g.id)}
              className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-inner">
                  {g.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {g.title}
                    </h4>
                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase ${g.badgeColor}`}>
                      {g.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{g.subtitle}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">{g.players}</span>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Invite Promo Card */}
      <div 
        onClick={() => {
          sound.playTap();
          setActiveTab('promotion');
        }}
        className="p-3.5 bg-white rounded-2xl border border-emerald-200 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
            🎁
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">Invite Friends & Earn Real Commission</h4>
            <p className="text-[11px] text-slate-500">Get up to 1.0% turnover on every friend's bet</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};
