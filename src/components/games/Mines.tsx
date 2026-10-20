import React, { useState } from 'react';
import { Bomb, Gem, Sparkles, Play, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const Mines: React.FC = () => {
  const { user, placeBet, deposit } = useGame();

  const [stake, setStake] = useState<number>(50);
  const [mineCount, setMineCount] = useState<number>(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'cashed' | 'busted'>('idle');
  
  // 25 tiles: { index: number, isMine: boolean, revealed: boolean }
  const [grid, setGrid] = useState<Array<{ index: number; isMine: boolean; revealed: boolean }>>(() =>
    Array.from({ length: 25 }, (_, i) => ({ index: i, isMine: false, revealed: false }))
  );
  const [gemsFound, setGemsFound] = useState<number>(0);

  // Progressive multiplier calculation
  const getMultiplier = (gems: number, mines: number): number => {
    if (gems === 0) return 1.0;
    let mult = 1.0;
    let total = 25;
    let safe = total - mines;
    for (let i = 0; i < gems; i++) {
      mult *= (total - i) / (safe - i);
    }
    // 3% house edge deduction
    return Math.max(1.05, Math.round(mult * 0.97 * 100) / 100);
  };

  const currentMultiplier = getMultiplier(gemsFound, mineCount);
  const currentCashout = Math.round(stake * currentMultiplier * 100) / 100;

  const handleStartGame = () => {
    if (user.balance < stake) {
      alert('Insufficient wallet balance to start round.');
      return;
    }

    // Deduct stake
    const placed = placeBet({
      game: 'mines',
      period: 'MINES_' + Date.now().toString().slice(-6),
      betCategory: 'Mines',
      betValue: `${mineCount} Mines`,
      amount: stake,
      multiplier: 1,
    });

    if (!placed) return;

    // Distribute mines randomly
    const mineIndices = new Set<number>();
    while (mineIndices.size < mineCount) {
      mineIndices.add(Math.floor(Math.random() * 25));
    }

    setGrid(
      Array.from({ length: 25 }, (_, i) => ({
        index: i,
        isMine: mineIndices.has(i),
        revealed: false,
      }))
    );
    setGemsFound(0);
    setGameState('playing');
    sound.playTap();
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;
    const tile = grid[index];
    if (tile.revealed) return;

    if (tile.isMine) {
      // Hit Bomb!
      sound.playBomb();
      setGrid((prev) =>
        prev.map((t) => ({
          ...t,
          revealed: true, // reveal all
        }))
      );
      setGameState('busted');
    } else {
      // Safe Gem Found!
      sound.playGem();
      const nextGems = gemsFound + 1;
      setGemsFound(nextGems);
      setGrid((prev) =>
        prev.map((t) => (t.index === index ? { ...t, revealed: true } : t))
      );

      // If all safe tiles found -> auto cashout
      if (nextGems === 25 - mineCount) {
        handleCashOut();
      }
    }
  };

  const handleCashOut = () => {
    if (gameState !== 'playing' || gemsFound === 0) return;

    sound.playWin();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    // Credit winnings
    deposit(currentCashout);
    setGameState('cashed');

    // Reveal rest of grid
    setGrid((prev) =>
      prev.map((t) => ({
        ...t,
        revealed: true,
      }))
    );
  };

  return (
    <div className="space-y-3 pb-24">
      {/* Header Banner */}
      <div className="p-3 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black">
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white">MINES (MINESWEEPER)</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 rounded font-bold">
                CASHOUT GAME
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Tap gems & cash out before detonating a mine</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold block">Current Multiplier</span>
          <span className="font-mono text-emerald-400 font-black text-base">
            {currentMultiplier.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Stake & Mines Selector Controls (when not playing) */}
      {gameState !== 'playing' && (
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Stake Input */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Bet Amount (₹)</label>
              <div className="flex gap-1">
                {[20, 50, 100, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      sound.playTap();
                      setStake(amt);
                    }}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      stake === amt ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Mine Count Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Mines Count</label>
              <div className="flex gap-1">
                {[1, 3, 5, 10].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => {
                      sound.playTap();
                      setMineCount(cnt);
                    }}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      mineCount === cnt ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    💣 {cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-3 rounded-xl gradient-gold text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Mines Game ({formatINR(stake)})</span>
          </button>
        </div>
      )}

      {/* 5x5 Mines Board */}
      <div className="p-4 bg-slate-950 rounded-3xl border border-slate-800/80 shadow-2xl relative">
        <div className="grid grid-cols-5 gap-2.5 max-w-xs mx-auto">
          {grid.map((tile) => {
            let bgClass = 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700';
            let content = null;

            if (tile.revealed) {
              if (tile.isMine) {
                bgClass = 'bg-rose-600/40 border-rose-500 text-rose-300 animate-pulse';
                content = <Bomb className="w-6 h-6 fill-rose-500 text-rose-300" />;
              } else {
                bgClass = 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20';
                content = <Gem className="w-6 h-6 fill-emerald-400 text-emerald-200 animate-bounce-short" />;
              }
            }

            return (
              <button
                key={tile.index}
                disabled={gameState !== 'playing' || tile.revealed}
                onClick={() => handleTileClick(tile.index)}
                className={`w-full aspect-square rounded-2xl border-2 flex items-center justify-center transition-all transform active:scale-90 ${bgClass} ${
                  gameState === 'playing' && !tile.revealed ? 'cursor-pointer hover:border-amber-400/50' : ''
                }`}
              >
                {content}
              </button>
            );
          })}
        </div>

        {/* Status Overlays */}
        {gameState === 'cashed' && (
          <div className="mt-3 py-2 px-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5 animate-scale-up">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Successfully Cashed Out {formatINR(currentCashout)}!</span>
          </div>
        )}

        {gameState === 'busted' && (
          <div className="mt-3 py-2 px-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-center text-xs text-rose-300 font-bold flex items-center justify-center gap-1.5 animate-scale-up">
            <Bomb className="w-4 h-4 text-rose-400" />
            <span>Mine Detonated! Stake of {formatINR(stake)} lost.</span>
          </div>
        )}
      </div>

      {/* Cash Out Button while playing */}
      {gameState === 'playing' && (
        <div className="space-y-2">
          <button
            disabled={gemsFound === 0}
            onClick={handleCashOut}
            className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
              gemsFound === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'gradient-green text-white shadow-emerald-500/30 animate-pulse'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {gemsFound === 0
                ? 'Select a safe tile to unlock Cashout'
                : `Cash Out ${formatINR(currentCashout)} (${currentMultiplier.toFixed(2)}x)`}
            </span>
          </button>
          <div className="text-center text-[11px] text-slate-400">
            Gems Found: <strong className="text-emerald-400">{gemsFound}</strong> | Remaining Safe:{' '}
            <strong className="text-slate-200">{25 - mineCount - gemsFound}</strong>
          </div>
        </div>
      )}
    </div>
  );
};
