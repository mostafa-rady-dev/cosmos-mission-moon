import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  viewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { I18nService } from '../../core/i18n.service';
import { MasterTimelineService } from '../../core/master-timeline.service';
import { AudioService } from '../../core/audio.service';

@Component({
  selector: 'app-moon-landing',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section 
      #sceneContainer 
      class="scene-landing"
      [style.opacity]="masterTimeline.getSceneVisibility(3).opacity"
      [attr.aria-label]="i18n.currentTranslations().moonApproachTitle"
    >
      <!-- Deep Space Void with Earth Visible in the Distance Sky -->
      <div class="sky-void">
        <!-- Distant Marble Earth -->
        <div class="distant-earth">
          <div class="earth-disc"></div>
          <span class="earth-tag">EARTH // ASYUT COMMAND (384,400 KM)</span>
        </div>
        <!-- Cosmic Stars -->
        <div class="stars-cluster"></div>
      </div>

      <!-- Massive Layered Lunar Surface Craters (Filling lower screen) -->
      <div #moonTerrain class="moon-terrain-container">
        <svg viewBox="0 0 1920 800" class="lunar-surface-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lunarSurfaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#475569"/>
              <stop offset="40%" stop-color="#334155"/>
              <stop offset="100%" stop-color="#1E293B"/>
            </linearGradient>
            <linearGradient id="craterShadow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0F172A"/>
              <stop offset="100%" stop-color="#334155"/>
            </linearGradient>
            <linearGradient id="craterRim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#94A3B8"/>
              <stop offset="100%" stop-color="#475569"/>
            </linearGradient>
          </defs>

          <!-- Rolling Lunar Hills & Horizon -->
          <path d="M0 320 Q320 260 640 290 T1280 270 T1920 310 L1920 800 L0 800 Z" fill="url(#lunarSurfaceGrad)"/>

          <!-- Distant Crater Rims -->
          <ellipse cx="420" cy="340" rx="140" ry="24" fill="url(#craterShadow)" stroke="url(#craterRim)" stroke-width="2"/>
          <ellipse cx="1480" cy="320" rx="190" ry="28" fill="url(#craterShadow)" stroke="url(#craterRim)" stroke-width="2"/>

          <!-- Midground Prominent Mare Tranquillitatis Craters -->
          <ellipse cx="960" cy="480" rx="360" ry="55" fill="#1E293B" stroke="url(#craterRim)" stroke-width="3"/>
          <ellipse cx="960" cy="485" rx="310" ry="42" fill="#0F172A"/>

          <!-- Touchdown Target Circle (Beacon Glow) -->
          <ellipse cx="960" cy="470" rx="90" ry="16" fill="none" stroke="#F2CA8D" stroke-width="2" stroke-dasharray="8 6" class="touchdown-target-beacon"/>
          <ellipse cx="960" cy="470" rx="40" ry="8" fill="none" stroke="#3EC87D" stroke-width="1.5"/>

          <!-- Foreground Regolith Soil Texture & Rocks -->
          <ellipse cx="260" cy="560" rx="65" ry="18" fill="url(#craterShadow)" stroke="#64748B" stroke-width="1.5"/>
          <ellipse cx="1680" cy="580" rx="95" ry="24" fill="url(#craterShadow)" stroke="#64748B" stroke-width="1.5"/>
          <circle cx="780" cy="520" r="6" fill="#64748B"/>
          <circle cx="1140" cy="510" r="8" fill="#475569"/>
          <circle cx="1220" cy="540" r="5" fill="#64748B"/>
        </svg>

        <!-- Touchdown Regolith Dust Plumes -->
        <div #dustPlume class="dust-plume-group" [class.plume-active]="isDustActive()">
          <div class="dust-puff dust-1"></div>
          <div class="dust-puff dust-2"></div>
          <div class="dust-puff dust-3"></div>
          <div class="dust-puff dust-4"></div>
        </div>
      </div>

      <!-- Lunar Lander / Rocket Descending -->
      <div #landerWrapper class="lander-craft-assembly">
        <svg viewBox="0 0 160 220" class="lander-svg">
          <defs>
            <linearGradient id="landerBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#E2E8F0"/>
              <stop offset="50%" stop-color="#FFFFFF"/>
              <stop offset="100%" stop-color="#94A3B8"/>
            </linearGradient>
            <linearGradient id="retroFlameGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="30%" stop-color="#FDE047"/>
              <stop offset="70%" stop-color="#F97316"/>
              <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <!-- Retro-Thruster Exhaust Plume -->
          <g #retroThrusters class="retro-thruster-group" [class.firing]="isRetroFiring()">
            <polygon points="80,140 68,195 92,195" fill="url(#retroFlameGrad)" class="retro-flame"/>
            <polygon points="62,138 52,175 70,175" fill="url(#retroFlameGrad)"/>
            <polygon points="98,138 90,175 108,175" fill="url(#retroFlameGrad)"/>
          </g>

          <!-- Landing Legs (Animated Deployment) -->
          <g #landingLegs class="landing-legs-group">
            <!-- Left Leg Strut & Footpad -->
            <path d="M52 120 L18 165 L10 168" stroke="#F2CA8D" stroke-width="3" stroke-linecap="round" fill="none"/>
            <line x1="38" y1="138" x2="48" y2="155" stroke="#CBD5E1" stroke-width="2"/>
            <ellipse cx="14" cy="168" rx="10" ry="3" fill="#64748B" stroke="#F2CA8D" stroke-width="1.5"/>

            <!-- Right Leg Strut & Footpad -->
            <path d="M108 120 L142 165 L150 168" stroke="#F2CA8D" stroke-width="3" stroke-linecap="round" fill="none"/>
            <line x1="122" y1="138" x2="112" y2="155" stroke="#CBD5E1" stroke-width="2"/>
            <ellipse cx="146" cy="168" rx="10" ry="3" fill="#64748B" stroke="#F2CA8D" stroke-width="1.5"/>
          </g>

          <!-- Lander Crew Capsule & Ascent Stage -->
          <path d="M60 50 L70 15 Q80 10 90 15 L100 50 Z" fill="url(#landerBodyGrad)" stroke="#1E3A8A" stroke-width="1.5"/>
          <circle cx="80" cy="34" r="5" fill="#2A71D6" stroke="#70B1ED" stroke-width="1.5"/>
          
          <!-- Mid Stage & Gold Foil Thermal Blanket -->
          <rect x="52" y="50" width="56" height="55" fill="url(#landerBodyGrad)" stroke="#1E3A8A" stroke-width="1.5"/>
          <rect x="52" y="62" width="56" height="18" fill="#F2CA8D"/>
          <text x="80" y="74" fill="#0A0E1C" font-size="6" font-weight="900" font-family="'Space Mono', monospace" text-anchor="middle">ASYUT</text>
          
          <!-- Egyptian Emblem & Mission Flag -->
          <rect x="68" y="85" width="24" height="4" fill="#EF4444"/>
          <rect x="68" y="89" width="24" height="4" fill="#FFFFFF"/>
          <rect x="68" y="93" width="24" height="4" fill="#0A0E1C"/>

          <!-- Descent Stage Base & Engine Bell -->
          <polygon points="50,105 110,105 118,135 42,135" fill="#1E293B" stroke="#F2CA8D" stroke-width="1.5"/>
          <polygon points="72,135 66,145 94,145 88,135" fill="#475569" stroke="#70B1ED" stroke-width="1"/>
        </svg>
      </div>

      <!-- Touchdown Confirmation HUD Telemetry Banner -->
      <div #touchdownBanner class="touchdown-hud-banner hud-panel" [class.banner-active]="isTouchdownConfirmed()">
        <div class="banner-badge-row">
          <span class="passport-stamp-mini">
            <span>ASYUT LUNAR LANDING</span>
          </span>
          <span class="status-cleared-pill">{{ i18n.currentTranslations().touchdownConfirmed }}</span>
        </div>

        <h2 class="touchdown-title">{{ i18n.currentTranslations().moonApproachTitle }}</h2>
        <p class="touchdown-coords">{{ i18n.currentTranslations().moonCoordinates }}</p>

        <div class="lunar-stats-grid">
          <div class="stat-box">
            <span class="stat-l">ALTITUDE</span>
            <span class="stat-v accent-green">0.00 M (TOUCHDOWN)</span>
          </div>
          <div class="stat-box">
            <span class="stat-l">DESCENT RATE</span>
            <span class="stat-v">0.0 M/S</span>
          </div>
          <div class="stat-box">
            <span class="stat-l">GRAVITY</span>
            <span class="stat-v">1.62 M/S² (0.166 G)</span>
          </div>
          <div class="stat-box">
            <span class="stat-l">TELEMETRY</span>
            <span class="stat-v accent-gold">ALL SYSTEMS NOMINAL</span>
          </div>
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

    .scene-landing {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /* Void & Earth */
    .sky-void {
      position: absolute;
      inset: 0;
      height: 60vh;
      pointer-events: none;
    }

    .distant-earth {
      position: absolute;
      top: 15%;
      inset-inline-end: 8%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .earth-disc {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #38BDF8, #1E3A8A 70%, #0A0E1C 100%);
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
    }

    .earth-tag {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: var(--accent-glow);
      background: rgba(10, 14, 28, 0.6);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid var(--border-line);
    }

    /* Moon Terrain */
    .moon-terrain-container {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      transform-origin: bottom center;
    }

    .lunar-surface-svg {
      width: 100%;
      height: 100%;
      display: block;
      filter: drop-shadow(0 -10px 30px rgba(0, 0, 0, 0.8));
    }

    .touchdown-target-beacon {
      animation: targetPulse 1.8s infinite;
    }

    /* Dust Plumes */
    .dust-plume-group {
      position: absolute;
      bottom: 12vh;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      height: 100px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;

      &.plume-active {
        opacity: 1;
      }
    }

    .dust-puff {
      position: absolute;
      background: radial-gradient(circle, rgba(148, 163, 184, 0.65) 0%, rgba(71, 85, 105, 0.2) 60%, transparent 80%);
      border-radius: 50%;
      filter: blur(14px);
      animation: dustScatter 0.8s infinite ease-out;
    }

    .dust-1 { width: 150px; height: 50px; left: 0; bottom: 0; }
    .dust-2 { width: 160px; height: 55px; right: 0; bottom: 5px; animation-delay: 0.2s; }
    .dust-3 { width: 180px; height: 60px; left: 25%; bottom: -5px; animation-delay: 0.4s; }
    .dust-4 { width: 140px; height: 45px; right: 25%; bottom: 2px; animation-delay: 0.55s; }

    /* Lander Craft */
    .lander-craft-assembly {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translate(-50%, 0);
      width: 160px;
      height: 220px;
      z-index: 5;
      transform-origin: center center;
    }

    .lander-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.8));
    }

    .retro-thruster-group {
      opacity: 0;
      transform-origin: top center;
      transition: opacity 0.15s ease-in;

      &.firing {
        opacity: 1;
        animation: retroFlicker 0.05s infinite alternate;
      }
    }

    .retro-flame {
      filter: drop-shadow(0 0 16px #F97316) drop-shadow(0 0 28px #FDE047);
    }

    /* Touchdown HUD Banner */
    .touchdown-hud-banner {
      position: absolute;
      top: 6.5rem;
      inset-inline-start: 2rem;
      z-index: 10;
      width: 90%;
      max-width: 520px;
      padding: 1.75rem;
      opacity: 0;
      transform: translateY(-15px);
      transition: all 0.5s var(--ease-cinematic);

      @media (max-width: 768px) {
        inset-inline-start: 1rem;
        top: 5rem;
        padding: 1.25rem;
      }

      &.banner-active {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .banner-badge-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px dashed var(--border-line);
    }

    .passport-stamp-mini {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent-sand);
      border: 1px solid var(--accent-sand);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.08em;
    }

    .status-cleared-pill {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-success);
      background: rgba(62, 200, 125, 0.15);
      border: 1px solid var(--accent-success);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
    }

    .touchdown-title {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .touchdown-coords {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--accent-glow);
      margin-bottom: 1rem;
    }

    .lunar-stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(10, 14, 28, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 8px;
    }

    .stat-box {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .stat-l {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      color: var(--text-faint);
      letter-spacing: 0.08em;
    }

    .stat-v {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-primary);

      &.accent-green { color: var(--accent-success); }
      &.accent-gold { color: var(--accent-sand); }
    }

    /* Keyframes */
    @keyframes targetPulse {
      0%, 100% { opacity: 0.9; stroke: #F2CA8D; }
      50% { opacity: 0.4; stroke: #70B1ED; }
    }

    @keyframes retroFlicker {
      0% { transform: scaleY(0.9); }
      100% { transform: scaleY(1.1); }
    }

    @keyframes dustScatter {
      0% { transform: scale(0.6); opacity: 0.9; }
      100% { transform: scale(1.8) translateY(-15px); opacity: 0; }
    }
  `]
})
export class MoonLandingComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly masterTimeline = inject(MasterTimelineService);
  private readonly audio = inject(AudioService);

  readonly sceneContainer = viewChild<ElementRef<HTMLElement>>('sceneContainer');
  readonly moonTerrain = viewChild<ElementRef<HTMLElement>>('moonTerrain');
  readonly landerWrapper = viewChild<ElementRef<HTMLElement>>('landerWrapper');
  readonly landingLegs = viewChild<ElementRef<SVGElement>>('landingLegs');
  readonly retroThrusters = viewChild<ElementRef<SVGElement>>('retroThrusters');
  readonly dustPlume = viewChild<ElementRef<HTMLElement>>('dustPlume');
  readonly touchdownBanner = viewChild<ElementRef<HTMLElement>>('touchdownBanner');

  readonly isRetroFiring = signal<boolean>(false);
  readonly isDustActive = signal<boolean>(false);
  readonly isTouchdownConfirmed = signal<boolean>(false);

  private hasPlayedTouchdownAudio = false;

  constructor() {
    effect(() => {
      const p = this.masterTimeline.getSceneProgress(3); // 0.0 to 1.0 within Scene 4
      this.animateLandingDescent(p);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  private animateLandingDescent(p: number): void {
    const terrain = this.moonTerrain()?.nativeElement;
    const lander = this.landerWrapper()?.nativeElement;
    const legs = this.landingLegs()?.nativeElement;

    if (!lander || !terrain) return;

    // 1. Moon terrain grows upward to fill lower screen as we approach
    const terrainScale = 0.85 + p * 0.25;
    const terrainY = (1 - p) * 120;
    gsap.set(terrain, {
      scale: terrainScale,
      y: terrainY,
    });

    // 2. Rocket attitude: Starts angled, rotates upright for landing
    // Rotation goes from banking -28deg to 0deg (upright)
    const rotation = Math.max(0, (1 - p * 1.5)) * -28;

    // Vertical descent path:
    // Starts high (top: 15%), lowers steadily to touchdown zone on lunar surface
    const h = typeof window !== 'undefined' ? window.innerHeight : 1000;
    const landerY = p * (h * 0.45);

    gsap.set(lander, {
      y: landerY,
      rotate: rotation,
      scale: 0.8 + p * 0.35, // Grows closer to camera
    });

    // 3. Retro-thruster firing logic: fires during descent between 25% and 88%
    if (p > 0.25 && p < 0.90) {
      this.isRetroFiring.set(true);
    } else {
      this.isRetroFiring.set(false);
    }

    // 4. Legs deploy when close to ground (p > 0.55)
    if (legs) {
      if (p > 0.55) {
        const deployP = Math.min(1, (p - 0.55) / 0.25);
        gsap.set(legs, {
          transformOrigin: 'top center',
          scaleY: 0.6 + deployP * 0.4,
        });
      } else {
        gsap.set(legs, { scaleY: 0.6 });
      }
    }

    // 5. Dust plume active just before touchdown (p > 0.78 and < 0.96)
    if (p > 0.78 && p < 0.96) {
      this.isDustActive.set(true);
    } else {
      this.isDustActive.set(false);
    }

    // 6. Touchdown Confirmation (p >= 0.88): soft settle & HUD banner
    if (p >= 0.88) {
      this.isTouchdownConfirmed.set(true);
      if (!this.hasPlayedTouchdownAudio) {
        this.hasPlayedTouchdownAudio = true;
        this.audio.playBeep(1200, 0.2);
      }
    } else {
      this.isTouchdownConfirmed.set(false);
      this.hasPlayedTouchdownAudio = false;
    }
  }
}
