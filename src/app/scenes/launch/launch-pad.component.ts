import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  ElementRef,
  viewChild,
  OnInit,
  OnDestroy,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { I18nService } from '../../core/i18n.service';
import { AudioService } from '../../core/audio.service';
import { ScrollService } from '../../core/scroll.service';
import { MasterTimelineService } from '../../core/master-timeline.service';
import { MotionPrefsService } from '../../core/motion-prefs.service';

@Component({
  selector: 'app-launch-pad',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section 
      #sceneContainer
      class="scene-launch"
      [class.shaking]="isShaking()"
      [attr.aria-label]="i18n.currentTranslations().launchTitle"
    >
      <!-- Parallax Layer 1: Celestial Sky & Stars -->
      <div #skyLayer class="parallax-layer sky-layer">
        <canvas #starfieldCanvas class="starfield-canvas"></canvas>
        <div class="celestial-glow"></div>
        <div class="drifting-cloud cloud-1"></div>
        <div class="drifting-cloud cloud-2"></div>
      </div>

      <!-- Photorealistic Asyut Barrage Launch Complex Backdrop -->
      <div #realisticBackdrop class="realistic-asyut-backdrop" aria-hidden="true">
        <div class="backdrop-image" style="background-image: url('/assets/images/asyut_launch_realistic.jpg');"></div>
        <div class="backdrop-vignette"></div>
      </div>

      <!-- Parallax Layer 2: Asyut Skyline & Space Complex Silhouette -->
      <div #skylineLayer class="parallax-layer skyline-layer">
        <svg viewBox="0 0 1920 600" class="skyline-svg" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="skylineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#161D39" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="#0A0E1C" stop-opacity="1"/>
            </linearGradient>
            <linearGradient id="nileReflect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1E3A8A" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#0A0E1C" stop-opacity="0.9"/>
            </linearGradient>
          </defs>

          <!-- Asyut Mountainous Ridges / Desert Plateau in distance -->
          <path d="M0 320 Q280 260 550 310 T1100 280 T1600 320 T1920 290 L1920 600 L0 600 Z" fill="#0E1428" opacity="0.6"/>

          <!-- Stylized Space Research Domes & Facility Buildings -->
          <path d="M120 420 Q180 340 240 420 L240 480 L120 480 Z" fill="url(#skylineGrad)"/>
          <path d="M220 440 Q260 380 300 440 L300 480 L220 480 Z" fill="#131B38"/>
          <!-- Observatories and Communication Dishes -->
          <path d="M360 480 L380 370 L400 480 Z" stroke="#2A71D6" stroke-width="2" fill="none"/>
          <circle cx="380" cy="365" r="16" fill="none" stroke="#70B1ED" stroke-width="2"/>
          
          <!-- Asyut Space Workspace Command Center (Futuristic Geodesic Architecture) -->
          <polygon points="680,480 730,360 820,360 870,480" fill="url(#skylineGrad)"/>
          <circle cx="775" cy="340" r="32" fill="#172130" stroke="#70B1ED" stroke-width="1.5"/>
          <!-- Windows with internal glowing light -->
          <line x1="755" y1="340" x2="795" y2="340" stroke="#F2CA8D" stroke-width="3" stroke-linecap="round"/>
          <line x1="720" y1="390" x2="830" y2="390" stroke="#70B1ED" stroke-width="2" stroke-opacity="0.7"/>
          <line x1="710" y1="420" x2="840" y2="420" stroke="#70B1ED" stroke-width="2" stroke-opacity="0.7"/>

          <!-- Telemetry Towers with Blinking Hazard Lights -->
          <line x1="980" y1="480" x2="980" y2="240" stroke="#2A71D6" stroke-width="2.5"/>
          <line x1="970" y1="320" x2="990" y2="320" stroke="#2A71D6" stroke-width="1.5"/>
          <line x1="965" y1="380" x2="995" y2="380" stroke="#2A71D6" stroke-width="1.5"/>
          <circle cx="980" cy="235" r="4" fill="#F4514F" class="beacon-blink"/>

          <line x1="1400" y1="480" x2="1400" y2="280" stroke="#2A71D6" stroke-width="2"/>
          <circle cx="1400" cy="275" r="4" fill="#F4514F" class="beacon-blink-delay"/>

          <!-- Distant Asyut Nile River Shimmer -->
          <rect x="0" y="480" width="1920" height="120" fill="url(#nileReflect)"/>
          <line x1="200" y1="510" x2="450" y2="510" stroke="#70B1ED" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="40 20"/>
          <line x1="800" y1="530" x2="1200" y2="530" stroke="#70B1ED" stroke-width="1" stroke-opacity="0.4" stroke-dasharray="60 30"/>
        </svg>
      </div>

      <!-- Parallax Layer 3: Foreground Launch Pad & Rocket Assembly -->
      <div #gantryLayer class="parallax-layer gantry-layer">
        <div class="pad-stage">
          <!-- Gantry Service Tower (Left) -->
          <svg viewBox="0 0 240 680" class="gantry-tower" preserveAspectRatio="none">
            <line x1="60" y1="680" x2="60" y2="120" stroke="#2A71D6" stroke-width="5"/>
            <line x1="140" y1="680" x2="140" y2="120" stroke="#2A71D6" stroke-width="5"/>
            <!-- Truss Bracing -->
            <path d="M60 680 L140 600 M140 680 L60 600 M60 600 L140 520 M140 600 L60 520 M60 520 L140 440 M140 520 L60 440 M60 440 L140 360 M140 440 L60 360 M60 360 L140 280 M140 360 L60 280 M60 280 L140 200 M140 280 L60 200 M60 200 L140 120 M140 200 L60 120" stroke="#1E3A8A" stroke-width="3"/>
            <!-- Top Crane Head -->
            <rect x="40" y="100" width="160" height="24" fill="#2A71D6" rx="4"/>
            <circle cx="140" cy="90" r="5" fill="#3EC87D" class="beacon-blink"/>

            <!-- Umbilical Retractable Arms to Rocket -->
            <g #umbilicalArm1 class="umbilical-arm">
              <path d="M140 240 L230 240 L240 250" stroke="#70B1ED" stroke-width="4" fill="none"/>
              <circle cx="240" cy="250" r="4" fill="#F2CA8D"/>
            </g>
            <g #umbilicalArm2 class="umbilical-arm">
              <path d="M140 380 L230 380 L240 390" stroke="#70B1ED" stroke-width="4" fill="none"/>
              <circle cx="240" cy="390" r="4" fill="#F2CA8D"/>
            </g>
          </svg>

          <!-- Centered Rocket Assembly -->
          <div #rocketWrapper class="rocket-assembly">
            <svg viewBox="0 0 160 520" class="rocket-svg-detailed">
              <defs>
                <linearGradient id="rocketBodyGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#E2E8F0"/>
                  <stop offset="45%" stop-color="#FFFFFF"/>
                  <stop offset="85%" stop-color="#CBD5E1"/>
                  <stop offset="100%" stop-color="#94A3B8"/>
                </linearGradient>
                <linearGradient id="fairingGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#CBD5E1"/>
                  <stop offset="50%" stop-color="#FFFFFF"/>
                  <stop offset="100%" stop-color="#64748B"/>
                </linearGradient>
                <linearGradient id="goldAccent" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#F2CA8D"/>
                  <stop offset="100%" stop-color="#D97706"/>
                </linearGradient>
                <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#FFFFFF"/>
                  <stop offset="20%" stop-color="#FDE047"/>
                  <stop offset="60%" stop-color="#F97316"/>
                  <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
                </linearGradient>
              </defs>

              <!-- Escape Tower / Spike -->
              <line x1="80" y1="10" x2="80" y2="50" stroke="#F2CA8D" stroke-width="3"/>
              <polygon points="76,10 80,2 84,10" fill="#F2CA8D"/>

              <!-- Command Module / Capsule (Stylized Egyptian Lotus Inlay) -->
              <path d="M60 90 L70 50 Q80 44 90 50 L100 90 Z" fill="url(#fairingGrad)" stroke="#1E3A8A" stroke-width="1.5"/>
              <circle cx="80" cy="70" r="5" fill="#2A71D6" stroke="#70B1ED" stroke-width="1.5"/>

              <!-- Stage 2 / Trans-Lunar Injection Vehicle -->
              <rect x="58" y="90" width="44" height="85" fill="url(#rocketBodyGrad)" stroke="#1E3A8A" stroke-width="1.5"/>
              <!-- Golden Mission Band & Asyut Monogram -->
              <rect x="58" y="105" width="44" height="12" fill="url(#goldAccent)"/>
              <text x="80" y="114" fill="#0A0E1C" font-size="7" font-weight="900" font-family="'Space Mono', monospace" text-anchor="middle">ASYUT</text>
              <line x1="62" y1="150" x2="98" y2="150" stroke="#2A71D6" stroke-width="2"/>

              <!-- Interstage Ring -->
              <rect x="56" y="175" width="48" height="15" fill="#172130" stroke="#70B1ED" stroke-width="1"/>
              <line x1="60" y1="182" x2="100" y2="182" stroke="#F2CA8D" stroke-width="2" stroke-dasharray="4 3"/>

              <!-- Main Booster Stage 1 Core -->
              <rect x="54" y="190" width="52" height="230" fill="url(#rocketBodyGrad)" stroke="#1E3A8A" stroke-width="1.5"/>
              <!-- Thermal Tiles & Aerodynamic Grid Fins -->
              <rect x="46" y="210" width="8" height="20" fill="#172130" rx="2" stroke="#70B1ED" stroke-width="1"/>
              <rect x="106" y="210" width="8" height="20" fill="#172130" rx="2" stroke="#70B1ED" stroke-width="1"/>
              
              <!-- Vertical Egyptian Flag Color Stripe (artistic ribbon) -->
              <rect x="76" y="240" width="8" height="50" fill="#EF4444"/>
              <rect x="76" y="290" width="8" height="50" fill="#FFFFFF"/>
              <rect x="76" y="340" width="8" height="50" fill="#0A0E1C"/>
              <!-- Falcon Crest Emblem -->
              <circle cx="80" cy="315" r="3" fill="#F2CA8D"/>

              <!-- Aerodynamic Base Fins -->
              <polygon points="54,380 24,425 24,440 54,420" fill="#1E3A8A" stroke="#70B1ED" stroke-width="1.5"/>
              <polygon points="106,380 136,425 136,440 106,420" fill="#1E3A8A" stroke="#70B1ED" stroke-width="1.5"/>

              <!-- Engine Bells / Thruster Nozzles -->
              <polygon points="60,420 54,448 72,448 68,420" fill="#334155" stroke="#70B1ED" stroke-width="1"/>
              <polygon points="74,420 70,450 90,450 86,420" fill="#1E293B" stroke="#F2CA8D" stroke-width="1.5"/>
              <polygon points="92,420 88,448 106,448 100,420" fill="#334155" stroke="#70B1ED" stroke-width="1"/>

              <!-- Dynamic Animated Thruster Flame & Plume -->
              <g #thrusterFlame class="thruster-flame-group" [class.ignited]="isIgnited()">
                <!-- Core White Shock Diamonds -->
                <polygon points="76,450 80,480 84,450" fill="#FFFFFF"/>
                <polygon points="77,485 80,510 83,485" fill="#FFFFFF"/>
                <!-- Flame Plume Core -->
                <path d="M52 450 Q80 540 80 580 Q80 540 108 450 Z" fill="url(#flameGrad)" class="flame-core"/>
                <!-- Side Nozzle Fire -->
                <polygon points="54,448 63,495 72,448" fill="url(#flameGrad)"/>
                <polygon points="88,448 97,495 106,448" fill="url(#flameGrad)"/>
              </g>
            </svg>

            <!-- Ground Smoke Clouds -->
            <div #smokeContainer class="smoke-container" [class.active]="isIgnited()">
              <div class="smoke-puff puff-1"></div>
              <div class="smoke-puff puff-2"></div>
              <div class="smoke-puff puff-3"></div>
              <div class="smoke-puff puff-4"></div>
            </div>
          </div>

          <!-- Launch Mount Platform & Concrete Base -->
          <svg viewBox="0 0 600 120" class="launch-table-svg" preserveAspectRatio="none">
            <polygon points="120,0 480,0 540,120 60,120" fill="#0E1428" stroke="#1E3A8A" stroke-width="2"/>
            <rect x="220" y="0" width="160" height="20" fill="#172130" stroke="#70B1ED" stroke-width="1.5"/>
            <!-- Exhaust Blast Trench Opening -->
            <polygon points="240,20 360,20 380,80 220,80" fill="#0A0E1C"/>
            <!-- Safety railings with caution diagonal stripes -->
            <line x1="80" y1="20" x2="220" y2="20" stroke="#F2CA8D" stroke-width="3" stroke-dasharray="10 5"/>
            <line x1="380" y1="20" x2="520" y2="20" stroke="#F2CA8D" stroke-width="3" stroke-dasharray="10 5"/>
          </svg>
        </div>
      </div>

      <!-- Hero Overlay: Title, Telemetry & Launch CTA -->
      <div #heroContent class="hero-overlay" [class.hero-hidden]="isLaunching()">
        <!-- Passport-Style Mission Card -->
        <div class="passport-ticket-panel">
          <div class="ticket-header-strip">
            <span class="passport-badge">
              <span class="pulse-dot"></span>
              <span>🌍 PLANET EARTH // ASYUT LAUNCH COMPLEX</span>
            </span>
            <span class="status-badge-ready">{{ i18n.currentTranslations().readyToLaunch }}</span>
          </div>

          <h1 class="hero-title">{{ i18n.currentTranslations().launchTitle }}</h1>
          <p class="hero-desc">{{ i18n.currentTranslations().launchDesc }}</p>

          <!-- Asyut Barrage Ground Photo Detail -->
          <div class="asyut-origin-preview">
            <div class="origin-thumb-wrapper">
              <img src="assets/images/asyut_user_rocket_launch.png" alt="قناطر أسيوط ونهر النيل" class="origin-thumb-img" />
              <div class="origin-thumb-badge">
                <span>📍 موقع الإطلاق: قناطر أسيوط · نهر النيل</span>
              </div>
            </div>
          </div>

          <div class="flight-specs-row">
            <div class="spec-cell">
              <span class="spec-label">VEHICLE</span>
              <span class="spec-val">ASYUT-V TITAN</span>
            </div>
            <div class="spec-cell">
              <span class="spec-label">DESTINATION</span>
              <span class="spec-val">MARE TRANQUILLITATIS</span>
            </div>
            <div class="spec-cell">
              <span class="spec-label">COORDINATES</span>
              <span class="spec-val">27.18° N · 31.18° E</span>
            </div>
          </div>

          <!-- Pulsing CTA Button -->
          <div class="cta-wrapper">
            <button 
              class="btn-cinema launch-cta-btn"
              (click)="triggerLaunchSequence()"
              [disabled]="isLaunching()"
            >
              <span class="btn-glow-ring"></span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="cta-rocket-icon">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-2.05 11a22.35 22.35 0 0 1-4 2z"/>
              </svg>
              <span>{{ i18n.currentTranslations().launchBtn }}</span>
            </button>
          </div>

          <!-- Scroll Hint -->
          <div class="scroll-hint-wrapper" (click)="triggerLaunchSequence()">
            <span class="scroll-text">{{ i18n.currentTranslations().scrollHint }}</span>
            <div class="scroll-arrow-anim">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Countdown Holographic Display -->
      @if (countdownValue() !== null) {
        <div class="countdown-hud-overlay" role="alert" aria-live="assertive">
          <div class="countdown-card">
            <span class="countdown-badge">{{ i18n.currentTranslations().countdownPrefix }}</span>
            <div class="countdown-number" [class.countdown-liftoff]="countdownValue() === 0">
              @if (countdownValue()! > 0) {
                <span>{{ i18n.currentTranslations().tMinus }}{{ countdownValue() }}</span>
              } @else {
                <span class="liftoff-text">{{ i18n.currentTranslations().ignition }}</span>
              }
            </div>
            <div class="countdown-telemetry">
              <span>MAIN_ENGINE_PRESSURE: 100% NOMINAL</span>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
      background: var(--bg-deep);
    }

    .scene-launch {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      perspective: 1000px;

      &.shaking {
        animation: rocketRumble 0.08s infinite ease-in-out alternate;
      }
    }

    /* Parallax Layers */
    .parallax-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    /* Layer 1: Sky & Canvas Starfield */
    .sky-layer {
      z-index: 1;
      background: radial-gradient(circle at 50% 30%, #161D39 0%, #0A0E1C 80%);
    }

    .starfield-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .celestial-glow {
      position: absolute;
      top: 5%;
      left: 50%;
      transform: translateX(-50%);
      width: 70vw;
      height: 40vh;
      background: radial-gradient(circle, rgba(42, 113, 214, 0.18) 0%, transparent 70%);
      filter: blur(40px);
    }

    .drifting-cloud {
      position: absolute;
      background: radial-gradient(ellipse at center, rgba(112, 177, 237, 0.06) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(30px);
      pointer-events: none;
    }

    .cloud-1 {
      width: 80vw;
      height: 25vh;
      top: 15%;
      left: -20%;
      animation: driftLeft 45s linear infinite alternate;
    }

    .cloud-2 {
      width: 70vw;
      height: 20vh;
      top: 45%;
      right: -15%;
      animation: driftRight 55s linear infinite alternate;
    }

    /* Realistic Asyut Barrage Backdrop */
    .realistic-asyut-backdrop {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
    }

    .backdrop-image {
      width: 100%;
      height: 100%;
      background-image: url('/assets/images/asyut_launch_realistic.jpg');
      background-size: cover;
      background-position: left center;
      opacity: 1;
      filter: contrast(1.05) brightness(1.02);
      transform: scale(1.01);
    }

    .backdrop-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(270deg, rgba(10, 14, 28, 0.78) 0%, rgba(10, 14, 28, 0.35) 35%, transparent 65%),
                  linear-gradient(180deg, rgba(10, 14, 28, 0.45) 0%, transparent 20%, transparent 80%, rgba(10, 14, 28, 0.6) 100%);
    }

    /* Asyut Barrage Thumbnail Preview */
    .asyut-origin-preview {
      margin-bottom: 1.25rem;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-line-strong);
      background: rgba(10, 14, 28, 0.7);
    }

    .origin-thumb-wrapper {
      position: relative;
      width: 100%;
      height: 95px;
      overflow: hidden;
    }

    .origin-thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.95) contrast(1.05);
      transition: transform 0.4s ease;

      &:hover {
        transform: scale(1.04);
      }
    }

    .origin-thumb-badge {
      position: absolute;
      bottom: 0;
      inset-inline-start: 0;
      inset-inline-end: 0;
      padding: 0.35rem 0.65rem;
      background: linear-gradient(180deg, transparent, rgba(10, 14, 28, 0.95));
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-sand);
      font-weight: 700;
    }

    /* Layer 2: Asyut Skyline */
    .skyline-layer {
      display: none;
    }

    /* Layer 3: Gantry & Rocket */
    .gantry-layer {
      display: none;
    }

    .pad-stage {
      position: relative;
      width: 100%;
      max-width: 900px;
      height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .gantry-tower {
      position: absolute;
      bottom: 60px;
      left: calc(50% - 240px);
      width: 180px;
      height: 75vh;
      z-index: 1;
      transform-origin: bottom center;

      @media (max-width: 768px) {
        left: calc(50% - 190px);
        width: 140px;
      }
    }

    .rocket-assembly {
      position: absolute;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      height: 65vh;
      max-height: 560px;
      z-index: 4;
      display: flex;
      flex-direction: column;
      align-items: center;

      @media (max-width: 768px) {
        width: 120px;
        height: 55vh;
      }
    }

    .rocket-svg-detailed {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.7));
    }

    .launch-table-svg {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 600px;
      height: 95px;
      margin-bottom: -5px;
    }

    /* Flame & Smoke */
    .thruster-flame-group {
      opacity: 0;
      transform-origin: top center;
      transition: opacity 0.2s ease-in;

      &.ignited {
        opacity: 1;
        animation: flameTurbulence 0.06s infinite alternate;
      }
    }

    .flame-core {
      filter: drop-shadow(0 0 16px #F97316) drop-shadow(0 0 35px #EF4444);
    }

    .smoke-container {
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      width: 380px;
      height: 140px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;

      &.active {
        opacity: 1;
      }
    }

    .smoke-puff {
      position: absolute;
      background: radial-gradient(circle, rgba(248, 250, 252, 0.75) 0%, rgba(226, 232, 240, 0.2) 50%, transparent 75%);
      border-radius: 50%;
      filter: blur(16px);
      animation: smokeBillow 1.2s infinite ease-out;
    }

    .puff-1 { width: 140px; height: 90px; left: 10%; bottom: 0; animation-delay: 0s; }
    .puff-2 { width: 160px; height: 100px; right: 10%; bottom: 10px; animation-delay: 0.25s; }
    .puff-3 { width: 190px; height: 110px; left: 25%; bottom: -10px; animation-delay: 0.45s; }
    .puff-4 { width: 150px; height: 85px; right: 30%; bottom: 5px; animation-delay: 0.6s; }

    /* Hero Passport Overlay */
    .hero-overlay {
      position: absolute;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 6rem 4rem 3rem;
      pointer-events: none;
      transition: opacity 0.5s var(--ease-cinematic), transform 0.5s var(--ease-cinematic);

      @media (max-width: 768px) {
        padding: 5rem 1.25rem 2rem;
        justify-content: center;
        align-items: flex-start;
      }

      &.hero-hidden {
        opacity: 0;
        transform: translateY(-30px);
        pointer-events: none;
      }
    }

    .passport-ticket-panel {
      pointer-events: auto;
      width: 100%;
      max-width: 520px;
      padding: 2.25rem 2rem;
      background: rgba(15, 22, 34, 0.78);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--border-line-strong);
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-glow), var(--accent-sand));
      }
    }

    .ticket-header-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px dashed var(--border-line);
    }

    .status-badge-ready {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-success);
      background: rgba(62, 200, 125, 0.1);
      border: 1px solid rgba(62, 200, 125, 0.35);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .pulse-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-sand);
      box-shadow: 0 0 6px var(--accent-sand);
      animation: beaconFlash 1.5s infinite;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 800;
      line-height: 1.15;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, var(--text-primary) 40%, var(--accent-glow) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-desc {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .flight-specs-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(10, 14, 28, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 10px;
      margin-bottom: 1.75rem;

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    .spec-cell {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .spec-label {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: var(--text-faint);
      letter-spacing: 0.08em;
    }

    .spec-val {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-sand);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cta-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .launch-cta-btn {
      width: 100%;
      padding: 1rem 2rem;
      font-size: 1.15rem;
      position: relative;
      border: 1px solid var(--accent-glow);
      background: linear-gradient(135deg, rgba(42, 113, 214, 0.9) 0%, rgba(22, 29, 57, 0.95) 100%);
      box-shadow: 0 0 24px rgba(42, 113, 214, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);

      &:hover:not(:disabled) {
        box-shadow: 0 0 36px rgba(112, 177, 237, 0.7), inset 0 1px 0 #fff;
        border-color: #fff;
      }
    }

    .cta-rocket-icon {
      color: var(--accent-sand);
      transform: rotate(45deg);
    }

    .btn-glow-ring {
      position: absolute;
      inset: -4px;
      border-radius: 999px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      opacity: 0.3;
      animation: pulseGlow 2s infinite;
      pointer-events: none;
    }

    .scroll-hint-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      color: var(--text-muted);
      transition: color 0.2s ease;

      &:hover {
        color: var(--accent-glow);
      }
    }

    .scroll-text {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    .scroll-arrow-anim {
      animation: bounceArrow 1.5s infinite;
      color: var(--accent-glow);
    }

    /* Holographic Countdown Overlay */
    .countdown-hud-overlay {
      position: absolute;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(10, 14, 28, 0.4);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: none;
    }

    .countdown-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 3.5rem;
      background: rgba(15, 22, 34, 0.85);
      border: 2px solid var(--accent-glow);
      border-radius: 24px;
      box-shadow: 0 0 50px rgba(42, 113, 214, 0.5), inset 0 0 30px rgba(112, 177, 237, 0.2);
      animation: scalePop 0.3s var(--ease-elastic);
    }

    .countdown-badge {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--accent-sand);
      letter-spacing: 0.15em;
      margin-bottom: 0.5rem;
    }

    .countdown-number {
      font-family: var(--font-mono);
      font-size: clamp(3.5rem, 8vw, 6rem);
      font-weight: 800;
      color: #fff;
      line-height: 1;
      text-shadow: 0 0 30px var(--accent-glow), 0 0 60px var(--accent-primary);

      &.countdown-liftoff {
        font-size: clamp(2rem, 5vw, 3.5rem);
        color: var(--accent-sand);
        text-shadow: 0 0 35px var(--accent-ember);
      }
    }

    .countdown-telemetry {
      margin-top: 1rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent-success);
      letter-spacing: 0.08em;
    }

    /* Keyframe Animations */
    @keyframes beaconFlash {
      0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px #F4514F); }
      50% { opacity: 0.2; filter: none; }
    }

    @keyframes flameTurbulence {
      0% { transform: scaleY(0.92) scaleX(0.96); }
      100% { transform: scaleY(1.08) scaleX(1.04); }
    }

    @keyframes smokeBillow {
      0% { transform: translateY(0) scale(0.6); opacity: 0.8; }
      100% { transform: translateY(-40px) scale(1.6); opacity: 0; }
    }

    @keyframes rocketRumble {
      0% { transform: translate(-1.5px, 1px) rotate(-0.3deg); }
      100% { transform: translate(1.5px, -1.2px) rotate(0.3deg); }
    }

    @keyframes pulseGlow {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.05); opacity: 0.6; }
    }

    @keyframes bounceArrow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(6px); }
    }

    @keyframes scalePop {
      0% { transform: scale(0.7); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes driftLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-5vw); }
    }

    @keyframes driftRight {
      0% { transform: translateX(0); }
      100% { transform: translateX(5vw); }
    }
  `]
})
export class LaunchPadComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  private readonly audio = inject(AudioService);
  private readonly scroll = inject(ScrollService);
  private readonly masterTimeline = inject(MasterTimelineService);
  private readonly motion = inject(MotionPrefsService);

  readonly sceneContainer = viewChild<ElementRef<HTMLElement>>('sceneContainer');
  readonly starfieldCanvas = viewChild<ElementRef<HTMLCanvasElement>>('starfieldCanvas');
  readonly skyLayer = viewChild<ElementRef<HTMLElement>>('skyLayer');
  readonly realisticBackdrop = viewChild<ElementRef<HTMLElement>>('realisticBackdrop');
  readonly skylineLayer = viewChild<ElementRef<HTMLElement>>('skylineLayer');
  readonly gantryLayer = viewChild<ElementRef<HTMLElement>>('gantryLayer');
  readonly rocketWrapper = viewChild<ElementRef<HTMLElement>>('rocketWrapper');
  readonly umbilicalArm1 = viewChild<ElementRef<SVGElement>>('umbilicalArm1');
  readonly umbilicalArm2 = viewChild<ElementRef<SVGElement>>('umbilicalArm2');

  readonly countdownValue = signal<number | null>(null);
  readonly isShaking = signal<boolean>(false);
  readonly isIgnited = signal<boolean>(false);
  readonly isLaunching = signal<boolean>(false);
  readonly launchCompleted = output<void>();

  private starAnimationId: number | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private hasLaunched = false;

  readonly heroContent = viewChild<ElementRef<HTMLElement>>('heroContent');

  constructor() {
    effect(() => {
      const p = this.masterTimeline.getSceneProgress(0); // 0.0 to 1.0 within Scene 1
      this.animateLaunchOnScroll(p);
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.initStarfield();
      this.setupInitialParallax();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.starAnimationId) {
      cancelAnimationFrame(this.starAnimationId);
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  private initStarfield(): void {
    const canvas = this.starfieldCanvas()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: { x: number; y: number; radius: number; alpha: number; speed: number }[] = [];
    const count = window.innerWidth < 768 ? 75 : 160;

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0.2) {
          s.speed = -s.speed;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 245, 236, ${Math.max(0.1, s.alpha)})`;
        ctx.fill();
      }
      this.starAnimationId = requestAnimationFrame(render);
    };

    render();
  }

  private setupInitialParallax(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('mousemove', (e) => {
      if (this.isLaunching()) return;
      const xNorm = (e.clientX / window.innerWidth) - 0.5;
      const yNorm = (e.clientY / window.innerHeight) - 0.5;

      const skyline = this.skylineLayer()?.nativeElement;
      const gantry = this.gantryLayer()?.nativeElement;

      if (skyline) {
        gsap.to(skyline, { x: xNorm * 18, y: yNorm * 8, duration: 1, ease: 'power1.out' });
      }
      if (gantry) {
        gsap.to(gantry, { x: xNorm * -10, y: yNorm * -6, duration: 1, ease: 'power1.out' });
      }
    });
  }

  private animateLaunchOnScroll(p: number): void {
    if (this.isLaunching()) return;
    const rocket = this.rocketWrapper()?.nativeElement;
    const hero = this.heroContent()?.nativeElement;
    const arm1 = this.umbilicalArm1()?.nativeElement;
    const arm2 = this.umbilicalArm2()?.nativeElement;
    const backdrop = this.realisticBackdrop()?.nativeElement;

    if (backdrop) {
      gsap.set(backdrop, {
        y: p * 160,
        scale: 1 + p * 0.08,
      });
    }

    if (rocket) {
      gsap.set(rocket, {
        y: -p * ((typeof window !== 'undefined' ? window.innerHeight : 800) + 200),
      });
    }

    if (arm1 && arm2) {
      gsap.set([arm1, arm2], {
        rotate: -p * 45,
        transformOrigin: 'left center',
      });
    }

    if (hero) {
      gsap.set(hero, {
        opacity: Math.max(0, 1 - p * 3.5),
        y: -p * 80,
      });
    }

    if (p > 0.02) {
      this.isIgnited.set(true);
      this.isShaking.set(p < 0.7);
    } else {
      this.isIgnited.set(false);
      this.isShaking.set(false);
    }
  }

  /**
   * Launch Sequence when user clicks the CTA button:
   * 1. Rapid 3-second audio countdown
   * 2. Thrusters ignite with rumble
   * 3. Auto-scrolls smoothly into Scene 2 (Orbit)
   */
  triggerLaunchSequence(): void {
    if (this.hasLaunched || this.isLaunching()) return;
    this.hasLaunched = true;
    this.isLaunching.set(true);

    let count = 3;
    this.countdownValue.set(count);
    this.audio.playBeep(900, 0.1);

    this.countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdownValue.set(count);
        this.audio.playBeep(900 + (3 - count) * 120, 0.1);

        if (count === 1) {
          this.isIgnited.set(true);
          this.isShaking.set(true);
          this.audio.playThrusterRumble(4);
        }
      } else {
        clearInterval(this.countdownTimer!);
        this.countdownValue.set(0);
        this.audio.playBeep(1400, 0.25);
        this.executeLiftoff();
      }
    }, 800);
  }

  private executeLiftoff(): void {
    const rocket = this.rocketWrapper()?.nativeElement;
    const scene = this.sceneContainer()?.nativeElement;
    if (!rocket || !scene) return;

    const tl = gsap.timeline({
      onComplete: () => {
        this.countdownValue.set(null);
        this.isShaking.set(false);
        this.isLaunching.set(false);
        // Smoothly auto-scroll to Scene 2 (18% scroll progress)
        const targetScroll = (document.documentElement.scrollHeight - window.innerHeight) * 0.18;
        this.scroll.scrollTo(targetScroll, { duration: 1.8 });
        this.launchCompleted.emit();
      }
    });

    tl.to(rocket, {
      y: -window.innerHeight - 300,
      duration: 1.8,
      ease: 'power2.in',
    });
  }
}
