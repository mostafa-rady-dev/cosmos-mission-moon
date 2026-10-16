import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  ElementRef,
  viewChild,
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
  selector: 'app-orbit',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section 
      #sceneContainer 
      class="scene-orbit"
      [style.opacity]="masterTimeline.getSceneVisibility(1).opacity"
      [attr.aria-label]="i18n.currentTranslations().atmosphereTitle"
    >
      <!-- Atmospheric Sky Gradient Transitioning to Cosmic Black -->
      <div #skyBg class="sky-gradient-layer"></div>

      <!-- High-altitude Clouds falling away -->
      <div #cloudLayer class="clouds-falling-layer">
        <div class="stratus-cloud c-1"></div>
        <div class="stratus-cloud c-2"></div>
        <div class="stratus-cloud c-3"></div>
      </div>

      <!-- Intensifying Starfield -->
      <div #starsLayer class="space-starfield">
        @for (star of stars; track $index) {
          <div 
            class="distant-star" 
            [style.top.%]="star.top"
            [style.left.%]="star.left"
            [style.width.px]="star.size"
            [style.height.px]="star.size"
            [style.opacity]="star.opacity"
          ></div>
        }
      </div>

      <!-- Curved Earth Horizon & Atmospheric Blue Rim -->
      <div #earthHorizon class="earth-horizon-wrapper">
        <svg viewBox="0 0 1920 1080" class="earth-svg" preserveAspectRatio="none">
          <defs>
            <radialGradient id="earthAtmosphere" cx="50%" cy="100%" r="65%">
              <stop offset="0%" stop-color="#1E3A8A"/>
              <stop offset="50%" stop-color="#0E1E4D"/>
              <stop offset="85%" stop-color="#38BDF8" stop-opacity="0.8"/>
              <stop offset="92%" stop-color="#70B1ED" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="#0A0E1C" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="earthOceans" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0A2540"/>
              <stop offset="40%" stop-color="#103B6B"/>
              <stop offset="100%" stop-color="#061826"/>
            </linearGradient>
            <filter id="auroraGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          <!-- Outer Atmospheric Halo Glow -->
          <ellipse cx="960" cy="1200" rx="1400" ry="750" fill="url(#earthAtmosphere)" filter="url(#auroraGlow)"/>

          <!-- Earth Surface Disc -->
          <ellipse cx="960" cy="1220" rx="1360" ry="700" fill="url(#earthOceans)"/>

          <!-- Continents (North Africa & Egypt Outline Highlighted with Nile River Glow) -->
          <g class="continent-shapes" opacity="0.85">
            <!-- Sinai & Red Sea Rift -->
            <path d="M920 620 Q960 580 980 630 T950 710 Z" fill="#2D4A3E" stroke="#70B1ED" stroke-width="0.5"/>
            <!-- Nile Delta & River Path Glow (Asyut highlighted) -->
            <path d="M940 590 L950 640 L955 690 L950 730" stroke="#70B1ED" stroke-width="2.5" fill="none" filter="drop-shadow(0 0 6px #70B1ED)"/>
            <!-- Asyut Ground Station Radiant Beacon -->
            <circle cx="953" cy="670" r="4" fill="#F2CA8D" class="ground-station-ping"/>
            <!-- Swirling Cloud Formations Over Oceans -->
            <path d="M600 680 Q750 630 900 670 T1250 650" stroke="#FFFFFF" stroke-width="12" stroke-opacity="0.3" stroke-linecap="round" fill="none"/>
            <path d="M800 750 Q1000 700 1200 740" stroke="#FFFFFF" stroke-width="16" stroke-opacity="0.25" stroke-linecap="round" fill="none"/>
          </g>
        </svg>
      </div>

      <!-- Rocket & Booster Assembly in Stage Separation -->
      <div #spacecraftWrapper class="spacecraft-container">
        <!-- Stage 1 Detached Booster (Tumbling Away) -->
        <div #boosterStage class="booster-stage">
          <svg viewBox="0 0 60 220" class="booster-svg">
            <rect x="10" y="0" width="40" height="180" rx="4" fill="#CBD5E1" stroke="#1E3A8A" stroke-width="1.5"/>
            <!-- Interstage vents -->
            <line x1="14" y1="20" x2="46" y2="20" stroke="#172130" stroke-width="3"/>
            <!-- Egyptian Ribbon on booster -->
            <rect x="25" y="40" width="10" height="30" fill="#EF4444"/>
            <rect x="25" y="70" width="10" height="30" fill="#FFFFFF"/>
            <rect x="25" y="100" width="10" height="30" fill="#0A0E1C"/>
            <!-- Engine bells with diminishing embers -->
            <polygon points="15,180 10,205 28,205 24,180" fill="#334155"/>
            <polygon points="36,180 32,205 50,205 45,180" fill="#334155"/>
            <!-- RCS Cold Gas Thruster Burst -->
            <circle cx="10" cy="15" r="3" fill="#70B1ED" class="rcs-puff"/>
          </svg>
        </div>

        <!-- Upper Stage 2 & Trans-Lunar Vehicle (Sustained Flight) -->
        <div #upperStage class="upper-stage">
          <svg viewBox="0 0 60 180" class="upper-stage-svg">
            <defs>
              <linearGradient id="orbitFlameGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="25%" stop-color="#70B1ED"/>
                <stop offset="65%" stop-color="#2A71D6"/>
                <stop offset="100%" stop-color="#1E3A8A" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <!-- Nose Cone & Crew Visor Window -->
            <polygon points="30,5 15,45 45,45" fill="#E2E8F0" stroke="#1E3A8A" stroke-width="1.5"/>
            <circle cx="30" cy="32" r="4.5" fill="#2A71D6" stroke="#70B1ED" stroke-width="1.5"/>
            <!-- Service Module Body -->
            <rect x="15" y="45" width="30" height="75" fill="#F8FAFC" stroke="#1E3A8A" stroke-width="1.5"/>
            <!-- Gold Foil Accent Band -->
            <rect x="15" y="58" width="30" height="12" fill="#F2CA8D"/>
            <text x="30" y="67" fill="#0A0E1C" font-size="5" font-weight="900" font-family="'Space Mono', monospace" text-anchor="middle">ASYUT</text>
            <!-- High-efficiency Vacuum Engine Bell -->
            <polygon points="22,120 16,145 44,145 38,120" fill="#1E293B" stroke="#70B1ED" stroke-width="1.5"/>
            <!-- Blue/Cyan Ion / Vacuum Thruster Glow -->
            <path d="M18 145 Q30 200 30 230 Q30 200 42 145 Z" fill="url(#orbitFlameGrad)" class="vacuum-plume"/>
          </svg>
        </div>
      </div>

      <!-- HUD Telemetry Card: Stage Separation & Orbit Confirmation -->
      <div #telemetryOverlay class="orbit-hud-card hud-panel">
        <div class="hud-card-header">
          <span class="passport-badge">
            <span class="pulse-dot"></span>
            <span>STAGE_02 // SEPARATION CONFIRMED</span>
          </span>
          <span class="hud-alt-badge">ALT: 320 KM</span>
        </div>

        <h2 class="hud-title">{{ i18n.currentTranslations().atmosphereTitle }}</h2>
        <p class="hud-desc">{{ i18n.currentTranslations().atmosphereDesc }}</p>

        <div class="hud-telemetry-strip">
          <div class="strip-item">
            <span class="strip-lbl">VELOCITY</span>
            <span class="strip-val">7.82 KM/S</span>
          </div>
          <div class="strip-item">
            <span class="strip-lbl">INCLINATION</span>
            <span class="strip-val">28.5°</span>
          </div>
          <div class="strip-item">
            <span class="strip-lbl">DOWNRANGE</span>
            <span class="strip-val">1,420 KM</span>
          </div>
        </div>

        <div class="status-indicator-row">
          <span class="check-icon">✓</span>
          <span>{{ i18n.currentTranslations().boosterSeparated }}</span>
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
      background: #0A0E1C;
    }

    .scene-orbit {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      transition: opacity 0.5s ease;
    }

    /* Sky Gradient: transitions from dusk blue to void black */
    .sky-gradient-layer {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, #030715 0%, #0A0E1C 50%, #161D39 100%);
      transition: background 1s ease;
    }

    /* Falling Clouds */
    .clouds-falling-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .stratus-cloud {
      position: absolute;
      background: radial-gradient(ellipse at center, rgba(226, 232, 240, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(25px);
    }

    .c-1 { width: 90vw; height: 35vh; top: 20%; left: -10%; }
    .c-2 { width: 80vw; height: 30vh; top: 40%; right: -15%; }
    .c-3 { width: 70vw; height: 25vh; top: 60%; left: 15%; }

    /* Space Starfield */
    .space-starfield {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .distant-star {
      position: absolute;
      background: #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 0 4px #70B1ED;
    }

    /* Earth Horizon Curve */
    .earth-horizon-wrapper {
      position: absolute;
      bottom: -15vh;
      left: 0;
      width: 100%;
      height: 80vh;
      pointer-events: none;
      transform-origin: bottom center;
    }

    .earth-svg {
      width: 100%;
      height: 100%;
      display: block;
      filter: drop-shadow(0 0 60px rgba(42, 113, 214, 0.4));
    }

    .ground-station-ping {
      animation: groundPing 2s infinite ease-out;
    }

    /* Spacecraft & Booster Separation */
    .spacecraft-container {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 380px;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .upper-stage {
      position: relative;
      z-index: 2;
      width: 60px;
      height: 180px;
    }

    .upper-stage-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.8));
    }

    .vacuum-plume {
      animation: plumeFlicker 0.08s infinite alternate;
      filter: drop-shadow(0 0 16px #38BDF8) drop-shadow(0 0 32px #1E3A8A);
    }

    .booster-stage {
      position: relative;
      z-index: 1;
      width: 60px;
      height: 200px;
      margin-top: -20px;
      transform-origin: top center;
    }

    .booster-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.7));
    }

    .rcs-puff {
      animation: rcsBurst 0.6s infinite ease-out;
    }

    /* Orbit HUD Card */
    .orbit-hud-card {
      position: absolute;
      top: 6.5rem;
      inset-inline-start: 2rem;
      z-index: 10;
      width: 90%;
      max-width: 440px;
      padding: 1.75rem;
      pointer-events: auto;

      @media (max-width: 768px) {
        inset-inline-start: 1rem;
        top: 5rem;
        padding: 1.25rem;
      }
    }

    .hud-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px dashed var(--border-line);
    }

    .hud-alt-badge {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-sand);
      background: rgba(242, 202, 141, 0.1);
      border: 1px solid rgba(242, 202, 141, 0.35);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    .hud-title {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #FFFFFF, var(--accent-glow));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hud-desc {
      font-size: 0.88rem;
      line-height: 1.6;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
    }

    .hud-telemetry-strip {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(10, 14, 28, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .strip-item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .strip-lbl {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      color: var(--text-faint);
      letter-spacing: 0.08em;
    }

    .strip-val {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-glow);
    }

    .status-indicator-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent-success);
    }

    .check-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: rgba(62, 200, 125, 0.2);
      border: 1px solid var(--accent-success);
      font-size: 0.7rem;
    }

    .pulse-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-glow);
      box-shadow: 0 0 6px var(--accent-glow);
      animation: groundPing 1.2s infinite;
    }

    /* Keyframes */
    @keyframes groundPing {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.6); opacity: 0.4; }
    }

    @keyframes plumeFlicker {
      0% { transform: scaleY(0.95); opacity: 0.9; }
      100% { transform: scaleY(1.08); opacity: 1; }
    }

    @keyframes rcsBurst {
      0% { transform: scale(0.5); opacity: 0; }
      50% { transform: scale(1.8); opacity: 1; }
      100% { transform: scale(2.4); opacity: 0; }
    }
  `]
})
export class OrbitComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly masterTimeline = inject(MasterTimelineService);
  private readonly audio = inject(AudioService);

  readonly sceneContainer = viewChild<ElementRef<HTMLElement>>('sceneContainer');
  readonly skyBg = viewChild<ElementRef<HTMLElement>>('skyBg');
  readonly cloudLayer = viewChild<ElementRef<HTMLElement>>('cloudLayer');
  readonly earthHorizon = viewChild<ElementRef<HTMLElement>>('earthHorizon');
  readonly boosterStage = viewChild<ElementRef<HTMLElement>>('boosterStage');
  readonly upperStage = viewChild<ElementRef<HTMLElement>>('upperStage');
  readonly telemetryOverlay = viewChild<ElementRef<HTMLElement>>('telemetryOverlay');

  readonly stars: { top: number; left: number; size: number; opacity: number }[] = [];

  constructor() {
    // Generate 60 randomized stars for the upper orbit
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        top: Math.random() * 85,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    // Reactively animate elements as scroll progresses inside scene range (0.15 - 0.30)
    effect(() => {
      const p = this.masterTimeline.getSceneProgress(1); // 0.0 to 1.0 within Scene 2
      this.applyProgressAnimation(p);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  private applyProgressAnimation(p: number): void {
    const clouds = this.cloudLayer()?.nativeElement;
    const earth = this.earthHorizon()?.nativeElement;
    const booster = this.boosterStage()?.nativeElement;
    const upper = this.upperStage()?.nativeElement;
    const telemetry = this.telemetryOverlay()?.nativeElement;

    if (clouds) {
      // Clouds fall away downwards and fade out as rocket ascends
      gsap.set(clouds, {
        y: p * 300,
        opacity: Math.max(0, 1 - p * 2),
      });
    }

    if (earth) {
      // Earth horizon sinks into the bottom corner and scales down to reveal global curve
      gsap.set(earth, {
        y: p * 180,
        scale: 1 - p * 0.28,
        x: p * -120, // Move towards bottom-left corner
      });
    }

    if (booster && upper) {
      // Stage separation sequence occurs around 40% into Scene 2
      if (p > 0.35) {
        const sepProgress = (p - 0.35) / 0.65;
        gsap.set(booster, {
          y: sepProgress * 320,
          x: sepProgress * -140, // Tumbles to side
          rotate: sepProgress * -45,
          opacity: Math.max(0, 1 - sepProgress * 1.3),
        });

        // Upper stage accelerates forward
        gsap.set(upper, {
          y: sepProgress * -120,
          scale: 1 + sepProgress * 0.15,
        });
      } else {
        gsap.set(booster, { y: 0, x: 0, rotate: 0, opacity: 1 });
        gsap.set(upper, { y: 0, scale: 1 });
      }
    }

    if (telemetry) {
      // Telemetry card fades in smoothly
      gsap.set(telemetry, {
        opacity: p < 0.1 ? p * 10 : p > 0.85 ? Math.max(0, (1 - p) * 6.6) : 1,
        y: (1 - Math.min(1, p * 3)) * 20,
      });
    }
  }
}
