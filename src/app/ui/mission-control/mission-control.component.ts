import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  output,
  HostListener,
  AfterViewInit,
  viewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/i18n.service';
import { AudioService } from '../../core/audio.service';
import { ExplorerProgressionService } from '../../core/explorer-progression.service';
import { MISSIONS_DATA, MissionConfig } from '../../../assets/missions/missions.config';

type MissionFilter = 'all' | 'lunar' | 'deep' | 'planetary';

interface EnhancedMission extends MissionConfig {
  difficulty: number;
  category: 'lunar' | 'deep' | 'planetary';
}

@Component({
  selector: 'app-mission-control',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div 
        class="mission-control-backdrop"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="i18n.currentTranslations().missionControlTitle"
      >
        <div #modalFrame class="mission-control-frame">
          <div class="glass-reflection-sheen" aria-hidden="true"></div>

          <!-- Top Control Header -->
          <div class="mc-header">
            <div class="mc-agency-row">
              <span class="mc-badge">MISSION CONTROL // ASYUT OPS</span>
              <span class="mc-uplink-status">
                <span class="ping-dot"></span>
                UPLINK DIRECT // DEEP SPACE NETWORK
              </span>
            </div>

            <div class="mc-title-wrap">
              <h2 class="mc-heading">{{ i18n.currentTranslations().missionControlTitle }}</h2>
              <p class="mc-sub">{{ i18n.currentTranslations().missionControlSub }}</p>
            </div>

            <!-- Explorer Quick Telemetry Pill -->
            <div class="mc-profile-pill">
              <div class="pill-meta">
                <span class="pill-rank">{{ i18n.t(progression.currentRank().titleKey) }}</span>
                <span class="pill-xp telemetry-num" dir="ltr">{{ progression.totalXp() }} XP</span>
              </div>
              <div class="pill-progress-track">
                <div class="pill-fill" [style.width.%]="progression.currentRank().progressPercent"></div>
              </div>
            </div>

            <!-- Close Button -->
            <button 
              #closeButton
              class="mc-close-btn" 
              (click)="close()" 
              [attr.aria-label]="i18n.currentTranslations().closeModal"
            >
              ✕
            </button>
          </div>

          <!-- Fleet Status Strip & Category Filter Tabs -->
          <div class="mc-sub-bar">
            <div class="fleet-stats-group">
              <span class="fleet-stat-item">
                <span class="stat-num">{{ progression.completedMissionsCount() }} / 5</span>
                <span class="stat-lbl">{{ i18n.currentTranslations().completedCountLabel }}</span>
              </span>
            </div>

            <nav class="filter-tabs-nav" aria-label="Mission Filters">
              <button 
                class="filter-pill-btn" 
                [class.active]="activeFilter() === 'all'" 
                (click)="setFilter('all')"
              >
                {{ i18n.currentTranslations().filterAll }}
              </button>
              <button 
                class="filter-pill-btn" 
                [class.active]="activeFilter() === 'lunar'" 
                (click)="setFilter('lunar')"
              >
                {{ i18n.currentTranslations().filterLunar }}
              </button>
              <button 
                class="filter-pill-btn" 
                [class.active]="activeFilter() === 'planetary'" 
                (click)="setFilter('planetary')"
              >
                {{ i18n.currentTranslations().filterPlanetary }}
              </button>
              <button 
                class="filter-pill-btn" 
                [class.active]="activeFilter() === 'deep'" 
                (click)="setFilter('deep')"
              >
                {{ i18n.currentTranslations().filterDeepSpace }}
              </button>
            </nav>
          </div>

          <!-- Main Mission Cards Grid -->
          <div class="mc-body">
            <div class="missions-deck-grid">
              @for (m of filteredMissions(); track m.id) {
                <div 
                  class="mission-deck-card"
                  [class.status-completed]="getStatus(m.id) === 'completed'"
                  [class.status-in-progress]="getStatus(m.id) === 'in-progress'"
                >
                  <!-- Card Top Bar: Order, Codename & Status Badge -->
                  <div class="card-top-row">
                    <div class="mission-code-badge">
                      <span class="mission-num">0{{ m.order }}</span>
                      <span class="mission-code">{{ m.codename }}</span>
                    </div>

                    <div class="status-indicator-badge">
                      @if (getStatus(m.id) === 'completed') {
                        <span class="badge-completed">✓ {{ i18n.currentTranslations().missionStatusCompleted }}</span>
                      } @else if (getStatus(m.id) === 'in-progress') {
                        <span class="badge-in-progress">⚡ {{ i18n.currentTranslations().missionStatusInProgress }}</span>
                      } @else {
                        <span class="badge-available">● {{ i18n.currentTranslations().missionStatusAvailable }}</span>
                      }
                    </div>
                  </div>

                  <!-- Mission Destination & Title -->
                  <div class="card-title-section">
                    <span class="destination-tag">
                      {{ i18n.currentLang() === 'ar' ? m.destinationAr : m.destinationEn }}
                    </span>
                    <h3 class="card-title">{{ i18n.currentLang() === 'ar' ? m.titleAr : m.titleEn }}</h3>
                    <p class="card-desc">{{ i18n.currentLang() === 'ar' ? m.descAr : m.descEn }}</p>
                  </div>

                  <!-- Difficulty & Target Specs -->
                  <div class="card-specs-row">
                    <div class="spec-col">
                      <span class="spec-label">{{ i18n.currentTranslations().difficultyLabel }}</span>
                      <div class="difficulty-stars" [attr.aria-label]="m.difficulty + ' of 5'">
                        @for (star of [1,2,3,4,5]; track star) {
                          <span class="star-glyph" [class.filled]="star <= m.difficulty">★</span>
                        }
                      </div>
                    </div>

                    <div class="spec-col">
                      <span class="spec-label">{{ i18n.currentTranslations().targetCoordsLabel }}</span>
                      <span class="spec-val geo-coord" dir="ltr">{{ m.targetCoordinates }}</span>
                    </div>
                  </div>

                  <!-- Objectives Preview Checklist -->
                  <div class="card-objectives-preview">
                    @for (obj of (i18n.currentLang() === 'ar' ? m.objectivesAr : m.objectivesEn) | slice:0:2; track $index) {
                      <div class="preview-obj-item">
                        <span class="obj-bullet">›</span>
                        <span class="obj-text">{{ obj }}</span>
                      </div>
                    }
                  </div>

                  <!-- Card Action Footer -->
                  <div class="card-actions-row">
                    <button 
                      class="btn-cinema launch-btn" 
                      (click)="launchMission(m)"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <span>
                        {{ getStatus(m.id) === 'completed' ? i18n.currentTranslations().viewTelemetryBtn : i18n.currentTranslations().launchMissionBtn }}
                      </span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .mission-control-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10002;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(8, 11, 26, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      padding: 1.25rem;
      animation: modalFadeIn 0.3s ease-out;
    }

    .mission-control-frame {
      position: relative;
      width: 100%;
      max-width: 1140px;
      max-height: 90vh;
      overflow-y: auto;
      border: 2px solid var(--accent-glow);
      border-radius: 28px;
      background: rgba(17, 26, 53, 0.96);
      box-shadow: 0 0 60px rgba(54, 197, 240, 0.35), inset 0 0 40px rgba(102, 87, 245, 0.15);
      display: flex;
      flex-direction: column;
      animation: visorExpand 0.35s var(--ease-cinematic);
    }

    .glass-reflection-sheen {
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 25%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
      border-radius: 28px 28px 0 0;
      pointer-events: none;
      z-index: 5;
    }

    /* Header */
    .mc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      padding: 1.5rem 2rem 1rem;
      border-bottom: 1px dashed var(--border-line-strong);
      position: relative;
      z-index: 10;
      flex-wrap: wrap;
    }

    .mc-agency-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      margin-bottom: -0.25rem;
    }

    .mc-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent-glow);
      background: rgba(54, 197, 240, 0.12);
      border: 1px solid rgba(54, 197, 240, 0.3);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.08em;
    }

    .mc-uplink-status {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-success);
    }

    .ping-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-success);
      box-shadow: 0 0 8px var(--accent-success);
      animation: pulseAnim 1.4s infinite;
    }

    .mc-title-wrap {
      flex: 1;
      min-width: 260px;
    }

    .mc-heading {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }

    .mc-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .mc-profile-pill {
      background: rgba(8, 11, 26, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 10px;
      padding: 0.45rem 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 170px;
    }

    .pill-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.7rem;
    }

    .pill-rank {
      color: var(--accent-glow);
      font-weight: 700;
    }

    .pill-xp {
      color: #A79BFD;
      font-family: var(--font-mono);
      font-weight: 700;
    }

    .pill-progress-track {
      width: 100%;
      height: 5px;
      background: rgba(244, 245, 255, 0.12);
      border-radius: 999px;
      overflow: hidden;
    }

    .pill-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-glow));
      border-radius: 999px;
    }

    .mc-close-btn {
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      border-radius: 50%;
      background: rgba(244, 245, 255, 0.08);
      border: 1px solid var(--border-line-strong);
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(244, 81, 79, 0.25);
        border-color: var(--accent-danger);
        color: var(--accent-danger);
        transform: rotate(90deg);
      }
    }

    /* Sub Bar with Filter Pills */
    .mc-sub-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 2rem;
      background: rgba(8, 11, 26, 0.4);
      border-bottom: 1px solid var(--border-line);
      flex-wrap: wrap;
    }

    .fleet-stats-group {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .fleet-stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
    }

    .stat-num {
      color: var(--accent-glow);
      font-weight: 800;
    }

    .stat-lbl {
      color: var(--text-muted);
    }

    .filter-tabs-nav {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      flex-wrap: wrap;
    }

    .filter-pill-btn {
      background: transparent;
      border: 1px solid var(--border-line);
      color: var(--text-muted);
      padding: 0.4rem 0.9rem;
      min-height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      font-family: var(--font-display);
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-primary);
        border-color: var(--accent-glow);
      }

      &.active {
        background: var(--accent-primary);
        border-color: var(--accent-glow);
        color: #fff;
        box-shadow: 0 0 12px rgba(102, 87, 245, 0.4);
      }
    }

    /* Body & Cards Grid */
    .mc-body {
      padding: 1.75rem 2rem;
      flex: 1;
    }

    .missions-deck-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .mission-deck-card {
      background: rgba(8, 11, 26, 0.65);
      border: 1px solid var(--border-line);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      position: relative;
      transition: all 0.25s ease;

      &:hover {
        border-color: var(--accent-glow);
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(54, 197, 240, 0.2);
      }

      &.status-completed {
        border-color: rgba(62, 200, 125, 0.4);
        background: rgba(8, 11, 26, 0.8);
      }

      &.status-in-progress {
        border-color: rgba(102, 87, 245, 0.6);
        box-shadow: 0 0 20px rgba(102, 87, 245, 0.25);
      }
    }

    .card-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed var(--border-line);
      padding-bottom: 0.65rem;
    }

    .mission-code-badge {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .mission-num {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--accent-glow);
      background: rgba(54, 197, 240, 0.15);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
    }

    .mission-code {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .status-indicator-badge {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 700;
    }

    .badge-completed {
      color: var(--accent-success);
    }

    .badge-in-progress {
      color: #A79BFD;
    }

    .badge-available {
      color: var(--accent-glow);
    }

    .destination-tag {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-glow);
      margin-bottom: 0.25rem;
      display: inline-block;
    }

    .card-title {
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.3;
      margin-bottom: 0.35rem;
    }

    .card-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-specs-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
      background: rgba(8, 11, 26, 0.4);
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      border: 1px solid rgba(244, 245, 255, 0.05);
    }

    .spec-col {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .spec-label {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .spec-val {
      font-size: 0.72rem;
      color: var(--accent-glow);
    }

    .difficulty-stars {
      display: flex;
      gap: 2px;
    }

    .star-glyph {
      font-size: 0.75rem;
      color: rgba(244, 245, 255, 0.15);

      &.filled {
        color: #F2CA8D;
      }
    }

    .card-objectives-preview {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .preview-obj-item {
      display: flex;
      align-items: flex-start;
      gap: 0.4rem;
    }

    .obj-bullet {
      color: var(--accent-glow);
      font-weight: 800;
      font-size: 0.85rem;
      line-height: 1;
    }

    .obj-text {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-actions-row {
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .launch-btn {
      width: 100%;
      font-size: 0.88rem;
      padding: 0.65rem 1rem;
    }
  `]
})
export class MissionControlComponent implements AfterViewInit {
  protected readonly i18n = inject(I18nService);
  protected readonly progression = inject(ExplorerProgressionService);
  private readonly audio = inject(AudioService);

  readonly isOpen = input<boolean>(false);
  readonly closeModal = output<void>();
  readonly launchMissionEvent = output<MissionConfig>();

  readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  readonly modalFrame = viewChild<ElementRef<HTMLElement>>('modalFrame');

  readonly activeFilter = signal<MissionFilter>('all');
  private previousActiveElement: HTMLElement | null = null;

  constructor() {
    // Focus management on open
    if (typeof window !== 'undefined') {
      import('@angular/core').then(({ effect }) => {
        // dynamic effect if needed or standard effect below
      });
    }
  }

  // Augmented missions catalog
  readonly enhancedMissions: EnhancedMission[] = [
    { ...MISSIONS_DATA[0], difficulty: 2, category: 'lunar' },
    { ...MISSIONS_DATA[1], difficulty: 3, category: 'deep' },
    { ...MISSIONS_DATA[2], difficulty: 3, category: 'lunar' },
    { ...MISSIONS_DATA[3], difficulty: 4, category: 'planetary' },
    { ...MISSIONS_DATA[4], difficulty: 5, category: 'deep' }
  ];

  readonly filteredMissions = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.enhancedMissions;
    return this.enhancedMissions.filter(m => m.category === filter);
  });

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      const container = this.modalFrame()?.nativeElement;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.isOpen()) {
      if (typeof document !== 'undefined') {
        this.previousActiveElement = document.activeElement as HTMLElement;
      }
      this.closeButton()?.nativeElement.focus();
    }
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('mission-control-backdrop')) {
      this.close();
    }
  }

  close(): void {
    this.audio.playBeep(650, 0.08);
    this.closeModal.emit();
    this.previousActiveElement?.focus();
  }

  setFilter(filter: MissionFilter): void {
    this.activeFilter.set(filter);
    this.audio.playBeep(950, 0.04);
  }

  getStatus(missionId: string): 'available' | 'in-progress' | 'completed' {
    return this.progression.getMissionStatus(missionId);
  }

  launchMission(m: MissionConfig): void {
    this.audio.playBeep(1200, 0.1);
    this.progression.setMissionInProgress(m.id);
    this.launchMissionEvent.emit(m);
    this.close();
  }
}

