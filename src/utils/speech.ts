/**
 * Expressive Storytelling Speech Engine for Fraction Bakery
 *
 * Persona: Teacher Hazel (Juffrou Hazel)
 * - A young lady teacher (~20 years old) with a warm, soothing, melodic voice.
 * - Rich emotional prosody with animated tones of excitement and encouraging warmth.
 * - Dynamic character personification: Plays Barnaby Bear (deep, warm, jolly),
 *   Pip Penguin (high, perky, eager), Bella Bunny (sweet, bouncy),
 *   Oliver Owl (calm, wise), and Mila (ecstatic birthday girl).
 */

export type CharacterRole =
  | 'hazel_narrator'
  | 'barnaby_bear'
  | 'pip_penguin'
  | 'bella_bunny'
  | 'oliver_owl'
  | 'mila_bunny'
  | 'mia_bunny'
  | 'sammy_squirrel'
  | 'penny_penguin'
  | 'leo_lion';

export interface CharacterVoiceProfile {
  nameEn: string;
  nameAf: string;
  avatar: string;
  basePitch: number;
  baseRate: number;
  genderPref: 'female' | 'male';
  voiceKeywords: string[];
  descriptionEn: string;
  descriptionAf: string;
}

export const CHARACTER_PROFILES: Record<CharacterRole, CharacterVoiceProfile> = {
  hazel_narrator: {
    nameEn: 'Teacher Hazel',
    nameAf: 'Juffrou Hazel',
    avatar: '👩‍🏫',
    basePitch: 1.02, // Soft, warm, soothing lady teacher tone with lots of wisdom
    baseRate: 0.82, // Slower, unhurried, gentle, encouraging cadence
    genderPref: 'female',
    voiceKeywords: [
      'aria',
      'victoria',
      'serena',
      'laura',
      'saskia',
      'ellen',
      'moira',
      'karen',
      'google uk english female',
      'female',
    ],
    descriptionEn: 'Soft, soothing lady teacher tone filled with calm, patient wisdom',
    descriptionAf: 'Sagte, kalmerende onderwyseresstem gevul met rustige, wyse leiding',
  },
  barnaby_bear: {
    nameEn: 'Chef Barnaby Bear',
    nameAf: 'Sjef Barnaby Beer',
    avatar: '🐻',
    basePitch: 0.72, // Deep, soothing, comforting male resonance
    baseRate: 0.80, // Slower, unhurried, reassuring, warm fatherly baker
    genderPref: 'male',
    voiceKeywords: [
      'guy',
      'david',
      'george',
      'daniel',
      'richard',
      'mark',
      'james',
      'arthur',
      'male',
      'google uk english male',
    ],
    descriptionEn: 'Caring male voice: deep, soothing, and comforting like a warm hug',
    descriptionAf: 'Omgee manlike stem: diep, rustig en vertroostend soos ’n warm drukkie',
  },
  pip_penguin: {
    nameEn: 'Pip the Penguin',
    nameAf: 'Pip die Pikkewyn',
    avatar: '🐧',
    basePitch: 1.22, // Voice of a sweet young boy
    baseRate: 0.87, // Natural, sweet, boyish helper cadence without being rushed
    genderPref: 'male',
    voiceKeywords: [
      'ryan',
      'christopher',
      'fred',
      'alex',
      'junior',
      'boy',
      'young',
      'daniel',
      'google us english',
      'male',
    ],
    descriptionEn: 'Sweet young boy voice: gentle, sweet, and enthusiastically helpful',
    descriptionAf: 'Soet jong seunstem: sagkens, vriendelik en entoesiasties behulpsaam',
  },
  mila_bunny: {
    nameEn: 'Mila Bunny',
    nameAf: 'Mila Hasie',
    avatar: '🎂',
    basePitch: 1.38, // Sweet little 9-year-old girl voice
    baseRate: 0.86, // Sweet, natural, gentle childlike pace
    genderPref: 'female',
    voiceKeywords: [
      'ana',
      'maisie',
      'ivy',
      'chloe',
      'ava',
      'jenny',
      'samantha',
      'google us english female',
      'female',
    ],
    descriptionEn: 'Sweet little 9-year-old girl voice filled with joyful wonder',
    descriptionAf: 'Soet 9-jarige dogtertjie stemmetjie vol vreugde en verwondering',
  },
  mia_bunny: {
    nameEn: 'Mila Bunny',
    nameAf: 'Mila Hasie',
    avatar: '🎂',
    basePitch: 1.38,
    baseRate: 0.86,
    genderPref: 'female',
    voiceKeywords: [
      'ana',
      'maisie',
      'ivy',
      'chloe',
      'ava',
      'jenny',
      'samantha',
      'google us english female',
      'female',
    ],
    descriptionEn: 'Sweet little 9-year-old girl voice filled with joyful wonder',
    descriptionAf: 'Soet 9-jarige dogtertjie stemmetjie vol vreugde en verwondering',
  },
  bella_bunny: {
    nameEn: 'Bella Bunny',
    nameAf: 'Bella Hasie',
    avatar: '🐰',
    basePitch: 1.28, // Sweet young girl sister voice, warm and gentle
    baseRate: 0.85, // Slower, sweet, sisterly cadence
    genderPref: 'female',
    voiceKeywords: [
      'tessa',
      'karen',
      'moira',
      'victoria',
      'serena',
      'fleur',
      'zira',
      'samantha',
      'female',
    ],
    descriptionEn: 'Sweet little girl sister voice, warm, loving and caring',
    descriptionAf: 'Soet dogtertjie sussie stemmetjie, warm, liefdevol en omgee',
  },
  oliver_owl: {
    nameEn: 'Oliver Owl',
    nameAf: 'Oliver Uil',
    avatar: '🦉',
    basePitch: 0.84, // Measured, dignified, wise village mathematician
    baseRate: 0.79, // Slower, thoughtful professorial tempo
    genderPref: 'male',
    voiceKeywords: ['george', 'daniel', 'arthur', 'oliver', 'richard', 'male'],
    descriptionEn: 'Calm, thoughtful, dignified and wise village mathematician',
    descriptionAf: 'Kalm, bedagsame, waardige en wyse dorp wiskundige',
  },
  sammy_squirrel: {
    nameEn: 'Sammy Squirrel',
    nameAf: 'Sammy Eekhorinkie',
    avatar: '🐿️',
    basePitch: 1.32,
    baseRate: 0.90,
    genderPref: 'female',
    voiceKeywords: ['jenny', 'ava', 'female'],
    descriptionEn: 'Quick, lively, chatty woodland squirrel',
    descriptionAf: 'Vinnige, lewendige, gesellige bosveld eekhorinkie',
  },
  penny_penguin: {
    nameEn: 'Penny Penguin',
    nameAf: 'Penny Pikkewyn',
    avatar: '🐧',
    basePitch: 1.30,
    baseRate: 0.88,
    genderPref: 'female',
    voiceKeywords: ['tessa', 'samantha', 'female'],
    descriptionEn: 'Cheerful, bubbly customer penguin',
    descriptionAf: 'Vrolike, borrelende kliënt pikkewyn',
  },
  leo_lion: {
    nameEn: 'Leo the Lion Cub',
    nameAf: 'Leo die Leeu Welpie',
    avatar: '🦁',
    basePitch: 0.88,
    baseRate: 0.83,
    genderPref: 'male',
    voiceKeywords: ['daniel', 'alex', 'male'],
    descriptionEn: 'Proud, warm little lion cub',
    descriptionAf: 'Trotse, warm jong leeu welpie',
  },
};

type SpeechCallback = () => void;

interface SpeechSegment {
  text: string;
  role: CharacterRole;
  pitch: number;
  rate: number;
  volume: number;
  pauseAfterMs?: number;
}

// Global active state tracking
let activeSpeakerId: string | null = null;
let activeRole: CharacterRole | null = null;
let currentTimeoutId: number | null = null;
let playbackAbortController: { aborted: boolean } = { aborted: false };

const speakerListeners = new Set<(activeId: string | null) => void>();
const roleListeners = new Set<(role: CharacterRole | null) => void>();

function notifySpeakerListeners(id: string | null) {
  activeSpeakerId = id;
  speakerListeners.forEach((fn) => fn(id));
}

function notifyRoleListeners(role: CharacterRole | null) {
  activeRole = role;
  roleListeners.forEach((fn) => fn(role));
}

export function subscribeToActiveSpeaker(fn: (activeId: string | null) => void): () => void {
  speakerListeners.add(fn);
  fn(activeSpeakerId);
  return () => {
    speakerListeners.delete(fn);
  };
}

export function subscribeToActiveRole(fn: (role: CharacterRole | null) => void): () => void {
  roleListeners.add(fn);
  fn(activeRole);
  return () => {
    roleListeners.delete(fn);
  };
}

export function getActiveSpeakerId(): string | null {
  return activeSpeakerId;
}

export function getActiveRole(): CharacterRole | null {
  return activeRole;
}

export function stopSpeech(): void {
  playbackAbortController.aborted = true;
  if (currentTimeoutId !== null) {
    clearTimeout(currentTimeoutId);
    currentTimeoutId = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  notifySpeakerListeners(null);
  notifyRoleListeners(null);
}

/**
 * Selects the highest quality character-appropriate voice from available browser voices
 */
export function selectVoiceForCharacter(
  role: CharacterRole,
  lang: 'en' | 'af'
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const profile = CHARACTER_PROFILES[role] || CHARACTER_PROFILES.hazel_narrator;
  const maleKeywords = ['david', 'guy', 'mark', 'george', 'richard', 'daniel', 'male', 'oliver', 'arthur', 'ryan', 'alex', 'fred'];

  // Afrikaans handling
  if (lang === 'af') {
    // 1. Native Afrikaans or ZA voice
    const zaVoice = voices.find((v) => v.lang.startsWith('af') || v.lang.includes('ZA'));
    if (zaVoice) return zaVoice;

    // 2. Dutch voice (phonetics sound natural for Afrikaans)
    if (profile.genderPref === 'female') {
      const nlFemale = voices.find(
        (v) =>
          v.lang.startsWith('nl') &&
          !maleKeywords.some((m) => v.name.toLowerCase().includes(m))
      );
      if (nlFemale) return nlFemale;
    } else {
      const nlMale = voices.find(
        (v) =>
          v.lang.startsWith('nl') &&
          maleKeywords.some((m) => v.name.toLowerCase().includes(m))
      );
      if (nlMale) return nlMale;
    }

    const anyNl = voices.find((v) => v.lang.startsWith('nl'));
    if (anyNl) return anyNl;
  }

  // English voices:
  const enVoices = voices.filter((v) => v.lang.startsWith('en'));
  if (enVoices.length === 0) return voices[0] || null;

  // 1. Search for a direct match from the character's tailored voice keywords
  for (const keyword of profile.voiceKeywords) {
    const matched = enVoices.find((v) => {
      const lower = v.name.toLowerCase();
      const isMaleVoice = maleKeywords.some((m) => lower.includes(m));

      if (profile.genderPref === 'male') {
        return lower.includes(keyword) && (isMaleVoice || lower.includes('male'));
      } else {
        return lower.includes(keyword) && !isMaleVoice;
      }
    });

    if (matched) return matched;
  }

  // 2. Secondary fallback by gender preference
  if (profile.genderPref === 'male') {
    const fallbackMale = enVoices.find((v) => {
      const lower = v.name.toLowerCase();
      return maleKeywords.some((m) => lower.includes(m));
    });
    if (fallbackMale) return fallbackMale;
  } else {
    const fallbackFemale = enVoices.find((v) => {
      const lower = v.name.toLowerCase();
      return !maleKeywords.some((m) => lower.includes(m));
    });
    if (fallbackFemale) return fallbackFemale;
  }

  return enVoices[0] || voices[0] || null;
}

/**
 * Backward-compatible helper for general voice lookup
 */
function selectBestVoice(
  lang: 'en' | 'af',
  genderPref: 'female' | 'male' = 'female'
): SpeechSynthesisVoice | null {
  return selectVoiceForCharacter(genderPref === 'male' ? 'barnaby_bear' : 'hazel_narrator', lang);
}

/**
 * Normalizes text, fractions, comparisons, and pacing for crystal-clear auditory delivery
 */
function cleanTextForSpeech(raw: string, lang: 'en' | 'af'): string {
  let text = raw
    .replace(/[🍫🎂🍰🔪📜🧩➕🎯👑🌟🧁🐻🐰🐧🦉🦁🐿️👩‍🍳✨⭐🔥💡]/g, '') // remove decorative emojis
    .replace(/\s+/g, ' ')
    .trim();

  // Natural fraction expansions and comparison pronunciations
  if (lang === 'af') {
    text = text.replace(/1\/2\s*>\s*1\/4\s*>\s*1\/8\s*>\s*1\/12/g, 'een halwe is groter as een kwart, wat groter is as een agtste, wat groter is as een twaalfde');
    text = text.replace(/3D/gi, 'drie-D');
    text = text.replace(/\b1\/2\b/g, 'een halwe');
    text = text.replace(/\b1\/3\b/g, 'een derde');
    text = text.replace(/\b1\/4\b/g, 'een kwart');
    text = text.replace(/\b1\/6\b/g, 'een sesde');
    text = text.replace(/\b1\/8\b/g, 'een agtste');
    text = text.replace(/\b1\/12\b/g, 'een twaalfde');
    text = text.replace(/\b1\/16\b/g, 'een sestiende');
    text = text.replace(/(\d+)\s+(\d+)\/(\d+)/g, '$1 hele en $2 op $3');
    text = text.replace(/\b(\d+)\/(\d+)\b/g, '$1 op $2');
    text = text.replace(/\+/g, ' plus ');
    text = text.replace(/=/g, ' is gelyk aan ');
    text = text.replace(/>/g, ' is groter as ');
    text = text.replace(/</g, ' is kleiner as ');
  } else {
    text = text.replace(/1\/2\s*>\s*1\/4\s*>\s*1\/8\s*>\s*1\/12/g, 'one half is greater than one quarter, which is greater than one eighth, which is greater than one twelfth');
    text = text.replace(/3D/gi, 'three-D');
    text = text.replace(/\b1\/2\b/g, 'one half');
    text = text.replace(/\b1\/3\b/g, 'one third');
    text = text.replace(/\b1\/4\b/g, 'one quarter');
    text = text.replace(/\b1\/6\b/g, 'one sixth');
    text = text.replace(/\b1\/8\b/g, 'one eighth');
    text = text.replace(/\b1\/12\b/g, 'one twelfth');
    text = text.replace(/\b1\/16\b/g, 'one sixteenth');
    text = text.replace(/(\d+)\s+(\d+)\/(\d+)/g, '$1 whole and $2 over $3');
    text = text.replace(/\b(\d+)\/(\d+)\b/g, '$1 over $2');
    text = text.replace(/\+/g, ' plus ');
    text = text.replace(/=/g, ' equals ');
    text = text.replace(/>/g, ' is greater than ');
    text = text.replace(/</g, ' is less than ');
  }

  return text;
}

/**
 * Calculates expressive pitch and rate for an utterance based on emotional markers and character persona
 */
function tuneSegmentProsody(
  text: string,
  role: CharacterRole
): { pitch: number; rate: number; volume: number } {
  const profile = CHARACTER_PROFILES[role] || CHARACTER_PROFILES.hazel_narrator;
  let pitch = profile.basePitch;
  let rate = profile.baseRate;
  const volume = 1.0;

  const lower = text.toLowerCase();

  // Excitement marker (celebration, joy, wonder)
  const isExcited =
    text.includes('!') ||
    /\b(wow|amazing|hooray|hoera|look|kyk|enormous|reusagtig|delicious|heerlik|perfect|perfek|fantastic|fantasties|happy birthday|veels geluk|magic|magies)\b/i.test(
      lower
    );

  // Question marker (inquisitive upward melodic lilt)
  const isQuestion = text.includes('?') || /\b(notice|let op|sien jy|can you see|what happens|wat gebeur)\b/i.test(lower);

  // Soothing / wisdom narrative marker (gentle, calm, comforting, patient)
  const isSoothing = /\b(welcome|welkom|cozy|gesellig|gently|sagkens|sweet|soet|warm|breathe|love|liefde|remember|onthou|golden rule|goue reël|wisdom|wysheid)\b/i.test(
    lower
  );

  if (role === 'hazel_narrator') {
    // Teacher Hazel: soft, soothing tone with lots of wisdom
    if (isSoothing) {
      pitch -= 0.02; // Extra gentle, calm and reassuring
      rate -= 0.04; // Slower, unhurried, patient guidance
    } else if (isQuestion) {
      pitch += 0.05; // Gentle inquisitive melody
      rate -= 0.02;
    } else if (isExcited) {
      pitch += 0.06; // Warmly joyful
      rate += 0.02;
    }
  } else if (role === 'barnaby_bear') {
    // Barnaby Bear: Caring male. Deep, soothing, comforting voice that comforts you
    if (isSoothing) {
      pitch -= 0.02; // Cozy rumble
      rate -= 0.03; // Unhurried, fatherly warmth
    } else if (isExcited) {
      pitch += 0.04; // Hearty, warm chuckles
      rate += 0.02;
    }
  } else if (role === 'pip_penguin') {
    // Pip: Young boy, sweet
    if (isExcited) {
      pitch += 0.06; // Sweet boy excitement
      rate += 0.03;
    } else if (isQuestion) {
      pitch += 0.04;
      rate -= 0.02;
    }
  } else if (role === 'mila_bunny' || role === 'mia_bunny') {
    // Mila: Sweet 9-year-old girl voice
    if (isExcited) {
      pitch += 0.06; // Sweet birthday joy
      rate += 0.02;
    }
  } else if (role === 'bella_bunny') {
    // Bella: Sweet young girl sister voice
    if (isExcited) {
      pitch += 0.04;
      rate += 0.02;
    } else if (isSoothing) {
      pitch -= 0.02;
      rate -= 0.03;
    }
  } else if (role === 'oliver_owl') {
    // Oliver Owl: Calm, wise, dignified
    if (isExcited) {
      pitch += 0.03;
    }
    rate -= 0.02;
  }

  // Bound safely for Web Speech API
  pitch = Math.max(0.60, Math.min(1.65, pitch));
  rate = Math.max(0.70, Math.min(1.15, rate));

  return { pitch, rate, volume };
}

/**
 * Detects which character is speaking from character names in dialogue strings
 */
function identifyCharacter(raw: string): CharacterRole | null {
  const lower = raw.toLowerCase();

  if (
    lower.includes('barnaby bear') ||
    lower.includes('barnaby beer') ||
    lower.includes('chef barnaby') ||
    lower.includes('sjef barnaby') ||
    lower.includes('barnaby:') ||
    lower.includes('barnaby sê') ||
    lower.includes('barnaby says')
  ) {
    return 'barnaby_bear';
  }

  if (
    lower.includes('pip the penguin') ||
    lower.includes('pip die pikkewyn') ||
    lower.includes('pip penguin') ||
    lower.includes('pip:') ||
    lower.includes('pip says') ||
    lower.includes('pip sê')
  ) {
    return 'pip_penguin';
  }

  if (
    lower.includes('mila bunny') ||
    lower.includes('mila hasie') ||
    lower.includes('little mila') ||
    lower.includes('klein mila') ||
    lower.includes('mila:') ||
    lower.includes('mila says') ||
    lower.includes('mila sê')
  ) {
    return 'mila_bunny';
  }

  if (
    lower.includes('bella bunny') ||
    lower.includes('bella hasie') ||
    lower.includes('bella die konyn') ||
    lower.includes('bella:') ||
    lower.includes('bella says') ||
    lower.includes('bella sê') ||
    lower.includes('bella voeg by') ||
    lower.includes('bella adds')
  ) {
    return 'bella_bunny';
  }

  if (
    lower.includes('oliver owl') ||
    lower.includes('oliver die uil') ||
    lower.includes('oliver uil') ||
    lower.includes('professor owl') ||
    lower.includes('oliver:') ||
    lower.includes('hoot hoot') ||
    lower.includes('hoe-hoe')
  ) {
    return 'oliver_owl';
  }

  if (
    lower.includes('teacher hazel') ||
    lower.includes('juffrou hazel') ||
    lower.includes('hazel:') ||
    lower.includes('hazel says') ||
    lower.includes('hazel explains')
  ) {
    return 'hazel_narrator';
  }

  if (lower.includes('sammy squirrel') || lower.includes('sammy eekhorinkie')) {
    return 'sammy_squirrel';
  }
  if (lower.includes('penny penguin')) {
    return 'penny_penguin';
  }
  if (lower.includes('leo the lion') || lower.includes('leo die leeu')) {
    return 'leo_lion';
  }

  return null;
}

/**
 * Parses full script into sequential multi-role, multi-intonation speech segments.
 * Provides slower, natural speech with pauses and distinctive character deliveries.
 */
export function parseSpeechScript(text: string, lang: 'en' | 'af'): SpeechSegment[] {
  const cleaned = cleanTextForSpeech(text, lang);
  if (!cleaned) return [];

  const segments: SpeechSegment[] = [];

  // Pattern: [Character] says: "[Dialogue]" [Takeaway/Lesson]
  // Or: [Character] sê: "[Dialogue]" [Onthou: ...]
  const quoteMatch = cleaned.match(
    /^(.*?)(?:says|sê):?\s*[“"']([^"”']+)["”']\s*(.*)$/i
  );

  if (quoteMatch) {
    const introRaw = quoteMatch[1].trim();
    const dialogueRaw = quoteMatch[2].trim();
    const outroRaw = quoteMatch[3].trim();

    // Check character for intro
    const charRole = identifyCharacter(introRaw) || identifyCharacter(dialogueRaw) || 'hazel_narrator';

    // 1. Teacher Hazel Narrator Intro
    if (introRaw) {
      const introText = lang === 'en' ? `${introRaw} says:` : `${introRaw} sê:`;
      const prosody = tuneSegmentProsody(introText, 'hazel_narrator');
      segments.push({
        text: introText,
        role: 'hazel_narrator',
        pitch: prosody.pitch,
        rate: prosody.rate,
        volume: prosody.volume,
        pauseAfterMs: 240, // natural gentle breath before character speaks
      });
    }

    // 2. Character Speaks (personified with distinct voice/pitch/rate)
    if (dialogueRaw) {
      // Split by sentences for natural pacing and pause cadence
      const sentences = dialogueRaw.split(/(?<=[.!?])\s+/);
      for (const sent of sentences) {
        if (!sent.trim()) continue;

        // Check if a specific sub-character is tagged inside dialogue (e.g. Mila & Bella, or Oliver Owl)
        const subRole = identifyCharacter(sent) || charRole;
        const prosody = tuneSegmentProsody(sent, subRole);

        segments.push({
          text: sent.trim(),
          role: subRole,
          pitch: prosody.pitch,
          rate: prosody.rate,
          volume: prosody.volume,
          pauseAfterMs: sent.endsWith('!') ? 220 : sent.endsWith('?') ? 260 : 180, // unhurried natural pauses
        });
      }
    }

    // 3. Teacher Hazel's Lesson Wrap-up (soothing, wise guidance)
    if (outroRaw) {
      const outroProsody = tuneSegmentProsody(outroRaw, 'hazel_narrator');
      segments.push({
        text: outroRaw,
        role: 'hazel_narrator',
        pitch: outroProsody.pitch,
        rate: outroProsody.rate,
        volume: outroProsody.volume,
        pauseAfterMs: 160,
      });
    }

    return segments;
  }

  // Check if speech starts with a character name, e.g. "Chef Barnaby: ..."
  const colonMatch = cleaned.match(/^([^:]+):\s*(.+)$/);
  if (colonMatch) {
    const speakerCandidate = colonMatch[1].trim();
    const content = colonMatch[2].trim();
    const charRole = identifyCharacter(speakerCandidate);

    if (charRole) {
      // Hazel introduces
      const introText = lang === 'en' ? `${speakerCandidate}:` : `${speakerCandidate}:`;
      const introProsody = tuneSegmentProsody(introText, 'hazel_narrator');
      segments.push({
        text: introText,
        role: 'hazel_narrator',
        pitch: introProsody.pitch,
        rate: introProsody.rate,
        volume: introProsody.volume,
        pauseAfterMs: 220,
      });

      // Character delivers dialogue with unhurried phrasing
      const sentences = content.split(/(?<=[.!?])\s+/);
      for (const sent of sentences) {
        if (!sent.trim()) continue;
        const subRole = identifyCharacter(sent) || charRole;
        const prosody = tuneSegmentProsody(sent, subRole);
        segments.push({
          text: sent.trim(),
          role: subRole,
          pitch: prosody.pitch,
          rate: prosody.rate,
          volume: prosody.volume,
          pauseAfterMs: 200,
        });
      }
      return segments;
    }
  }

  // General narration/instruction (e.g. Lesson explanation, Rules, Hint)
  // Split into sentences so Hazel can deliver with soothing, unhurried wisdom
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  for (const sent of sentences) {
    const trimmed = sent.trim();
    if (!trimmed) continue;

    const charRole = identifyCharacter(trimmed) || 'hazel_narrator';
    const prosody = tuneSegmentProsody(trimmed, charRole);

    segments.push({
      text: trimmed,
      role: charRole,
      pitch: prosody.pitch,
      rate: prosody.rate,
      volume: prosody.volume,
      pauseAfterMs: trimmed.endsWith('!') ? 220 : trimmed.endsWith('?') ? 260 : 180,
    });
  }

  return segments;
}

/**
 * Sequential player that executes audio segments with precise pauses & character voices
 */
function playSegmentsSequentially(
  segments: SpeechSegment[],
  lang: 'en' | 'af',
  speakerId: string,
  abortRef: { aborted: boolean },
  onEnd?: SpeechCallback
): void {
  if (segments.length === 0 || abortRef.aborted) {
    notifySpeakerListeners(null);
    notifyRoleListeners(null);
    onEnd?.();
    return;
  }

  let currentIndex = 0;

  function playNext(): void {
    if (abortRef.aborted || currentIndex >= segments.length) {
      notifySpeakerListeners(null);
      notifyRoleListeners(null);
      onEnd?.();
      return;
    }

    const seg = segments[currentIndex];
    notifyRoleListeners(seg.role);

    try {
      const utterance = new SpeechSynthesisUtterance(seg.text);

      if (lang === 'af') {
        utterance.lang = 'af-ZA';
      } else {
        utterance.lang = 'en-US';
      }

      // Dedicated character-specific voice selection
      const voice = selectVoiceForCharacter(seg.role, lang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.pitch = seg.pitch;
      utterance.rate = seg.rate;
      utterance.volume = seg.volume;

      utterance.onend = () => {
        if (abortRef.aborted) return;
        currentIndex++;
        const pauseMs = seg.pauseAfterMs || 160;
        currentTimeoutId = window.setTimeout(playNext, pauseMs);
      };

      utterance.onerror = (e) => {
        console.warn('Speech segment error:', e);
        if (abortRef.aborted) return;
        currentIndex++;
        currentTimeoutId = window.setTimeout(playNext, 80);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech playback failure:', err);
      currentIndex++;
      playNext();
    }
  }

  playNext();
}

/**
 * Main public entry point: Teacher Hazel tells the story or reads lesson
 */
export function speakTeacher(
  text: string,
  lang: 'en' | 'af',
  speakerId: string = 'global',
  onStart?: SpeechCallback,
  onEnd?: SpeechCallback
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onStart?.();
    setTimeout(() => {
      onEnd?.();
    }, 1200);
    return;
  }

  // Toggle off if currently speaking this same block
  if (activeSpeakerId === speakerId) {
    stopSpeech();
    return;
  }

  stopSpeech();

  const segments = parseSpeechScript(text, lang);
  if (segments.length === 0) return;

  playbackAbortController = { aborted: false };
  const currentAbortRef = playbackAbortController;

  notifySpeakerListeners(speakerId);
  onStart?.();

  playSegmentsSequentially(segments, lang, speakerId, currentAbortRef, () => {
    notifySpeakerListeners(null);
    notifyRoleListeners(null);
    onEnd?.();
  });
}

/**
 * Preview / test sample for a specific character role.
 * Showcases each character's unique voice, comforting depth, or sweet childlike delivery.
 */
export function speakCharacterPreview(
  role: CharacterRole,
  lang: 'en' | 'af',
  onEnd?: SpeechCallback
): void {
  const profile = CHARACTER_PROFILES[role] || CHARACTER_PROFILES.hazel_narrator;
  let text = '';

  if (role === 'hazel_narrator') {
    text =
      lang === 'en'
        ? "Welcome, little bakers. I'm Teacher Hazel. Let us learn with calm, gentle patience. Remember our golden rule of wisdom: the bottom number simply counts the equal slices, while the top number tells us how many slices you get."
        : "Welkom, klein bakkers. Ek is Juffrou Hazel. Kom ons leer met rustige, sagte geduld. Onthou ons goue reël van wysheid: die onderste getal tel bloot die gelyke stukkies, en die boonste getal tel hoeveel stukkies jy kry.";
  } else if (role === 'barnaby_bear') {
    text =
      lang === 'en'
        ? "Hello my dear friend. I'm Chef Barnaby Bear. Take a deep, cozy breath, and smell that sweet cinnamon and warm vanilla cake baking in the oven. Everything is going to be just fine, and baking fractions is as simple as sharing with care."
        : "Hallo my liewe maat. Ek is Sjef Barnaby Beer. Haal diep en rustig asem, en ruik die soet kaneel en warm vanieljekoek in die oond. Alles gaan perfek wees, en breuke bak is so eenvoudig soos om met sorg te deel.";
  } else if (role === 'pip_penguin') {
    text =
      lang === 'en'
        ? "Hi there! I'm Pip the Penguin! I'm Chef Barnaby's helper! I'm a young boy who loves sweet cakes, and slicing pans into equal pieces is so much fun! What slice shall we make next?"
        : "Hallo daar! Ek is Pip die Pikkewyn! Ek is Sjef Barnaby se bakkeryhulp! Ek is 'n jong seun wat mal is oor soet koeke, en om panne in gelyke stukkies te sny is so lekker! Watter stukkie maak ons volgende?";
  } else if (role === 'mila_bunny' || role === 'mia_bunny') {
    text =
      lang === 'en'
        ? "Hooray! I'm Mila Bunny, and I'm turning ten years old today! Thank you so, so much for baking my beautiful birthday cake with me! I can't wait to share it with all our friends!"
        : "Hoera! Ek is Mila Hasie, en ek word vandag tien jaar oud! Baie, baie dankie dat julle my pragtige verjaardagkoek saam met my bak! Ek kan nie wag om dit met al ons maats te deel nie!";
  } else if (role === 'bella_bunny') {
    text =
      lang === 'en'
        ? "Hello everybody! I'm Bella Bunny, Mila's big sister. Whenever more friends hop over to our cottage table, we cut the cake into smaller, sweet slices so everyone gets a delicious treat!"
        : "Hallo almal! Ek is Bella Hasie, Mila se groot sussie. Wanneer meer maats na ons kothuistafel toe kom, sny ons die koek in kleiner, soet stukkies sodat elkeen 'n heerlike hap kry!";
  } else if (role === 'oliver_owl') {
    text =
      lang === 'en'
        ? "Hoot hoot! I am Oliver Owl. Always remember our golden rule: the bigger the bottom number, the smaller each slice becomes!"
        : "Hoe-hoe! Ek is Oliver Uil. Onthou altyd ons goue reël: hoe groter die onderste getal, hoe kleiner word elke stukkie!";
  } else {
    text = lang === 'en' ? `Hello from ${profile.nameEn}!` : `Hallo van ${profile.nameAf}!`;
  }

  speakTeacher(text, lang, `preview-${role}`, undefined, onEnd);
}

// Ensure voices are populated when browser initializes
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    selectVoiceForCharacter('hazel_narrator', 'en');
    selectVoiceForCharacter('barnaby_bear', 'en');
  };
}

// Backward compatibility helper
export function speakText(
  text: string,
  lang: 'en' | 'af',
  onStart?: () => void,
  onEnd?: () => void
): void {
  speakTeacher(text, lang, 'legacy', onStart, onEnd);
}

export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking || activeSpeakerId !== null;
  }
  return false;
}
