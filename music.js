// Generative chillout / lo-fi music using the Web Audio API. Loops endlessly.
class LofiMusic {
  constructor() {
    this.ctx = null;
    this.playing = false;
    this.volume = 0.5;
    this.bpm = 72;
    this.step = 0;
    this.nextTime = 0;
    this.timer = null;
    // Chord loop (MIDI notes): Fmaj7, Em7, Dm7, Cmaj7 style progression in C
    this.chords = [
      [53, 57, 60, 64], // Fmaj7
      [52, 55, 59, 62], // Em7
      [50, 53, 57, 60], // Dm7
      [48, 52, 55, 59], // Cmaj7
    ];
  }

  _init() {
    const ctx = (this.ctx = new (window.AudioContext || window.webkitAudioContext)());
    this.master = ctx.createGain();
    this.master.gain.value = this.volume;
    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 1800;
    // simple feedback delay for space
    this.delay = ctx.createDelay(1);
    this.delay.delayTime.value = 60 / this.bpm * 0.75;
    const fb = ctx.createGain(); fb.gain.value = 0.3;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    this.delay.connect(fb); fb.connect(this.delay);
    this.filter.connect(this.master);
    this.filter.connect(this.delay); this.delay.connect(wet); wet.connect(this.master);
    this.master.connect(ctx.destination);
    this._crackle();
  }

  _crackle() {
    const ctx = this.ctx;
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() < 0.0008 ? (Math.random() * 2 - 1) * 0.6 : (Math.random() * 2 - 1) * 0.004;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const g = ctx.createGain(); g.gain.value = 0.25;
    src.connect(g); g.connect(this.master); src.start();
  }

  _mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  _tone(midi, time, dur, type, gain, dest) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = this._mtof(midi);
    o.detune.value = (Math.random() - 0.5) * 12; // gentle wobble
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g); g.connect(dest || this.filter);
    o.start(time); o.stop(time + dur + 0.05);
  }

  _noise(time, dur, gain, freq) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(); s.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    s.connect(hp); hp.connect(g); g.connect(this.filter);
    s.start(time);
  }

  _kick(time) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(120, time);
    o.frequency.exponentialRampToValueAtTime(40, time + 0.15);
    g.gain.setValueAtTime(0.5, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
    o.connect(g); g.connect(this.filter);
    o.start(time); o.stop(time + 0.35);
  }

  // one 8th-note step; 8 steps per bar, 4 bars per loop
  _schedule(step, time) {
    const beat = 60 / this.bpm;
    const bar = Math.floor(step / 8) % 4;
    const s = step % 8;
    const chord = this.chords[bar];
    const sw = s % 2 ? beat * 0.06 : 0; // swing
    const t = time + sw;

    if (s === 0) {
      chord.forEach((n, i) => this._tone(n + 12, t + i * 0.02, beat * 3.6, 'triangle', 0.09));
      this._tone(chord[0] - 12, t, beat * 1.8, 'sine', 0.3);
    }
    if (s === 5) this._tone(chord[0] - 12, t, beat * 1.2, 'sine', 0.22);
    if (s === 0 || s === 5) this._kick(t);
    if (s === 4) this._noise(t, 0.18, 0.25, 1500); // snare-ish
    if (s % 2 === 1) this._noise(t, 0.05, 0.08, 7000); // hat

    // sparse melody from chord tones (pentatonic-ish)
    if ((s === 2 || s === 6 || s === 7) && Math.random() < 0.55) {
      const n = chord[Math.floor(Math.random() * chord.length)] + 24;
      this._tone(n, t, beat * 1.2, 'sine', 0.09);
    }
  }

  _tick() {
    const eighth = 60 / this.bpm / 2;
    while (this.nextTime < this.ctx.currentTime + 0.2) {
      this._schedule(this.step, this.nextTime);
      this.nextTime += eighth;
      this.step = (this.step + 1) % 32; // endless loop
    }
  }

  async play() {
    if (!this.ctx) this._init();
    await this.ctx.resume();
    if (!this.playing) {
      this.playing = true;
      this.nextTime = this.ctx.currentTime + 0.1;
      this.timer = setInterval(() => this._tick(), 50);
    }
  }

  pause() {
    this.playing = false;
    clearInterval(this.timer);
    if (this.ctx) this.ctx.suspend();
  }

  setVolume(v) {
    this.volume = Number(v);
    if (this.master) this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
  }
}
