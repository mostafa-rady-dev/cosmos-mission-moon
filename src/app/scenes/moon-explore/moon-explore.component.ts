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

        <!-- Origin: Touchdown Base (Realistic Lander with Open Warm Light & Ladder) -->
        <div class="lander-base-origin">
          <div class="origin-lander-wrapper">
            <img src="assets/images/lunar_lander_realistic.png" alt="Touchdown Base Lander" class="origin-lander-realistic-img" />
            <div class="hatch-glow-beacon"></div>
          </div>

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
          <div class="realistic-astronaut-mount" [class.stride-hop]="isWalking()">
            <!-- Dynamic cast shadow under astronaut boots on lunar regolith -->
            <div class="astronaut-ground-shadow" [class.walking]="isWalking()"></div>

            <!-- Lunar dust puff when walking -->
            <div class="lunar-dust-puff left-puff" [class.active]="isWalking()"></div>
            <div class="lunar-dust-puff right-puff" [class.active]="isWalking()"></div>

            <!-- Alternating Two-Legged Astronaut Walk Cycle Sprites -->
            <img 
              src="assets/images/astronaut_standing.png" 
              alt="Asyut Lunar Astronaut - Standing" 
              class="astronaut-realistic-img" 
              [class.active-pose]="activePose() === 'stand'"
            />
            <img 
              src="assets/images/astronaut_walking.png" 
              alt="Asyut Lunar Astronaut - Right Step" 
              class="astronaut-realistic-img" 
              [class.active-pose]="activePose() === 'stride-right'"
            />
            <img 
              src="assets/images/astronaut_walking_alt.png" 
              alt="Asyut Lunar Astronaut - Left Step" 
              class="astronaut-realistic-img" 
              [class.active-pose]="activePose() === 'stride-left'"
            />

            <!-- Helmet Visor Sunlight Glare Flare -->
            <div class="visor-sun-flare"></div>

            <!-- Helmet Headlamp Beam illuminating surface ahead -->
            <div class="headlamp-beam"></div>
          </div>
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

    .origin-lander-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .origin-lander-realistic-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: contrast(1.1) brightness(1.05) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85));
    }

    .hatch-glow-beacon {
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: radial-gradient(circle, rgba(253, 230, 138, 0.7) 0%, transparent 70%);
      filter: blur(12px);
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
      width: 95px;
      height: 145px;
      z-index: 6;
      transform-origin: bottom center;
      transition: bottom 0.2s ease-out;
      pointer-events: none;
    }

    .realistic-astronaut-mount {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      transform-origin: bottom center;

      &.stride-hop {
        animation: naturalLunarLope 1.35s infinite ease-in-out;
      }
    }

    .astronaut-realistic-img {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: contrast(1.12) brightness(1.06) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.85));
      transform-origin: bottom center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.06s ease-in-out;

      &.active-pose {
        opacity: 1;
        visibility: visible;
      }
    }

    .realistic-astronaut-mount:not(.stride-hop) .astronaut-realistic-img.active-pose {
      animation: idleBreathing 3.5s infinite ease-in-out;
    }

    /* Dynamic ground shadow that naturally detaches, shrinks, and soft-blurs during low-gravity float */
    .astronaut-ground-shadow {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 52px;
      height: 10px;
      background: radial-gradient(ellipse at center, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.35) 50%, transparent 80%);
      border-radius: 50%;
      filter: blur(2px);
      transition: opacity 0.2s ease;

      &.walking {
        animation: naturalShadowLope 1.35s infinite ease-in-out;
      }
    }

    /* Headlamp light cone illuminating lunar terrain ahead */
    .headlamp-beam {
      position: absolute;
      top: 18px;
      right: -35px;
      width: 95px;
      height: 40px;
      background: radial-gradient(ellipse at left center, rgba(254, 240, 138, 0.35) 0%, rgba(254, 240, 138, 0.1) 40%, transparent 80%);
      transform: rotate(20deg);
      transform-origin: left center;
      filter: blur(4px);
      pointer-events: none;
    }

    /* Visor sun glint */
    .visor-sun-flare {
      position: absolute;
      top: 15px;
      right: 32px;
      width: 8px;
      height: 8px;
      background: #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 0 10px #FFFFFF, 0 0 20px #F59E0B;
      opacity: 0.85;
      animation: visorGlint 3s infinite ease-in-out;
    }

    /* Natural Lunar dust kickup alternating with stride */
    .lunar-dust-puff {
      position: absolute;
      bottom: -2px;
      width: 26px;
      height: 14px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(148, 163, 184, 0.55) 0%, rgba(100, 116, 139, 0.2) 60%, transparent 80%);
      filter: blur(3.5px);
      opacity: 0;
      pointer-events: none;

      &.active.left-puff {
        animation: naturalDustKickLeft 1.35s infinite ease-out;
        left: 20%;
      }
      &.active.right-puff {
        animation: naturalDustKickRight 1.35s infinite ease-out;
        right: 25%;
      }
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

    @keyframes idleBreathing {
      0%, 100% {
        transform: translateY(0) scale(1);
      }
      50% {
        transform: translateY(-2px) scale(1.008);
      }
    }

    @keyframes naturalLunarLope {
      /* Phase 1: Push off from lunar ground */
      0% {
        transform: translateY(0px) rotate(3deg) scaleY(0.96);
      }
      /* Spring upwards */
      14% {
        transform: translateY(-8px) rotate(6deg) scaleY(1.02);
      }
      /* Apex of float in 1/6th gravity (graceful hang time) */
      38% {
        transform: translateY(-26px) rotate(2deg) scaleY(1);
      }
      /* Smooth descent */
      54% {
        transform: translateY(-10px) rotate(4deg) scaleY(1);
      }
      /* Touchdown on surface & knee absorption */
      62% {
        transform: translateY(0px) rotate(3.5deg) scaleY(0.96);
      }
      /* Phase 2: Second foot push-off & counter-weight bound */
      74% {
        transform: translateY(-8px) rotate(5.5deg) scaleY(1.02);
      }
      /* Second apex float */
      87% {
        transform: translateY(-24px) rotate(1.5deg) scaleY(1);
      }
      /* Soft landing back on surface */
      96% {
        transform: translateY(-2px) rotate(3deg) scaleY(0.98);
      }
      100% {
        transform: translateY(0px) rotate(3deg) scaleY(0.96);
      }
    }

    @keyframes naturalShadowLope {
      0% {
        transform: translateX(-50%) scale(1.05, 1);
        opacity: 0.9;
        filter: blur(2px);
      }
      14% {
        transform: translateX(-50%) scale(0.9, 0.9);
        opacity: 0.75;
        filter: blur(3px);
      }
      38% {
        transform: translateX(-50%) scale(0.55, 0.6);
        opacity: 0.35;
        filter: blur(7px);
      }
      54% {
        transform: translateX(-50%) scale(0.85, 0.85);
        opacity: 0.7;
        filter: blur(3.5px);
      }
      62% {
        transform: translateX(-50%) scale(1.05, 1);
        opacity: 0.9;
        filter: blur(2px);
      }
      74% {
        transform: translateX(-50%) scale(0.92, 0.9);
        opacity: 0.75;
        filter: blur(3px);
      }
      87% {
        transform: translateX(-50%) scale(0.58, 0.6);
        opacity: 0.38;
        filter: blur(6.5px);
      }
      100% {
        transform: translateX(-50%) scale(1.05, 1);
        opacity: 0.9;
        filter: blur(2px);
      }
    }

    @keyframes naturalDustKickLeft {
      0% {
        opacity: 0.85;
        transform: translate(0, 0) scale(0.6);
      }
      18% {
        opacity: 0.7;
        transform: translate(-14px, -12px) scale(1.4);
      }
      32% {
        opacity: 0;
        transform: translate(-24px, -18px) scale(2);
      }
      33%, 100% {
        opacity: 0;
      }
    }

    @keyframes naturalDustKickRight {
      0%, 60% {
        opacity: 0;
      }
      62% {
        opacity: 0.85;
        transform: translate(0, 0) scale(0.6);
      }
      78% {
        opacity: 0.7;
        transform: translate(-14px, -12px) scale(1.4);
      }
      92% {
        opacity: 0;
        transform: translate(-24px, -18px) scale(2);
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes visorGlint {
      0%, 100% { opacity: 0.4; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
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
  readonly activePose = signal<'stand' | 'stride-right' | 'stride-left'>('stand');
  readonly isFlagPlanted = signal<boolean>(true);
  readonly activeNearMission = signal<MissionConfig | null>(null);

  readonly footprints = signal<{ x: number; y: number }[]>([]);

  readonly completedCount = computed(() => this.completedMissions().size);

  private scrollStopTimer: ReturnType<typeof setTimeout> | null = null;
  private walkCycleInterval: ReturnType<typeof setInterval> | null = null;
  private walkTimeouts: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    effect(() => {
      const p = this.masterTimeline.getSceneProgress(4); // 0.0 to 1.0 within Scene 5 & 6
      this.syncScrollWithAstronaut(p);
    });

    effect(() => {
      if (this.isWalking()) {
        this.startWalkCycle();
      } else {
        this.stopWalkCycle();
      }
    });
  }

  ngOnInit(): void {
    // Preload astronaut walk cycle sprites into memory
    if (typeof window !== 'undefined') {
      const p1 = new Image(); p1.src = 'assets/images/astronaut_standing.png';
      const p2 = new Image(); p2.src = 'assets/images/astronaut_walking.png';
      const p3 = new Image(); p3.src = 'assets/images/astronaut_walking_alt.png';
    }

    // Generate initial footprints near lander
    this.footprints.set([
      { x: 140, y: 110 },
      { x: 170, y: 112 },
      { x: 200, y: 108 },
      { x: 230, y: 110 },
    ]);
  }

  ngOnDestroy(): void {
    this.stopWalkCycle();
    if (this.scrollStopTimer) {
      clearTimeout(this.scrollStopTimer);
    }
  }

  private startWalkCycle(): void {
    if (this.walkCycleInterval) return;

    const runOneCycle = () => {
      this.walkTimeouts.forEach(t => clearTimeout(t));
      this.walkTimeouts = [];

      // t = 0ms: First stride - Right leg kicks forward in low-g lope
      this.activePose.set('stride-right');

      // t = 380ms: Passing pose as feet pass under body
      this.walkTimeouts.push(setTimeout(() => {
        if (this.isWalking()) this.activePose.set('stand');
      }, 380));

      // t = 675ms: Second stride - Left leg kicks forward in alternating lope
      this.walkTimeouts.push(setTimeout(() => {
        if (this.isWalking()) this.activePose.set('stride-left');
      }, 675));

      // t = 1055ms: Passing pose as feet pass under body
      this.walkTimeouts.push(setTimeout(() => {
        if (this.isWalking()) this.activePose.set('stand');
      }, 1055));
    };

    runOneCycle();
    this.walkCycleInterval = setInterval(runOneCycle, 1350);
  }

  private stopWalkCycle(): void {
    if (this.walkCycleInterval) {
      clearInterval(this.walkCycleInterval);
      this.walkCycleInterval = null;
    }
    this.walkTimeouts.forEach(t => clearTimeout(t));
    this.walkTimeouts = [];
    this.activePose.set('stand');
  }

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

    // Astronaut actively executes low-gravity walking bounds while scrolling
    this.isWalking.set(true);
    if (this.scrollStopTimer) {
      clearTimeout(this.scrollStopTimer);
    }
    this.scrollStopTimer = setTimeout(() => {
      this.isWalking.set(false);
    }, 400);

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
    if (this.isWalking()) return;

    this.isWalking.set(true);
    this.audio.playBeep(920, 0.08);

    // Calculate target X position along track
    const targetX = (mission.position.x / 100) * 3840 - 80;
    const currentX = this.astronautX();
    const distance = Math.abs(targetX - currentX);

    // Authentic lunar lope speed: ~150px per second with natural deceleration
    const duration = Math.max(1.35, Math.min(3.6, distance / 150));

    // Rhythmic lunar step sound every 675ms (each footfall of the lope)
    const stepInterval = setInterval(() => {
      this.audio.playBeep(260 + Math.random() * 30, 0.03);
    }, 675);

    gsap.to(this.astronautX, {
      value: targetX,
      duration: duration,
      ease: 'power1.inOut',
      onComplete: () => {
        clearInterval(stepInterval);
        this.isWalking.set(false);
        this.audio.playBeep(1100, 0.15);
        this.openMission.emit(mission);
      }
    });
  }
}
