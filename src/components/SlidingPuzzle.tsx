import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Check, RotateCcw, ArrowLeft, ArrowRight, HelpCircle, Trophy, Award } from 'lucide-react';
import { Language, PuzzleLevel } from '../types';
import { playPieceDrop, playSliceClick, playSuccessChime, playLevelUpFanfare } from '../utils/audio';
import { VoiceNarratorButton } from './VoiceNarratorButton';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { Fraction, FormattedFractionText } from './Fraction';

interface SlidingPuzzleProps {
  language: Language;
  onPrevious?: () => void;
  onNext?: () => void;
  onCompleteLesson: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    id: 1,
    targetFraction: { numerator: 3, denominator: 4 },
    promptEn: 'Grandma Mouse orders 3/4 of a pan for her grandchildren\'s tea party!',
    promptAf: 'Ouma Muis bestel 3/4 van \'n pan vir haar kleinkinders se teepartytjie!',
    hintEn: 'Add three 1/4 slices to fill 3 out of 4 slots in the pan!',
    hintAf: 'Plaas drie 1/4 stukkies om 3 uit 4 dele in die pan te vul!',
    availablePieces: [
      { id: 'p1', numerator: 1, denominator: 4, color: 'bg-amber-600' },
      { id: 'p2', numerator: 1, denominator: 4, color: 'bg-amber-600' },
      { id: 'p3', numerator: 1, denominator: 4, color: 'bg-amber-600' },
      { id: 'p4', numerator: 1, denominator: 4, color: 'bg-amber-600' },
      { id: 'p5', numerator: 1, denominator: 2, color: 'bg-amber-700' },
    ],
  },
  {
    id: 2,
    targetFraction: { numerator: 5, denominator: 6 },
    promptEn: 'Penny Piglet orders 5/6 of a chocolate fudge pan for the picnic!',
    promptAf: 'Penny Varkie bestel 5/6 van \'n sjokoladekoekpan vir die piekniek!',
    hintEn: 'Drag five 1/6 slices into the pan to complete 5/6!',
    hintAf: 'Sleep vyf 1/6 stukkies in die pan om 5/6 te voltooi!',
    availablePieces: [
      { id: 'q1', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'q2', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'q3', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'q4', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'q5', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'q6', numerator: 1, denominator: 6, color: 'bg-amber-700' },
    ],
  },
  {
    id: 3,
    targetFraction: { numerator: 8, denominator: 12 },
    promptEn: 'Barnaby Bear\'s party pan order: Pack 8/12 of the chocolate twelfths!',
    promptAf: 'Barnaby Beer se partytjiepan-bestelling: Pak 8/12 van die sjokolade-twaalfdes!',
    hintEn: 'Gather eight 1/12 chocolate squares to satisfy the order!',
    hintAf: 'Kies agt 1/12 sjokoladeblokkies om die bestelling te voltooi!',
    availablePieces: [
      { id: 't1', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't2', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't3', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't4', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't5', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't6', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't7', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't8', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't9', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 't10', numerator: 1, denominator: 12, color: 'bg-amber-800' },
    ],
  },
  {
    id: 4,
    targetFraction: { numerator: 2, denominator: 4 },
    promptEn: 'Freddy Frog orders 2/4 of a pan. (Notice: 2 quarters equal 1 half!)',
    promptAf: 'Freddy Padda bestel 2/4 van \'n pan. (Let op: 2 kwarte is gelyk aan 1 helfte!)',
    hintEn: 'Place two 1/4 slices into the pan to make 2/4!',
    hintAf: 'Plaas twee 1/4 stukkies in die pan om 2/4 te maak!',
    availablePieces: [
      { id: 'f1', numerator: 1, denominator: 4, color: 'bg-amber-600' },
      { id: 'f2', numerator: 1, denominator: 4, color: 'bg-amber-600' },
      { id: 'f3', numerator: 1, denominator: 4, color: 'bg-amber-600' },
      { id: 'f4', numerator: 1, denominator: 4, color: 'bg-amber-600' },
    ],
  },
  {
    id: 5,
    targetFraction: { numerator: 6, denominator: 6 },
    promptEn: 'Pippa Bunny orders 6/6 of a pan. Top = Bottom means all slices make 1 Whole Cake!',
    promptAf: 'Pippa Hasie bestel 6/6 van \'n pan. Bo = Onder beteken al die stukkies maak 1 Hele Koek!',
    hintEn: 'Pack all six 1/6 slices to fill the entire pan!',
    hintAf: 'Pak al ses 1/6 stukkies om die hele pan vol te maak!',
    availablePieces: [
      { id: 'b1', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'b2', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'b3', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'b4', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'b5', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 'b6', numerator: 1, denominator: 6, color: 'bg-amber-700' },
    ],
  },
  {
    id: 6,
    targetFraction: { numerator: 4, denominator: 6 },
    promptEn: 'Sammy Squirrel orders 4/6 of a cinnamon pan for his treetop friends!',
    promptAf: 'Sammy Eekhorinkie bestel 4/6 van \'n kaneelpan vir sy vriende in die bome!',
    hintEn: 'Pick four 1/6 slices to complete 4/6 of the pan.',
    hintAf: 'Kies vier 1/6 stukkies om 4/6 van die pan te voltooi.',
    availablePieces: [
      { id: 's1', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 's2', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 's3', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 's4', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 's5', numerator: 1, denominator: 6, color: 'bg-amber-700' },
      { id: 's6', numerator: 1, denominator: 6, color: 'bg-amber-700' },
    ],
  },
  {
    id: 7,
    targetFraction: { numerator: 9, denominator: 12 },
    promptEn: 'Oliver Owl orders 9/12 of a party pan for the evening book club!',
    promptAf: 'Oliver Uil bestel 9/12 van \'n partytjiepan vir die aand-boekklub!',
    hintEn: 'Add nine 1/12 chocolate pieces to make 9/12!',
    hintAf: 'Voeg nege 1/12 sjokoladestukkies by om 9/12 te maak!',
    availablePieces: [
      { id: 'o1', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o2', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o3', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o4', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o5', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o6', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o7', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o8', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o9', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o10', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'o11', numerator: 1, denominator: 12, color: 'bg-amber-800' },
    ],
  },
  {
    id: 8,
    targetFraction: { numerator: 11, denominator: 12 },
    promptEn: 'Felix Fox orders 11/12 of the pan — a proper fraction, just 1 slice away from a whole cake!',
    promptAf: 'Felix Jakkals bestel 11/12 van die pan — \'n egte breuk, net 1 stukkie weg van \'n hele koek!',
    hintEn: 'Add eleven slices of 1/12 to fill almost the entire oven pan.',
    hintAf: 'Voeg elf stukkies van 1/12 by om amper die hele oondpan te vul.',
    availablePieces: [
      { id: 'x1', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x2', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x3', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x4', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x5', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x6', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x7', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x8', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x9', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x10', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x11', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'x12', numerator: 1, denominator: 12, color: 'bg-amber-800' },
    ],
  },
  {
    id: 9,
    targetFraction: { numerator: 12, denominator: 12 },
    promptEn: 'Mayor Badger orders 12/12 for the village banquet! 12 over 12 = 1 Complete Whole Cake!',
    promptAf: 'Burgemeester Ratel bestel 12/12 vir die dorpsbanket! 12 op 12 = 1 Volledige Hele Koek!',
    hintEn: 'Place all twelve 1/12 slices into the pan to fill every single slot!',
    hintAf: 'Plaas al twaalf 1/12 stukkies in die pan om elke enkele gleuf te vul!',
    availablePieces: [
      { id: 'm1', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm2', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm3', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm4', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm5', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm6', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm7', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm8', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm9', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm10', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm11', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'm12', numerator: 1, denominator: 12, color: 'bg-amber-800' },
    ],
  },
  {
    id: 10,
    targetFraction: { numerator: 10, denominator: 12 },
    promptEn: 'Mila Mouse orders 10/12 of her birthday pan for her 10 guests! Can you pack the 10 slices?',
    promptAf: 'Mila Muis bestel 10/12 van haar verjaardagpan vir haar 10 gaste! Kan jy die 10 stukkies pak?',
    hintEn: 'Put ten 1/12 pieces into the pan for Mila\'s birthday party!',
    hintAf: 'Sit tien 1/12 stukkies in die pan vir Mila se verjaardagpartytjie!',
    availablePieces: [
      { id: 'k1', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k2', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k3', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k4', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k5', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k6', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k7', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k8', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k9', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k10', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k11', numerator: 1, denominator: 12, color: 'bg-amber-800' },
      { id: 'k12', numerator: 1, denominator: 12, color: 'bg-amber-800' },
    ],
  },
];

// Kid-friendly scramble generator: guaranteed solvable in just a few moves (3 to 5 gentle swaps from solved)
function getAdjacentTileIndices(idx: number): number[] {
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(idx - 3); // up
  if (row < 1) neighbors.push(idx + 3); // down
  if (col > 0) neighbors.push(idx - 1); // left
  if (col < 2) neighbors.push(idx + 1); // right
  return neighbors;
}

function generateKidFriendlyScramble(): number[] {
  const tiles = [1, 2, 3, 4, 5, 0];
  let emptyIdx = 5;
  let lastSwappedIdx = -1;
  // 3 to 5 gentle steps away from solved so a 10-year-old child can easily untangle it in a few taps!
  const numSteps = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < numSteps; i++) {
    const validMoves = getAdjacentTileIndices(emptyIdx).filter((n) => n !== lastSwappedIdx);
    const chosen = validMoves[Math.floor(Math.random() * validMoves.length)];
    tiles[emptyIdx] = tiles[chosen];
    tiles[chosen] = 0;
    lastSwappedIdx = emptyIdx;
    emptyIdx = chosen;
  }

  // Ensure it's not already solved
  const isSolved = tiles.every((val, idx) => (idx === 5 ? val === 0 : val === idx + 1));
  if (isSolved) {
    tiles[5] = tiles[4];
    tiles[4] = 0;
  }
  return tiles;
}

export const SlidingPuzzle: React.FC<SlidingPuzzleProps> = ({
  language,
  onPrevious,
  onNext,
  onCompleteLesson,
  onAwardXp,
  onUnlockBadge,
}) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [placedPieceIds, setPlacedPieceIds] = useState<string[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isLevelSolved, setIsLevelSolved] = useState<boolean>(false);

  // Sliding tile puzzle mini-game state
  const [slidingTiles, setSlidingTiles] = useState<number[]>([1, 2, 0, 3, 4, 5]); // 0 is empty slot
  const [isSlidingComplete, setIsSlidingComplete] = useState<boolean>(false);
  const autoRemixTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (autoRemixTimerRef.current) {
        clearTimeout(autoRemixTimerRef.current);
      }
    };
  }, []);

  const handleResetSlidingPuzzle = () => {
    if (autoRemixTimerRef.current) {
      clearTimeout(autoRemixTimerRef.current);
      autoRemixTimerRef.current = null;
    }
    playPieceDrop();
    setIsSlidingComplete(false);
    setSlidingTiles(generateKidFriendlyScramble());
  };

  const level = PUZZLE_LEVELS[currentLevelIndex];

  // Calculate current placed total fraction
  const placedPieces = level.availablePieces.filter((p) => placedPieceIds.includes(p.id));
  const currentNumeratorSum = placedPieces.reduce((sum, p) => {
    // scale to level denominator
    const scale = level.targetFraction.denominator / p.denominator;
    return sum + p.numerator * scale;
  }, 0);

  const targetNum = level.targetFraction.numerator;
  const targetDen = level.targetFraction.denominator;
  const isTargetMatched = currentNumeratorSum === targetNum;

  const handleAddPiece = (pieceId: string) => {
    if (placedPieceIds.includes(pieceId) || isLevelSolved) return;
    playPieceDrop();
    const newPlaced = [...placedPieceIds, pieceId];
    setPlacedPieceIds(newPlaced);

    // Check if matched
    const pieces = level.availablePieces.filter((p) => newPlaced.includes(p.id));
    const newSum = pieces.reduce((sum, p) => {
      const scale = targetDen / p.denominator;
      return sum + p.numerator * scale;
    }, 0);

    if (newSum === targetNum) {
      setIsLevelSolved(true);
      playSuccessChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onAwardXp(30, `Solved puzzle order ${level.id}!`);
      onUnlockBadge('puzzle-pro');
    }
  };

  const handleRemovePiece = (pieceId: string) => {
    if (isLevelSolved) return;
    playPieceDrop();
    setPlacedPieceIds(placedPieceIds.filter((id) => id !== pieceId));
  };

  const handleReset = () => {
    playPieceDrop();
    setPlacedPieceIds([]);
    setIsLevelSolved(false);
  };

  const handleNextLevel = () => {
    playPieceDrop();
    if (currentLevelIndex < PUZZLE_LEVELS.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
      setPlacedPieceIds([]);
      setIsLevelSolved(false);
      setShowHint(false);
    } else {
      onCompleteLesson();
      playLevelUpFanfare();
      onAwardXp(50, 'Mastered all drag & drop puzzle levels!');
    }
  };

  // Sliding tile game logic (adjacent tile swapping into 0)
  const handleTileClick = (index: number) => {
    const emptyIndex = slidingTiles.indexOf(0);
    // In a 2x3 grid:
    // row = Math.floor(index / 3), col = index % 3
    const row1 = Math.floor(index / 3);
    const col1 = index % 3;
    const row2 = Math.floor(emptyIndex / 3);
    const col2 = emptyIndex % 3;

    const isAdjacent = Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    if (isAdjacent) {
      playPieceDrop();
      const newTiles = [...slidingTiles];
      newTiles[emptyIndex] = newTiles[index];
      newTiles[index] = 0;
      setSlidingTiles(newTiles);

      // Check if ordered: [1, 2, 3, 4, 5, 0]
      const isWon = newTiles.every((val, idx) => {
        if (idx === 5) return val === 0;
        return val === idx + 1;
      });

      if (isWon) {
        setIsSlidingComplete(true);
        playSuccessChime();
        confetti({ particleCount: 60, spread: 70 });
        onAwardXp(40, 'Arranged sliding cake pan in order!');

        // Every time it's been completed, mix it up again in a kid-friendly solvable way after 3.2 seconds
        if (autoRemixTimerRef.current) {
          clearTimeout(autoRemixTimerRef.current);
        }
        autoRemixTimerRef.current = window.setTimeout(() => {
          setSlidingTiles(generateKidFriendlyScramble());
          setIsSlidingComplete(false);
          playPieceDrop();
          autoRemixTimerRef.current = null;
        }, 3200);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Village Bakery 3D Cottagecore Hero Banner - Chapter 4: The Fraction Bakery Puzzle Station */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
        {/* 3D Cinematic Render Background with soft watermark effect */}
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          <img
            src={STORY_3D_ASSETS.chapter4LineHero}
            alt="3D Bumblewood Cottage Bakery - Animal customers lining up with Chef Barnaby Bear and Pip Penguin"
            className="w-full h-full object-cover object-[50%_50%]"
            referrerPolicy="no-referrer"
          />
          {/* Soft, balanced vignette overlays - clear and pleasing to the eye */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Banner text: Chapter 4 yellow block on top-left, audio narration on top-right, large title and description on bottom-left */}
          <div className="absolute inset-0 p-3.5 sm:p-5 md:p-7 flex flex-col justify-between z-10">
            {/* Top row: Chapter 4 yellow block with exact dimensions as other chapters, plus audio narration moved to top right */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center bg-amber-300 text-amber-950 border-2 border-amber-400 text-sm sm:text-base md:text-lg lg:text-xl font-black px-4.5 sm:px-5.5 py-1.5 sm:py-2.5 rounded-xl shadow-md">
                <span>{language === 'en' ? 'Chapter 4' : 'Hoofstuk 4'}</span>
              </div>
              <VoiceNarratorButton
                speakerId="puzzle-intro"
                language={language}
                size="md"
                text={
                  language === 'en'
                    ? 'Chapter 4: The Fraction Bakery Puzzle Station. Customers are lining up...!'
                    : 'Hoofstuk 4: Die Breukebakkery Legkaartstasie. Kliënte staan in rye...!'
                }
              />
            </div>

            {/* Bottom row: Main heading & description */}
            <div className="w-full max-w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
                {language === 'en'
                  ? 'The Fraction Bakery Puzzle Station'
                  : 'Die Breukebakkery Legkaartstasie'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-200 font-bold drop-shadow mt-1.5 sm:mt-2 md:whitespace-nowrap">
                {language === 'en'
                  ? 'Customers are lining up...!'
                  : 'Kliënte staan in rye...!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Drag & Drop Matcher Arena */}
      <div className="cottage-parchment-card rounded-3xl p-6 md:p-8 shadow-md border-2 border-[#dfceb9]">
        {/* Top sentence moved from hero banner */}
        <div className="mb-4 bg-amber-100/70 p-3 sm:p-3.5 rounded-2xl border border-amber-300 text-xs sm:text-sm font-bold text-amber-950 flex items-center justify-between gap-3 shadow-xs">
          <span>
            {language === 'en'
              ? 'Drag and drop cake slices into the target pan to match each fraction order, then try the sliding pan puzzle!'
              : 'Sleep en plaas koekstukkies in die teikenpan om elke breukbestelling te pas, en probeer dan die skuifpan-legkaart!'}
          </span>
          <VoiceNarratorButton
            speakerId="puzzle-instruction"
            language={language}
            variant="icon"
            text={
              language === 'en'
                ? 'Drag and drop cake slices into the target pan to match each fraction order, then try the sliding pan puzzle!'
                : 'Sleep en plaas koekstukkies in die teikenpan om elke breukbestelling te pas, en probeer dan die skuifpan-legkaart!'
            }
          />
        </div>

        {/* Target Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 md:p-5 flex flex-col gap-4 mb-6">
          {/* Main heading of the target order requested by user */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
            <div>
              <h3 className="text-lg md:text-xl font-black text-[#381e0f]">
                {language === 'en'
                  ? 'Help Chef Barnaby Bear to fill the customer orders.'
                  : 'Help Sjef Barnaby Beer om die klante se bestellings te vul.'}
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#2d180c] text-amber-300 px-3 py-1 rounded-xl text-xs font-black shadow-xs self-start sm:self-auto">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'en' ? 'Order' : 'Bestelling'} {currentLevelIndex + 1} / {PUZZLE_LEVELS.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  {language === 'en' ? 'Target Order:' : 'Teikenbestelling:'}
                </span>
                <VoiceNarratorButton
                  speakerId={`puzzle-target-${level.id}`}
                  language={language}
                  variant="icon"
                  text={`${language === 'en' ? level.promptEn : level.promptAf} Target fraction: ${targetNum} over ${targetDen}.`}
                />
              </div>
              <div className="text-lg md:text-xl font-black text-amber-950 flex items-center gap-1.5 flex-wrap">
                <FormattedFractionText text={language === 'en' ? level.promptEn : level.promptAf} size="md" />
              </div>
            </div>

            {/* Big Target Fraction Chip */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="bg-amber-900 text-amber-50 px-5 py-2.5 rounded-2xl font-mono font-black shadow-md border-2 border-amber-700 flex flex-col items-center">
                <Fraction numerator={targetNum} denominator={targetDen} size="2xl" className="text-amber-50" lineClassName="border-amber-300" />
              </div>

              <button
                id="puzzle-hint-toggle"
                onClick={() => setShowHint(!showHint)}
                className="p-2.5 bg-white border border-amber-300 hover:bg-amber-100 rounded-xl text-amber-800 cursor-pointer transition-colors"
                title="Toggle Hint"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom right of the banner: block saying next order (Same principle as Quiz banner in Chapter 3) */}
          <div className="flex items-center justify-between pt-2 border-t border-amber-200/80 mt-1">
            <div className="text-xs font-bold text-amber-900">
              {isLevelSolved ? (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {language === 'en' ? 'Order matched successfully!' : 'Bestelling suksesvol gepas!'}
                </span>
              ) : (
                <span className="text-amber-800/80">
                  {language === 'en' ? 'Place slices in the pan to complete the order.' : 'Plaas stukkies in die pan om die bestelling te voltooi.'}
                </span>
              )}
            </div>

            <button
              id="puzzle-next-order-btn"
              onClick={handleNextLevel}
              disabled={!isLevelSolved}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-sm transition-all ${
                isLevelSolved
                  ? 'bg-amber-800 hover:bg-amber-900 text-amber-100 ring-2 ring-amber-400'
                  : 'bg-stone-200 text-stone-400 border border-stone-300 cursor-not-allowed opacity-60'
              }`}
            >
              <span>
                {currentLevelIndex === PUZZLE_LEVELS.length - 1
                  ? language === 'en'
                    ? 'Finish Orders'
                    : 'Voltooi Bestellings'
                  : language === 'en'
                  ? 'Next Order'
                  : 'Volgende Bestelling'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hint banner if toggled */}
        {showHint && (
          <div className="mb-6 p-4 rounded-xl bg-amber-100/90 border border-amber-300 text-xs font-bold text-amber-950 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span>💡</span>
              <FormattedFractionText text={language === 'en' ? level.hintEn : level.hintAf} size="sm" />
            </div>
            <VoiceNarratorButton
              speakerId={`puzzle-hint-${level.id}`}
              language={language}
              variant="icon"
              text={language === 'en' ? level.hintEn : level.hintAf}
            />
          </div>
        )}

        {/* Target Pan (Drop Zone / Destination) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-black text-amber-900">
            <span>
              {language === 'en' ? 'Target Baking Pan (Click slices to add or remove):' : 'Teiken Oondpan (Klik stukkies om by te voeg of te verwyder):'}
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5">
                <span className="text-[11px] uppercase font-bold">{language === 'en' ? 'In Pan:' : 'In Pan:'}</span>
                <Fraction numerator={currentNumeratorSum} denominator={targetDen} size="sm" />
              </span>
              <button
                id="reset-puzzle-btn"
                onClick={handleReset}
                className="flex items-center gap-1 text-amber-700 hover:text-amber-900 underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Reset' : 'Herstel'}</span>
              </button>
            </div>
          </div>

          {/* Rectangular Target Pan Container */}
          <div className="bg-stone-800 p-4 md:p-6 rounded-3xl border-4 border-stone-600 shadow-xl min-h-[160px] flex flex-col justify-center">
            {placedPieces.length === 0 ? (
              <div className="border-2 border-dashed border-stone-600 rounded-2xl p-8 text-center text-stone-400 text-xs font-bold">
                {language === 'en'
                  ? 'The pan is empty! Click slices from the Kitchen Counter below to place them here.'
                  : 'Die pan is leeg! Klik stukkies op die kombuistoonbank hieronder om hulle hier te plaas.'}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {placedPieces.map((piece) => (
                  <motion.button
                    key={piece.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={() => handleRemovePiece(piece.id)}
                    className="p-3 rounded-xl bg-amber-600 border-2 border-amber-300 text-white font-black text-xs md:text-sm shadow-md hover:bg-rose-600 transition-colors cursor-pointer flex flex-col items-center justify-center group"
                    title={language === 'en' ? 'Click to remove' : 'Klik om te verwyder'}
                  >
                    <Fraction numerator={piece.numerator} denominator={piece.denominator} size="md" className="text-white" />
                    <span className="text-[9px] text-amber-200 group-hover:text-white mt-1">
                      {language === 'en' ? '✕ remove' : '✕ haal uit'}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Level Solved Celebration Banner */}
          {isLevelSolved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-950 text-base">
                      {language === 'en' ? 'Order Complete! Perfect Match!' : 'Bestelling Voltooi! Perfekte Pas!'}
                    </span>
                    <VoiceNarratorButton
                      speakerId={`puzzle-solved-${level.id}`}
                      language={language}
                      variant="icon"
                      text={
                        language === 'en'
                          ? `Order complete! Perfect match! You assembled exactly ${targetNum} over ${targetDen} of the chocolate cake. Great job!`
                          : `Bestelling voltooi! Perfekte pas! Jy het presies ${targetNum} op ${targetDen} van die sjokoladekoek gepak. Uitstekend gedoen!`
                      }
                    />
                  </div>
                  <div className="text-xs text-emerald-800 font-medium">
                    {language === 'en'
                      ? `You assembled exactly ${targetNum}/${targetDen} of the chocolate cake.`
                      : `Jy het presies ${targetNum}/${targetDen} van die sjokoladekoek gepak.`}
                  </div>
                </div>
              </div>

              <button
                id="next-puzzle-level-btn"
                onClick={handleNextLevel}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-black text-xs cursor-pointer shadow-md transition-all active:scale-95"
              >
                <span>
                  {currentLevelIndex < PUZZLE_LEVELS.length - 1
                    ? language === 'en'
                      ? 'Next Order'
                      : 'Volgende Bestelling'
                    : language === 'en'
                    ? 'Finish Lesson'
                    : 'Klaar met Les'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Kitchen Counter (Available pieces) */}
          <div className="pt-4 border-t border-amber-100">
            <div className="text-xs font-black uppercase text-amber-800 mb-2">
              {language === 'en' ? 'Kitchen Cutting Board (Click to add to pan):' : 'Kombuissnybord (Klik om in pan te plaas):'}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {level.availablePieces.map((piece) => {
                const isPlaced = placedPieceIds.includes(piece.id);
                return (
                  <button
                    key={piece.id}
                    id={`puzzle-piece-${piece.id}`}
                    onClick={() => handleAddPiece(piece.id)}
                    disabled={isPlaced || isLevelSolved}
                    className={`p-3 rounded-2xl font-black text-xs md:text-sm border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isPlaced
                        ? 'opacity-30 bg-stone-100 border-stone-300 text-stone-400 cursor-not-allowed'
                        : 'bg-amber-100 hover:bg-amber-200 active:scale-95 border-amber-300 text-amber-950 shadow-sm'
                    }`}
                  >
                    <Fraction
                      numerator={piece.numerator}
                      denominator={piece.denominator}
                      size="lg"
                      className={isPlaced ? 'text-stone-400' : 'text-amber-950'}
                    />
                    <span className="text-[10px] text-amber-700 font-bold mt-1">
                      {isPlaced ? 'Placed' : '+ Add'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Sliding Tile Game ("Organize the 6-Piece Pan") */}
      <div className="cottage-parchment-card rounded-3xl p-6 md:p-8 shadow-md border-2 border-[#dfceb9]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full cottage-golden-tag text-xs font-black mb-1 shadow-xs">
              <span>🌟</span>
              <span>{language === 'en' ? 'Bonus Mini-Game' : 'Bonus Mini-Speletjie'}</span>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#381e0f]">
                {language === 'en' ? 'The Sliding Cake Pan Puzzle' : 'Die Koekpan-skuiflegkaart'}
              </h3>
              <VoiceNarratorButton
                speakerId="sliding-puzzle-bonus"
                language={language}
                variant="icon"
                text={
                  language === 'en'
                    ? 'Bonus mini game: The sliding cake pan puzzle. Slide the chocolate slices around using the empty space to arrange them in order from 1 over 6 to 5 over 6!'
                    : 'Bonus mini speletjie: Die koekpan-skuiflegkaart. Skuif die sjokoladestukkies rond met die leë spasie om hulle in volgorde van 1 op 6 tot 5 op 6 te rangskik!'
                }
              />
            </div>
            <p className="text-xs text-amber-800 flex items-center gap-1.5 flex-wrap">
              <span>
                {language === 'en'
                  ? 'Slide the chocolate slices around using the empty space to arrange them in order:'
                  : 'Skuif die sjokoladestukkies rond met die leë spasie om hulle in volgorde te rangskik:'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Fraction numerator={1} denominator={6} size="xs" />
                <span>→</span>
                <Fraction numerator={5} denominator={6} size="xs" />
              </span>
            </p>
          </div>

          <div className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            {isSlidingComplete ? (
              <span className="text-emerald-700 font-black animate-pulse">
                🎉 {language === 'en' ? 'Solved! Mixing up again in 3 seconds...' : 'Opgelos! Ons skommel dit weer oor 3 sekondes...'}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold">{language === 'en' ? 'Target:' : 'Teiken:'}</span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Fraction key={n} numerator={n} denominator={6} size="xs" />
                ))}
                <span className="text-[10px] text-amber-800 font-bold ml-0.5">[{language === 'en' ? 'Empty' : 'Leeg'}]</span>
              </div>
            )}
          </div>
        </div>

        {/* 2x3 Sliding Grid */}
        <div className="max-w-md mx-auto bg-stone-900 p-4 rounded-3xl border-4 border-stone-700 shadow-lg">
          <div className="grid grid-cols-3 gap-2">
            {slidingTiles.map((val, idx) => {
              const isEmpty = val === 0;
              return (
                <button
                  key={idx}
                  id={`sliding-tile-${idx}`}
                  onClick={() => handleTileClick(idx)}
                  disabled={isEmpty || isSlidingComplete}
                  className={`h-20 rounded-2xl font-black text-sm md:text-base flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
                    isEmpty
                      ? 'bg-stone-800/80 border-stone-800 text-transparent cursor-default'
                      : 'bg-amber-600 hover:bg-amber-500 border-amber-300 text-white shadow-md active:scale-95'
                  }`}
                >
                  {!isEmpty && (
                    <>
                      <Fraction numerator={val} denominator={6} size="lg" className="text-white" />
                      <span className="text-[10px] text-amber-200 font-semibold mt-1">Slice #{val}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom controls row with Reset Button in the bottom right corner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-3 border-t border-amber-200/80">
          <div className="text-xs text-amber-900 font-bold flex items-center gap-1.5">
            <span>💡</span>
            <span>
              {language === 'en'
                ? 'Tip: Tap any slice next to the empty slot to slide it into position!'
                : 'Wenk: Klik enige koekstukkie langs die leë gleuf om dit in plek te skuif!'}
            </span>
          </div>

          {/* Reset button in bottom right corner */}
          <button
            type="button"
            id="sliding-puzzle-reset-btn"
            onClick={handleResetSlidingPuzzle}
            className="flex items-center justify-center gap-1.5 bg-[#381e0f] hover:bg-[#4a2814] active:scale-95 text-amber-200 hover:text-amber-100 px-4 py-2 rounded-xl text-xs font-black shadow-md border-2 border-amber-400/80 cursor-pointer transition-all self-end sm:self-auto shrink-0 group"
            title={language === 'en' ? 'Reset puzzle to play again' : 'Herstel legkaart om weer te speel'}
          >
            <RotateCcw className="w-4 h-4 text-amber-300 group-hover:-rotate-90 transition-transform" />
            <span>
              {isSlidingComplete
                ? language === 'en'
                  ? 'Play Again (Mix Up)'
                  : 'Speel Weer (Skommel)'
                : language === 'en'
                ? 'Reset & Mix Up'
                : 'Herstel & Skommel'}
            </span>
          </button>
        </div>
      </div>

      {/* Centered Bottom Navigation Buttons: Previous & Next Chapter (matching previous chapters) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 pb-2">
        {/* Left: Previous */}
        <button
          type="button"
          id="chapter-four-prev-btn"
          onClick={() => {
            playSliceClick();
            if (onPrevious) onPrevious();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#381e0f] hover:bg-[#4a2814] active:scale-95 transition-all text-amber-200 hover:text-amber-100 font-bold text-xs sm:text-sm md:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-md border-2 border-amber-400/80 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300 group-hover:-translate-x-1 transition-transform shrink-0" />
          <span className="text-xs sm:text-sm md:text-base font-bold leading-normal tracking-normal">
            {language === 'en' ? 'Previous' : 'Vorige'}
          </span>
        </button>

        {/* Right: Next Chapter - exact same styling and sizing as previous chapters */}
        <button
          type="button"
          id="chapter-four-next-btn"
          onClick={() => {
            playSuccessChime();
            if (onNext) {
              onNext();
            } else {
              onCompleteLesson();
            }
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 transition-all text-[#2a1406] font-bold text-xs sm:text-sm md:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-md border-2 border-amber-300 cursor-pointer group"
        >
          <span className="text-xs sm:text-sm md:text-base font-bold leading-normal tracking-normal">
            {language === 'en' ? 'Next Chapter' : 'Volgende Hoofstuk'}
          </span>
          <ArrowRight className="w-4 h-4 text-[#2a1406] group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
};
