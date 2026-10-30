import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { Language, LessonTab } from '../types';
import { playSliceClick, playSuccessChime } from '../utils/audio';

interface ChapterFooterNavProps {
  currentTab: LessonTab;
  language: Language;
  onSelectTab: (tab: LessonTab) => void;
  onCompleteLesson?: (tab: LessonTab) => void;
}

interface ChapterMeta {
  id: LessonTab;
  number: number; // 0 for cover, 1..6 for chapters
  numberLabelEn: string;
  numberLabelAf: string;
  titleEn: string;
  titleAf: string;
}

const CHAPTER_SEQUENCE: ChapterMeta[] = [
  {
    id: 'cover',
    number: 0,
    numberLabelEn: 'Cover',
    numberLabelAf: 'Voorblad',
    titleEn: 'Storybook Cover',
    titleAf: 'Storieboek Voorblad',
  },
  {
    id: 'story',
    number: 1,
    numberLabelEn: 'Chapter 1',
    numberLabelAf: 'Hoofstuk 1',
    titleEn: "Mila's 10th Birthday Cake Mystery...",
    titleAf: 'Mila se 10de Verjaardagkoek Raaisel...',
  },
  {
    id: 'baking',
    number: 2,
    numberLabelEn: 'Chapter 2',
    numberLabelAf: 'Hoofstuk 2',
    titleEn: 'The Oven Cake Pan',
    titleAf: 'Die Oondkoekpan',
  },
  {
    id: 'rules',
    number: 3,
    numberLabelEn: 'Chapter 3',
    numberLabelAf: 'Hoofstuk 3',
    titleEn: 'The 4 Golden Principles',
    titleAf: 'Die 4 Goue Beginsels',
  },
  {
    id: 'puzzle',
    number: 4,
    numberLabelEn: 'Chapter 4',
    numberLabelAf: 'Hoofstuk 4',
    titleEn: 'Sliding Cake Puzzles',
    titleAf: 'Koekpan-skuiflegkaarte',
  },
  {
    id: 'addition',
    number: 5,
    numberLabelEn: 'Chapter 5',
    numberLabelAf: 'Hoofstuk 5',
    titleEn: 'Step-by-Step Addition',
    titleAf: 'Stap-vir-Stap Optel',
  },
  {
    id: 'whole',
    number: 6,
    numberLabelEn: 'Chapter 6',
    numberLabelAf: 'Hoofstuk 6',
    titleEn: 'Find the Whole Number',
    titleAf: 'Vind die Heelgetal',
  },
  {
    id: 'practice',
    number: 7,
    numberLabelEn: 'Chapter 7',
    numberLabelAf: 'Hoofstuk 7',
    titleEn: 'Bakery Customer Rush',
    titleAf: 'Bakkery-kliëntetoets',
  },
];

export const ChapterFooterNav: React.FC<ChapterFooterNavProps> = ({
  currentTab,
  language,
  onSelectTab,
  onCompleteLesson,
}) => {
  const currentIndex = CHAPTER_SEQUENCE.findIndex((c) => c.id === currentTab);
  if (currentIndex === -1 || currentTab === 'cover' || currentTab === 'front') {
    return null;
  }

  const current = CHAPTER_SEQUENCE[currentIndex];
  const prev = currentIndex > 0 ? CHAPTER_SEQUENCE[currentIndex - 1] : null;
  const isLast = currentIndex === CHAPTER_SEQUENCE.length - 1;
  const next = !isLast ? CHAPTER_SEQUENCE[currentIndex + 1] : null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handlePrev = () => {
    if (!prev) return;
    playSliceClick();
    scrollToTop();
    onSelectTab(prev.id);
  };

  const handleNext = () => {
    playSuccessChime();
    scrollToTop();
    if (onCompleteLesson) {
      onCompleteLesson(current.id);
    }
    if (next) {
      onSelectTab(next.id);
    } else {
      // Return to cover with celebration
      onSelectTab('cover');
    }
  };

  return (
    <div className="cottage-parchment-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-lg border-2 border-amber-300/80 bg-gradient-to-r from-[#fbf6ee] via-[#fffdf9] to-[#fbf6ee] mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Previous Page Button */}
        <button
          type="button"
          id="chapter-nav-prev-btn"
          onClick={handlePrev}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#f4ebd9] hover:bg-white text-[#4a2b16] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#d8c3ad] hover:border-amber-400 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8c5a32]" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-[#8c5a32] block leading-none">
              {language === 'en' ? 'Previous' : 'Vorige'}
            </span>
            <span className="font-black text-xs sm:text-sm">
              {prev
                ? language === 'en'
                  ? `${prev.numberLabelEn}: ${prev.titleEn}`
                  : `${prev.numberLabelAf}: ${prev.titleAf}`
                : language === 'en'
                ? 'Back'
                : 'Terug'}
            </span>
          </div>
        </button>

        {/* Center Chapter Indicator */}
        <div className="flex flex-col items-center text-center px-2 py-1 select-none">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-0.5 rounded-full shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {language === 'en'
                ? `Chapter ${current.number} of 7`
                : `Hoofstuk ${current.number} van 7`}
            </span>
          </div>
          <div className="font-bold text-xs text-[#543118]">
            {language === 'en' ? current.titleEn : current.titleAf}
          </div>
        </div>

        {/* Next Page / Finish Button */}
        <button
          type="button"
          id="chapter-nav-next-btn"
          onClick={handleNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 text-[#2a1406] font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md border-2 border-amber-300 transition-all cursor-pointer"
        >
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-amber-950 block leading-none">
              {isLast
                ? language === 'en'
                  ? 'Grand Finale'
                  : 'Groot Finale'
                : language === 'en'
                ? 'Continue to Next Chapter'
                : 'Gaan na Volgende Hoofstuk'}
            </span>
            <span className="font-black text-xs sm:text-sm">
              {next
                ? language === 'en'
                  ? `${next.numberLabelEn}: ${next.titleEn}`
                  : `${next.numberLabelAf}: ${next.titleAf}`
                : language === 'en'
                ? 'Finish Journey & Return to Cover 🎉'
                : 'Voltooi Reis & Terug na Voorblad 🎉'}
            </span>
          </div>
          {isLast ? (
            <CheckCircle2 className="w-4 h-4 text-[#2a1406]" />
          ) : (
            <ArrowRight className="w-4 h-4 text-[#2a1406]" />
          )}
        </button>
      </div>
    </div>
  );
};
