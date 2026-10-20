import React from 'react';
import { Trophy, Sparkles, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const WinAnnouncementModal: React.FC = () => {
  const { lastWinAnnouncement, dismissWinAnnouncement } = useGame();

  if (!lastWinAnnouncement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xs bg-gradient-to-b from-amber-900/90 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-400 p-6 text-center shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismissWinAnnouncement}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Trophy Glow */}
        <div className="relative mx-auto w-20 h-20 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center shadow-lg shadow-amber-500/50 relative z-10">
            <Trophy className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
        </div>

        <h3 className="text-lg font-black text-white tracking-wide flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-300" />
          BIG WIN!
          <Sparkles className="w-4 h-4 text-amber-300" />
        </h3>

        <p className="text-xs text-amber-200/80 font-medium mt-1">
          {lastWinAnnouncement.title}
        </p>

        <div className="my-4 py-2 px-3 bg-slate-900/90 rounded-2xl border border-amber-400/30">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Winning Credit</span>
          <div className="text-3xl font-black text-amber-400 font-mono tracking-tight mt-0.5">
            +{formatINR(lastWinAnnouncement.amount)}
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            dismissWinAnnouncement();
          }}
          className="w-full py-3 rounded-xl gradient-gold text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
        >
          Collect Winnings
        </button>
      </div>
    </div>
  );
};
