import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MotionPrefsService {
  readonly prefersReducedMotion = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion.set(mediaQuery.matches);

      mediaQuery.addEventListener('change', (e) => {
        this.prefersReducedMotion.set(e.matches);
      });
    }
  }
}
