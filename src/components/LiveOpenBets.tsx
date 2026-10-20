import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatINR } from '../utils/gameHelpers';
import { GameType } from '../types';

interface LiveOpenBetsProps {
  gameFilter?: GameType;
  onViewAll?: () => void;
}

export const LiveOpenBets: React.FC<LiveOpenBetsProps> = ({ gameFilter, onViewAll }) => {
  const { bets, currentPeriod, countdown, isFrozen } = useGame();

  const openBets = bets.filter((b) => {
    if (b.status !== 'pending') return false;
    if (gameFilter && b.game !== gameFilter) return false;
    return true;
  });

  if (openBets.length === 0) return null;

  const totalOpenStake = openBets.reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-3 shadow-sm space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="font-extrabold text-xs text-amber-900 uppercase tracking-wide flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Your Live Bets ({openBets.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-amber-800">
            Total Stake: <strong className="font-mono">{formatINR(totalOpenStake)}</strong>
          </span>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-[10px] text-amber-900 font-extrabold underline"
            >
              View All
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
              className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between text-xs shadow-sm"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-800">
                    {bet.betCategory}:{' '}
                    <span className="text-emerald-700 font-black">{bet.betValue}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                    {bet.multiplier}x
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                  <span>Period #{bet.period.slice(-5)}</span>
                  <span>•</span>
                  <span>Bet: <strong className="text-slate-700">{formatINR(bet.amount)}</strong></span>
                </div>
              </div>

              {/* Status and Potential Return */}
              <div className="text-right space-y-0.5">
                <div className="text-[10px] text-slate-500 font-medium">Est. Win</div>
                <div className="font-mono font-black text-emerald-600 text-xs">
                  +{formatINR(estimatedPayout)}
                </div>
                <div className="flex items-center justify-end gap-1 text-[9px] text-amber-700 font-bold">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{isFrozen ? 'Drawing...' : `${countdown}s left`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
