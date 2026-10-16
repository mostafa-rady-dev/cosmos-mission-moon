import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  viewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  output,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { I18nService } from '../../core/i18n.service';
import { MasterTimelineService } from '../../core/master-timeline.service';
import { AudioService } from '../../core/audio.service';
import { MISSIONS_DATA, MissionConfig } from '../../../assets/missions/missions.config';

@Component({
  selector: 'app-moon-explore',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section 
      #sceneContainer 
      class="scene-explore"
      [style.opacity]="masterTimeline.getSceneVisibility(4).opacity"
      [attr.aria-label]="i18n.currentTranslations().missionsTitle"
    >
      <!-- Deep Space Starfield Backdrop from User Upload -->
      <div class="lunar-deep-space-backdrop" aria-hidden="true"></div>

      <!-- Fixed Sky: Earth Glowing in the Moon's Black Sky -->
      <div class="lunar-sky-fixed">
        <div class="celestial-earth">
          <div class="earth-crescent"></div>
          <div class="earth-glow-halo"></div>
          <span class="earth-telemetry">EARTH // ORIGIN STATION (ASYUT, EGYPT)</span>
        </div>
      </div>

      <!-- Horizontal Scrolling Lunar Landscape -->
      <div #landscapeTrack class="landscape-track">
        <!-- Parallax Layer 1: Distant Crater Mountains -->
        <svg viewBox="0 0 3840 500" class="distant-crater-mountains" preserveAspectRatio="none">
          <path d="M0 240 Q400 180 800 220 T1600 190 T2400 230 T3200 180 T3840 220 L3840 500 L0 500 Z" fill="#1E293B" opacity="0.65"/>
          <ellipse cx="600" cy="230" rx="120" ry="16" fill="#0F172A" stroke="#475569" stroke-width="1.5"/>
          <ellipse cx="2200" cy="210" rx="180" ry="22" fill="#0F172A" stroke="#475569" stroke-width="1.5"/>
        </svg>

        <!-- Parallax Layer 2: Main Surface Regolith Terrain -->
        <svg viewBox="0 0 3840 550" class="main-lunar-surface" preserveAspectRatio="none">
          <defs>
            <linearGradient id="regolithGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#475569"/>
              <stop offset="35%" stop-color="#334155"/>
              <stop offset="100%" stop-color="#0F172A"/>
            </linearGradient>
          </defs>
          <path d="M0 160 Q600 130 1200 155 T2400 140 T3600 150 L3840 160 L3840 550 L0 550 Z" fill="url(#regolithGrad)"/>
          
          <!-- Craters & Surface Boulders along the traverse -->
          <ellipse cx="380" cy="240" rx="130" ry="24" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
          <ellipse cx="1450" cy="260" rx="160" ry="26" fill="#0F172A" stroke="#64748B" stroke-width="2"/>
          <ellipse cx="2700" cy="250" rx="140" ry="22" fill="#1E293B" stroke="#64748B" stroke-width="2"/>

          <!-- Surface texture lines -->
          <line x1="200" y1="280" x2="500" y2="280" stroke="#64748B" stroke-width="1" stroke-dasharray="20 15" stroke-opacity="0.4"/>
          <line x1="1600" y1="300" x2="2000" y2="300" stroke="#64748B" stroke-width="1" stroke-dasharray="30 20" stroke-opacity="0.3"/>
        </svg>

        <!-- Origin: Touchdown Base (Lander with Open Hatch & Ladder) -->
        <div class="lander-base-origin">
          <svg viewBox="0 0 240 340" class="origin-lander-svg">
            <!-- Lander Descent Stage -->
            <polygon points="40,240 200,240 215,290 25,290" fill="#1E293B" stroke="#F2CA8D" stroke-width="2"/>
            <!-- Golden Footpads -->
            <ellipse cx="25" cy="295" rx="14" ry="5" fill="#64748B" stroke="#F2CA8D" stroke-width="1.5"/>
            <ellipse cx="215" cy="295" rx="14" ry="5" fill="#64748B" stroke="#F2CA8D" stroke-width="1.5"/>
            <!-- Cabin Body & Open Hatch -->
            <rect x="50" y="100" width="140" height="140" rx="10" fill="#F1F5F9" stroke="#1E3A8A" stroke-width="2"/>
            <!-- Open Hatch Door spilling warm light -->
            <rect x="90" y="140" width="60" height="95" rx="8" fill="#0A0E1C" stroke="#F2CA8D" stroke-width="2"/>
            <rect x="92" y="142" width="56" height="91" rx="6" fill="#FDE68A" class="hatch-light-spill"/>
            <!-- Exit Ladder -->
            <line x1="110" y1="235" x2="110" y2="295" stroke="#F2CA8D" stroke-width="3"/>
            <line x1="130" y1="235" x2="130" y2="295" stroke="#F2CA8D" stroke-width="3"/>
            <line x1="108" y1="250" x2="132" y2="250" stroke="#F2CA8D" stroke-width="2.5"/>
            <line x1="108" y1="265" x2="132" y2="265" stroke="#F2CA8D" stroke-width="2.5"/>
            <line x1="108" y1="280" x2="132" y2="280" stroke="#F2CA8D" stroke-width="2.5"/>
          </svg>

          <!-- Planted Egyptian Mission Flag -->
          <div #missionFlag class="planted-flag-wrapper" [class.flag-planted]="isFlagPlanted()">
            <svg viewBox="0 0 80 140" class="flag-svg">
              <!-- Flagpole firmly in lunar regolith -->
              <line x1="15" y1="0" x2="15" y2="140" stroke="#CBD5E1" stroke-width="3"/>
              <polygon points="12,130 18,130 15,140" fill="#F2CA8D"/>
              <!-- Egyptian Colors Tricolor with Gold Eagle -->
              <g class="flag-cloth">
                <rect x="15" y="8" width="60" height="13" fill="#EF4444"/>
                <rect x="15" y="21" width="60" height="13" fill="#FFFFFF"/>
                <rect x="15" y="34" width="60" height="13" fill="#0A0E1C"/>
                <!-- Eagle Emblem -->
                <circle cx="45" cy="27.5" r="4" fill="#F2CA8D"/>
              </g>
            </svg>
            <span class="flag-pedestal-label">ASYUT LUNAR BASE // 2026</span>
          </div>
        </div>

        <!-- Footprints Trail in the Dust -->
        <div class="footprints-trail">
          @for (print of footprints(); track $index) {
            <div 
              class="boot-print"
              [style.left.px]="print.x"
              [style.bottom.px]="print.y"
            ></div>
          }
        </div>

        <!-- Walking Astronaut Character -->
        <div 
          #astronautChar
          class="astronaut-character"
          [style.left.px]="astronautX()"
          [style.bottom.px]="astronautY()"
          [class.walking]="isWalking()"
        >
          <svg viewBox="0 0 100 150" class="astronaut-svg">
            <defs>
              <linearGradient id="suitGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#E2E8F0"/>
                <stop offset="50%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#94A3B8"/>
              </linearGradient>
              <linearGradient id="goldVisor" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FDE68A"/>
                <stop offset="45%" stop-color="#F59E0B"/>
                <stop offset="100%" stop-color="#B45309"/>
              </linearGradient>
            </defs>

            <!-- Life Support Backpack (PLSS) -->
            <rect x="25" y="42" width="22" height="52" rx="4" fill="#64748B" stroke="#1E293B" stroke-width="1.5"/>
            <rect x="28" y="48" width="16" height="12" fill="#2A71D6" rx="2"/>

            <!-- Legs & Boots (Low-gravity bounce) -->
            <g class="legs-group">
              <rect x="42" y="92" width="14" height="42" rx="6" fill="url(#suitGrad)" stroke="#1E293B" stroke-width="1.5" class="left-leg"/>
              <ellipse cx="48" cy="138" rx="10" ry="5" fill="#475569" stroke="#F2CA8D" stroke-width="1"/>
              
              <rect x="58" y="92" width="14" height="42" rx="6" fill="url(#suitGrad)" stroke="#1E293B" stroke-width="1.5" class="right-leg"/>
              <ellipse cx="66" cy="138" rx="10" ry="5" fill="#475569" stroke="#F2CA8D" stroke-width="1"/>
            </g>

            <!-- Torso & Chest Pack -->
            <rect x="38" y="40" width="38" height="55" rx="10" fill="url(#suitGrad)" stroke="#1E293B" stroke-width="1.5"/>
            <!-- Chest Telemetry Controls -->
            <rect x="46" y="52" width="22" height="18" rx="3" fill="#172130" stroke="#70B1ED" stroke-width="1"/>
            <circle cx="52" cy="61" r="2.5" fill="#3EC87D"/>
            <circle cx="62" cy="61" r="2.5" fill="#F2CA8D"/>

            <!-- Arms -->
            <rect x="32" y="45" width="10" height="38" rx="5" fill="url(#suitGrad)" stroke="#1E293B" stroke-width="1" class="left-arm"/>
            <rect x="72" y="45" width="10" height="38" rx="5" fill="url(#suitGrad)" stroke="#1E293B" stroke-width="1" class="right-arm"/>

            <!-- Helmet & Gold Visor with Glint -->
            <g class="helmet-group">
              <circle cx="57" cy="26" r="22" fill="url(#suitGrad)" stroke="#1E293B" stroke-width="2"/>
              <!-- Visor Bubble -->
              <ellipse cx="62" cy="26" rx="14" ry="12" fill="url(#goldVisor)" stroke="#1E293B" stroke-width="1.5"/>
              <!-- Dynamic Visor Glint Reflection -->
              <path d="M54 20 Q62 16 68 20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.9"/>
            </g>
          </svg>
        </div>

        <!-- Dynamic Mission Nodes (Rendered from missions.config.ts) -->
        @for (mission of missions; track mission.id) {
          <div 
            class="mission-waypoint-node"
            [style.left.%]="mission.position.x"
            [style.bottom.vh]="mission.position.y"
            [class.completed]="isMissionCompleted(mission.id)"
            [class.active-target]="activeNearMission()?.id === mission.id"
            (click)="walkToAndOpenMission(mission)"
          >
            <!-- Node Beacon Signal Graphic -->
            <div class="beacon-pulse-ring"></div>
            <div class="waypoint-pin">
              <span class="waypoint-num">{{ mission.order }}</span>
            </div>

            <!-- Passport-style Station Label -->
            <div class="waypoint-card hud-panel">
              <div class="card-header">
                <span class="station-badge">WP-0{{ mission.order }}</span>
                @if (isMissionCompleted(mission.id)) {
                  <span class="completed-stamp">✓ {{ i18n.currentTranslations().completed }}</span>
                }
              </div>
              <h3 class="station-title">{{ i18n.currentLang() === 'ar' ? mission.titleAr : mission.titleEn }}</h3>
              <p class="station-desc">{{ i18n.currentLang() === 'ar' ? mission.descAr : mission.descEn }}</p>

              <button class="btn-cinema open-mission-btn" (click)="$event.stopPropagation(); walkToAndOpenMission(mission)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span>{{ i18n.currentTranslations().openMission }}</span>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Exploration Status Bar -->
      <div class="exploration-hud-header hud-panel">
        <div class="exp-title-group">
          <span class="passport-badge">
            <span class="pulse-dot"></span>
            <span>MARE TRANQUILLITATIS SURVEY</span>
          </span>
          <h2 class="exp-title">{{ i18n.currentTranslations().missionsTitle }}</h2>
        </div>

        <div class="progress-stats">
          <span class="completed-counter">
            {{ completedCount() }} / {{ missions.length }} {{ i18n.currentTranslations().completed }}
          </span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
      background: #030715;
    }

    .scene-explore {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /* Deep Space Starfield Backdrop */
    .lunar-deep-space-backdrop {
      position: absolute;
      inset: 0;
      height: 65vh;
      background-image: url('/assets/images/deep-space-stars.png');
      background-size: cover;
      background-position: center top;
      opacity: 0.78;
      pointer-events: none;
      z-index: 1;
    }

    /* Fixed Sky Earth */
    .lunar-sky-fixed {
      position: absolute;
      top: 10%;
      inset-inline-start: 10%;
      pointer-events: none;
      z-index: 2;
    }

    .celestial-earth {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
    }

    .earth-crescent {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background-image: url('/assets/images/earth_realistic.jpg');
      background-size: cover;
      background-position: center;
      box-shadow: 0 0 35px rgba(56, 189, 248, 0.6), inset 0 0 15px rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(112, 177, 237, 0.4);
    }

    .earth-telemetry {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--accent-glow);
      background: rgba(10, 14, 28, 0.7);
      border: 1px solid var(--border-line);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      letter-spacing: 0.06em;
    }

    /* Horizontal Landscape Track */
    .landscape-track {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 3840px;
      height: 100vh;
      pointer-events: auto;
      will-change: transform;
    }

    .distant-crater-mountains {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 48vh;
      pointer-events: none;
    }

    .main-lunar-surface {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 42vh;
      pointer-events: none;
      filter: drop-shadow(0 -10px 25px rgba(0, 0, 0, 0.8));
    }

    /* Origin Lander Base & Flag */
    .lander-base-origin {
      position: absolute;
      bottom: 12vh;
      left: 80px;
      width: 240px;
      height: 340px;
      z-index: 3;
    }

    .origin-lander-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.8));
    }

    .hatch-light-spill {
      filter: drop-shadow(0 0 16px #FDE68A);
      animation: hatchPulse 2s infinite alternate;
    }

    .planted-flag-wrapper {
      position: absolute;
      bottom: 40px;
      right: -80px;
      width: 80px;
      height: 140px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s var(--ease-elastic);

      &.flag-planted {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .flag-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6));
    }

    .flag-pedestal-label {
      position: absolute;
      bottom: -15px;
      left: -20px;
      font-family: var(--font-mono);
      font-size: 0.55rem;
      white-space: nowrap;
      color: var(--accent-sand);
    }

    /* Footprints */
    .footprints-trail {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 3;
    }

    .boot-print {
      position: absolute;
      width: 8px;
      height: 4px;
      border-radius: 50%;
      background: #1E293B;
      box-shadow: inset 1px 1px 1px #0F172A;
      opacity: 0.75;
    }

    /* Walking Astronaut */
    .astronaut-character {
      position: absolute;
      width: 75px;
      height: 110px;
      z-index: 6;
      transform-origin: bottom center;
      transition: bottom 0.2s ease-out;

      &.walking {
        animation: lowGravityHop 0.65s infinite alternate ease-in-out;
      }
    }

    .astronaut-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.75));
    }

    /* Mission Waypoints along Surface */
    .mission-waypoint-node {
      position: absolute;
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transform: translateX(-50%);

      &.completed .waypoint-pin {
        background: var(--accent-success);
        border-color: #fff;
        box-shadow: 0 0 16px var(--accent-success);
      }

      &.active-target .beacon-pulse-ring {
        animation: beaconPing 1.2s infinite;
      }
    }

    .beacon-pulse-ring {
      position: absolute;
      top: -10px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid var(--accent-glow);
      opacity: 0.6;
    }

    .waypoint-pin {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--accent-primary);
      border: 2px solid var(--accent-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(42, 113, 214, 0.6);
      transition: transform 0.25s var(--ease-elastic);

      &:hover {
        transform: scale(1.15);
      }
    }

    .waypoint-num {
      font-family: var(--font-mono);
      font-weight: 800;
      font-size: 0.85rem;
      color: #FFFFFF;
    }

    .waypoint-card {
      margin-top: 1rem;
      width: 260px;
      padding: 1.15rem;
      text-align: start;
      transform: translateY(6px);
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--accent-glow);
        transform: translateY(0);
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .station-badge {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--accent-sand);
      letter-spacing: 0.08em;
    }

    .completed-stamp {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--accent-success);
      background: rgba(62, 200, 125, 0.15);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
    }

    .station-title {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
      line-height: 1.3;
    }

    .station-desc {
      font-size: 0.76rem;
      color: var(--text-muted);
      line-height: 1.45;
      margin-bottom: 0.85rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .open-mission-btn {
      width: 100%;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      border-radius: 8px;
    }

    /* Top Exploration HUD */
    .exploration-hud-header {
      position: absolute;
      top: 6.5rem;
      inset-inline-start: 2rem;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      padding: 1rem 1.75rem;
      max-width: 600px;

      @media (max-width: 768px) {
        inset-inline-start: 1rem;
        top: 5rem;
        padding: 0.85rem 1.25rem;
      }
    }

    .exp-title {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-top: 0.2rem;
    }

    .completed-counter {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-sand);
    }

    .pulse-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-sand);
      box-shadow: 0 0 6px var(--accent-sand);
    }

    /* Keyframes */
    @keyframes hatchPulse {
      0% { opacity: 0.8; }
      100% { opacity: 1; filter: drop-shadow(0 0 24px #FDE68A); }
    }

    @keyframes lowGravityHop {
      0% { transform: translateY(0) rotate(-2deg); }
      100% { transform: translateY(-16px) rotate(2deg); }
    }

    @keyframes beaconPing {
      0% { transform: scale(0.6); opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0; }
    }
  `]
})
export class MoonExploreComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly masterTimeline = inject(MasterTimelineService);
  private readonly audio = inject(AudioService);

  readonly openMission = output<MissionConfig>();

  readonly landscapeTrack = viewChild<ElementRef<HTMLElement>>('landscapeTrack');
  readonly missionFlag = viewChild<ElementRef<HTMLElement>>('missionFlag');

  readonly missions: MissionConfig[] = MISSIONS_DATA;
  readonly completedMissions = signal<Set<string>>(new Set<string>());

  readonly astronautX = signal<number>(260);
  readonly astronautY = signal<number>(110);
  readonly isWalking = signal<boolean>(false);
  readonly isFlagPlanted = signal<boolean>(true);
  readonly activeNearMission = signal<MissionConfig | null>(null);

  readonly footprints = signal<{ x: number; y: number }[]>([]);

  readonly completedCount = computed(() => this.completedMissions().size);

  constructor() {
    effect(() => {
      const p = this.masterTimeline.getSceneProgress(4); // 0.0 to 1.0 within Scene 5 & 6
      this.syncScrollWithAstronaut(p);
    });
  }

  ngOnInit(): void {
    // Generate initial footprints near lander
    this.footprints.set([
      { x: 140, y: 110 },
      { x: 170, y: 112 },
      { x: 200, y: 108 },
      { x: 230, y: 110 },
    ]);
  }

  ngOnDestroy(): void {}

  isMissionCompleted(id: string): boolean {
    return this.completedMissions().has(id);
  }

  markCompleted(id: string): void {
    this.completedMissions.update((set) => {
      const next = new Set(set);
      next.add(id);
      return next;
    });
  }

  /**
   * Syncs scroll progression with astronaut walking traverse across horizontal landscape
   */
  private syncScrollWithAstronaut(p: number): void {
    const track = this.landscapeTrack()?.nativeElement;
    if (!track) return;

    // Total landscape width is 3840px. Window is ~1920px (or innerWidth)
    const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const maxScrollX = 3840 - w;

    // Camera scrolls horizontally with p
    const trackX = -p * maxScrollX;
    gsap.set(track, { x: trackX });

    // Astronaut walks forward ahead of camera center
    const targetX = 260 + p * (maxScrollX + 400);
    this.astronautX.set(targetX);

    // Footprints trail generation as astronaut traverses
    const prints = this.footprints();
    const lastPrint = prints[prints.length - 1];
    if (!lastPrint || Math.abs(targetX - lastPrint.x) > 35) {
      if (prints.length < 60) {
        this.footprints.update(fps => [...fps, { x: targetX, y: 108 + (prints.length % 2 === 0 ? 3 : -3) }]);
      }
    }

    // Detect proximity to nearest mission node
    const currentTrackPct = (targetX / 3840) * 100;
    const near = this.missions.find(m => Math.abs(m.position.x - currentTrackPct) < 3.5);
    this.activeNearMission.set(near ?? null);
  }

  /**
   * Smoothly walks astronaut to the requested mission node before opening the modal
   */
  walkToAndOpenMission(mission: MissionConfig): void {
    this.isWalking.set(true);
    this.audio.playBeep(920, 0.08);

    // Calculate target X position along track
    const targetX = (mission.position.x / 100) * 3840 - 80;

    gsap.to(this.astronautX, {
      value: targetX,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        // Step sounds
        if (Math.random() < 0.15) {
          this.audio.playBeep(320, 0.04);
        }
      },
      onComplete: () => {
        this.isWalking.set(false);
        this.audio.playBeep(1100, 0.15);
        this.openMission.emit(mission);
      }
    });
  }
}
