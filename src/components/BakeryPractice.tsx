import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertCircle, Sparkles, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { playPieceDrop, playSuccessChime, playLevelUpFanfare } from '../utils/audio';
import { VoiceNarratorButton } from './VoiceNarratorButton';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { FormattedFractionText } from './Fraction';
import { FIFTY_PRACTICE_ORDERS, PracticeOrder } from '../data/quizQuestions';

interface BakeryPracticeProps {
  language: Language;
  onPrevious?: () => void;
  onTheEnd?: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onCompleteLesson: () => void;
}

const ORDERS: PracticeOrder[] = FIFTY_PRACTICE_ORDERS;

export const BakeryPractice: React.FC<BakeryPracticeProps> = ({
  language,
  onPrevious,
  onTheEnd,
  onAwardXp,
  onUnlockBadge,
  onCompleteLesson,
}) => {
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentOrder = ORDERS[orderIndex];

  const handleSelectOption = (optId: string) => {
    if (hasAnswered) return;
    playPieceDrop();
    setSelectedOption(optId);
    setHasAnswered(true);

    const isCorrect = optId === currentOrder.correctId;
    if (isCorrect) {
      playSuccessChime();
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      onAwardXp(25, `Filled order for ${currentOrder.customerName}!`);
    } else {
      setStreak(0);
    }
  };

  const handleNextOrder = () => {
    playPieceDrop();
    setHasAnswered(false);
    setSelectedOption(null);

    if (orderIndex < ORDERS.length - 1) {
      setOrderIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      playLevelUpFanfare();

      const finalScore = score + (selectedOption === currentOrder.correctId ? 0 : 0);
      const isPerfect = finalScore === ORDERS.length;

      if (isPerfect) {
        // Multi-stage fireworks and starburst celebration for a perfect 50/50 score!
        const duration = 3.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ['#ffd700', '#ff6b6b', '#48dbfb', '#1dd1a1', '#f368e0'],
          });
        }, 250);
      } else {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#f59e0b', '#10b981', '#3b82f6'],
        });
      }

      onUnlockBadge('master-baker');
      onCompleteLesson();
      onAwardXp(150, 'Completed all 50 Customer Orders in the Final Quiz!');
    }
  };

  const handleRestart = () => {
    playPieceDrop();
    setOrderIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Village Bakery 3D Cottagecore Hero Banner - Chapter 7: Serve the Bakery Customers */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
        {/* 3D Cinematic Render Background with soft watermark effect */}
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          <img
            src={STORY_3D_ASSETS.chapter7RushHero}
            alt="3D Bumblewood Cottage Bakery - Busy cottage bakery with Chef Barnaby Bear and helper Pip the Penguin serving animal customers"
            className="w-full h-full object-cover object-[50%_50%]"
            referrerPolicy="no-referrer"
          />
          {/* Soft, balanced vignette overlays - clear and pleasing to the eye */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Banner text & controls */}
          <div className="absolute inset-0 p-3.5 sm:p-5 md:p-7 flex flex-col justify-between z-10">
            {/* Top row: Chapter 7 yellow block in top-left; Read to Me in top-right corner */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center bg-amber-300 text-amber-950 border-2 border-amber-400 text-sm sm:text-base md:text-lg lg:text-xl font-black px-4.5 sm:px-5.5 py-1.5 sm:py-2.5 rounded-xl shadow-md">
                <span>{language === 'en' ? 'Chapter 7' : 'Hoofstuk 7'}</span>
              </div>

              {/* Read to Me in top-right corner */}
              <VoiceNarratorButton
                speakerId="practice-banner-intro-ch7"
                language={language}
                size="md"
                text={
                  language === 'en'
                    ? 'Chapter 7: Serve the Bakery Customers. Chef Barnaby Bear and his little helper Pip the Penguin are ready for the customer rush!'
                    : 'Hoofstuk 7: Bedien die Bakkerykliënte. Sjef Barnaby Beer en sy helpers Pip die Pikkewyn is gereed vir die bakkerykliënte!'
                }
              />
            </div>

            {/* Bottom row: Main heading only (no sentence below it) */}
            <div className="w-full max-w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
                {language === 'en'
                  ? 'Serve the Bakery Customers...'
                  : 'Bedien die Bakkerykliënte...'}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {!isFinished ? (
        /* Order Challenge Card */
        <div className="cottage-parchment-card rounded-3xl p-6 md:p-8 shadow-md border-2 border-[#dfceb9] space-y-6">
          {/* Customer Orders... The Final Quiz Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfceb9] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-200/70 rounded-xl text-amber-900">
                  <Sparkles className="w-5 h-5 text-amber-800" />
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#381e0f] tracking-tight">
                  {language === 'en'
                    ? 'Customer Orders... The Final Quiz'
                    : 'Kliëntebestellings... Die Finale Toets'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1.5 max-w-2xl">
                {language === 'en'
                  ? "Put all your fraction skills to work! Read each customer's order, choose the right fraction answer, and earn the Grand Pastry Master badge!"
                  : "Gebruik al jou breukekennis! Lees elke kliënt se bestelling, kies die regte antwoord, en wen die Meestergebaksjef-kenteken!"}
              </p>
            </div>

            {/* Score & Streak Chips */}
            <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
              <div className="bg-[#1f1007] border-2 border-amber-900/60 rounded-2xl px-3.5 py-2 text-center shadow-xs">
                <div className="text-[10px] uppercase font-black text-amber-400">
                  {language === 'en' ? 'Orders Filled' : 'Bestellings'}
                </div>
                <div className="text-base font-black text-amber-100">
                  {score} / {ORDERS.length}
                </div>
              </div>

              <div className="bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border-2 border-amber-600 rounded-2xl px-3.5 py-2 text-center shadow-sm">
                <div className="text-[10px] uppercase font-black text-amber-900">
                  {language === 'en' ? 'Streak' : 'Reeks'}
                </div>
                <div className="text-base font-black flex items-center justify-center gap-0.5">
                  <span>🔥</span> {streak}
                </div>
              </div>
            </div>
          </div>
          {/* Customer Avatar and Dialogue Box */}
          <div className="bg-[#fcf7ed] border-2 border-[#ddcca8] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center gap-5 shadow-xs">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-3 border-amber-400/80 shadow-md ring-2 ring-amber-900/30 shrink-0 bg-[#341d10]">
              <img
                src={currentOrder.customerImage3d || STORY_3D_ASSETS.birthdayCelebration3d}
                alt={currentOrder.customerName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 text-xl bg-amber-950/80 rounded-full px-1 py-0.5 border border-amber-400/50 shadow">
                {currentOrder.customerEmoji}
              </span>
            </div>

            <div className="space-y-1.5 text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-black text-sm text-[#3e2311]">
                  {currentOrder.customerName}
                </span>
                <span className="text-[11px] bg-[#ead9c4] text-[#4d2c14] font-extrabold px-2.5 py-0.5 rounded-full border border-[#d6bfab]">
                  {language === 'en' ? 'Customer' : 'Kliënt'} #{currentOrder.id}
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-[#2e170a] italic leading-snug">
                "{language === 'en' ? currentOrder.orderTextEn : currentOrder.orderTextAf}"
              </p>
            </div>

            {/* Big Fraction Sign - Rustic Chalkboard or Brass */}
            <div className="bg-gradient-to-b from-[#3c2111] to-[#251308] text-amber-100 font-mono font-black text-2xl sm:text-3xl px-6 py-4 rounded-2xl shadow-md border-2 border-amber-600/70 shrink-0 ring-1 ring-amber-400/30 flex items-center justify-center">
              <FormattedFractionText text={currentOrder.fractionDisplay} size="xl" fractionClassName="text-amber-100" />
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#633a1c] flex items-center gap-1.5">
                <span>🧁</span>
                <span>{language === 'en' ? 'Your Bakery Decision:' : 'Jou Bakkerybesluit:'}</span>
              </span>
              <VoiceNarratorButton
                speakerId={`practice-order-${currentOrder.id}`}
                language={language}
                variant="icon"
                text={
                  language === 'en'
                    ? `${currentOrder.customerName} says: "${currentOrder.orderTextEn}". The fraction is ${currentOrder.fractionDisplay}. ${currentOrder.questionEn}`
                    : `${currentOrder.customerName} sê: "${currentOrder.orderTextAf}". Die breuk is ${currentOrder.fractionDisplay}. ${currentOrder.questionAf}`
                }
              />
            </div>
            <div className="text-base md:text-lg font-extrabold text-[#381e0f]">
              <FormattedFractionText text={language === 'en' ? currentOrder.questionEn : currentOrder.questionAf} size="base" />
            </div>
          </div>

          {/* Answer Option Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentOrder.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === currentOrder.correctId;

              let btnClasses =
                'bg-[#fffefc] hover:bg-[#faf1e4] text-[#3d2412] border-[#dfcfbd] hover:border-amber-400 shadow-xs';

              if (hasAnswered) {
                if (isCorrect) {
                  btnClasses =
                    'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300 shadow-md';
                } else if (isSelected && !isCorrect) {
                  btnClasses = 'bg-rose-600 text-white border-rose-700';
                } else {
                  btnClasses = 'bg-[#f4ebe1] text-[#9b8572] border-[#ded0bf] opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  id={`practice-opt-${opt.id}`}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-2xl font-black text-xs md:text-sm text-left border-2 transition-all cursor-pointer ${btnClasses}`}
                >
                  <FormattedFractionText text={language === 'en' ? opt.textEn : opt.textAf} size="sm" />
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#f8f0e5] border-2 border-[#ded0be] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <div className="flex items-center gap-1.5 font-black text-amber-950 text-sm">
                    {selectedOption === currentOrder.correctId ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-800">
                          {language === 'en' ? 'Delicious! Correct!' : 'Heerlik! Korrek!'}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-800">
                          {language === 'en' ? 'Good effort!' : 'Goeie poging!'}
                        </span>
                      </>
                    )}
                  </div>
                  <VoiceNarratorButton
                    speakerId={`practice-feedback-${currentOrder.id}`}
                    language={language}
                    variant="icon"
                    text={
                      selectedOption === currentOrder.correctId
                        ? `${language === 'en' ? 'Delicious! Correct!' : 'Heerlik! Korrek!'} ${language === 'en' ? currentOrder.explanationEn : currentOrder.explanationAf}`
                        : `${language === 'en' ? 'Good effort!' : 'Goeie poging!'} ${language === 'en' ? currentOrder.explanationEn : currentOrder.explanationAf}`
                    }
                  />
                </div>
                <div className="text-xs md:text-sm text-[#663e21] font-semibold">
                  <FormattedFractionText
                    text={
                      language === 'en'
                        ? currentOrder.explanationEn
                        : currentOrder.explanationAf
                    }
                    size="sm"
                  />
                </div>
              </div>

              <button
                id="next-order-btn"
                onClick={handleNextOrder}
                className="shrink-0 flex items-center gap-2 bg-gradient-to-b from-[#532e18] to-[#361c0d] hover:from-[#432311] hover:to-[#2b1509] text-amber-100 font-black text-xs px-5 py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border border-amber-600/40"
              >
                <span>
                  {orderIndex < ORDERS.length - 1
                    ? language === 'en'
                      ? 'Next Customer Order'
                      : 'Volgende Kliënt'
                    : language === 'en'
                    ? 'See Final Bakery Score'
                    : 'Sien Finale Telling'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* Final Completion Trophy Card */
        <div className="cottage-parchment-card rounded-3xl p-8 shadow-md border-2 border-amber-400 text-center space-y-6">
          <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden border-3 border-amber-400 shadow-lg ring-2 ring-amber-900/40 bg-[#341d10]">
            <img
              src={STORY_3D_ASSETS.birthdayCelebration3d}
              alt="Grand Pastry Master"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black text-[#381e0f]">
              {score === ORDERS.length
                ? language === 'en'
                  ? '🌟 Perfect Score: 50/50! Grand Pastry Master!'
                  : '🌟 Perfekte Telling: 50/50! Meestergebaksjef!'
                : language === 'en'
                ? 'Congratulations, Grand Pastry Master!'
                : 'Baie geluk, Meestergebaksjef!'}
            </h3>
            <p className="text-sm md:text-base text-[#6b4224] max-w-lg mx-auto font-medium">
              {score === ORDERS.length
                ? language === 'en'
                  ? `Flawless baking! You answered all 50 customer orders perfectly (${score} / ${ORDERS.length}) across every single fraction concept in Bumblewood Bakery!`
                  : `Vlekkelose bakkery! Jy het al 50 kliënte se bestellings foutloos beantwoord (${score} / ${ORDERS.length}) oor elke breukbegrip in Bumblewood Bakkery!`
                : language === 'en'
                ? `You served the bakery customers with a fantastic score of ${score} / ${ORDERS.length}! You understand numerators, denominators, equivalent fractions, mixed numbers, and finding the whole number!`
                : `Jy het die kliënte bedien met 'n puik telling van ${score} / ${ORDERS.length}! Jy verstaan tellers, noemers, gelykwaardige breuke, gemengde getalle, en vind van die heelgetal!`}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              id="restart-orders-btn"
              onClick={handleRestart}
              className="flex items-center gap-2 bg-gradient-to-b from-[#532e18] to-[#361c0d] hover:from-[#432311] hover:to-[#2b1509] text-amber-100 px-6 py-3.5 rounded-2xl font-black text-xs cursor-pointer shadow-md border border-amber-600/40"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'en' ? 'Play Again' : 'Speel Weer'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Centered Bottom Navigation Buttons: Previous & The End */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 pb-2">
        {/* Left: Previous */}
        <button
          type="button"
          id="chapter-seven-prev-btn"
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

        {/* Right: The End */}
        <button
          type="button"
          id="chapter-seven-end-btn"
          onClick={() => {
            playLevelUpFanfare();
            confetti({
              particleCount: 150,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'],
            });
            if (onTheEnd) {
              onTheEnd();
            } else {
              onCompleteLesson();
            }
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 transition-all text-[#2a1406] font-bold text-xs sm:text-sm md:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-md border-2 border-amber-300 cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-[#2a1406] group-hover:rotate-12 transition-transform shrink-0" />
          <span className="text-xs sm:text-sm md:text-base font-bold leading-normal tracking-normal">
            {language === 'en' ? 'The End' : 'Die Einde'}
          </span>
        </button>
      </div>
    </div>
  );
};
