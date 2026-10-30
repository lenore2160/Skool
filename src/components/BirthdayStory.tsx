import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  RotateCw,
  Sparkles,
  Cake,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Heart,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';
import { Language, LessonTab } from '../types';
import { ThreeCakeCanvas } from './ThreeCakeCanvas';
import {
  speakTeacher,
  stopSpeech,
  isSpeaking,
  subscribeToActiveSpeaker,
  subscribeToActiveRole,
  speakCharacterPreview,
  CHARACTER_PROFILES,
  CharacterRole,
} from '../utils/speech';
import { playPieceDrop, playSuccessChime, playSliceClick } from '../utils/audio';
import { STORY_3D_ASSETS } from '../assets/storyImages';
import { Fraction, FormattedFractionText } from './Fraction';

interface BirthdayStoryProps {
  language: Language;
  onContinueToBaking: () => void;
  onSelectTab: (tab: LessonTab) => void;
  onAwardXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

interface StoryBeat {
  id: number;
  character: {
    nameEn: string;
    nameAf: string;
    titleEn: string;
    titleAf: string;
    avatar: string;
    color: string;
    image3d?: string;
  };
  dialogueEn: string;
  dialogueAf: string;
  recommendedGuests: number;
  fractionFormula: string;
  lessonEn: string;
  lessonAf: string;
}

const STORY_BEATS: StoryBeat[] = [
  {
    id: 1,
    character: {
      nameEn: 'Chef Barnaby Bear',
      nameAf: 'Sjef Barnaby Beer',
      titleEn: 'Master Village Baker',
      titleAf: 'Meester-dorpsbakker',
      avatar: '🐻',
      image3d: STORY_3D_ASSETS.barnabyBear3d,
      color: 'from-amber-600 to-amber-800',
    },
    dialogueEn:
      'Welcome to our cozy Bumblewood Village Bakery! Smell that sweet cinnamon and warm vanilla? Today is a very magical day. Little Mila Bunny is turning 10 years old, and we are baking her grand celebration cake together!',
    dialogueAf:
      'Welkom by ons gesellige Bumblewood Bakkery! Ruik jy daardie soet kaneel en warm vanielje? Vandag is ’n baie spesiale dag. Klein Mila Hasie verjaar en word 10 jaar oud, en ons gaan saam haar groot verjaardagkoek bak!',
    recommendedGuests: 2,
    fractionFormula: '1 / 2',
    lessonEn: 'Every celebration begins with 1 whole cake baked with love!',
    lessonAf: 'Elke viering begin met 1 hele koek wat met liefde gebak word!',
  },
  {
    id: 2,
    character: {
      nameEn: 'Pip the Penguin',
      nameAf: 'Pip die Pikkewyn',
      titleEn: 'Excited Party Helper',
      titleAf: 'Opgewonde Partytjiehulp',
      avatar: '🐧',
      image3d: STORY_3D_ASSETS.pipPenguin3d,
      color: 'from-blue-600 to-indigo-800',
    },
    dialogueEn:
      'Look! Mila initially invited just 2 close friends. So Chef Barnaby sliced the cake into 2 equal parts. Each friend gets 1 out of 2 pieces (1/2). Wow, look at the 3D cake — each slice is enormous!',
    dialogueAf:
      'Kyk hier! Mila het eers net 2 maats genooi. So Sjef Barnaby het die koek in 2 gelyke dele gesny. Elke maat kry 1 uit 2 stukkies (1/2). Sjoe, kyk na die 3D-koek — elke stukkie is reusagtig groot!',
    recommendedGuests: 2,
    fractionFormula: '1 / 2',
    lessonEn: 'Fewer guests (2) = 2 big slices (1/2 each).',
    lessonAf: 'Minder gaste (2) = 2 groot stukke (1/2 elk).',
  },
  {
    id: 3,
    character: {
      nameEn: 'Bella Bunny & Mila',
      nameAf: 'Bella Hasie & Mila',
      titleEn: 'Birthday Girl & Sister',
      titleAf: 'Verjaardagmeisie & Sussie',
      avatar: '🐰',
      image3d: STORY_3D_ASSETS.birthdayCelebration3d,
      color: 'from-pink-500 to-rose-700',
    },
    dialogueEn:
      'Wait, wait! 4 woodland friends just arrived at the bakery door! If we invite 4 friends, we must divide the very SAME cake into 4 equal slices (1/4 each). Notice what happened: as the number of guests grew from 2 to 4, each slice became smaller!',
    dialogueAf:
      'Wag, wag! 4 bosveldmaats het pas by die bakkery opgedaag! As ons 4 maats nooi, moet ons dieselfde koek in 4 gelyke dele sny (1/4 elk). Let op wat gebeur het: soos die aantal gaste gegroei het van 2 na 4, het elke stukkie kleiner geword!',
    recommendedGuests: 4,
    fractionFormula: '1 / 4',
    lessonEn: '4 friends = 4 equal slices (1/4). 1/4 is smaller than 1/2!',
    lessonAf: '4 maats = 4 gelyke stukke (1/4). 1/4 is kleiner as 1/2!',
  },
  {
    id: 4,
    character: {
      nameEn: 'Teacher Hazel & Oliver Owl',
      nameAf: 'Juffrou Hazel & Oliver Uil',
      titleEn: 'Wise Village Mathematicians',
      titleAf: 'Wyse Dorpswiskundiges',
      avatar: '👩‍🏫',
      image3d: STORY_3D_ASSETS.teacherHazel3d,
      color: 'from-emerald-600 to-teal-800',
    },
    dialogueEn:
      'Hoot hoot! Now 8 friends have arrived, and maybe even 12 or 16! Look at the 3D cake — notice how each of the 12 or 16 slices has its own vibrant color! Remember the Golden Bakery Secret: The more guests you invite (the bigger the denominator), the smaller each slice becomes! 1/2 > 1/4 > 1/8 > 1/12 > 1/16!',
    dialogueAf:
      'Hoe-hoe! Nou het 8 maats opgedaag, en dalk selfs 12 of 16! Kyk na die 3D-koek — let op hoe elkeen van die 12 of 16 stukkies sy eie helder kleur het! Onthou die Goue Bakkerygeheim: Hoe meer gaste jy nooi (hoe groter die noemer), hoe kleiner word elke stukkie! 1/2 > 1/4 > 1/8 > 1/12 > 1/16!',
    recommendedGuests: 8,
    fractionFormula: '1 / 8',
    lessonEn: 'Golden Rule: More pieces = smaller size! Denominator (bottom) counts the parts.',
    lessonAf: 'Goue Reël: Meer stukkies = kleiner grootte! Noemer (onder) tel die dele.',
  },
];

export const BirthdayStory: React.FC<BirthdayStoryProps> = ({
  language,
  onContinueToBaking,
  onSelectTab,
  onAwardXp,
  onUnlockBadge,
}) => {
  const [guests, setGuests] = useState<number>(2);
  const [separation, setSeparation] = useState<number>(0.25);
  const [cakeAutoRotate, setCakeAutoRotate] = useState<boolean>(true);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);
  const [activeSpeakingBeatId, setActiveSpeakingBeatId] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<CharacterRole | null>(null);
  const [previewingRole, setPreviewingRole] = useState<CharacterRole | null>(null);
  const [hasCompletedStory, setHasCompletedStory] = useState<boolean>(false);
  const [selectedBeatForModal, setSelectedBeatForModal] = useState<StoryBeat | null>(null);

  // Subscribe to real-time active speaker and character personification roles
  useEffect(() => {
    const unsubRole = subscribeToActiveRole((role) => {
      setActiveRole(role);
    });
    const unsubSpeaker = subscribeToActiveSpeaker((activeId) => {
      setIsSpeakingNow(activeId !== null);
      if (!activeId) {
        setPreviewingRole(null);
        setActiveSpeakingBeatId(null);
      }
    });
    return () => {
      unsubRole();
      unsubSpeaker();
    };
  }, []);

  // Clean up speech when unmounted
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleReadBeat = (beat: StoryBeat) => {
    if (activeSpeakingBeatId === beat.id && isSpeakingNow) {
      stopSpeech();
      setIsSpeakingNow(false);
      setActiveSpeakingBeatId(null);
      return;
    }

    stopSpeech();

    // Formatted text to give each character their distinct voice and Teacher Hazel's soothing wisdom
    let textToSpeak = '';
    if (beat.id === 1) {
      textToSpeak =
        language === 'en'
          ? `Chef Barnaby Bear says: "${beat.dialogueEn}" Teacher Hazel says: "Remember: ${beat.lessonEn}"`
          : `Sjef Barnaby Beer sê: "${beat.dialogueAf}" Juffrou Hazel sê: "Onthou: ${beat.lessonAf}"`;
    } else if (beat.id === 2) {
      textToSpeak =
        language === 'en'
          ? `Pip the Penguin says: "${beat.dialogueEn}" Teacher Hazel says: "Remember: ${beat.lessonEn}"`
          : `Pip die Pikkewyn sê: "${beat.dialogueAf}" Juffrou Hazel sê: "Onthou: ${beat.lessonAf}"`;
    } else if (beat.id === 3) {
      textToSpeak =
        language === 'en'
          ? `Mila Bunny says: "Wait, wait! 4 woodland friends just arrived at the bakery door!" Bella Bunny says: "If we invite 4 friends, we must divide the very same cake into 4 equal slices! Notice what happened: as the number of guests grew from 2 to 4, each slice became smaller!" Teacher Hazel says: "Remember: ${beat.lessonEn}"`
          : `Mila Hasie sê: "Wag, wag! 4 bosveldmaats het pas by die bakkery opgedaag!" Bella Hasie sê: "As ons 4 maats nooi, moet ons dieselfde koek in 4 gelyke dele sny! Let op wat gebeur het: soos die aantal gaste gegroei het van 2 na 4, het elke stukkie kleiner geword!" Juffrou Hazel sê: "Onthou: ${beat.lessonAf}"`;
    } else if (beat.id === 4) {
      textToSpeak =
        language === 'en'
          ? `Oliver Owl says: "Hoot hoot! Now 8 friends have arrived, and maybe even 12 or 16! Look at the colorful cake slices!" Teacher Hazel says: "Remember the Golden Bakery Secret: The more guests you invite, the more pieces you must cut, and the smaller each piece becomes! 1/2 is greater than 1/4, which is greater than 1/8, which is greater than 1/12, which is greater than 1/16! Denominator counts the parts."`
          : `Oliver Uil sê: "Hoe-hoe! Nou het 8 maats opgedaag, en dalk selfs 12 of 16! Kyk na die kleurvolle koekstukkies!" Juffrou Hazel sê: "Onthou die Goue Bakkerygeheim: Hoe meer gaste jy nooi, hoe meer stukkies moet jy sny, en hoe kleiner word elke stukkie! 1/2 is groter as 1/4, wat groter is as 1/8, wat groter is as 1/12, wat groter is as 1/16! Noemer tel die dele."`;
    } else {
      textToSpeak =
        language === 'en'
          ? `${beat.character.nameEn} says: "${beat.dialogueEn}" Remember: ${beat.lessonEn}`
          : `${beat.character.nameAf} sê: "${beat.dialogueAf}" Onthou: ${beat.lessonAf}`;
    }

    setActiveSpeakingBeatId(beat.id);
    setIsSpeakingNow(true);
    speakTeacher(
      textToSpeak,
      language,
      `birthday-story-beat-${beat.id}`,
      () => {
        setIsSpeakingNow(true);
        setActiveSpeakingBeatId(beat.id);
      },
      () => {
        setIsSpeakingNow(false);
        setActiveSpeakingBeatId(null);
        setActiveRole(null);
      }
    );
  };

  const handlePreviewRole = (role: CharacterRole) => {
    if (previewingRole === role && isSpeakingNow) {
      stopSpeech();
      setPreviewingRole(null);
      return;
    }
    stopSpeech();
    setPreviewingRole(role);
    speakCharacterPreview(role, language, () => {
      setPreviewingRole(null);
    });
  };

  const guestOptions = [2, 3, 4, 6, 8, 12, 16];

  return (
    <div className="space-y-4">
      {/* Village Bakery 3D Cottagecore Hero Banner - cropped to exact cover page aspect ratio */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-3 sm:border-4 border-amber-400 ring-4 ring-[#452412]/80 bg-[#1f1007]">
        {/* 3D Cinematic Render Background with soft watermark effect */}
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          <img
            src={STORY_3D_ASSETS.chapter1PartyHero}
            alt="3D Bumblewood Cottage Bakery - Mila's 10th Birthday Party"
            className="w-full h-full object-cover object-[50%_50%]"
            referrerPolicy="no-referrer"
          />
          {/* Soft, balanced vignette overlays - clear and pleasing to the eye */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Banner text: Chapter 1 yellow block on top-left, large title and description on bottom-left */}
          <div className="absolute inset-0 p-3.5 sm:p-5 md:p-7 flex flex-col justify-between z-10">
            {/* Top row: Chapter 1 yellow block with slightly bigger font size */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center bg-amber-300 text-amber-950 border-2 border-amber-400 text-sm sm:text-base md:text-lg lg:text-xl font-black px-4.5 sm:px-5.5 py-1.5 sm:py-2.5 rounded-xl shadow-md">
                <span>{language === 'en' ? 'Chapter 1' : 'Hoofstuk 1'}</span>
              </div>
            </div>

            {/* Bottom row: Main heading scaled to match Cover Page image size, plus balanced description */}
            <div className="w-full max-w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-amber-100 tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] sm:whitespace-nowrap">
                {language === 'en'
                  ? "Mila’s 10th Birthday Cake Mystery..."
                  : 'Mila se 10de Verjaardagkoek Raaisel...'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-200 font-bold drop-shadow mt-1.5 sm:mt-2 md:whitespace-nowrap">
                {language === 'en'
                  ? 'Why more party guests means a smaller piece of cake for everyone!'
                  : "Hoekom meer partytjiegaste 'n kleiner stukkie koek vir almal beteken!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3D Birthday Cake Interactive Section - Sides preserved, top & bottom cropped */}
      <div className="bg-white rounded-2xl sm:rounded-3xl px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 border-2 border-amber-200 shadow-md space-y-3">
        {/* Title Bar: ONLY the heading The 3D Birthday Cake above the line */}
        <div className="pb-1.5 border-b border-amber-100">
          <h3 className="font-black text-amber-950 text-base sm:text-lg md:text-xl">
            {language === 'en' ? 'The 3D Birthday Cake' : 'Die 3D-verjaardagkoek'}
          </h3>
        </div>

        {/* The two blocks in that main block next to each other, equal sizes - Balanced cropping, slightly relaxed spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {/* Block 1: 3D Cake Canvas & Cutting Board - px-4 sm:px-5, py-2.5 sm:py-3 */}
          <div className="bg-amber-50/80 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-amber-300 flex flex-col justify-start space-y-2.5 sm:space-y-3 h-full shadow-xs">
            {/* Top row: The two blocks at the top of the cake block - precisely lining up with the top row in the fraction block */}
            <div className="flex items-center justify-between flex-wrap gap-2 min-h-[38px]">
              {/* Left block: Each slice size indicator - matching storytelling text size with vertical fraction */}
              <div className="text-sm md:text-base font-bold text-amber-900 bg-amber-100/95 px-3.5 py-1 rounded-full border border-amber-300 shadow-2xs flex items-center gap-2">
                <Fraction numerator={1} denominator={guests} size="sm" className="text-pink-700" lineClassName="border-pink-800" />
                <span>
                  {language === 'en'
                    ? `Each Slice Size (${guests === 2 ? 'Huge Half' : guests === 4 ? 'Quarter' : guests === 8 ? 'Standard Slice' : `${guests} Slices`})`
                    : `Grootte van Elke Stukkie (${guests === 2 ? 'Reuse-helfte' : guests === 4 ? 'Kwart' : guests === 8 ? 'Gewone Stukkie' : `${guests} Stukkies`})`}
                </span>
              </div>

              {/* Right block: 3D Controls (Spinning & Paused buttons) */}
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1 rounded-xl border border-amber-300 shadow-2xs">
                {/* Button 1: Spinning / Roteer */}
                <button
                  type="button"
                  id="cake-spin-btn"
                  onClick={() => setCakeAutoRotate(true)}
                  className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    cakeAutoRotate
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-transparent text-amber-900 hover:bg-amber-100'
                  }`}
                  title={language === 'en' ? 'Keep 3D cake spinning' : 'Roteer 3D-koek'}
                >
                  <RotateCw className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'en' ? 'Spinning' : 'Roteer'}</span>
                </button>

                {/* Button 2: Paused / Stop */}
                <button
                  type="button"
                  id="cake-pause-btn"
                  onClick={() => setCakeAutoRotate(false)}
                  className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    !cakeAutoRotate
                      ? 'bg-[#3b1e0f] text-amber-100 shadow-xs'
                      : 'bg-transparent text-amber-900 hover:bg-amber-100'
                  }`}
                  title={language === 'en' ? 'Pause 3D cake rotation' : 'Stop 3D-koek'}
                >
                  <span className="flex items-center gap-0.5">
                    <span className="w-1 h-2.5 rounded-xs bg-current inline-block" />
                    <span className="w-1 h-2.5 rounded-xs bg-current inline-block" />
                  </span>
                  <span>{language === 'en' ? 'Paused' : 'Stop'}</span>
                </button>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="w-full flex-1 flex flex-col justify-center min-h-[265px] sm:min-h-[295px]">
              <ThreeCakeCanvas
                sliceCount={guests}
                separation={separation}
                language={language}
                autoRotate={cakeAutoRotate}
                onToggleAutoRotate={setCakeAutoRotate}
                hideOverlays={true}
              />
            </div>

            {/* Instructions below the cake - slightly relaxed spacing */}
            <div className="space-y-2 pt-2 border-t border-amber-200/80">
              {/* Instruction 1: Pull slices apart in 3D */}
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <span className="text-sm md:text-base font-bold text-amber-900 whitespace-nowrap">
                  {language === 'en' ? 'Pull slices apart in 3D:' : 'Trek stukkies uitmekaar in 3D:'}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={separation}
                  onChange={(e) => setSeparation(parseFloat(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />
                <span className="text-sm md:text-base font-mono font-bold text-amber-800 w-12 text-right">
                  {Math.round(separation * 100)}%
                </span>
              </div>

              {/* Instruction 2: What to do to rotate the cake */}
              <div className="flex items-center gap-2.5 text-sm md:text-base text-amber-900 font-medium bg-amber-100/60 border border-amber-200/90 rounded-xl px-3.5 py-1.5">
                <RotateCw className="w-4 h-4 text-amber-700 shrink-0" />
                <p className="leading-snug">
                  <strong className="font-bold text-amber-950">
                    {language === 'en' ? 'How to rotate the cake: ' : 'Hoe om die koek te draai: '}
                  </strong>
                  {language === 'en'
                    ? 'Click & drag (or swipe with your finger) in any direction to spin the cake and cutting board in 3D!'
                    : 'Klik & sleep (of vee met jou vinger) in enige rigting om die koek en snyplank in 3D te draai!'}
                </p>
              </div>
            </div>
          </div>

          {/* Block 2: Interactive Slicing Controls & Explanations - px-4 sm:px-5, py-2.5 sm:py-3 */}
          <div className="bg-amber-50/80 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 border-2 border-amber-300 flex flex-col justify-start space-y-2.5 sm:space-y-3 h-full shadow-xs">
            {/* Top row: Divided into slices block in the left top corner, plus fraction display */}
            <div className="flex items-center justify-between flex-wrap gap-2 min-h-[38px]">
              {/* Left top corner: Divided into... slices block */}
              <div className="text-sm md:text-base font-bold text-amber-900 bg-amber-100/95 px-3.5 py-1 rounded-full border border-amber-300 shadow-2xs">
                {language === 'en'
                  ? `Divided into ${guests} equal slices`
                  : `Verdeel in ${guests} gelyke stukkies`}
              </div>

              {/* Fraction Display */}
              <div className="font-mono font-black text-sm md:text-base text-pink-700 bg-pink-100 px-3.5 py-1 rounded-xl flex items-center gap-1.5 shadow-xs border border-pink-200">
                <span>{guests} {language === 'en' ? 'guests' : 'gaste'} =</span>
                <Fraction numerator={1} denominator={guests} size="sm" className="text-pink-700" lineClassName="border-pink-800" />
                <span>{language === 'en' ? 'each' : 'elk'}</span>
              </div>
            </div>

            {/* Playful Storytelling Explanation for 10-Year-Olds */}
            <div className="bg-amber-100/70 border border-amber-200/90 rounded-xl p-3 text-sm md:text-base text-amber-950 leading-relaxed font-medium">
              <p>
                {language === 'en'
                  ? "Imagine sharing Mila's delicious birthday cake with your party friends! If you invite fewer guests, you only cut a few slices, so everyone gets a bigger piece of cake. If you invite more guests, you must divide the cake into more slices so every single friend gets a treat—which means each slice becomes smaller!"
                  : "Verbeel jou jy deel Mila se heerlike verjaardagkoek met al jou partytjiemaats! As jy minder gaste nooi, sny jy minder stukkies, en elkeen kry 'n lekker groot stuk koek. As jy meer gaste nooi, moet die koek in meer stukkies verdeel word sodat elke maatjie 'n stukkie kry—wat beteken elke sny word kleiner!"}
              </p>
            </div>

            {/* Numerator & Denominator Explanations - slightly relaxed spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Numerator Card */}
              <div className="bg-amber-100/90 border border-amber-300/90 rounded-xl p-2.5 sm:p-3 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1 text-amber-950 font-black text-xs sm:text-sm uppercase tracking-wide">
                  <span className="bg-amber-800 text-amber-100 text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-mono font-bold">
                    {language === 'en' ? 'TOP' : 'BO'}
                  </span>
                  <span>{language === 'en' ? 'Numerator' : 'Teller'}</span>
                </div>
                <p className="text-sm md:text-base text-amber-950 font-medium leading-snug">
                  {language === 'en'
                    ? 'How many birthday cake slices you have on your plate (like 1 yummy slice to eat)!'
                    : 'Hoeveel verjaardagkoekstukkies op jou bordjie lê (soos 1 lekker sny om te eet)!'}
                </p>
              </div>

              {/* Denominator Card */}
              <div className="bg-orange-100/90 border border-orange-300/90 rounded-xl p-2.5 sm:p-3 shadow-2xs">
                <div className="flex items-center gap-1.5 mb-1 text-orange-950 font-black text-xs sm:text-sm uppercase tracking-wide">
                  <span className="bg-orange-800 text-orange-100 text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-mono font-bold">
                    {language === 'en' ? 'BOTTOM' : 'ONDER'}
                  </span>
                  <span>{language === 'en' ? 'Denominator' : 'Noemer'}</span>
                </div>
                <p className="text-sm md:text-base text-orange-950 font-medium leading-snug">
                  {language === 'en'
                    ? 'The total number of equal slices the entire cake is cut into for all the party guests!'
                    : 'Die totale aantal gelyke stukkies waarin die hele koek gesny is vir al die partytjiemaats!'}
                </p>
              </div>
            </div>

            {/* Quick Guest Selector Buttons */}
            <div className="grid grid-cols-7 gap-1.5">
              {guestOptions.map((num) => (
                <button
                  key={num}
                  id={`guests-btn-${num}`}
                  onClick={() => {
                    playSliceClick();
                    setGuests(num);
                  }}
                  className={`py-2 px-1 rounded-xl font-black text-xs md:text-sm transition-all cursor-pointer flex flex-col items-center justify-center border ${
                    guests === num
                      ? 'bg-gradient-to-b from-pink-500 to-rose-600 text-white border-rose-700 shadow-md scale-105'
                      : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span className="text-sm md:text-base font-black">{num}</span>
                  <div className="mt-0.5">
                    <Fraction
                      numerator={1}
                      denominator={num}
                      size="xs"
                      className={guests === num ? 'text-white' : 'text-amber-800'}
                      lineClassName={guests === num ? 'border-white' : 'border-amber-700'}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Big Storytelling Block: All 4 Chapters displayed under each other */}
      <div className="bg-amber-50/80 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4">
        {/* Big Block Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-amber-300/70">
          <div>
            <span className="cottage-golden-tag text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {language === 'en' ? 'Bumblewood Village Chronicles' : 'Bumblewood Dorpskronieke'}
            </span>
            <h3 className="font-black text-[#361e0f] text-base sm:text-lg md:text-xl flex items-center gap-2 mt-1">
              <span>📖</span>
              <span>
                {language === 'en'
                  ? 'The Birthday Story in 4 Chapters'
                  : 'Die Verjaardagstorie in 4 Hoofstukke'}
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#7d4825] font-bold self-start sm:self-center">
            {language === 'en'
              ? 'Listen to each character’s story below!'
              : 'Luister na elke karakter se storie hieronder!'}
          </p>
        </div>

        {/* Live Character Personification Banner when speaking */}
        <AnimatePresence>
          {isSpeakingNow && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-sm flex items-center justify-between gap-2 border border-rose-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {activeRole ? CHARACTER_PROFILES[activeRole]?.avatar : '👩‍🏫'}
                </span>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-rose-100 flex items-center gap-1.5">
                    <span className="animate-ping inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                    <span>
                      {language === 'en' ? 'Live Storytelling Voice' : 'Lewendige Voorleesstem'}
                    </span>
                  </div>
                  <div className="text-xs font-bold leading-tight">
                    {activeRole === 'hazel_narrator'
                      ? language === 'en'
                        ? 'Teacher Hazel (Warm, enthusiastic young lady teacher)'
                        : 'Juffrou Hazel (Warm, entoesiastiese jong onderwyseres)'
                      : activeRole
                      ? language === 'en'
                        ? `${CHARACTER_PROFILES[activeRole]?.nameEn} (${CHARACTER_PROFILES[activeRole]?.descriptionEn})`
                        : `${CHARACTER_PROFILES[activeRole]?.nameAf} (${CHARACTER_PROFILES[activeRole]?.descriptionAf})`
                      : language === 'en'
                      ? 'Teacher Hazel is speaking'
                      : 'Juffrou Hazel praat nou'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-black tracking-widest animate-pulse shrink-0">
                ılı.lıllılı.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Each of the 4 Story Chapters in its own little block */}
        <div className="space-y-4">
          {STORY_BEATS.map((beat) => {
            const isThisBeatSpeaking = isSpeakingNow && activeSpeakingBeatId === beat.id;

            return (
              <div
                key={beat.id}
                id={`story-chapter-${beat.id}`}
                className={`bg-white rounded-2xl p-4 sm:p-5 border-2 transition-all shadow-xs relative overflow-hidden ${
                  isThisBeatSpeaking
                    ? 'border-rose-400 ring-2 ring-rose-300/60 bg-rose-50/20'
                    : 'border-amber-200/90 hover:border-amber-300'
                }`}
              >
                {/* Top Badge: Chapter Part & Guest / Fraction Info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-[#3d2412] text-amber-200 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    {language === 'en'
                      ? `Chapter Part ${beat.id} of 4`
                      : `Hoofstukdeel ${beat.id} van 4`}
                  </span>
                  <span className="text-xs font-bold text-amber-800">
                    {language === 'en'
                      ? `(${beat.recommendedGuests} Guests • 1/${beat.recommendedGuests} Slice each)`
                      : `(${beat.recommendedGuests} Gaste • 1/${beat.recommendedGuests} Stukkie elk)`}
                  </span>
                </div>

                {/* Character Header: Photo, Name, Title, and Listen Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-3 border-b border-amber-200/70">
                  <div className="flex items-center gap-3.5">
                    <motion.div
                      animate={{
                        y: isThisBeatSpeaking ? [0, -3, 0] : 0,
                        scale: isThisBeatSpeaking ? [1, 1.03, 1] : 1,
                      }}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                      onClick={() => {
                        playSliceClick();
                        setSelectedBeatForModal(beat);
                      }}
                      className="w-16 h-16 rounded-2xl bg-[#30190b] border-2 border-amber-400 overflow-hidden shadow-md ring-2 ring-amber-900/40 relative shrink-0 cursor-pointer group"
                      title={
                        language === 'en'
                          ? 'Tap to enlarge image to see detail'
                          : 'Tik om prentjie te vergroot vir meer detail'
                      }
                    >
                      {beat.character.image3d ? (
                        <img
                          src={beat.character.image3d}
                          alt={beat.character.nameEn}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-3xl flex items-center justify-center h-full">
                          {beat.character.avatar}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                        <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 drop-shadow" />
                      </div>
                      {isThisBeatSpeaking && (
                        <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-white" />
                        </span>
                      )}
                    </motion.div>

                    <div>
                      <h4 className="font-black text-[#361e0f] text-base md:text-lg flex items-center gap-1.5">
                        {language === 'en'
                          ? beat.character.nameEn
                          : beat.character.nameAf}
                      </h4>
                      <p className="text-xs text-[#824f2b] font-bold">
                        {language === 'en'
                          ? beat.character.titleEn
                          : beat.character.titleAf}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          playSliceClick();
                          setSelectedBeatForModal(beat);
                        }}
                        className="text-[10px] text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                      >
                        <ZoomIn className="w-2.5 h-2.5" />
                        <span>{language === 'en' ? 'Enlarge image' : 'Vergroot prentjie'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Speech Synthesizer Control for this character story chapter */}
                  <button
                    type="button"
                    id={`speech-read-beat-${beat.id}-btn`}
                    onClick={() => handleReadBeat(beat)}
                    className={`p-2.5 px-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm border self-start sm:self-center shrink-0 ${
                      isThisBeatSpeaking
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-200'
                        : 'bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 border-amber-300 hover:shadow-md'
                    }`}
                    title={
                      isThisBeatSpeaking
                        ? language === 'en'
                          ? 'Stop speaking'
                          : 'Stop stem'
                        : language === 'en'
                        ? `Listen to ${beat.character.nameEn} and Teacher Hazel`
                        : `Luister na ${beat.character.nameAf} en Juffrou Hazel`
                    }
                  >
                    {isThisBeatSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4 text-white" />
                        <span className="text-xs font-black">
                          {language === 'en' ? 'Stop Voice' : 'Stop Stem'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-950" />
                        <span className="text-xs font-black">
                          {language === 'en' ? 'Listen to Story' : 'Luister na Storie'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Dialogue Bubble */}
                <div className="relative bg-[#fdfbf7] rounded-2xl p-4 border border-[#e6d6c4] text-[#3d2412] mb-3.5 shadow-2xs">
                  <div className="text-sm md:text-base leading-relaxed font-medium">
                    “<FormattedFractionText text={language === 'en' ? beat.dialogueEn : beat.dialogueAf} size="sm" />”
                  </div>
                </div>

                {/* Core Golden Takeaway Box */}
                <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-pink-500/15 border-2 border-amber-400/40 rounded-2xl p-3 sm:p-3.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base sm:text-lg">✨</span>
                    <span className="text-xs uppercase font-black tracking-wider text-amber-900">
                      {language === 'en' ? 'Golden Fraction Rule' : 'Goue Breukreël'}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm font-bold text-amber-950">
                    <FormattedFractionText text={language === 'en' ? beat.lessonEn : beat.lessonAf} size="xs" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

          {/* Centered Bottom Navigation Buttons: Back to Table of Contents & Turn to Chapter 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 pb-2">
            {/* Left: Previous */}
            <button
              type="button"
              id="back-to-table-of-contents-btn"
              onClick={() => {
                playSliceClick();
                stopSpeech();
                onSelectTab('cover');
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
              id="turn-to-chapter-two-btn"
              onClick={() => {
                playSuccessChime();
                stopSpeech();
                onContinueToBaking();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 transition-all text-[#2a1406] font-bold text-xs sm:text-sm md:text-base px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-md border-2 border-amber-300 cursor-pointer group"
            >
              <span className="text-xs sm:text-sm md:text-base font-bold leading-normal tracking-normal">
                {language === 'en' ? 'Next Chapter' : 'Volgende Hoofstuk'}
              </span>
              <ArrowRight className="w-4 h-4 text-[#2a1406] group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>

      {/* Enlarged Character Lightbox / Detail Modal */}
      <AnimatePresence>
        {selectedBeatForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playPieceDrop();
              setSelectedBeatForModal(null);
            }}
            className="fixed inset-0 z-50 bg-[#160b05]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
            id="story-character-modal"
          >
            <motion.div
              initial={{ scale: 0.88, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={() => {
                // Tapping anywhere inside also collapses back to original size per user request
                playPieceDrop();
                setSelectedBeatForModal(null);
              }}
              className="cottage-parchment-card max-w-md w-full rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-[#dfceb9]">
                <span className="cottage-golden-tag text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ZoomOut className="w-3 h-3" />
                  {language === 'en'
                    ? 'Tap anywhere to shrink back'
                    : 'Tik enige plek om terug te gaan'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playPieceDrop();
                    setSelectedBeatForModal(null);
                  }}
                  className="w-7 h-7 rounded-full bg-[#3d2412] text-amber-200 hover:text-white hover:bg-[#5a361e] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Large, high-res portrait frame */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl bg-[#221209] group">
                {selectedBeatForModal.character.image3d ? (
                  <img
                    src={selectedBeatForModal.character.image3d}
                    alt={selectedBeatForModal.character.nameEn}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-6xl flex items-center justify-center h-full">
                    {selectedBeatForModal.character.avatar}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#201007]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white pointer-events-none">
                  <span className="text-xl drop-shadow">{selectedBeatForModal.character.avatar}</span>
                  <span className="text-[10px] font-bold bg-amber-900/80 px-2 py-0.5 rounded-md border border-amber-400/40 backdrop-blur-xs">
                    3D Village Friend
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#381e0f] tracking-tight">
                  {language === 'en'
                    ? selectedBeatForModal.character.nameEn
                    : selectedBeatForModal.character.nameAf}
                </h3>
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  {language === 'en'
                    ? selectedBeatForModal.character.titleEn
                    : selectedBeatForModal.character.titleAf}
                </div>
              </div>

              {/* Dialogue excerpt in enlarged view */}
              <div className="bg-[#f5ebe0] rounded-xl p-3 border border-[#dfceb9] text-left space-y-1.5">
                <p className="text-xs sm:text-sm text-[#4a2b16] italic font-medium">
                  {language === 'en'
                    ? `“${selectedBeatForModal.dialogueEn}”`
                    : `“${selectedBeatForModal.dialogueAf}”`}
                </p>
                <p className="text-[11px] sm:text-xs text-[#6e4324] font-bold">
                  {language === 'en'
                    ? `Lesson: ${selectedBeatForModal.lessonEn}`
                    : `Les: ${selectedBeatForModal.lessonAf}`}
                </p>
              </div>

              <div
                className="flex items-center justify-between gap-2 pt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    handleReadBeat(selectedBeatForModal);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${
                    isSpeakingNow && activeSpeakingBeatId === selectedBeatForModal.id
                      ? 'bg-rose-500 text-white'
                      : 'bg-[#4a2b16] hover:bg-[#5f381d] text-amber-100'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isSpeakingNow && activeSpeakingBeatId === selectedBeatForModal.id
                      ? language === 'en'
                        ? 'Pause Speech'
                        : 'Pouseer'
                      : language === 'en'
                      ? 'Hear Character Speak'
                      : 'Luister na Karakter'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPieceDrop();
                    setSelectedBeatForModal(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#2a1406] font-black text-xs transition-all shadow-xs cursor-pointer"
                >
                  {language === 'en' ? 'Tap to Shrink' : 'Tik om te Verklein'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
