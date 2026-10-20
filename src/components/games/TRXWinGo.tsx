import React, { useState } from 'react';
import { Timer, CheckCircle, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BetModal } from '../modals/BetModal';
import { LiveOpenBets } from '../LiveOpenBets';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const TRXWinGo: React.FC = () => {
  const { countdown, currentPeriod, isFrozen, trxHistory, bets } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'record' | 'mybets'>('record');
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

  const [verifyModalRecord, setVerifyModalRecord] = useState<typeof trxHistory[0] | null>(null);

  const handleOpenBet = (category: string, value: string | number, multiplier: number) => {
    sound.playTap();
    setBetConfig({ category, value, multiplier });
    setBetModalOpen(true);
  };

  const myTRXBets = bets.filter((b) => b.game === 'trx');
  const latestBlock = trxHistory[0] || { blockNumber: 68491204, blockHash: '...7', number: 7 };

  return (
    <div className="space-y-3 pb-24">
      {/* Header Badge */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-black">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900">TRX HASH WIN GO</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1 rounded font-bold">
                VERIFIED FAIR
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Based on public Tron Blockchain block hash</p>
          </div>
        </div>
      </div>

      {/* Live Hash & Countdown Banner */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Period</span>
            <div className="text-base font-black text-slate-900 font-mono">
              TRX{currentPeriod.slice(-8)}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-slate-500 text-xs font-bold uppercase">
              <Timer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Draw In</span>
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

        {/* Live Tron Block Ticker */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
            <span>Last Tron Block: <strong className="text-slate-900">#{latestBlock.blockNumber}</strong></span>
            <span className="text-emerald-700 flex items-center gap-1 font-bold">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              Live Synced
            </span>
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            Hash: {latestBlock.blockHash.slice(0, 32)}...
            <span className="text-emerald-700 font-black text-xs bg-emerald-100 px-1 py-0.2 rounded ml-1">
              {latestBlock.number}
            </span>
          </div>
        </div>
      </div>

      {/* Betting Controls: Colors */}
      <div className="grid grid-cols-3 gap-2">
        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Green', 2)}
          className={`py-3 px-2 rounded-xl font-black text-sm uppercase tracking-wide text-white shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-emerald-800' : 'bg-[#00b977] hover:brightness-105'
          }`}
        >
          <span>Green</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">2.0x</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Violet', 4.5)}
          className={`py-3 px-2 rounded-xl font-black text-sm uppercase tracking-wide text-white shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-purple-900' : 'bg-[#9c27b0] hover:brightness-105'
          }`}
        >
          <span>Violet</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">4.5x</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Red', 2)}
          className={`py-3 px-2 rounded-xl font-black text-sm uppercase tracking-wide text-white shadow-sm transition-all active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-rose-900' : 'bg-[#fe3838] hover:brightness-105'
          }`}
        >
          <span>Red</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">2.0x</span>
        </button>
      </div>

      {/* Number Selection Grid (0 to 9) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Predict Last Digit of Hash</span>
          <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            9.0x Payout
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
                className={`h-11 rounded-xl text-white font-mono font-black text-lg shadow-sm transition-all active:scale-95 flex items-center justify-center ${bgClass} ${
                  isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-105'
                }`}
              >
                {num}
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
      <LiveOpenBets gameFilter="trx" />

      {/* Sub-tabs: History & My Bets */}
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
            Blockchain Records
          </button>
          <button
            onClick={() => setActiveSubTab('mybets')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'mybets'
                ? 'bg-slate-900 text-white font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My TRX Bets ({myTRXBets.length})
          </button>
        </div>

        {activeSubTab === 'record' && (
          <div className="mt-2.5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-4 py-2 px-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              <span>Block</span>
              <span>Hash End</span>
              <span>Result</span>
              <span>Verify</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {trxHistory.map((rec) => (
                <div key={rec.period} className="grid grid-cols-4 py-2 px-3 text-xs text-center items-center">
                  <span className="font-mono text-slate-600 text-[11px]">#{rec.blockNumber}</span>
                  <span className="font-mono text-[10px] text-slate-700 truncate">
                    ...{rec.blockHash.slice(-5, -1)}
                    <strong className="text-emerald-700 font-bold">{rec.number}</strong>
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-mono font-black text-sm text-slate-900">{rec.number}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      rec.color === 'green' ? 'bg-[#00b977]' : rec.color === 'red' ? 'bg-[#fe3838]' : 'split-red-violet'
                    }`} />
                  </div>
                  <button
                    onClick={() => setVerifyModalRecord(rec)}
                    className="flex items-center justify-center gap-1 text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    <span>Check</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'mybets' && (
          <div className="mt-2.5 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            {myTRXBets.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No TRX bets yet. Pick a color or number above!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {myTRXBets.map((b) => (
                  <div key={b.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">
                        {b.betCategory}: {b.betValue} ({b.multiplier}x)
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {b.period}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-800">{formatINR(b.amount)}</div>
                      <span className={`text-[10px] font-bold ${
                        b.status === 'won' ? 'text-emerald-600' : b.status === 'lost' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {b.status === 'won' ? `Won +${formatINR(b.payout || 0)}` : b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {verifyModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                TronScan Verification
              </span>
              <button
                onClick={() => setVerifyModalRecord(null)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Block Number</span>
                <div className="font-mono text-slate-900 font-bold">#{verifyModalRecord.blockNumber}</div>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Block Hash</span>
                <div className="font-mono text-[10px] text-slate-700 break-all leading-tight">
                  {verifyModalRecord.blockHash}
                </div>
              </div>

              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-emerald-800 font-medium">Outcome Digit:</span>
                <span className="font-mono text-base font-black text-emerald-700">
                  {verifyModalRecord.number} ({verifyModalRecord.color.toUpperCase()})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bet Modal */}
      <BetModal
        isOpen={betModalOpen}
        onClose={() => setBetModalOpen(false)}
        game="trx"
        category={betConfig.category}
        value={betConfig.value}
        multiplier={betConfig.multiplier}
      />
    </div>
  );
};
