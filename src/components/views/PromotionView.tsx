import React, { useState } from 'react';
import { Copy, Check, Share2, Award, DollarSign } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const PromotionView: React.FC = () => {
  const { user } = useGame();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const inviteUrl = `https://colour-trading-game.vercel.app/register?r=${user.referralCode}`;

  const copyCode = () => {
    navigator.clipboard?.writeText(user.referralCode);
    setCopiedCode(true);
    sound.playTap();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLink(true);
    sound.playTap();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-3.5 pb-24">
      {/* Promotion Header Banner (Clean Teal/Emerald) */}
      <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white shadow-sm space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
          Official Agent Program
        </span>
        <h2 className="text-xl font-black">
          Invite Friends & Earn Daily Cash
        </h2>
        <p className="text-xs text-emerald-100">
          Earn guaranteed commissions every single time your friends place a bet.
        </p>

        <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[9px] uppercase text-emerald-100 font-bold">Total Commission</span>
            <div className="font-mono font-black text-sm text-white mt-0.5">
              {formatINR(user.totalCommission)}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[9px] uppercase text-emerald-100 font-bold">Your Team</span>
            <div className="font-mono font-black text-sm text-white mt-0.5">
              {user.activeDownlines} Users
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[9px] uppercase text-emerald-100 font-bold">Today's Pay</span>
            <div className="font-mono font-black text-sm text-white mt-0.5">
              ₹480.00
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link & Code Box */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Your Invitation Code</span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1 text-xs text-emerald-700 font-bold hover:underline"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center font-mono font-black text-2xl text-slate-900 tracking-widest">
          {user.referralCode}
        </div>

        <button
          onClick={copyLink}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wide shadow-sm flex items-center justify-center gap-2 active:scale-95"
        >
          {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{copiedLink ? 'Link Copied!' : 'Copy Invitation Link'}</span>
        </button>
      </div>

      {/* 3-Tier Commission Structure */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-xs text-slate-900">How Commissions Work</h3>
        </div>

        <div className="space-y-1.5">
          {[
            { level: 'Tier 1 (Direct Friends)', rebate: '0.6% - 1.0%', desc: 'People who join directly with your link' },
            { level: 'Tier 2 (Sub-Friends)', rebate: '0.3% - 0.5%', desc: 'People invited by your friends' },
            { level: 'Tier 3 (Extended Team)', rebate: '0.1% - 0.2%', desc: 'Broader team members in your circle' },
          ].map((t, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-slate-800">{t.level}</span>
                <p className="text-[10px] text-slate-500">{t.desc}</p>
              </div>
              <span className="font-mono font-black text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                {t.rebate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Salary Milestones */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-xs text-slate-900">Fixed Daily Salary</h3>
        </div>

        <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
          <div className="grid grid-cols-3 py-2 px-3 bg-slate-100 text-[10px] font-bold text-slate-600 uppercase text-center border-b border-slate-200">
            <span>Active Bettors</span>
            <span>Turnover</span>
            <span>Daily Salary</span>
          </div>
          <div className="divide-y divide-slate-200 text-xs text-center">
            {[
              { users: '10 Users', turnover: '₹50,000', salary: '₹500 / day' },
              { users: '30 Users', turnover: '₹1.5 Lakh', salary: '₹1,500 / day' },
              { users: '100 Users', turnover: '₹5.0 Lakh', salary: '₹5,000 / day' },
              { users: '500 Users', turnover: '₹25.0 Lakh', salary: '₹25,000 / day' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 py-2 px-3 items-center">
                <span className="text-slate-800 font-medium">{row.users}</span>
                <span className="text-slate-500 font-mono text-[11px]">{row.turnover}</span>
                <span className="text-emerald-700 font-mono font-black">{row.salary}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
