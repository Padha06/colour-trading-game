export type GameType = 'wingo' | 'trx' | 'k3' | '5d' | 'mines';

export type NavTab = 'home' | 'games' | 'promotion' | 'wallet' | 'account';

export type ColorType = 'green' | 'red' | 'violet' | 'red-violet' | 'green-violet';
export type SizeType = 'big' | 'small';

export interface WinGoRecord {
  period: string;
  number: number;
  color: ColorType;
  size: SizeType;
  timestamp: number;
}

export interface TRXRecord {
  period: string;
  blockNumber: number;
  blockHash: string;
  number: number;
  color: ColorType;
  size: SizeType;
  timestamp: number;
}

export interface K3Record {
  period: string;
  dice: [number, number, number];
  sum: number;
  size: SizeType;
  parity: 'odd' | 'even';
  isTriple?: boolean;
  isPair?: boolean;
  timestamp: number;
}

export interface FiveDRecord {
  period: string;
  balls: [number, number, number, number, number];
  sum: number;
  size: SizeType;
  parity: 'odd' | 'even';
  timestamp: number;
}

export interface BetRecord {
  id: string;
  game: GameType;
  period: string;
  betCategory: string; // e.g. "Color", "Number", "Size", "Sum", "Triple"
  betValue: string | number; // e.g. "Green", 7, "Big", 12
  amount: number;
  multiplier: number;
  payout?: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: number;
  resultOutcome?: string | number;
  resolvedAt?: number;
}

export interface UserProfile {
  uid: string;
  phone: string;
  balance: number;
  vipLevel: number;
  totalDeposit: number;
  totalWithdraw: number;
  referralCode: string;
  activeDownlines: number;
  totalCommission: number;
}

export type AdminAlgoMode = 'fair' | 'min_payout' | 'force';

export interface AdminSettings {
  mode: AdminAlgoMode;
  forcedResult: number | null;
  houseEdgePercent: number;
}
