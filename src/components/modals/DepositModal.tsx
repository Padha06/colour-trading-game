import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, Sparkles, Copy, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { deposit } = useGame();
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [channel, setChannel] = useState<'upi_qr' | 'phonepe' | 'gpay' | 'usdt'>('upi_qr');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const amounts = [200, 500, 1000, 2000, 5000, 10000];
  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleCopy = () => {
    navigator.clipboard?.writeText('royalwinpay@yesbank');
    setCopied(true);
    sound.playTap();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    if (finalAmount < 100) {
      alert('Minimum recharge is ₹100');
      return;
    }

    setIsProcessing(true);
    sound.playTap();

    setTimeout(() => {
      deposit(finalAmount);
      setIsProcessing(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Recharge / Add Balance</h3>
              <p className="text-[11px] text-slate-500">Fast UPI & Net Banking (Instant Demo)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Select Amount</label>
          <div className="grid grid-cols-3 gap-2">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  sound.playTap();
                  setSelectedAmount(amt);
                  setCustomAmount('');
                }}
                className={`py-2.5 rounded-xl border font-mono font-bold text-xs transition-all relative ${
                  selectedAmount === amt && !customAmount
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ₹{amt.toLocaleString()}
                {amt >= 2000 && (
                  <span className="absolute -top-1.5 -right-1 text-[8px] bg-red-600 text-white font-extrabold px-1 rounded-full">
                    +5%
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-2.5">
            <input
              type="number"
              placeholder="Or enter custom amount (min ₹100)"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(0);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>
        </div>

        {/* Payment Channels */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Payment Method</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'upi_qr', name: 'Instant UPI QR', badge: 'FAST', icon: QrCode },
              { id: 'phonepe', name: 'PhonePe', badge: 'POPULAR', icon: ShieldCheck },
              { id: 'gpay', name: 'Google Pay', badge: 'DIRECT', icon: ShieldCheck },
              { id: 'usdt', name: 'USDT Crypto', badge: 'CRYPTO', icon: Sparkles },
            ].map((ch) => {
              const Icon = ch.icon;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    sound.playTap();
                    setChannel(ch.id as typeof channel);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    channel === ch.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{ch.name}</div>
                      <span className="text-[9px] text-emerald-700 font-bold">{ch.badge}</span>
                    </div>
                  </div>
                  {channel === ch.id && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* UPI QR View */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
          <div className="inline-block p-2 bg-white rounded-xl shadow-xs border border-slate-200">
            <div className="w-24 h-24 bg-slate-900 flex flex-col items-center justify-center rounded-lg p-2 text-white">
              <QrCode className="w-16 h-16 text-white" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 mt-0.5">
                BHIM UPI
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <span>UPI ID: <strong className="text-slate-900">royalwinpay@yesbank</strong></span>
            <button
              onClick={handleCopy}
              className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-500">Scan via PhonePe, Google Pay, Paytm or any UPI app</p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            disabled={isProcessing}
            onClick={handleSimulatePayment}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wide shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Verifying UPI...</span>
            ) : (
              <span>Simulate Successful Recharge ({formatINR(finalAmount)})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
