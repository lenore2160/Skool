/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Award, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { Language, LessonTab, Badge } from './types';
import { INITIAL_BADGES } from './data/badges';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { FrontCoverPage } from './components/FrontCoverPage';
import { CoverPage } from './components/CoverPage';
import { BirthdayStory } from './components/BirthdayStory';
import { CakePanVisualizer } from './components/CakePanVisualizer';
import { RulesExplorer } from './components/RulesExplorer';
import { SlidingPuzzle } from './components/SlidingPuzzle';
import { AdditionWizard } from './components/AdditionWizard';
import { WholeNumberExplorer } from './components/WholeNumberExplorer';
import { BakeryPractice } from './components/BakeryPractice';
import { BadgesModal } from './components/BadgesModal';
import { toggleMute, getMutedStatus, playLevelUpFanfare } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<LessonTab>('front');
  const [completedTabs, setCompletedTabs] = useState<LessonTab[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(50);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [notification, setNotification] = useState<{ message: string; icon?: string } | null>(null);

  // Scroll to top of page every time user navigates backwards or forwards to another tab/page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 20);
    return () => clearTimeout(timer);
  }, [currentTab]);

  // Load saved progress from localStorage if available
  useEffect(() => {
    try {
      const savedXp = localStorage.getItem('fraction_bakery_xp');
      if (savedXp) setXp(Number(savedXp));

      const savedBadges = localStorage.getItem('fraction_bakery_badges');
      if (savedBadges) {
        const parsed = JSON.parse(savedBadges) as Record<string, boolean>;
        setBadges((prev) =>
          prev.map((b) => ({
            ...b,
            unlocked: parsed[b.id] ?? b.unlocked,
          }))
        );
      }

      const savedTabs = localStorage.getItem('fraction_bakery_completed_tabs');
      if (savedTabs) {
        setCompletedTabs(JSON.parse(savedTabs));
      }
    } catch {
      // Ignore local storage parse errors
    }
  }, []);

  const triggerNotification = (message: string, icon = '✨') => {
    setNotification({ message, icon });
    setTimeout(() => {
      setNotification(null);
    }, 3800);
  };

  const handleAwardXp = (amount: number, reason: string) => {
    setXp((prev) => {
      const updated = prev + amount;
      try {
        localStorage.setItem('fraction_bakery_xp', updated.toString());
      } catch {
        // ignore
      }
      return updated;
    });
    triggerNotification(`+${amount} XP: ${reason}`, '⭐');
  };

  const handleUnlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const existing = prev.find((b) => b.id === badgeId);
      if (existing && existing.unlocked) return prev; // already unlocked

      const updated = prev.map((b) =>
        b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
      );

      try {
        const statusMap: Record<string, boolean> = {};
        updated.forEach((b) => {
          statusMap[b.id] = b.unlocked;
        });
        localStorage.setItem('fraction_bakery_badges', JSON.stringify(statusMap));
      } catch {
        // ignore
      }

      const target = updated.find((b) => b.id === badgeId);
      if (target) {
        triggerNotification(
          `${language === 'en' ? 'Badge Unlocked' : 'Kenteken Ontsluit'}: ${language === 'en' ? target.nameEn : target.nameAf}!`,
          target.icon
        );
        playLevelUpFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
        });
      }
      return updated;
    });
  };

  const handleCompleteLesson = (tab: LessonTab) => {
    if (!completedTabs.includes(tab)) {
      const updated = [...completedTabs, tab];
      setCompletedTabs(updated);
      try {
        localStorage.setItem('fraction_bakery_completed_tabs', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const handleToggleSound = () => {
    const muted = toggleMute();
    setIsMuted(muted);
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'af' : 'en'));
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-300 selection:text-amber-950">
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        badges={badges}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        xp={xp}
      />

      {/* Main Container - optimized for Apple screens */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
        {/* First heading: Exactly the same as on the cover page */}
        {currentTab !== 'cover' && currentTab !== 'front' && (
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
        )}

        {/* Interactive Progress Bar (shown on chapters) - kept below the first heading */}
        {currentTab !== 'cover' && currentTab !== 'front' && (
          <ProgressBar
            currentTab={currentTab}
            completedTabs={completedTabs}
            language={language}
            onSelectTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {/* Dynamic Tab Lesson Content */}
        <div>
          {currentTab === 'front' && (
            <FrontCoverPage
              language={language}
              onEnter={() => {
                setCurrentTab('cover');
              }}
            />
          )}

          {currentTab === 'cover' && (
            <CoverPage
              language={language}
              onOpenStory={() => {
                setCurrentTab('story');
              }}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
              }}
            />
          )}

          {currentTab === 'story' && (
            <BirthdayStory
              language={language}
              onContinueToBaking={() => {
                handleCompleteLesson('story');
                setCurrentTab('baking');
              }}
              onSelectTab={(tab) => setCurrentTab(tab)}
              onAwardXp={handleAwardXp}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {currentTab === 'baking' && (
            <CakePanVisualizer
              language={language}
              onPrevious={() => {
                setCurrentTab('story');
              }}
              onNext={() => {
                handleCompleteLesson('baking');
                setCurrentTab('rules');
              }}
              onCompleteLesson={() => {
                handleCompleteLesson('baking');
                setCurrentTab('rules');
              }}
              onAwardXp={handleAwardXp}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {currentTab === 'rules' && (
            <RulesExplorer
              language={language}
              onPrevious={() => {
                setCurrentTab('baking');
              }}
              onNext={() => {
                handleCompleteLesson('rules');
                setCurrentTab('puzzle');
              }}
              onCompleteLesson={() => {
                handleCompleteLesson('rules');
                setCurrentTab('puzzle');
              }}
              onAwardXp={handleAwardXp}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {currentTab === 'puzzle' && (
            <SlidingPuzzle
              language={language}
              onPrevious={() => {
                setCurrentTab('rules');
              }}
              onNext={() => {
                handleCompleteLesson('puzzle');
                setCurrentTab('addition');
              }}
              onCompleteLesson={() => {
                handleCompleteLesson('puzzle');
                setCurrentTab('addition');
              }}
              onAwardXp={handleAwardXp}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {currentTab === 'addition' && (
            <AdditionWizard
              language={language}
              onPrevious={() => {
                setCurrentTab('puzzle');
              }}
              onNext={() => {
                handleCompleteLesson('addition');
                setCurrentTab('whole');
              }}
              onCompleteLesson={() => {
                handleCompleteLesson('addition');
                setCurrentTab('whole');
              }}
              onAwardXp={handleAwardXp}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {currentTab === 'whole' && (
            <WholeNumberExplorer
              language={language}
              onPrevious={() => {
                setCurrentTab('addition');
              }}
              onNext={() => {
                handleCompleteLesson('whole');
                setCurrentTab('practice');
              }}
              onAwardXp={handleAwardXp}
              onUnlockBadge={handleUnlockBadge}
              onCompleteLesson={() => handleCompleteLesson('whole')}
            />
          )}

          {currentTab === 'practice' && (
            <BakeryPractice
              language={language}
              onPrevious={() => {
                setCurrentTab('whole');
              }}
              onTheEnd={() => {
                handleCompleteLesson('practice');
                setCurrentTab('front');
              }}
              onAwardXp={handleAwardXp}
              onUnlockBadge={handleUnlockBadge}
              onCompleteLesson={() => handleCompleteLesson('practice')}
            />
          )}
        </div>
      </main>

      {/* Floating Gamified Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-amber-900 text-amber-50 px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 select-none"
          >
            <span className="text-2xl">{notification.icon}</span>
            <span className="font-extrabold text-xs md:text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badges Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={badges}
        language={language}
      />
    </div>
  );
}
