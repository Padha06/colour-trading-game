import React, { useState } from 'react';
import { Timer, History, BarChart3, User, AlertCircle, Info, Flame, Clock, CheckCircle2, XCircle } from 'lucide-react';
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
      {/* Timer Speed Switcher */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
        {[
          { id: '30s', label: 'Win Go 30s', hot: true },
          { id: '1m', label: 'Win Go 1Min' },
          { id: '3m', label: 'Win Go 3Min' },
          { id: '5m', label: 'Win Go 5Min' },
        ].map((timer) => (
          <button
            key={timer.id}
            onClick={() => {
              sound.playTap();
              setActiveTimerTab(timer.id as typeof activeTimerTab);
            }}
            className={`py-2 px-1 rounded-xl text-center transition-all relative ${
              activeTimerTab === timer.id
                ? 'gradient-gold text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 text-xs font-semibold'
            }`}
          >
            {timer.hot && (
              <span className="absolute -top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            <div className="text-[11px] leading-tight font-bold">{timer.label}</div>
          </button>
        ))}
      </div>

      {/* Main Period & Countdown Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-4 shadow-xl">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Period</span>
              <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.2 rounded font-mono font-bold">
                LIVE
              </span>
            </div>
            <div className="text-lg font-black text-white font-mono tracking-wider mt-0.5">
              {currentPeriod}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>Time Left</span>
            </div>
            <div className="flex items-center gap-1 justify-end mt-0.5">
              <span className={`font-mono text-2xl font-black px-2 py-0.5 rounded-lg border tracking-wider transition-colors ${
                isFrozen
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : 'bg-slate-800/90 border-slate-700 text-amber-400'
              }`}>
                00:{String(countdown).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Frozen Alert Banner */}
        {isFrozen && (
          <div className="mt-3 py-1 px-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs flex items-center justify-center gap-1.5 animate-pulse font-bold">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>5s FREEZE: Outcome resolving, bets locked!</span>
          </div>
        )}
      </div>

      {/* Primary Color Actions (Green, Violet, Red) */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Green', 2)}
          className={`py-3.5 px-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center relative overflow-hidden ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-emerald-800' : 'gradient-green shadow-emerald-500/20'
          }`}
        >
          <span>Join Green</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">2.0x Multiplier</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Violet', 4.5)}
          className={`py-3.5 px-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center relative overflow-hidden ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-purple-900' : 'gradient-violet shadow-purple-500/20'
          }`}
        >
          <span>Join Violet</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">4.5x Multiplier</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Red', 2)}
          className={`py-3.5 px-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center relative overflow-hidden ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-rose-900' : 'gradient-red shadow-rose-500/20'
          }`}
        >
          <span>Join Red</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">2.0x Multiplier</span>
        </button>
      </div>

      {/* Number Selection Grid (0 to 9) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300">Select Number (0–9)</span>
          <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            9.0x High Payout
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            let bgClass = 'gradient-red';
            if (num === 0) bgClass = 'gradient-red-violet';
            else if (num === 5) bgClass = 'gradient-green-violet';
            else if ([1, 3, 7, 9].includes(num)) bgClass = 'gradient-green';

            return (
              <button
                key={num}
                disabled={isFrozen}
                onClick={() => handleOpenBet('Number', num, 9)}
                className={`h-12 rounded-xl text-white font-mono font-black text-lg shadow-md transition-all active:scale-95 flex flex-col items-center justify-center relative ${bgClass} ${
                  isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
                }`}
              >
                <span>{num}</span>
                <span className="text-[8px] opacity-80 -mt-1 font-sans">9x</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Big / Small Choice */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Size', 'Big', 2)}
          className={`py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg ${
            isFrozen
              ? 'opacity-50 cursor-not-allowed bg-amber-700'
              : 'gradient-gold shadow-amber-500/20'
          }`}
        >
          <span>BIG (5–9)</span>
          <span className="text-xs font-mono font-bold">1.96x</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Size', 'Small', 2)}
          className={`py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-sky-500 to-blue-600 ${
            isFrozen
              ? 'opacity-50 cursor-not-allowed bg-sky-800'
              : 'shadow-sky-500/20'
          }`}
        >
          <span>SMALL (0–4)</span>
          <span className="text-xs font-mono font-bold">1.96x</span>
        </button>
      </div>

      {/* Prominent Live / Open Bets Banner */}
      <LiveOpenBets gameFilter="wingo" />

      {/* Sub Tabs: Record / Chart / My Bets */}
      <div className="mt-4 pt-2">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveSubTab('record')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeSubTab === 'record'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Game Record
          </button>

          <button
            onClick={() => setActiveSubTab('chart')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeSubTab === 'chart'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Trend Chart
          </button>

          <button
            onClick={() => setActiveSubTab('mybets')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all relative ${
              activeSubTab === 'mybets'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            My Bets
            {myWinGoBets.filter((b) => b.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>

        {/* Tab 1: Game Record Table */}
        {activeSubTab === 'record' && (
          <div className="mt-2.5 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-4 py-2 px-3 bg-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              <span>Period</span>
              <span>Number</span>
              <span>Big/Small</span>
              <span>Color</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
              {winGoHistory.slice(0, 15).map((rec) => {
                let badgeColor = 'bg-emerald-500';
                if (rec.color === 'red') badgeColor = 'bg-rose-500';
                else if (rec.color === 'red-violet') badgeColor = 'gradient-red-violet';
                else if (rec.color === 'green-violet') badgeColor = 'gradient-green-violet';

                return (
                  <div key={rec.period} className="grid grid-cols-4 py-2 px-3 text-xs text-center items-center">
                    <span className="font-mono text-slate-400 text-[11px]">{rec.period.slice(-5)}</span>
                    <span className="font-mono font-black text-sm text-white">{rec.number}</span>
                    <span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        rec.size === 'big' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                      }`}>
                        {rec.size}
                      </span>
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      <span className={`w-3.5 h-3.5 rounded-full ${badgeColor} shadow-sm`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Trend Chart / Stats */}
        {activeSubTab === 'chart' && (
          <div className="mt-2.5 bg-slate-900/80 rounded-2xl border border-slate-800 p-3 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Distribution (Last {totalRecords} Rounds)</span>
              <span className="text-[10px] text-slate-400">Statistical Trend</span>
            </div>

            {/* Color Distribution Bars */}
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-emerald-400 font-bold">Green: {greenCount}</span>
                  <span className="text-rose-400 font-bold">Red: {redCount}</span>
                  <span className="text-purple-400 font-bold">Violet: {violetCount}</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex bg-slate-800">
                  <div style={{ width: `${(greenCount / totalRecords) * 100}%` }} className="bg-emerald-500" />
                  <div style={{ width: `${(redCount / totalRecords) * 100}%` }} className="bg-rose-500" />
                  <div style={{ width: `${(violetCount / totalRecords) * 100}%` }} className="bg-purple-600" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-amber-400 font-bold">Big (5-9): {bigCount}</span>
                  <span className="text-sky-400 font-bold">Small (0-4): {smallCount}</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex bg-slate-800">
                  <div style={{ width: `${(bigCount / totalRecords) * 100}%` }} className="bg-amber-500" />
                  <div style={{ width: `${(smallCount / totalRecords) * 100}%` }} className="bg-sky-500" />
                </div>
              </div>
            </div>

            {/* Bead Road Preview */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                Bead Road Pattern
              </span>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 rounded-xl">
                {winGoHistory.slice(0, 20).map((r, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-black text-white ${
                      r.color === 'green'
                        ? 'bg-emerald-500'
                        : r.color === 'red'
                        ? 'bg-rose-500'
                        : 'gradient-red-violet'
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
          <div className="mt-2.5 bg-slate-900/80 rounded-2xl border border-slate-800 p-2 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300">Win Go Orders History</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                {myWinGoBets.filter(b => b.status === 'pending').length} Live In Play
              </span>
            </div>

            {myWinGoBets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No bets placed in Win Go yet. Choose a color or number to start!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {myWinGoBets.map((bet) => (
                  <div 
                    key={bet.id} 
                    className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                      bet.status === 'pending'
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : bet.status === 'won'
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-200">
                          {bet.betCategory}: <strong className="text-amber-400">{bet.betValue}</strong>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          ({bet.multiplier}x)
                        </span>
                      </div>

                      <div>
                        {bet.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center gap-1 animate-pulse">
                            <Clock className="w-2.5 h-2.5" />
                            Live In Play
                          </span>
                        )}
                        {bet.status === 'won' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Won +{formatINR(bet.payout || 0)}
                          </span>
                        )}
                        {bet.status === 'lost' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-[10px] flex items-center gap-1">
                            <XCircle className="w-2.5 h-2.5" />
                            Lost
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Period #{bet.period.slice(-6)} • Stake: <strong className="text-slate-200">{formatINR(bet.amount)}</strong></span>
                      {bet.resultOutcome && (
                        <span className="text-slate-300 font-mono">
                          Draw: <strong>{bet.resultOutcome}</strong>
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
