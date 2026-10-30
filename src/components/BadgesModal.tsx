import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Badge, Language } from '../types';
import { VoiceNarratorButton } from './VoiceNarratorButton';
import { FormattedFractionText } from './Fraction';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  language: Language;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  badges,
  language,
}) => {
  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="cottage-parchment-card rounded-3xl shadow-2xl border-4 border-[#8c5a32] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#422615] to-[#28150a] text-amber-50 p-6 flex items-center justify-between border-b-4 border-[#5a361e]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center text-2xl shadow-md font-black border border-amber-300">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">
                    {language === 'en' ? 'Bakery Achievement Badges' : 'Bakkery Prestasie Kentekens'}
                  </h3>
                  <VoiceNarratorButton
                    speakerId="badges-modal-title"
                    language={language}
                    variant="icon"
                    text={
                      language === 'en'
                        ? `Bakery Achievement Badges. You have unlocked ${unlockedCount} of ${badges.length} badges!`
                        : `Bakkery Prestasie Kentekens. Jy het ${unlockedCount} van ${badges.length} kentekens ontsluit!`
                    }
                  />
                </div>
                <p className="text-xs text-amber-200">
                  {language === 'en'
                    ? `${unlockedCount} of ${badges.length} badges unlocked`
                    : `${unlockedCount} van ${badges.length} kentekens ontsluit`}
                </p>
              </div>
            </div>

            <button
              id="close-badges-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-900/60 hover:bg-amber-900 text-amber-200 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Badges Grid */}
          <div className="p-6 overflow-y-auto space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-amber-50/80 border-amber-400 shadow-sm'
                      : 'bg-stone-50 border-stone-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                      badge.unlocked
                        ? 'bg-amber-400/90 border border-amber-500'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-xs md:text-sm text-amber-950">
                          {language === 'en' ? badge.nameEn : badge.nameAf}
                        </span>
                        {badge.unlocked && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <VoiceNarratorButton
                        speakerId={`badge-info-${badge.id}`}
                        language={language}
                        variant="icon"
                        text={`${language === 'en' ? badge.nameEn : badge.nameAf}. ${badge.unlocked ? (language === 'en' ? 'Unlocked!' : 'Ontsluit!') : (language === 'en' ? 'Locked.' : 'Gesluit.')} ${language === 'en' ? badge.descriptionEn : badge.descriptionAf}`}
                      />
                    </div>
                    <div className="text-[11px] text-amber-900/80 font-medium leading-tight">
                      <FormattedFractionText
                        text={language === 'en' ? badge.descriptionEn : badge.descriptionAf}
                        size="xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-amber-50 p-4 border-t border-amber-200 flex justify-end">
            <button
              onClick={onClose}
              className="bg-amber-800 hover:bg-amber-900 text-amber-100 font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
            >
              {language === 'en' ? 'Back to Bakery' : 'Terug na Bakkery'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
