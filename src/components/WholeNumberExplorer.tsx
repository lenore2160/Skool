import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Lightbulb, Check, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { playPieceDrop, playSuccessChime, playSliceClick } from '../utils/audio';
import { VoiceNarratorButton } from './VoiceNarratorButton';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { Fraction } from './Fraction';

interface WholeNumberExplorerProps {
  language: Language;
  onPrevious?: () => void;
  onNext?: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onCompleteLesson: () => void;
}

interface WholeNumberExample {
  id: number;
  givenAmount: number;
  numerator: number;
  denominator: number;
  onePart: number;
  wholeNumber: number;
}

const WHOLE_NUMBER_EXAMPLES: WholeNumberExample[] = [
  { id: 1, givenAmount: 15, numerator: 3, denominator: 4, onePart: 5, wholeNumber: 20 },
  { id: 2, givenAmount: 12, numerator: 2, denominator: 3, onePart: 6, wholeNumber: 18 },
  { id: 3, givenAmount: 8, numerator: 2, denominator: 5, onePart: 4, wholeNumber: 20 },
  { id: 4, givenAmount: 18, numerator: 3, denominator: 5, onePart: 6, wholeNumber: 30 },
  { id: 5, givenAmount: 10, numerator: 5, denominator: 6, onePart: 2, wholeNumber: 12 },
  { id: 6, givenAmount: 14, numerator: 2, denominator: 7, onePart: 7, wholeNumber: 49 },
  { id: 7, givenAmount: 21, numerator: 3, denominator: 8, onePart: 7, wholeNumber: 56 },
  { id: 8, givenAmount: 24, numerator: 4, denominator: 5, onePart: 6, wholeNumber: 30 },
  { id: 9, givenAmount: 20, numerator: 5, denominator: 8, onePart: 4, wholeNumber: 32 },
  { id: 10, givenAmount: 30, numerator: 5, denominator: 6, onePart: 6, wholeNumber: 36 },
];

export const WholeNumberExplorer: React.FC<WholeNumberExplorerProps> = ({
  language,
  onPrevious,
  onNext,
  onAwardXp,
  onUnlockBadge,
  onCompleteLesson,
}) => {
  const [activeExampleIndex, setActiveExampleIndex] = useState<number>(0);
  const [exampleStep, setExampleStep] = useState<number>(0);

  const currentExample = WHOLE_NUMBER_EXAMPLES[activeExampleIndex];

  const handleSelectExample = (idx: number) => {
    playSliceClick();
    setActiveExampleIndex(idx);
    setExampleStep(0);
  };

  const handleExampleNextStep = () => {
    playSliceClick();
    if (exampleStep < 3) {
      const nextStep = exampleStep + 1;
      setExampleStep(nextStep);
      if (nextStep === 3) {
        playSuccessChime();
        onAwardXp(15, `Solved whole number example ${activeExampleIndex + 1}!`);
        if (activeExampleIndex === WHOLE_NUMBER_EXAMPLES.length - 1) {
          onUnlockBadge('whole-number-explorer');
        }
      }
    } else {
      if (activeExampleIndex < WHOLE_NUMBER_EXAMPLES.length - 1) {
        setActiveExampleIndex((prev) => prev + 1);
        setExampleStep(0);
      } else {
        setActiveExampleIndex(0);
        setExampleStep(0);
      }
    }
  };

  const getExampleStepVoiceText = () => {
    const { givenAmount, numerator, denominator, onePart, wholeNumber } = currentExample;
    if (exampleStep === 0) {
      return language === 'en'
        ? `Question: ${givenAmount} is ${numerator} over ${denominator} of what whole number? Press Continue to Step 1 to see the calculation!`
        : `Vraag: ${givenAmount} is ${numerator} op ${denominator} van watter heelgetal? Druk Gaan na Stap 1 om die berekening te sien!`;
    }
    if (exampleStep === 1) {
      return language === 'en'
        ? `Step 1: Divide ${givenAmount} by the number on top. The top number is ${numerator}. ${givenAmount} divided by ${numerator} equals ${onePart}. This tells us 1 part is ${onePart}.`
        : `Stap 1: Deel ${givenAmount} deur die boonste getal. Die boonste getal is ${numerator}. ${givenAmount} gedeel deur ${numerator} is gelyk aan ${onePart}. Dit sê vir ons 1 deel is ${onePart}.`;
    }
    if (exampleStep === 2) {
      return language === 'en'
        ? `Step 2: Multiply the answer from Step 1 by the bottom number or denominator. In Step 1, our answer was ${onePart}. The bottom denominator is ${denominator}. Multiply them together: ${onePart} times ${denominator} equals ${wholeNumber}. So the whole number is ${wholeNumber}!`
        : `Stap 2: Vermenigvuldig die antwoord van Stap 1 met die onderste getal of noemer. In Stap 1 was ons antwoord ${onePart}. Die onderste noemer is ${denominator}. Vermenigvuldig hulle met mekaar: ${onePart} maal ${denominator} is gelyk aan ${wholeNumber}. Die hele getal is dus ${wholeNumber}!`;
    }
    return language === 'en'
      ? `Step 3: Check our answer! ${numerator} over ${denominator} of ${wholeNumber} equals ${givenAmount}. The calculation is 100% correct: ${givenAmount} is ${numerator} over ${denominator} of ${wholeNumber}!`
      : `Stap 3: Kontroleer ons antwoord! ${numerator} op ${denominator} van ${wholeNumber} is ${givenAmount}. Die berekening is 100% korrek: ${givenAmount} is ${numerator} op ${denominator} van ${wholeNumber}!`;
  };

  return (
    <div className="space-y-6">
      {/* Village Bakery 3D Cottagecore Hero Banner - Chapter 6: Find the Whole Number: Step-by-Step */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
        {/* 3D Cinematic Render Background with soft watermark effect */}
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          <img
            src={STORY_3D_ASSETS.chapter6WholeHero}
            alt="3D Bumblewood Cottage Bakery - Teacher Hazel teaching animal village children finding the whole number calculations"
            className="w-full h-full object-cover object-[50%_50%]"
            referrerPolicy="no-referrer"
          />
          {/* Soft, balanced vignette overlays - clear and pleasing to the eye */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Banner text & controls */}
          <div className="absolute inset-0 p-3.5 sm:p-5 md:p-7 flex flex-col justify-between z-10">
            {/* Top row: Chapter 6 yellow block in top-left; Read to Me in top-right corner */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center bg-amber-300 text-amber-950 border-2 border-amber-400 text-sm sm:text-base md:text-lg lg:text-xl font-black px-4.5 sm:px-5.5 py-1.5 sm:py-2.5 rounded-xl shadow-md">
                <span>{language === 'en' ? 'Chapter 6' : 'Hoofstuk 6'}</span>
              </div>

              {/* Read to Me moved to the top right corner of the banner */}
              <VoiceNarratorButton
                speakerId="whole-number-banner-intro"
                language={language}
                size="md"
                text={
                  language === 'en'
                    ? 'Chapter 6: Find the Whole Number: Step-by-Step. Teacher Hazel is busy teaching the little village animals how to calculate the whole number from a fraction! Divide the given amount by the top numerator, then multiply by the bottom denominator!'
                    : 'Hoofstuk 6: Vind die Heelgetal: Stap-vir-Stap. Juffrou Hazel is besig om die klein dorpsdiertjies te leer hoe om die heelgetal uit \'n breuk te bereken! Deel die gegewe getal deur die boonste teller, en vermenigvuldig dan met die onderste noemer!'
                }
              />
            </div>

            {/* Bottom row: Main heading only (no sentence below it) */}
            <div className="w-full max-w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
                {language === 'en'
                  ? 'Find the Whole Number: Step-by-Step'
                  : 'Vind die Heelgetal: Stap-vir-Stap'}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Example Banner: 10 Examples for Finding the Whole Number */}
      <div id="whole-number-example-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-amber-200/80 space-y-6">
        {/* Top heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 rounded-xl text-amber-800">
                <Lightbulb className="w-5 h-5 text-amber-700" />
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#381e0f] tracking-tight">
                {language === 'en' ? 'Finding the Whole Number: 10 Step-by-Step Examples' : 'Vind die Heelgetal: 10 Stap-vir-Stap Voorbeelde'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1.5">
              {language === 'en'
                ? `Calculation Rule: Divide the given number by the top (numerator), then multiply that answer by the bottom (denominator)!`
                : `Berekeningsreël: Deel die gegewe getal deur bo (teller), en vermenigvuldig daardie antwoord dan met onder (noemer)!`}
            </p>
          </div>
          <VoiceNarratorButton
            speakerId={`whole-number-example-heading-${activeExampleIndex}`}
            language={language}
            size="md"
            text={
              language === 'en'
                ? `Finding the whole number step by step. Example ${activeExampleIndex + 1} of 10: ${currentExample.givenAmount} is ${currentExample.numerator} over ${currentExample.denominator} of what whole number? Rule: Divide ${currentExample.givenAmount} by the number on top (${currentExample.numerator}), which gives ${currentExample.onePart}. Then multiply that answer (${currentExample.onePart}) by the bottom number or denominator (${currentExample.denominator}), which gives the whole number ${currentExample.wholeNumber}!`
                : `Vind die heelgetal stap vir stap. Voorbeeld ${activeExampleIndex + 1} van 10: ${currentExample.givenAmount} is ${currentExample.numerator} op ${currentExample.denominator} van watter heelgetal? Reël: Deel ${currentExample.givenAmount} deur die boonste getal (${currentExample.numerator}), wat ${currentExample.onePart} gee. Vermenigvuldig dan daardie antwoord (${currentExample.onePart}) met die onderste getal of noemer (${currentExample.denominator}), wat die heelgetal ${currentExample.wholeNumber} gee!`
            }
          />
        </div>

        {/* 10 Problem Selector Bar - fractions displayed vertically with no slashes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {WHOLE_NUMBER_EXAMPLES.map((ex, idx) => {
            const isSelected = idx === activeExampleIndex;
            return (
              <button
                key={ex.id}
                id={`select-whole-example-${idx}`}
                onClick={() => handleSelectExample(idx)}
                className={`px-3.5 py-2 rounded-2xl font-bold text-xs whitespace-nowrap border-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-md ring-2 ring-amber-400'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
                }`}
              >
                <span className="font-black">
                  {language === 'en' ? `Ex ${idx + 1}:` : `Vb ${idx + 1}:`}
                </span>
                <span className="font-extrabold">{ex.givenAmount}</span>
                <span className={isSelected ? 'text-amber-200 text-[10px]' : 'text-amber-700 text-[10px]'}>
                  {language === 'en' ? 'is' : 'is'}
                </span>
                <Fraction
                  numerator={ex.numerator}
                  denominator={ex.denominator}
                  size="xs"
                  className={isSelected ? 'text-amber-50' : 'text-amber-950'}
                  lineClassName={isSelected ? 'border-amber-300' : 'border-amber-800'}
                />
              </button>
            );
          })}
        </div>

        {/* Stepped Interactive Addition-Style Board */}
        <div className="bg-amber-50/40 rounded-3xl p-6 md:p-8 border-2 border-amber-200 relative">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-pink-800 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
              • {language === 'en' ? `Example ${activeExampleIndex + 1} of 10: Step-by-Step Calculation` : `Voorbeeld ${activeExampleIndex + 1} van 10: Stap-vir-Stap Berekening`} •
            </span>
            <div className="flex items-center justify-center gap-2.5 text-2xl sm:text-3xl font-black text-amber-950 mt-3 flex-wrap">
              <span>{currentExample.givenAmount}</span>
              <span className="text-lg sm:text-xl font-bold text-amber-800">{language === 'en' ? 'is' : 'is'}</span>
              <Fraction numerator={currentExample.numerator} denominator={currentExample.denominator} size="md" />
              <span className="text-lg sm:text-xl font-bold text-amber-800">
                {language === 'en' ? 'of what whole number?' : 'van watter heelgetal?'}
              </span>
            </div>
          </div>

          {/* Equation Display with Animated Stages */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-4 font-mono select-none">
            {/* Initial Card 1: Given Amount */}
            <div className="relative p-3.5 sm:p-5 rounded-2xl border-2 border-amber-300 bg-white shadow-sm flex flex-col items-center min-w-[140px]">
              <div className="text-[10px] font-black uppercase text-amber-800 tracking-wider mb-1">
                {language === 'en' ? 'Given Amount' : 'Gegee Deel'}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-950">{currentExample.givenAmount}</div>
              <div className="text-[10px] font-bold text-amber-700 mt-1">
                {language === 'en' ? `equals ${currentExample.numerator} parts` : `gelyk aan ${currentExample.numerator} dele`}
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black text-amber-700">=</div>

            {/* Initial Card 2: Fraction Card (Numerator on top, Denominator below) */}
            <div className="relative p-3.5 sm:p-5 rounded-2xl border-2 border-pink-500 bg-pink-50/80 shadow-sm flex flex-col items-center min-w-[130px]">
              <div className="text-[10px] font-black uppercase text-pink-800 tracking-wider mb-1">
                {language === 'en' ? 'Fraction' : 'Breuk'}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-pink-950">{currentExample.numerator}</span>
                <div className="w-12 h-1 bg-pink-600 rounded-full my-1" />
                <span className="text-2xl sm:text-3xl font-black text-pink-950">{currentExample.denominator}</span>
              </div>
              <div className="text-[10px] font-bold text-pink-700 mt-1">
                {language === 'en'
                  ? `Top = ${currentExample.numerator} · Bottom = ${currentExample.denominator}`
                  : `Bo = ${currentExample.numerator} · Onder = ${currentExample.denominator}`}
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-black text-amber-700">{language === 'en' ? 'of' : 'van'}</div>

            {/* Target Whole Number Card: [ ? ] when steps not yet finished */}
            {exampleStep < 3 && (
              <div className="relative p-3.5 sm:p-5 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/70 shadow-xs flex flex-col items-center min-w-[140px]">
                <div className="text-[10px] font-black uppercase text-amber-800 tracking-wider mb-1">
                  {language === 'en' ? 'Whole Number' : 'Heelgetal'}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-amber-700">?</div>
                <div className="text-[10px] font-bold text-amber-700 mt-1">
                  {language === 'en' ? 'Find this number!' : 'Vind hierdie getal!'}
                </div>
              </div>
            )}

            {/* Step 1 Arrow & Box: ONLY displayed when exampleStep >= 1 */}
            <AnimatePresence>
              {exampleStep >= 1 && (
                <>
                  <div className="text-2xl sm:text-3xl font-black text-amber-700">➔</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 sm:p-5 rounded-2xl border-2 border-amber-400 bg-amber-100/90 shadow-sm flex flex-col items-center min-w-[150px]"
                  >
                    <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider mb-1">
                      {language === 'en' ? 'Step 1: Divide by Top' : 'Stap 1: Deel Deur Bo'}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-950">
                      {currentExample.givenAmount} ÷ {currentExample.numerator} ={' '}
                      <span className="text-pink-700 text-2xl sm:text-3xl">{currentExample.onePart}</span>
                    </div>
                    <div className="text-[10px] font-extrabold text-pink-800 mt-1 bg-pink-100/90 px-2 py-0.5 rounded-md border border-pink-300">
                      {language === 'en'
                        ? `1 part (1/${currentExample.denominator}) = ${currentExample.onePart}`
                        : `1 deel (1/${currentExample.denominator}) = ${currentExample.onePart}`}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Step 2 Arrow & Box: ONLY displayed when exampleStep >= 2 */}
            <AnimatePresence>
              {exampleStep >= 2 && (
                <>
                  <div className="text-2xl sm:text-3xl font-black text-amber-700">➔</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 sm:p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/90 shadow-sm flex flex-col items-center min-w-[170px]"
                  >
                    <div className="text-[10px] font-black uppercase text-emerald-900 tracking-wider mb-1 text-center">
                      {language === 'en'
                        ? "Step 2: Multiply Step 1's Answer by Bottom"
                        : "Stap 2: Vermenigvuldig Stap 1 se Antwoord met Onder"}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-950">
                      <span className="text-pink-700 font-extrabold">{currentExample.onePart}</span> × {currentExample.denominator} ={' '}
                      <span className="text-emerald-700 text-2xl sm:text-3xl">{currentExample.wholeNumber}</span>
                    </div>
                    <div className="text-[10px] font-extrabold text-emerald-800 mt-1 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 text-center">
                      {language === 'en'
                        ? `(Step 1 Answer: ${currentExample.onePart}) × (Bottom Denominator: ${currentExample.denominator}) = ${currentExample.wholeNumber}`
                        : `(Stap 1 Antwoord: ${currentExample.onePart}) × (Onder Noemer: ${currentExample.denominator}) = ${currentExample.wholeNumber}`}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Step 3 Box: Final Check & Result: ONLY displayed when exampleStep >= 3 */}
            <AnimatePresence>
              {exampleStep >= 3 && (
                <>
                  <div className="text-2xl sm:text-3xl font-black text-amber-700">=</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 sm:p-5 rounded-2xl border-3 border-amber-500 bg-gradient-to-b from-amber-100 to-amber-200/90 shadow-md flex flex-col items-center min-w-[150px]"
                  >
                    <div className="text-[10px] font-black uppercase text-amber-950 tracking-wider mb-1">
                      {language === 'en' ? 'Whole Number' : 'Heelgetal'}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-[#2e170a]">{currentExample.wholeNumber}</div>
                    <div className="text-[10px] font-black text-emerald-800 mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{language === 'en' ? `Answer: ${currentExample.wholeNumber}` : `Antwoord: ${currentExample.wholeNumber}`}</span>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Live Step Explanation Callout with stacked fractions and no slashes */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm font-bold text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-pink-700 px-2.5 py-0.5 bg-pink-100 rounded-lg border border-pink-300">
                {exampleStep === 0
                  ? language === 'en' ? 'Question' : 'Vraag'
                  : exampleStep === 1
                  ? language === 'en' ? 'Step 1' : 'Stap 1'
                  : exampleStep === 2
                  ? language === 'en' ? 'Step 2' : 'Stap 2'
                  : language === 'en' ? 'Step 3' : 'Stap 3'}
              </span>
              {exampleStep === 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>
                    {language === 'en'
                      ? `We are asked: ${currentExample.givenAmount} is `
                      : `Ons vra: ${currentExample.givenAmount} is `}
                  </span>
                  <Fraction numerator={currentExample.numerator} denominator={currentExample.denominator} size="xs" />
                  <span>
                    {language === 'en'
                      ? 'of what whole number? Press "Continue to Step 1" below to see how to calculate it!'
                      : 'van watter heelgetal? Druk "Gaan na Stap 1" hieronder om te sien hoe om dit te bereken!'}
                  </span>
                </div>
              )}
              {exampleStep === 1 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>
                    {language === 'en'
                      ? `Divide ${currentExample.givenAmount} by the number on top (numerator = ${currentExample.numerator}):`
                      : `Deel ${currentExample.givenAmount} deur die boonste getal (teller = ${currentExample.numerator}):`}
                  </span>
                  <span className="font-black text-pink-800">
                    {currentExample.givenAmount} ÷ {currentExample.numerator} = {currentExample.onePart}
                  </span>
                  <span>
                    {language === 'en'
                      ? `— this gives the value of 1 equal slice (1/${currentExample.denominator} = ${currentExample.onePart})!`
                      : `— dit gee die waarde van 1 gelyke stukkie (1/${currentExample.denominator} = ${currentExample.onePart})!`}
                  </span>
                </div>
              )}
              {exampleStep === 2 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>
                    {language === 'en'
                      ? `Multiply the answer from Step 1 (${currentExample.onePart}) with the bottom number or denominator (${currentExample.denominator}):`
                      : `Vermenigvuldig die antwoord van Stap 1 (${currentExample.onePart}) met die onderste getal of noemer (${currentExample.denominator}):`}
                  </span>
                  <span className="font-black text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300">
                    {currentExample.onePart} × {currentExample.denominator} = {currentExample.wholeNumber}
                  </span>
                  <span>
                    {language === 'en'
                      ? `— since all ${currentExample.denominator} parts make the complete cake, multiplying Step 1's answer (${currentExample.onePart}) by the denominator (${currentExample.denominator}) gives the whole number ${currentExample.wholeNumber}!`
                      : `— aangesien al ${currentExample.denominator} dele die hele koek vorm, gee die vermenigvuldiging van Stap 1 se antwoord (${currentExample.onePart}) met die noemer (${currentExample.denominator}) die heelgetal ${currentExample.wholeNumber}!`}
                  </span>
                </div>
              )}
              {exampleStep === 3 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>
                    {language === 'en'
                      ? 'Check our answer:'
                      : 'Kontroleer ons antwoord:'}
                  </span>
                  <span className="font-black text-amber-950">
                    <Fraction numerator={currentExample.numerator} denominator={currentExample.denominator} size="xs" />{' '}
                    {language === 'en'
                      ? `of ${currentExample.wholeNumber} = (${currentExample.wholeNumber} ÷ ${currentExample.denominator}) × ${currentExample.numerator} = ${currentExample.givenAmount}`
                      : `van ${currentExample.wholeNumber} = (${currentExample.wholeNumber} ÷ ${currentExample.denominator}) × ${currentExample.numerator} = ${currentExample.givenAmount}`}
                  </span>
                  <span className="text-emerald-700 font-black">
                    {language === 'en'
                      ? `✓ 100% Correct! ${currentExample.givenAmount} is ${currentExample.numerator}/${currentExample.denominator} of ${currentExample.wholeNumber}.`
                      : `✓ 100% Korrek! ${currentExample.givenAmount} is ${currentExample.numerator}/${currentExample.denominator} van ${currentExample.wholeNumber}.`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Controls Bar (matching AdditionWizard) */}
          <div className="mt-8 pt-6 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3].map((stepNum) => (
                <button
                  key={stepNum}
                  id={`example-step-${stepNum}`}
                  onClick={() => {
                    playSliceClick();
                    setExampleStep(stepNum);
                  }}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    exampleStep >= stepNum
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {stepNum}
                </button>
              ))}
              <span className="text-xs font-bold text-amber-900 ml-2">
                {exampleStep === 0
                  ? language === 'en'
                    ? `Question: ${currentExample.givenAmount} is ${currentExample.numerator}/${currentExample.denominator} of what whole number?`
                    : `Vraag: ${currentExample.givenAmount} is ${currentExample.numerator}/${currentExample.denominator} van watter heelgetal?`
                  : exampleStep === 1
                  ? language === 'en'
                    ? `Step 1: Divide by Top Number (${currentExample.givenAmount} ÷ ${currentExample.numerator} = ${currentExample.onePart})`
                    : `Stap 1: Deel Deur Boonste Getal (${currentExample.givenAmount} ÷ ${currentExample.numerator} = ${currentExample.onePart})`
                  : exampleStep === 2
                  ? language === 'en'
                    ? `Step 2: Multiply Step 1's Answer by Bottom/Denominator (${currentExample.onePart} × ${currentExample.denominator} = ${currentExample.wholeNumber})`
                    : `Stap 2: Vermenigvuldig Stap 1 se Antwoord met Onder/Noemer (${currentExample.onePart} × ${currentExample.denominator} = ${currentExample.wholeNumber})`
                  : language === 'en'
                  ? `Step 3: Verified Whole Number (${currentExample.wholeNumber})`
                  : `Stap 3: Bevestigde Heelgetal (${currentExample.wholeNumber})`}
              </span>
              <VoiceNarratorButton
                speakerId={`whole-number-step-${activeExampleIndex}-${exampleStep}`}
                language={language}
                variant="icon"
                text={getExampleStepVoiceText()}
              />
            </div>

            <button
              id="example-next-step-btn"
              onClick={handleExampleNextStep}
              className="flex items-center gap-2 bg-pink-700 hover:bg-pink-800 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>
                {exampleStep === 0
                  ? language === 'en'
                    ? 'Continue to Step 1'
                    : 'Gaan na Stap 1'
                  : exampleStep === 1
                  ? language === 'en'
                    ? 'Continue to Step 2'
                    : 'Gaan na Stap 2'
                  : exampleStep === 2
                  ? language === 'en'
                    ? 'See Final Answer (Step 3)'
                    : 'Sien Finale Antwoord (Stap 3)'
                  : activeExampleIndex < WHOLE_NUMBER_EXAMPLES.length - 1
                  ? language === 'en'
                    ? `Next Example (${activeExampleIndex + 2}/10)`
                    : `Volgende Voorbeeld (${activeExampleIndex + 2}/10)`
                  : language === 'en'
                  ? 'Restart from Example 1'
                  : 'Herbegin vanaf Voorbeeld 1'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Centered Bottom Navigation Buttons: Previous & Next Chapter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 pb-2">
        {/* Left: Previous */}
        <button
          type="button"
          id="chapter-six-prev-btn"
          onClick={() => {
            playPieceDrop();
            if (onPrevious) onPrevious();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#381e0f] hover:bg-[#4a2814] active:scale-95 transition-all text-amber-200 hover:text-amber-100 font-bold text-xs sm:text-sm md:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-md border-2 border-amber-400/80 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300 group-hover:-translate-x-1 transition-transform shrink-0" />
          <span className="text-xs sm:text-sm md:text-base font-bold leading-normal tracking-normal">
            {language === 'en' ? 'Previous' : 'Vorige'}
          </span>
        </button>

        {/* Right: Next Chapter */}
        <button
          type="button"
          id="chapter-six-next-btn"
          onClick={() => {
            playSuccessChime();
            onCompleteLesson();
            if (onNext) onNext();
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
