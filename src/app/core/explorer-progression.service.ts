import { Injectable, signal, computed, inject } from '@angular/core';
import { AudioService } from './audio.service';

export interface Achievement {
  id: string;
  icon: string;
  titleKey: 'achFirstLaunchTitle' | 'achMoonWalkerTitle' | 'achPlanetaryObserverTitle' | 'achMissionSpecialistTitle' | 'achDeepSpaceExplorerTitle';
  descKey: 'achFirstLaunchDesc' | 'achMoonWalkerDesc' | 'achPlanetaryObserverDesc' | 'achMissionSpecialistDesc' | 'achDeepSpaceExplorerDesc';
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  maxProgress: number;
}

export interface StoredProgressionV1 {
  version: 1;
  xp: number;
  missionStatuses: Record<string, 'available' | 'in-progress' | 'completed'>;
  unlockedAchievements: Record<string, string>; // id -> ISO timestamp
  recordedMilestones: Record<string, boolean>;  // milestoneId -> boolean (idempotency guard)
  completedHistory: Array<{
    missionId: string;
    completedAt: string;
    xpEarned: number;
  }>;
}

const STORAGE_KEY = 'COSMOS_PROGRESSION_V1';

export interface ExplorerRankInfo {
  level: number;
  titleKey: 'rankCadet' | 'rankOrbital' | 'rankCommander' | 'rankPioneer' | 'rankAdmiral';
  minXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExplorerProgressionService {
  private readonly audio = inject(AudioService);

  readonly totalXp = signal<number>(0);
  readonly missionStatuses = signal<Record<string, 'available' | 'in-progress' | 'completed'>>({});
  readonly recordedMilestones = signal<Record<string, boolean>>({});
  readonly completedHistory = signal<Array<{ missionId: string; completedAt: string; xpEarned: number }>>([]);
  readonly activeUnlockToast = signal<Achievement | null>(null);

  // Default achievements blueprint
  readonly achievements = signal<Achievement[]>([
    {
      id: 'first-launch',
      icon: '🚀',
      titleKey: 'achFirstLaunchTitle',
      descKey: 'achFirstLaunchDesc',
      xpReward: 200,
      isUnlocked: false,
      unlockedAt: null,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'planetary-observer',
      icon: '🪐',
      titleKey: 'achPlanetaryObserverTitle',
      descKey: 'achPlanetaryObserverDesc',
      xpReward: 300,
      isUnlocked: false,
      unlockedAt: null,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'moon-walker',
      icon: '🌕',
      titleKey: 'achMoonWalkerTitle',
      descKey: 'achMoonWalkerDesc',
      xpReward: 400,
      isUnlocked: false,
      unlockedAt: null,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'mission-specialist',
      icon: '⭐',
      titleKey: 'achMissionSpecialistTitle',
      descKey: 'achMissionSpecialistDesc',
      xpReward: 600,
      isUnlocked: false,
      unlockedAt: null,
      progress: 0,
      maxProgress: 3
    },
    {
      id: 'deep-space-explorer',
      icon: '✨',
      titleKey: 'achDeepSpaceExplorerTitle',
      descKey: 'achDeepSpaceExplorerDesc',
      xpReward: 1000,
      isUnlocked: false,
      unlockedAt: null,
      progress: 0,
      maxProgress: 6
    }
  ]);

  // Rank / Level computation
  readonly currentRank = computed<ExplorerRankInfo>(() => {
    const xp = this.totalXp();
    if (xp < 500) {
      return {
        level: 1,
        titleKey: 'rankCadet',
        minXp: 0,
        nextLevelXp: 500,
        progressPercent: Math.min(100, Math.max(0, (xp / 500) * 100))
      };
    } else if (xp < 1200) {
      return {
        level: 2,
        titleKey: 'rankOrbital',
        minXp: 500,
        nextLevelXp: 1200,
        progressPercent: Math.min(100, Math.max(0, ((xp - 500) / 700) * 100))
      };
    } else if (xp < 2200) {
      return {
        level: 3,
        titleKey: 'rankCommander',
        minXp: 1200,
        nextLevelXp: 2200,
        progressPercent: Math.min(100, Math.max(0, ((xp - 1200) / 1000) * 100))
      };
    } else if (xp < 3500) {
      return {
        level: 4,
        titleKey: 'rankPioneer',
        minXp: 2200,
        nextLevelXp: 3500,
        progressPercent: Math.min(100, Math.max(0, ((xp - 2200) / 1300) * 100))
      };
    } else {
      return {
        level: 5,
        titleKey: 'rankAdmiral',
        minXp: 3500,
        nextLevelXp: 3500,
        progressPercent: 100
      };
    }
  });

  readonly completedMissionsCount = computed(() => {
    const statuses = this.missionStatuses();
    return Object.values(statuses).filter(s => s === 'completed').length;
  });

  readonly unlockedAchievementsCount = computed(() => {
    return this.achievements().filter(a => a.isUnlocked).length;
  });

  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.loadFromStorage();
  }

  getMissionStatus(missionId: string): 'available' | 'in-progress' | 'completed' {
    return this.missionStatuses()[missionId] || 'available';
  }

  setMissionInProgress(missionId: string): void {
    if (!missionId) return;
    const current = this.getMissionStatus(missionId);
    // Never revert a completed mission back to in-progress
    if (current === 'completed' || current === 'in-progress') return;

    this.missionStatuses.update(prev => ({
      ...prev,
      [missionId]: 'in-progress'
    }));
    this.saveToStorage();
  }

  completeMission(missionId: string): void {
    if (!missionId) return;
    const current = this.getMissionStatus(missionId);
    // Idempotent guard: never award completion XP twice
    if (current === 'completed') return;

    // Check if already in history
    if (this.completedHistory().some(h => h.missionId === missionId)) return;

    const xpEarned = 500;
    const nowIso = new Date().toISOString();

    this.missionStatuses.update(prev => ({
      ...prev,
      [missionId]: 'completed'
    }));

    this.completedHistory.update(prev => [
      { missionId, completedAt: nowIso, xpEarned },
      ...prev
    ]);

    this.addXp(xpEarned);

    // Update mission-dependent achievements accurately
    const completedCount = this.completedMissionsCount();

    // Mission Specialist (3 missions)
    this.updateAchievementProgress('mission-specialist', completedCount);
    if (completedCount >= 3) {
      this.unlockAchievement('mission-specialist');
    }

    // Deep Space Explorer (6 missions)
    this.updateAchievementProgress('deep-space-explorer', completedCount);
    if (completedCount >= 6) {
      this.unlockAchievement('deep-space-explorer');
    }

    this.saveToStorage();
  }

  recordLaunch(): void {
    if (this.recordedMilestones()['launch']) return;
    this.recordedMilestones.update(m => ({ ...m, launch: true }));
    this.addXp(100);
    this.unlockAchievement('first-launch');
  }

  recordPlanetaryVisit(): void {
    if (this.recordedMilestones()['planetary-visit']) return;
    this.recordedMilestones.update(m => ({ ...m, 'planetary-visit': true }));
    this.addXp(100);
    this.unlockAchievement('planetary-observer');
  }

  recordLunarTouchdown(): void {
    if (this.recordedMilestones()['lunar-touchdown']) return;
    this.recordedMilestones.update(m => ({ ...m, 'lunar-touchdown': true }));
    this.addXp(150);
    this.unlockAchievement('moon-walker');
  }

  addXp(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return;
    this.totalXp.update(x => x + amount);
    this.saveToStorage();
  }

  unlockAchievement(id: string): void {
    const current = this.achievements().find(a => a.id === id);
    // Idempotent guard: if already unlocked, do nothing
    if (!current || current.isUnlocked) return;

    const nowFormatted = new Date().toISOString().slice(0, 10);

    this.achievements.update(list =>
      list.map(a => {
        if (a.id === id) {
          return {
            ...a,
            isUnlocked: true,
            unlockedAt: nowFormatted,
            progress: a.maxProgress
          };
        }
        return a;
      })
    );

    this.addXp(current.xpReward);
    this.showUnlockToast(current);
    this.saveToStorage();
  }

  updateAchievementProgress(id: string, progress: number): void {
    this.achievements.update(list =>
      list.map(a => {
        if (a.id === id && !a.isUnlocked) {
          return {
            ...a,
            progress: Math.min(a.maxProgress, Math.max(0, progress))
          };
        }
        return a;
      })
    );
  }

  dismissToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.activeUnlockToast.set(null);
  }

  private showUnlockToast(ach: Achievement): void {
    this.dismissToast();
    this.activeUnlockToast.set(ach);
    this.audio.playBeep(1400, 0.15);

    this.toastTimeout = setTimeout(() => {
      this.activeUnlockToast.set(null);
      this.toastTimeout = null;
    }, 4500);
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data: Partial<StoredProgressionV1> = JSON.parse(raw);
      if (data && data.version === 1) {
        // Validate & sanitize XP
        if (typeof data.xp === 'number' && Number.isFinite(data.xp) && data.xp >= 0) {
          this.totalXp.set(data.xp);
        }

        // Validate mission statuses
        if (data.missionStatuses && typeof data.missionStatuses === 'object') {
          const validatedStatuses: Record<string, 'available' | 'in-progress' | 'completed'> = {};
          const allowedStatuses = new Set(['available', 'in-progress', 'completed']);
          for (const [key, val] of Object.entries(data.missionStatuses)) {
            if (typeof key === 'string' && allowedStatuses.has(val as string)) {
              validatedStatuses[key] = val as 'available' | 'in-progress' | 'completed';
            }
          }
          this.missionStatuses.set(validatedStatuses);
        }

        // Validate recorded milestones
        if (data.recordedMilestones && typeof data.recordedMilestones === 'object') {
          this.recordedMilestones.set(data.recordedMilestones);
        }

        // Validate completed history
        if (Array.isArray(data.completedHistory)) {
          const validHistory = data.completedHistory.filter(
            h => h && typeof h.missionId === 'string' && typeof h.xpEarned === 'number'
          );
          this.completedHistory.set(validHistory);
        }

        // Sync achievements state
        const unlockedMap = data.unlockedAchievements || {};
        const completedCount = this.completedMissionsCount();

        this.achievements.update(list =>
          list.map(a => {
            const unlockDate = unlockedMap[a.id];
            const isUnlocked = !!unlockDate;

            let progress = a.progress;
            if (a.id === 'mission-specialist') {
              progress = isUnlocked ? a.maxProgress : Math.min(a.maxProgress, completedCount);
            } else if (a.id === 'deep-space-explorer') {
              progress = isUnlocked ? a.maxProgress : Math.min(a.maxProgress, completedCount);
            } else if (isUnlocked) {
              progress = a.maxProgress;
            }

            return {
              ...a,
              isUnlocked,
              unlockedAt: unlockDate || null,
              progress
            };
          })
        );
      }
    } catch (err) {
      console.warn('[COSMOS] Could not restore progression data, initializing fresh defaults.', err);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const unlockedMap: Record<string, string> = {};
      this.achievements().forEach(a => {
        if (a.isUnlocked && a.unlockedAt) {
          unlockedMap[a.id] = a.unlockedAt;
        }
      });

      const payload: StoredProgressionV1 = {
        version: 1,
        xp: this.totalXp(),
        missionStatuses: this.missionStatuses(),
        unlockedAchievements: unlockedMap,
        recordedMilestones: this.recordedMilestones(),
        completedHistory: this.completedHistory()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // quota or private mode
    }
  }
}
