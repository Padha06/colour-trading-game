import React, { useState } from 'react';
import { X, CheckCircle2, Clock, XCircle, Zap, Filter, ArrowUpRight, Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';
import { BetRecord } from '../../types';

interface MyBetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBetsModal: React.FC<MyBetsModalProps> = ({ isOpen, onClose }) => {
  const { bets } = useGame();
  const [filter, setFilter] = useState<'all' | 'open' | 'won' | 'lost'>('all');

  if (!isOpen) return null;

  const openBets = bets.filter((b) => b.status === 'pending');
  const wonBets = bets.filter((b) => b.status === 'won');
  const lostBets = bets.filter((b) => b.status === 'lost');

  let filteredBets: BetRecord[] = bets;
  if (filter === 'open') filteredBets = openBets;
  else if (filter === 'won') filteredBets = wonBets;
  else if (filter === 'lost') filteredBets = lostBets;

  const totalWagered = bets.reduce((acc, b) => acc + b.amount, 0);
  const totalWon = wonBets.reduce((acc, b) => acc + (b.payout || 0), 0);
  const netProfit = totalWon - totalWagered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#131d31] rounded-3xl border border-slate-700/80 p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                My Bets & Orders
                {openBets.length > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-black animate-pulse">
                    {openBets.length} Live
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">Complete record of your live and settled bets</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Financial Summary Strip */}
        <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950 rounded-2xl border border-slate-800/80 text-center flex-shrink-0">
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold">Total Wagered</span>
            <div className="font-mono font-bold text-xs text-slate-200 mt-0.5">
              {formatINR(totalWagered)}
            </div>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold">Total Won</span>
            <div className="font-mono font-bold text-xs text-emerald-400 mt-0.5">
              {formatINR(totalWon)}
            </div>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold">Net Return</span>
            <div className={`font-mono font-black text-xs mt-0.5 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netProfit >= 0 ? `+${formatINR(netProfit)}` : `-${formatINR(Math.abs(netProfit))}`}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 flex-shrink-0">
          {[
            { id: 'all' as const, label: `All (${bets.length})` },
            { id: 'open' as const, label: `Open (${openBets.length})`, pulse: openBets.length > 0 },
            { id: 'won' as const, label: `Won (${wonBets.length})` },
            { id: 'lost' as const, label: `Lost (${lostBets.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playTap();
                setFilter(tab.id);
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all text-center relative ${
                filter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              {tab.pulse && filter !== tab.id && (
                <span className="absolute -top-1 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Bets List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
          {filteredBets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No bets found in this filter category.
            </div>
          ) : (
            filteredBets.map((bet) => {
              const isWon = bet.status === 'won';
              const isLost = bet.status === 'lost';
              const isPending = bet.status === 'pending';

              return (
                <div
                  key={bet.id}
                  className={`p-3 rounded-2xl border text-xs space-y-2 transition-all ${
                    isPending
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                      : isWon
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  {/* Top Row: Game, Period, Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white uppercase text-[11px]">
                        {bet.game.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Period #{bet.period.slice(-6)}
                      </span>
                    </div>

                    <div>
                      {isPending && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          Live In Play
                        </span>
                      )}
                      {isWon && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Won +{formatINR(bet.payout || 0)}
                        </span>
                      )}
                      {isLost && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-[10px] flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Lost
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Row: Selection and Stake */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Selection</span>
                      <span className="font-bold text-slate-100">
                        {bet.betCategory}:{' '}
                        <strong className="text-amber-400">{bet.betValue}</strong>{' '}
                        <span className="text-slate-400 font-mono text-[10px]">({bet.multiplier}x)</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Stake</span>
                      <span className="font-mono font-bold text-slate-200">
                        {formatINR(bet.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Outcome & Timestamp */}
                  <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {bet.resultOutcome ? (
                        <span>
                          Draw Result: <strong className="text-slate-200">{bet.resultOutcome}</strong>
                        </span>
                      ) : (
                        <span className="text-amber-300">Awaiting round draw...</span>
                      )}
                    </span>
                    <span className="font-mono">
                      {new Date(bet.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase"
        >
          Close
        </button>
      </div>
    </div>
  );
};
