import React, { useState } from 'react';
import { Timer, Dices } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BetModal } from '../modals/BetModal';
import { LiveOpenBets } from '../LiveOpenBets';
import { K3_SUM_MULTIPLIERS } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const K3Lotre: React.FC = () => {
  const { countdown, currentPeriod, isFrozen, k3History } = useGame();

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

  const latestK3 = k3History[0] || {
    dice: [3, 4, 4] as [number, number, number],
    sum: 11,
    size: 'big' as const,
    parity: 'odd' as const,
    isTriple: false,
  };

  const diceFaces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return (
    <div className="space-y-3 pb-24">
      {/* Header Banner */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <Dices className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900">K3 DICE GAME (SIC BO)</span>
              <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1 rounded font-bold">
                UP TO 207X
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Roll of 3 dice with simple Sum and Pair betting</p>
          </div>
        </div>
      </div>

      {/* Shaker Board & Countdown */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Period</span>
            <div className="text-base font-black text-slate-900 font-mono">
              K3{currentPeriod.slice(-8)}
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

        {/* Dice Shaker Box */}
        <div className={`mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center transition-all ${
          isFrozen ? 'animate-bounce-short ring-2 ring-amber-400' : ''
        }`}>
          <div className="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-wide">
            {isFrozen ? '🎲 Shaking Dice Cup...' : 'Last Draw Result'}
          </div>

          <div className="flex items-center justify-center gap-3">
            {latestK3.dice.map((val, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-xl bg-white text-slate-900 shadow-sm flex items-center justify-center text-3xl font-black font-mono border-2 border-slate-200"
              >
                {diceFaces[val]}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
              Sum: {latestK3.sum}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold uppercase">
              {latestK3.size}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold uppercase">
              {latestK3.parity}
            </span>
            {latestK3.isTriple && (
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold uppercase">
                TRIPLE!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live Open Bets Banner */}
      <LiveOpenBets gameFilter="k3" />

      {/* Betting Mode Sub-Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('sum')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'sum' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-600'
          }`}
        >
          Total Sum (3–18)
        </button>
        <button
          onClick={() => setActiveTab('2same')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === '2same' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-600'
          }`}
        >
          2 Same (Pairs)
        </button>
        <button
          onClick={() => setActiveTab('3same')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === '3same' ? 'bg-slate-900 text-white font-extrabold' : 'text-slate-600'
          }`}
        >
          3 Same (Triples)
        </button>
      </div>

      {/* Tab Content 1: Total Sum */}
      {activeTab === 'sum' && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'Big', label: 'BIG (11–18)', mult: 1.96, color: 'bg-[#f59e0b] text-white' },
              { id: 'Small', label: 'SMALL (3–10)', mult: 1.96, color: 'bg-[#3b82f6] text-white' },
              { id: 'Odd', label: 'ODD', mult: 1.96, color: 'bg-[#00b977] text-white' },
              { id: 'Even', label: 'EVEN', mult: 1.96, color: 'bg-[#9c27b0] text-white' },
            ].map((item) => (
              <button
                key={item.id}
                disabled={isFrozen}
                onClick={() => handleOpenBet(item.id === 'Big' || item.id === 'Small' ? 'Size' : 'Parity', item.id, item.mult)}
                className={`py-2.5 px-1 rounded-xl font-bold text-[11px] shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center ${item.color} ${
                  isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-105'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[9px] font-mono opacity-90">{item.mult}x</span>
              </button>
            ))}
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <span className="text-xs font-bold text-slate-700 block">
              Predict Total Sum
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((s) => {
                const mult = K3_SUM_MULTIPLIERS[s] || 2;
                return (
                  <button
                    key={s}
                    disabled={isFrozen}
                    onClick={() => handleOpenBet('Sum', s, mult)}
                    className={`py-2 rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 flex flex-col items-center justify-center transition-all ${
                      isFrozen ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="font-mono font-black text-sm text-slate-900">{s}</span>
                    <span className="text-[9px] font-mono text-emerald-700 font-bold">{mult}x</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: 2 Same (Pairs) */}
      {activeTab === '2same' && (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Two Matching Dice</span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              13.82x Payout
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['11', '22', '33', '44', '55', '66'].map((pair) => (
              <button
                key={pair}
                disabled={isFrozen}
                onClick={() => handleOpenBet('Pair', pair, 13.82)}
                className="py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center justify-center active:scale-95 text-slate-800"
              >
                <span className="font-mono font-black text-base">{pair}</span>
                <span className="text-[10px] text-emerald-700 font-bold">13.8x</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: 3 Same (Triples) */}
      {activeTab === '3same' && (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
          <button
            disabled={isFrozen}
            onClick={() => handleOpenBet('Triple', 'Any Triple', 34.56)}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wide shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Any 3 Same (Any Triple)</span>
            <span className="font-mono font-bold">34.56x</span>
          </button>

          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1.5">
              Specific Triple (207.36x)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['111', '222', '333', '444', '555', '666'].map((triple) => (
                <button
                  key={triple}
                  disabled={isFrozen}
                  onClick={() => handleOpenBet('Triple', triple, 207.36)}
                  className="py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 font-mono font-black text-sm flex flex-col items-center justify-center active:scale-95"
                >
                  <span>{triple}</span>
                  <span className="text-[9px] text-red-600 font-bold">207x</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* K3 History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-4 py-2 px-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
          <span>Period</span>
          <span>Dice</span>
          <span>Sum</span>
          <span>Type</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto">
          {k3History.map((rec) => (
            <div key={rec.period} className="grid grid-cols-4 py-2 px-3 text-xs text-center items-center">
              <span className="font-mono text-slate-600 text-[11px]">{rec.period.slice(-5)}</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {rec.dice.map((d) => diceFaces[d]).join(' ')}
              </span>
              <span className="font-mono font-bold text-amber-700">{rec.sum}</span>
              <span className="text-[10px] font-bold text-slate-600 uppercase">
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
