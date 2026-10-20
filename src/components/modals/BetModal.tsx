import React, { useState } from 'react';
import { X, Minus, Plus, AlertCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';
import { GameType } from '../../types';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GameType;
  category: string;
  value: string | number;
  multiplier: number;
}

export const BetModal: React.FC<BetModalProps> = ({
  isOpen,
  onClose,
  game,
  category,
  value,
  multiplier,
}) => {
  const { user, currentPeriod, isFrozen, placeBet } = useGame();

  const [baseStake, setBaseStake] = useState<number>(10);
  const [multiplierQty, setMultiplierQty] = useState<number>(1);
  const [agreed, setAgreed] = useState<boolean>(true);

  if (!isOpen) return null;

  const totalAmount = baseStake * multiplierQty;
  const canAfford = user.balance >= totalAmount;

  const stakeOptions = [10, 50, 100, 500, 1000, 5000];
  const qtyPresets = [1, 5, 10, 20, 50, 100];

  const handleConfirm = () => {
    if (isFrozen) {
      alert('Round is frozen. Please wait for the next period.');
      return;
    }
    if (!canAfford) {
      alert('Insufficient balance. Please recharge.');
      return;
    }

    const success = placeBet({
      game,
      period: currentPeriod,
      betCategory: category,
      betValue: value,
      amount: totalAmount,
      multiplier,
    });

    if (success) {
      onClose();
    }
  };

  const getOptionBadgeColor = () => {
    if (value === 'Green') return 'bg-emerald-500 text-white';
    if (value === 'Red') return 'bg-rose-500 text-white';
    if (value === 'Violet') return 'bg-purple-600 text-white';
    if (value === 'Big') return 'bg-amber-500 text-slate-950';
    if (value === 'Small') return 'bg-sky-500 text-white';
    return 'bg-indigo-600 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#131d31] rounded-t-3xl border-t border-slate-700/80 p-5 shadow-2xl transition-transform animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${getOptionBadgeColor()}`}>
              {value}
            </span>
            <div className="text-sm font-bold text-slate-200">
              Select {category} • <span className="text-amber-400 font-mono">{multiplier}x</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stake Selector */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-400">Balance Stake (₹)</label>
          <div className="grid grid-cols-6 gap-1.5 mt-2">
            {stakeOptions.map((stk) => (
              <button
                key={stk}
                onClick={() => {
                  sound.playTap();
                  setBaseStake(stk);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  baseStake === stk
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ₹{stk}
              </button>
            ))}
          </div>
        </div>

        {/* Multiplier Quantity */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400">Multiplier (Qty)</label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => {
                  sound.playTap();
                  setMultiplierQty((prev) => Math.max(1, prev - 1));
                }}
                className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-300 active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-amber-300 font-mono">
                {multiplierQty}
              </span>
              <button
                onClick={() => {
                  sound.playTap();
                  setMultiplierQty((prev) => prev + 1);
                }}
                className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-300 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1.5 mt-2">
            {qtyPresets.map((qty) => (
              <button
                key={qty}
                onClick={() => {
                  sound.playTap();
                  setMultiplierQty(qty);
                }}
                className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                  multiplierQty === qty
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                X{qty}
              </button>
            ))}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="rounded border-slate-700 text-amber-500 focus:ring-0 w-3.5 h-3.5"
          />
          <label htmlFor="agree" className="cursor-pointer">
            I agree to the <span className="text-amber-400 underline">Presale Rules</span>
          </label>
        </div>

        {/* Freeze Alert if applicable */}
        {isFrozen && (
          <div className="mt-3 p-2 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>Round is locked for the final 5s calculation.</span>
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Bet</span>
            <div className="text-lg font-black text-amber-400 font-mono tracking-tight">
              {formatINR(totalAmount)}
            </div>
            <div className="text-[10px] text-slate-400">
              Balance: <span className="text-slate-200">{formatINR(user.balance)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs active:scale-95"
            >
              Cancel
            </button>
            <button
              disabled={isFrozen || !canAfford || !agreed}
              onClick={handleConfirm}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
                isFrozen || !canAfford || !agreed
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'gradient-gold text-slate-950 shadow-amber-500/30'
              }`}
            >
              Bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
