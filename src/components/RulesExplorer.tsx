import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles, Star, ZoomIn, X } from 'lucide-react';
import { Language } from '../types';
import { playSliceClick, playPieceDrop, playSuccessChime } from '../utils/audio';
import { VoiceNarratorButton } from './VoiceNarratorButton';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { Fraction, FormattedFractionText } from './Fraction';

interface RulesExplorerProps {
  language: Language;
  onPrevious?: () => void;
  onNext?: () => void;
  onCompleteLesson: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const RulesExplorer: React.FC<RulesExplorerProps> = ({
  language,
  onPrevious,
  onNext,
  onCompleteLesson,
  onAwardXp,
  onUnlockBadge,
}) => {
  // Interactive slider value: numerator from 1 to 24 with denominator = 12
  const [sliderNumerator, setSliderNumerator] = useState<number>(5);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [answeredQuestion, setAnsweredQuestion] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Enlarged 3D symbol state (clicks to enlarge, clicks again to shrink)
  const [enlargedRuleSymbol, setEnlargedRuleSymbol] = useState<{
    id: string;
    image: string;
    titleEn: string;
    titleAf: string;
    descEn: string;
    descAf: string;
  } | null>(null);

  const denominator = 12;

  // Determine rule type based on slider
  const isProper = sliderNumerator < denominator;
  const isWhole = sliderNumerator === denominator;

  const wholePart = Math.floor(sliderNumerator / denominator);
  const remainderPart = sliderNumerator % denominator;

  // Practice questions directly testing the photo's rules - 100% English in en mode
  const quizQuestions = [
    {
      fraction: '5/12',
      promptEn: 'Look at 5/12: The Top (Numerator = 5) is smaller than the Bottom (Denominator = 12). What is this?',
      promptAf: 'Kyk na 5/12: Die Bo (5) is kleiner as die Onder (12). Wat is dit?',
      options: [
        { id: 'proper', labelEn: 'Proper Fraction (Top < Bottom)', labelAf: 'Egte Breuk (Bo < Onder)' },
        { id: 'whole', labelEn: '1 Whole Cake', labelAf: '1 Hele Koek (Bo = Onder)' },
        { id: 'improper', labelEn: 'Improper / Mixed Number', labelAf: 'Onegte Breuk / Gemengde Getal' },
      ],
      correctId: 'proper',
      explainEn: 'Correct! When the Top is smaller than the Bottom, it is a proper fraction.',
      explainAf: 'Mooi so! Wanneer Bo kleiner as Onder is, is dit \'n egte breuk.',
      badgeToUnlock: 'proper-fraction',
    },
    {
      fraction: '12/12',
      promptEn: 'Look at 12/12: Top and Bottom are the SAME number! What do you have?',
      promptAf: 'Kyk na 12/12: Bo en Onder is dieselfde getal! Wat het jy?',
      options: [
        { id: 'proper', labelEn: 'Proper Fraction (Top < Bottom)', labelAf: 'Egte Breuk (Bo < Onder)' },
        { id: 'whole', labelEn: '1 Whole Cake', labelAf: '1 Hele Koek (1 Hele)' },
        { id: 'empty', labelEn: 'Empty Pan', labelAf: 'Leë Pan' },
      ],
      correctId: 'whole',
      explainEn: 'Bingo! 12/12 = 1 Whole Cake. All 12 slices fill the entire pan!',
      explainAf: 'Fantasties! 12/12 = 1 Hele koek. Al 12 stukkies vul die hele oondpan!',
      badgeToUnlock: 'one-whole',
    },
    {
      fraction: '15/12',
      promptEn: 'Look at 15/12: The Top (Numerator = 15) is GREATER than the Bottom (Denominator = 12). How do we write it as a mixed number?',
      promptAf: 'Kyk na 15/12: Die Bo (15) is groter as die Onder (12). Hoe skryf ons dit as \'n gemengde getal?',
      options: [
        { id: '1_3_12', labelEn: '1 3/12 (1 whole cake + 3 extra slices)', labelAf: '1 3/12 (1 hele koek + 3 ekstra stukkies)' },
        { id: '2_12', labelEn: '2 Whole Cakes', labelAf: '2 Hele Koeke' },
        { id: '3_15', labelEn: '3/15', labelAf: '3/15' },
      ],
      correctId: '1_3_12',
      explainEn: 'Spot on! 15/12 = 12/12 + 3/12 = 1 3/12! One whole cake plus 3 extra slices.',
      explainAf: 'In die kol! 15/12 = 12/12 + 3/12 = 1 3/12! Presies soos op die handgeskrewe nota!',
      badgeToUnlock: 'mixed-master',
    },
    {
      fraction: 'Breuk = ÷',
      fractionEn: 'Fraction = ÷',
      fractionAf: 'Breuk = ÷',
      promptEn: 'What does the fraction line in 12/12 or 6/2 actually mean?',
      promptAf: 'Wat beteken die breukstreep in 12/12 of 6/2 eintlik?',
      options: [
        { id: 'divide', labelEn: 'Division (÷) -> 12 ÷ 12 = 1', labelAf: 'Deel (÷) -> 12 ÷ 12 = 1' },
        { id: 'plus', labelEn: 'Addition (+)', labelAf: 'Optel (+)' },
        { id: 'times', labelEn: 'Multiplication (×)', labelAf: 'Maal (×)' },
      ],
      correctId: 'divide',
      explainEn: 'Superstar! The fraction line means Division (÷). That is why 12 ÷ 12 = 1!',
      explainAf: 'Superster! Breukstreep beteken Deel (Breuk = ÷). Daarom is 12 ÷ 12 = 1!',
      badgeToUnlock: null,
    },
    {
      fraction: '7/12',
      promptEn: 'Barnaby cuts a cake into 12 slices and serves 7 slices (7/12). Does this fit inside 1 single oven pan?',
      promptAf: 'Barnaby sny \'n koek in 12 stukkies en bedien 7 stukkies (7/12). Pas dit binne 1 enkele oondpan?',
      options: [
        { id: 'fits_1pan', labelEn: 'Yes! 7 is less than 12, so it fits in 1 pan', labelAf: 'Ja! 7 is minder as 12, so dit pas in 1 pan' },
        { id: 'overflows_2pans', labelEn: 'No, it overflows into a 2nd pan', labelAf: 'Nee, dit loop oor in \'n 2de pan' },
        { id: 'empty_pan', labelEn: 'No, the pan is completely empty', labelAf: 'Nee, die pan is heeltemal leeg' },
      ],
      correctId: 'fits_1pan',
      explainEn: 'Great job! 7/12 is a proper fraction because Top (7) is smaller than Bottom (12). It easily fits in 1 pan!',
      explainAf: 'Mooi so! 7/12 is \'n egte breuk omdat Bo (7) kleiner as Onder (12) is. Dit pas maklik in 1 pan!',
      badgeToUnlock: null,
    },
    {
      fraction: '8/8',
      promptEn: 'If a cake is cut into 8 equal slices and all 8 slices are in the pan (8/8), how many whole cakes do you have?',
      promptAf: 'As \'n koek in 8 gelyke stukkies gesny is en al 8 stukkies is in die pan (8/8), hoeveel hele koeke het jy?',
      options: [
        { id: 'one_whole', labelEn: 'Exactly 1 Whole Cake (8/8 = 1)', labelAf: 'Presies 1 Hele Koek (8/8 = 1)' },
        { id: 'zero_whole', labelEn: '0 Cakes', labelAf: '0 Koeke' },
        { id: 'eight_whole', labelEn: '8 Whole Cakes', labelAf: '8 Hele Koeke' },
      ],
      correctId: 'one_whole',
      explainEn: 'Spot on! Whenever Top and Bottom are the same number (like 8/8, 12/12, or 100/100), it always equals 1 whole cake!',
      explainAf: 'Presies! Wanneer Bo en Onder dieselfde getal is (soos 8/8, 12/12 of 100/100), is dit altyd gelyk aan 1 hele koek!',
      badgeToUnlock: null,
    },
    {
      fraction: '14/12',
      promptEn: 'You have 14 chocolate slices from 12-slice pans (14/12). What does this equal as a whole cake plus leftover slices?',
      promptAf: 'Jy het 14 sjokoladestukkies uit 12-stuk panne (14/12). Waaraan is dit gelyk as \'n hele koek plus oorblywende stukkies?',
      options: [
        { id: '1_2_12', labelEn: '1 2/12 (1 whole pan + 2 extra slices)', labelAf: '1 2/12 (1 hele pan + 2 ekstra stukkies)' },
        { id: '2_whole', labelEn: '2 Whole Pans', labelAf: '2 Hele Panne' },
        { id: '14_whole', labelEn: '14 Whole Cakes', labelAf: '14 Hele Koeke' },
      ],
      correctId: '1_2_12',
      explainEn: 'Awesome! 14/12 = 12/12 (1 whole cake) + 2/12 (2 slices in a second pan) = 1 2/12!',
      explainAf: 'Fantasties! 14/12 = 12/12 (1 hele koek) + 2/12 (2 stukkies in \'n tweede pan) = 1 2/12!',
      badgeToUnlock: null,
    },
    {
      fraction: '6/2',
      promptEn: 'Using Rule 4 (the fraction line means division ÷), what is 6/2 equal to?',
      promptAf: 'Volgens Reël 4 (die breukstreep beteken deel ÷), waaraan is 6/2 gelyk?',
      options: [
        { id: 'three', labelEn: '3 (because 6 ÷ 2 = 3)', labelAf: '3 (omdat 6 ÷ 2 = 3)' },
        { id: 'four', labelEn: '4 (because 6 - 2 = 4)', labelAf: '4 (omdat 6 - 2 = 4)' },
        { id: 'twelve', labelEn: '12 (because 6 × 2 = 12)', labelAf: '12 (omdat 6 × 2 = 12)' },
      ],
      correctId: 'three',
      explainEn: 'Brilliant! The fraction line is a division sign: 6 over 2 means 6 ÷ 2 = 3 whole cakes!',
      explainAf: 'Briljant! Die breukstreep is \'n deelteken: 6 op 2 beteken 6 ÷ 2 = 3 hele koeke!',
      badgeToUnlock: null,
    },
    {
      fraction: '24/12',
      promptEn: 'Each oven pan holds 12 slices. If Chef Barnaby bakes 24 slices (24/12), how many full pans does he have?',
      promptAf: 'Elke oondpan hou 12 stukkies. As Sjef Barnaby 24 stukkies bak (24/12), hoeveel vol panne het hy?',
      options: [
        { id: 'two_pans', labelEn: 'Exactly 2 Full Pans (24 ÷ 12 = 2)', labelAf: 'Presies 2 Vol Panne (24 ÷ 12 = 2)' },
        { id: 'one_pan', labelEn: '1 Full Pan', labelAf: '1 Vol Pan' },
        { id: 'twelve_pans', labelEn: '12 Full Pans', labelAf: '12 Vol Panne' },
      ],
      correctId: 'two_pans',
      explainEn: 'Chef perfection! 24 slices divided by 12 slices per pan equals 2 full whole cakes (24 ÷ 12 = 2)!',
      explainAf: 'Sjef-perfeksie! 24 stukkies gedeel deur 12 stukkies per pan is gelyk aan 2 vol hele koeke (24 ÷ 12 = 2)!',
      badgeToUnlock: null,
    },
    {
      fraction: '11/12',
      promptEn: 'A mouse apprentice asks: "We have 11/12 of a cake. Is this a proper fraction, or does it overflow into a second pan?"',
      promptAf: '\'n Muisleerling vra: "Ons het 11/12 van \'n koek. Is dit \'n egte breuk, of loop dit oor in \'n tweede pan?"',
      options: [
        { id: 'proper_fits', labelEn: 'Proper fraction: 11 is less than 12, so it fits in 1 pan!', labelAf: 'Egte breuk: 11 is minder as 12, so dit pas in 1 pan!' },
        { id: 'overflows', labelEn: 'It overflows and needs 2 pans', labelAf: 'Dit loop oor en benodig 2 panne' },
        { id: 'empty', labelEn: 'It is an empty pan', labelAf: 'Dit is \'n leë pan' },
      ],
      correctId: 'proper_fits',
      explainEn: 'Master Baker status! 11/12 is a proper fraction because 11 is smaller than 12. There is still space for 1 more slice in the pan!',
      explainAf: 'Meesterbakker-status! 11/12 is \'n egte breuk omdat 11 kleiner as 12 is. Daar is nog plek vir 1 ekstra stukkie in die pan!',
      badgeToUnlock: null,
    },
  ];

  const currentQ = quizQuestions[activeQuizIndex];

  const handleAnswer = (optionId: string) => {
    if (answeredQuestion) return;
    playSliceClick();
    setSelectedAnswer(optionId);
    setAnsweredQuestion(true);

    if (optionId === currentQ.correctId) {
      playSuccessChime();
      setQuizScore((prev) => prev + 1);
      onAwardXp(20, 'Answered Fraction Rule question correctly!');
      if (currentQ.badgeToUnlock) {
        onUnlockBadge(currentQ.badgeToUnlock);
      }
    }
  };

  const handleNextQuestion = () => {
    playSliceClick();
    setAnsweredQuestion(false);
    setSelectedAnswer(null);
    if (activeQuizIndex < quizQuestions.length - 1) {
      setActiveQuizIndex((prev) => prev + 1);
    } else {
      onCompleteLesson();
      onAwardXp(35, 'Finished all Fraction Rules!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Village Bakery 3D Cottagecore Hero Banner - Chapter 3: The 4 Golden Principles */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
        {/* 3D Cinematic Render Background with soft watermark effect */}
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          <img
            src={STORY_3D_ASSETS.chapter3RulesHero}
            alt="3D Bumblewood Cottage Bakery - Wise adult mouse explaining fraction principles to little mice with rectangular cake pans"
            className="w-full h-full object-cover object-[50%_50%]"
            referrerPolicy="no-referrer"
          />
          {/* Soft, balanced vignette overlays - clear and pleasing to the eye */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Banner text: Chapter 3 yellow block on top-left, large title and description on bottom-left */}
          <div className="absolute inset-0 p-3.5 sm:p-5 md:p-7 flex flex-col justify-between z-10">
            {/* Top row: Chapter 3 yellow block with exact dimensions as Chapter 1 and 2, plus audio narration */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center bg-amber-300 text-amber-950 border-2 border-amber-400 text-sm sm:text-base md:text-lg lg:text-xl font-black px-4.5 sm:px-5.5 py-1.5 sm:py-2.5 rounded-xl shadow-md">
                <span>{language === 'en' ? 'Chapter 3' : 'Hoofstuk 3'}</span>
              </div>
              <VoiceNarratorButton
                speakerId="rules-lesson-intro"
                language={language}
                size="md"
                text={
                  language === 'en'
                    ? 'Chapter 3: The 4 Golden Principles of Fractions. Learn how Top and Bottom tell us whether we have a single slice, a whole cake, or multiple pans!'
                    : 'Hoofstuk 3: Die 4 Goue Beginsels van Breuke. Leer hoe Bo en Onder vir ons sê of ons \'n stukkie, \'n hele koek, of verskeie panne het!'
                }
              />
            </div>

            {/* Bottom row: Main heading & description kept in single lines on full size screen */}
            <div className="w-full max-w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
                {language === 'en'
                  ? 'The 4 Golden Principles of Fractions'
                  : 'Die 4 Goue Beginsels van Breuke'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-200 font-bold drop-shadow mt-1.5 sm:mt-2 md:whitespace-nowrap">
                {language === 'en'
                  ? 'Learn how "Top" and "Bottom" tell us if we have a slice, a whole cake, or multiple pans!'
                  : 'Leer hoe "Bo" en "Onder" vir ons sê of ons \'n stukkie, \'n hele koek, of verskeie panne het!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Cards visually representing the handwritten photo's sections with 3D symbols */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rule 1: Proper fraction (Cake slice) */}
        <div className="bg-rose-50/80 border-2 border-rose-300 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-200/80 px-2.5 py-1 rounded-full">
                {language === 'en' ? 'Rule 1: Proper' : 'Reël 1: Egte Breuk'}
              </span>
              <div className="flex items-center gap-2">
                <VoiceNarratorButton
                  speakerId="rule-1-proper"
                  language={language}
                  variant="icon"
                  text={
                    language === 'en'
                      ? 'Rule 1: Top is smaller than bottom. When the top number is smaller than the bottom number, it is a proper fraction and fits inside one oven pan, like 1 over 12 or 5 over 12.'
                      : 'Reël 1: Bo is kleiner as onder. Wanneer die boonste getal kleiner as die onderste getal is, is dit \'n egte breuk en pas dit binne een oondpan, soos 1 op 12 of 5 op 12.'
                  }
                />
                {/* 3D Symbol Button - Click to enlarge, click again to shrink */}
                <button
                  type="button"
                  id="rule-symbol-1-btn"
                  onClick={() => {
                    playPieceDrop();
                    setEnlargedRuleSymbol((prev) =>
                      prev?.id === 'rule-1'
                        ? null
                        : {
                            id: 'rule-1',
                            image: STORY_3D_ASSETS.ruleSlice3d,
                            titleEn: 'Rule 1: Cake Slice (Proper Fraction)',
                            titleAf: 'Reël 1: Koekstukkie (Egte Breuk)',
                            descEn: 'Top is smaller than Bottom. Fits inside one oven pan!',
                            descAf: 'Bo is kleiner as Onder. Pas binne-in een oondpan!',
                          }
                    );
                  }}
                  className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-rose-400 shadow-md ring-2 ring-rose-950/20 shrink-0 cursor-zoom-in group hover:scale-105 transition-transform bg-rose-950/10"
                  title={
                    language === 'en'
                      ? 'Click to enlarge 3D symbol'
                      : 'Klik om 3D-simbool te vergroot'
                  }
                  aria-label="Enlarge 3D cake slice symbol"
                >
                  <img
                    src={STORY_3D_ASSETS.ruleSlice3d}
                    alt="3D Cake Slice"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <ZoomIn className="w-4 h-4 text-rose-200 drop-shadow" />
                  </div>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-rose-950">
                {language === 'en' ? 'Top is Smaller' : 'Bo is kleiner as onder'}
              </h3>
              <div className="text-xs font-bold text-rose-700 mt-0.5">
                {language === 'en' ? 'Top < Bottom' : 'Bo < Onder'}
              </div>
            </div>
            <p className="text-xs text-rose-900 font-medium">
              {language === 'en'
                ? 'Less than 1 whole cake. Fits comfortably in 1 oven pan.'
                : 'Minder as 1 hele koek. Pas maklik in 1 oondpan.'}
            </p>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-rose-200 text-xs font-mono font-bold text-rose-900 flex flex-wrap gap-2 justify-center items-center">
            <Fraction numerator={1} denominator={12} size="xs" />
            <Fraction numerator={2} denominator={12} size="xs" />
            <span className="text-rose-400">...</span>
            <Fraction numerator={11} denominator={12} size="xs" />
          </div>
        </div>

        {/* Rule 2: 1 Whole (Whole cake in pan) */}
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200 px-2.5 py-1 rounded-full">
                {language === 'en' ? 'Rule 2: Whole' : 'Reël 2: 1 Hele'}
              </span>
              <div className="flex items-center gap-2">
                <VoiceNarratorButton
                  speakerId="rule-2-whole"
                  language={language}
                  variant="icon"
                  text={
                    language === 'en'
                      ? 'Rule 2: Whole cake. When the top and bottom are identical numbers, like 12 over 12, all slices fill the pan, making exactly one whole cake!'
                      : 'Reël 2: 1 Hele koek. Wanneer die boonste en onderste getal presies dieselfde is, soos 12 op 12, vul al die stukkies die pan, wat presies een hele koek maak!'
                  }
                />
                {/* 3D Symbol Button */}
                <button
                  type="button"
                  id="rule-symbol-2-btn"
                  onClick={() => {
                    playPieceDrop();
                    setEnlargedRuleSymbol((prev) =>
                      prev?.id === 'rule-2'
                        ? null
                        : {
                            id: 'rule-2',
                            image: STORY_3D_ASSETS.ruleWhole3d,
                            titleEn: 'Rule 2: 1 Whole Cake in Pan',
                            titleAf: 'Reël 2: 1 Hele Koek in Pan',
                            descEn: 'Top equals Bottom. All slices fill the entire pan!',
                            descAf: 'Bo is gelyk aan Onder. Al die stukkies vul die hele pan!',
                          }
                    );
                  }}
                  className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md ring-2 ring-amber-950/20 shrink-0 cursor-zoom-in group hover:scale-105 transition-transform bg-amber-950/10"
                  title={
                    language === 'en'
                      ? 'Click to enlarge 3D symbol'
                      : 'Klik om 3D-simbool te vergroot'
                  }
                  aria-label="Enlarge 3D whole cake in pan symbol"
                >
                  <img
                    src={STORY_3D_ASSETS.ruleWhole3d}
                    alt="3D Whole Cake in Pan"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <ZoomIn className="w-4 h-4 text-amber-200 drop-shadow" />
                  </div>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-amber-950">
                {language === 'en' ? 'Same Number!' : 'Dieselfde Getal'}
              </h3>
              <div className="text-xs font-bold text-amber-700 mt-0.5">
                {language === 'en' ? 'Top = Bottom → 1 Whole' : 'Bo = Onder → 1 Hele'}
              </div>
            </div>
            <p className="text-xs text-amber-900 font-medium">
              {language === 'en'
                ? 'When Top and Bottom are identical, all slices fill the entire pan!'
                : 'Wanneer Bo en Onder presies dieselfde getal is, is die hele pan vol!'}
            </p>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-300 text-xs font-mono font-bold text-amber-950 flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1"><Fraction numerator={12} denominator={12} size="xs" /> = 1</span>
            <span className="text-amber-400">|</span>
            <span className="inline-flex items-center gap-1"><Fraction numerator={6} denominator={6} size="xs" /> = 1</span>
            <span className="text-amber-400">|</span>
            <span className="inline-flex items-center gap-1"><Fraction numerator={2} denominator={2} size="xs" /> = 1</span>
          </div>
        </div>

        {/* Rule 3: Improper & Mixed (Whole + Extra Slices) */}
        <div className="bg-sky-50/90 border-2 border-sky-300 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-200 px-2.5 py-1 rounded-full">
                {language === 'en' ? 'Rule 3: Mixed' : 'Reël 3: 1 + Breuk'}
              </span>
              <div className="flex items-center gap-2">
                <VoiceNarratorButton
                  speakerId="rule-3-mixed"
                  language={language}
                  variant="icon"
                  text={
                    language === 'en'
                      ? 'Rule 3: Mixed numbers. When the top number is greater than the bottom number, like 15 over 12, it overflows one pan into one whole cake plus 3 extra slices: 1 and 3 twelfths!'
                      : 'Reël 3: Gemengde getalle. Wanneer die boonste getal groter as die onderste is, soos 15 op 12, loop dit oor een pan in een hele koek plus 3 ekstra stukkies: 1 en 3 twaalfdes!'
                  }
                />
                {/* 3D Symbol Button */}
                <button
                  type="button"
                  id="rule-symbol-3-btn"
                  onClick={() => {
                    playPieceDrop();
                    setEnlargedRuleSymbol((prev) =>
                      prev?.id === 'rule-3'
                        ? null
                        : {
                            id: 'rule-3',
                            image: STORY_3D_ASSETS.ruleMixed3d,
                            titleEn: 'Rule 3: Whole + Extra Slices (Mixed Number)',
                            titleAf: 'Reël 3: Hele + Ekstra Stukkies (Gemengde Getal)',
                            descEn: 'Top is greater than Bottom. Overflows 1 pan!',
                            descAf: 'Bo is groter as Onder. Loop oor 1 pan!',
                          }
                    );
                  }}
                  className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-sky-400 shadow-md ring-2 ring-sky-950/20 shrink-0 cursor-zoom-in group hover:scale-105 transition-transform bg-sky-950/10"
                  title={
                    language === 'en'
                      ? 'Click to enlarge 3D symbol'
                      : 'Klik om 3D-simbool te vergroot'
                  }
                  aria-label="Enlarge 3D mixed cake symbol"
                >
                  <img
                    src={STORY_3D_ASSETS.ruleMixed3d}
                    alt="3D Mixed Cake"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <ZoomIn className="w-4 h-4 text-sky-200 drop-shadow" />
                  </div>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-sky-950">
                {language === 'en' ? 'Top is Greater' : 'Bo is groter as onder'}
              </h3>
              <div className="text-xs font-bold text-sky-700 mt-0.5">
                {language === 'en' ? 'Top > Bottom → 1 + Fraction' : 'Bo > Onder → 1 + Breuk'}
              </div>
            </div>
            <p className="text-xs text-sky-900 font-medium">
              {language === 'en'
                ? 'Overflows 1 pan! You need a second pan for the leftover slices.'
                : 'Loop oor 1 pan! Jy benodig \'n tweede pan vir die oorblywende stukkies.'}
            </p>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-sky-200 text-xs font-mono font-bold text-sky-950 flex items-center justify-center gap-1.5 flex-wrap">
            <Fraction numerator={15} denominator={12} size="xs" />
            <span>=</span>
            <Fraction numerator={12} denominator={12} size="xs" />
            <span>+</span>
            <Fraction numerator={3} denominator={12} size="xs" />
            <span>=</span>
            <Fraction whole={1} numerator={3} denominator={12} size="xs" />
          </div>
        </div>

        {/* Rule 4: Division (3D Division Symbol) */}
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2.5 py-1 rounded-full">
                {language === 'en' ? 'Rule 4: Division' : 'Reël 4: Breuk = ÷'}
              </span>
              <div className="flex items-center gap-2">
                <VoiceNarratorButton
                  speakerId="rule-4-division"
                  language={language}
                  variant="icon"
                  text={
                    language === 'en'
                      ? 'Rule 4: The fraction line means division. 12 over 12 means 12 divided by 12, which equals 1!'
                      : 'Reël 4: Die breukstreep beteken deelsom. 12 op 12 beteken 12 gedeel deur 12, wat gelyk is aan 1!'
                  }
                />
                {/* 3D Symbol Button */}
                <button
                  type="button"
                  id="rule-symbol-4-btn"
                  onClick={() => {
                    playPieceDrop();
                    setEnlargedRuleSymbol((prev) =>
                      prev?.id === 'rule-4'
                        ? null
                        : {
                            id: 'rule-4',
                            image: STORY_3D_ASSETS.ruleDivide3d,
                            titleEn: 'Rule 4: Division Symbol (÷)',
                            titleAf: 'Reël 4: Deelsimbool (÷)',
                            descEn: 'The fraction line between Top and Bottom represents division (÷).',
                            descAf: 'Die breukstreep tussen Bo en Onder verteenwoordig \'n deelsom (÷).',
                          }
                    );
                  }}
                  className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-md ring-2 ring-emerald-950/20 shrink-0 cursor-zoom-in group hover:scale-105 transition-transform bg-emerald-950/10"
                  title={
                    language === 'en'
                      ? 'Click to enlarge 3D symbol'
                      : 'Klik om 3D-simbool te vergroot'
                  }
                  aria-label="Enlarge 3D division symbol"
                >
                  <img
                    src={STORY_3D_ASSETS.ruleDivide3d}
                    alt="3D Division Symbol"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <ZoomIn className="w-4 h-4 text-emerald-200 drop-shadow" />
                  </div>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-emerald-950">
                {language === 'en' ? 'Fraction Means Divide' : 'Breuk = Deelsom'}
              </h3>
              <div className="text-xs font-bold text-emerald-700 mt-0.5">
                {language === 'en' ? 'Top ÷ Bottom' : 'Bo ÷ Onder'}
              </div>
            </div>
            <p className="text-xs text-emerald-900 font-medium">
              {language === 'en'
                ? 'The fraction line between Top and Bottom represents division (÷).'
                : 'Die breukstreep tussen Bo en Onder verteenwoordig \'n deelsom (÷).'}
            </p>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-950 flex items-center justify-center gap-1.5 flex-wrap">
            <Fraction numerator={12} denominator={12} size="xs" />
            <span>= 12 ÷ 12 = 1</span>
          </div>
        </div>
      </div>

      {/* Interactive Fraction Slider & Visual Dual-Pan Display */}
      <div className="cottage-parchment-card rounded-3xl p-6 md:p-8 shadow-md border-2 border-[#dfceb9]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-black text-[#381e0f]">
              {language === 'en' ? 'Interactive Fraction Transformer' : 'Interaktiewe Breuktransformeerder'}
            </h3>
            <p className="text-xs md:text-sm text-amber-800 mt-0.5">
              {language === 'en'
                ? 'Slide the numerator from 1 to 24 slices to see how it switches between Proper, 1 Whole, and Mixed fractions!'
                : 'Skuif die teller van 1 tot 24 stukkies om te sien hoe dit wissel tussen Egte, 1 Hele, en Gemengde breuke!'}
            </p>
          </div>

          {/* Current Status Pill */}
          <div
            className={`px-4 py-2 rounded-2xl font-black text-xs md:text-sm border flex items-center gap-2 ${
              isProper
                ? 'bg-rose-100 border-rose-300 text-rose-950'
                : isWhole
                ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-400/50'
                : 'bg-sky-100 border-sky-300 text-sky-950'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="inline-flex items-center gap-1.5 flex-wrap">
              {isProper ? (
                language === 'en' ? (
                  'Proper Fraction (Top < Bottom)'
                ) : (
                  'Egte Breuk (Bo < Onder)'
                )
              ) : isWhole ? (
                language === 'en' ? (
                  '🌟 Exactly 1 Whole (Top = Bottom)'
                ) : (
                  '🌟 Presies 1 Hele (Bo = Onder)'
                )
              ) : (
                <>
                  <span>{language === 'en' ? '1 + Fraction →' : '1 + Breuk →'}</span>
                  <Fraction whole={wholePart} numerator={remainderPart} denominator={denominator} size="xs" />
                </>
              )}
            </span>
          </div>
        </div>

        {/* Slider Input */}
        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 mb-6">
          <div className="flex justify-between items-center text-xs font-black text-amber-900 mb-2">
            <span>{language === 'en' ? 'Slices Picked (Top / Numerator):' : 'Stukkies Gekies (Bo):'}</span>
            <span className="bg-amber-900 text-amber-100 px-3 py-1 rounded-xl inline-flex items-center">
              <Fraction numerator={sliderNumerator} denominator={denominator} size="base" className="text-amber-100" lineClassName="border-amber-300" />
            </span>
          </div>
          <input
            id="fraction-rules-slider"
            type="range"
            min="1"
            max="24"
            value={sliderNumerator}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSliderNumerator(val);
              playSliceClick();
              if (val === 12) {
                onUnlockBadge('one-whole');
              } else if (val === 15) {
                onUnlockBadge('mixed-master');
              }
            }}
            className="w-full accent-amber-700 h-3 bg-amber-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-bold text-amber-700 mt-1 items-center">
            <Fraction numerator={1} denominator={12} size="xs" />
            <span className="font-extrabold text-amber-950 inline-flex items-center gap-1">
              <Fraction numerator={12} denominator={12} size="xs" />
              <span>({language === 'en' ? '1 Whole' : '1 Hele'})</span>
            </span>
            <span className="font-extrabold text-sky-900 inline-flex items-center gap-1">
              <Fraction numerator={15} denominator={12} size="xs" />
              <span>({language === 'en' ? 'Photo Example' : 'Foto-voorbeeld'})</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Fraction numerator={24} denominator={12} size="xs" />
              <span>({language === 'en' ? '2 Wholes' : '2 Hele'})</span>
            </span>
          </div>
        </div>

        {/* Dual Oven Pan Visual Demonstration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Pan 1 (First 12 slices) */}
          <div className="bg-stone-800 p-4 rounded-2xl border-2 border-stone-600">
            <div className="flex justify-between items-center text-xs font-bold text-stone-300 mb-2">
              <span>{language === 'en' ? 'Pan #1 (First 12 Slices)' : 'Pan #1 (Eerste 12 stukkies)'}</span>
              <span className="text-amber-400 inline-flex items-center">
                <Fraction numerator={Math.min(sliderNumerator, 12)} denominator={12} size="xs" />
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 h-32">
              {Array.from({ length: 12 }).map((_, i) => {
                const filled = i < sliderNumerator;
                return (
                  <div
                    key={`pan1-${i}`}
                    className={`rounded-lg flex flex-col items-center justify-center p-0.5 border transition-all ${
                      filled
                        ? 'bg-amber-600 border-amber-300 text-white shadow-sm'
                        : 'bg-amber-950/80 border-amber-900/60 text-amber-400/40'
                    }`}
                  >
                    <Fraction numerator={1} denominator={12} size="xs" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pan 2 (Overflow slices if > 12) */}
          <div
            className={`p-4 rounded-2xl border-2 transition-all ${
              sliderNumerator > 12
                ? 'bg-stone-800 border-sky-400 shadow-md'
                : 'bg-stone-900/40 border-dashed border-stone-700 opacity-60'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-bold text-stone-300 mb-2">
              <span>{language === 'en' ? 'Pan #2 (Overflow Slices)' : 'Pan #2 (Ekstra stukkies)'}</span>
              <span className="text-sky-300 inline-flex items-center">
                <Fraction numerator={sliderNumerator > 12 ? sliderNumerator - 12 : 0} denominator={12} size="xs" />
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 h-32">
              {Array.from({ length: 12 }).map((_, i) => {
                const filled = sliderNumerator > 12 && i < sliderNumerator - 12;
                return (
                  <div
                    key={`pan2-${i}`}
                    className={`rounded-lg flex flex-col items-center justify-center p-0.5 border transition-all ${
                      filled
                        ? 'bg-sky-600 border-sky-300 text-white shadow-sm'
                        : 'bg-stone-900/60 border-stone-800 text-stone-600'
                    }`}
                  >
                    <Fraction numerator={1} denominator={12} size="xs" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculation summary line matching photo */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-100/70 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <VoiceNarratorButton
              speakerId="slider-breakdown"
              language={language}
              variant="icon"
              text={
                language === 'en'
                  ? `Mathematical breakdown: ${sliderNumerator} over ${denominator}. ${
                      sliderNumerator < denominator
                        ? `Top is smaller than bottom, so this is a proper fraction.`
                        : sliderNumerator === denominator
                        ? `Top and bottom are equal, exactly one whole cake!`
                        : `Top is greater than bottom! That equals ${wholePart} whole cake and ${remainderPart} twelfths!`
                    } Division result: ${sliderNumerator} divided by ${denominator} is ${(sliderNumerator / denominator).toFixed(2)}.`
                  : `Wiskundige berekening: ${sliderNumerator} op ${denominator}. ${
                      sliderNumerator < denominator
                        ? `Bo is kleiner as onder, so dit is 'n egte breuk.`
                        : sliderNumerator === denominator
                        ? `Bo en onder is gelyk, presies een hele koek!`
                        : `Bo is groter as onder! Dit is gelyk aan ${wholePart} hele koek en ${remainderPart} twaalfdes!`
                    } Deelsom-uitslag: ${sliderNumerator} gedeel deur ${denominator} is ${(sliderNumerator / denominator).toFixed(2)}.`
              }
            />
            <div>
              <div className="text-xs font-black uppercase text-amber-800">
                {language === 'en' ? 'Exact Mathematical Breakdown' : 'Wiskundige Berekening'}
              </div>
              <div className="text-base font-black text-amber-950 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <Fraction numerator={sliderNumerator} denominator={denominator} size="base" />
                <span>=</span>
                {sliderNumerator < denominator ? (
                  <span className="inline-flex items-center gap-1">
                    <Fraction numerator={sliderNumerator} denominator={denominator} size="base" />
                    <span>({language === 'en' ? 'Proper' : 'Egte Breuk'})</span>
                  </span>
                ) : sliderNumerator === denominator ? (
                  <span className="inline-flex items-center gap-1">
                    <Fraction numerator={12} denominator={12} size="base" />
                    <span>= {language === 'en' ? '1 Whole' : '1 Hele'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 flex-wrap">
                    <Fraction numerator={12} denominator={12} size="base" />
                    <span>+</span>
                    <Fraction numerator={remainderPart} denominator={denominator} size="base" />
                    <span>=</span>
                    <span className="underline decoration-sky-500 font-extrabold">
                      <Fraction whole={wholePart} numerator={remainderPart} denominator={denominator} size="base" />
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-xs font-bold text-amber-900 bg-white px-3 py-2 rounded-xl border border-amber-200">
            {language === 'en' ? 'Division Result:' : 'Deelsom-uitslag:'}{' '}
            <span className="font-mono font-black text-amber-800">
              {sliderNumerator} ÷ {denominator} = {(sliderNumerator / denominator).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Gamified Rules Mini-Quiz Check */}
      <div className="cottage-parchment-card rounded-3xl p-6 md:p-8 shadow-md border-2 border-[#dfceb9]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="text-lg font-black text-[#381e0f]">
                {language === 'en' ? 'Rules Mastery Quiz' : 'Breukreël-vasvra'}
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                {language === 'en'
                  ? `Question ${activeQuizIndex + 1} of ${quizQuestions.length}`
                  : `Vraag ${activeQuizIndex + 1} van ${quizQuestions.length}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-xl text-xs font-black">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Score: {quizScore}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-block bg-amber-900 text-amber-100 font-mono font-black text-xl px-4 py-1.5 rounded-xl shadow-sm">
              <FormattedFractionText
                text={
                  'fractionEn' in currentQ && currentQ.fractionEn
                    ? language === 'en'
                      ? currentQ.fractionEn
                      : (currentQ.fractionAf || currentQ.fraction)
                    : currentQ.fraction
                }
                size="lg"
                fractionClassName="text-amber-100"
              />
            </div>
            <VoiceNarratorButton
              speakerId={`quiz-q-${activeQuizIndex}`}
              language={language}
              variant="icon"
              text={`${'fractionEn' in currentQ && currentQ.fractionEn ? (language === 'en' ? currentQ.fractionEn : currentQ.fractionAf) : currentQ.fraction}. ${language === 'en' ? currentQ.promptEn : currentQ.promptAf}`}
            />
          </div>
          <div className="text-sm md:text-base font-bold text-amber-950 mb-4">
            <FormattedFractionText text={language === 'en' ? currentQ.promptEn : currentQ.promptAf} size="base" />
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {currentQ.options.map((opt) => {
              const isChosen = selectedAnswer === opt.id;
              const isRight = opt.id === currentQ.correctId;

              let btnStyle = 'bg-white hover:bg-amber-100 text-amber-950 border-amber-300';
              if (answeredQuestion) {
                if (isRight) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400';
                } else if (isChosen && !isRight) {
                  btnStyle = 'bg-rose-600 text-white border-rose-700';
                } else {
                  btnStyle = 'bg-stone-100 text-stone-400 border-stone-200 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  id={`quiz-opt-${opt.id}`}
                  onClick={() => handleAnswer(opt.id)}
                  disabled={answeredQuestion}
                  className={`p-3.5 rounded-xl font-bold text-xs md:text-sm text-left border transition-all cursor-pointer ${btnStyle}`}
                >
                  <FormattedFractionText text={language === 'en' ? opt.labelEn : opt.labelAf} size="sm" />
                </button>
              );
            })}
          </div>

          {/* Answer explanation banner */}
          {answeredQuestion && (
            <div className="mt-4 p-4 rounded-xl bg-white border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-amber-950">
                <VoiceNarratorButton
                  speakerId={`quiz-explain-${activeQuizIndex}`}
                  language={language}
                  variant="icon"
                  text={language === 'en' ? currentQ.explainEn : currentQ.explainAf}
                />
                <div>
                  <FormattedFractionText text={language === 'en' ? currentQ.explainEn : currentQ.explainAf} size="sm" />
                </div>
              </div>
              <button
                id="quiz-next-btn"
                onClick={handleNextQuestion}
                className="shrink-0 flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-amber-100 px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-sm"
              >
                <span>
                  {activeQuizIndex === quizQuestions.length - 1
                    ? language === 'en'
                      ? 'Finish Quiz'
                      : 'Voltooi Vasvra'
                    : language === 'en'
                    ? 'Next Question'
                    : 'Volgende Vraag'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Centered Bottom Navigation Buttons: Back & Next Chapter (matching Chapter 1 and Chapter 2) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 pb-2">
        {/* Left: Back */}
        <button
          type="button"
          id="chapter-three-back-btn"
          onClick={() => {
            playSliceClick();
            if (onPrevious) {
              onPrevious();
            }
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#381e0f] hover:bg-[#4a2814] active:scale-95 transition-all text-amber-200 hover:text-amber-100 font-bold text-xs sm:text-sm md:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-md border-2 border-amber-400/80 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300 group-hover:-translate-x-1 transition-transform shrink-0" />
          <span className="text-xs sm:text-sm md:text-base font-bold leading-normal tracking-normal">
            {language === 'en' ? 'Back' : 'Terug'}
          </span>
        </button>

        {/* Right: Next Chapter - exact same styling and sizing as Chapters 1 and 2 */}
        <button
          type="button"
          id="chapter-three-next-btn"
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

      {/* Enlarged 3D Rule Symbol Modal - clicks to enlarge, clicks again to shrink */}
      <AnimatePresence>
        {enlargedRuleSymbol && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
            onClick={() => {
              playSliceClick();
              setEnlargedRuleSymbol(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={() => {
                playSliceClick();
                setEnlargedRuleSymbol(null);
              }}
              className="relative max-w-md w-full bg-[#fcf8f2] rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-amber-400 ring-4 ring-[#452412]/80 overflow-hidden cursor-zoom-out select-none group"
              title={
                language === 'en'
                  ? 'Click anywhere within the frame to shrink back'
                  : 'Klik enige plek binne die raam om te verklein'
              }
            >
              <button
                type="button"
                onClick={() => {
                  playSliceClick();
                  setEnlargedRuleSymbol(null);
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-amber-900 hover:bg-amber-800 text-amber-100 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer z-10"
                title={language === 'en' ? 'Click to shrink back' : 'Klik om te verklein'}
                aria-label="Close enlarged symbol"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-amber-300 shadow-inner bg-amber-950/10">
                <img
                  src={enlargedRuleSymbol.image}
                  alt={language === 'en' ? enlargedRuleSymbol.titleEn : enlargedRuleSymbol.titleAf}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-xl sm:text-2xl font-black text-amber-950">
                  {language === 'en' ? enlargedRuleSymbol.titleEn : enlargedRuleSymbol.titleAf}
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 font-semibold mt-1">
                  {language === 'en' ? enlargedRuleSymbol.descEn : enlargedRuleSymbol.descAf}
                </p>
                <div className="mt-2 text-[11px] text-amber-700/80 font-medium">
                  {language === 'en'
                    ? 'Click anywhere within the frame to shrink back'
                    : 'Klik enige plek binne die raam om te verklein'}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
