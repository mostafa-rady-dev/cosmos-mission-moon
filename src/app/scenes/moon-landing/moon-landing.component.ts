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

      <!-- Massive Layered Lunar Surface Craters (Photorealistic Mare Tranquillitatis Regolith) -->
      <div #moonTerrain class="moon-terrain-container">
        <div class="lunar-surface-photo-wrapper">
          <img
            src="assets/images/lunar_landing_regolith.jpg"
            alt="Photorealistic Mare Tranquillitatis Lunar Regolith and Impact Craters"
            class="lunar-surface-photorealistic-img"
          />
          <div class="lunar-surface-vignette" aria-hidden="true"></div>

          <!-- Touchdown Target Circle (Beacon Overlay on Photographic Regolith) -->
          <div class="touchdown-target-assembly" aria-hidden="true">
            <div class="target-circle-outer"></div>
            <div class="target-circle-inner"></div>
            <div class="target-crosshairs"></div>
            <span class="target-coordinates-pill">TRANQUILLITY BASE // 0.67408° N, 23.47297° E</span>
          </div>
        </div>

        <!-- Touchdown Regolith Dust Plumes -->
        <div #dustPlume class="dust-plume-group" [class.plume-active]="isDustActive()">
          <div class="dust-puff dust-1"></div>
          <div class="dust-puff dust-2"></div>
          <div class="dust-puff dust-3"></div>
          <div class="dust-puff dust-4"></div>
          <!-- Radial Regolith Ballistic Ejecta Fan -->
          <div class="ballistic-dust-fan" [class.ejecta-active]="isDustActive()">
            <div class="ejecta-streak es-1"></div>
            <div class="ejecta-streak es-2"></div>
            <div class="ejecta-streak es-3"></div>
            <div class="ejecta-streak es-4"></div>
          </div>
        </div>
      </div>

      <!-- Lunar Lander / Rocket Descending -->
      <div #landerWrapper class="lander-craft-assembly" [class.touchdown-settle]="isTouchdownConfirmed()">
        <div class="realistic-lander-mount">
          <!-- LiDAR Laser Rangefinder Altimeter -->
          <div class="lidar-altimeter-beam" [class.active]="isRetroFiring() && !isTouchdownConfirmed()">
            <div class="lidar-laser-line"></div>
            <div class="lidar-ground-spot"></div>
          </div>
          <img src="assets/images/lunar_lander_realistic.png" alt="Asyut Lunar Lander" class="lander-realistic-img" />
          <div class="retro-thruster-exhaust" [class.firing]="isRetroFiring()">
            <div class="retro-exhaust-beam"></div>
            <div class="retro-exhaust-glow"></div>
            <!-- Dynamic Heat Shimmer Radiating Downwards onto Regolith -->
            <div class="retro-heat-shimmer"></div>
          </div>
        </div>
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
          <div class="stat-box">
            <span class="stat-l">CONTACT SENSORS</span>
            <span class="stat-v accent-green">PROBES DEPLOYED // NOMINAL</span>
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
      background-image: url('/assets/images/deep-space-stars.png');
      background-size: cover;
      background-position: center top;
      opacity: 0.85;
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
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background-image: url('/assets/images/earth_realistic.jpg');
      background-size: cover;
      background-position: center;
      box-shadow: 0 0 25px rgba(56, 189, 248, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(112, 177, 237, 0.3);
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

    .lunar-surface-photo-wrapper {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      mask-image: linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%);
      -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%);
    }

    .lunar-surface-photorealistic-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
      filter: contrast(1.18) brightness(0.98);
    }

    .lunar-surface-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 65%, transparent 40%, rgba(3, 7, 21, 0.65) 90%),
                  linear-gradient(180deg, rgba(3, 7, 21, 0.45) 0%, transparent 35%);
      pointer-events: none;
    }

    .touchdown-target-assembly {
      position: absolute;
      bottom: 22%;
      left: 50%;
      transform: translate(-50%, 50%);
      width: 220px;
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .target-circle-outer {
      position: absolute;
      width: 160px;
      height: 48px;
      border-radius: 50%;
      border: 2px dashed var(--accent-glow);
      box-shadow: 0 0 15px rgba(54, 197, 240, 0.4);
      animation: targetPulse 2s infinite ease-in-out;
    }

    .target-circle-inner {
      position: absolute;
      width: 70px;
      height: 22px;
      border-radius: 50%;
      border: 1.5px solid rgba(56, 189, 248, 0.9);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
    }

    .target-crosshairs {
      position: absolute;
      width: 20px;
      height: 20px;
      &::before, &::after {
        content: '';
        position: absolute;
        background: var(--accent-glow);
      }
      &::before { left: 9px; top: 0; width: 2px; height: 100%; }
      &::after { top: 9px; left: 0; height: 2px; width: 100%; }
    }

    .target-coordinates-pill {
      position: absolute;
      bottom: -18px;
      font-family: var(--font-mono);
      font-size: 0.62rem;
      letter-spacing: 0.08em;
      color: var(--accent-glow);
      background: rgba(8, 11, 26, 0.75);
      border: 1px solid rgba(54, 197, 240, 0.4);
      padding: 0.15rem 0.45rem;
      border-radius: 3px;
      white-space: nowrap;
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

    /* Radial Ballistic Regolith Ejecta Fan */
    .ballistic-dust-fan {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.25s ease;

      &.ejecta-active {
        opacity: 0.9;
      }
    }

    .ejecta-streak {
      position: absolute;
      bottom: 10px;
      height: 4px;
      background: linear-gradient(90deg, rgba(203, 213, 225, 0.8) 0%, rgba(148, 163, 184, 0.3) 60%, transparent 100%);
      filter: blur(2px);
      animation: dustScatter 0.6s infinite ease-out;

      &.es-1 { width: 140px; left: -40px; transform: rotate(-8deg); }
      &.es-2 { width: 160px; right: -40px; transform: scaleX(-1) rotate(-8deg); animation-delay: 0.15s; }
      &.es-3 { width: 190px; left: -70px; transform: rotate(-14deg); animation-delay: 0.3s; }
      &.es-4 { width: 170px; right: -70px; transform: scaleX(-1) rotate(-14deg); animation-delay: 0.45s; }
    }

    /* LiDAR Laser Rangefinder Beam */
    .lidar-altimeter-beam {
      position: absolute;
      top: 75%;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 38vh;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease;
      z-index: 4;

      &.active {
        opacity: 0.9;
      }
    }

    .lidar-laser-line {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(56, 189, 248, 0.75) 60%, #FFFFFF 100%);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.6), 0 0 20px rgba(255, 255, 255, 0.4);
      animation: lidarSweep 2s infinite ease-in-out;
      transform-origin: top center;
    }

    .lidar-ground-spot {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 8px;
      border-radius: 50%;
      background: #FFFFFF;
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.8), 0 0 24px #FFFFFF;
      filter: blur(1.5px);
    }

    /* Lander Craft */
    .lander-craft-assembly {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translate(-50%, 0);
      width: 220px;
      height: 220px;
      z-index: 5;
      transform-origin: center center;

      &.touchdown-settle {
        animation: touchdownDamping 0.7s ease-out forwards;
      }
    }

    .realistic-lander-mount {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .lander-realistic-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: contrast(1.1) brightness(1.05) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.9));
    }

    .retro-thruster-exhaust {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 75px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease-in;

      &.firing {
        opacity: 1;
      }
    }

    .retro-exhaust-beam {
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at top, #FFFFFF 0%, #FDE047 30%, #F97316 65%, transparent 100%);
      filter: blur(5px);
      mix-blend-mode: screen;
      animation: plumeFlicker 0.05s infinite alternate;
    }

    .retro-exhaust-glow {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, rgba(249, 115, 22, 0.65) 0%, transparent 70%);
      filter: blur(12px);
      mix-blend-mode: screen;
    }

    .retro-heat-shimmer {
      position: absolute;
      top: 35px;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 110px;
      background: radial-gradient(ellipse at top, rgba(254, 215, 170, 0.45) 0%, rgba(249, 115, 22, 0.2) 40%, transparent 80%);
      filter: blur(8px);
      mix-blend-mode: screen;
      animation: heatTurbulence 0.1s infinite alternate;
      pointer-events: none;
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
      color: var(--accent-glow);
      border: 1px solid var(--accent-glow);
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
      &.accent-gold { color: var(--accent-glow); }
    }

    /* Keyframes */
    @keyframes targetPulse {
      0%, 100% { opacity: 0.9; stroke: var(--accent-glow); }
      50% { opacity: 0.4; stroke: var(--accent-primary); }
    }

    @keyframes retroFlicker {
      0% { transform: scaleY(0.9); }
      100% { transform: scaleY(1.1); }
    }

    @keyframes dustScatter {
      0% { transform: scale(0.6) translate(0, 0); opacity: 0.9; }
      100% { transform: scale(1.9) translateY(-18px); opacity: 0; }
    }

    @keyframes touchdownDamping {
      0% { transform: translate(-50%, 0); }
      35% { transform: translate(-50%, 6px) scale(1.01, 0.98); }
      70% { transform: translate(-50%, -2px) scale(0.995, 1.005); }
      100% { transform: translate(-50%, 0) scale(1, 1); }
    }

    @keyframes heatTurbulence {
      0% { transform: translateX(-50%) scaleX(0.94) scaleY(0.96); opacity: 0.7; }
      100% { transform: translateX(-50%) scaleX(1.06) scaleY(1.04); opacity: 1; }
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

    ngOnInit(): void { }

    ngOnDestroy(): void { }

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

        // 2. Pitch maneuver: Braking attitude (-32deg) -> Pitch over to vertical (0deg) for touchdown
        let rotation = 0;
        if (p <= 0.35) {
            rotation = -32;
        } else if (p < 0.75) {
            const pitchP = (p - 0.35) / 0.40;
            rotation = -32 * (1 - pitchP);
        } else {
            rotation = 0;
        }

        // Vertical descent path:
        const h = typeof window !== 'undefined' ? window.innerHeight : 1000;
        const landerY = p * (h * 0.45);

        gsap.set(lander, {
            y: landerY,
            rotate: rotation,
            scale: 0.8 + p * 0.35, // Grows closer to camera
        });

        // 3. Retro-thruster throttle modulation:
        // Braking (p: 0.20 - 0.50), terminal approach (p: 0.50 - 0.85), final touchdown (p: 0.85 - 0.92), cutoff (p >= 0.92)
        if (p > 0.20 && p < 0.92) {
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

        // 5. High-velocity ballistic regolith ejecta active right before touchdown (p >= 0.80 and < 0.94)
        if (p >= 0.80 && p < 0.94) {
            this.isDustActive.set(true);
        } else {
            this.isDustActive.set(false);
        }

        // 6. Touchdown Confirmation (p >= 0.92): contact sensor trip, engine cutoff, soft settle & HUD banner
        if (p >= 0.92) {
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
