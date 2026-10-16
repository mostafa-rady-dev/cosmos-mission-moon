import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  readonly isMuted = signal<boolean>(true);
  private audioCtx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private isAmbientPlaying = false;

  constructor() {}

  private initContext(): void {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute(): void {
    const nextState = !this.isMuted();
    this.isMuted.set(nextState);

    if (!nextState) {
      this.initContext();
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted.set(muted);
    if (!muted) {
      this.initContext();
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
  }

  /**
   * Generates a deep, soothing cosmic space drone (synthesized)
   */
  private startAmbientDrone(): void {
    if (this.isMuted() || !this.audioCtx || this.isAmbientPlaying) return;

    try {
      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 3);
      this.ambientGain.connect(this.audioCtx.destination);

      // Sub bass harmonic
      this.ambientOsc1 = this.audioCtx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, this.audioCtx.currentTime); // A1 note

      // Gentle mid overtone
      this.ambientOsc2 = this.audioCtx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(110, this.audioCtx.currentTime); // A2 note

      this.ambientOsc1.connect(this.ambientGain);
      this.ambientOsc2.connect(this.ambientGain);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isAmbientPlaying = true;
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  private stopAmbientDrone(): void {
    if (!this.audioCtx || !this.isAmbientPlaying) return;
    try {
      if (this.ambientGain) {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.audioCtx.currentTime);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);
      }
      setTimeout(() => {
        this.ambientOsc1?.stop();
        this.ambientOsc2?.stop();
        this.ambientOsc1?.disconnect();
        this.ambientOsc2?.disconnect();
        this.ambientGain?.disconnect();
        this.isAmbientPlaying = false;
      }, 550);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  /**
   * Ducks the ambient background audio when video is playing
   */
  duckAmbient(duck: boolean): void {
    if (!this.audioCtx || !this.ambientGain || this.isMuted()) return;
    const targetGain = duck ? 0.01 : 0.08;
    this.ambientGain.gain.cancelScheduledValues(this.audioCtx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(targetGain, this.audioCtx.currentTime + 0.4);
  }

  /**
   * Short telemetry futuristic beep
   */
  playBeep(freq = 880, duration = 0.08): void {
    if (this.isMuted()) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio policy safe
    }
  }

  /**
   * Rocket ignition and rumble synthesizer
   */
  playThrusterRumble(duration = 4): void {
    if (this.isMuted()) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const bufferSize = this.audioCtx.sampleRate * duration;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brownian/pink noise for deep rocket roar
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 1.8;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(380, this.audioCtx.currentTime + duration * 0.7);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.audioCtx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
      noise.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Safe fallback
    }
  }
}
