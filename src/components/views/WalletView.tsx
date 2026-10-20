import React from 'react';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, History, ShieldCheck } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

interface WalletViewProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ onOpenDeposit, onOpenWithdraw }) => {
  const { user, bets } = useGame();

  return (
    <div className="space-y-3.5 pb-24">
      {/* Balance Hero Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Available Balance</span>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            VIP {user.vipLevel} Active
          </span>
        </div>

        <div>
          <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {formatINR(user.balance)}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Instant Withdrawal to Bank / UPI</p>
        </div>

        {/* Deposit & Withdraw CTA */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              sound.playTap();
              onOpenDeposit();
            }}
            className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wide shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
            <span>Recharge</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onOpenWithdraw();
            }}
            className="py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Total Deposited</span>
          <div className="text-base font-black text-slate-900 font-mono mt-0.5">
            {formatINR(user.totalDeposit)}
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Total Withdrawn</span>
          <div className="text-base font-black text-slate-900 font-mono mt-0.5">
            {formatINR(user.totalWithdraw)}
          </div>
        </div>
      </div>

      {/* Payment Security */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-sm text-xs">
        <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        <div>
          <span className="font-bold text-slate-800">100% Safe UPI Settlement</span>
          <p className="text-[10px] text-slate-500">Fast payout direct to your PhonePe, Google Pay or Paytm UPI.</p>
        </div>
      </div>

      {/* Recent Ledger */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="font-bold text-xs text-slate-800">Recent Transactions</h3>
          </div>
          <span className="text-[10px] text-slate-500">{bets.length} Records</span>
        </div>

        {bets.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No transactions yet. Place your first bet to get started!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {bets.slice(0, 10).map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">
                    {b.game.toUpperCase()} • {b.betCategory} ({b.betValue})
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {b.id} • {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-800">
                    -{formatINR(b.amount)}
                  </div>
                  <div>
                    {b.status === 'won' && (
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">
                        +{formatINR(b.payout || 0)}
                      </span>
                    )}
                    {b.status === 'lost' && (
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Lost
                      </span>
                    )}
                    {b.status === 'pending' && (
                      <span className="text-[10px] text-amber-600 font-bold">
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
