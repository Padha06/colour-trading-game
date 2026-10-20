import React from 'react';
import { Clock, Zap, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatINR } from '../utils/gameHelpers';
import { GameType } from '../types';

interface LiveOpenBetsProps {
  gameFilter?: GameType;
  onViewAll?: () => void;
}

export const LiveOpenBets: React.FC<LiveOpenBetsProps> = ({ gameFilter, onViewAll }) => {
  const { bets, currentPeriod, countdown, isFrozen } = useGame();

  // Find all pending bets for this round
  const openBets = bets.filter((b) => {
    if (b.status !== 'pending') return false;
    if (gameFilter && b.game !== gameFilter) return false;
    return true;
  });

  if (openBets.length === 0) return null;

  const totalOpenStake = openBets.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 rounded-2xl border-2 border-amber-500/50 p-3.5 shadow-xl animate-scale-up space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-extrabold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            Live Open Bets ({openBets.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-300">
            Total Stake: <strong className="text-amber-400">{formatINR(totalOpenStake)}</strong>
          </span>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-[10px] text-amber-400 font-bold hover:underline"
            >
              All Bets
            </button>
          )}
        </div>
      </div>

      {/* List of Open Bets */}
      <div className="space-y-1.5">
        {openBets.map((bet) => {
          const estimatedPayout = Math.round(bet.amount * bet.multiplier * 0.98 * 100) / 100;

          return (
            <div
              key={bet.id}
              className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between text-xs transition-all"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-100">
                    {bet.betCategory}:{' '}
                    <span className="text-amber-400 font-black">{bet.betValue}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                    {bet.multiplier}x
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <span>Period #{bet.period.slice(-6)}</span>
                  <span>•</span>
                  <span>Stake: <strong className="text-slate-200">{formatINR(bet.amount)}</strong></span>
                </div>
              </div>

              {/* Status and Potential Return */}
              <div className="text-right space-y-0.5">
                <div className="text-[10px] text-slate-400 font-medium">Est. Payout</div>
                <div className="font-mono font-black text-emerald-400 text-xs">
                  +{formatINR(estimatedPayout)}
                </div>
                <div className="flex items-center justify-end gap-1 text-[9px] text-amber-300/90 font-bold">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{isFrozen ? 'Revealing...' : `Draw in ${countdown}s`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
