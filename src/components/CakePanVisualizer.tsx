import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, RefreshCw, CheckCircle, Info, ChevronRight, Utensils, ZoomIn, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Language, CakeDivision } from '../types';
import { playSliceClick, playOvenBakeDing, playSuccessChime, playPieceDrop } from '../utils/audio';
import { VoiceNarratorButton } from './VoiceNarratorButton';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { Fraction } from './Fraction';

interface CakePanVisualizerProps {
  language: Language;
  onCompleteLesson: () => void;
  onAwardXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const DIVISIONS: CakeDivision[] = [
  { denominator: 2, rows: 1, cols: 2, labelEn: '2 Halves (1/2)', labelAf: '2 Helftes (1/2)' },
  { denominator: 4, rows: 2, cols: 2, labelEn: '4 Quarters (1/4)', labelAf: '4 Kwarte (1/4)' },
  { denominator: 6, rows: 2, cols: 3, labelEn: '6 Sixths (1/6)', labelAf: '6 Sesdes (1/6)' },
  { denominator: 12, rows: 2, cols: 6, labelEn: '12 Twelfths (1/12)', labelAf: '12 Twaalfdes (1/12)' },
  { denominator: 30, rows: 5, cols: 6, labelEn: '30 Thirtieths (1/30)', labelAf: '30 Dertigstes (1/30)' },
  { denominator: 60, rows: 6, cols: 10, labelEn: '60 Sixtieths (1/60)', labelAf: '60 Sestigstes (1/60)' },
];

export const CakePanVisualizer: React.FC<CakePanVisualizerProps> = ({
  language,
  onCompleteLesson,
  onAwardXp,
  onUnlockBadge,
  onPrevious,
  onNext,
}) => {
  const [selectedDivisionIndex, setSelectedDivisionIndex] = useState<number>(3); // Default 12 slices
  const [selectedSlices, setSelectedSlices] = useState<Set<number>>(new Set([0, 1, 2, 3])); // 4/12 selected initially
  const [isPanEmpty, setIsPanEmpty] = useState<boolean>(false);
  const [isBaking, setIsBaking] = useState<boolean>(false);
  const [ovenTimer, setOvenTimer] = useState<number>(0);
  const [hasBakedOnce, setHasBakedOnce] = useState<boolean>(false);
  const [exploredDivisions, setExploredDivisions] = useState<Set<number>>(new Set([12]));
  const [isCakeEnlarged, setIsCakeEnlarged] = useState<boolean>(false);

  const currentDiv = DIVISIONS[selectedDivisionIndex];
  const numerator = selectedSlices.size;
  const denominator = currentDiv.denominator;

  const handleSelectDivision = (idx: number) => {
    setSelectedDivisionIndex(idx);
    setIsPanEmpty(false);
    const div = DIVISIONS[idx];
    // Keep proportional or reset slices
    setSelectedSlices(new Set([0]));
    playSliceClick();

    const newExplored = new Set(exploredDivisions);
    newExplored.add(div.denominator);
    setExploredDivisions(newExplored);

    if (newExplored.size >= 4) {
      onUnlockBadge('equal-slices');
      onAwardXp(25, 'Explored 4 different cake cut grids!');
    }
  };

  const handleToggleSlice = (sliceIndex: number) => {
    playSliceClick();
    if (isPanEmpty) {
      setIsPanEmpty(false);
      setSelectedSlices(new Set([sliceIndex]));
      return;
    }
    const newSelected = new Set(selectedSlices);
    if (newSelected.has(sliceIndex)) {
      newSelected.delete(sliceIndex);
    } else {
      newSelected.add(sliceIndex);
    }
    setSelectedSlices(newSelected);

    if (newSelected.size === denominator) {
      onUnlockBadge('one-whole');
      playSuccessChime();
    }
  };

  const handleBakeInOven = () => {
    setIsBaking(true);
    setIsPanEmpty(false);
    setOvenTimer(3);
    playSliceClick();

    const interval = setInterval(() => {
      setOvenTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsBaking(false);
          setHasBakedOnce(true);
          playOvenBakeDing();
          onUnlockBadge('first-bake');
          onAwardXp(30, 'Baked a fresh chocolate cake!');
          return 0;
        }
        return prev - 1;
      });
    }, 800);
  };

  const handleSelectAll = () => {
    playSliceClick();
    setIsPanEmpty(false);
    const all = new Set<number>();
    for (let i = 0; i < denominator; i++) {
      all.add(i);
    }
    setSelectedSlices(all);
    onUnlockBadge('one-whole');
    playSuccessChime();
  };

  const handleUnselect = () => {
    playSliceClick();
    setIsPanEmpty(false);
    setSelectedSlices(new Set());
  };

  const handleClear = () => {
    playSliceClick();
    setIsPanEmpty(true);
    setSelectedSlices(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Village Bakery 3D Cottagecore Hero Banner - Chapter 2: The Oven Cake Pan */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
        {/* 3D Cinematic Render Background with soft watermark effect */}
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          <img
            src={STORY_3D_ASSETS.chapter2PanHero}
            alt="3D Bumblewood Cottage Bakery - Barnaby Bear Baking Oven Pan Cake with Mice"
            className="w-full h-full object-cover object-[50%_50%]"
            referrerPolicy="no-referrer"
          />
          {/* Soft, balanced vignette overlays - clear and pleasing to the eye */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Banner text: Chapter 2 yellow block on top-left, large title and description on bottom-left */}
          <div className="absolute inset-0 p-3.5 sm:p-5 md:p-7 flex flex-col justify-between z-10">
            {/* Top row: Chapter 2 yellow block with slightly bigger font size */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center bg-amber-300 text-amber-950 border-2 border-amber-400 text-sm sm:text-base md:text-lg lg:text-xl font-black px-4.5 sm:px-5.5 py-1.5 sm:py-2.5 rounded-xl shadow-md">
                <span>{language === 'en' ? 'Chapter 2' : 'Hoofstuk 2'}</span>
              </div>
            </div>

            {/* Bottom row: Main heading scaled to match Cover Page image size, plus balanced description */}
            <div className="w-full max-w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
                {language === 'en'
                  ? 'Chocolate Cake in the Oven Pan'
                  : 'Sjokoladekoek in die Oondpan'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-200 font-bold drop-shadow mt-1.5 sm:mt-2 md:whitespace-nowrap">
                {language === 'en'
                  ? 'Discover how the selection of slices changes the numerator'
                  : 'Ontdek hoe die keuse van stukkies die teller verander'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Cake Pan Intro Card - Lighter Cottage Bakery Tone */}
      <div className="bg-[#fbf6ee] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-xl border-3 sm:border-4 border-amber-300 ring-4 ring-amber-900/10">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Top-Left Thumbnail: Chocolate Cake in Rectangular Oven Pan (Click anywhere within frame to enlarge) */}
          <button
            type="button"
            id="oven-pan-cake-thumbnail"
            onClick={() => {
              playPieceDrop();
              setIsCakeEnlarged(true);
            }}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 sm:border-3 border-amber-400 shadow-md ring-2 ring-amber-950/20 shrink-0 cursor-zoom-in group hover:scale-105 transition-transform bg-amber-950/10"
            title={
              language === 'en'
                ? 'Click anywhere within the frame to enlarge'
                : 'Klik enige plek binne die raam om te vergroot'
            }
            aria-label="Enlarge chocolate oven pan cake photo"
          >
            <img
              src={STORY_3D_ASSETS.chocolatePanCakeThumb}
              alt="Chocolate cake in rectangular oven pan"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <ZoomIn className="w-5 h-5 text-amber-200 drop-shadow" />
            </div>
          </button>

          {/* Headline and sentence aligned in line with the top-left thumbnail */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-amber-950 tracking-tight leading-snug">
              {language === 'en'
                ? 'Chocolate Cake in the Oven Pan'
                : 'Sjokoladekoek in die Oondpan'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-900/85 font-medium mt-1 leading-relaxed max-w-3xl">
              {language === 'en'
                ? 'Cut rectangular cakes into equal pieces to discover Top (Numerator) and Bottom (Denominator)!'
                : 'Sny reghoekige koeke in gelyke stukkies om Bo (Teller) en Onder (Noemer) te ontdek!'}
            </p>
            <div className="pt-2">
              <VoiceNarratorButton
                speakerId="lesson-1-intro"
                language={language}
                text={
                  language === 'en'
                    ? 'Chapter 2: The Oven Cake Pan. Imagine baking a delicious rectangular chocolate cake in an oven pan. We cut it into equal pieces to discover how Top, the Numerator, and Bottom, the Denominator, work together!'
                    : 'Hoofstuk 2: Die Oondkoekpan. Stel jou voor jy bak \'n heerlike reghoekige sjokoladekoek in \'n oondpan. Ons sny dit in gelyke stukkies om te ontdek hoe Bo, die Teller, en Onder, die Noemer, saamwerk!'
                }
              />
            </div>
          </div>
        </div>

        {/* Division Selector Tabs (halves, quarters, sixths, twelfths, thirtieths, sixtieths) */}
        <div className="mt-4 pt-3.5 border-t border-amber-200">
          <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-2">
            {language === 'en'
              ? 'Choose How Many Equal Slices to Cut the Cake Into:'
              : 'Kies Hoeveel Gelyke Stukkies om die Koek in te sny:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DIVISIONS.map((div, idx) => {
              const isSelected = idx === selectedDivisionIndex;
              return (
                <button
                  key={div.denominator}
                  id={`cake-division-${div.denominator}`}
                  onClick={() => handleSelectDivision(idx)}
                  className={`px-3 py-2.5 rounded-2xl font-bold text-xs md:text-sm text-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-900 text-amber-50 border-amber-950 shadow-md scale-102'
                      : 'bg-white hover:bg-amber-100 text-amber-950 border-amber-200 shadow-xs'
                  }`}
                >
                  <div className="text-base font-black">{div.denominator} {language === 'en' ? 'Slices' : 'Stukke'}</div>
                  <div className={`text-[11px] font-semibold flex items-center justify-center gap-1.5 mt-0.5 ${isSelected ? 'text-amber-200' : 'text-amber-800'}`}>
                    <span>{language === 'en' ? div.labelEn.split('(')[0].trim() : div.labelAf.split('(')[0].trim()}</span>
                    <Fraction numerator={1} denominator={div.denominator} size="xs" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Pan Visualizer & Live Fraction Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Rectangular Oven Pan */}
        <div className="lg:col-span-8 cottage-parchment-card border-2 border-[#dfceb9] rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-md flex flex-col justify-between h-full">
          {/* Baking Oven Glow Animation */}
          <AnimatePresence>
            {isBaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-orange-600/40 via-amber-500/30 to-transparent z-20 pointer-events-none flex items-center justify-center"
              >
                <div className="text-center bg-amber-950/80 text-amber-100 px-6 py-4 rounded-3xl backdrop-blur-sm border border-amber-400/40 shadow-2xl">
                  <Flame className="w-10 h-10 text-amber-400 mx-auto animate-bounce mb-1" />
                  <div className="text-xl font-black">{language === 'en' ? 'Baking in the oven...' : 'Koek bak in die oond...'}</div>
                  <div className="text-xs text-amber-200 mt-1 font-medium">{language === 'en' ? 'Golden crust & rich chocolate aroma!' : 'Goudbruin kors & heerlike sjokoladereuk!'}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header controls for pan */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 min-h-[36px]">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-amber-950 text-lg leading-tight">
                {language === 'en' ? 'Rectangular Baking Pan' : 'Reghoekige Oondpan'}
              </h3>
              <span className="text-xs bg-amber-200/80 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                {currentDiv.rows} × {currentDiv.cols} = {currentDiv.denominator} {language === 'en' ? 'equal pieces' : 'gelyke stukkies'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="select-all-slices-btn"
                onClick={handleSelectAll}
                className="text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-950 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                {language === 'en' ? 'Select All (1 Whole)' : 'Kies Almal (1 Hele)'}
              </button>
              <button
                type="button"
                id="unselect-slices-btn"
                onClick={handleUnselect}
                className="text-xs font-bold bg-[#fcf5eb] hover:bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                {language === 'en' ? 'Unselect' : 'Ontkies'}
              </button>
              <button
                type="button"
                id="clear-slices-btn"
                onClick={handleClear}
                className="text-xs font-bold bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-800 border border-stone-300 hover:border-rose-300 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                {language === 'en' ? 'Clear' : 'Maak Leeg'}
              </button>
            </div>
          </div>

          {/* Rectangular Oven Pan Container */}
          <div className="bg-stone-800 p-4 md:p-6 rounded-3xl shadow-xl border-4 border-stone-600 relative">
            {/* Metal rim highlight */}
            <div className="absolute top-2 left-4 right-4 h-1 bg-stone-500/50 rounded-full" />

            {/* Cake Grid or Empty Pan View with Crumbs */}
            {isPanEmpty ? (
              <div
                className="relative rounded-2xl border-2 border-dashed border-stone-600 bg-gradient-to-b from-[#1c1815] to-[#120f0d] p-4 sm:p-6 flex flex-col items-center justify-center text-center select-none overflow-hidden"
                style={{
                  minHeight: currentDiv.denominator > 30 ? '300px' : '280px',
                }}
              >
                {/* Non-stick metal pan brushed floor grid effect with faint division cut marks */}
                <div
                  className="absolute inset-0 grid gap-1.5 md:gap-2 p-3 opacity-15 pointer-events-none"
                  style={{
                    gridTemplateColumns: `repeat(${currentDiv.cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${currentDiv.rows}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: currentDiv.denominator }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-dashed border-amber-200/60 rounded-xl flex items-center justify-center text-[10px] text-amber-200/50 font-mono"
                    >
                      #{i + 1}
                    </div>
                  ))}
                </div>

                {/* Scattered chocolate cake crumbs on the metal pan */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Crumb cluster top left */}
                  <div className="absolute top-6 left-10 w-3 h-2 rounded-full bg-[#4a2612] rotate-12 shadow-xs" />
                  <div className="absolute top-9 left-14 w-1.5 h-1.5 rounded-full bg-[#783e1d]" />
                  <div className="absolute top-5 left-16 w-2 h-1.5 rounded-md bg-[#321708] -rotate-45" />

                  {/* Crumb cluster bottom left */}
                  <div className="absolute bottom-8 left-12 w-2.5 h-2 rounded-md bg-[#4a2612] rotate-45 shadow-xs" />
                  <div className="absolute bottom-6 left-16 w-1.5 h-1.5 rounded-full bg-[#964f26]" />
                  <div className="absolute bottom-11 left-8 w-1 h-1 rounded-full bg-[#633318]" />

                  {/* Crumb cluster top right */}
                  <div className="absolute top-8 right-12 w-3.5 h-2 rounded-full bg-[#3c1b0a] -rotate-12 shadow-xs" />
                  <div className="absolute top-6 right-16 w-1.5 h-1.5 rounded-full bg-[#783e1d]" />
                  <div className="absolute top-11 right-8 w-2 h-1 rounded-sm bg-[#5c2d12] rotate-30" />

                  {/* Crumb cluster bottom right */}
                  <div className="absolute bottom-9 right-14 w-3 h-2 rounded-md bg-[#4a2612] rotate-15 shadow-xs" />
                  <div className="absolute bottom-6 right-10 w-2 h-1.5 rounded-full bg-[#82441f]" />
                  <div className="absolute bottom-12 right-18 w-1 h-1 rounded-full bg-[#301608]" />

                  {/* Center scattered crumbs */}
                  <div className="absolute top-16 left-1/3 w-2 h-1.5 rounded-full bg-[#5c2d12] rotate-45" />
                  <div className="absolute bottom-14 right-1/3 w-2 h-2 rounded-full bg-[#3c1b0a] -rotate-20" />
                </div>

                {/* Educational Empty Pan Announcement Card */}
                <div className="relative z-10 max-w-sm sm:max-w-md bg-[#231710]/95 border-2 border-amber-400/50 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xs space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl animate-bounce">🥣</span>
                    <h4 className="text-base sm:text-lg font-black text-amber-100">
                      {language === 'en' ? 'The Pan is Completely Empty!' : 'Die Pan is Heeltemal Leeg!'}
                    </h4>
                  </div>

                  {/* Fraction Zero Highlight */}
                  <div className="inline-flex items-center gap-2.5 bg-black/60 px-4 py-2 rounded-xl border border-amber-400/30">
                    <span className="text-xs sm:text-sm font-bold text-amber-200">
                      {language === 'en' ? 'Cake left in pan:' : 'Koek oor in pan:'}
                    </span>
                    <div className="flex items-center gap-1 font-mono font-black text-amber-400 text-lg">
                      <Fraction numerator={0} denominator={denominator} size="sm" className="text-amber-300" lineClassName="border-amber-400" />
                      <span className="text-amber-200 text-sm ml-1.5">= 0</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-amber-200/90 font-medium leading-relaxed">
                    {language === 'en' ? (
                      <>
                        Just a few crumbs left! The fraction{' '}
                        <strong className="text-amber-300 font-mono">0/{denominator}</strong> means you have{' '}
                        <strong className="text-amber-300">0 slices</strong> out of all{' '}
                        <strong>{denominator}</strong> cut pieces — <em>you have nothing left!</em>
                      </>
                    ) : (
                      <>
                        Net 'n paar krummels oor! Die breuk{' '}
                        <strong className="text-amber-300 font-mono">0/{denominator}</strong> beteken jy het{' '}
                        <strong className="text-amber-300">0 stukkies</strong> uit al{' '}
                        <strong>{denominator}</strong> gesnyde dele — <em>jy het niks oor nie!</em>
                      </>
                    )}
                  </p>

                  {/* Action Buttons to Put Cake Back */}
                  <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      id="empty-pan-refill-all-btn"
                      onClick={handleSelectAll}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      {language === 'en' ? '🍫 Put Whole Cake Back (Select All)' : '🍫 Sit Hele Koek Terug (Kies Almal)'}
                    </button>
                    <button
                      type="button"
                      id="empty-pan-unselect-btn"
                      onClick={handleUnselect}
                      className="px-3 py-1.5 rounded-xl bg-[#361e10] hover:bg-[#482815] text-amber-200 border border-amber-400/40 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {language === 'en' ? '🍰 Put Cake Back (Unselected)' : '🍰 Sit Koek Terug (Kies Self)'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Cake Grid */
              <div
                className="grid gap-1.5 md:gap-2 w-full select-none"
                style={{
                  gridTemplateColumns: `repeat(${currentDiv.cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${currentDiv.rows}, minmax(0, 1fr))`,
                  minHeight: currentDiv.denominator > 30 ? '300px' : '280px',
                }}
              >
                {Array.from({ length: currentDiv.denominator }).map((_, index) => {
                  const isSelected = selectedSlices.has(index);
                  return (
                    <motion.button
                      key={index}
                      id={`cake-slice-${index}`}
                      onClick={() => handleToggleSlice(index)}
                      whileHover={{ scale: 0.98 }}
                      whileTap={{ scale: 0.94 }}
                      className={`relative rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-200 overflow-hidden border-2 ${
                        isSelected
                          ? 'bg-amber-600 border-amber-300 shadow-md ring-2 ring-amber-400/80 text-white'
                          : 'bg-amber-950/90 border-amber-900/80 hover:bg-amber-900 text-amber-200/90'
                      }`}
                    >
                      {/* Chocolate texture and frosting sprinkle dots */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-black" />

                      {/* Sprinkle decoration if frosted/selected */}
                      {isSelected && (
                        <span className="absolute top-1 right-1 text-[10px] select-none">✨</span>
                      )}

                      {/* Unit Fraction label (e.g. 1 over 12) */}
                      <Fraction
                        numerator={1}
                        denominator={currentDiv.denominator}
                        size={currentDiv.denominator > 30 ? 'xs' : currentDiv.denominator > 12 ? 'sm' : 'base'}
                        className={isSelected ? 'text-white' : 'text-amber-200'}
                      />

                      {/* Slice state indicator */}
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider mt-0.5 select-none ${
                          isSelected ? 'text-amber-200' : 'text-amber-400/60'
                        } ${currentDiv.denominator > 12 ? 'hidden sm:block' : ''}`}
                      >
                        {isSelected
                          ? language === 'en'
                            ? 'Picked'
                            : 'Gekies'
                          : `#${index + 1}`}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Tray handles */}
            <div className="flex justify-between items-center mt-3 px-2 text-stone-400 text-xs font-semibold">
              <span className="flex items-center gap-1">
                <span>◀</span> {language === 'en' ? 'Left Handle' : 'Linkerhandvatsel'}
              </span>
              <span className="text-stone-300">
                {language === 'en' ? 'Heavy Duty Non-Stick Oven Pan' : 'Kleefvrye Reghoekige Oondpan'}
              </span>
              <span className="flex items-center gap-1">
                {language === 'en' ? 'Right Handle' : 'Regterhandvatsel'} <span>▶</span>
              </span>
            </div>
          </div>

          {/* Hint under pan */}
          <div className="mt-4 flex items-center justify-between gap-2 text-xs text-amber-800 bg-amber-100/60 p-3 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-700" />
              <span>
                {isPanEmpty
                  ? language === 'en'
                    ? `The pan is cleared! 0/${denominator} = 0 means nothing is left. Tap "Select All", "Unselect", or click below to put the fresh cake back in!`
                    : `Die pan is leeggemaak! 0/${denominator} = 0 beteken niks is oor nie. Tik "Kies Almal", "Ontkies", of klik onder om die vars koek terug te sit!`
                  : language === 'en'
                  ? 'Click or tap on any chocolate slice to select or unselect it. Watch how the fraction values update on the right!'
                  : 'Klik of tik op enige sjokoladestukkie om dit te kies of te ontkies. Kyk hoe die breukwaardes regs verander!'}
              </span>
            </div>
            <VoiceNarratorButton
              speakerId="pan-tap-hint"
              language={language}
              variant="icon"
              text={
                isPanEmpty
                  ? language === 'en'
                    ? `The pan is cleared! Zero out of ${denominator} slices are left. The fraction 0 over ${denominator} means you have zero slices, nothing left at all!`
                    : `Die pan is leeggemaak! Nul uit ${denominator} stukkies is oor. Die breuk 0 op ${denominator} beteken nul, jy het niks oor nie!`
                  : language === 'en'
                  ? 'Click or tap on any chocolate slice to select or unselect it. Watch how the fraction values update on the right!'
                  : 'Klik of tik op enige sjokoladestukkie om dit te kies of te ontkies. Kyk hoe die breukwaardes regs verander!'
              }
            />
          </div>
        </div>

        {/* Right: Live Fraction Breakdown & Explanations (Bo & Onder) */}
        <div className="lg:col-span-4 h-full flex flex-col">
          {/* Big Interactive Fraction Card */}
          <div className="cottage-parchment-card rounded-3xl p-4 sm:p-5 shadow-md border-2 border-[#dfceb9] h-full flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-center mb-3 min-h-[36px]">
                <h3 className="font-extrabold text-amber-950 text-lg leading-tight text-center">
                  {language === 'en' ? 'Current Cake Fraction' : 'Huidige Koekbreuk'}
                </h3>
              </div>

              {/* Fraction Formula Display */}
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex flex-col items-center justify-center my-1.5">
              {/* Numerator / Bo */}
              <div className="flex items-center gap-2">
                <motion.div
                  key={numerator}
                  initial={{ scale: 1.3, color: '#d97706' }}
                  animate={{ scale: 1, color: '#78350f' }}
                  className="text-3xl sm:text-4xl font-black text-amber-900"
                >
                  {numerator}
                </motion.div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-black text-amber-900 uppercase">
                    {language === 'en' ? 'Numerator' : 'Teller'}
                  </div>
                  <div className="text-[11px] font-bold text-amber-600">
                    ({language === 'en' ? 'Top' : 'Bo'})
                  </div>
                </div>
              </div>

              {/* Fraction Line */}
              <div className="w-32 h-1 bg-amber-900 rounded-full my-1.5 relative group">
                <span className="absolute -right-2 -top-2.5 text-[9px] font-black bg-amber-200 text-amber-900 px-1 py-0.2 rounded-md border border-amber-400">
                  ÷
                </span>
              </div>

              {/* Denominator / Onder */}
              <div className="flex items-center gap-2">
                <div className="text-3xl sm:text-4xl font-black text-amber-900">
                  {denominator}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-black text-amber-900 uppercase">
                    {language === 'en' ? 'Denominator' : 'Noemer'}
                  </div>
                  <div className="text-[11px] font-bold text-amber-600">
                    ({language === 'en' ? 'Bottom' : 'Onder'})
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Visual Meaning Explanation Boxes (Moved up with 3rd reminder banner at bottom) */}
            <div className="space-y-2 text-xs pt-2.5 mt-2 border-t border-amber-200/80">
              {/* 1. Meaning Box */}
              <div className="bg-amber-100/70 p-2.5 sm:p-3 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                    <span>📌</span>
                    <span>{language === 'en' ? 'What does this fraction tell us?' : 'Wat sê hierdie breuk vir ons?'}</span>
                  </div>
                  <VoiceNarratorButton
                    speakerId="cake-card-meaning"
                    language={language}
                    size="sm"
                    text={
                      language === 'en'
                        ? `What does this fraction tell us? ${
                            isPanEmpty
                              ? `The pan is cleared. There are 0 out of ${denominator} chocolate slices left. The fraction 0 over ${denominator} equals 0, meaning you have nothing left!`
                              : numerator === 0
                              ? `All slices are in the pan, but 0 out of ${denominator} are selected. Click any slice to pick how many you want!`
                              : `You have selected ${numerator} out of ${denominator} equal chocolate slices.`
                          } The top number, the numerator, is ${numerator}. The bottom number, the denominator, is ${denominator}. ${
                            numerator === denominator
                              ? 'This is exactly one whole cake!'
                              : numerator === 0
                              ? 'The pan currently has 0 selected.'
                              : 'This is a proper fraction.'
                          }`
                        : `Wat sê hierdie breuk vir ons? ${
                            isPanEmpty
                              ? `Die pan is leeggemaak. Daar is 0 uit ${denominator} sjokoladestukkies oor. Die breuk 0 op ${denominator} is gelyk aan 0, wat beteken jy het niks oor nie!`
                              : numerator === 0
                              ? `Al die stukkies is in die pan, maar 0 uit ${denominator} is gekies. Klik enige stukkie om te kies hoeveel jy wil hê!`
                              : `Jy het ${numerator} uit ${denominator} gelyke sjokoladestukkies gekies.`
                          } Die boonste getal, die teller, is ${numerator}. Die onderste getal, die noemer, is ${denominator}. ${
                            numerator === denominator
                              ? 'Dit is presies een hele koek!'
                              : numerator === 0
                              ? 'Daar is tans 0 stukkies gekies.'
                              : 'Dit is \'n egte breuk.'
                          }`
                    }
                  />
                </div>
                <p className="text-amber-900 font-medium">
                  {language === 'en' ? (
                    isPanEmpty ? (
                      <>
                        The pan is empty! <strong>0</strong> out of <strong>{denominator}</strong> slices remain.{' '}
                        The fraction <strong>0/{denominator} = 0</strong> means you have <em>nothing left!</em>
                      </>
                    ) : numerator === 0 ? (
                      <>
                        You have unselected all slices: <strong>0</strong> out of <strong>{denominator}</strong> picked.{' '}
                        Click any slice in the pan to select it!
                      </>
                    ) : (
                      <>
                        You have selected <strong>{numerator}</strong> out of{' '}
                        <strong>{denominator}</strong> equal chocolate slices.
                      </>
                    )
                  ) : isPanEmpty ? (
                    <>
                      Die pan is leeg! <strong>0</strong> uit <strong>{denominator}</strong> stukkies oor.{' '}
                      Die breuk <strong>0/{denominator} = 0</strong> beteken jy het <em>niks oor nie!</em>
                    </>
                  ) : numerator === 0 ? (
                    <>
                      Jy het al die stukkies ontkies: <strong>0</strong> uit <strong>{denominator}</strong> gekies.{' '}
                      Klik enige stukkie in die pan om dit te kies!
                    </>
                  ) : (
                    <>
                      Jy het <strong>{numerator}</strong> uit <strong>{denominator}</strong> gelyke
                      sjokoladestukkies gekies.
                    </>
                  )}
                </p>
              </div>

              {/* 2. Fraction status: Proper, Whole, or Empty */}
              <div
                className={`p-2.5 sm:p-3 rounded-xl border font-bold flex items-center gap-2 ${
                  numerator === 0
                    ? isPanEmpty
                      ? 'bg-amber-100/90 border-amber-300 text-amber-950'
                      : 'bg-stone-100 border-stone-300 text-stone-700'
                    : numerator === denominator
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span className="flex items-center gap-1.5 flex-wrap">
                  {numerator === 0 ? (
                    isPanEmpty ? (
                      language === 'en' ? (
                        <>
                          <span>🥣 Empty Pan:</span>
                          <Fraction numerator={0} denominator={denominator} size="sm" className="text-amber-950 font-black inline-flex" />
                          <span>= 0 (Nothing left!)</span>
                        </>
                      ) : (
                        <>
                          <span>🥣 Leë Pan:</span>
                          <Fraction numerator={0} denominator={denominator} size="sm" className="text-amber-950 font-black inline-flex" />
                          <span>= 0 (Niks oor nie!)</span>
                        </>
                      )
                    ) : language === 'en' ? (
                      <>
                        <Fraction numerator={0} denominator={denominator} size="sm" className="text-stone-800 font-black inline-flex" />
                        <span>slices selected (Pan is full, click slices to pick!)</span>
                      </>
                    ) : (
                      <>
                        <Fraction numerator={0} denominator={denominator} size="sm" className="text-stone-800 font-black inline-flex" />
                        <span>stukkies gekies (Pan is vol, klik stukkies om te kies!)</span>
                      </>
                    )
                  ) : numerator === denominator ? (
                    language === 'en' ? (
                      <>
                        <span>🎉 Exactly 1 Whole Cake! (</span>
                        <Fraction numerator={denominator} denominator={denominator} size="sm" className="text-emerald-950 font-black inline-flex" />
                        <span>= 1 Whole)</span>
                      </>
                    ) : (
                      <>
                        <span>🎉 Presies 1 Hele Koek! (</span>
                        <Fraction numerator={denominator} denominator={denominator} size="sm" className="text-emerald-950 font-black inline-flex" />
                        <span>= 1 Hele)</span>
                      </>
                    )
                  ) : language === 'en' ? (
                    <>
                      <span>Proper Fraction:</span>
                      <Fraction numerator={numerator} denominator={denominator} size="sm" className="text-blue-950 font-black inline-flex mx-0.5" />
                      <span>of the whole cake.</span>
                    </>
                  ) : (
                    <>
                      <span>Egte Breuk:</span>
                      <Fraction numerator={numerator} denominator={denominator} size="sm" className="text-blue-950 font-black inline-flex mx-0.5" />
                      <span>van die hele koek.</span>
                    </>
                  )}
                </span>
              </div>

              {/* 3. Kid-Friendly Golden Reminder: More slices = Smaller pieces! */}
              <div className="bg-amber-50/90 border-2 border-amber-300/80 rounded-xl p-2.5 sm:p-3 text-amber-950 shadow-2xs">
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="font-extrabold text-amber-950 flex items-center gap-1.5 text-xs">
                    <span className="text-sm">💡</span>
                    <span>
                      {language === 'en'
                        ? "Baker's Secret: More slices = Smaller pieces!"
                        : "Bakker se Geheim: Meer stukkies = Kleiner stukkies!"}
                    </span>
                  </div>
                  <VoiceNarratorButton
                    speakerId="cake-card-denominator-rule"
                    language={language}
                    size="sm"
                    text={
                      language === 'en'
                        ? "Remember this golden rule: If you cut your cake into more slices, your bottom number—the denominator—gets bigger, but each slice gets smaller! Sharing among 12 friends gives smaller pieces than sharing among only 2 friends."
                        : "Onthou hierdie belangrike reël: As jy jou koek in meer stukkies sny, word jou onderste getal—die noemer—groter, maar elke stukkie word kleiner! Om tussen 12 maats te deel gee kleiner stukkies as om tussen net 2 maats te deel."
                    }
                  />
                </div>
                <p className="text-[11px] sm:text-xs text-amber-900/90 leading-relaxed font-medium">
                  {language === 'en' ? (
                    <>
                      If you cut your cake into <strong>more slices</strong> (your bottom number, the denominator, gets bigger), each slice gets <strong>smaller</strong>! Sharing with 12 friends gives smaller bites than sharing with only 2 friends!
                    </>
                  ) : (
                    <>
                      As jy jou koek in <strong>meer stukkies</strong> sny (jou onderste getal, die noemer, word groter), word elke stukkie <strong>kleiner</strong>! Om met 12 maats te deel gee kleiner happies as om met net 2 maats te deel!
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Bottom Navigation Buttons: Previous & Next Chapter (matching Chapter 1) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 pb-2">
        {/* Left: Previous */}
        <button
          type="button"
          id="chapter-two-prev-btn"
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
            {language === 'en' ? 'Previous' : 'Vorige'}
          </span>
        </button>

        {/* Right: Next Chapter - exact same font size and styling as left button */}
        <button
          type="button"
          id="chapter-two-next-btn"
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

      {/* Enlarged Chocolate Oven Pan Cake Modal */}
      <AnimatePresence>
        {isCakeEnlarged && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
            onClick={() => {
              playSliceClick();
              setIsCakeEnlarged(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={() => {
                playSliceClick();
                setIsCakeEnlarged(false);
              }}
              className="relative max-w-xl w-full bg-[#fcf8f2] rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-amber-400 ring-4 ring-[#452412]/80 overflow-hidden cursor-zoom-out select-none group"
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
                  setIsCakeEnlarged(false);
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-amber-900 hover:bg-amber-800 text-amber-100 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer z-10"
                title={language === 'en' ? 'Click to shrink back' : 'Klik om te verklein'}
                aria-label="Close enlarged photo"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-amber-300 shadow-inner bg-amber-950/10">
                <img
                  src={STORY_3D_ASSETS.chocolatePanCakeThumb}
                  alt="Enlarged Chocolate Cake in Oven Pan"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-xl sm:text-2xl font-black text-amber-950">
                  {language === 'en'
                    ? 'Chocolate Cake in the Oven Pan'
                    : 'Sjokoladekoek in die Oondpan'}
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 font-semibold mt-1">
                  {language === 'en'
                    ? 'Click anywhere within the frame to shrink back'
                    : 'Klik enige plek binne die raam om te verklein'}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
