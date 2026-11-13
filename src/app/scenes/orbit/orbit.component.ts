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

      <!-- Photorealistic Stratosphere Ascent View (Egypt & Nile Curve) -->
      <div #stratosphereLayer class="realistic-stratosphere-layer" aria-hidden="true">
        <div class="stratosphere-image" style="background-image: url('/assets/images/rocket_stratosphere.jpg');"></div>
        <div class="stratosphere-overlay"></div>
      </div>

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

      <!-- Solar Limb Corona Starburst Flare -->
      <div class="solar-limb-corona" aria-hidden="true">
        <div class="sun-core"></div>
        <div class="sun-flare-rays"></div>
      </div>

      <!-- Curved Earth Horizon & Atmospheric Blue Rim (Photorealistic Low Earth Orbit Asset) -->
      <div #earthHorizon class="earth-horizon-wrapper">
        <img
          src="assets/images/earth_horizon_photorealistic.jpg"
          alt="Photorealistic Earth Curved Limb from Low Earth Orbit"
          class="earth-photorealistic-img"
        />
        <div class="earth-atmospheric-limb-glow" aria-hidden="true"></div>
        <div class="ground-station-overlay" aria-hidden="true">
          <div class="ground-station-ping"></div>
          <span class="ground-station-callout">ASYUT TRACKING COMPLEX // 27.18° N 31.18° E</span>
        </div>
      </div>

      <!-- Rocket & Booster Assembly in Stage Separation -->
      <div #spacecraftWrapper class="spacecraft-container">
        <!-- Interstage Cold-Gas Separation Vents -->
        <div class="staging-gas-assembly" [class.firing]="isSeparating()" aria-hidden="true">
          <div class="coldgas-cloud left-gas"></div>
          <div class="coldgas-cloud right-gas"></div>
        </div>

        <!-- Stage 1 Detached Booster (Tumbling Away) -->
        <div #boosterStage class="booster-stage">
          <img src="assets/images/booster_realistic.png" alt="Spent Booster Stage" class="booster-realistic-img" />
        </div>

        <!-- Upper Stage 2 & Trans-Lunar Vehicle (Photorealistic Sustained Flight) -->
        <div #upperStage class="upper-stage realistic-orbit-stage">
          <!-- RCS Cold-gas Thruster Jets -->
          <div class="rcs-thrusters-cluster" [class.rcs-firing]="isSeparating()">
            <div class="rcs-jet rcs-left"></div>
            <div class="rcs-jet rcs-right"></div>
          </div>
          <img src="assets/images/cruiser_realistic.png" alt="Realistic Upper Stage" class="orbit-craft-img" width="140" height="78" />
          <div class="orbit-thruster-beam"></div>
        </div>
      </div>

      <!-- HUD Telemetry Card: Stage Separation & Orbit Confirmation -->
      <div #telemetryOverlay class="orbit-hud-card hud-panel">
        <div class="hud-card-header">
          <span class="passport-badge">
            <span class="pulse-dot"></span>
            <span>STAGE_02 // SEPARATION CONFIRMED</span>
          </span>
          <span class="hud-alt-badge" dir="ltr">ALT: 320 KM</span>
        </div>

        <h2 class="hud-title">{{ i18n.currentTranslations().atmosphereTitle }}</h2>
        <p class="hud-desc">{{ i18n.currentTranslations().atmosphereDesc }}</p>

        <div class="hud-telemetry-strip">
          <div class="strip-item">
            <span class="strip-lbl">VELOCITY</span>
            <span class="strip-val" dir="ltr">7.82 KM/S</span>
          </div>
          <div class="strip-item">
            <span class="strip-lbl">INCLINATION</span>
            <span class="strip-val" dir="ltr">28.5°</span>
          </div>
          <div class="strip-item">
            <span class="strip-lbl">DOWNRANGE</span>
            <span class="strip-val" dir="ltr">1,420 KM</span>
          </div>
        </div>

        <div class="orbital-vectors-strip">
          <span class="vector-tag"><span class="orbit-live-dot"></span> ORBIT: STABLE INSERTION</span>
          <span class="vector-tag">APOAPSIS: 324 KM</span>
          <span class="vector-tag">PERIAPSIS: 318 KM</span>
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

    /* Photorealistic Stratosphere Layer */
    .realistic-stratosphere-layer {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
    }

    .stratosphere-image {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center center;
      opacity: 0.68;
      filter: saturate(1.15) contrast(1.1);
      transform: scale(1.03);
    }

    .stratosphere-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, transparent 45%, #030715 95%),
                  linear-gradient(180deg, rgba(3, 7, 21, 0.4) 0%, transparent 40%, rgba(3, 7, 21, 0.8) 100%);
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
      bottom: -8vh;
      left: 0;
      width: 100%;
      height: 75vh;
      pointer-events: none;
      transform-origin: bottom center;
      overflow: hidden;
    }

    .earth-photorealistic-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center bottom;
      filter: contrast(1.15) brightness(1.05) saturate(1.1);
      mask-image: radial-gradient(ellipse 100% 90% at 50% 90%, black 72%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse 100% 90% at 50% 90%, black 72%, transparent 100%);
    }

    .earth-atmospheric-limb-glow {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(ellipse 90% 50% at 50% 55%, rgba(56, 189, 248, 0.35) 0%, rgba(130, 210, 255, 0.15) 35%, transparent 70%);
      mix-blend-mode: screen;
    }

    .ground-station-overlay {
      position: absolute;
      bottom: 20%;
      left: 36%;
      transform: translate(-50%, 0);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .ground-station-callout {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: var(--accent-glow);
      background: rgba(8, 11, 26, 0.7);
      border: 1px solid rgba(54, 197, 240, 0.35);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      white-space: nowrap;
    }

    /* Solar Limb Corona Starburst */
    .solar-limb-corona {
      position: absolute;
      top: 14%;
      right: 12%;
      width: 160px;
      height: 160px;
      pointer-events: none;
      z-index: 2;
    }

    .sun-core {
      position: absolute;
      inset: 20%;
      border-radius: 50%;
      background: radial-gradient(circle, #FFFFFF 0%, #E0F2FE 40%, rgba(56, 189, 248, 0.4) 70%, transparent 100%);
      filter: blur(10px) drop-shadow(0 0 40px #38BDF8) drop-shadow(0 0 80px #fff);
      animation: pulseAnim 3s infinite ease-in-out;
    }

    .sun-flare-rays {
      position: absolute;
      inset: -50%;
      background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, rgba(54, 197, 240, 0.15) 30%, transparent 70%);
      filter: blur(14px);
    }

    /* RCS Cold-gas Thrusters */
    .rcs-thrusters-cluster {
      position: absolute;
      top: 35%;
      width: 100%;
      opacity: 0;
      transition: opacity 0.2s ease;

      &.rcs-firing {
        opacity: 1;
      }
    }

    .rcs-jet {
      position: absolute;
      width: 20px;
      height: 6px;
      background: radial-gradient(ellipse at center, #FFFFFF 0%, #36C5F0 60%, transparent 100%);
      filter: blur(2px);
      animation: thrusterPulse 0.08s infinite alternate;

      &.rcs-left {
        left: -8px;
        transform: rotate(-15deg);
      }

      &.rcs-right {
        right: -8px;
        transform: rotate(15deg);
      }
    }

    .orbital-vectors-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      margin-top: 0.85rem;
      padding-top: 0.65rem;
      border-top: 1px dashed rgba(244, 245, 255, 0.12);
    }

    .vector-tag {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-glow);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .orbit-live-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent-success);
      box-shadow: 0 0 6px var(--accent-success);
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
      width: 140px;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .orbit-craft-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transform: rotate(-90deg);
      filter: contrast(1.1) brightness(1.05) drop-shadow(0 0 15px rgba(56, 189, 248, 0.4));
    }

    .orbit-thruster-beam {
      position: absolute;
      bottom: -22px;
      left: 50%;
      transform: translateX(-50%);
      width: 44px;
      height: 95px;
      background: radial-gradient(ellipse 65% 100% at 50% 0%, rgba(255, 255, 255, 0.95) 0%, rgba(186, 230, 253, 0.6) 28%, rgba(56, 189, 248, 0.22) 60%, transparent 88%);
      filter: blur(5px);
      mix-blend-mode: screen;
      animation: plumeFlicker 0.05s infinite alternate;
    }

    /* Interstage Cold-Gas Separation Vents */
    .staging-gas-assembly {
      position: absolute;
      top: 48%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 140px;
      height: 60px;
      pointer-events: none;
      z-index: 4;
      opacity: 0;
      transition: opacity 0.2s ease;

      &.firing {
        opacity: 1;
      }
    }

    .coldgas-cloud {
      position: absolute;
      top: 10px;
      width: 45px;
      height: 30px;
      border-radius: 50%;
      background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.85) 0%, rgba(220, 235, 255, 0.4) 45%, transparent 75%);
      filter: blur(6px);
      animation: coldGasExpand 0.5s infinite ease-out;

      &.left-gas {
        left: 10px;
        transform-origin: right center;
      }
      &.right-gas {
        right: 10px;
        transform-origin: left center;
        animation-delay: 0.08s;
      }
    }

    .booster-stage {
      position: relative;
      z-index: 1;
      width: 130px;
      height: 220px;
      margin-top: -35px;
      transform-origin: top center;
    }

    .booster-realistic-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: contrast(1.1) brightness(1.05) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.8));
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
      color: var(--accent-glow);
      background: rgba(54, 197, 240, 0.1);
      border: 1px solid rgba(54, 197, 240, 0.35);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      direction: ltr;
      unicode-bidi: isolate;
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

    @keyframes coldGasExpand {
      0% { transform: scale(0.4); opacity: 0.9; }
      100% { transform: scale(2.2); opacity: 0; }
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
  readonly stratosphereLayer = viewChild<ElementRef<HTMLElement>>('stratosphereLayer');
  readonly cloudLayer = viewChild<ElementRef<HTMLElement>>('cloudLayer');
  readonly earthHorizon = viewChild<ElementRef<HTMLElement>>('earthHorizon');
  readonly boosterStage = viewChild<ElementRef<HTMLElement>>('boosterStage');
  readonly upperStage = viewChild<ElementRef<HTMLElement>>('upperStage');
  readonly telemetryOverlay = viewChild<ElementRef<HTMLElement>>('telemetryOverlay');

  readonly stars: { top: number; left: number; size: number; opacity: number }[] = [];
  readonly isSeparating = signal<boolean>(false);
  private hasPlayedSeparationAudio = false;

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
    const stratosphere = this.stratosphereLayer()?.nativeElement;
    const clouds = this.cloudLayer()?.nativeElement;
    const earth = this.earthHorizon()?.nativeElement;
    const booster = this.boosterStage()?.nativeElement;
    const upper = this.upperStage()?.nativeElement;
    const telemetry = this.telemetryOverlay()?.nativeElement;

    if (stratosphere) {
      // Stratosphere view falls away downwards and fades out into deep space
      gsap.set(stratosphere, {
        y: p * 180,
        opacity: Math.max(0, 0.7 - p * 0.8),
        scale: 1 + p * 0.1,
      });
    }

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
      // Stage separation sequence occurs around 32% into Scene 2
      if (p > 0.32) {
        this.isSeparating.set(p < 0.62);
        if (!this.hasPlayedSeparationAudio && p >= 0.33) {
          this.hasPlayedSeparationAudio = true;
          this.audio.playBeep(1450, 0.15);
        }

        const sepProgress = (p - 0.32) / 0.68;
        // Physical booster tumble away downwards and left with negative pitch
        gsap.set(booster, {
          y: sepProgress * 360,
          x: sepProgress * -150,
          rotate: sepProgress * -42,
          opacity: Math.max(0, 1 - sepProgress * 1.25),
        });

        // Pitch maneuver: Upper stage rotates towards 28.5deg orbital inclination vector
        const pitchAngle = Math.min(28.5, sepProgress * 32);
        const downrangeX = sepProgress * 150;
        const orbitalY = -sepProgress * 130;

        gsap.set(upper, {
          x: downrangeX,
          y: orbitalY,
          rotate: pitchAngle,
          scale: 1 + sepProgress * 0.14,
        });
      } else {
        this.isSeparating.set(false);
        if (p < 0.2) {
          this.hasPlayedSeparationAudio = false;
        }
        gsap.set(booster, { y: 0, x: 0, rotate: 0, opacity: 1 });
        gsap.set(upper, { x: 0, y: 0, rotate: 0, scale: 1 });
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
