import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ArrowLeft, ArrowRight, CheckCircle, Sparkles, HelpCircle, RefreshCw, Calculator } from 'lucide-react';
import { Language, AdditionProblem } from '../types';
import { PHOTO_ADDITION_PROBLEMS, lcm } from '../utils/fraction';
import { playSliceClick, playSuccessChime } from '../utils/audio';
import { VoiceNarratorButton } from './VoiceNarratorButton';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { Fraction, FormattedFractionText } from './Fraction';

interface AdditionWizardProps {
  language: Language;
  onPrevious?: () => void;
  onNext?: () => void;
  onCompleteLesson: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const AdditionWizard: React.FC<AdditionWizardProps> = ({
  language,
  onPrevious,
  onNext,
  onCompleteLesson,
  onAwardXp,
  onUnlockBadge,
}) => {
  const [activeProblemIndex, setActiveProblemIndex] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Denominators, 2: Multiplier Boxes, 3: Add Tops, 4: Mixed Number
  const [customNum1, setCustomNum1] = useState<number>(1);
  const [customDen1, setCustomDen1] = useState<number>(3);
  const [customNum2, setCustomNum2] = useState<number>(1);
  const [customDen2, setCustomDen2] = useState<number>(4);

  const problem = PHOTO_ADDITION_PROBLEMS[activeProblemIndex];

  const handleNextStep = () => {
    playSliceClick();
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      if (currentStep === 3) {
        playSuccessChime();
        onUnlockBadge('addition-wizard');
        onAwardXp(30, 'Completed Step-by-Step Fraction Addition!');
      }
    } else {
      // Advance to next problem if available
      if (activeProblemIndex < PHOTO_ADDITION_PROBLEMS.length - 1) {
        setActiveProblemIndex((prev) => prev + 1);
        setCurrentStep(1);
      } else {
        onCompleteLesson();
        onAwardXp(40, 'Mastered all photo addition examples!');
      }
    }
  };

  const handleSelectProblem = (idx: number) => {
    playSliceClick();
    setActiveProblemIndex(idx);
    setCurrentStep(1);
  };

  // Custom problem calculations
  const customCommon = lcm(customDen1, customDen2) || 12;
  const customMult1 = customCommon / customDen1;
  const customMult2 = customCommon / customDen2;
  const customNewNum1 = customNum1 * customMult1;
  const customNewNum2 = customNum2 * customMult2;
  const customSumNum = customNewNum1 + customNewNum2;
  const customWhole = Math.floor(customSumNum / customCommon);
  const customRem = customSumNum % customCommon;

  const getStepVoiceText = () => {
    if (currentStep === 1) {
      return language === 'en'
        ? `Step 1: Inspect denominators. We want to add ${problem.f1.num} over ${problem.f1.den} plus ${problem.f2.num} over ${problem.f2.den}. Because the bottom numbers are different, we cannot add them yet! We must find a common denominator, which is ${problem.commonDen}.`
        : `Stap 1: Ondersoek die noemers. Ons wil ${problem.f1.num} op ${problem.f1.den} plus ${problem.f2.num} op ${problem.f2.den} bymekaar tel. Omdat die onderste getalle verskil, kan ons hulle nog nie bymekaar tel nie! Ons moet 'n gemeenskaplike noemer vind, wat ${problem.commonDen} is.`;
    }
    if (currentStep === 2) {
      return language === 'en'
        ? `Step 2: Equalize denominators using our pink multiplier boxes! We multiply the first fraction by ${problem.multiplier1} and the second by ${problem.multiplier2}. Now we have ${problem.newNum1} over ${problem.commonDen} plus ${problem.newNum2} over ${problem.commonDen}. Both bottom numbers are now equal!`
        : `Stap 2: Maak noemers gelyk met die pienk vermenigvuldigingsblokkies! Ons vermenigvuldig die eerste breuk met ${problem.multiplier1} en die tweede met ${problem.multiplier2}. Nou het ons ${problem.newNum1} op ${problem.commonDen} plus ${problem.newNum2} op ${problem.commonDen}. Albei onderste getalle is nou gelyk!`;
    }
    if (currentStep === 3) {
      return language === 'en'
        ? `Step 3: Add the top numbers only! ${problem.newNum1} plus ${problem.newNum2} equals ${problem.sumNum}. The bottom number stays ${problem.commonDen}. So we have ${problem.sumNum} over ${problem.commonDen}!`
        : `Stap 3: Tel net die boonste getalle bymekaar! ${problem.newNum1} plus ${problem.newNum2} is gelyk aan ${problem.sumNum}. Die onderste getal bly ${problem.commonDen}. Ons het dus ${problem.sumNum} op ${problem.commonDen}!`;
    }
    return language === 'en'
      ? `Step 4: Check if the top is larger than the bottom. ${problem.sumNum} over ${problem.commonDen} is an improper fraction. ${problem.commonDen} over ${problem.commonDen} makes 1 whole cake, so our final answer is ${problem.wholeNumber > 0 ? `${problem.wholeNumber} whole cake and ${problem.remNum} over ${problem.commonDen}!` : 'a proper fraction!'}`
      : `Stap 4: Kyk of die boonste getal groter is as onder. ${problem.sumNum} op ${problem.commonDen} is 'n onegte breuk. ${problem.commonDen} op ${problem.commonDen} maak 1 hele koek, so ons finale antwoord is ${problem.wholeNumber > 0 ? `${problem.wholeNumber} hele koek en ${problem.remNum} op ${problem.commonDen}!` : `'n egte breuk!`}`;
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Village Bakery 3D Cottagecore Hero Banner - Chapter 5: Adding Fractions Step-by-Step */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
        {/* 3D Cinematic Render Background with soft watermark effect */}
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          <img
            src={STORY_3D_ASSETS.chapter5TeacherHero}
            alt="3D Bumblewood Cottage Bakery - Teacher Hazel teaching little mice fractions"
            className="w-full h-full object-cover object-[50%_50%]"
            referrerPolicy="no-referrer"
          />
          {/* Soft, balanced vignette overlays - clear and pleasing to the eye */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Banner text & controls */}
          <div className="absolute inset-0 p-3.5 sm:p-5 md:p-7 flex flex-col justify-between z-10">
            {/* Top row: Chapter 5 yellow block in top-left; Photo Examples & Bakery Lab tabs in top-right with Read to me below it */}
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex items-center bg-amber-300 text-amber-950 border-2 border-amber-400 text-sm sm:text-base md:text-lg lg:text-xl font-black px-4.5 sm:px-5.5 py-1.5 sm:py-2.5 rounded-xl shadow-md">
                <span>{language === 'en' ? 'Chapter 5' : 'Hoofstuk 5'}</span>
              </div>

              {/* Top right corner: Photo Examples and Bakery Lab quick navigation, and below it Read to me */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center bg-[#1f1007]/90 backdrop-blur-xs p-1 sm:p-1.5 rounded-2xl border border-amber-400/70 shadow-lg">
                  <button
                    id="photo-tab-btn"
                    onClick={() => {
                      playSliceClick();
                      document.getElementById('photo-examples-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl font-bold text-[11px] sm:text-xs cursor-pointer transition-all bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-[#2a1406] shadow-sm font-black active:scale-95"
                  >
                    {language === 'en' ? 'Photo Examples' : 'Fotovoorbeelde'}
                  </button>
                  <button
                    id="custom-tab-btn"
                    onClick={() => {
                      playSliceClick();
                      document.getElementById('bakery-lab-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl font-bold text-[11px] sm:text-xs cursor-pointer transition-all bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-[#2a1406] shadow-sm font-black active:scale-95 ml-1"
                  >
                    {language === 'en' ? 'Bakery Lab' : 'Bakkery-laboratorium'}
                  </button>
                </div>

                {/* Below it: Read to me */}
                <VoiceNarratorButton
                  speakerId="addition-intro"
                  language={language}
                  size="md"
                  text={
                    language === 'en'
                      ? 'Chapter 5: Adding Fractions Step-by-Step. Teacher Hazel teaches the little mice how to add fractions! Follow the colored multiplier boxes from the study sheet to find common denominators and convert improper fractions into whole cakes!'
                      : 'Hoofstuk 5: Breuke Stap-vir-Stap Optel. Juffrou Hazel leer die klein muisies hoe om breuke bymekaar te tel! Volg die gekleurde vermenigvuldigingsblokkies vanaf die studienota om gemeenskaplike noemers te vind en onegte breuke om te skakel na hele koeke!'
                  }
                />
              </div>
            </div>

            {/* Bottom row: Main heading & description */}
            <div className="w-full max-w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
                {language === 'en' ? 'Adding Fractions Step-by-Step' : 'Breuke Stap-vir-Stap Optel'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-200 font-bold drop-shadow mt-1.5 sm:mt-2 md:whitespace-nowrap">
                {language === 'en'
                  ? 'Follow the exact colored multiplier boxes from the study sheet to find common denominators!'
                  : 'Volg die gekleurde vermenigvuldigingsblokkies vanaf die studienota om gemeenskaplike noemers te vind!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Golden Rules of Addition banner */}
      <div className="cottage-parchment-card rounded-3xl p-6 md:p-8 border-2 border-[#dfceb9] space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#3d2412] tracking-tight">
              {language === 'en' ? 'The 4 Golden Rules of Adding Fractions' : 'Die 4 Goue Reëls vir Breukoptel'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1">
              {language === 'en'
                ? 'Remember: Top is the Numerator (slices you have) and Bottom is the Denominator (equal parts in 1 whole)!'
                : 'Onthou: Bo is die Teller (stukkies wat jy het) en Onder is die Noemer (gelyke dele in 1 hele koek)!'}
            </p>
          </div>
          <VoiceNarratorButton
            speakerId="addition-golden-rules"
            language={language}
            size="md"
            text={
              language === 'en'
                ? 'The 4 Golden Rules of Adding Fractions. Remember: the top number is the numerator and the bottom number is the denominator! Rule 1: Check the bottoms. Denominators must be identical before we can add. Rule 2: Equalize with multipliers! Multiply both numerator and denominator by the same number. Rule 3: Add tops only! The bottom denominator stays the same. Rule 4: If the top numerator is larger than the denominator, convert to a mixed number with whole cakes!'
                : 'Die 4 Goue Reëls vir Breukoptel. Onthou: die boonste getal is die teller en die onderste getal is die noemer! Reël 1: Kyk na die onderkant. Noemers moet gelyk wees voor ons kan optel. Reël 2: Maak gelyk met vermenigvuldigers! Vermenigvuldig beide teller en noemer met dieselfde getal. Reël 3: Tel net die boonste tellers bymekaar! Die onderste noemer bly dieselfde. Reël 4: As die boonste teller groter is as die noemer, skakel dit om na \'n gemengde getal met hele koeke!'
            }
          />
        </div>

        {/* 4 Cards enlarged to match Chapter 3 size and layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rule 1: Denominators (Rose Theme) */}
          <div className="bg-rose-50/80 border-2 border-rose-300 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-200/80 px-2.5 py-1 rounded-full">
                  {language === 'en' ? 'Rule 1: Denominators' : 'Reël 1: Noemers'}
                </span>
                <VoiceNarratorButton
                  speakerId="rule-add-1"
                  language={language}
                  variant="icon"
                  text={
                    language === 'en'
                      ? 'Rule 1: Check the bottoms. The bottom number is the denominator. Before adding fractions, the denominators must be exactly identical!'
                      : 'Reël 1: Kyk na die onderkant. Die onderste getal is die noemer. Voordat ons breuke kan optel, moet die noemers presies gelyk wees!'
                  }
                />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-black text-rose-950">
                  {language === 'en' ? 'Check the Bottoms' : 'Kyk na die Noemers'}
                </h4>
                <div className="text-xs font-bold text-rose-700 mt-0.5">
                  {language === 'en' ? 'Bottom = Denominator' : 'Onder = Noemer'}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-rose-900 font-medium leading-relaxed flex items-center gap-1.5 flex-wrap">
                <span>{language === 'en' ? 'Can we add' : 'Kan ons'}</span>
                <Fraction numerator={4} denominator={6} size="xs" />
                <span>{language === 'en' ? 'and' : 'en'}</span>
                <Fraction numerator={5} denominator={12} size="xs" />
                <span>
                  {language === 'en'
                    ? 'directly? No! Denominators (bottom numbers) must be identical first.'
                    : 'dadelik optel? Nee! Noemers (onderste getalle) moet eers presies gelyk wees.'}
                </span>
              </div>
            </div>

            <div className="bg-white/90 p-2.5 rounded-xl border border-rose-200 text-xs font-mono font-bold text-rose-900 flex flex-wrap gap-1.5 justify-center items-center">
              <Fraction numerator={4} denominator={6} size="xs" />
              <span>+</span>
              <Fraction numerator={5} denominator={12} size="xs" />
              <span>➔</span>
              <span className="text-rose-600 font-bold">6 ≠ 12</span>
            </div>
          </div>

          {/* Rule 2: Multipliers (Amber Theme) */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200 px-2.5 py-1 rounded-full">
                  {language === 'en' ? 'Rule 2: Equalize' : 'Reël 2: Maak Gelyk'}
                </span>
                <VoiceNarratorButton
                  speakerId="rule-add-2"
                  language={language}
                  variant="icon"
                  text={
                    language === 'en'
                      ? 'Rule 2: Equalize with multipliers! Multiply both the top numerator and bottom denominator by the same multiplier box number.'
                      : 'Reël 2: Maak gelyk met vermenigvuldigers! Vermenigvuldig beide die boonste teller en onderste noemer met dieselfde getal.'
                  }
                />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-black text-amber-950">
                  {language === 'en' ? 'Multiplier Boxes' : 'Vermenigvuldiger-blokkies'}
                </h4>
                <div className="text-xs font-bold text-amber-700 mt-0.5">
                  {language === 'en' ? 'Top = Numerator | Bottom = Denominator' : 'Bo = Teller | Onder = Noemer'}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                {language === 'en'
                  ? 'Multiply BOTH top (numerator) and bottom (denominator) by the same multiplier box factor.'
                  : 'Vermenigvuldig ALBEI die boonste teller en onderste noemer met dieselfde getal.'}
              </p>
            </div>

            <div className="bg-white/90 p-2.5 rounded-xl border border-amber-300 text-xs font-mono font-bold text-amber-950 flex flex-wrap gap-2 justify-center items-center">
              <div className="flex flex-col items-center">
                <span>(4 × 2)</span>
                <div className="w-12 h-0.5 bg-amber-800 my-0.5" />
                <span>(6 × 2)</span>
              </div>
              <span>➔</span>
              <Fraction numerator={8} denominator={12} size="xs" />
            </div>
          </div>

          {/* Rule 3: Add Tops (Sky Theme) */}
          <div className="bg-sky-50/90 border-2 border-sky-300 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-200 px-2.5 py-1 rounded-full">
                  {language === 'en' ? 'Rule 3: Add Tops' : 'Reël 3: Tel Bo By'}
                </span>
                <VoiceNarratorButton
                  speakerId="rule-add-3"
                  language={language}
                  variant="icon"
                  text={
                    language === 'en'
                      ? 'Rule 3: Add tops only! The top number is the numerator. Add 8 plus 5 to get 13. The bottom denominator never changes and stays 12!'
                      : 'Reël 3: Tel net bo bymekaar! Die boonste getal is die teller. Tel 8 plus 5 om 13 te kry. Die onderste noemer bly 12!'
                  }
                />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-black text-sky-950">
                  {language === 'en' ? 'Add Numerators Only' : 'Tel Net Tellers By'}
                </h4>
                <div className="text-xs font-bold text-sky-700 mt-0.5">
                  {language === 'en' ? 'Add Tops | Bottom stays the same!' : 'Tel Bo By | Onder bly dieselfde!'}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-sky-900 font-medium leading-relaxed">
                {language === 'en'
                  ? 'Add 8 + 5 = 13 on top (numerators). The bottom denominator stays 12 and never changes!'
                  : 'Tel 8 + 5 = 13 bo (tellers) bymekaar. Die onderste noemer bly 12 en verander nooit nie!'}
              </p>
            </div>

            <div className="bg-white/90 p-2.5 rounded-xl border border-sky-200 text-xs font-mono font-bold text-sky-950 flex flex-wrap gap-1.5 justify-center items-center">
              <Fraction numerator={8} denominator={12} size="xs" />
              <span>+</span>
              <Fraction numerator={5} denominator={12} size="xs" />
              <span>=</span>
              <Fraction numerator={13} denominator={12} size="xs" />
            </div>
          </div>

          {/* Rule 4: Mixed Number (Emerald Theme) */}
          <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2.5 py-1 rounded-full">
                  {language === 'en' ? 'Rule 4: Mixed Number' : 'Reël 4: Gemengde Getal'}
                </span>
                <VoiceNarratorButton
                  speakerId="rule-add-4"
                  language={language}
                  variant="icon"
                  text={
                    language === 'en'
                      ? 'Rule 4: Convert improper fractions to mixed numbers! When the top numerator is greater than the bottom denominator, it overflows 1 pan into 1 whole cake plus leftover slices.'
                      : 'Reël 4: Skakel onegte breuke om na gemengde getalle! Wanneer die boonste teller groter is as die onderste noemer, loop dit oor in 1 hele koek plus oorskiet-stukkies.'
                  }
                />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-black text-emerald-950">
                  {language === 'en' ? 'Whole Cake + Leftover' : 'Hele Koek + Oorskiet'}
                </h4>
                <div className="text-xs font-bold text-emerald-700 mt-0.5">
                  {language === 'en' ? 'Top > Bottom → Mixed Number' : 'Bo > Onder → Gemengde Getal'}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed">
                {language === 'en'
                  ? 'When top numerator > bottom denominator, it overflows! 12/12 makes 1 whole cake, plus 1/12 extra slice.'
                  : 'Wanneer die boonste teller > onderste noemer is, loop dit oor! 12/12 maak 1 hele koek, plus 1/12 stukkie.'}
              </p>
            </div>

            <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-950 flex flex-wrap gap-1.5 justify-center items-center">
              <Fraction numerator={13} denominator={12} size="xs" />
              <span>=</span>
              <Fraction whole={1} numerator={1} denominator={12} size="xs" />
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <span>{language === 'en' ? '(1 Whole Cake +' : '(1 Hele Koek +'}</span>
                <Fraction numerator={1} denominator={12} size="xs" />
                <span>)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Additions step-by-step Banner */}
      <div id="photo-examples-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-200/80 space-y-6">
          {/* Top heading requested by user: Additions step-by-step */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#381e0f] tracking-tight">
                {language === 'en' ? 'Additions step-by-step' : 'Optel stap-vir-stap'}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1">
                {language === 'en'
                  ? 'Select an example and follow the step-by-step addition with multiplier boxes!'
                  : 'Kies \'n voorbeeld en volg die stap-vir-stap optel met vermenigvuldigers!'}
              </p>
            </div>
            <VoiceNarratorButton
              speakerId="photo-addition-heading"
              language={language}
              size="md"
              text={
                language === 'en'
                  ? 'Additions step-by-step. Select an example to follow the step-by-step addition process with colored multiplier boxes!'
                  : 'Optel stap-vir-stap. Kies \'n voorbeeld om die stap-vir-stap optelproses met gekleurde vermenigvuldigers te volg!'
              }
            />
          </div>

          {/* Problem Selector Bar - fractions displayed on top of each other, not with slashes */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
            {PHOTO_ADDITION_PROBLEMS.map((prob, idx) => {
              const isSelected = idx === activeProblemIndex;
              return (
                <button
                  key={prob.id}
                  id={`select-addition-prob-${idx}`}
                  onClick={() => handleSelectProblem(idx)}
                  className={`px-3.5 py-2 rounded-2xl font-bold text-xs whitespace-nowrap border-2 transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-md ring-2 ring-amber-400'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
                  }`}
                >
                  <span className="font-black">
                    {language === 'en' ? `Example ${idx + 1}:` : `Voorbeeld ${idx + 1}:`}
                  </span>
                  <div className="inline-flex items-center gap-1">
                    <Fraction
                      numerator={prob.f1.num}
                      denominator={prob.f1.den}
                      size="xs"
                      className={isSelected ? 'text-amber-50' : 'text-amber-950'}
                      lineClassName={isSelected ? 'border-amber-300' : 'border-amber-800'}
                    />
                    <span className={isSelected ? 'text-amber-300 font-black' : 'text-amber-700 font-bold'}>+</span>
                    <Fraction
                      numerator={prob.f2.num}
                      denominator={prob.f2.den}
                      size="xs"
                      className={isSelected ? 'text-amber-50' : 'text-amber-950'}
                      lineClassName={isSelected ? 'border-amber-300' : 'border-amber-800'}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepped Interactive Addition Board (Styled like handwritten note) */}
          <div className="bg-amber-50/40 rounded-3xl p-6 md:p-8 border-2 border-amber-200 relative mt-3">
            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-wider text-pink-800 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
                • {language === 'en' ? 'Interactive Addition Board' : 'Interaktiewe Optelbord'} •
              </span>
              <div className="flex items-center justify-center gap-2.5 text-2xl sm:text-3xl font-black text-amber-950 mt-3 flex-wrap">
                <span>
                  {language === 'en'
                    ? `Example ${activeProblemIndex + 1}:`
                    : `Voorbeeld ${activeProblemIndex + 1}:`}
                </span>
                <Fraction numerator={problem.f1.num} denominator={problem.f1.den} size="md" />
                <span className="text-pink-600 font-extrabold">+</span>
                <Fraction numerator={problem.f2.num} denominator={problem.f2.den} size="md" />
              </div>
            </div>

            {/* The Equation Display with Animated Stages */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-4 font-mono select-none">
              {/* Fraction 1 with Multiplier Box (e.g. 4/6 x2/x2) */}
              <div className="relative p-3 sm:p-4 rounded-2xl border-2 border-pink-500 bg-pink-50/70 shadow-sm flex flex-col items-center">
                <div className="flex items-center gap-1 font-black text-2xl sm:text-3xl text-pink-950">
                  <span>{problem.f1.num}</span>
                  {problem.multiplier1 > 1 && (
                    <span className="text-pink-600 font-extrabold text-sm sm:text-base">
                      ×{problem.multiplier1}
                    </span>
                  )}
                </div>
                <div className="w-16 sm:w-20 h-0.5 bg-pink-600 my-1" />
                <div className="flex items-center gap-1 font-black text-2xl sm:text-3xl text-pink-950">
                  <span>{problem.f1.den}</span>
                  {problem.multiplier1 > 1 && (
                    <span className="text-pink-600 font-extrabold text-sm sm:text-base">
                      ×{problem.multiplier1}
                    </span>
                  )}
                </div>
                {/* Note annotation */}
                <div className="text-[10px] text-pink-700 font-bold uppercase mt-1">
                  {problem.multiplier1 > 1 ? `×${problem.multiplier1}` : 'kept'}
                </div>
              </div>

              {/* Plus Sign */}
              <div className="text-3xl sm:text-4xl font-black text-amber-800">+</div>

              {/* Fraction 2 with Multiplier Box */}
              <div className="relative p-3 sm:p-4 rounded-2xl border-2 border-pink-500 bg-pink-50/70 shadow-sm flex flex-col items-center">
                <div className="flex items-center gap-1 font-black text-2xl sm:text-3xl text-pink-950">
                  <span>{problem.f2.num}</span>
                  {problem.multiplier2 > 1 && (
                    <span className="text-pink-600 font-extrabold text-sm sm:text-base">
                      ×{problem.multiplier2}
                    </span>
                  )}
                </div>
                <div className="w-16 sm:w-20 h-0.5 bg-pink-600 my-1" />
                <div className="flex items-center gap-1 font-black text-2xl sm:text-3xl text-pink-950">
                  <span>{problem.f2.den}</span>
                  {problem.multiplier2 > 1 && (
                    <span className="text-pink-600 font-extrabold text-sm sm:text-base">
                      ×{problem.multiplier2}
                    </span>
                  )}
                </div>
                {/* Note annotation */}
                <div className="text-[10px] text-pink-700 font-bold uppercase mt-1">
                  {problem.multiplier2 > 1 ? `×${problem.multiplier2}` : 'kept'}
                </div>
              </div>

              {/* Arrow -> */}
              <div className="text-2xl sm:text-3xl font-black text-amber-700">➔</div>

              {/* Common Denominator Stage (e.g. 8/12 + 5/12) */}
              <AnimatePresence>
                {currentStep >= 2 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-2xl border-2 border-amber-300 shadow-sm"
                  >
                    <div className="flex flex-col items-center font-black text-2xl sm:text-3xl text-amber-950">
                      <span>{problem.newNum1}</span>
                      <div className="w-12 h-0.5 bg-amber-900 my-1" />
                      <span>{problem.commonDen}</span>
                    </div>

                    <div className="text-2xl font-black text-amber-800">+</div>

                    <div className="flex flex-col items-center font-black text-2xl sm:text-3xl text-amber-950">
                      <span>{problem.newNum2}</span>
                      <div className="w-12 h-0.5 bg-amber-900 my-1" />
                      <span>{problem.commonDen}</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-4 rounded-2xl border-2 border-dashed border-amber-300 text-xs font-bold text-amber-700">
                    {language === 'en' ? 'Click "Step 2" to reveal' : 'Klik "Stap 2" om te sien'}
                  </div>
                )}
              </AnimatePresence>

              {/* Equals = Sum Stage (e.g. 13/12 in pink box) */}
              <AnimatePresence>
                {currentStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="text-2xl font-black text-amber-800">=</div>

                    <div className="p-3 sm:p-4 rounded-2xl border-2 border-pink-500 bg-pink-100 font-black text-2xl sm:text-3xl text-pink-950 flex flex-col items-center shadow-md">
                      <span>{problem.sumNum}</span>
                      <div className="w-12 h-0.5 bg-pink-800 my-1" />
                      <span>{problem.commonDen}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mixed Number Stage (e.g. = 1 1/12 with double underline & blue 12/12 + 1/12 breakdown) */}
              <AnimatePresence>
                {currentStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="text-2xl font-black text-amber-800">=</div>

                    <div className="flex flex-col items-center">
                      <div className="font-black text-2xl sm:text-3xl text-pink-900 border-b-4 border-double border-pink-600 pb-0.5 flex items-center gap-1.5">
                        {problem.wholeNumber > 0 && <span>{problem.wholeNumber}</span>}
                        <div className="flex flex-col items-center text-xl">
                          <span>{problem.remNum}</span>
                          <div className="w-6 h-0.5 bg-pink-800 my-0.5" />
                          <span>{problem.commonDen}</span>
                        </div>
                      </div>

                      {/* Handwritten Blue Note underneath: 12/12 + 1/12 or Proper Fraction notice */}
                      {problem.wholeNumber > 0 ? (
                        <div className="text-sky-700 font-sans font-extrabold text-xs mt-2 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 inline-flex items-center gap-1.5">
                          <Fraction numerator={problem.commonDen} denominator={problem.commonDen} size="xs" />
                          <span>+</span>
                          <Fraction numerator={problem.remNum} denominator={problem.commonDen} size="xs" />
                        </div>
                      ) : (
                        <div className="text-emerald-700 font-sans font-extrabold text-xs mt-2 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          {language === 'en' ? 'Proper Fraction (Top < Bottom)' : 'Egte Breuk (Bo < Onder)'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Live Step Explanation Callout with stacked fractions and no slashes */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm font-bold text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-pink-700 px-2.5 py-0.5 bg-pink-100 rounded-lg border border-pink-300">
                  {currentStep === 1
                    ? language === 'en' ? 'Step 1' : 'Stap 1'
                    : currentStep === 2
                    ? language === 'en' ? 'Step 2' : 'Stap 2'
                    : currentStep === 3
                    ? language === 'en' ? 'Step 3' : 'Stap 3'
                    : language === 'en' ? 'Step 4' : 'Stap 4'}
                </span>
                {currentStep === 1 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>
                      {language === 'en'
                        ? 'Check bottom denominators. We want to add'
                        : 'Ondersoek noemers. Ons wil'}
                    </span>
                    <Fraction numerator={problem.f1.num} denominator={problem.f1.den} size="xs" />
                    <span>+</span>
                    <Fraction numerator={problem.f2.num} denominator={problem.f2.den} size="xs" />
                    <span>
                      {language === 'en'
                        ? `. Because ${problem.f1.den} ≠ ${problem.f2.den}, denominators are different! Common denominator is ${problem.commonDen}.`
                        : `. Omdat ${problem.f1.den} ≠ ${problem.f2.den}, is noemers verskillend! Gemeenskaplike noemer is ${problem.commonDen}.`}
                    </span>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>
                      {language === 'en'
                        ? 'Equalize denominators using pink multiplier boxes:'
                        : 'Maak noemers gelyk met die pienk vermenigvuldigers:'}
                    </span>
                    <Fraction numerator={problem.newNum1} denominator={problem.commonDen} size="xs" />
                    <span>+</span>
                    <Fraction numerator={problem.newNum2} denominator={problem.commonDen} size="xs" />
                    <span>
                      {language === 'en'
                        ? '— both bottom denominators are now equal!'
                        : '— albei noemers is nou gelyk!'}
                    </span>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>
                      {language === 'en'
                        ? 'Add tops (numerators) only:'
                        : 'Tel net bo (tellers) bymekaar:'}
                    </span>
                    <span>{problem.newNum1} + {problem.newNum2} = {problem.sumNum}</span>
                    <span>➔</span>
                    <Fraction numerator={problem.sumNum} denominator={problem.commonDen} size="xs" />
                    <span>
                      {language === 'en'
                        ? `(the bottom denominator stays ${problem.commonDen})`
                        : `(die onderste noemer bly ${problem.commonDen})`}
                    </span>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>
                      {language === 'en'
                        ? 'Check if top is larger than bottom:'
                        : 'Kyk of bo groter is as onder:'}
                    </span>
                    <Fraction numerator={problem.sumNum} denominator={problem.commonDen} size="xs" />
                    {problem.wholeNumber > 0 ? (
                      <>
                        <span>=</span>
                        <Fraction numerator={problem.commonDen} denominator={problem.commonDen} size="xs" />
                        <span>+</span>
                        <Fraction numerator={problem.remNum} denominator={problem.commonDen} size="xs" />
                        <span>=</span>
                        <Fraction whole={problem.wholeNumber} numerator={problem.remNum} denominator={problem.commonDen} size="xs" />
                        <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                          <span>{language === 'en' ? `(${problem.wholeNumber} Whole Cake +` : `(${problem.wholeNumber} Hele Koek +`}</span>
                          <Fraction numerator={problem.remNum} denominator={problem.commonDen} size="xs" />
                          <span>)</span>
                        </span>
                      </>
                    ) : (
                      <span className="text-emerald-700 font-extrabold">
                        {language === 'en' ? 'Proper Fraction (Top < Bottom)' : 'Egte Breuk (Bo < Onder)'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stepper Controls Bar */}
            <div className="mt-8 pt-6 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {[1, 2, 3, 4].map((stepNum) => (
                  <button
                    key={stepNum}
                    id={`step-indicator-${stepNum}`}
                    onClick={() => {
                      playSliceClick();
                      setCurrentStep(stepNum);
                    }}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      currentStep >= stepNum
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {stepNum}
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-900 ml-2">
                  {currentStep === 1
                    ? language === 'en'
                      ? 'Step 1: Inspect Denominators'
                      : 'Stap 1: Ondersoek Noemers'
                    : currentStep === 2
                    ? language === 'en'
                      ? 'Step 2: Apply Multipliers'
                      : 'Stap 2: Pas Vermenigvuldigers Toe'
                    : currentStep === 3
                    ? language === 'en'
                      ? 'Step 3: Add the Numerators (Tops)'
                      : 'Stap 3: Tel Tellers (Bo) By'
                    : language === 'en'
                    ? 'Step 4: Convert to Mixed Number!'
                    : 'Stap 4: Skakel om na Gemengde Getal!'}
                </span>
                <VoiceNarratorButton
                  speakerId={`addition-step-${problem.id}-${currentStep}`}
                  language={language}
                  variant="icon"
                  text={getStepVoiceText()}
                />
              </div>

              <button
                id="addition-next-step-btn"
                onClick={handleNextStep}
                className="flex items-center gap-2 bg-pink-700 hover:bg-pink-800 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                <span>
                  {currentStep < 4
                    ? language === 'en'
                      ? `Continue to Step ${currentStep + 1}`
                      : `Gaan na Stap ${currentStep + 1}`
                    : activeProblemIndex < PHOTO_ADDITION_PROBLEMS.length - 1
                    ? language === 'en'
                      ? 'Next Photo Example'
                      : 'Volgende Voorbeeld'
                    : language === 'en'
                    ? 'Finish Addition Lesson'
                    : 'Voltooi Optelles'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Bakery Lab Banner (Positioned directly below Additions step-by-step banner with generous spacing) */}
        <div id="bakery-lab-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-200/80 space-y-6 mt-10 sm:mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2 text-[#381e0f] font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
                <Calculator className="w-6 h-6 text-amber-700" />
                <h3>
                  {language === 'en' ? 'Bakery Lab: Interactive Addition' : 'Bakkery-laboratorium: Interaktiewe Optel'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1.5">
                {language === 'en'
                  ? 'Choose any two fractions and watch the system automatically find the common denominator and generate the colored multiplier boxes!'
                  : 'Kies enige twee breuke en kyk hoe die stelsel outomaties die gemeenskaplike noemer vind en die gekleurde blokkies genereer!'}
              </p>
            </div>
            <VoiceNarratorButton
              speakerId="addition-lab"
              language={language}
              size="md"
              text={
                language === 'en'
                  ? 'Bakery Lab: Interactive Fraction Addition. Choose any two fractions below and watch the system automatically find the common denominator and generate the colored multiplier boxes!'
                  : 'Bakkery-laboratorium: Interaktiewe Breukoptel. Kies enige twee breuke hieronder en kyk hoe die stelsel outomaties die gemeenskaplike noemer vind en die gekleurde blokkies genereer!'
              }
            />
          </div>

          {/* Inputs for custom fractions - Aligned horizontally side-by-side with matched heights */}
          <div className="bg-amber-50/70 p-6 sm:p-8 rounded-3xl border-2 border-amber-200/90 shadow-xs flex flex-col items-center mt-6">
            <span className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wider mb-6 text-center">
              {language === 'en'
                ? 'Choose Fractions to Add (Numerator on Top, Denominator on Bottom):'
                : 'Kies Breuke om By te Tel (Teller Bo, Noemer Onder):'}
            </span>

            {/* Side-by-side aligned fraction cards - strictly flex-row to ensure they line up perfectly */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 md:gap-8 w-full max-w-xl mx-auto">
              {/* First Fraction Card */}
              <div className="flex-1 max-w-[210px] w-full min-w-0 bg-white rounded-2xl border-2 border-amber-300 shadow-sm p-3.5 sm:p-5 flex flex-col items-center">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2.5 sm:mb-3 text-center whitespace-nowrap">
                  {language === 'en' ? 'First Fraction' : 'Eerste Breuk'}
                </span>

                {/* Top Block: Numerator */}
                <div className="w-full flex flex-col items-center justify-center bg-amber-50/80 rounded-xl p-2 sm:p-3 border border-amber-200 h-[74px] sm:h-[82px]">
                  <label htmlFor="custom-num1-input" className="text-[10px] sm:text-[11px] font-black text-amber-800 uppercase tracking-wide mb-1 text-center whitespace-nowrap">
                    {language === 'en' ? 'Top (Numerator)' : 'Bo (Teller)'}
                  </label>
                  <input
                    id="custom-num1-input"
                    type="number"
                    min="1"
                    max="12"
                    value={customNum1}
                    onChange={(e) => setCustomNum1(Math.max(1, Number(e.target.value)))}
                    className="w-14 sm:w-16 h-10 sm:h-11 bg-white rounded-lg border-2 border-amber-400 font-black text-center text-lg sm:text-xl text-amber-950 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Fraction Divider Bar */}
                <div className="w-full h-1 bg-amber-800 rounded-full my-2.5 sm:my-3" />

                {/* Bottom Block: Denominator */}
                <div className="w-full flex flex-col items-center justify-center bg-amber-50/80 rounded-xl p-2 sm:p-3 border border-amber-200 h-[74px] sm:h-[82px]">
                  <label htmlFor="custom-den1-input" className="text-[10px] sm:text-[11px] font-black text-amber-800 uppercase tracking-wide mb-1 text-center whitespace-nowrap">
                    {language === 'en' ? 'Bottom (Denominator)' : 'Onder (Noemer)'}
                  </label>
                  <input
                    id="custom-den1-input"
                    type="number"
                    min="2"
                    max="16"
                    value={customDen1}
                    onChange={(e) => setCustomDen1(Math.max(2, Number(e.target.value)))}
                    className="w-14 sm:w-16 h-10 sm:h-11 bg-white rounded-lg border-2 border-amber-400 font-black text-center text-lg sm:text-xl text-amber-950 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Plus Sign */}
              <div className="flex flex-col items-center justify-center shrink-0 px-1 sm:px-3">
                <span className="text-3xl sm:text-5xl font-black text-amber-800 leading-none select-none">+</span>
              </div>

              {/* Second Fraction Card */}
              <div className="flex-1 max-w-[210px] w-full min-w-0 bg-white rounded-2xl border-2 border-amber-300 shadow-sm p-3.5 sm:p-5 flex flex-col items-center">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2.5 sm:mb-3 text-center whitespace-nowrap">
                  {language === 'en' ? 'Second Fraction' : 'Tweede Breuk'}
                </span>

                {/* Top Block: Numerator */}
                <div className="w-full flex flex-col items-center justify-center bg-amber-50/80 rounded-xl p-2 sm:p-3 border border-amber-200 h-[74px] sm:h-[82px]">
                  <label htmlFor="custom-num2-input" className="text-[10px] sm:text-[11px] font-black text-amber-800 uppercase tracking-wide mb-1 text-center whitespace-nowrap">
                    {language === 'en' ? 'Top (Numerator)' : 'Bo (Teller)'}
                  </label>
                  <input
                    id="custom-num2-input"
                    type="number"
                    min="1"
                    max="12"
                    value={customNum2}
                    onChange={(e) => setCustomNum2(Math.max(1, Number(e.target.value)))}
                    className="w-14 sm:w-16 h-10 sm:h-11 bg-white rounded-lg border-2 border-amber-400 font-black text-center text-lg sm:text-xl text-amber-950 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Fraction Divider Bar */}
                <div className="w-full h-1 bg-amber-800 rounded-full my-2.5 sm:my-3" />

                {/* Bottom Block: Denominator */}
                <div className="w-full flex flex-col items-center justify-center bg-amber-50/80 rounded-xl p-2 sm:p-3 border border-amber-200 h-[74px] sm:h-[82px]">
                  <label htmlFor="custom-den2-input" className="text-[10px] sm:text-[11px] font-black text-amber-800 uppercase tracking-wide mb-1 text-center whitespace-nowrap">
                    {language === 'en' ? 'Bottom (Denominator)' : 'Onder (Noemer)'}
                  </label>
                  <input
                    id="custom-den2-input"
                    type="number"
                    min="2"
                    max="16"
                    value={customDen2}
                    onChange={(e) => setCustomDen2(Math.max(2, Number(e.target.value)))}
                    className="w-14 sm:w-16 h-10 sm:h-11 bg-white rounded-lg border-2 border-amber-400 font-black text-center text-lg sm:text-xl text-amber-950 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Generated Photo-style Calculation */}
          <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-300 text-center font-mono">
            <div className="text-xs font-bold text-amber-700 uppercase mb-4">
              {language === 'en' ? 'Computed Result in Step-by-Step Format:' : 'Berekende Uitslag in Stap-vir-Stap Formaat:'}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xl sm:text-2xl font-black text-amber-950">
              <div className="p-3 bg-pink-50 border-2 border-pink-400 rounded-xl flex flex-col items-center">
                <span className="text-sm sm:text-base font-black">({customNum1} × {customMult1})</span>
                <div className="w-20 sm:w-24 h-0.5 bg-pink-600 my-1" />
                <span className="text-sm sm:text-base font-black">({customDen1} × {customMult1})</span>
              </div>
              <span>+</span>
              <div className="p-3 bg-pink-50 border-2 border-pink-400 rounded-xl flex flex-col items-center">
                <span className="text-sm sm:text-base font-black">({customNum2} × {customMult2})</span>
                <div className="w-20 sm:w-24 h-0.5 bg-pink-600 my-1" />
                <span className="text-sm sm:text-base font-black">({customDen2} × {customMult2})</span>
              </div>
              <span>➔</span>
              <div className="flex items-center gap-2">
                <Fraction numerator={customNewNum1} denominator={customCommon} size="lg" />
                <span>+</span>
                <Fraction numerator={customNewNum2} denominator={customCommon} size="lg" />
              </div>
              <span>=</span>
              <div className="p-3 bg-pink-100 border-2 border-pink-600 rounded-xl text-pink-950">
                <Fraction numerator={customSumNum} denominator={customCommon} size="lg" className="text-pink-950" lineClassName="border-pink-800" />
              </div>
              {customWhole > 0 && (
                <>
                  <span>=</span>
                  <div className="font-extrabold text-pink-900 border-b-2 border-pink-600 pb-0.5">
                    <Fraction whole={customWhole} numerator={customRem} denominator={customCommon} size="lg" className="text-pink-950" lineClassName="border-pink-800" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      {/* Centered Bottom Navigation Buttons: Back & Next Chapter (matching previous chapters) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 pb-2">
        {/* Left: Back */}
        <button
          type="button"
          id="chapter-five-back-btn"
          onClick={() => {
            playSliceClick();
            if (onPrevious) onPrevious();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#381e0f] hover:bg-[#4a2814] active:scale-95 transition-all text-amber-200 hover:text-amber-100 font-bold text-xs sm:text-sm md:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-md border-2 border-amber-400/80 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300 group-hover:-translate-x-1 transition-transform shrink-0" />
          <span className="text-xs sm:text-sm md:text-base font-bold leading-normal tracking-normal">
            {language === 'en' ? 'Back' : 'Terug'}
          </span>
        </button>

        {/* Right: Next Chapter - exact same styling and sizing as previous chapters */}
        <button
          type="button"
          id="chapter-five-next-btn"
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
