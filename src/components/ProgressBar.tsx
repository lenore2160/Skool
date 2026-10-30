import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Language, LessonTab } from '../types';
import { playSliceClick } from '../utils/audio';

interface ProgressBarProps {
  currentTab: LessonTab;
  completedTabs: LessonTab[];
  language: Language;
  onSelectTab: (tab: LessonTab) => void;
}

interface JourneyStep {
  id: LessonTab;
  labelEn: string;
  labelAf: string;
  titleEn: string;
  titleAf: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTab,
  completedTabs,
  language,
  onSelectTab,
}) => {
  const steps: JourneyStep[] = [
    {
      id: 'cover',
      labelEn: 'Home',
      labelAf: 'Tuis',
      titleEn: 'Table of Contents',
      titleAf: 'Inhoudsopgawe',
    },
    {
      id: 'story',
      labelEn: 'Chapter 1',
      labelAf: 'Hoofstuk 1',
      titleEn: 'Birthday Story',
      titleAf: 'Verjaardag Storie',
    },
    {
      id: 'baking',
      labelEn: 'Chapter 2',
      labelAf: 'Hoofstuk 2',
      titleEn: 'The Oven Cake Pan',
      titleAf: 'Die Oond Koekpan',
    },
    {
      id: 'rules',
      labelEn: 'Chapter 3',
      labelAf: 'Hoofstuk 3',
      titleEn: 'The 4 Golden Rules',
      titleAf: 'Die 4 Goue Reëls',
    },
    {
      id: 'puzzle',
      labelEn: 'Chapter 4',
      labelAf: 'Hoofstuk 4',
      titleEn: 'Sliding Cake Puzzles',
      titleAf: 'Skuif-Koekpan Legkaarte',
    },
    {
      id: 'addition',
      labelEn: 'Chapter 5',
      labelAf: 'Hoofstuk 5',
      titleEn: 'Step-by-Step Addition',
      titleAf: 'Stap-vir-Stap Optel',
    },
    {
      id: 'whole',
      labelEn: 'Chapter 6',
      labelAf: 'Hoofstuk 6',
      titleEn: 'Find the Whole Number',
      titleAf: 'Vind die Heelgetal',
    },
    {
      id: 'practice',
      labelEn: 'Chapter 7',
      labelAf: 'Hoofstuk 7',
      titleEn: 'Bakery Customer Rush',
      titleAf: 'Bakkery Kliënte Toets',
    },
  ];

  const handleStepClick = (tab: LessonTab) => {
    playSliceClick();
    onSelectTab(tab);
  };

  return (
    <div className="cottage-parchment-card rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-md border-2 border-[#dfceb9]">
      {/* 8 Interactive Chapter & Home Navigation Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((step) => {
          const isDone = completedTabs.includes(step.id);
          const isCurrent = currentTab === step.id;

          return (
            <button
              key={step.id}
              type="button"
              id={`journey-chapter-${step.id}`}
              onClick={() => handleStepClick(step.id)}
              className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border-2 flex flex-col justify-between bg-amber-100/90 hover:bg-amber-200/80 text-[#381e0f] ${
                isCurrent
                  ? 'border-amber-500 ring-2 ring-amber-400 shadow-md scale-[1.02]'
                  : isDone
                  ? 'border-amber-300 shadow-xs'
                  : 'border-amber-300/80 shadow-xs'
              }`}
            >
              {/* Top Row: Label (Home / Chapter #) & Status Tick */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 truncate">
                  {language === 'en' ? step.labelEn : step.labelAf}
                </span>

                {isCurrent ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-900 fill-amber-300 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-amber-600/40 shrink-0" />
                )}
              </div>

              {/* Bottom Row: Bold Title (Table of Contents / Chapter Title) */}
              <div className="font-black text-xs leading-snug text-[#381e0f] truncate">
                {language === 'en' ? step.titleEn : step.titleAf}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
