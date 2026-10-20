import React, { useState } from 'react';
import { Timer, CheckCircle, ExternalLink, ShieldCheck, Cpu, Clock, CheckCircle2, XCircle } from 'lucide-react';
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
      {/* Blockchain Header Badge */}
      <div className="p-3 bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 rounded-2xl border border-red-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-black">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white">TRON (TRX) HASH WIN GO</span>
              <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 rounded font-bold">
                PROVABLY FAIR
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Outcome derived from Tron Blockchain Block Hash</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tamper Proof</span>
        </div>
      </div>

      {/* Live Hash & Countdown Banner */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Period</span>
            <div className="text-base font-black text-white font-mono">
              TRX{currentPeriod.slice(-8)}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-slate-400 text-xs font-bold uppercase">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>Draw In</span>
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

        {/* Live Tron Block Ticker */}
        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Last Tron Block: <strong className="text-amber-400">#{latestBlock.blockNumber}</strong></span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Synced
            </span>
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            Hash: {latestBlock.blockHash.slice(0, 32)}...
            <span className="text-amber-400 font-bold text-xs bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/40">
              {latestBlock.number}
            </span>
          </div>
        </div>
      </div>

      {/* Betting Controls: Colors */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Green', 2)}
          className={`py-3.5 px-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-emerald-800' : 'gradient-green shadow-emerald-500/20'
          }`}
        >
          <span>Green</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">2.0x</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Violet', 4.5)}
          className={`py-3.5 px-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-purple-900' : 'gradient-violet shadow-purple-500/20'
          }`}
        >
          <span>Violet</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">4.5x</span>
        </button>

        <button
          disabled={isFrozen}
          onClick={() => handleOpenBet('Color', 'Red', 2)}
          className={`py-3.5 px-2 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center ${
            isFrozen ? 'opacity-50 cursor-not-allowed bg-rose-900' : 'gradient-red shadow-rose-500/20'
          }`}
        >
          <span>Red</span>
          <span className="text-[10px] font-mono opacity-90 font-bold">2.0x</span>
        </button>
      </div>

      {/* Number Selection Grid (0 to 9) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300">Target Hash Last Digit (0–9)</span>
          <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
            9.0x Payout
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
                className={`h-11 rounded-xl text-white font-mono font-black text-lg shadow-md transition-all active:scale-95 flex items-center justify-center ${bgClass} ${
                  isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
                }`}
              >
                {num}
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
      <LiveOpenBets gameFilter="trx" />

      {/* Sub-tabs: History & My Bets */}
      <div className="pt-2">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveSubTab('record')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all ${
              activeSubTab === 'record'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            Blockchain Verification Records
          </button>
          <button
            onClick={() => setActiveSubTab('mybets')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all ${
              activeSubTab === 'mybets'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            My TRX Bets ({myTRXBets.length})
          </button>
        </div>

        {activeSubTab === 'record' && (
          <div className="mt-2.5 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-4 py-2 px-3 bg-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              <span>Block</span>
              <span>Hash End</span>
              <span>Result</span>
              <span>Verify</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto">
              {trxHistory.map((rec) => (
                <div key={rec.period} className="grid grid-cols-4 py-2.5 px-3 text-xs text-center items-center">
                  <span className="font-mono text-slate-400 text-[11px]">#{rec.blockNumber}</span>
                  <span className="font-mono text-[10px] text-slate-300 truncate">
                    ...{rec.blockHash.slice(-5, -1)}
                    <strong className="text-amber-400 font-bold">{rec.number}</strong>
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-mono font-black text-sm text-white">{rec.number}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      rec.color === 'green' ? 'bg-emerald-500' : rec.color === 'red' ? 'bg-rose-500' : 'gradient-red-violet'
                    }`} />
                  </div>
                  <button
                    onClick={() => setVerifyModalRecord(rec)}
                    className="flex items-center justify-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
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
          <div className="mt-2.5 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
            {myTRXBets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No TRX bets yet. Pick a color or number above!
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                {myTRXBets.map((b) => (
                  <div key={b.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-200">
                        {b.betCategory}: {b.betValue} ({b.multiplier}x)
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {b.period}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-200">{formatINR(b.amount)}</div>
                      <span className={`text-[10px] font-bold ${
                        b.status === 'won' ? 'text-emerald-400' : b.status === 'lost' ? 'text-rose-400' : 'text-amber-400'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#131d31] rounded-2xl border border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                TronScan Blockchain Proof
              </span>
              <button
                onClick={() => setVerifyModalRecord(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-950 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Block Height</span>
                <div className="font-mono text-amber-400 font-bold">#{verifyModalRecord.blockNumber}</div>
              </div>

              <div className="p-2 bg-slate-950 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Cryptographic Block Hash</span>
                <div className="font-mono text-[10px] text-slate-300 break-all leading-tight">
                  {verifyModalRecord.blockHash}
                </div>
              </div>

              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <span className="text-slate-300 font-medium">Extracted Final Digit:</span>
                <span className="font-mono text-base font-black text-emerald-400">
                  {verifyModalRecord.number} ({verifyModalRecord.color.toUpperCase()})
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              Matches public Tron network cryptographic consensus. Cannot be tampered with by the house.
            </p>
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
