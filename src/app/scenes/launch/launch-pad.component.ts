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

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  rot: number;
  vrot: number;
  isFiery: boolean;
}

interface CryoVapor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

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
      <!-- Parallax Layer 1: Celestial Sky & Starfield Canvas -->
      <div #skyLayer class="parallax-layer sky-layer">
        <canvas #starfieldCanvas class="starfield-canvas"></canvas>
        <div class="celestial-glow"></div>
      </div>

      <!-- Photorealistic Pad 39B Sunset / Twilight Backdrop -->
      <div #realisticBackdrop class="realistic-asyut-backdrop" aria-hidden="true">
        <div class="backdrop-image"></div>
        <div class="backdrop-vignette"></div>

        <!-- Xenon Pad Spotlights -->
        <div class="pad-spotlights-layer" aria-hidden="true">
          <div class="spotlight-beam spotlight-left"></div>
          <div class="spotlight-beam spotlight-right"></div>
        </div>

        <!-- High-Performance Canvas Particle Engine for Supersonic Flame, Sparks, Smoke & Water Reflection -->
        <canvas #launchFxCanvas class="launch-fx-canvas"></canvas>

        <!-- Ascending Heavy Rocket Assembly: Solid Precision SVG -->
        <div #ascendingRocket class="ascending-rocket-assembly" [class.ascending]="isIgnited()">
          <svg class="titan-heavy-rocket-svg" viewBox="0 0 160 680" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NASA Artemis SLS Titan Launch Vehicle">
            <defs>
              <linearGradient id="fairingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#E2E8F0" />
                <stop offset="35%" stop-color="#FFFFFF" />
                <stop offset="70%" stop-color="#CBD5E1" />
                <stop offset="100%" stop-color="#94A3B8" />
              </linearGradient>
              <linearGradient id="coreFoamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#9A4310" />
                <stop offset="25%" stop-color="#D96E14" />
                <stop offset="50%" stop-color="#F28E2B" />
                <stop offset="75%" stop-color="#D96E14" />
                <stop offset="100%" stop-color="#7C320A" />
              </linearGradient>
              <linearGradient id="boosterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#CBD5E1" />
                <stop offset="30%" stop-color="#FFFFFF" />
                <stop offset="70%" stop-color="#E2E8F0" />
                <stop offset="100%" stop-color="#94A3B8" />
              </linearGradient>
              <linearGradient id="nozzleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#1E293B" />
                <stop offset="40%" stop-color="#475569" />
                <stop offset="70%" stop-color="#334155" />
                <stop offset="100%" stop-color="#0F172A" />
              </linearGradient>
              <linearGradient id="nozzleInsideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#00E5FF" />
                <stop offset="40%" stop-color="#F59E0B" />
                <stop offset="100%" stop-color="#EA580C" />
              </linearGradient>
            </defs>

            <!-- 1. LAUNCH ABORT SYSTEM (LAS) -->
            <line x1="80" y1="12" x2="80" y2="72" stroke="#E2E8F0" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="80" cy="12" r="2.5" fill="#EF4444" />
            <path d="M76 72 L84 72 L82 96 L78 96 Z" fill="#94A3B8" />
            <path d="M74 96 L86 96 L88 122 L72 122 Z" fill="url(#fairingGrad)" />
            <path d="M72 122 L88 122 L96 156 L64 156 Z" fill="url(#fairingGrad)" stroke="#94A3B8" stroke-width="0.8"/>

            <!-- 2. ORION CREW CAPSULE & SERVICE MODULE -->
            <path d="M64 156 L96 156 L98 192 L62 192 Z" fill="url(#fairingGrad)" />
            <text x="80" y="175" fill="#FC3D21" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="7" letter-spacing="1.5" text-anchor="middle">NASA</text>
            <circle cx="73" cy="184" r="1.2" fill="#0284C7" />
            <circle cx="87" cy="184" r="1.2" fill="#0284C7" />
            <rect x="63" y="180" width="3" height="3" fill="#0F172A" />
            <rect x="94" y="180" width="3" height="3" fill="#0F172A" />
            <line x1="62" y1="192" x2="98" y2="192" stroke="#334155" stroke-width="2"/>

            <!-- Interstage Adapter with Structural Flange Bolts -->
            <rect x="63" y="192" width="34" height="20" fill="#E2E8F0" stroke="#94A3B8" stroke-width="0.8"/>
            <line x1="63" y1="202" x2="97" y2="202" stroke="#64748B" stroke-width="0.8"/>
            <circle cx="68" cy="207" r="1" fill="#475569"/>
            <circle cx="76" cy="207" r="1" fill="#475569"/>
            <circle cx="84" cy="207" r="1" fill="#475569"/>
            <circle cx="92" cy="207" r="1" fill="#475569"/>

            <!-- 3. CORE STAGE (CRYOGENIC LOX & LH2 TANKS) -->
            <rect x="60" y="212" width="40" height="332" rx="2" fill="url(#coreFoamGrad)" />
            <line x1="60" y1="242" x2="100" y2="242" stroke="#7C320A" stroke-width="1.5"/>
            <line x1="60" y1="275" x2="100" y2="275" stroke="#B85D19" stroke-width="1"/>
            <line x1="60" y1="315" x2="100" y2="315" stroke="#7C320A" stroke-width="1.5"/>
            <line x1="60" y1="358" x2="100" y2="358" stroke="#7C320A" stroke-width="2"/>
            <g stroke="#642405" stroke-width="0.8" opacity="0.65">
              <line x1="63" y1="360" x2="63" y2="388"/>
              <line x1="68" y1="360" x2="68" y2="388"/>
              <line x1="73" y1="360" x2="73" y2="388"/>
              <line x1="78" y1="360" x2="78" y2="388"/>
              <line x1="83" y1="360" x2="83" y2="388"/>
              <line x1="88" y1="360" x2="88" y2="388"/>
              <line x1="93" y1="360" x2="93" y2="388"/>
              <line x1="97" y1="360" x2="97" y2="388"/>
            </g>
            <line x1="60" y1="390" x2="100" y2="390" stroke="#7C320A" stroke-width="2"/>
            <line x1="60" y1="432" x2="100" y2="432" stroke="#B85D19" stroke-width="1"/>
            <line x1="60" y1="478" x2="100" y2="478" stroke="#7C320A" stroke-width="1.5"/>
            <line x1="60" y1="524" x2="100" y2="524" stroke="#7C320A" stroke-width="2"/>

            <!-- Cryogenic LOX Feedline Conduit & Brackets -->
            <line x1="94" y1="222" x2="94" y2="544" stroke="#E2E8F0" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="94" y1="222" x2="94" y2="544" stroke="#94A3B8" stroke-width="1"/>
            <rect x="92" y="252" width="4" height="2" fill="#334155" />
            <rect x="92" y="322" width="4" height="2" fill="#334155" />
            <rect x="92" y="402" width="4" height="2" fill="#334155" />
            <rect x="92" y="482" width="4" height="2" fill="#334155" />

            <!-- Core Base Boat-Tail Heat Shield -->
            <path d="M60 544 L100 544 L98 568 L62 568 Z" fill="url(#fairingGrad)" stroke="#475569" stroke-width="1"/>

            <!-- 4. TWIN SOLID ROCKET BOOSTERS (SRBs) -->
            <!-- Left SRB -->
            <g class="left-srb">
              <path d="M38 188 Q38 188 45 222 L31 222 Z" fill="url(#boosterGrad)" stroke="#94A3B8" stroke-width="0.8"/>
              <polygon points="36,195 38,189 40,195" fill="#0F172A" />
              <rect x="31" y="222" width="14" height="12" fill="#0F172A" />
              <rect x="34" y="225" width="4" height="6" fill="#FFFFFF" />
              <rect x="40" y="225" width="4" height="6" fill="#FFFFFF" />
              <rect x="31" y="234" width="14" height="305" fill="url(#boosterGrad)" stroke="#94A3B8" stroke-width="0.8"/>
              <line x1="31" y1="288" x2="45" y2="288" stroke="#64748B" stroke-width="1.5"/>
              <line x1="31" y1="348" x2="45" y2="348" stroke="#64748B" stroke-width="1.5"/>
              <line x1="31" y1="408" x2="45" y2="408" stroke="#64748B" stroke-width="1.5"/>
              <line x1="31" y1="468" x2="45" y2="468" stroke="#64748B" stroke-width="1.5"/>
              <path d="M31 539 L45 539 L47 568 L29 568 Z" fill="#475569" stroke="#334155" stroke-width="1"/>
              <path d="M32 568 L44 568 L46 588 L30 588 Z" fill="url(#nozzleGrad)" stroke="#0F172A" stroke-width="1"/>
              <ellipse cx="38" cy="588" rx="7" ry="2.5" fill="url(#nozzleInsideGrad)"/>
              <line x1="45" y1="242" x2="60" y2="247" stroke="#334155" stroke-width="3.5"/>
              <line x1="45" y1="522" x2="60" y2="527" stroke="#334155" stroke-width="4"/>
            </g>

            <!-- Right SRB -->
            <g class="right-srb">
              <path d="M122 188 Q122 188 129 222 L115 222 Z" fill="url(#boosterGrad)" stroke="#94A3B8" stroke-width="0.8"/>
              <polygon points="120,195 122,189 124,195" fill="#0F172A" />
              <rect x="115" y="222" width="14" height="12" fill="#0F172A" />
              <rect x="118" y="225" width="4" height="6" fill="#FFFFFF" />
              <rect x="124" y="225" width="4" height="6" fill="#FFFFFF" />
              <rect x="115" y="234" width="14" height="305" fill="url(#boosterGrad)" stroke="#94A3B8" stroke-width="0.8"/>
              <line x1="115" y1="288" x2="129" y2="288" stroke="#64748B" stroke-width="1.5"/>
              <line x1="115" y1="348" x2="129" y2="348" stroke="#64748B" stroke-width="1.5"/>
              <line x1="115" y1="408" x2="129" y2="408" stroke="#64748B" stroke-width="1.5"/>
              <line x1="115" y1="468" x2="129" y2="468" stroke="#64748B" stroke-width="1.5"/>
              <path d="M115 539 L129 539 L131 568 L113 568 Z" fill="#475569" stroke="#334155" stroke-width="1"/>
              <path d="M116 568 L128 568 L130 588 L114 588 Z" fill="url(#nozzleGrad)" stroke="#0F172A" stroke-width="1"/>
              <ellipse cx="122" cy="588" rx="7" ry="2.5" fill="url(#nozzleInsideGrad)"/>
              <line x1="115" y1="242" x2="100" y2="247" stroke="#334155" stroke-width="3.5"/>
              <line x1="115" y1="522" x2="100" y2="527" stroke="#334155" stroke-width="4"/>
            </g>

            <!-- 5. RS-25 MAIN ENGINES -->
            <g class="core-rs25-engines">
              <path d="M68 568 L76 568 L78 588 L66 588 Z" fill="url(#nozzleGrad)" stroke="#1E293B" stroke-width="0.8"/>
              <ellipse cx="72" cy="588" rx="5.5" ry="2" fill="url(#nozzleInsideGrad)" />
              <path d="M84 568 L92 568 L94 588 L82 588 Z" fill="url(#nozzleGrad)" stroke="#1E293B" stroke-width="0.8"/>
              <ellipse cx="88" cy="588" rx="5.5" ry="2" fill="url(#nozzleInsideGrad)" />
            </g>
          </svg>
        </div>
      </div>

      <!-- Hero Overlay: Mission Passport Card & Hold-to-Charge Launch Deck -->
      <div #heroContent class="hero-overlay" [class.hero-hidden]="isLaunching()">
        <div class="passport-ticket-panel">
          <div class="ticket-header-strip">
            <span class="passport-badge">
              <span class="pulse-dot"></span>
              <span>🌍 KSC PAD 39B // ASYUT-V FLIGHT</span>
            </span>
            <span class="status-badge-ready">{{ i18n.currentTranslations().readyToLaunch }}</span>
          </div>

          <h1 class="hero-title">{{ i18n.currentTranslations().heroTitle }}</h1>
          <p class="hero-desc">{{ i18n.currentTranslations().heroSubtitle }}</p>

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
              <span class="spec-val geo-coord" dir="ltr">27.18° N · 31.18° E</span>
            </div>
          </div>

          <!-- Pre-flight Telemetry Readout -->
          <div class="preflight-status-strip">
            <span class="telemetry-item"><span class="t-dot"></span> LOX: 100% NOMINAL</span>
            <span class="telemetry-item"><span class="t-dot"></span> CHAMBER: 20.6 MPa</span>
            <span class="telemetry-item"><span class="t-dot"></span> GUIDANCE: ALIGNED</span>
          </div>

          <!-- Interactive 3-Second Hold-to-Charge Launch System -->
          <div class="hold-launch-container">
            <button 
              type="button"
              class="hold-launch-btn"
              [class.is-holding]="isHoldingCharge()"
              [class.is-launching]="isLaunching()"
              (mousedown)="startHoldCharge($event)"
              (mouseup)="stopHoldCharge()"
              (mouseleave)="stopHoldCharge()"
              (touchstart)="startHoldCharge($event)"
              (touchend)="stopHoldCharge()"
              (touchcancel)="stopHoldCharge()"
              [disabled]="isLaunching()"
            >
              <!-- Circular SVG Charge Ring Meter -->
              <svg class="charge-ring-svg" viewBox="0 0 100 100">
                <circle class="ring-track" cx="50" cy="50" r="44" />
                <circle 
                  class="ring-fill" 
                  cx="50" 
                  cy="50" 
                  r="44" 
                  [style.strokeDashoffset]="chargeRingOffset()"
                />
              </svg>

              <div class="btn-inner-content">
                <svg class="cta-rocket-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-2.05 11a22.35 22.35 0 0 1-4 2z"/>
                </svg>
                <div class="btn-text-group">
                  @if (isLaunching()) {
                    <span class="btn-state-text">{{ i18n.currentTranslations().ignition }}</span>
                  } @else if (isHoldingCharge()) {
                    <span class="btn-state-text">{{ i18n.currentLang() === 'ar' ? 'جاري شحن الإشعال...' : 'CHARGING IGNITION...' }} {{ chargePercent() }}%</span>
                  } @else {
                    <span class="btn-state-text">{{ i18n.currentLang() === 'ar' ? 'اضغط باستمرار للإطلاق (3 ث)' : 'HOLD TO LAUNCH (3s)' }}</span>
                  }
                  <span class="btn-sub-hint">{{ i18n.currentLang() === 'ar' ? 'ابق ضاغطًا لشحن محركات الصاروخ' : 'Keep pressed to charge engines' }}</span>
                </div>
              </div>
            </button>

            <!-- Early Release Warning Tooltip -->
            @if (chargeCancelledHint()) {
              <div class="charge-early-hint" role="alert">
                {{ i18n.currentLang() === 'ar' ? '⚠️ استمر بالضغط 3 ثوانٍ كاملة حتى يكتمل شحن الإطلاق!' : '⚠️ Keep holding for full 3s to complete ignition!' }}
              </div>
            }

            <!-- Secondary Universe Jump Button -->
            <button 
              type="button"
              class="btn-secondary-deck"
              (click)="exploreUniverse()"
              [disabled]="isLaunching()"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
              <span>{{ i18n.currentTranslations().exploreUniverseBtn }}</span>
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
      background: #03060E;
    }

    .scene-launch {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      perspective: 1000px;
      transition: transform 0.05s ease-out;

      &.shaking {
        will-change: transform;
      }
    }

    .parallax-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .sky-layer {
      z-index: 1;
      background: radial-gradient(circle at 50% 25%, #0B142A 0%, #03060E 85%);
    }

    .starfield-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .celestial-glow {
      position: absolute;
      top: 5%;
      left: 50%;
      transform: translateX(-50%);
      width: 70vw;
      height: 40vh;
      background: radial-gradient(circle, rgba(54, 197, 240, 0.15) 0%, transparent 70%);
      filter: blur(40px);
    }

    .realistic-asyut-backdrop {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      overflow: hidden;
    }

    .backdrop-image {
      width: 100%;
      height: 100%;
      background: url('/assets/images/asyut_launch_realistic.jpg') center bottom / cover no-repeat;
      filter: contrast(1.08) brightness(1.02);
      transform: scale(1.01);
    }

    .backdrop-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(3, 6, 14, 0.3) 0%, transparent 25%, transparent 75%, rgba(3, 6, 14, 0.75) 100%);
    }

    .pad-spotlights-layer {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
    }

    .spotlight-beam {
      position: absolute;
      width: 120px;
      height: 70vh;
      opacity: 0.28;
      filter: blur(14px);
      pointer-events: none;
      animation: spotlightFlicker 6s infinite ease-in-out;

      &.spotlight-left {
        left: 18%;
        top: 2%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(220, 235, 255, 0.2) 40%, transparent 100%);
        transform: rotate(22deg);
        transform-origin: top left;
      }

      &.spotlight-right {
        left: 36%;
        top: 4%;
        background: linear-gradient(225deg, rgba(255, 255, 255, 0.5) 0%, rgba(220, 235, 255, 0.18) 40%, transparent 100%);
        transform: rotate(-22deg);
        transform-origin: top right;
      }
    }

    /* Launch FX Canvas (Supersonic Exhaust, Sparks, Smoke & Water Reflections) */
    .launch-fx-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 4;
      pointer-events: none;
    }

    /* Ascending Rocket Assembly */
    .ascending-rocket-assembly {
      position: absolute;
      left: 26.6%;
      bottom: 24%;
      width: 110px;
      height: 480px;
      transform: translateX(-50%);
      transform-origin: center bottom;
      z-index: 5;
      pointer-events: none;
      filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.9));
      transition: filter 0.3s ease;

      &.ascending {
        filter: drop-shadow(0 20px 40px rgba(245, 158, 11, 0.7)) drop-shadow(0 25px 60px rgba(0, 0, 0, 0.95));
      }

      @media (max-width: 960px) {
        width: 75px;
        height: 330px;
        left: 26%;
        top: 15%;
        bottom: auto;
      }
    }

    .titan-heavy-rocket-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.7));
    }

    /* Hero Passport Overlay */
    .hero-overlay {
      position: absolute;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 5.5rem 3.5rem 2.5rem;
      pointer-events: none;
      transition: opacity 0.5s var(--ease-cinematic), transform 0.5s var(--ease-cinematic);

      :host-context([dir="rtl"]) & {
        justify-content: flex-start;
      }

      @media (max-width: 960px) {
        padding: 4.5rem 0.75rem 1.25rem;
        justify-content: center;
        align-items: flex-end;

        :host-context([dir="rtl"]) & {
          justify-content: center;
        }
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
      max-width: 500px;
      padding: 2rem 1.75rem;
      background: rgba(11, 18, 38, 0.82);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--border-line-strong);
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.75);
      position: relative;
      overflow: hidden;

      @media (max-width: 960px) {
        max-width: 100%;
        padding: 1.25rem 1rem;
        border-radius: 16px;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        inset-inline: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-glow));
      }
    }

    .ticket-header-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.65rem;
      border-bottom: 1px dashed var(--border-line);
      @media (max-width: 960px) { margin-bottom: 0.5rem; padding-bottom: 0.4rem; }
    }

    .status-badge-ready {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent-success);
      background: rgba(62, 200, 125, 0.12);
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
      background: var(--accent-glow);
      box-shadow: 0 0 6px var(--accent-glow);
      animation: beaconFlash 1.5s infinite;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(1.6rem, 3.5vw, 2.5rem);
      font-weight: 800;
      line-height: 1.15;
      color: #FFFFFF;
      margin-bottom: 0.65rem;
      background: linear-gradient(135deg, #FFFFFF 40%, var(--accent-glow) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      @media (max-width: 960px) { margin-bottom: 0.35rem; }
    }

    .hero-desc {
      font-size: 0.92rem;
      line-height: 1.55;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      @media (max-width: 960px) { font-size: 0.8rem; margin-bottom: 0.75rem; line-height: 1.4; }
    }

    .flight-specs-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      padding: 0.7rem;
      background: rgba(6, 10, 22, 0.7);
      border: 1px solid var(--border-line);
      border-radius: 10px;
      margin-bottom: 0.8rem;
      @media (max-width: 480px) { padding: 0.4rem; gap: 0.3rem; }
    }

    .spec-cell { display: flex; flex-direction: column; gap: 0.2rem; }
    .spec-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--text-faint); letter-spacing: 0.08em; }
    .spec-val { font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--accent-glow); }

    .preflight-status-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      background: rgba(6, 10, 22, 0.6);
      border: 1px solid rgba(54, 197, 240, 0.2);
      @media (max-width: 960px) { display: none; }
    }

    .telemetry-item {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--accent-glow);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .t-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent-success);
      box-shadow: 0 0 6px var(--accent-success);
    }

    /* Hold-to-Charge Launch Button System */
    .hold-launch-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
      @media (max-width: 960px) { gap: 0.4rem; margin-bottom: 0.4rem; }
    }

    .hold-launch-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      min-height: 60px;
      padding: 0.75rem 1.2rem;
      background: linear-gradient(135deg, rgba(30, 58, 138, 0.6) 0%, rgba(14, 116, 144, 0.7) 100%);
      border: 1px solid var(--accent-glow);
      border-radius: 14px;
      color: #FFFFFF;
      cursor: pointer;
      user-select: none;
      touch-action: none;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(54, 197, 240, 0.25);
      transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(54, 197, 240, 0.4);
      }

      &.is-holding {
        border-color: #F59E0B;
        box-shadow: 0 0 35px rgba(245, 158, 11, 0.6);
        background: linear-gradient(135deg, rgba(180, 83, 9, 0.6) 0%, rgba(217, 119, 6, 0.7) 100%);
      }

      &.is-launching {
        border-color: #EF4444;
        box-shadow: 0 0 40px rgba(239, 68, 68, 0.8);
        background: linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(249, 115, 22, 0.8) 100%);
      }
    }

    .charge-ring-svg {
      position: absolute;
      inset-inline-start: 12px;
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
      width: 44px;
      height: 44px;
      pointer-events: none;
      flex-shrink: 0;
    }

    .ring-track {
      fill: none;
      stroke: rgba(255, 255, 255, 0.12);
      stroke-width: 6;
    }

    .ring-fill {
      fill: none;
      stroke: #F59E0B;
      stroke-width: 6;
      stroke-linecap: round;
      stroke-dasharray: 276.46;
      transition: stroke-dashoffset 0.05s linear;
      filter: drop-shadow(0 0 6px #F59E0B);
    }

    .btn-inner-content {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-inline-start: 48px;
      pointer-events: none;
      width: calc(100% - 48px);
    }

    .cta-rocket-icon {
      width: 24px;
      height: 24px;
      color: var(--accent-glow);
      transform: rotate(45deg);
      flex-shrink: 0;
      transition: transform 0.2s ease, color 0.2s ease;

      .is-holding & {
        color: #F59E0B;
        transform: rotate(45deg) scale(1.15);
      }
    }

    .btn-text-group {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: start;
      overflow: hidden;
    }

    .btn-state-text {
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    .btn-sub-hint {
      font-size: 0.68rem;
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
    }

    .charge-early-hint {
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #FDE68A;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      text-align: center;
      animation: fadeInAlert 0.3s ease;
    }

    .btn-secondary-deck {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.7rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: var(--accent-glow);
        color: #FFFFFF;
        background: rgba(30, 41, 59, 0.7);
      }
    }

    .scroll-hint-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      color: var(--text-muted);
      transition: color 0.2s ease;
      margin-top: 0.5rem;

      &:hover { color: var(--accent-glow); }
    }

    .scroll-text {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      letter-spacing: 0.05em;
    }

    .scroll-arrow-anim {
      animation: bounceArrow 1.5s infinite;
      color: var(--accent-glow);
    }

    /* Holographic Countdown Overlay */
    .countdown-hud-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .countdown-card {
      padding: 2.5rem 3.5rem;
      background: rgba(6, 10, 22, 0.88);
      backdrop-filter: blur(16px);
      border: 2px solid var(--accent-glow);
      border-radius: 24px;
      box-shadow: 0 0 60px rgba(54, 197, 240, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .countdown-badge {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--accent-glow);
      letter-spacing: 0.1em;
    }

    .countdown-number {
      font-family: var(--font-display);
      font-size: clamp(3.5rem, 8vw, 5.5rem);
      font-weight: 900;
      color: #FFFFFF;
      text-shadow: 0 0 30px rgba(54, 197, 240, 0.8);

      &.countdown-liftoff {
        color: #F59E0B;
        text-shadow: 0 0 40px rgba(245, 158, 11, 0.9);
      }
    }

    .countdown-telemetry {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-faint);
    }

    @keyframes spotlightFlicker {
      0%, 100% { opacity: 0.28; }
      50% { opacity: 0.35; }
    }

    @keyframes beaconFlash {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.85); }
    }

    @keyframes bounceArrow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(6px); }
    }

    @keyframes fadeInAlert {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
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
  readonly launchFxCanvas = viewChild<ElementRef<HTMLCanvasElement>>('launchFxCanvas');
  readonly realisticBackdrop = viewChild<ElementRef<HTMLElement>>('realisticBackdrop');
  readonly ascendingRocket = viewChild<ElementRef<HTMLElement>>('ascendingRocket');
  readonly heroContent = viewChild<ElementRef<HTMLElement>>('heroContent');

  readonly countdownValue = signal<number | null>(null);
  readonly isShaking = signal<boolean>(false);
  readonly isIgnited = signal<boolean>(false);
  readonly isLaunching = signal<boolean>(false);

  // Hold-to-Charge state
  readonly isHoldingCharge = signal<boolean>(false);
  readonly chargePercent = signal<number>(0);
  readonly chargeRingOffset = signal<number>(276.46); // 2 * PI * 44 = 276.46
  readonly chargeCancelledHint = signal<boolean>(false);

  readonly launchCompleted = output<void>();

  private starAnimationId: number | null = null;
  private fxAnimationId: number | null = null;
  private holdIntervalId: ReturnType<typeof setInterval> | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private resizeListener: (() => void) | null = null;
  private mousemoveListener: ((e: MouseEvent) => void) | null = null;

  // Particle systems
  private sparks: SparkParticle[] = [];
  private smoke: SmokeParticle[] = [];
  private cryoVapors: CryoVapor[] = [];
  private currentShakeMagnitude = 0;
  private shakeDecay = 0.96;

  constructor() {
    effect(() => {
      const p = this.masterTimeline.getSceneProgress(0); // 0.0 to 1.0 within Scene 1
      this.animateLaunchOnScroll(p);
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.initStarfield();
      this.initLaunchFxCanvas();
      this.setupInitialParallax();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.starAnimationId) {
      cancelAnimationFrame(this.starAnimationId);
      this.starAnimationId = null;
    }
    if (this.fxAnimationId) {
      cancelAnimationFrame(this.fxAnimationId);
      this.fxAnimationId = null;
    }
    this.clearHoldTimer();
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
    if (this.mousemoveListener && typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.mousemoveListener);
      this.mousemoveListener = null;
    }
  }

  /* ----------------------------------------------------
   * HOLD-TO-CHARGE 3-SECOND INTERACTION
   * ---------------------------------------------------- */
  startHoldCharge(evt: Event): void {
    if (this.isLaunching()) return;
    evt.preventDefault();
    this.isHoldingCharge.set(true);
    this.chargeCancelledHint.set(false);
    this.chargePercent.set(0);
    this.chargeRingOffset.set(276.46);

    this.audio.startChargeTone();
    const startTime = performance.now();
    const duration = 3000; // 3 seconds full hold

    this.clearHoldTimer();
    this.holdIntervalId = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      const pct = Math.floor(progress * 100);

      this.chargePercent.set(pct);
      this.chargeRingOffset.set(276.46 * (1 - progress));
      this.audio.updateChargeProgress(progress);

      // Subtle vibration ramp
      this.currentShakeMagnitude = progress * 2.5;

      // Haptic pulses every 25%
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        if (pct === 25 || pct === 50 || pct === 75) {
          navigator.vibrate(30 + pct / 2);
        }
      }

      if (progress >= 1.0) {
        this.clearHoldTimer();
        this.isHoldingCharge.set(false);
        this.chargeRingOffset.set(0);
        this.audio.stopChargeTone();

        // Lock in ignition sequence
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([80, 50, 150]);
        }
        this.triggerLaunchSequence();
      }
    }, 40);
  }

  stopHoldCharge(): void {
    if (!this.isHoldingCharge() || this.isLaunching()) return;
    this.clearHoldTimer();
    this.isHoldingCharge.set(false);
    this.audio.stopChargeTone();

    if (this.chargePercent() < 100) {
      this.chargeCancelledHint.set(true);
      setTimeout(() => this.chargeCancelledHint.set(false), 3000);
    }
    this.chargePercent.set(0);
    this.chargeRingOffset.set(276.46);
    this.currentShakeMagnitude = 0;
  }

  private clearHoldTimer(): void {
    if (this.holdIntervalId) {
      clearInterval(this.holdIntervalId);
      this.holdIntervalId = null;
    }
  }

  /* ----------------------------------------------------
   * LAUNCH FX CANVAS PARTICLE ENGINE
   * ---------------------------------------------------- */
  private initLaunchFxCanvas(): void {
    const canvas = this.launchFxCanvas()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const resizeFx = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeFx();
    window.addEventListener('resize', resizeFx);

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(50, time - lastTime);
      lastTime = time;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Rocket physical anchor coordinates
      const isMobile = w < 960;
      const rocketEl = this.ascendingRocket()?.nativeElement;
      let rx = isMobile ? w * 0.5 : w * 0.266;
      let ry = isMobile ? h * 0.72 : h * 0.765;

      if (rocketEl) {
        const rect = rocketEl.getBoundingClientRect();
        rx = rect.left + rect.width / 2;
        ry = rect.bottom - 4; // nozzle exhaust base
      }

      const ignited = this.isIgnited();
      const holding = this.isHoldingCharge();

      // 1. Cryogenic LOX Venting Vapor (always active before liftoff)
      if (!ignited) {
        if (Math.random() < 0.35) {
          this.cryoVapors.push({
            x: rx + (Math.random() - 0.5) * 30,
            y: ry - 220 + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.7) * 1.5,
            vy: (Math.random() - 0.3) * 0.8,
            radius: 8 + Math.random() * 8,
            alpha: 0.45
          });
        }
      }

      for (let i = this.cryoVapors.length - 1; i >= 0; i--) {
        const v = this.cryoVapors[i];
        v.x += v.vx;
        v.y += v.vy;
        v.radius += 0.4;
        v.alpha -= 0.008;

        if (v.alpha <= 0) {
          this.cryoVapors.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${v.alpha})`);
        grad.addColorStop(0.5, `rgba(186, 230, 253, ${v.alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(186, 230, 253, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Pre-launch Sparklers during Hold-to-Charge
      if (holding) {
        for (let s = 0; s < 3; s++) {
          this.sparks.push({
            x: rx + (Math.random() - 0.5) * 45,
            y: ry + Math.random() * 10,
            vx: (Math.random() - 0.5) * 14,
            vy: Math.random() * 8 + 4,
            life: 0,
            maxLife: 20 + Math.random() * 15,
            size: 1.5 + Math.random() * 2,
            color: '#FFE082'
          });
        }
      }

      // 3. Main Liftoff Ignition Flames & Mach Diamonds
      if (ignited) {
        // Draw Supersonic Jet Plumes at Booster 1, Core, and Booster 2
        const nozzleOffsets = isMobile ? [-24, 0, 24] : [-32, -6, 6, 32];
        const plumeLen = 140 + Math.random() * 30;

        for (const ox of nozzleOffsets) {
          const nx = rx + ox;

          // Inner Supersonic Blue Core Jet
          const blueGrad = ctx.createLinearGradient(nx, ry, nx, ry + plumeLen * 0.45);
          blueGrad.addColorStop(0, '#FFFFFF');
          blueGrad.addColorStop(0.2, '#00E5FF');
          blueGrad.addColorStop(0.8, '#2563EB');
          blueGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');

          ctx.fillStyle = blueGrad;
          ctx.beginPath();
          ctx.moveTo(nx - 7, ry);
          ctx.lineTo(nx + 7, ry);
          ctx.lineTo(nx, ry + plumeLen * 0.45);
          ctx.closePath();
          ctx.fill();

          // Mach Diamonds
          ctx.fillStyle = '#FFFFFF';
          for (let d = 1; d <= 3; d++) {
            const dy = ry + d * 18 + Math.sin(time * 0.05 + d) * 2;
            ctx.beginPath();
            ctx.ellipse(nx, dy, 3.5 - d * 0.6, 6 - d * 1, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Outer Solar-Orange Exhaust Envelope
          const flameGrad = ctx.createLinearGradient(nx, ry, nx, ry + plumeLen);
          flameGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          flameGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.9)');
          flameGrad.addColorStop(0.55, 'rgba(249, 115, 22, 0.85)');
          flameGrad.addColorStop(0.85, 'rgba(220, 38, 38, 0.6)');
          flameGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');

          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.moveTo(nx - 14, ry);
          ctx.lineTo(nx + 14, ry);
          ctx.lineTo(nx + (Math.random() - 0.5) * 16, ry + plumeLen);
          ctx.closePath();
          ctx.fill();
        }

        // Spawn High-Velocity Sparks & Embers
        for (let s = 0; s < 6; s++) {
          this.sparks.push({
            x: rx + (Math.random() - 0.5) * 60,
            y: ry + 15,
            vx: (Math.random() - 0.5) * 18,
            vy: Math.random() * 22 + 10,
            life: 0,
            maxLife: 30 + Math.random() * 25,
            size: 2 + Math.random() * 2.5,
            color: Math.random() > 0.4 ? '#FFE57F' : '#FF6D00'
          });
        }

        // Spawn Massive Volumetric Billowing Smoke expanding laterally
        const padGroundY = Math.min(h * 0.88, ry + 120);
        for (let m = 0; m < 5; m++) {
          const side = Math.random() > 0.5 ? 1 : -1;
          this.smoke.push({
            x: rx + (Math.random() - 0.5) * 40,
            y: padGroundY + (Math.random() - 0.5) * 20,
            vx: side * (Math.random() * 12 + 6), // Strong horizontal rollout
            vy: -(Math.random() * 2.5 + 0.5),   // Gentle buoyant rise
            radius: 20 + Math.random() * 15,
            maxRadius: 110 + Math.random() * 50,
            alpha: 0.75,
            rot: Math.random() * Math.PI * 2,
            vrot: (Math.random() - 0.5) * 0.04,
            isFiery: Math.random() < 0.45
          });
        }

        // Dynamic Water / Launch Pad Ground Reflection
        const reflectY = Math.min(h * 0.90, ry + 110);
        const reflectW = 380;
        const waterGlow = ctx.createRadialGradient(rx, reflectY, 10, rx, reflectY, reflectW);
        waterGlow.addColorStop(0, 'rgba(254, 215, 170, 0.75)');
        waterGlow.addColorStop(0.3, 'rgba(249, 115, 22, 0.45)');
        waterGlow.addColorStop(0.7, 'rgba(217, 119, 6, 0.2)');
        waterGlow.addColorStop(1, 'rgba(217, 119, 6, 0)');

        ctx.save();
        ctx.fillStyle = waterGlow;
        ctx.scale(1, 0.4);
        ctx.beginPath();
        ctx.arc(rx, reflectY / 0.4, reflectW, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Update & Draw Sparks
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.35; // gravity
        s.life++;

        if (s.life >= s.maxLife || s.y > h) {
          this.sparks.splice(i, 1);
          continue;
        }

        const alpha = 1 - s.life / s.maxLife;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Update & Draw Billowing Rolling Smoke
      for (let i = this.smoke.length - 1; i >= 0; i--) {
        const sm = this.smoke[i];
        sm.x += sm.vx;
        sm.y += sm.vy;
        sm.vx *= 0.97; // air drag slows horizontal rollout
        sm.radius = Math.min(sm.maxRadius, sm.radius + 1.2);
        sm.rot += sm.vrot;
        sm.alpha -= 0.007;

        if (sm.alpha <= 0 || sm.x < -100 || sm.x > w + 100) {
          this.smoke.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(sm.x, sm.y, sm.radius * 0.15, sm.x, sm.y, sm.radius);
        if (sm.isFiery && sm.alpha > 0.3) {
          grad.addColorStop(0, `rgba(254, 215, 170, ${sm.alpha})`);
          grad.addColorStop(0.4, `rgba(249, 115, 22, ${sm.alpha * 0.6})`);
          grad.addColorStop(1, 'rgba(148, 163, 184, 0)');
        } else {
          grad.addColorStop(0, `rgba(226, 232, 240, ${sm.alpha * 0.8})`);
          grad.addColorStop(0.5, `rgba(148, 163, 184, ${sm.alpha * 0.45})`);
          grad.addColorStop(1, 'rgba(100, 116, 139, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Gradual Camera Shake Application
      const container = this.sceneContainer()?.nativeElement;
      if (container && this.currentShakeMagnitude > 0.05) {
        const dx = (Math.random() - 0.5) * this.currentShakeMagnitude * 2;
        const dy = (Math.random() - 0.5) * this.currentShakeMagnitude * 2;
        const drot = (Math.random() - 0.5) * (this.currentShakeMagnitude * 0.08);
        container.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${drot}deg)`;
      } else if (container && !this.isShaking()) {
        container.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      }

      this.fxAnimationId = requestAnimationFrame(loop);
    };

    this.fxAnimationId = requestAnimationFrame(loop);
  }

  /* ----------------------------------------------------
   * STARFIELD BACKGROUND CANVAS
   * ---------------------------------------------------- */
  private initStarfield(): void {
    const canvas = this.starfieldCanvas()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    this.resizeListener = resize;
    window.addEventListener('resize', this.resizeListener);

    interface Star {
      x: number;
      y: number;
      radius: number;
      baseAlpha: number;
      phase: number;
      freq: number;
      color: string;
      hasSpikes?: boolean;
    }

    const stars: Star[] = [];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 80 : 160;

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.65,
        radius: Math.random() * 0.8 + 0.4,
        baseAlpha: Math.random() * 0.4 + 0.3,
        phase: Math.random() * Math.PI * 2,
        freq: Math.random() * 0.002 + 0.001,
        color: 'rgba(224, 231, 255,',
        hasSpikes: i < 8
      });
    }

    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const s of stars) {
        s.phase += s.freq * dt;
        const currentAlpha = Math.max(0.1, Math.min(1.0, s.baseAlpha + Math.sin(s.phase) * 0.25));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color} ${currentAlpha})`;
        ctx.fill();

        if (s.hasSpikes && currentAlpha > 0.5) {
          const spikeLen = s.radius * 3.5;
          ctx.strokeStyle = `rgba(54, 197, 240, ${currentAlpha * 0.35})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(s.x - spikeLen, s.y);
          ctx.lineTo(s.x + spikeLen, s.y);
          ctx.moveTo(s.x, s.y - spikeLen);
          ctx.lineTo(s.x, s.y + spikeLen);
          ctx.stroke();
        }
      }
      this.starAnimationId = requestAnimationFrame(render);
    };

    this.starAnimationId = requestAnimationFrame(render);
  }

  private setupInitialParallax(): void {
    if (typeof window === 'undefined') return;

    this.mousemoveListener = (e: MouseEvent) => {
      if (this.isLaunching()) return;
      const xNorm = (e.clientX / window.innerWidth) - 0.5;
      const yNorm = (e.clientY / window.innerHeight) - 0.5;

      const backdrop = this.realisticBackdrop()?.nativeElement;
      if (backdrop) {
        gsap.to(backdrop, { x: xNorm * 12, y: yNorm * 5, duration: 1, ease: 'power1.out' });
      }
    };

    window.addEventListener('mousemove', this.mousemoveListener);
  }

  private animateLaunchOnScroll(p: number): void {
    const ascending = this.ascendingRocket()?.nativeElement;
    const hero = this.heroContent()?.nativeElement;
    const backdrop = this.realisticBackdrop()?.nativeElement;

    const viewH = typeof window !== 'undefined' ? window.innerHeight : 800;

    if (backdrop) {
      gsap.set(backdrop, {
        y: p * 150,
        scale: 1 + p * 0.05,
      });
    }

    if (ascending) {
      const accelP = Math.pow(p, 1.45);
      const targetY = -accelP * (viewH * 1.85);

      gsap.set(ascending, {
        y: targetY,
        scale: 1 + p * 0.12,
      });
    }

    if (hero) {
      gsap.set(hero, {
        opacity: Math.max(0, 1 - p * 3.2),
        y: -p * 75,
      });
    }

    if (p > 0.015) {
      this.isIgnited.set(true);
      this.currentShakeMagnitude = p < 0.42 ? 4.5 * (1 - p * 2) : 0;
    } else if (!this.isHoldingCharge()) {
      this.isIgnited.set(false);
      this.currentShakeMagnitude = 0;
    }
  }

  exploreUniverse(): void {
    if (this.isLaunching()) return;
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    this.audio.playBeep(1050, 0.1);
    this.scroll.scrollTo(scrollTotal * 0.30, { duration: 1.6 });
  }

  /* ----------------------------------------------------
   * COUNTDOWN & CINEMATIC LIFTOFF (SLOW MOTION T-0)
   * ---------------------------------------------------- */
  triggerLaunchSequence(): void {
    if (this.isLaunching()) return;
    this.isLaunching.set(true);

    let count = 3;
    this.countdownValue.set(count);
    this.audio.playBeep(900, 0.1);

    this.countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdownValue.set(count);
        this.audio.playBeep(900 + (3 - count) * 130, 0.1);
        this.currentShakeMagnitude = 2.0 + (3 - count) * 1.5;

        if (count === 1) {
          this.isIgnited.set(true);
          this.audio.playThrusterRumble(5);
        }
      } else {
        clearInterval(this.countdownTimer!);
        this.countdownValue.set(0);
        this.audio.playBeep(1450, 0.3);
        this.executeSlowMotionLiftoff();
      }
    }, 850);
  }

  private executeSlowMotionLiftoff(): void {
    this.audio.playThrusterRumble(6);
    this.isIgnited.set(true);
    this.isShaking.set(true);
    this.currentShakeMagnitude = 6.5; // Full liftoff rumble!

    const rocket = this.ascendingRocket()?.nativeElement;

    // Phase 1: Slow Motion Lift (1.2 seconds of titanic weight clearing pad)
    if (rocket) {
      gsap.to(rocket, {
        y: -28,
        duration: 1.2,
        ease: 'power1.in',
        onComplete: () => {
          // Phase 2: Full Accelerated Vertical Ascent into Space
          this.countdownValue.set(null);
          const targetScroll = (document.documentElement.scrollHeight - window.innerHeight) * 0.18;

          this.scroll.scrollTo(targetScroll, {
            duration: 2.8,
            onComplete: () => {
              this.isShaking.set(false);
              this.isLaunching.set(false);
              this.currentShakeMagnitude = 0;
              this.launchCompleted.emit();
            }
          });
        }
      });
    }
  }
}
