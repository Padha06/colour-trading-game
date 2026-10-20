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
    <div className="space-y-3.5 pb-24">
      {/* Profile Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-black text-xl shadow-inner">
              <User className="w-6 h-6 text-slate-700" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">{user.phone}</h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                <Crown className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                VIP {user.vipLevel}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-slate-500">UID: {user.uid}</span>
              <button
                onClick={handleCopyUid}
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                {copiedUid ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Demo Wallet Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Wallet Balance</span>
            <div className="text-xl font-black text-emerald-700 font-mono">
              {formatINR(user.balance)}
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              resetDemoBalance();
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo (₹10,000)</span>
          </button>
        </div>
      </div>

      {/* VIP Progression Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>VIP 3 Member</span>
          </div>
          <span className="text-slate-500">Next: VIP 4 (65%)</span>
        </div>

        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-[65%] bg-emerald-600 rounded-full" />
        </div>

        <p className="text-[10px] text-slate-500">
          Bet ₹35,000 more to unlock VIP 4 benefits & faster withdrawals.
        </p>
      </div>

      {/* Gift Code (Lifafa) Form */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Redeem Gift Code (Lifafa)</h4>
            <p className="text-[10px] text-slate-500">Enter code from our Telegram channel for free credits</p>
          </div>
        </div>

        <form onSubmit={handleRedeem} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              placeholder="Enter Code (e.g. VIP888)"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono uppercase focus:outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-extrabold text-xs uppercase shadow-sm active:scale-95"
            >
              Redeem
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span>Demo Test Codes:</span>
            <button
              type="button"
              onClick={() => setGiftCode('VIP888')}
              className="text-emerald-700 font-bold hover:underline font-mono"
            >
              VIP888 (+₹200)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setGiftCode('ROYALWIN')}
              className="text-emerald-700 font-bold hover:underline font-mono"
            >
              ROYALWIN (+₹500)
            </button>
          </div>

          {feedback && (
            <div className={`p-2 rounded-lg text-xs font-bold ${
              feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {feedback.message}
            </div>
          )}
        </form>
      </div>

      {/* Support & Security */}
      <div className="space-y-2">
        <a
          href="#support"
          onClick={(e) => {
            e.preventDefault();
            sound.playTap();
            alert('Connected to 24/7 WhatsApp / Telegram Support Concierge.');
          }}
          className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-800">24/7 Telegram & WhatsApp Support</span>
              <p className="text-[10px] text-slate-500">Fast assistance for recharge and withdrawal</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </a>

        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-[11px] text-slate-600">
            KYC Verified • 18+ Responsible Gaming tools active.
          </div>
        </div>
      </div>
    </div>
  );
};
