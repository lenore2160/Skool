export type Language = 'en' | 'af';

export interface Badge {
  id: string;
  nameEn: string;
  nameAf: string;
  descriptionEn: string;
  descriptionAf: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'visual' | 'rules' | 'puzzle' | 'addition' | 'master';
}

export type LessonTab = 'front' | 'cover' | 'story' | 'baking' | 'rules' | 'puzzle' | 'addition' | 'whole' | 'practice';

export interface StoryScene {
  id: number;
  characterNameEn: string;
  characterNameAf: string;
  characterEmoji: string;
  characterTitleEn: string;
  characterTitleAf: string;
  dialogueEn: string;
  dialogueAf: string;
  guestsCount: number;
  fractionHighlight: string;
  keyTakeawayEn: string;
  keyTakeawayAf: string;
}

export interface CakeDivision {
  denominator: number;
  rows: number;
  cols: number;
  labelEn: string;
  labelAf: string;
}

export interface PuzzleLevel {
  id: number;
  targetFraction: {
    numerator: number;
    denominator: number;
  };
  promptEn: string;
  promptAf: string;
  availablePieces: {
    id: string;
    numerator: number;
    denominator: number;
    color: string;
  }[];
  hintEn: string;
  hintAf: string;
}

export interface AdditionProblem {
  id: string;
  f1: { num: number; den: number };
  f2: { num: number; den: number };
  multiplier1: number;
  multiplier2: number;
  commonDen: number;
  newNum1: number;
  newNum2: number;
  sumNum: number;
  wholeNumber: number;
  remNum: number;
  isPhotoExample?: boolean;
  titleEn: string;
  titleAf: string;
}
