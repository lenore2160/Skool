import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Language } from '../types';
import {
  speakTeacher,
  stopSpeech,
  subscribeToActiveSpeaker,
  subscribeToActiveRole,
  CHARACTER_PROFILES,
  CharacterRole,
} from '../utils/speech';
import { STORY_3D_ASSETS } from '../assets/storyImages';

interface VoiceNarratorButtonProps {
  text: string;
  speakerId: string;
  language: Language;
  label?: string;
  variant?: 'pill' | 'icon' | 'banner';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VoiceNarratorButton: React.FC<VoiceNarratorButtonProps> = ({
  text,
  speakerId,
  language,
  label,
  variant = 'pill',
  size = 'md',
  className = '',
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<CharacterRole | null>(null);

  useEffect(() => {
    const unsubSpeaker = subscribeToActiveSpeaker((activeId) => {
      setIsActive(activeId === speakerId);
    });
    const unsubRole = subscribeToActiveRole((role) => {
      setCurrentRole(role);
    });
    return () => {
      unsubSpeaker();
      unsubRole();
    };
  }, [speakerId]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      stopSpeech();
    } else {
      speakTeacher(text, language, speakerId);
    }
  };

  const activeProfile = currentRole ? CHARACTER_PROFILES[currentRole] : null;
  const avatarEmoji = isActive && activeProfile ? activeProfile.avatar : '👩‍🏫';

  const defaultLabel =
    label ||
    (language === 'en'
      ? isActive
        ? 'Stop Voice'
        : 'Read to Me'
      : isActive
      ? 'Stop Stem'
      : 'Lees vir My');

  if (variant === 'icon') {
    return (
      <button
        type="button"
        id={`voice-btn-${speakerId}`}
        onClick={handleClick}
        className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 border ${
          isActive
            ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 shadow-md animate-pulse'
            : 'bg-amber-100/90 hover:bg-amber-200 text-[#3b2311] border-[#d8c3ad] hover:scale-105 shadow-xs'
        } ${className}`}
        title={
          language === 'en'
            ? 'Listen to Teacher Hazel reading with character voices'
            : 'Luister hoe Juffrou Hazel met karakterstemme voorlees'
        }
        aria-label="Listen with Teacher Hazel"
      >
        {isActive ? (
          <div className="flex items-center gap-1">
            <img
              src={STORY_3D_ASSETS.teacherHazel3d}
              alt="Teacher Hazel"
              className="w-4 h-4 rounded-full object-cover border border-white"
              referrerPolicy="no-referrer"
            />
            <VolumeX className="w-3.5 h-3.5 text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <img
              src={STORY_3D_ASSETS.teacherHazel3d}
              alt="Teacher Hazel"
              className="w-4 h-4 rounded-full object-cover border border-amber-900/30"
              referrerPolicy="no-referrer"
            />
            <Volume2 className="w-3.5 h-3.5 text-amber-800" />
          </div>
        )}
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <button
        type="button"
        id={`voice-btn-${speakerId}`}
        onClick={handleClick}
        className={`w-full py-2.5 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border font-black text-xs md:text-sm ${
          isActive
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-600 shadow-md ring-2 ring-rose-200'
            : 'bg-[#faf3e8] hover:bg-[#f5ebd9] text-[#3d2412] border-[#dfceb9] hover:border-amber-400 hover:shadow-sm'
        } ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <img
            src={STORY_3D_ASSETS.teacherHazel3d}
            alt="Teacher Hazel"
            className="w-6 h-6 rounded-full object-cover border-2 border-amber-400 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <span>
            {isActive
              ? activeProfile
                ? language === 'en'
                  ? `${activeProfile.nameEn} is speaking...`
                  : `${activeProfile.nameAf} praat nou...`
                : language === 'en'
                ? 'Teacher Hazel is speaking...'
                : 'Juffrou Hazel praat nou...'
              : language === 'en'
              ? 'Listen to Teacher Hazel tell this with character voices'
              : 'Luister hoe Juffrou Hazel dit met karakterstemme vertel'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-bold">
          {isActive ? (
            <>
              <span className="text-xs tracking-tighter animate-pulse font-mono">ılı.lıllılı.</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                {language === 'en' ? 'Stop' : 'Stop'}
              </span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-800" />
              <span className="text-xs text-amber-800 underline">
                {language === 'en' ? 'Play Voice' : 'Luister'}
              </span>
            </>
          )}
        </div>
      </button>
    );
  }

  // Pill variant
  return (
    <button
      type="button"
      id={`voice-btn-${speakerId}`}
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 font-bold rounded-xl transition-all cursor-pointer shadow-sm border ${
        size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      } ${
        isActive
          ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 animate-pulse'
          : 'bg-[#faf2e6] hover:bg-[#f3e5d0] text-[#3d2412] border-[#decfbe] hover:border-amber-400'
      } ${className}`}
      title={
        language === 'en'
          ? 'Listen to Teacher Hazel read this aloud'
          : 'Luister hoe Juffrou Hazel dit hardop voorlees'
      }
    >
      <img
        src={STORY_3D_ASSETS.teacherHazel3d}
        alt="Teacher Hazel"
        className="w-4 h-4 rounded-full object-cover border border-amber-900/30"
        referrerPolicy="no-referrer"
      />
      {isActive ? (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span className="font-extrabold">{language === 'en' ? 'Stop' : 'Stop'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-amber-800" />
          <span>{defaultLabel}</span>
        </>
      )}
    </button>
  );
};
