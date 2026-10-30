import { AdditionProblem } from '../types';

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function simplifyFraction(num: number, den: number): { num: number; den: number } {
  if (den === 0) return { num: 0, den: 1 };
  const common = gcd(num, den);
  return {
    num: num / common,
    den: den / common,
  };
}

export const PHOTO_ADDITION_PROBLEMS: AdditionProblem[] = [
  {
    id: 'photo-problem-1',
    isPhotoExample: true,
    titleEn: 'Photo Example 1: 4/6 + 5/12',
    titleAf: 'Foto Voorbeeld 1: 4/6 + 5/12',
    f1: { num: 4, den: 6 },
    f2: { num: 5, den: 12 },
    multiplier1: 2, // (4 * 2) / (6 * 2) = 8/12
    multiplier2: 1, // 5/12 remains 5/12
    commonDen: 12,
    newNum1: 8,
    newNum2: 5,
    sumNum: 13,
    wholeNumber: 1,
    remNum: 1, // 13/12 = 1 1/12
  },
  {
    id: 'photo-problem-2',
    isPhotoExample: true,
    titleEn: 'Photo Example 2: 2/3 + 2/5',
    titleAf: 'Foto Voorbeeld 2: 2/3 + 2/5',
    f1: { num: 2, den: 3 },
    f2: { num: 2, den: 5 },
    multiplier1: 5, // (2 * 5) / (3 * 5) = 10/15
    multiplier2: 3, // (2 * 3) / (5 * 3) = 6/15
    commonDen: 15,
    newNum1: 10,
    newNum2: 6,
    sumNum: 16,
    wholeNumber: 1,
    remNum: 1, // 16/15 = 1 1/15
  },
  {
    id: 'bakery-order-3',
    titleEn: 'Bakery Order 3: 3/4 + 1/8',
    titleAf: 'Bakkery Bestelling 3: 3/4 + 1/8',
    f1: { num: 3, den: 4 },
    f2: { num: 1, den: 8 },
    multiplier1: 2,
    multiplier2: 1,
    commonDen: 8,
    newNum1: 6,
    newNum2: 1,
    sumNum: 7,
    wholeNumber: 0,
    remNum: 7, // 7/8
  },
  {
    id: 'bakery-order-4',
    titleEn: 'Bakery Order 4: 1/2 + 2/3',
    titleAf: 'Bakkery Bestelling 4: 1/2 + 2/3',
    f1: { num: 1, den: 2 },
    f2: { num: 2, den: 3 },
    multiplier1: 3,
    multiplier2: 2,
    commonDen: 6,
    newNum1: 3,
    newNum2: 4,
    sumNum: 7,
    wholeNumber: 1,
    remNum: 1, // 7/6 = 1 1/6
  },
  {
    id: 'bakery-order-5',
    titleEn: 'Bakery Order 5: 2/5 + 3/10',
    titleAf: 'Bakkery Bestelling 5: 2/5 + 3/10',
    f1: { num: 2, den: 5 },
    f2: { num: 3, den: 10 },
    multiplier1: 2,
    multiplier2: 1,
    commonDen: 10,
    newNum1: 4,
    newNum2: 3,
    sumNum: 7,
    wholeNumber: 0,
    remNum: 7, // 7/10
  },
  {
    id: 'bakery-order-6',
    titleEn: 'Bakery Order 6: 5/6 + 1/4',
    titleAf: 'Bakkery Bestelling 6: 5/6 + 1/4',
    f1: { num: 5, den: 6 },
    f2: { num: 1, den: 4 },
    multiplier1: 2,
    multiplier2: 3,
    commonDen: 12,
    newNum1: 10,
    newNum2: 3,
    sumNum: 13,
    wholeNumber: 1,
    remNum: 1, // 13/12 = 1 1/12
  },
  {
    id: 'bakery-order-7',
    titleEn: 'Bakery Order 7: 3/8 + 5/16',
    titleAf: 'Bakkery Bestelling 7: 3/8 + 5/16',
    f1: { num: 3, den: 8 },
    f2: { num: 5, den: 16 },
    multiplier1: 2,
    multiplier2: 1,
    commonDen: 16,
    newNum1: 6,
    newNum2: 5,
    sumNum: 11,
    wholeNumber: 0,
    remNum: 11, // 11/16
  },
  {
    id: 'bakery-order-8',
    titleEn: 'Bakery Order 8: 3/5 + 7/10',
    titleAf: 'Bakkery Bestelling 8: 3/5 + 7/10',
    f1: { num: 3, den: 5 },
    f2: { num: 7, den: 10 },
    multiplier1: 2,
    multiplier2: 1,
    commonDen: 10,
    newNum1: 6,
    newNum2: 7,
    sumNum: 13,
    wholeNumber: 1,
    remNum: 3, // 13/10 = 1 3/10
  },
  {
    id: 'bakery-order-9',
    titleEn: 'Bakery Order 9: 1/3 + 5/6',
    titleAf: 'Bakkery Bestelling 9: 1/3 + 5/6',
    f1: { num: 1, den: 3 },
    f2: { num: 5, den: 6 },
    multiplier1: 2,
    multiplier2: 1,
    commonDen: 6,
    newNum1: 2,
    newNum2: 5,
    sumNum: 7,
    wholeNumber: 1,
    remNum: 1, // 7/6 = 1 1/6
  },
  {
    id: 'bakery-order-10',
    titleEn: 'Bakery Order 10: 3/4 + 2/3',
    titleAf: 'Bakkery Bestelling 10: 3/4 + 2/3',
    f1: { num: 3, den: 4 },
    f2: { num: 2, den: 3 },
    multiplier1: 3,
    multiplier2: 4,
    commonDen: 12,
    newNum1: 9,
    newNum2: 8,
    sumNum: 17,
    wholeNumber: 1,
    remNum: 5, // 17/12 = 1 5/12
  },
];

export function createCustomAdditionProblem(
  num1: number,
  den1: number,
  num2: number,
  den2: number,
  titleEn: string,
  titleAf: string
): AdditionProblem {
  const common = lcm(den1, den2);
  const m1 = common / den1;
  const m2 = common / den2;
  const n1 = num1 * m1;
  const n2 = num2 * m2;
  const sum = n1 + n2;
  const whole = Math.floor(sum / common);
  const rem = sum % common;

  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    titleEn,
    titleAf,
    f1: { num: num1, den: den1 },
    f2: { num: num2, den: den2 },
    multiplier1: m1,
    multiplier2: m2,
    commonDen: common,
    newNum1: n1,
    newNum2: n2,
    sumNum: sum,
    wholeNumber: whole,
    remNum: rem,
  };
}
