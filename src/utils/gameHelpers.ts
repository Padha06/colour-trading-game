import { ColorType, SizeType } from '../types';

export const getNumberColor = (num: number): ColorType => {
  if (num === 0) return 'red-violet';
  if (num === 5) return 'green-violet';
  if ([1, 3, 7, 9].includes(num)) return 'green';
  return 'red';
};

export const getNumberSize = (num: number): SizeType => {
  return num >= 5 ? 'big' : 'small';
};

export const generatePeriodNumber = (gamePrefix: string = '20261020'): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  const rand = Math.floor(100 + Math.random() * 900);
  return `${gamePrefix}${hours}${mins}${secs.slice(0, 1)}${rand}`;
};

export const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val).replace('₹', '₹ ');
};

export const K3_SUM_MULTIPLIERS: Record<number, number> = {
  3: 207.36,
  4: 69.12,
  5: 34.56,
  6: 20.73,
  7: 13.82,
  8: 9.88,
  9: 6.91,
  10: 6.91,
  11: 6.91,
  12: 6.91,
  13: 9.88,
  14: 13.82,
  15: 20.73,
  16: 34.56,
  17: 69.12,
  18: 207.36,
};
