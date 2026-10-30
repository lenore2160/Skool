import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';
import { Language, LessonTab } from '../types';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { playSliceClick, playSuccessChime, playPieceDrop } from '../utils/audio';
import { speakCharacterPreview, CharacterRole } from '../utils/speech';

interface CoverPageProps {
  language: Language;
  onOpenStory: () => void;
  onSelectTab: (tab: LessonTab) => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  language,
  onOpenStory,
  onSelectTab,
}) => {
  const [enlargedCharId, setEnlargedCharId] = useState<string | null>(null);
  const [enlargedChapterNumber, setEnlargedChapterNumber] = useState<number | null>(null);

  const chapters = [
    {
      tab: 'story' as LessonTab,
      number: 1,
      chapterLabelEn: 'Chapter 1',
      chapterLabelAf: 'Hoofstuk 1',
      headingEn: "Mila's 10th Birthday Cake Mystery...",
      headingAf: 'Mila se 10de Verjaardagkoek Raaisel...',
      descEn: 'Why more party guests means a smaller piece of cake for everyone!',
      descAf: "Hoekom meer partytjiegaste 'n kleiner stukkie koek vir almal beteken!",
      image3d: STORY_3D_ASSETS.chapter1Cake3d,
    },
    {
      tab: 'baking' as LessonTab,
      number: 2,
      chapterLabelEn: 'Chapter 2',
      chapterLabelAf: 'Hoofstuk 2',
      headingEn: 'The Oven Cake Pan',
      headingAf: 'Die Oondkoekpan',
      descEn: 'Top (Numerator) & Bottom (Denominator) rectangular slice grid.',
      descAf: 'Bo (Teller) & Onder (Noemer) reghoekige koekpanverdeling.',
      image3d: STORY_3D_ASSETS.chapter2Pan3d,
    },
    {
      tab: 'rules' as LessonTab,
      number: 3,
      chapterLabelEn: 'Chapter 3',
      chapterLabelAf: 'Hoofstuk 3',
      headingEn: 'The 4 Golden Principles',
      headingAf: 'Die 4 Goue Beginsels',
      descEn: 'Handwritten study rules: 1 whole cake, proper & mixed fractions.',
      descAf: 'Handgeskrewe studiereëls: 1 hele koek, egte & gemengde breuke.',
      image3d: STORY_3D_ASSETS.chapter3Rules3d,
    },
    {
      tab: 'puzzle' as LessonTab,
      number: 4,
      chapterLabelEn: 'Chapter 4',
      chapterLabelAf: 'Hoofstuk 4',
      headingEn: 'Sliding Cake Puzzles',
      headingAf: 'Koekpan-skuiflegkaarte',
      descEn: 'Drag and slide pan pieces to fill sweet bakery customer orders.',
      descAf: 'Sleep en skuif panstukkies om soet bakkerybestellings te vul.',
      image3d: STORY_3D_ASSETS.chapter4Puzzle3d,
    },
    {
      tab: 'addition' as LessonTab,
      number: 5,
      chapterLabelEn: 'Chapter 5',
      chapterLabelAf: 'Hoofstuk 5',
      headingEn: 'Step-by-Step Addition',
      headingAf: 'Stap-vir-Stap Optel',
      descEn: 'Visual dual pans and pink multiplier boxes to add fractions easily.',
      descAf: 'Visuele dubbelpanne en pienk vermenigvuldiger-boksies om breuke op te tel.',
      image3d: STORY_3D_ASSETS.chapter5Addition3d,
    },
    {
      tab: 'whole' as LessonTab,
      number: 6,
      chapterLabelEn: 'Chapter 6',
      chapterLabelAf: 'Hoofstuk 6',
      headingEn: 'Find the Whole Number',
      headingAf: 'Vind die Heelgetal',
      descEn: '10 step-by-step bakery examples to calculate the whole from a fractional part.',
      descAf: "10 stap-vir-stap bakkery-voorbeelde om die hele vanuit 'n breuk te bereken.",
      image3d: STORY_3D_ASSETS.birthdayCelebration3d,
    },
    {
      tab: 'practice' as LessonTab,
      number: 7,
      chapterLabelEn: 'Chapter 7',
      chapterLabelAf: 'Hoofstuk 7',
      headingEn: 'Bakery Customer Rush',
      headingAf: 'Bakkery-kliëntestormloop',
      descEn: 'Serve bakery orders, earn chef XP, and unlock all badges!',
      descAf: 'Bedien bakkerybestellings, verdien XP en ontsluit al die kentekens!',
      image3d: STORY_3D_ASSETS.chapter6Rush3d,
    },
  ];

  const characters: {
    id: string;
    nameEn: string;
    nameAf: string;
    roleEn: string;
    roleAf: string;
    detailEn: string;
    detailAf: string;
    quoteEn: string;
    quoteAf: string;
    image: string;
    speechRole: CharacterRole;
    avatar: string;
  }[] = [
    {
      id: 'barnaby',
      nameEn: 'Barnaby Bear',
      nameAf: 'Barnaby Beer',
      roleEn: 'Master Baker & Oven Keeper',
      roleAf: 'Meesterbakker & Oondwagter',
      detailEn:
        'Cuddly, wise village baker who stokes the hearth fire and bakes golden honey cakes. He loves big slices and teaching fractions!',
      detailAf:
        'Groot, wyse dorpsbakker wat die kaggelvuur stook en goue heuningkoeke bak. Hy is baie lief vir groot koekstukke!',
      quoteEn: '“A full cake is 1 whole! When you share it, the slices get smaller!”',
      quoteAf: '“’n Volle koek is 1 hele! Wanneer jy deel, word die stukkies kleiner!”',
      image: STORY_3D_ASSETS.barnabyBear3d,
      speechRole: 'barnaby_bear',
      avatar: '🐻',
    },
    {
      id: 'hazel',
      nameEn: 'Teacher Hazel',
      nameAf: 'Juffrou Hazel',
      roleEn: 'Math Guide & Storyteller',
      roleAf: 'Wiskundegids & Storieverteller',
      detailEn:
        'Enthusiastic young teacher who guides apprentices through the 4 Golden Rules of fractions, improper fractions, and common denominators.',
      detailAf:
        'Entoesiastiese jong onderwyseres wat vakleerlinge deur die 4 Goue Reëls van breuke, onegte breuke en gemeenskaplike noemers lei.',
      quoteEn: '“The bottom denominator counts the pieces; the top numerator counts what you get!”',
      quoteAf: '“Die onderste noemer tel die dele; die boonste teller tel hoeveel jy kry!”',
      image: STORY_3D_ASSETS.teacherHazel3d,
      speechRole: 'hazel_narrator',
      avatar: '👩‍🏫',
    },
    {
      id: 'mila_bella',
      nameEn: 'Mila & Bella',
      nameAf: 'Mila & Bella',
      roleEn: 'Birthday Girls',
      roleAf: 'Verjaarsdagmaats',
      detailEn:
        'Sweet woodland bunny sisters celebrating Mila’s 10th birthday! As more village friends arrive at the cottage hearth, they discover why slices become smaller.',
      detailAf:
        'Soet hasiesussies wat Mila se 10de verjaarsdag vier! Soos al hoe meer dorpsmaats by die kaggelvuur opdaag, ontdek hulle hoekom stukkies kleiner word.',
      quoteEn: '“More friends at the table means smaller slices, but way more laughter!”',
      quoteAf: '“Meer maats by die tafel beteken kleiner stukkies, maar baie meer pret!”',
      image: STORY_3D_ASSETS.birthdayCelebration3d,
      speechRole: 'bella_bunny',
      avatar: '🐰',
    },
    {
      id: 'pip',
      nameEn: 'Pip Penguin',
      nameAf: 'Pip Pikkewyn',
      roleEn: 'Party Helper',
      roleAf: 'Partytjiehulp',
      detailEn:
        'Energetic party helper and bakery apprentice who loves sliding pan puzzles, measuring oven temperatures, and rushing sweet orders to guests.',
      detailAf:
        'Energiese partytjiehulp en bakkeryvakleerling wat mal is oor skuiflegkaarte, oondtemperature en vinnige bestellings bedien.',
      quoteEn: '“Order up! Sliding fraction pans right into place!”',
      quoteAf: '“Bestelling gereed! Skuif breukpanne reg in plek!”',
      image: STORY_3D_ASSETS.pipPenguin3d,
      speechRole: 'pip_penguin',
      avatar: '🐧',
    },
  ];

  const handleToggleEnlarge = (charId: string) => {
    if (enlargedCharId === charId) {
      playPieceDrop();
      setEnlargedCharId(null);
    } else {
      playSliceClick();
      setEnlargedCharId(charId);
    }
  };

  const activeEnlargedChar = characters.find((c) => c.id === enlargedCharId);
  const activeEnlargedChapter = chapters.find((c) => c.number === enlargedChapterNumber);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ========================================================================= */}
      {/* 1. ONE LARGE MAIN BACKDROP BLOCK (DOTS PATTERN) CONTAINING:               */}
      {/*    - MAIN HEADING ("Stories from Bumblewood Cottage Bakery")             */}
      {/*    - 3D STORYBOOK IMAGE WITH "Table of Contents"                         */}
      {/*    - ALL CHAPTERS (VERTICAL STACK)                                       */}
      {/* ========================================================================= */}
      <div className="cottage-parchment-card rounded-3xl sm:rounded-4xl p-4 sm:p-6 md:p-8 shadow-2xl border-4 sm:border-6 border-[#7a4924] border-l-8 sm:border-l-12 border-l-[#502e15] relative overflow-hidden space-y-5 sm:space-y-6">
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
        <div>
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

        {/* The Main Feature: Grand 3D Storybook Illustration with consistent aspect ratio for full-screen fidelity */}
        <div className="relative w-full aspect-[16/7] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
          <img
            src={STORY_3D_ASSETS.cottageBakeryHero}
            alt="Bumblewood Cottage Bakery"
            className="w-full h-full object-cover object-[50%_72%]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Gradient Shadow in lower region for pristine heading legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

          {/* Heading in the left, bottom corner: "Table of Contents" as prominent main heading */}
          <div className="absolute bottom-2.5 sm:bottom-3.5 md:bottom-4 lg:bottom-5 left-4 sm:left-6 md:left-8 z-10 max-w-full right-4 sm:right-6 text-left pointer-events-none">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
              {language === 'en' ? 'Table of Contents' : 'Inhoudsopgawe'}
            </h2>
          </div>
        </div>

        {/* Chapters stacked below each other inside the same main backdrop */}
        <div className="flex flex-col space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
          {chapters.map((chap) => (
            <div
              key={chap.tab}
              id={`cover-chapter-${chap.tab}`}
              onClick={() => {
                playSliceClick();
                onSelectTab(chap.tab);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  playSliceClick();
                  onSelectTab(chap.tab);
                }
              }}
              role="button"
              tabIndex={0}
              className="group flex items-center justify-between gap-3.5 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl text-left bg-[#fbf5ed] hover:bg-white border-3 sm:border-4 border-amber-400 ring-2 ring-amber-500/20 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer relative"
            >
              {/* Left Side: Enlarged 3D Picture */}
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  playPieceDrop();
                  setEnlargedChapterNumber(chap.number);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    playPieceDrop();
                    setEnlargedChapterNumber(chap.number);
                  }
                }}
                className="relative w-22 h-22 sm:w-26 sm:h-26 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 sm:border-3 border-amber-400/90 shadow-md shrink-0 bg-[#2d190d] hover:scale-105 hover:border-amber-300 hover:shadow-lg transition-all cursor-zoom-in group/thumb"
                title={
                  language === 'en'
                    ? 'Tap to enlarge 3D picture'
                    : 'Tik om 3D prent te vergroot'
                }
              >
                <img
                  src={chap.image3d}
                  alt={language === 'en' ? chap.headingEn : chap.headingAf}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1.5 right-1.5 bg-black/75 rounded-md p-1 text-amber-200 shadow-xs">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Middle: Chapter Info with slightly larger font and balanced dimensions, NO symbols in headings */}
              <div className="flex-1 min-w-0 py-1">
                {/* Yellow chapter tag - no symbols */}
                <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider bg-amber-300 text-amber-950 border-2 border-amber-400 shadow-2xs mb-1.5 sm:mb-2">
                  <span>{language === 'en' ? chap.chapterLabelEn : chap.chapterLabelAf}</span>
                </div>

                {/* Chapter Heading - slightly larger font, no symbols */}
                <h3 className="font-black text-base sm:text-lg md:text-xl lg:text-2xl text-[#2e160a] group-hover:text-amber-950 transition-colors leading-snug">
                  {language === 'en' ? chap.headingEn : chap.headingAf}
                </h3>

                {/* Kid-friendly Description - slightly larger font */}
                <p className="text-sm sm:text-base text-[#61361b] group-hover:text-[#45220d] leading-relaxed mt-1.5 line-clamp-2">
                  {language === 'en' ? chap.descEn : chap.descAf}
                </p>
              </div>

              {/* Right Side: Inviting Open Button / Chevron */}
              <div className="flex items-center shrink-0 pr-1">
                <div className="hidden sm:inline-flex items-center gap-2 bg-[#381e0f] group-hover:bg-amber-500 text-amber-200 group-hover:text-[#2a1406] font-black text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all shadow-xs">
                  <span>{language === 'en' ? 'Open' : 'Begin'}</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="sm:hidden text-amber-700 group-hover:text-amber-900 p-1">
                  <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MEET THE 3D VILLAGE FRIENDS                                            */}
      {/* ========================================================================= */}
      <div className="cottage-parchment-card rounded-3xl p-4 sm:p-6 md:p-7 shadow-xl border-4 border-[#8c5a32] space-y-4">
        {/* Header: Meet the Characters in the Story - in brown block with yellow frame matching Table of Contents */}
        <div className="mb-4 sm:mb-5">
          <div className="w-full flex items-center justify-center gap-2 sm:gap-4 md:gap-6 bg-[#2d180c] text-amber-300 px-4 sm:px-6 md:px-8 py-3.5 sm:py-4.5 md:py-5 min-h-[58px] sm:min-h-[68px] md:min-h-[76px] rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 shadow-2xl">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400 shrink-0" />
            <h2 className="text-xs sm:text-base md:text-xl lg:text-2xl font-black uppercase tracking-wide leading-none text-center whitespace-nowrap">
              {language === 'en' ? 'Meet the Characters in the Story' : 'Ontmoet die Karakters in die Storie'}
            </h2>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400 shrink-0" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {characters.map((char) => {
            const isEnlarged = enlargedCharId === char.id;
            return (
              <button
                key={char.id}
                type="button"
                id={`char-card-${char.id}`}
                onClick={() => handleToggleEnlarge(char.id)}
                className={`group flex flex-col items-center text-center p-2.5 rounded-2xl transition-all cursor-pointer border-2 ${
                  isEnlarged
                    ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400/60 scale-102'
                    : 'bg-[#f5ebe0] hover:bg-white border-amber-400/80 hover:border-amber-400 shadow-xs hover:shadow-md'
                }`}
                title={
                  language === 'en'
                    ? isEnlarged
                      ? 'Tap again to shrink'
                      : `Tap to enlarge ${char.nameEn} and hear voice`
                    : isEnlarged
                    ? 'Tik weer om te verklein'
                    : `Tik om ${char.nameAf} te vergroot en stem te hoor`
                }
              >
                {/* 3D Character Thumbnail Frame */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-amber-400/90 shadow-sm ring-1 ring-amber-900/30 mb-2 bg-[#2d190d]">
                  <img
                    src={char.image}
                    alt={char.nameEn}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 right-1 w-4 h-4 bg-amber-950/70 rounded-full flex items-center justify-center text-[9px] text-amber-200">
                    <ZoomIn className="w-2.5 h-2.5" />
                  </div>
                </div>

                <div className="font-black text-xs text-[#381e0f] group-hover:text-amber-900 transition-colors">
                  {language === 'en' ? char.nameEn : char.nameAf}
                </div>
                <div className="text-[10px] text-amber-800 font-bold line-clamp-1">
                  {language === 'en' ? char.roleEn : char.roleAf}
                </div>

                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#7a4e2b] font-semibold">
                  <Volume2 className="w-3 h-3 text-amber-600" />
                  <span>{language === 'en' ? 'Hear Quote' : 'Hoor Aanhaling'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Instruction moved to bottom right corner below the characters - brown block with yellow frame */}
        <div className="flex justify-end pt-1">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#2d180c] text-amber-300 text-[11px] sm:text-xs font-bold px-3 sm:px-3.5 py-1.5 rounded-xl border-2 border-amber-400 ring-2 ring-[#452412]/80 shadow-md">
            <ZoomIn className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {language === 'en'
                ? 'Tap any character to enlarge & hear them speak'
                : 'Tik enige karakter om te vergroot & stem te hoor'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. NAVIGATION BUTTONS CENTERED AT THE BOTTOM                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6 pt-3 pb-3">
        {/* Left: Back to Cover */}
        <button
          type="button"
          id="back-to-cover-btn"
          onClick={() => {
            playSliceClick();
            onSelectTab('front');
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#381e0f] hover:bg-[#4a2814] active:scale-95 transition-all text-amber-200 hover:text-amber-100 font-black text-sm sm:text-base md:text-lg px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl shadow-xl border-2 sm:border-3 border-amber-400/90 cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 text-amber-300 group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'en' ? 'Back to Cover' : 'Terug na Buiteblad'}</span>
        </button>

        {/* Right: Turn to Chapter 1 */}
        <button
          type="button"
          id="turn-to-chapter-one-btn"
          onClick={() => {
            playSuccessChime();
            onOpenStory();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 transition-all text-[#2a1406] font-black text-sm sm:text-base md:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl shadow-xl border-2 sm:border-3 border-amber-300 cursor-pointer group"
        >
          <span>
            {language === 'en' ? 'Turn to Chapter 1' : 'Blaai na Hoofstuk 1'}
          </span>
          <ArrowRight className="w-5 h-5 text-[#2a1406] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Enlarged Character Lightbox / Detail Card Overlay */}
      <AnimatePresence>
        {activeEnlargedChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleToggleEnlarge(activeEnlargedChar.id)}
            className="fixed inset-0 z-50 bg-[#160b05]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
            id="enlarged-character-modal"
          >
            <motion.div
              initial={{ scale: 0.88, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="cottage-parchment-card max-w-md w-full rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden space-y-3 cursor-default"
            >
              {/* Header Bar: Sound button next to Close icon in top right, top-left icon removed */}
              <div className="flex items-center justify-end gap-2 pb-2 border-b border-[#dfceb9]">
                <button
                  type="button"
                  id="modal-character-voice-btn"
                  onClick={() => {
                    speakCharacterPreview(activeEnlargedChar.speechRole, language);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4a2b16] hover:bg-[#5f381d] text-amber-100 font-bold text-xs transition-all shadow-xs cursor-pointer"
                  title={language === 'en' ? 'Hear Voice' : 'Luister na Stem'}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'en' ? 'Hear Voice' : 'Luister na Stem'}</span>
                </button>
                <button
                  type="button"
                  id="modal-character-close-btn"
                  onClick={() => handleToggleEnlarge(activeEnlargedChar.id)}
                  className="w-7 h-7 rounded-full bg-[#3d2412] text-amber-200 hover:text-white hover:bg-[#5a361e] flex items-center justify-center transition-colors cursor-pointer"
                  title={language === 'en' ? 'Close' : 'Maak toe'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* High-resolution 3D Portrait Frame: Pure image with no text inside */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl bg-[#221209]">
                <img
                  src={activeEnlargedChar.image}
                  alt={activeEnlargedChar.nameEn}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Character Identity & Role */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#381e0f] tracking-tight">
                  {language === 'en'
                    ? activeEnlargedChar.nameEn
                    : activeEnlargedChar.nameAf}
                </h3>
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  {language === 'en'
                    ? activeEnlargedChar.roleEn
                    : activeEnlargedChar.roleAf}
                </div>
              </div>

              {/* Story Quote & Biography */}
              <div className="bg-[#f5ebe0] rounded-xl p-3 border border-[#dfceb9] text-left space-y-1.5">
                <p className="text-xs sm:text-sm text-[#4a2b16] italic font-medium">
                  {language === 'en'
                    ? activeEnlargedChar.quoteEn
                    : activeEnlargedChar.quoteAf}
                </p>
                <p className="text-[11px] sm:text-xs text-[#6e4324] leading-relaxed">
                  {language === 'en'
                    ? activeEnlargedChar.detailEn
                    : activeEnlargedChar.detailAf}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enlarged Chapter 3D Image Modal: Image only, no other text whatsoever */}
      <AnimatePresence>
        {activeEnlargedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playPieceDrop();
              setEnlargedChapterNumber(null);
            }}
            className="fixed inset-0 z-50 bg-[#160b05]/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            id="enlarged-chapter-modal"
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
                src={activeEnlargedChapter.image3d}
                alt=""
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />

              {/* Only an option to close or shrink the image to its original size */}
              <button
                type="button"
                id="close-enlarged-chapter-image"
                onClick={() => {
                  playPieceDrop();
                  setEnlargedChapterNumber(null);
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
    </div>
  );
};
