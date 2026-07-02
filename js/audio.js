/* ============================================================
   THE LAST ARCHIVE — Audio Engine (Web Audio API)
   ============================================================ */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientDrone = null;
    this.ambientGain = null;
    this.masterGain = null;
    this.initialized = false;
  }

  /**
   * Initialize audio context. Must be called from a user gesture.
   */
  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
    }
  }

  /**
   * Start ambient deep space drone.
   */
  startAmbient() {
    if (!this.initialized || this.ambientDrone) return;

    const ctx = this.ctx;
    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0.08;
    this.ambientGain.connect(this.masterGain);

    // Layer 1: Deep sub-bass (40Hz)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 40;
    const gain1 = ctx.createGain();
    gain1.gain.value = 0.5;
    osc1.connect(gain1);
    gain1.connect(this.ambientGain);
    osc1.start();

    // Layer 2: Low harmonic (80Hz) — subtle
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 80;
    const gain2 = ctx.createGain();
    gain2.gain.value = 0.2;
    osc2.connect(gain2);
    gain2.connect(this.ambientGain);
    osc2.start();

    // Layer 3: Upper harmonic with slow modulation (160Hz)
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 160;
    const lfo3 = ctx.createOscillator();
    lfo3.frequency.value = 0.1;
    const lfoGain3 = ctx.createGain();
    lfoGain3.gain.value = 10;
    lfo3.connect(lfoGain3);
    lfoGain3.connect(osc3.frequency);
    lfo3.start();
    const gain3 = ctx.createGain();
    gain3.gain.value = 0.08;
    osc3.connect(gain3);
    gain3.connect(this.ambientGain);
    osc3.start();

    // Layer 4: Very slow pulsating bass (20-30Hz)
    const osc4 = ctx.createOscillator();
    osc4.type = 'sine';
    osc4.frequency.value = 25;
    const lfo4 = ctx.createOscillator();
    lfo4.frequency.value = 0.05;
    const lfoGain4 = ctx.createGain();
    lfoGain4.gain.value = 3;
    lfo4.connect(lfoGain4);
    lfoGain4.connect(osc4.frequency);
    lfo4.start();
    const gain4 = ctx.createGain();
    gain4.gain.value = 0.3;
    osc4.connect(gain4);
    gain4.connect(this.ambientGain);
    osc4.start();

    // Store references
    this.ambientDrone = { osc1, osc2, osc3, osc4, lfo3, lfo4, gain1, gain2, gain3, gain4 };
  }

  /**
   * Stop ambient drone with fade out.
   */
  stopAmbient() {
    if (!this.ambientDrone) return;
    const fadeTime = 2;
    this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeTime);
    setTimeout(() => {
      Object.values(this.ambientDrone).forEach(node => {
        if (node && node.stop) {
          try { node.stop(); } catch (e) { /* already stopped */ }
        }
      });
      this.ambientDrone = null;
      this.ambientGain = null;
    }, fadeTime * 1000 + 100);
  }

  /**
   * Play a deep impact sound (button press, activation).
   */
  playImpact() {
    if (!this.initialized) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Sub-bass hit
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.5);

    // Mid impact
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(200, now);
    osc2.frequency.exponentialRampToValueAtTime(60, now + 0.3);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.3, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(now);
    osc2.stop(now + 0.35);
  }

  /**
   * Play energy whoosh (transitions).
   */
  playWhoosh(duration = 0.8) {
    if (!this.initialized) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Create noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter for whoosh character
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(100, now + duration);
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + duration * 0.15);
    gain.gain.linearRampToValueAtTime(0.25, now + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + duration + 0.1);
  }

  /**
   * Play energy pulse (hover / light interaction).
   */
  playPulse() {
    if (!this.initialized) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Play crystal chime (completion, success).
   */
  playChime() {
    if (!this.initialized) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      const startTime = now + i * 0.12;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.9);
    });
  }

  /**
   * Play portal activation sound.
   */
  playPortal() {
    if (!this.initialized) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Rising tone
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 1.5);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3000, now + 1.5);
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2);

    // Sub rumble
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(25, now);
    osc2.frequency.linearRampToValueAtTime(35, now + 1.5);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.4, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 2);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(now);
    osc2.stop(now + 2);
  }

  /**
   * Mute all audio.
   */
  mute() {
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
  }

  /**
   * Unmute audio.
   */
  unmute() {
    if (this.masterGain) {
      this.masterGain.gain.value = 0.3;
    }
  }
}

// Global audio engine instance
const audio = new AudioEngine();
