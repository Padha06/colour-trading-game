import React from 'react';
import { Sparkles, Trophy, Zap, Shield, Users, Flame, ChevronRight, Gift, Play } from 'lucide-react';
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
      title: 'Win Go 1Min',
      subtitle: 'Color & Number Prediction',
      badge: 'MOST POPULAR',
      badgeColor: 'bg-red-500 text-white',
      accent: 'border-emerald-500/30 bg-emerald-950/20',
      icon: '🎨',
      players: '14,820 Playing',
    },
    {
      id: 'trx' as GameType,
      title: 'TRX Win Go',
      subtitle: 'Tron Blockchain Verifiable',
      badge: 'PROVABLY FAIR',
      badgeColor: 'bg-red-600 text-white',
      accent: 'border-red-500/30 bg-red-950/20',
      icon: '⚡',
      players: '8,210 Playing',
    },
    {
      id: 'k3' as GameType,
      title: 'K3 Lotre',
      subtitle: 'Fast Sic Bo Dice • 207x Payout',
      badge: 'HIGH MULTIPLIER',
      badgeColor: 'bg-amber-500 text-slate-950',
      accent: 'border-amber-500/30 bg-amber-950/20',
      icon: '🎲',
      players: '6,450 Playing',
    },
    {
      id: '5d' as GameType,
      title: '5D Lotre',
      subtitle: '5-Digit Matrix Draws',
      badge: 'LOTTERY MATRIX',
      badgeColor: 'bg-blue-500 text-white',
      accent: 'border-blue-500/30 bg-blue-950/20',
      icon: '🎱',
      players: '4,190 Playing',
    },
    {
      id: 'mines' as GameType,
      title: 'Minesweeper',
      subtitle: 'Interactive Gem Cashout',
      badge: 'TRENDING',
      badgeColor: 'bg-emerald-500 text-slate-950',
      accent: 'border-emerald-500/30 bg-emerald-950/20',
      icon: '💎',
      players: '11,340 Playing',
    },
  ];

  const recentWinners = [
    { user: 'User 98***31', amount: 28400, game: 'Win Go 30s' },
    { user: 'User 70***82', amount: 96000, game: 'K3 Triple 444' },
    { user: 'User 89***14', amount: 14250, game: 'Mines 8.5x' },
    { user: 'User 91***09', amount: 35000, game: 'TRX Hash' },
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-5 shadow-2xl text-slate-950">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/20 text-slate-950 font-black text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Grand Diwali VIP Tournament</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight leading-tight text-slate-950">
            Predict & Win <br />
            <span className="text-white drop-shadow">Daily ₹50,00,000 Pool</span>
          </h2>

          <p className="text-xs font-semibold text-amber-100/90 max-w-[220px]">
            Lightning-fast 30s settlement with instant UPI & crypto withdrawals.
          </p>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => handleLaunchGame('wingo')}
              className="py-2.5 px-5 rounded-xl bg-slate-950 text-amber-400 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Play className="w-3.5 h-3.5 fill-amber-400" />
              Play Win Go Now
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />
        <div className="absolute top-2 right-4 text-6xl opacity-30 select-none">👑</div>
      </div>

      {/* Live Winners Marquee Ticker */}
      <div className="p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center gap-2.5 overflow-hidden">
        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs flex-shrink-0">
          <Trophy className="w-4 h-4" />
          <span>Live:</span>
        </div>
        <div className="flex gap-4 animate-marquee whitespace-nowrap text-xs text-slate-300">
          {recentWinners.map((w, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span className="text-slate-400">{w.user}</span>
              <span className="text-emerald-400 font-mono font-bold">+{formatINR(w.amount)}</span>
              <span className="text-[10px] text-amber-400/80 bg-slate-800 px-1 rounded">{w.game}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Core 5 Games List */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            <h3 className="font-extrabold text-sm text-slate-100">Featured Colour Games</h3>
          </div>
          <span className="text-[11px] text-slate-400">5 Available</span>
        </div>

        <div className="space-y-2.5">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => handleLaunchGame(g.id)}
              className={`p-3.5 rounded-2xl border ${g.accent} hover:border-amber-400/40 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98] shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                  {g.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {g.title}
                    </h4>
                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase ${g.badgeColor}`}>
                      {g.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{g.subtitle}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">{g.players}</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div 
        onClick={() => {
          sound.playTap();
          setActiveTab('promotion');
        }}
        className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-white">Become an Official Agent</span>
            <p className="text-[11px] text-slate-400">Earn up to 1.0% lifetime turnover commission</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};
