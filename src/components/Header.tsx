import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Award, Languages, X, ZoomIn } from 'lucide-react';
import { Language, LessonTab, Badge } from '../types';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { playPieceDrop, playSliceClick } from '../utils/audio';

interface HeaderProps {
  currentTab: LessonTab;
  onSelectTab: (tab: LessonTab) => void;
  language: Language;
  onToggleLanguage: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  badges: Badge[];
  onOpenBadges: () => void;
  xp: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  isMuted,
  onToggleSound,
  badges,
  onOpenBadges,
  xp,
}) => {
  const [isHazelEnlarged, setIsHazelEnlarged] = useState<boolean>(false);
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const level = Math.floor(xp / 100) + 1;

  return (
    <header className="bg-gradient-to-b from-[#422615] via-[#351e10] to-[#28150a] text-amber-50 shadow-lg border-b-2 sm:border-b-4 border-[#5a361e] sticky top-0 z-30">
      {/* Top Banner with branding & actions - streamlined & clean */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Logo and title with 3D Teacher Hazel */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-left">
          {/* Clickable Avatar to Enlarge Photo */}
          <button
            type="button"
            id="header-teacher-hazel-avatar"
            onClick={(e) => {
              e.stopPropagation();
              playPieceDrop();
              setIsHazelEnlarged(true);
            }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md ring-2 ring-amber-950/60 shrink-0 hover:scale-110 hover:border-amber-300 transition-all cursor-zoom-in group/avatar"
            title={
              language === 'en'
                ? 'Tap to enlarge Teacher Hazel photo'
                : 'Tik om Juffrou Hazel prent te vergroot'
            }
            aria-label="Enlarge Teacher Hazel photo"
          >
            <img
              src={STORY_3D_ASSETS.teacherHazel3d}
              alt="Teacher Hazel 3D"
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#351e10] rounded-full" />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-3 h-3 text-amber-200" />
            </div>
          </button>

          {/* Title and subtitle click navigates to front cover */}
          <button
            type="button"
            onClick={() => {
              playSliceClick();
              onSelectTab('front');
            }}
            className="text-left cursor-pointer group bg-transparent border-0 p-0"
            title={language === 'en' ? 'Go to Storybook Front Cover' : 'Gaan na Storieboek Buiteblad'}
          >
            <h1 className="font-black text-sm sm:text-base tracking-tight text-amber-100 group-hover:text-white flex items-center gap-1 drop-shadow transition-colors">
              {language === 'en' ? '3D Math Adventures' : '3D Wiskunde Avonture'}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-amber-200/90 font-medium leading-tight mt-0.5">
              {language === 'en'
                ? 'Fractions Explained by Teacher Hazel'
                : 'Breuke Verduidelik deur Juffrou Hazel'}
            </p>
          </button>
        </div>

        {/* Stats and controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick link between Front Cover and Table of Contents */}
          {currentTab === 'cover' && (
            <button
              type="button"
              id="header-front-btn"
              onClick={() => onSelectTab('front')}
              className="hidden sm:flex items-center gap-1 bg-[#4e2c18] hover:bg-[#5d361e] border border-amber-600/50 px-2.5 py-1 rounded-xl text-[11px] font-bold text-amber-100 cursor-pointer transition-all shadow-xs"
              title={language === 'en' ? 'Return to Front Cover' : 'Terug na Buiteblad'}
            >
              <span>✨</span>
              <span>{language === 'en' ? 'Front Cover' : 'Buiteblad'}</span>
            </button>
          )}

          {currentTab !== 'cover' && currentTab !== 'front' && (
            <button
              type="button"
              id="header-cover-btn"
              onClick={() => onSelectTab('cover')}
              className="hidden sm:flex items-center gap-1 bg-[#4e2c18] hover:bg-[#5d361e] border border-amber-600/50 px-2.5 py-1 rounded-xl text-[11px] font-bold text-amber-100 cursor-pointer transition-all shadow-xs"
              title={language === 'en' ? 'Return to Table of Contents' : 'Terug na Inhoudsopgawe'}
            >
              <span>📖</span>
              <span>{language === 'en' ? 'Cover' : 'Voorblad'}</span>
            </button>
          )}

          {/* Level & XP pill */}
          <div className="flex items-center gap-1.5 bg-[#201007]/80 border border-amber-700/50 rounded-xl px-2 sm:px-2.5 py-1 text-[11px] font-semibold text-amber-200 shadow-inner">
            <span className="w-5 h-5 rounded-md bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 flex items-center justify-center font-black text-[10px] shadow-xs">
              {level}
            </span>
            <div className="leading-tight">
              <span className="text-amber-100 font-black text-[11px]">{xp} XP</span>
            </div>
          </div>

          {/* Badges Button */}
          <button
            type="button"
            id="badges-modal-btn"
            onClick={onOpenBadges}
            className="flex items-center gap-1 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 transition-all text-amber-950 font-black text-[11px] px-2.5 py-1 rounded-xl shadow-sm border border-amber-300 cursor-pointer"
            title={language === 'en' ? 'View Bakery Badges' : 'Kyk na Bakkery Kentekens'}
          >
            <Award className="w-3.5 h-3.5" />
            <span>
              {unlockedCount}/{badges.length}
            </span>
            <span className="hidden sm:inline font-bold">
              {language === 'en' ? 'Badges' : 'Kentekens'}
            </span>
          </button>

          {/* Language Toggle (EN / AF) */}
          <button
            type="button"
            id="lang-toggle-btn"
            onClick={onToggleLanguage}
            className="flex items-center gap-1 bg-[#4e2c18] hover:bg-[#5d361e] border border-amber-600/50 px-2 py-1 rounded-xl text-[11px] font-bold text-amber-100 cursor-pointer transition-all shadow-xs"
            title="Toggle English / Afrikaans terms"
          >
            <Languages className="w-3 h-3 text-amber-300" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            id="sound-toggle-btn"
            onClick={onToggleSound}
            className="p-1.5 rounded-xl bg-[#4e2c18] hover:bg-[#5d361e] border border-amber-600/50 text-amber-200 hover:text-white transition-all cursor-pointer shadow-xs"
            title={isMuted ? 'Sound muted' : 'Sound enabled'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-400/60" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
          </button>
        </div>
      </div>

      {/* Enlarged Teacher Hazel Photo Modal: Image only, no other text whatsoever */}
      <AnimatePresence>
        {isHazelEnlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playPieceDrop();
              setIsHazelEnlarged(false);
            }}
            className="fixed inset-0 z-50 bg-[#160b05]/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            id="enlarged-teacher-hazel-modal"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="relative w-[90vw] max-w-[500px] aspect-square rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-[#221209] cursor-default"
            >
              <img
                src={STORY_3D_ASSETS.teacherHazel3d}
                alt=""
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />

              {/* Only an option to close or shrink the image to its original size */}
              <button
                type="button"
                id="close-enlarged-hazel-image"
                onClick={() => {
                  playPieceDrop();
                  setIsHazelEnlarged(false);
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1e0e06]/85 hover:bg-[#381c0d] text-amber-300 hover:text-amber-100 border-2 border-amber-400 flex items-center justify-center shadow-xl transition-all hover:scale-110 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
