import React, { useState } from 'react';
import { Timer, CircleDot } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BetModal } from '../modals/BetModal';
import { LiveOpenBets } from '../LiveOpenBets';
import { sound } from '../../utils/audio';

export const FiveDLotre: React.FC = () => {
  const { countdown, currentPeriod, isFrozen, fiveDHistory, bets } = useGame();

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
      <div className="p-3 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 rounded-2xl border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black">
            <CircleDot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white">5D LOTRE MATRIX</span>
              <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 rounded font-bold">
                5-BALL LOTTERY
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Position & Matrix Sum Betting</p>
          </div>
        </div>
      </div>

      {/* 5-Ball Display & Timer */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Period</span>
            <div className="text-base font-black text-white font-mono">
              5D{currentPeriod.slice(-8)}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-slate-400 text-xs font-bold uppercase">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>Time Left</span>
            </div>
            <span className={`font-mono text-2xl font-black px-2 py-0.5 rounded-lg border mt-0.5 inline-block ${
              isFrozen
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-amber-400'
            }`}>
              00:{String(countdown).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* 5 Balls Container */}
        <div className="mt-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
          <div className="grid grid-cols-5 gap-2">
            {latest5D.balls.map((b, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 mb-1">
                  Ball {ballColumns[i]}
                </span>
                <div className={`w-11 h-11 rounded-full gradient-gold flex items-center justify-center font-mono font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20 border-2 border-amber-300 ${
                  isFrozen ? 'animate-spin-slow' : ''
                }`}>
                  {b}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-3 text-xs font-mono">
            <span className="text-slate-300">
              Total Sum: <strong className="text-amber-400">{latest5D.sum}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 uppercase font-bold text-[10px]">
              {latest5D.size} • {latest5D.parity}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Live / Open Bets Banner */}
      <LiveOpenBets gameFilter="5d" />

      {/* Column Target Selector */}
      <div className="flex gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
        {(['SUM', 'A', 'B', 'C', 'D', 'E'] as const).map((col) => (
          <button
            key={col}
            onClick={() => {
              sound.playTap();
              setSelectedColumn(col);
            }}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all ${
              selectedColumn === col
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {col === 'SUM' ? 'Total Sum' : `Ball ${col}`}
          </button>
        ))}
      </div>

      {/* Betting Options */}
      {selectedColumn === 'SUM' ? (
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 block">Total Sum 5D Bets (0–45)</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet('Total Size', 'Big', 1.96)}
              className="py-3 rounded-xl gradient-gold text-slate-950 font-black text-xs uppercase active:scale-95 flex items-center justify-center gap-2"
            >
              <span>BIG (23–45)</span>
              <span className="font-mono">1.96x</span>
            </button>

            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet('Total Size', 'Small', 1.96)}
              className="py-3 rounded-xl bg-sky-500 text-white font-black text-xs uppercase active:scale-95 flex items-center justify-center gap-2"
            >
              <span>SMALL (0–22)</span>
              <span className="font-mono">1.96x</span>
            </button>

            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet('Total Parity', 'Odd', 1.96)}
              className="py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase active:scale-95 flex items-center justify-center gap-2"
            >
              <span>ODD</span>
              <span className="font-mono">1.96x</span>
            </button>

            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet('Total Parity', 'Even', 1.96)}
              className="py-3 rounded-xl bg-purple-600 text-white font-black text-xs uppercase active:scale-95 flex items-center justify-center gap-2"
            >
              <span>EVEN</span>
              <span className="font-mono">1.96x</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Predict Single Digit on Ball {selectedColumn}
            </span>
            <span className="text-[11px] text-amber-400 font-bold font-mono">9.0x Payout</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                disabled={isFrozen}
                onClick={() => handleOpenBet(`Ball ${selectedColumn}`, num, 9)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-white font-mono font-black text-base"
              >
                {num}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet(`Ball ${selectedColumn} Size`, 'Big', 1.96)}
              className="py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs"
            >
              Big (5–9) • 1.96x
            </button>
            <button
              disabled={isFrozen}
              onClick={() => handleOpenBet(`Ball ${selectedColumn} Size`, 'Small', 1.96)}
              className="py-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold text-xs"
            >
              Small (0–4) • 1.96x
            </button>
          </div>
        </div>
      )}

      {/* History Ledger */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-3 py-2 px-3 bg-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
          <span>Period</span>
          <span>5D Balls (A–E)</span>
          <span>Sum Total</span>
        </div>
        <div className="divide-y divide-slate-800/60 max-h-52 overflow-y-auto">
          {fiveDHistory.map((rec) => (
            <div key={rec.period} className="grid grid-cols-3 py-2 px-3 text-xs text-center items-center">
              <span className="font-mono text-slate-400 text-[11px]">{rec.period.slice(-5)}</span>
              <span className="font-mono font-black text-white text-sm tracking-widest">
                {rec.balls.join(' ')}
              </span>
              <span className="font-mono font-bold text-amber-400">
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
