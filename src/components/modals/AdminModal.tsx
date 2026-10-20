import React, { useState } from 'react';
import { X, ShieldAlert, FastForward, RotateCcw, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { AdminAlgoMode } from '../../types';
import { sound } from '../../utils/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    adminSettings,
    updateAdminSettings,
    forceNextResult,
    skipTimerToFiveSeconds,
    resetDemoBalance,
    deposit,
    countdown,
  } = useGame();

  const [selectedDigit, setSelectedDigit] = useState<number | null>(adminSettings.forcedResult);

  if (!isOpen) return null;

  const handleModeChange = (mode: AdminAlgoMode) => {
    sound.playTap();
    updateAdminSettings({ mode });
  };

  const handleDigitSelect = (d: number) => {
    sound.playTap();
    const next = selectedDigit === d ? null : d;
    setSelectedDigit(next);
    forceNextResult(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                Admin Control Demo
                <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                  FOR CLIENT DEMO
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Show backend outcome controls to your client</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Algorithm Modes */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Outcome Engine Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleModeChange('fair')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                adminSettings.mode === 'fair'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">1. Fair RNG Mode</span>
                {adminSettings.mode === 'fair' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Natural math probability with standard 2% house fee.</p>
            </button>

            <button
              onClick={() => handleModeChange('min_payout')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                adminSettings.mode === 'min_payout'
                  ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">2. Min-Payout Mode</span>
                {adminSettings.mode === 'min_payout' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Liability shield: picks digit that results in lowest house payout.</p>
            </button>
          </div>
        </div>

        {/* Force Result Grid */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              Force Winning Number (Manual Override)
            </label>
            {selectedDigit !== null && (
              <span className="text-[11px] text-amber-700 font-bold">
                Forced: #{selectedDigit}
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                onClick={() => handleDigitSelect(digit)}
                className={`py-2 rounded-lg font-mono font-bold text-xs border transition-all ${
                  selectedDigit === digit
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {digit}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Tap a number to force it on the next draw. Tap again to cancel.
          </p>
        </div>

        {/* Demo Fast-Forward & Wallet Controls */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Demo Shortcuts
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playTap();
                skipTimerToFiveSeconds();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold"
            >
              <FastForward className="w-3.5 h-3.5" />
              Skip to 5s ({countdown}s)
            </button>

            <button
              onClick={() => {
                sound.playTap();
                deposit(5000);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              +₹5,000 Demo
            </button>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              resetDemoBalance();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Balance to ₹10,000
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
        >
          Save & Return
        </button>
      </div>
    </div>
  );
};
