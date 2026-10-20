import React from 'react';
import { Trophy, Sparkles, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const WinAnnouncementModal: React.FC = () => {
  const { lastWinAnnouncement, dismissWinAnnouncement } = useGame();

  if (!lastWinAnnouncement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-xs bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismissWinAnnouncement}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Trophy */}
        <div className="mx-auto w-16 h-16 mb-3 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-amber-700 stroke-[2.2]" />
        </div>

        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          You Won!
          <Sparkles className="w-4 h-4 text-amber-500" />
        </h3>

        <p className="text-xs text-slate-500 mt-0.5">
          {lastWinAnnouncement.title}
        </p>

        <div className="my-4 py-2.5 px-3 bg-emerald-50 rounded-2xl border border-emerald-200">
          <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">Amount Won</span>
          <div className="text-2xl font-black text-emerald-700 font-mono tracking-tight mt-0.5">
            +{formatINR(lastWinAnnouncement.amount)}
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            dismissWinAnnouncement();
          }}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wide shadow-sm active:scale-95 transition-transform"
        >
          Collect Winnings
        </button>
      </div>
    </div>
  );
};
