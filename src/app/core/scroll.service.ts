import { Injectable, signal, NgZone, inject } from '@angular/core';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private lenis: Lenis | null = null;
  private tickerFn: ((time: number) => void) | null = null;

  readonly scrollY = signal<number>(0);
  readonly scrollProgress = signal<number>(0);
  readonly isLocked = signal<boolean>(false);

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Connect Lenis to ScrollTrigger
    this.lenis.on('scroll', (e: { scroll: number; progress: number }) => {
      ScrollTrigger.update();
      this.scrollY.set(e.scroll);
      this.scrollProgress.set(e.progress);
    });

    // Connect GSAP ticker to Lenis
    this.tickerFn = (time: number) => {
      this.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(this.tickerFn);
    gsap.ticker.lagSmoothing(0);
  }

  scrollTo(target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean; duration?: number }): void {
    this.lenis?.scrollTo(target, {
      offset: options?.offset ?? 0,
      immediate: options?.immediate ?? false,
      duration: options?.duration ?? 1.5,
    });
  }

  lockScroll(): void {
    this.isLocked.set(true);
    this.lenis?.stop();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  unlockScroll(): void {
    this.isLocked.set(false);
    this.lenis?.start();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  destroy(): void {
    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
    }
    this.lenis?.destroy();
    this.lenis = null;
  }
}
