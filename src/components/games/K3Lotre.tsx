import React, { useState } from 'react';
import { Timer, Dices } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BetModal } from '../modals/BetModal';
import { LiveOpenBets } from '../LiveOpenBets';
import { K3_SUM_MULTIPLIERS } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const K3Lotre: React.FC = () => {
  const { countdown, currentPeriod, isFrozen, k3History, bets } = useGame();

  const [activeTab, setActiveTab] = useState<'sum' | '2same' | '3same'>('sum');
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [betConfig, setBetConfig] = useState<{
    category: string;
    value: string | number;
    multiplier: number;
  }>({
    category: 'Sum',
    value: 11,
    multiplier: 6.91,
  });

  const handleOpenBet = (category: string, value: string | number, multiplier: number) => {
    sound.playTap();
    setBetConfig({ category, value, multiplier });
    setBetModalOpen(true);
  };

  const latestK3 = k3History[0] || { dice: [3, 4, 4] as [number, number, number], sum: 11, size: 'big' as const, parity: 'odd' as const, isTriple: false };
  const myK3Bets = bets.filter((b) => b.game === 'k3');

  // Unicode dice characters or custom rendering
  const diceFaces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return (
    <div className="space-y-3 pb-24">
      {/* K3 Header Banner */}
      <div className="p-3 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-gold text-slate-950 flex items-center justify-center font-black">
            <Dices className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white">K3 LOTRE (SIC BO)</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 rounded font-bold">
                DICE LOTTERY
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Triple Dice Roll with Multipliers up to 207x</p>
          </div>
        </div>
      </div>

      {/* Shaker Board & Countdown */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Period</span>
            <div className="text-base font-black text-white font-mono">
              K3{currentPeriod.slice(-8)}
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

        {/* 3D Animated Shaker Box */}
        <div className={`mt-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center relative overflow-hidden transition-all ${
          isFrozen ? 'animate-bounce-short ring-2 ring-amber-500/50' : ''
        }`}>
          <div className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-widest">
            {isFrozen ? '🎲 Shaking Dice Cup...' : 'Last Draw Result'}
          </div>

          <div className="flex items-center justify-center gap-3">
            {latestK3.dice.map((val, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-xl bg-gradient-to-b from-white to-slate-200 text-slate-900 shadow-lg flex items-center justify-center text-3xl font-black font-mono border-2 border-slate-300"
              >
                {diceFaces[val]}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold">
              Sum: {latestK3.sum}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 font-bold uppercase">
              {latestK3.size}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 font-bold uppercase">
              {latestK3.parity}
            </span>
            {latestK3.isTriple && (
              <span className="px-2 py-0.5 rounded-md bg-red-500 text-white font-extrabold uppercase animate-pulse">
                TRIPLE!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Live / Open Bets Banner */}
      <LiveOpenBets gameFilter="k3" />

      {/* Betting Mode Sub-Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('sum')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'sum' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
          }`}
        >
          Total Sum (3–18)
        </button>
        <button
          onClick={() => setActiveTab('2same')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === '2same' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
          }`}
        >
          2 Same (Pairs)
        </button>
        <button
          onClick={() => setActiveTab('3same')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === '3same' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
          }`}
        >
          3 Same (Triples)
        </button>
      </div>

      {/* Tab Content 1: Total Sum (3–18) */}
      {activeTab === 'sum' && (
        <div className="space-y-2.5">
          {/* Big / Small / Odd / Even Quick Pills */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'Big', label: 'BIG (11–18)', mult: 1.96, color: 'bg-amber-500 text-slate-950' },
              { id: 'Small', label: 'SMALL (3–10)', mult: 1.96, color: 'bg-sky-500 text-white' },
              { id: 'Odd', label: 'ODD', mult: 1.96, color: 'bg-emerald-600 text-white' },
              { id: 'Even', label: 'EVEN', mult: 1.96, color: 'bg-purple-600 text-white' },
            ].map((item) => (
              <button
                key={item.id}
                disabled={isFrozen}
                onClick={() => handleOpenBet(item.id === 'Big' || item.id === 'Small' ? 'Size' : 'Parity', item.id, item.mult)}
                className={`py-2.5 px-1 rounded-xl font-black text-[11px] shadow-md transition-all active:scale-95 flex flex-col items-center justify-center ${item.color} ${
                  isFrozen ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[9px] font-mono opacity-80">{item.mult}x</span>
              </button>
            ))}
          </div>

          {/* Sum Numbers Grid (3 to 18) */}
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              Predict Total Sum (Tiered Odds)
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((s) => {
                const mult = K3_SUM_MULTIPLIERS[s] || 2;
                return (
                  <button
                    key={s}
                    disabled={isFrozen}
                    onClick={() => handleOpenBet('Sum', s, mult)}
                    className={`py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex flex-col items-center justify-center transition-all ${
                      isFrozen ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="font-mono font-black text-sm text-white">{s}</span>
                    <span className="text-[9px] font-mono text-amber-400 font-bold">{mult}x</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: 2 Same (Pairs) */}
      {activeTab === '2same' && (
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Two Matching Dice</span>
            <span className="text-[11px] font-mono text-amber-400 font-bold">13.82x Payout</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['11', '22', '33', '44', '55', '66'].map((pair) => (
              <button
                key={pair}
                disabled={isFrozen}
                onClick={() => handleOpenBet('Pair', pair, 13.82)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex flex-col items-center justify-center text-white active:scale-95"
              >
                <span className="font-mono font-black text-base">{pair} *</span>
                <span className="text-[10px] text-amber-400 font-bold">13.8x</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: 3 Same (Triples) */}
      {activeTab === '3same' && (
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
          <button
            disabled={isFrozen}
            onClick={() => handleOpenBet('Triple', 'Any Triple', 34.56)}
            className="w-full py-3 rounded-xl gradient-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Any 3 Same (Any Triple)</span>
            <span className="font-mono font-bold">34.56x</span>
          </button>

          <div>
            <span className="text-xs font-bold text-slate-300 block mb-1.5">
              Specific Triple (Mega Multiplier: 207.36x)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['111', '222', '333', '444', '555', '666'].map((triple) => (
                <button
                  key={triple}
                  disabled={isFrozen}
                  onClick={() => handleOpenBet('Triple', triple, 207.36)}
                  className="py-2.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30 font-mono font-black text-sm flex flex-col items-center justify-center active:scale-95"
                >
                  <span>{triple}</span>
                  <span className="text-[9px] text-amber-400 font-bold">207x</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* K3 History Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-4 py-2 px-3 bg-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
          <span>Period</span>
          <span>Dice</span>
          <span>Sum</span>
          <span>Type</span>
        </div>
        <div className="divide-y divide-slate-800/60 max-h-52 overflow-y-auto">
          {k3History.map((rec) => (
            <div key={rec.period} className="grid grid-cols-4 py-2 px-3 text-xs text-center items-center">
              <span className="font-mono text-slate-400 text-[11px]">{rec.period.slice(-5)}</span>
              <span className="font-mono font-bold text-white text-base">
                {rec.dice.map((d) => diceFaces[d]).join(' ')}
              </span>
              <span className="font-mono font-bold text-amber-400">{rec.sum}</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase">
                {rec.size} / {rec.parity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bet Modal */}
      <BetModal
        isOpen={betModalOpen}
        onClose={() => setBetModalOpen(false)}
        game="k3"
        category={betConfig.category}
        value={betConfig.value}
        multiplier={betConfig.multiplier}
      />
    </div>
  );
};
