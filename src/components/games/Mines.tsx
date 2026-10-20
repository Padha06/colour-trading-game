import React, { useState } from 'react';
import { Bomb, Gem, Sparkles, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { formatINR } from '../../utils/gameHelpers';
import { sound } from '../../utils/audio';

export const Mines: React.FC = () => {
  const { user, placeBet, deposit } = useGame();

  const [stake, setStake] = useState<number>(50);
  const [mineCount, setMineCount] = useState<number>(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'cashed' | 'busted'>('idle');
  
  const [grid, setGrid] = useState<Array<{ index: number; isMine: boolean; revealed: boolean }>>(() =>
    Array.from({ length: 25 }, (_, i) => ({ index: i, isMine: false, revealed: false }))
  );
  const [gemsFound, setGemsFound] = useState<number>(0);

  const getMultiplier = (gems: number, mines: number): number => {
    if (gems === 0) return 1.0;
    let mult = 1.0;
    let total = 25;
    let safe = total - mines;
    for (let i = 0; i < gems; i++) {
      mult *= (total - i) / (safe - i);
    }
    return Math.max(1.05, Math.round(mult * 0.97 * 100) / 100);
  };

  const currentMultiplier = getMultiplier(gemsFound, mineCount);
  const currentCashout = Math.round(stake * currentMultiplier * 100) / 100;

  const handleStartGame = () => {
    if (user.balance < stake) {
      alert('Insufficient wallet balance to start round.');
      return;
    }

    const placed = placeBet({
      game: 'mines',
      period: 'MINES_' + Date.now().toString().slice(-6),
      betCategory: 'Mines',
      betValue: `${mineCount} Mines`,
      amount: stake,
      multiplier: 1,
    });

    if (!placed) return;

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
      sound.playBomb();
      setGrid((prev) =>
        prev.map((t) => ({
          ...t,
          revealed: true,
        }))
      );
      setGameState('busted');
    } else {
      sound.playGem();
      const nextGems = gemsFound + 1;
      setGemsFound(nextGems);
      setGrid((prev) =>
        prev.map((t) => (t.index === index ? { ...t, revealed: true } : t))
      );

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

    deposit(currentCashout);
    setGameState('cashed');

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
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900">MINES (MINESWEEPER)</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1 rounded font-bold">
                CASHOUT
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Tap gems and cash out anytime before hitting a mine</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 font-bold block">Multiplier</span>
          <span className="font-mono text-emerald-700 font-black text-base">
            {currentMultiplier.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Stake & Mines Selector Controls */}
      {gameState !== 'playing' && (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bet Amount (₹)</label>
              <div className="flex gap-1">
                {[20, 50, 100, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      sound.playTap();
                      setStake(amt);
                    }}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      stake === amt ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mines Count</label>
              <div className="flex gap-1">
                {[1, 3, 5, 10].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => {
                      sound.playTap();
                      setMineCount(cnt);
                    }}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                      mineCount === cnt ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wide shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Mines Game ({formatINR(stake)})</span>
          </button>
        </div>
      )}

      {/* 5x5 Mines Board */}
      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm relative">
        <div className="grid grid-cols-5 gap-2.5 max-w-xs mx-auto">
          {grid.map((tile) => {
            let bgClass = 'bg-slate-100 hover:bg-slate-200 border-slate-200';
            let content = null;

            if (tile.revealed) {
              if (tile.isMine) {
                bgClass = 'bg-red-50 border-red-300 text-red-600';
                content = <Bomb className="w-6 h-6 fill-red-500 text-red-600" />;
              } else {
                bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-600 shadow-sm';
                content = <Gem className="w-6 h-6 fill-emerald-500 text-emerald-600" />;
              }
            }

            return (
              <button
                key={tile.index}
                disabled={gameState !== 'playing' || tile.revealed}
                onClick={() => handleTileClick(tile.index)}
                className={`w-full aspect-square rounded-2xl border-2 flex items-center justify-center transition-all transform active:scale-95 ${bgClass} ${
                  gameState === 'playing' && !tile.revealed ? 'cursor-pointer hover:border-emerald-400' : ''
                }`}
              >
                {content}
              </button>
            );
          })}
        </div>

        {/* Status Messages */}
        {gameState === 'cashed' && (
          <div className="mt-3 py-2 px-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs text-emerald-800 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Successfully Cashed Out {formatINR(currentCashout)}!</span>
          </div>
        )}

        {gameState === 'busted' && (
          <div className="mt-3 py-2 px-3 bg-red-50 border border-red-300 rounded-xl text-center text-xs text-red-700 font-bold flex items-center justify-center gap-1.5">
            <Bomb className="w-4 h-4 text-red-600" />
            <span>Hit a mine! Stake of {formatINR(stake)} lost.</span>
          </div>
        )}
      </div>

      {/* Cash Out Button while playing */}
      {gameState === 'playing' && (
        <div className="space-y-2">
          <button
            disabled={gemsFound === 0}
            onClick={handleCashOut}
            className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wide transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 ${
              gemsFound === 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                : 'bg-emerald-600 text-white shadow-emerald-600/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {gemsFound === 0
                ? 'Select a safe tile to unlock Cashout'
                : `Cash Out ${formatINR(currentCashout)} (${currentMultiplier.toFixed(2)}x)`}
            </span>
          </button>
          <div className="text-center text-[11px] text-slate-500">
            Gems Found: <strong className="text-emerald-700">{gemsFound}</strong> | Remaining Safe:{' '}
            <strong className="text-slate-800">{25 - mineCount - gemsFound}</strong>
          </div>
        </div>
      )}
    </div>
  );
};
