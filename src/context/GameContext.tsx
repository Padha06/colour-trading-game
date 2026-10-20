import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  GameType, 
  NavTab, 
  BetRecord, 
  UserProfile, 
  WinGoRecord, 
  TRXRecord, 
  K3Record, 
  FiveDRecord, 
  AdminSettings, 
  ColorType 
} from '../types';
import { getNumberColor, getNumberSize, generatePeriodNumber, K3_SUM_MULTIPLIERS } from '../utils/gameHelpers';
import { sound } from '../utils/audio';

interface GameContextType {
  user: UserProfile;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeGame: GameType;
  setActiveGame: (game: GameType) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  
  // Timer & active round
  countdown: number;
  currentPeriod: string;
  isFrozen: boolean; // Last 5 seconds
  
  // Records & History
  winGoHistory: WinGoRecord[];
  trxHistory: TRXRecord[];
  k3History: K3Record[];
  fiveDHistory: FiveDRecord[];
  bets: BetRecord[];
  
  // Actions
  placeBet: (bet: Omit<BetRecord, 'id' | 'createdAt' | 'status'>) => boolean;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  redeemGiftCode: (code: string) => { success: boolean; message: string; amount?: number };
  resetDemoBalance: () => void;
  
  // Admin & Risk Control
  adminSettings: AdminSettings;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  forceNextResult: (result: number | null) => void;
  skipTimerToFiveSeconds: () => void;

  // Last win celebration popup
  lastWinAnnouncement: { title: string; amount: number } | null;
  dismissWinAnnouncement: () => void;
}

const initialUser: UserProfile = {
  uid: 'UID_89241',
  phone: '+91 98*** 54109',
  balance: 10000,
  vipLevel: 3,
  totalDeposit: 25000,
  totalWithdraw: 12500,
  referralCode: 'ROYAL88',
  activeDownlines: 34,
  totalCommission: 3840.50,
};

const initialWinGoHistory: WinGoRecord[] = [
  { period: '202610200192', number: 7, color: 'green', size: 'big', timestamp: Date.now() - 30000 },
  { period: '202610200191', number: 2, color: 'red', size: 'small', timestamp: Date.now() - 60000 },
  { period: '202610200190', number: 0, color: 'red-violet', size: 'small', timestamp: Date.now() - 90000 },
  { period: '202610200189', number: 9, color: 'green', size: 'big', timestamp: Date.now() - 120000 },
  { period: '202610200188', number: 5, color: 'green-violet', size: 'big', timestamp: Date.now() - 150000 },
  { period: '202610200187', number: 4, color: 'red', size: 'small', timestamp: Date.now() - 180000 },
  { period: '202610200186', number: 8, color: 'red', size: 'big', timestamp: Date.now() - 210000 },
  { period: '202610200185', number: 1, color: 'green', size: 'small', timestamp: Date.now() - 240000 },
  { period: '202610200184', number: 6, color: 'red', size: 'big', timestamp: Date.now() - 270000 },
  { period: '202610200183', number: 3, color: 'green', size: 'small', timestamp: Date.now() - 300000 },
];

const initialTRXHistory: TRXRecord[] = [
  { period: 'TRX202610200192', blockNumber: 68491204, blockHash: '0000000003ec7b8a1c94d0e5124f92bc31a8f987', number: 7, color: 'green', size: 'big', timestamp: Date.now() - 30000 },
  { period: 'TRX202610200191', blockNumber: 68491203, blockHash: '0000000003ec7b8a1c94d0e5124f92bc31a8f982', number: 2, color: 'red', size: 'small', timestamp: Date.now() - 60000 },
  { period: 'TRX202610200190', blockNumber: 68491202, blockHash: '0000000003ec7b8a1c94d0e5124f92bc31a8f980', number: 0, color: 'red-violet', size: 'small', timestamp: Date.now() - 90000 },
];

const initialK3History: K3Record[] = [
  { period: 'K3202610200192', dice: [2, 5, 4], sum: 11, size: 'big', parity: 'odd', timestamp: Date.now() - 30000 },
  { period: 'K3202610200191', dice: [1, 3, 2], sum: 6, size: 'small', parity: 'even', timestamp: Date.now() - 60000 },
  { period: 'K3202610200190', dice: [4, 4, 4], sum: 12, size: 'big', parity: 'even', isTriple: true, isPair: true, timestamp: Date.now() - 90000 },
];

const initial5DHistory: FiveDRecord[] = [
  { period: '5D202610200192', balls: [7, 2, 9, 0, 4], sum: 22, size: 'small', parity: 'even', timestamp: Date.now() - 30000 },
  { period: '5D202610200191', balls: [5, 6, 8, 3, 1], sum: 23, size: 'big', parity: 'odd', timestamp: Date.now() - 60000 },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('royalwin_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('games');
  const [activeGame, setActiveGame] = useState<GameType>('wingo');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Global 30-second cycle for demo responsiveness
  const [countdown, setCountdown] = useState<number>(30);
  const [currentPeriod, setCurrentPeriod] = useState<string>(() => generatePeriodNumber('20261020'));
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  const [winGoHistory, setWinGoHistory] = useState<WinGoRecord[]>(initialWinGoHistory);
  const [trxHistory, setTrxHistory] = useState<TRXRecord[]>(initialTRXHistory);
  const [k3History, setK3History] = useState<K3Record[]>(initialK3History);
  const [fiveDHistory, setFiveDHistory] = useState<FiveDRecord[]>(initial5DHistory);
  const [bets, setBets] = useState<BetRecord[]>([]);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    mode: 'fair',
    forcedResult: null,
    houseEdgePercent: 3,
  });

  const [lastWinAnnouncement, setLastWinAnnouncement] = useState<{ title: string; amount: number } | null>(null);

  // Sync user state to localStorage
  useEffect(() => {
    localStorage.setItem('royalwin_user', JSON.stringify(user));
  }, [user]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playTap();
  };

  // Main countdown timer loop
  const betsRef = useRef(bets);
  betsRef.current = bets;
  const adminRef = useRef(adminSettings);
  adminRef.current = adminSettings;
  const currentPeriodRef = useRef(currentPeriod);
  currentPeriodRef.current = currentPeriod;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Resolve Round
          resolveRound();
          return 30; // reset to 30s
        }

        const next = prev - 1;
        // Last 5 seconds: trigger sound and freeze
        if (next <= 5) {
          setIsFrozen(true);
          sound.playTick();
        } else {
          setIsFrozen(false);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Algorithm to compute winning digit
  const determineWinGoDigit = (currentBets: BetRecord[], period: string): number => {
    const admin = adminRef.current;
    
    // 1. Force Result Mode
    if (admin.forcedResult !== null && admin.forcedResult >= 0 && admin.forcedResult <= 9) {
      return admin.forcedResult;
    }

    const pendingBets = currentBets.filter(b => b.period === period && b.status === 'pending');

    // 2. Minimum-Payout Mode (House protection)
    if (admin.mode === 'min_payout' && pendingBets.length > 0) {
      // Calculate liability for each candidate digit 0-9
      let lowestLiability = Infinity;
      let bestDigit = 0;

      for (let digit = 0; digit <= 9; digit++) {
        let liability = 0;
        const color = getNumberColor(digit);
        const size = getNumberSize(digit);

        for (const bet of pendingBets) {
          if (bet.betCategory === 'Number' && Number(bet.betValue) === digit) {
            liability += bet.amount * 9;
          }
          if (bet.betCategory === 'Color') {
            if (bet.betValue === 'Green') {
              if (color === 'green') liability += bet.amount * 2;
              else if (digit === 5) liability += bet.amount * 1.5;
            } else if (bet.betValue === 'Red') {
              if (color === 'red') liability += bet.amount * 2;
              else if (digit === 0) liability += bet.amount * 1.5;
            } else if (bet.betValue === 'Violet') {
              if (digit === 0 || digit === 5) liability += bet.amount * 4.5;
            }
          }
          if (bet.betCategory === 'Size') {
            if (bet.betValue === 'Big' && size === 'big') liability += bet.amount * 2;
            if (bet.betValue === 'Small' && size === 'small') liability += bet.amount * 2;
          }
        }

        if (liability < lowestLiability) {
          lowestLiability = liability;
          bestDigit = digit;
        }
      }

      return bestDigit;
    }

    // 3. Fair Random Mode
    return Math.floor(Math.random() * 10);
  };

  const resolveRound = () => {
    const period = currentPeriodRef.current;
    const digit = determineWinGoDigit(betsRef.current, period);
    const color = getNumberColor(digit);
    const size = getNumberSize(digit);

    // 1. Update Win Go History
    const newWinGoRecord: WinGoRecord = {
      period,
      number: digit,
      color,
      size,
      timestamp: Date.now(),
    };
    setWinGoHistory(prev => [newWinGoRecord, ...prev.slice(0, 49)]);

    // 2. Update TRX Record
    const randomBlock = 68491200 + Math.floor(Math.random() * 500);
    const fakeHash = '0000000003ec7b8a1c94d0e5124f92bc31a8f98' + digit;
    const newTRXRecord: TRXRecord = {
      period: 'TRX' + period,
      blockNumber: randomBlock,
      blockHash: fakeHash,
      number: digit,
      color,
      size,
      timestamp: Date.now(),
    };
    setTrxHistory(prev => [newTRXRecord, ...prev.slice(0, 49)]);

    // 3. Update K3 Record
    const d1 = Math.floor(1 + Math.random() * 6);
    const d2 = Math.floor(1 + Math.random() * 6);
    const d3 = Math.floor(1 + Math.random() * 6);
    const k3Sum = d1 + d2 + d3;
    const newK3Record: K3Record = {
      period: 'K3' + period,
      dice: [d1, d2, d3],
      sum: k3Sum,
      size: k3Sum >= 11 ? 'big' : 'small',
      parity: k3Sum % 2 === 1 ? 'odd' : 'even',
      isTriple: d1 === d2 && d2 === d3,
      isPair: d1 === d2 || d2 === d3 || d1 === d3,
      timestamp: Date.now(),
    };
    setK3History(prev => [newK3Record, ...prev.slice(0, 49)]);

    // 4. Update 5D Record
    const b1 = Math.floor(Math.random() * 10);
    const b2 = Math.floor(Math.random() * 10);
    const b3 = Math.floor(Math.random() * 10);
    const b4 = Math.floor(Math.random() * 10);
    const b5 = Math.floor(Math.random() * 10);
    const fiveDSum = b1 + b2 + b3 + b4 + b5;
    const new5DRecord: FiveDRecord = {
      period: '5D' + period,
      balls: [b1, b2, b3, b4, b5],
      sum: fiveDSum,
      size: fiveDSum >= 23 ? 'big' : 'small',
      parity: fiveDSum % 2 === 1 ? 'odd' : 'even',
      timestamp: Date.now(),
    };
    setFiveDHistory(prev => [new5DRecord, ...prev.slice(0, 49)]);

    // 5. Evaluate Pending Bets for this period
    let totalWinPayout = 0;
    const updatedBets = betsRef.current.map(bet => {
      if (bet.period !== period || bet.status !== 'pending') {
        return bet;
      }

      let won = false;
      let payoutMultiplier = 0;

      // Handle Win Go & TRX bets
      if (bet.game === 'wingo' || bet.game === 'trx') {
        if (bet.betCategory === 'Number') {
          if (Number(bet.betValue) === digit) {
            won = true;
            payoutMultiplier = 9 * 0.98; // 9x minus 2% fee
          }
        } else if (bet.betCategory === 'Color') {
          if (bet.betValue === 'Green') {
            if (color === 'green') {
              won = true;
              payoutMultiplier = 2 * 0.98;
            } else if (digit === 5) {
              won = true;
              payoutMultiplier = 1.5 * 0.98;
            }
          } else if (bet.betValue === 'Red') {
            if (color === 'red') {
              won = true;
              payoutMultiplier = 2 * 0.98;
            } else if (digit === 0) {
              won = true;
              payoutMultiplier = 1.5 * 0.98;
            }
          } else if (bet.betValue === 'Violet') {
            if (digit === 0 || digit === 5) {
              won = true;
              payoutMultiplier = 4.5 * 0.98;
            }
          }
        } else if (bet.betCategory === 'Size') {
          if (bet.betValue === 'Big' && size === 'big') {
            won = true;
            payoutMultiplier = 2 * 0.98;
          } else if (bet.betValue === 'Small' && size === 'small') {
            won = true;
            payoutMultiplier = 2 * 0.98;
          }
        }
      }

      // Handle K3 bets
      if (bet.game === 'k3') {
        if (bet.betCategory === 'Sum') {
          if (Number(bet.betValue) === k3Sum) {
            won = true;
            payoutMultiplier = (K3_SUM_MULTIPLIERS[k3Sum] || 2) * 0.98;
          }
        } else if (bet.betCategory === 'Size') {
          if (bet.betValue === 'Big' && k3Sum >= 11) {
            won = true;
            payoutMultiplier = 1.96;
          } else if (bet.betValue === 'Small' && k3Sum <= 10) {
            won = true;
            payoutMultiplier = 1.96;
          }
        } else if (bet.betCategory === 'Parity') {
          if (bet.betValue === 'Odd' && k3Sum % 2 === 1) {
            won = true;
            payoutMultiplier = 1.96;
          } else if (bet.betValue === 'Even' && k3Sum % 2 === 0) {
            won = true;
            payoutMultiplier = 1.96;
          }
        } else if (bet.betCategory === 'Triple') {
          if (d1 === d2 && d2 === d3) {
            won = true;
            payoutMultiplier = 34.5;
          }
        }
      }

      // Handle 5D bets
      if (bet.game === '5d') {
        if (bet.betCategory === 'Total Size') {
          if (bet.betValue === 'Big' && fiveDSum >= 23) {
            won = true;
            payoutMultiplier = 1.96;
          } else if (bet.betValue === 'Small' && fiveDSum <= 22) {
            won = true;
            payoutMultiplier = 1.96;
          }
        } else if (bet.betCategory === 'Total Parity') {
          if (bet.betValue === 'Odd' && fiveDSum % 2 === 1) {
            won = true;
            payoutMultiplier = 1.96;
          } else if (bet.betValue === 'Even' && fiveDSum % 2 === 0) {
            won = true;
            payoutMultiplier = 1.96;
          }
        } else if (bet.betCategory === 'Ball A') {
          if (Number(bet.betValue) === b1) {
            won = true;
            payoutMultiplier = 9 * 0.98;
          }
        }
      }

      const payout = won ? Math.round(bet.amount * payoutMultiplier * 100) / 100 : 0;
      if (won) totalWinPayout += payout;

      const updatedStatus: 'won' | 'lost' = won ? 'won' : 'lost';

      let resultOutcome: string = '';
      if (bet.game === 'wingo' || bet.game === 'trx') {
        resultOutcome = `Digit ${digit} (${color.toUpperCase()}, ${size.toUpperCase()})`;
      } else if (bet.game === 'k3') {
        resultOutcome = `Dice [${d1},${d2},${d3}] = Sum ${k3Sum}`;
      } else if (bet.game === '5d') {
        resultOutcome = `Balls [${b1},${b2},${b3},${b4},${b5}] = Sum ${fiveDSum}`;
      }

      return {
        ...bet,
        status: updatedStatus,
        payout,
        resultOutcome,
        resolvedAt: Date.now(),
      };
    });

    setBets(updatedBets);

    // Credit winnings to user
    if (totalWinPayout > 0) {
      setUser(prev => ({
        ...prev,
        balance: Math.round((prev.balance + totalWinPayout) * 100) / 100,
      }));

      sound.playWin();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setLastWinAnnouncement({
        title: '🎉 Congratulations! You Won!',
        amount: totalWinPayout,
      });
    }

    // Reset force admin result
    if (adminRef.current.forcedResult !== null) {
      setAdminSettings(prev => ({ ...prev, forcedResult: null }));
    }

    // Advance to next period
    setCurrentPeriod(generatePeriodNumber('20261020'));
  };

  const placeBet = (betData: Omit<BetRecord, 'id' | 'createdAt' | 'status'>): boolean => {
    if (isFrozen) {
      alert('Bets are locked for the current period (Final 5s Freeze). Please wait for the next round.');
      return false;
    }

    if (user.balance < betData.amount) {
      alert('Insufficient wallet balance. Please recharge or use Demo balance.');
      return false;
    }

    // Deduct user balance
    setUser(prev => ({
      ...prev,
      balance: Math.round((prev.balance - betData.amount) * 100) / 100,
    }));

    const newBet: BetRecord = {
      ...betData,
      id: 'BET_' + Math.floor(100000 + Math.random() * 900000),
      createdAt: Date.now(),
      status: 'pending',
    };

    setBets(prev => [newBet, ...prev]);
    sound.playBet();
    return true;
  };

  const deposit = (amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalDeposit: prev.totalDeposit + amount,
    }));
    sound.playWin();
  };

  const withdraw = (amount: number): boolean => {
    if (user.balance < amount) return false;
    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount,
      totalWithdraw: prev.totalWithdraw + amount,
    }));
    sound.playTap();
    return true;
  };

  const redeemGiftCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const codes: Record<string, number> = {
      VIP888: 200,
      ROYALWIN: 500,
      DAMAN100: 100,
      FREEBET: 50,
    };

    if (codes[clean]) {
      const reward = codes[clean];
      setUser(prev => ({
        ...prev,
        balance: prev.balance + reward,
      }));
      sound.playWin();
      confetti({ particleCount: 50, spread: 50 });
      return { success: true, message: `Gift Code Redeemed! +₹${reward} added to your wallet!`, amount: reward };
    }

    return { success: false, message: 'Invalid or expired gift code. Try VIP888 or ROYALWIN.' };
  };

  const resetDemoBalance = () => {
    setUser(prev => ({ ...prev, balance: 10000 }));
    sound.playWin();
  };

  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...newSettings }));
  };

  const forceNextResult = (result: number | null) => {
    setAdminSettings(prev => ({ ...prev, forcedResult: result }));
  };

  const skipTimerToFiveSeconds = () => {
    setCountdown(6);
  };

  const dismissWinAnnouncement = () => {
    setLastWinAnnouncement(null);
  };

  return (
    <GameContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        activeGame,
        setActiveGame,
        soundEnabled,
        toggleSound,
        countdown,
        currentPeriod,
        isFrozen,
        winGoHistory,
        trxHistory,
        k3History,
        fiveDHistory,
        bets,
        placeBet,
        deposit,
        withdraw,
        redeemGiftCode,
        resetDemoBalance,
        adminSettings,
        updateAdminSettings,
        forceNextResult,
        skipTimerToFiveSeconds,
        lastWinAnnouncement,
        dismissWinAnnouncement,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
