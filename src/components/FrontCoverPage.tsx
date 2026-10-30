import React from 'react';
import { Sparkles } from 'lucide-react';
import { Language } from '../types';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { playSuccessChime, playSliceClick } from '../utils/audio';

interface FrontCoverPageProps {
  language: Language;
  onEnter: () => void;
}

export const FrontCoverPage: React.FC<FrontCoverPageProps> = ({
  language,
  onEnter,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ========================================================================= */}
      {/* MAIN STORYBOOK FRONT COVER                                                */}
      {/* ========================================================================= */}
      <div className="cottage-parchment-card rounded-3xl sm:rounded-4xl p-4 sm:p-6 md:p-8 shadow-2xl border-4 sm:border-6 border-[#7a4924] border-l-8 sm:border-l-12 border-l-[#502e15] relative overflow-hidden">
        {/* Book spine lighting & ornate corner accents */}
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none" />
        <div className="absolute top-2.5 left-3 text-amber-700/50 text-base font-serif select-none pointer-events-none">
          ❦
        </div>
        <div className="absolute top-2.5 right-3 text-amber-700/50 text-base font-serif select-none pointer-events-none">
          ❦
        </div>
        <div className="absolute bottom-2.5 left-3 text-amber-700/50 text-base font-serif select-none pointer-events-none">
          ❦
        </div>
        <div className="absolute bottom-2.5 right-3 text-amber-700/50 text-base font-serif select-none pointer-events-none">
          ❦
        </div>

        {/* Header: Stories from Bumblewood Cottage Bakery - framed to line up with the sides of the image */}
        <div className="mb-4 sm:mb-5">
          <div className="w-full flex items-center justify-center gap-2 sm:gap-4 md:gap-6 bg-[#2d180c] text-amber-300 px-4 sm:px-6 md:px-8 py-4 sm:py-5.5 md:py-6.5 min-h-[64px] sm:min-h-[78px] md:min-h-[88px] rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 shadow-2xl">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-base md:text-xl lg:text-2xl font-black uppercase tracking-wide leading-none text-center whitespace-nowrap">
              {language === 'en'
                ? 'Stories from Bumblewood Cottage Bakery'
                : 'Stories uit Bumblewood Kothuisbakkery'}
            </span>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-amber-400 shrink-0" />
          </div>
        </div>

        {/* The Main Feature: Grand 3D Storybook Illustration */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
          <div className="relative h-72 sm:h-96 md:h-[460px] lg:h-[520px] w-full overflow-hidden">
            <img
              src={STORY_3D_ASSETS.cottageBakeryHero}
              alt="Bumblewood Cottage Bakery"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Gradient Shadow in lower region for pristine heading legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Heading in the left, bottom corner of the image - fitted to one single line on full size screen */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-10 max-w-full right-4 sm:right-6 md:right-8 text-left pointer-events-none">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
                {language === 'en'
                  ? 'Fractions Explained by Teacher Hazel...'
                  : 'Breuke Verduidelik deur Juffrou Hazel...'}
              </h1>
            </div>
          </div>
        </div>

        {/* At the bottom: Enter button with enlarged text and no symbols */}
        <div className="flex justify-center pt-4 sm:pt-6 pb-2">
          <button
            type="button"
            id="front-cover-enter-btn"
            onClick={() => {
              playSliceClick();
              playSuccessChime();
              onEnter();
            }}
            className="inline-flex items-center justify-center bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 transition-all text-[#2a1406] font-black text-lg sm:text-xl md:text-2xl px-12 sm:px-16 py-4 sm:py-5 rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-3 border-amber-300 cursor-pointer tracking-wide"
          >
            <span>{language === 'en' ? 'Enter' : 'Gaan Binne'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
