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
    if (value === 'Green') return 'bg-[#00b977] text-white';
    if (value === 'Red') return 'bg-[#fe3838] text-white';
    if (value === 'Violet') return 'bg-[#9c27b0] text-white';
    if (value === 'Big') return 'bg-[#f59e0b] text-white';
    if (value === 'Small') return 'bg-[#3b82f6] text-white';
    return 'bg-slate-900 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl border-t border-slate-200 p-5 shadow-2xl transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${getOptionBadgeColor()}`}>
              {value}
            </span>
            <div className="text-sm font-bold text-slate-900">
              Select {category} • <span className="text-emerald-700 font-mono font-bold">{multiplier}x</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stake Selector */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-600">Select Stake (₹)</label>
          <div className="grid grid-cols-6 gap-1.5 mt-2">
            {stakeOptions.map((stk) => (
              <button
                key={stk}
                onClick={() => {
                  sound.playTap();
                  setBaseStake(stk);
                }}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  baseStake === stk
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
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
            <label className="text-xs font-semibold text-slate-600">Multiplier (Qty)</label>
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => {
                  sound.playTap();
                  setMultiplierQty((prev) => Math.max(1, prev - 1));
                }}
                className="w-7 h-7 rounded bg-white shadow-xs flex items-center justify-center text-slate-700 active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-slate-900 font-mono">
                {multiplierQty}
              </span>
              <button
                onClick={() => {
                  sound.playTap();
                  setMultiplierQty((prev) => prev + 1);
                }}
                className="w-7 h-7 rounded bg-white shadow-xs flex items-center justify-center text-slate-700 active:scale-95"
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
                className={`py-1 text-[11px] font-bold rounded-lg border transition-all ${
                  multiplierQty === qty
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                X{qty}
              </button>
            ))}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-0 w-3.5 h-3.5"
          />
          <label htmlFor="agree" className="cursor-pointer">
            I agree to the <span className="text-emerald-700 font-medium underline">Game Rules</span>
          </label>
        </div>

        {/* Freeze Alert if applicable */}
        {isFrozen && (
          <div className="mt-3 p-2 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Round is locked for the final 5s calculation.</span>
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Bet</span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {formatINR(totalAmount)}
            </div>
            <div className="text-[10px] text-slate-500">
              Balance: <span className="text-slate-800 font-semibold">{formatINR(user.balance)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs active:scale-95"
            >
              Cancel
            </button>
            <button
              disabled={isFrozen || !canAfford || !agreed}
              onClick={handleConfirm}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
                isFrozen || !canAfford || !agreed
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              Confirm Bet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
