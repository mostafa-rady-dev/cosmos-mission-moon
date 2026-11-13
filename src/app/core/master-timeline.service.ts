import { Injectable, signal, computed } from '@angular/core';

export interface SceneRange {
  id: string;
  name: string;
  start: number; // 0.0 - 1.0
  end: number;   // 0.0 - 1.0
  index: number;
}

export const SCENE_SEGMENTS: SceneRange[] = [
  { id: 'launch', name: 'Launch Pad', start: 0.0, end: 0.12, index: 0 },
  { id: 'orbit', name: 'Atmosphere & Orbit', start: 0.12, end: 0.22, index: 1 },
  { id: 'solar-system', name: 'Relic Odyssey Flight', start: 0.22, end: 1.0, index: 2 },
];

@Injectable({
  providedIn: 'root',
})
export class MasterTimelineService {
  readonly progress = signal<number>(0);
  readonly segments = SCENE_SEGMENTS;

  /**
   * Active scene index derived strictly from scroll progress
   */
  readonly activeSceneIndex = computed<number>(() => {
    const p = this.progress();
    for (const seg of this.segments) {
      if (p >= seg.start && p <= seg.end) {
        return seg.index;
      }
    }
    return p >= 1.0 ? this.segments.length - 1 : 0;
  });

  readonly activeScene = computed<SceneRange>(() => {
    return this.segments[this.activeSceneIndex()] || this.segments[0];
  });

  /**
   * Calculates the normalized progress (0.0 to 1.0) for a specific scene segment
   */
  getSceneProgress(sceneIndex: number): number {
    const seg = this.segments[sceneIndex];
    if (!seg) return 0;
    const p = this.progress();
    if (p < seg.start) return 0;
    if (p > seg.end) return 1;
    return (p - seg.start) / (seg.end - seg.start);
  }

  /**
   * Calculates the opacity/visibility of a scene, including a smooth transition crossfade
   * window (default 3% of total scroll) at entry/exit.
   */
  getSceneVisibility(sceneIndex: number, fadeMargin = 0.02): { isVisible: boolean; opacity: number } {
    const seg = this.segments[sceneIndex];
    if (!seg) return { isVisible: false, opacity: 0 };
    const p = this.progress();

    // Out of bounds
    if (p < seg.start - fadeMargin || p > seg.end + fadeMargin) {
      return { isVisible: false, opacity: 0 };
    }

    // Inside full visibility window
    if (p >= seg.start + fadeMargin && p <= seg.end - fadeMargin) {
      return { isVisible: true, opacity: 1 };
    }

    // Crossfade in
    if (p < seg.start + fadeMargin && p >= seg.start - fadeMargin) {
      const alpha = (p - (seg.start - fadeMargin)) / (2 * fadeMargin);
      return { isVisible: true, opacity: Math.max(0, Math.min(1, alpha)) };
    }

    // Crossfade out
    if (p > seg.end - fadeMargin && p <= seg.end + fadeMargin) {
      const alpha = ((seg.end + fadeMargin) - p) / (2 * fadeMargin);
      return { isVisible: true, opacity: Math.max(0, Math.min(1, alpha)) };
    }

    return { isVisible: true, opacity: 1 };
  }

  updateProgress(p: number): void {
    const clamped = Math.max(0, Math.min(1, p));
    this.progress.set(clamped);
  }
}
