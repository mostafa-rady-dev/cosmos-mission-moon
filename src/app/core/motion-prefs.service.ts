import { Injectable, signal, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MotionPrefsService implements OnDestroy {
  readonly prefersReducedMotion = signal<boolean>(false);
  private mediaQuery: MediaQueryList | null = null;
  private changeListener: ((e: MediaQueryListEvent) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion.set(this.mediaQuery.matches);

      this.changeListener = (e: MediaQueryListEvent) => {
        this.prefersReducedMotion.set(e.matches);
      };

      this.mediaQuery.addEventListener('change', this.changeListener);
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.changeListener) {
      this.mediaQuery.removeEventListener('change', this.changeListener);
      this.changeListener = null;
      this.mediaQuery = null;
    }
  }
}
