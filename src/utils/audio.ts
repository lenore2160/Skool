// Web Audio API Sound Synthesizer for gamified kids feedback

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getMutedStatus(): boolean {
  return isMuted;
}

export function playSliceClick(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(420, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.09);
}

export function playPieceDrop(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(260, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.22, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.13);
}

export function playSuccessChime(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.07);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.07 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.07);
    osc.stop(ctx.currentTime + idx * 0.07 + 0.36);
  });
}

export function playOvenBakeDing(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Nice warm bakery bell sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime); // A5

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.76);
}

export function playLevelUpFanfare(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const melody = [
    { freq: 440, time: 0, dur: 0.12 },
    { freq: 554.37, time: 0.12, dur: 0.12 },
    { freq: 659.25, time: 0.24, dur: 0.15 },
    { freq: 880, time: 0.4, dur: 0.45 },
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

    gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + note.time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + note.time + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + note.time);
    osc.stop(ctx.currentTime + note.time + note.dur + 0.05);
  });
}
