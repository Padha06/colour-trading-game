import React from 'react';
import { Volume2, VolumeX, Shield, Plus, Wallet, Sparkles, Zap, ListOrdered } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatINR } from '../utils/gameHelpers';

interface HeaderProps {
  onOpenDeposit: () => void;
  onOpenAdmin: () => void;
  onOpenMyBets: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDeposit, onOpenAdmin, onOpenMyBets }) => {
  const { user, soundEnabled, toggleSound, adminSettings, bets } = useGame();

  const openBetsCount = bets.filter((b) => b.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2.5">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                ROYALWIN
              </span>
              <span className="text-[10px] bg-red-600/90 text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium -mt-0.5">India's Premier Gaming</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5">
          {/* Live Bets Pill Button */}
          <button
            onClick={onOpenMyBets}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all active:scale-95 border ${
              openBetsCount > 0
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {openBetsCount > 0 ? (
              <>
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-mono">{openBetsCount} Live</span>
              </>
            ) : (
              <>
                <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
                <span>Bets</span>
              </>
            )}
          </button>

          {/* Wallet Balance Pill */}
          <div 
            onClick={onOpenDeposit}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700/80 active:scale-95 transition-all cursor-pointer border border-amber-500/30 rounded-full px-2 py-1"
          >
            <Wallet className="w-3 h-3 text-amber-400" />
            <span className="font-bold text-[11px] text-amber-300 tracking-tight font-mono">
              {formatINR(user.balance)}
            </span>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs ml-0.5">
              <Plus className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-90 transition-transform"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {/* Admin / Demo Risk Control */}
          <button
            onClick={onOpenAdmin}
            aria-label="Admin settings"
            className={`w-7 h-7 rounded-full border flex items-center justify-center active:scale-90 transition-transform relative ${
              adminSettings.mode !== 'fair'
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {adminSettings.mode !== 'fair' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
