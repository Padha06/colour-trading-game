import React, { useState } from 'react';
import { Timer, History, BarChart3, User, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BetModal } from '../modals/BetModal';
import { LiveOpenBets } from '../LiveOpenBets';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const WinGo: React.FC = () => {
  const { countdown, currentPeriod, isFrozen, winGoHistory, bets } = useGame();

  const [activeTimerTab, setActiveTimerTab] = useState<'30s' | '1m' | '3m' | '5m'>('30s');
  const [activeSubTab, setActiveSubTab] = useState<'record' | 'chart' | 'mybets'>('record');
  
  // Bet Modal State
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [betConfig, setBetConfig] = useState<{
    category: string;
    value: string | number;
    multiplier: number;
  }>({
    category: 'Color',
    value: 'Green',
    multiplier: 2,
  });

  const handleOpenBet = (category: string, value: string | number, multiplier: number) => {
    sound.playTap();
    setBetConfig({ category, value, multiplier });
    setBetModalOpen(true);
  };

  const myWinGoBets = bets.filter((b) => b.game === 'wingo');

  // Stats calculation for Chart tab
  const totalRecords = winGoHistory.length || 1;
  const greenCount = winGoHistory.filter((r) => r.color === 'green' || r.color === 'green-violet').length;
  const redCount = winGoHistory.filter((r) => r.color === 'red' || r.color === 'red-violet').length;
  const violetCount = winGoHistory.filter((r) => r.color === 'red-violet' || r.color === 'green-violet').length;
  const bigCount = winGoHistory.filter((r) => r.size === 'big').length;
  const smallCount = winGoHistory.filter((r) => r.size === 'small').length;

  return (
    <div className="space-y-3 pb-24">
      {/* Simple Timer Switcher */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
        {[
          { id: '30s', label: '30 Seconds', hot: true },
          { id: '1m', label: '1 Minute' },
          { id: '3m', label: '3 Minutes' },
          { id: '5m', label: '5 Minutes' },
        ].map((timer) => (
          <button
            key={timer.id}
            onClick={() => {
              sound.playTap();
              setActiveTimerTab(timer.id as typeof activeTimerTab);
            }}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTimerTab === timer.id
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 text-xs font-semibold'
            }`}
          >
            <div className="text-[11px] leading-tight font-bold">{timer.label}</div>
          </button>
        ))}
      </div>

      {/* Main Period & Countdown Banner (Clean White Card) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Period Number</span>
            <div className="text-lg font-black text-slate-900 font-mono tracking-tight mt-0.5">
              {currentPeriod}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-slate-500 text-xs font-bold uppercase">
              <Timer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Time Left</span>
            </div>
            <div className="mt-0.5">
              <span className={`font-mono text-2xl font-black px-2.5 py-0.5 rounded-lg border tracking-wider inline-block ${
                isFrozen
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                00:{String(countdown).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Frozen Alert */}
        {isFrozen && (
          <div className="py-1 px-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-1.5 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>5s Freeze: Locking bets and drawing result...</span>
          </div>
        )}
      </div>

      {/* Primary Color Actions: Green, Violet, Red */}
      <div className="grid grid-cols-3 gap-2">
        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Green', 2)}
          className={`py-3 px-2 rounded-xl font-black text-sm uppercase tracking-wide text-white shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-emerald-800' : 'bg-[#00b977] hover:brightness-105'
          }`}
        >
          <span>Green</span>
          <span className="text-[10px] font-mono opacity-95 font-semibold">2x Payout</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Violet', 4.5)}
          className={`py-3 px-2 rounded-xl font-black text-sm uppercase tracking-wide text-white shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-purple-900' : 'bg-[#9c27b0] hover:brightness-105'
          }`}
        >
          <span>Violet</span>
          <span className="text-[10px] font-mono opacity-95 font-semibold">4.5x Payout</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Red', 2)}
          className={`py-3 px-2 rounded-xl font-black text-sm uppercase tracking-wide text-white shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-rose-900' : 'bg-[#fe3838] hover:brightness-105'
          }`}
        >
          <span>Red</span>
          <span className="text-[10px] font-mono opacity-95 font-semibold">2x Payout</span>
        </button>
      </div>

      {/* Number Selection Grid (0 to 9) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Select Number (0 to 9)</span>
          <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            9x Payout
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            let bgClass = 'bg-[#fe3838]';
            if (num === 0) bgClass = 'split-red-violet';
            else if (num === 5) bgClass = 'split-green-violet';
            else if ([1, 3, 7, 9].includes(num)) bgClass = 'bg-[#00b977]';

            return (
              <button
                key={num}
                disabled={isFrozen}
                onClick={() => handleOpenBet('Number', num, 9)}
                className={`h-11 rounded-xl text-white font-mono font-black text-lg shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center ${bgClass} ${
                  isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-105'
                }`}
              >
                <span>{num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Big / Small Choice */}
      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Size', 'Big', 2)}
          className={`py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-amber-700' : 'bg-[#f59e0b] hover:brightness-105'
          }`}
        >
          <span>BIG (5–9)</span>
          <span className="text-xs font-mono font-semibold">1.96x</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Size', 'Small', 2)}
          className={`py-3 rounded-xl font-black text-sm uppercase tracking-wide text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-blue-800' : 'bg-[#3b82f6] hover:brightness-105'
          }`}
        >
          <span>SMALL (0–4)</span>
          <span className="text-xs font-mono font-semibold">1.96x</span>
        </button>
      </div>

      {/* Live Open Bets Banner */}
      <LiveOpenBets gameFilter="wingo" />

      {/* Sub-tabs: Records / Trend Chart / My Bets */}
      <div className="pt-2">
        <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
          <button
            onClick={() => setActiveSubTab('record')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'record'
                ? 'bg-slate-900 text-white font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Game Records
          </button>

          <button
            onClick={() => setActiveSubTab('chart')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'chart'
                ? 'bg-slate-900 text-white font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trend Chart
          </button>

          <button
            onClick={() => setActiveSubTab('mybets')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all relative ${
              activeSubTab === 'mybets'
                ? 'bg-slate-900 text-white font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Bets ({myWinGoBets.length})
          </button>
        </div>

        {/* Tab 1: Game Record Table (Clean Light Table) */}
        {activeSubTab === 'record' && (
          <div className="mt-2.5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-4 py-2 px-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              <span>Period</span>
              <span>Number</span>
              <span>Big/Small</span>
              <span>Color</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {winGoHistory.slice(0, 15).map((rec) => {
                let badgeClass = 'bg-[#00b977]';
                if (rec.color === 'red') badgeClass = 'bg-[#fe3838]';
                else if (rec.color === 'red-violet') badgeClass = 'split-red-violet';
                else if (rec.color === 'green-violet') badgeClass = 'split-green-violet';

                return (
                  <div key={rec.period} className="grid grid-cols-4 py-2 px-3 text-xs text-center items-center">
                    <span className="font-mono text-slate-600 text-[11px]">{rec.period.slice(-5)}</span>
                    <span className="font-mono font-black text-sm text-slate-900">{rec.number}</span>
                    <span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        rec.size === 'big' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.size}
                      </span>
                    </span>
                    <div className="flex items-center justify-center">
                      <span className={`w-3.5 h-3.5 rounded-full ${badgeClass}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Trend Chart */}
        {activeSubTab === 'chart' && (
          <div className="mt-2.5 bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3 shadow-sm">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Distribution (Last {totalRecords} Rounds)</span>
              <span className="text-[10px] text-slate-500">Statistics</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-emerald-700 font-bold">Green: {greenCount}</span>
                  <span className="text-rose-600 font-bold">Red: {redCount}</span>
                  <span className="text-purple-600 font-bold">Violet: {violetCount}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-100">
                  <div style={{ width: `${(greenCount / totalRecords) * 100}%` }} className="bg-[#00b977]" />
                  <div style={{ width: `${(redCount / totalRecords) * 100}%` }} className="bg-[#fe3838]" />
                  <div style={{ width: `${(violetCount / totalRecords) * 100}%` }} className="bg-[#9c27b0]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-amber-700 font-bold">Big (5-9): {bigCount}</span>
                  <span className="text-blue-700 font-bold">Small (0-4): {smallCount}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-100">
                  <div style={{ width: `${(bigCount / totalRecords) * 100}%` }} className="bg-amber-500" />
                  <div style={{ width: `${(smallCount / totalRecords) * 100}%` }} className="bg-blue-500" />
                </div>
              </div>
            </div>

            {/* Bead Road Pattern */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                Recent Outcomes
              </span>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                {winGoHistory.slice(0, 20).map((r, i) => (
                  <span
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-black text-white ${
                      r.color === 'green'
                        ? 'bg-[#00b977]'
                        : r.color === 'red'
                        ? 'bg-[#fe3838]'
                        : 'split-red-violet'
                    }`}
                  >
                    {r.number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: My Bets */}
        {activeSubTab === 'mybets' && (
          <div className="mt-2.5 bg-white rounded-2xl border border-slate-200 p-3 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Your Win Go Bets</span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                {myWinGoBets.filter(b => b.status === 'pending').length} Active
              </span>
            </div>

            {myWinGoBets.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No bets placed in Win Go yet.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {myWinGoBets.map((bet) => (
                  <div 
                    key={bet.id} 
                    className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                      bet.status === 'pending'
                        ? 'bg-amber-50 border-amber-300'
                        : bet.status === 'won'
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800">
                          {bet.betCategory}: <strong className="text-slate-900">{bet.betValue}</strong>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          ({bet.multiplier}x)
                        </span>
                      </div>

                      <div>
                        {bet.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            Live In Play
                          </span>
                        )}
                        {bet.status === 'won' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Won +{formatINR(bet.payout || 0)}
                          </span>
                        )}
                        {bet.status === 'lost' && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-semibold text-[10px] flex items-center gap-1">
                            <XCircle className="w-2.5 h-2.5" />
                            Lost
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Period #{bet.period.slice(-5)} • Bet: <strong className="text-slate-800">{formatINR(bet.amount)}</strong></span>
                      {bet.resultOutcome && (
                        <span className="text-slate-700 font-medium">
                          Result: <strong>{bet.resultOutcome}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bet Modal */}
      <BetModal
        isOpen={betModalOpen}
        onClose={() => setBetModalOpen(false)}
        game="wingo"
        category={betConfig.category}
        value={betConfig.value}
        multiplier={betConfig.multiplier}
      />
    </div>
  );
};
