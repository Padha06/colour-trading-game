import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  Gift, 
  Copy, 
  Check, 
  Headphones, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight, 
  Sparkles,
  Award
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const AccountView: React.FC = () => {
  const { user, redeemGiftCode, resetDemoBalance } = useGame();

  const [giftCode, setGiftCode] = useState('');
  const [copiedUid, setCopiedUid] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCopyUid = () => {
    navigator.clipboard?.writeText(user.uid);
    setCopiedUid(true);
    sound.playTap();
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCode.trim()) return;

    sound.playTap();
    const res = redeemGiftCode(giftCode);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setGiftCode('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }

    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Profile Header Card */}
      <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/30">
              <User className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-amber-400 flex items-center justify-center">
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">{user.phone}</h3>
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Crown className="w-2.5 h-2.5 fill-slate-950" />
                VIP {user.vipLevel}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-slate-400">UID: {user.uid}</span>
              <button
                onClick={handleCopyUid}
                className="text-slate-400 hover:text-white p-0.5 rounded"
              >
                {copiedUid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Balance Snapshot */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Demo Wallet</span>
            <div className="text-xl font-black text-amber-400 font-mono">
              {formatINR(user.balance)}
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              resetDemoBalance();
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* VIP Progression Bar */}
      <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Award className="w-4 h-4 text-amber-400" />
            <span>VIP 3 Member</span>
          </div>
          <span className="text-slate-400">Next: VIP 4 (65%)</span>
        </div>

        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full w-[65%] gradient-gold rounded-full" />
        </div>

        <p className="text-[10px] text-slate-400">
          Bet ₹35,000 more to unlock VIP 4: Daily Salary + ₹1,000 Level-Up Bonus.
        </p>
      </div>

      {/* Gift Code (Lifafa / Red Envelope) Form */}
      <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-200">Redeem Gift Code (Lifafa)</h4>
            <p className="text-[10px] text-slate-400">Telegram viral promo codes for instant wallet cash</p>
          </div>
        </div>

        <form onSubmit={handleRedeem} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              placeholder="Enter Gift Code (e.g. VIP888)"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-xl gradient-gold text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-transform"
            >
              Redeem
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Demo Test Codes:</span>
            <button
              type="button"
              onClick={() => setGiftCode('VIP888')}
              className="text-amber-400 font-bold hover:underline font-mono"
            >
              VIP888 (+₹200)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setGiftCode('ROYALWIN')}
              className="text-amber-400 font-bold hover:underline font-mono"
            >
              ROYALWIN (+₹500)
            </button>
          </div>

          {feedback && (
            <div className={`p-2 rounded-lg text-xs font-bold ${
              feedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {feedback.message}
            </div>
          )}
        </form>
      </div>

      {/* Customer Service & Support */}
      <div className="space-y-2">
        <a
          href="#support"
          onClick={(e) => {
            e.preventDefault();
            sound.playTap();
            alert('Live Customer Concierge: Connected to 24/7 Agent Support.');
          }}
          className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-200">24/7 Telegram Customer Service</span>
              <p className="text-[10px] text-slate-400">Recharge & withdrawal support</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </a>

        <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-[11px] text-slate-400">
            KYC Verified • Self-exclusion & 18+ Responsible Gaming tools active.
          </div>
        </div>
      </div>
    </div>
  );
};
