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

interface PlanetInfo {
  id: string;
  nameKey: 'planetEarth' | 'planetMars' | 'planetJupiter' | 'planetSaturn';
  factKey: 'planetEarthFact' | 'planetMarsFact' | 'planetJupiterFact' | 'planetSaturnFact';
  triggerAt: number; // 0.0 to 1.0 within Scene 3
  color: string;
  size: number;
}

@Component({
  selector: 'app-solar-system',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section 
      #sceneContainer 
      class="scene-solar"
      [style.opacity]="masterTimeline.getSceneVisibility(2).opacity"
      [attr.aria-label]="i18n.currentTranslations().solarSystemTitle"
    >
      <!-- Deep Space Starfield Backdrop from User Upload -->
      <div #deepSpaceBackdrop class="deep-space-backdrop" aria-hidden="true">
        <div class="deep-space-image"></div>
        <div class="deep-space-overlay"></div>
      </div>

      <!-- Cosmic Deep Space Nebulae & Speed Streaks -->
      <div class="nebula-cloud nebula-1"></div>
      <div class="nebula-cloud nebula-2"></div>
      <div class="speed-streaks-container">
        <div class="streak streak-1"></div>
        <div class="streak streak-2"></div>
        <div class="streak streak-3"></div>
      </div>

      <!-- Shooting Stars -->
      <div class="shooting-star star-1"></div>
      <div class="shooting-star star-2"></div>

      <!-- Orbital Flight Guide SVG Path -->
      <svg viewBox="0 0 1920 1080" class="orbit-path-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pathGlowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6"/>
            <stop offset="50%" stop-color="#70B1ED" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#F2CA8D" stop-opacity="0.9"/>
          </linearGradient>
        </defs>
        <!-- Spline Corridor Path -->
        <path 
          #flightPath
          d="M -100 850 Q 400 680 750 480 T 1450 320 T 2100 150" 
          fill="none" 
          stroke="url(#pathGlowGrad)" 
          stroke-width="2" 
          stroke-dasharray="10 14"
          opacity="0.45"
        />
      </svg>

      <!-- Celestial Planets Layer (Parallax across depths) -->
      <!-- 1. Planet Earth (receding behind) -->
      <div #earthPlanet class="celestial-body planet-earth">
        <div class="planet-sphere earth-sphere">
          <img src="/assets/images/earth_realistic.jpg" alt="Planet Earth" class="planet-img" />
          <div class="atmosphere-halo"></div>
        </div>
        <div class="planet-label-glass hud-panel" [class.label-visible]="activePlanet() === 'earth'">
          <span class="planet-title">{{ i18n.currentTranslations().planetEarth }}</span>
          <span class="planet-fact">{{ i18n.currentTranslations().planetEarthFact }}</span>
        </div>
      </div>

      <!-- 2. Planet Mars (Rusty Red & Canyon) -->
      <div #marsPlanet class="celestial-body planet-mars">
        <div class="planet-sphere mars-sphere">
          <img src="/assets/images/mars_realistic.jpg" alt="Planet Mars" class="planet-img" />
          <div class="atmosphere-halo mars-halo"></div>
        </div>
        <div class="planet-label-glass hud-panel" [class.label-visible]="activePlanet() === 'mars'">
          <span class="planet-title">{{ i18n.currentTranslations().planetMars }}</span>
          <span class="planet-fact">{{ i18n.currentTranslations().planetMarsFact }}</span>
        </div>
      </div>

      <!-- 3. Planet Jupiter (Great Red Spot & Cloud Bands) -->
      <div #jupiterPlanet class="celestial-body planet-jupiter">
        <div class="planet-sphere jupiter-sphere">
          <img src="/assets/images/jupiter_realistic.jpg" alt="Planet Jupiter" class="planet-img" />
          <div class="atmosphere-halo jupiter-halo"></div>
        </div>
        <div class="planet-label-glass hud-panel" [class.label-visible]="activePlanet() === 'jupiter'">
          <span class="planet-title">{{ i18n.currentTranslations().planetJupiter }}</span>
          <span class="planet-fact">{{ i18n.currentTranslations().planetJupiterFact }}</span>
        </div>
      </div>

      <!-- 4. Planet Saturn (Golden Rings) -->
      <div #saturnPlanet class="celestial-body planet-saturn">
        <div class="saturn-system">
          <img src="assets/images/saturn_realistic.png" alt="Planet Saturn" class="saturn-realistic-img" />
        </div>
        <div class="planet-label-glass hud-panel" [class.label-visible]="activePlanet() === 'saturn'">
          <span class="planet-title">{{ i18n.currentTranslations().planetSaturn }}</span>
          <span class="planet-fact">{{ i18n.currentTranslations().planetSaturnFact }}</span>
        </div>
      </div>

      <!-- Approaching Moon in Distance (grows near end of scene) -->
      <div #moonApproach class="approaching-moon">
        <div class="moon-sphere">
          <img src="/assets/images/moon_realistic.jpg" alt="The Moon" class="planet-img moon-img" />
          <div class="atmosphere-halo moon-halo"></div>
        </div>
        <div class="moon-target-hud">
          <span class="target-crosshair">+</span>
          <span class="target-label">DESTINATION: LUNA // MARE TRANQUILLITATIS</span>
        </div>
      </div>

      <!-- Trans-Lunar Realistic Spacecraft Cruiser Following Motion Path -->
      <div #rocketShip class="cruising-rocket">
        <div class="realistic-cruiser-wrapper">
          <img src="assets/images/cruiser_realistic.png" alt="Asyut Deep Space Cruiser" class="cruiser-realistic-img" />
          <div class="engine-thrust-glow"></div>
        </div>
      </div>

      <!-- Top Route HUD Card -->
      <div class="route-hud-banner hud-panel">
        <div class="banner-left">
          <span class="passport-badge">
            <span class="pulse-dot"></span>
            <span>TRANSLUNAR NAVIGATION CORRIDOR</span>
          </span>
          <h2 class="route-title">{{ i18n.currentTranslations().solarSystemTitle }}</h2>
        </div>
        <div class="banner-telemetry">
          <div class="tel-item">
            <span class="tel-lbl">WAYPOINT</span>
            <span class="tel-val">{{ activePlanetLabel() }}</span>
          </div>
          <div class="tel-item">
            <span class="tel-lbl">CRUISING SPEED</span>
            <span class="tel-val">10.84 KM/S</span>
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

    .scene-solar {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    /* Deep Space Starfield Backdrop from User Upload */
    .deep-space-backdrop {
      position: absolute;
      inset: -5%;
      width: 110%;
      height: 110%;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .deep-space-image {
      width: 100%;
      height: 100%;
      background-image: url('/assets/images/deep-space-stars.png');
      background-size: cover;
      background-position: center center;
      background-repeat: repeat;
      opacity: 0.92;
      filter: contrast(1.15) brightness(1.1);
      transform: scale(1.04);
    }

    .deep-space-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(3, 7, 21, 0.2) 0%, rgba(3, 7, 21, 0.8) 85%, #030715 100%),
                  linear-gradient(180deg, rgba(3, 7, 21, 0.5) 0%, transparent 40%, rgba(3, 7, 21, 0.7) 100%);
    }

    /* Nebulae & Speed Streaks */
    .nebula-cloud {
      position: absolute;
      border-radius: 50%;
      filter: blur(70px);
      pointer-events: none;
      opacity: 0.25;
      z-index: 1;
    }

    .nebula-1 {
      width: 60vw;
      height: 45vh;
      top: 10%;
      left: 15%;
      background: radial-gradient(circle, #2A71D6 0%, #161D39 70%, transparent 100%);
    }

    .nebula-2 {
      width: 55vw;
      height: 40vh;
      bottom: 10%;
      right: 10%;
      background: radial-gradient(circle, #70B1ED 0%, #0E1428 65%, transparent 100%);
      opacity: 0.18;
    }

    .speed-streaks-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .streak {
      position: absolute;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(112, 177, 237, 0.4), transparent);
      animation: speedStreak 2.5s infinite linear;
    }

    .streak-1 { top: 25%; left: 0; width: 220px; animation-delay: 0.2s; }
    .streak-2 { top: 60%; left: 20%; width: 340px; animation-delay: 1.1s; }
    .streak-3 { top: 78%; left: 10%; width: 280px; animation-delay: 1.8s; }

    .shooting-star {
      position: absolute;
      width: 120px;
      height: 2px;
      background: linear-gradient(90deg, #FFFFFF, rgba(242, 202, 141, 0.8), transparent);
      border-radius: 999px;
      transform: rotate(-35deg);
      opacity: 0;
      animation: shoot 4s infinite ease-out;
    }

    .star-1 { top: 18%; left: 45%; animation-delay: 1s; }
    .star-2 { top: 40%; left: 70%; animation-delay: 3.2s; }

    .orbit-path-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    /* Cruising Realistic Spacecraft */
    .cruising-rocket {
      position: absolute;
      width: 250px;
      height: 140px;
      z-index: 5;
      transform-origin: 65% 50%;
      pointer-events: none;
      filter: drop-shadow(0 0 25px rgba(56, 189, 248, 0.4));
    }

    .realistic-cruiser-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cruiser-realistic-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: contrast(1.1) brightness(1.05) drop-shadow(0 0 15px rgba(56, 189, 248, 0.45));
      transform: scale(1.05);
    }

    .engine-thrust-glow {
      position: absolute;
      left: 10%;
      top: 50%;
      transform: translateY(-50%);
      width: 80px;
      height: 80px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.95) 0%, rgba(42, 113, 214, 0.5) 45%, transparent 75%);
      filter: blur(12px);
      mix-blend-mode: screen;
      pointer-events: none;
      animation: ionThrust 0.08s infinite alternate;
    }

    /* Celestial Bodies */
    .celestial-body {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
      z-index: 3;
    }

    .planet-sphere {
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);
      transition: transform 0.4s ease;
    }

    .planet-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      display: block;
      filter: contrast(1.1) brightness(1.03);
    }

    /* Planet Earth */
    .planet-earth {
      top: 60%;
      left: 10%;
    }
    .earth-sphere {
      width: 125px;
      height: 125px;
      box-shadow: 0 0 45px rgba(56, 189, 248, 0.5), inset 0 0 20px rgba(10, 37, 64, 0.8);
    }
    .atmosphere-halo {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(112, 177, 237, 0.6);
      filter: blur(4px);
      pointer-events: none;
    }

    /* Planet Mars */
    .planet-mars {
      top: 26%;
      left: 35%;
    }
    .mars-sphere {
      width: 95px;
      height: 95px;
      box-shadow: 0 0 38px rgba(248, 113, 113, 0.45);
    }
    .mars-halo {
      border-color: rgba(248, 113, 113, 0.6);
      filter: blur(5px);
    }

    /* Planet Jupiter */
    .planet-jupiter {
      top: 40%;
      left: 58%;
    }
    .jupiter-sphere {
      width: 175px;
      height: 175px;
      box-shadow: 0 0 55px rgba(217, 119, 6, 0.45);
    }
    .jupiter-halo {
      border-color: rgba(245, 158, 11, 0.5);
      filter: blur(6px);
    }

    /* Planet Saturn */
    .planet-saturn {
      top: 18%;
      left: 77%;
    }
    .saturn-system {
      position: relative;
      width: 220px;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 35px rgba(242, 202, 141, 0.4));
    }
    .saturn-realistic-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: contrast(1.05) brightness(1.02);
      transform: rotate(4deg);
    }

    /* Approaching Moon */
    .approaching-moon {
      position: absolute;
      top: 38%;
      right: 4%;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 4;
      pointer-events: none;
      transform-origin: center center;
    }

    .moon-sphere {
      width: 135px;
      height: 135px;
      border-radius: 50%;
      box-shadow: 0 0 50px rgba(248, 250, 252, 0.4);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .moon-img {
      filter: contrast(1.15) brightness(1.05);
    }

    .moon-halo {
      border-color: rgba(226, 232, 240, 0.45);
      filter: blur(5px);
    }

    .moon-target-hud {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--accent-sand);
      background: rgba(10, 14, 28, 0.7);
      border: 1px dashed var(--accent-sand);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
    }

    .target-crosshair {
      color: var(--accent-glow);
      font-weight: 700;
    }

    /* Planet Glass Labels */
    .planet-label-glass {
      margin-top: 1rem;
      padding: 0.75rem 1.25rem;
      max-width: 260px;
      text-align: center;
      opacity: 0;
      transform: translateY(10px) scale(0.95);
      transition: all 0.35s var(--ease-cinematic);

      &.label-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .planet-title {
      display: block;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1rem;
      color: var(--accent-glow);
      margin-bottom: 0.2rem;
    }

    .planet-fact {
      display: block;
      font-size: 0.78rem;
      line-height: 1.4;
      color: var(--text-muted);
    }

    /* Route HUD Banner */
    .route-hud-banner {
      position: absolute;
      top: 6.5rem;
      inset-inline-start: 2rem;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      padding: 1rem 1.75rem;
      max-width: 680px;

      @media (max-width: 768px) {
        inset-inline-start: 1rem;
        top: 5rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
      }
    }

    .route-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-top: 0.25rem;
    }

    .banner-telemetry {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .tel-item {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .tel-lbl {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      color: var(--text-faint);
      letter-spacing: 0.08em;
    }

    .tel-val {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--accent-sand);
    }

    .pulse-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-glow);
      box-shadow: 0 0 6px var(--accent-glow);
    }

    /* Keyframes */
    @keyframes ionThrust {
      0% { transform: scaleX(0.9); opacity: 0.85; }
      100% { transform: scaleX(1.15); opacity: 1; }
    }

    @keyframes speedStreak {
      0% { transform: translateX(100vw); opacity: 0; }
      50% { opacity: 0.7; }
      100% { transform: translateX(-20vw); opacity: 0; }
    }

    @keyframes shoot {
      0% { transform: translate(0, 0) rotate(-35deg); opacity: 0; }
      15% { opacity: 1; }
      35% { transform: translate(-300px, 200px) rotate(-35deg); opacity: 0; }
      100% { transform: translate(-300px, 200px) rotate(-35deg); opacity: 0; }
    }
  `]
})
export class SolarSystemComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly masterTimeline = inject(MasterTimelineService);

  readonly rocketShip = viewChild<ElementRef<HTMLElement>>('rocketShip');
  readonly deepSpaceBackdrop = viewChild<ElementRef<HTMLElement>>('deepSpaceBackdrop');
  readonly earthPlanet = viewChild<ElementRef<HTMLElement>>('earthPlanet');
  readonly marsPlanet = viewChild<ElementRef<HTMLElement>>('marsPlanet');
  readonly jupiterPlanet = viewChild<ElementRef<HTMLElement>>('jupiterPlanet');
  readonly saturnPlanet = viewChild<ElementRef<HTMLElement>>('saturnPlanet');
  readonly moonApproach = viewChild<ElementRef<HTMLElement>>('moonApproach');

  readonly activePlanet = signal<'earth' | 'mars' | 'jupiter' | 'saturn' | 'moon' | null>('earth');
  readonly activePlanetLabel = signal<string>('EARTH');

  constructor() {
    effect(() => {
      const p = this.masterTimeline.getSceneProgress(2); // 0.0 to 1.0 within Scene 3
      this.animateFlightRoute(p);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  private animateFlightRoute(p: number): void {
    const rocket = this.rocketShip()?.nativeElement;
    const deepSpace = this.deepSpaceBackdrop()?.nativeElement;
    const earth = this.earthPlanet()?.nativeElement;
    const mars = this.marsPlanet()?.nativeElement;
    const jupiter = this.jupiterPlanet()?.nativeElement;
    const saturn = this.saturnPlanet()?.nativeElement;
    const moon = this.moonApproach()?.nativeElement;

    if (deepSpace) {
      // Subtle parallax camera motion across the deep space starfield
      gsap.set(deepSpace, {
        x: p * -60,
        y: p * -30,
        scale: 1 + p * 0.04,
      });
    }

    if (!rocket) return;

    // Curved Spline Motion Path Coordinate Calculation:
    // P0(-100, 850) -> P1(400, 680) -> P2(750, 480) -> P3(1450, 320) -> P4(2100, 150)
    // Bezier evaluation across window dimensions
    const w = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const h = typeof window !== 'undefined' ? window.innerHeight : 1080;

    const startX = -60;
    const endX = w * 0.82;
    const startY = h * 0.78;
    const endY = h * 0.38;

    // Smooth sinusoidal curved path
    const currentX = startX + (endX - startX) * p;
    const arcHeight = Math.sin(p * Math.PI) * (h * 0.22);
    const currentY = startY + (endY - startY) * p - arcHeight;

    // Banking angle derived from slope derivative
    const tangentDy = (endY - startY) - Math.cos(p * Math.PI) * (h * 0.22) * Math.PI;
    const tangentDx = endX - startX;
    const bankAngle = Math.atan2(tangentDy, tangentDx) * (180 / Math.PI);

    gsap.set(rocket, {
      x: currentX,
      y: currentY,
      rotate: bankAngle,
    });

    // Parallax depth shifts for celestial bodies
    if (earth) {
      gsap.set(earth, {
        x: p * -180,
        y: p * 80,
        scale: Math.max(0.4, 1 - p * 0.7),
        opacity: Math.max(0, 1 - p * 2.8),
      });
    }

    if (mars) {
      gsap.set(mars, {
        x: (p - 0.25) * -140,
        y: (p - 0.25) * 60,
      });
    }

    if (jupiter) {
      gsap.set(jupiter, {
        x: (p - 0.55) * -180,
        y: (p - 0.55) * 50,
      });
    }

    if (saturn) {
      gsap.set(saturn, {
        x: (p - 0.75) * -160,
        y: (p - 0.75) * 40,
      });
    }

    if (moon) {
      // Moon emerges from distance and grows
      const moonScale = Math.min(2.2, 0.4 + Math.max(0, p - 0.5) * 3.6);
      const moonOpacity = Math.min(1, Math.max(0, (p - 0.4) * 2.5));
      gsap.set(moon, {
        scale: moonScale,
        opacity: moonOpacity,
        x: (1 - p) * 120,
      });
    }

    // Determine active planet label based on progress checkpoints
    if (p < 0.22) {
      this.activePlanet.set('earth');
      this.activePlanetLabel.set(this.i18n.currentTranslations().planetEarth);
    } else if (p >= 0.22 && p < 0.48) {
      this.activePlanet.set('mars');
      this.activePlanetLabel.set(this.i18n.currentTranslations().planetMars);
    } else if (p >= 0.48 && p < 0.72) {
      this.activePlanet.set('jupiter');
      this.activePlanetLabel.set(this.i18n.currentTranslations().planetJupiter);
    } else if (p >= 0.72 && p < 0.88) {
      this.activePlanet.set('saturn');
      this.activePlanetLabel.set(this.i18n.currentTranslations().planetSaturn);
    } else {
      this.activePlanet.set('moon');
      this.activePlanetLabel.set('LUNA // MOON APPROACH');
    }
  }
}
