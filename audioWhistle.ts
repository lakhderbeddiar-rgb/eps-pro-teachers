/**
 * Web Audio API based Realistic Whistle & Countdown Audio Synthesizer
 * Works in all modern browsers without requiring any external audio files.
 */

class FieldAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Generates a realistic sports pea-less whistle burst (e.g. Fox 40 Classic)
   */
  public playWhistle(durationSeconds: number = 0.45, baseFreq: number = 2800) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Master gain for envelope
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.85, now + 0.04);
      masterGain.gain.setValueAtTime(0.8, now + durationSeconds - 0.06);
      masterGain.gain.linearRampToValueAtTime(0.001, now + durationSeconds);

      // Whistle tone 1: High fundamental
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      // Whistle tone 2: Close harmonic creating classic piercing trill/heterodyne beat
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq + 180, now);

      // LFO modulation for slight chaotic flutter
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(32, now); // ~32 Hz flutter
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(90, now);

      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      // Connect nodes
      osc1.connect(masterGain);
      osc2.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Start and stop
      osc1.start(now);
      osc2.start(now);
      lfo.start(now);

      osc1.stop(now + durationSeconds);
      osc2.stop(now + durationSeconds);
      lfo.stop(now + durationSeconds);
    } catch {
      // AudioContext failed or blocked before user interaction
    }
  }

  /**
   * Double whistle blow (e.g. to stop play or signal timeout)
   */
  public playDoubleWhistle() {
    this.playWhistle(0.22);
    setTimeout(() => {
      this.playWhistle(0.38);
    }, 280);
  }

  /**
   * Long whistle blow (end of match/session)
   */
  public playLongWhistle() {
    this.playWhistle(1.2);
  }

  /**
   * Short countdown beep
   */
  public playCountdownBeep(isFinal: boolean = false) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = isFinal ? 1760 : 880;
      const duration = isFinal ? 0.4 : 0.15;

      osc.type = isFinal ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // AudioContext error handling
    }
  }
}

export const fieldAudio = new FieldAudioSynthesizer();
