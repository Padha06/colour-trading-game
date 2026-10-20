import React, { useState } from 'react';
import { X, ArrowDownToLine, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { user, withdraw } = useGame();
  const [amount, setAmount] = useState<string>('1000');
  const [upiId, setUpiId] = useState<string>('player98@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const withdrawAmount = Number(amount) || 0;
  const canWithdraw = withdrawAmount >= 200 && withdrawAmount <= user.balance;

  const handleWithdraw = () => {
    if (!canWithdraw) return;

    setIsProcessing(true);
    sound.playTap();

    setTimeout(() => {
      const ok = withdraw(withdrawAmount);
      setIsProcessing(false);
      if (ok) {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          onClose();
        }, 1500);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#131d31] rounded-3xl border border-slate-700/80 p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">Withdraw Winnings</h3>
              <p className="text-[11px] text-slate-400">24/7 Automated UPI / IMPS Payout</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Withdrawable Balance</span>
            <div className="text-xl font-black text-amber-400 font-mono">
              {formatINR(user.balance)}
            </div>
          </div>
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            0% Withdrawal Fee (VIP 3)
          </span>
        </div>

        {/* UPI Target */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Receiving UPI ID / VPA
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g. yourname@oksbi"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-300">Amount (₹)</label>
            <button
              onClick={() => setAmount(String(Math.floor(user.balance)))}
              className="text-[11px] text-amber-400 font-bold hover:underline"
            >
              All In ({formatINR(user.balance)})
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Min ₹200"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
          />
          <div className="flex gap-2 mt-2">
            {[500, 1000, 2000, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  sound.playTap();
                  setAmount(String(amt));
                }}
                className="flex-1 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawal Rules */}
        <div className="space-y-1 text-[10px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant IMPS Settlement</span>
          </div>
          <p>• Daily free withdrawal quota: 3 times</p>
          <p>• Payout arrival time: 1 to 5 minutes to Indian bank account</p>
          <p>• Single transaction limit: ₹200 – ₹50,000</p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Withdrawal request submitted! ₹{amount} routed to IMPS.</span>
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={!canWithdraw || isProcessing || successMsg}
          onClick={handleWithdraw}
          className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 ${
            !canWithdraw || isProcessing || successMsg
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'gradient-gold text-slate-950 shadow-lg shadow-amber-500/20'
          }`}
        >
          {isProcessing ? 'Processing IMPS Transfer...' : `Confirm Withdrawal (${formatINR(withdrawAmount)})`}
        </button>
      </div>
    </div>
  );
};
