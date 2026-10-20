import React, { useState } from 'react';
import { Timer, CircleDot } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BetModal } from '../modals/BetModal';
import { LiveOpenBets } from '../LiveOpenBets';
import { sound } from '../../utils/audio';

export const FiveDLotre: React.FC = () => {
  const { countdown, currentPeriod, isFrozen, fiveDHistory } = useGame();

  const [selectedColumn, setSelectedColumn] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'SUM'>('SUM');
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [betConfig, setBetConfig] = useState<{
    category: string;
    value: string | number;
    multiplier: number;
  }>({
    category: 'Total Size',
    value: 'Big',
    multiplier: 1.96,
  });

  const latest5D = fiveDHistory[0] || {
    balls: [7, 2, 9, 0, 4],
    sum: 22,
    size: 'small',
    parity: 'even',
  };

  const handleOpenBet = (category: string, value: string | number, multiplier: number) => {
    sound.playTap();
    setBetConfig({ category, value, multiplier });
    setBetModalOpen(true);
  };

  const ballColumns = ['A', 'B', 'C', 'D', 'E'] as const;

  return (
    <div className="space-y-3 pb-24">
      {/* Header Banner */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <CircleDot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900">5D LOTRE MATRIX</span>
              <span className="text-[9px] bg-blue-100 text-blue-800 border border-blue-200 px-1 rounded font-bold">
                5-DIGIT DRAW
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Pick single balls or total sum from 0 to 45</p>
          </div>
        </div>
      </div>

      {/* 5-Ball Display & Timer */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Period</span>
            <div className="text-base font-black text-slate-900 font-mono">
              5D{currentPeriod.slice(-8)}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-slate-500 text-xs font-bold uppercase">
              <Timer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Time Left</span>
            </div>
            <span className={`font-mono text-2xl font-black px-2.5 py-0.5 rounded-lg border mt-0.5 inline-block ${
              isFrozen
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}>
              00:{String(countdown).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* 5 Balls Container */}
        <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
          <div className="grid grid-cols-5 gap-2">
            {latest5D.balls.map((b, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-500 mb-1">
                  Ball {ballColumns[i]}
                </span>
                <div className={`w-11 h-11 rounded-full bg-white flex items-center justify-center font-mono font-black text-slate-900 text-xl shadow-sm border-2 border-slate-300 ${
                  isFrozen ? 'animate-spin-slow' : ''
                }`}>
                  {b}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-center gap-3 text-xs font-mono">
            <span className="text-slate-600">
              Total Sum: <strong className="text-slate-900">{latest5D.sum}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 uppercase font-bold text-[10px]">
              {latest5D.size} • {latest5D.parity}
            </span>
          </div>
        </div>
      </div>

      {/* Live Open Bets Banner */}
      <LiveOpenBets gameFilter="5d" />

      {/* Column Target Selector */}
      <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
        {(['SUM', 'A', 'B', 'C', 'D', 'E'] as const).map((col) => (
          <button
            key={col}
            onClick={() => {
              sound.playTap();
              setSelectedColumn(col);
            }}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all ${
              selectedColumn === col
                ? 'bg-slate-900 text-white font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {col === 'SUM' ? 'Total Sum' : `Ball ${col}`}
          </button>
        ))}
      </div>

      {/* Betting Options */}
      {selectedColumn === 'SUM' ? (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
          <span className="text-xs font-bold text-slate-700 block">Total Sum 5D Bets (0–45)</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet('Total Size', 'Big', 1.96)}
              className="py-3 rounded-xl bg-[#f59e0b] text-white font-black text-xs uppercase active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>BIG (23–45)</span>
              <span className="font-mono">1.96x</span>
            </button>

            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet('Total Size', 'Small', 1.96)}
              className="py-3 rounded-xl bg-[#3b82f6] text-white font-black text-xs uppercase active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>SMALL (0–22)</span>
              <span className="font-mono">1.96x</span>
            </button>

            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet('Total Parity', 'Odd', 1.96)}
              className="py-3 rounded-xl bg-[#00b977] text-white font-black text-xs uppercase active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>ODD</span>
              <span className="font-mono">1.96x</span>
            </button>

            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet('Total Parity', 'Even', 1.96)}
              className="py-3 rounded-xl bg-[#9c27b0] text-white font-black text-xs uppercase active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>EVEN</span>
              <span className="font-mono">1.96x</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Predict Single Digit on Ball {selectedColumn}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              9.0x Payout
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                disabled={isFrozen}
                onClick={() => handleOpenBet(`Ball ${selectedColumn}`, num, 9)}
                className="py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 text-slate-900 font-mono font-black text-base"
              >
                {num}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet(`Ball ${selectedColumn} Size`, 'Big', 1.96)}
              className="py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs"
            >
              Big (5–9) • 1.96x
            </button>
            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet(`Ball ${selectedColumn} Size`, 'Small', 1.96)}
              className="py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs"
            >
              Small (0–4) • 1.96x
            </button>
          </div>
        </div>
      )}

      {/* History Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-3 py-2 px-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
          <span>Period</span>
          <span>5D Balls (A–E)</span>
          <span>Sum Total</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto">
          {fiveDHistory.map((rec) => (
            <div key={rec.period} className="grid grid-cols-3 py-2 px-3 text-xs text-center items-center">
              <span className="font-mono text-slate-600 text-[11px]">{rec.period.slice(-5)}</span>
              <span className="font-mono font-black text-slate-900 text-sm tracking-widest">
                {rec.balls.join(' ')}
              </span>
              <span className="font-mono font-bold text-slate-800">
                {rec.sum} ({rec.size})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bet Modal */}
      <BetModal
        isOpen={betModalOpen}
        onClose={() => setBetModalOpen(false)}
        game="5d"
        category={betConfig.category}
        value={betConfig.value}
        multiplier={betConfig.multiplier}
      />
    </div>
  );
};
