import React, { useState } from 'react';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, History, ShieldCheck, CreditCard } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

interface WalletViewProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ onOpenDeposit, onOpenWithdraw }) => {
  const { user, bets } = useGame();
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals'>('all');

  return (
    <div className="space-y-4 pb-24">
      {/* Wallet Balance Hero Card */}
      <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Balance</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
            VIP 3 Privileges
          </span>
        </div>

        <div className="mt-3">
          <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
            {formatINR(user.balance)}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">Withdrawable via Instant IMPS / UPI</p>
        </div>

        {/* Deposit & Withdraw CTA */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playTap();
              onOpenDeposit();
            }}
            className="py-3 rounded-2xl gradient-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
            <span>Recharge</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onOpenWithdraw();
            }}
            className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Deposited</span>
          <div className="text-base font-black text-white font-mono mt-0.5">
            {formatINR(user.totalDeposit)}
          </div>
        </div>

        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Withdrawn</span>
          <div className="text-base font-black text-white font-mono mt-0.5">
            {formatINR(user.totalWithdraw)}
          </div>
        </div>
      </div>

      {/* Payment Security Verification */}
      <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        <div className="text-xs">
          <span className="font-bold text-slate-200">Bank-Grade 256-bit Encryption</span>
          <p className="text-[10px] text-slate-400">All UPI & IMPS transfers are settled via RBI authorized banking nodes.</p>
        </div>
      </div>

      {/* Recent Activity Ledger */}
      <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-xs text-slate-200">Recent Bet Ledger</h3>
          </div>
          <span className="text-[10px] text-slate-400">{bets.length} Records</span>
        </div>

        {bets.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No transactions yet. Place a bet to generate activity!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 max-h-60 overflow-y-auto">
            {bets.slice(0, 10).map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">
                    {b.game.toUpperCase()} • {b.betCategory} ({b.betValue})
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {b.id} • {new Date(b.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-200">
                    -{formatINR(b.amount)}
                  </div>
                  <div>
                    {b.status === 'won' && (
                      <span className="text-[10px] text-emerald-400 font-bold font-mono">
                        +{formatINR(b.payout || 0)}
                      </span>
                    )}
                    {b.status === 'lost' && (
                      <span className="text-[10px] text-rose-400 font-semibold">
                        Lost
                      </span>
                    )}
                    {b.status === 'pending' && (
                      <span className="text-[10px] text-amber-400 font-bold animate-pulse">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
