import React from 'react';
import { Volume2, VolumeX, Shield, Plus, Wallet, Zap, ListOrdered } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-3.5 py-2.5 shadow-sm">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-base shadow-sm">
            R
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
              RoyalWin
            </h1>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Colour Prediction</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* My Bets Button */}
          <button
            onClick={onOpenMyBets}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
              openBetsCount > 0
                ? 'bg-amber-50 border-amber-400 text-amber-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {openBetsCount > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{openBetsCount} Live</span>
              </>
            ) : (
              <>
                <ListOrdered className="w-3.5 h-3.5 text-slate-500" />
                <span>Bets</span>
              </>
            )}
          </button>

          {/* Wallet Balance Pill with Clean Recharge Button */}
          <div 
            onClick={onOpenDeposit}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200 rounded-full px-2.5 py-1"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-xs text-slate-800 font-mono">
              {formatINR(user.balance)}
            </span>
            <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Admin Demo Control Toggle */}
          <button
            onClick={onOpenAdmin}
            aria-label="Admin settings"
            className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
              adminSettings.mode !== 'fair'
                ? 'bg-amber-100 border-amber-400 text-amber-700 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
