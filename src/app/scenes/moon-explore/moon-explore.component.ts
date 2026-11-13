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
import { ScrollService } from '../../core/scroll.service';
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
        <!-- Parallax Layer 1: Distant Crater Mountains (Photorealistic Horizon) -->
        <div class="distant-crater-panorama" aria-hidden="true"></div>

        <!-- Parallax Layer 2: Photorealistic Mare Tranquillitatis Surface Regolith -->
        <div class="main-lunar-surface-photorealistic" aria-hidden="true">
          <div class="regolith-photo-repeat"></div>
          <div class="regolith-surface-shadow-layer"></div>
        </div>

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

        <!-- High-Tech Lunar Exploration Rover (LRV) Assembly -->
        <div class="lunar-rover-assembly" aria-label="Asyut Lunar Exploration Rover">
          <!-- Cast Shadow on Regolith -->
          <div class="rover-ground-shadow"></div>
          
          <img
            src="assets/images/lunar_rover_photorealistic.png"
            alt="Photorealistic Asyut Lunar Exploration Rover (LRV)"
            class="rover-photorealistic-img"
          />

          <div class="rover-telemetry-tag">
            <span>ASYUT-LRV // EXPLORATION UNIT</span>
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

            <!-- Proximity Compact Pill (Idle State) -->
            <div class="beacon-compact-pill">
              <span>WP-0{{ mission.order }}: {{ i18n.currentLang() === 'ar' ? mission.titleAr : mission.titleEn }}</span>
            </div>

            <!-- Proximity Expandable Detailed Mission Card -->
            <div class="waypoint-card hud-panel">
              <div class="card-header">
                <span class="station-badge">WP-0{{ mission.order }} // SURVEY STATION</span>
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



      <!-- Interactive Grand Journey Completion Celebration Overlay -->
      @if (isJourneyCompleted()) {
        <div class="completion-celebration-backdrop" role="dialog" aria-modal="true">
          <div class="completion-celebration-card hud-panel">
            <div class="celebration-badge-row">
              <span class="trophy-pulse">🏆</span>
              <span class="cert-stamp">ASYUT AEROSPACE & NASA CERTIFICATION</span>
            </div>

            <h2 class="celebration-title">
              {{ i18n.currentLang() === 'ar' ? '🎉 ألف مبروك يا بطل الفضاء! اكتملت الرحلة بنجاح!' : '🎉 MISSION ACCOMPLISHED! LUNAR EXPEDITION COMPLETE!' }}
            </h2>

            <p class="celebration-subtitle">
              {{ i18n.currentLang() === 'ar' ? 'تم تكريمك رسميًا كرائد فضاء معتمد بعد استكشاف مهام القمر التسلسلية الخمس ونظامنا الشمسي بالكامل.' : 'You are officially certified as a Master Space Explorer after successfully completing all 5 NASA lunar survey missions.' }}
            </p>

            <div class="accomplishments-grid">
              <div class="acc-badge">
                <span class="acc-icon">🚀</span>
                <span class="acc-title">{{ i18n.currentLang() === 'ar' ? '5 مهام هبوط قمرية' : '5 Lunar Missions' }}</span>
                <span class="acc-sub">{{ i18n.currentLang() === 'ar' ? 'أبولو 11 حتى أرتميس 3' : 'Apollo 11 to Artemis III' }}</span>
              </div>
              <div class="acc-badge">
                <span class="acc-icon">🪐</span>
                <span class="acc-title">{{ i18n.currentLang() === 'ar' ? '9 أجرام سماوية' : '9 Solar Bodies' }}</span>
                <span class="acc-sub">{{ i18n.currentLang() === 'ar' ? 'عبور سينمائي موثق' : 'Full Corridor Survey' }}</span>
              </div>
              <div class="acc-badge">
                <span class="acc-icon">📍</span>
                <span class="acc-title">{{ i18n.currentLang() === 'ar' ? 'بحر الهدوء' : 'Mare Tranquillitatis' }}</span>
                <span class="acc-sub">{{ i18n.currentLang() === 'ar' ? 'مسافة 384,400 كم' : '384,400 KM Traversed' }}</span>
              </div>
              <div class="acc-badge">
                <span class="acc-icon">⭐</span>
                <span class="acc-title">{{ i18n.currentLang() === 'ar' ? 'رتبة رائد فضاء' : 'Commander Rank' }}</span>
                <span class="acc-sub">{{ i18n.currentLang() === 'ar' ? 'مساحة أسيوط الفضائية' : 'Asyut Space Station' }}</span>
              </div>
            </div>

            <div class="celebration-actions-row">
              <button class="btn-cinema replay-mission-btn" (click)="replayEntireJourney()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M1 4v6h6M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                <span>{{ i18n.currentLang() === 'ar' ? 'إعادة الرحلة من البداية' : 'Replay Full Mission' }}</span>
              </button>

              <button class="btn-secondary-deck share-cert-btn" (click)="shareAchievement()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                <span>{{ shareSuccess() ? (i18n.currentLang() === 'ar' ? 'تم نسخ الشهادة! ✓' : 'Copied! ✓') : (i18n.currentLang() === 'ar' ? 'مشاركة الإنجاز' : 'Share Achievement') }}</span>
              </button>

              <button class="btn-close-cert" (click)="dismissCelebration()">
                <span>{{ i18n.currentLang() === 'ar' ? 'استمرار الاستكشاف' : 'Continue Roaming' }}</span>
              </button>
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

    .distant-crater-panorama {
      position: absolute;
      bottom: 15vh;
      left: 0;
      width: 100%;
      height: 38vh;
      pointer-events: none;
      background-image: url('/assets/images/lunar_surface_photorealistic.jpg');
      background-size: 3840px 100%;
      background-repeat: no-repeat;
      background-position: left 20%;
      opacity: 0.45;
      filter: blur(2px) contrast(1.1);
      mask-image: linear-gradient(to top, #000 40%, transparent 100%);
    }

    .main-lunar-surface-photorealistic {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 44vh;
      pointer-events: none;
      overflow: hidden;
      mask-image: linear-gradient(to top, #000 75%, transparent 100%);
    }

    .regolith-photo-repeat {
      position: absolute;
      inset: 0;
      background-image: url('/assets/images/lunar_surface_photorealistic.jpg');
      background-size: 3840px 100%;
      background-repeat: no-repeat;
      background-position: left bottom;
      filter: contrast(1.22) brightness(0.96);
    }

    .regolith-surface-shadow-layer {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(8, 11, 26, 0.5) 0%, transparent 40%, rgba(8, 11, 26, 0.7) 100%);
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
      color: var(--accent-glow);
    }

    /* High-tech Lunar Exploration Rover (LRV) */
    .lunar-rover-assembly {
      position: absolute;
      left: 780px;
      bottom: 85px;
      width: 170px;
      height: 100px;
      z-index: 3;
      pointer-events: none;
    }

    .rover-ground-shadow {
      position: absolute;
      bottom: -6px;
      left: 10px;
      width: 155px;
      height: 18px;
      border-radius: 50%;
      background: rgba(3, 7, 21, 0.95);
      filter: blur(4px);
    }

    .rover-photorealistic-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: contrast(1.15) brightness(1.05) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.85));
    }

    .rover-telemetry-tag {
      position: absolute;
      top: -18px;
      left: 50%;
      transform: translateX(-50%);
      font-family: var(--font-mono);
      font-size: 0.6rem;
      font-weight: 700;
      color: var(--accent-glow);
      background: rgba(8, 11, 26, 0.7);
      padding: 0.1rem 0.4rem;
      border-radius: 3px;
      border: 1px solid rgba(54, 197, 240, 0.3);
      white-space: nowrap;
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

    .beacon-compact-pill {
      margin-top: 0.65rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      background: rgba(10, 14, 28, 0.85);
      border: 1px solid var(--border-line);
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent-glow);
      white-space: nowrap;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .mission-waypoint-node:hover .beacon-compact-pill,
    .mission-waypoint-node.active-target .beacon-compact-pill {
      display: none;
    }

    .waypoint-card {
      margin-top: 0.75rem;
      width: 270px;
      padding: 1.15rem;
      text-align: start;
      max-height: 0;
      opacity: 0;
      transform: translateY(8px) scale(0.96);
      pointer-events: none;
      overflow: hidden;
      transition: max-height 0.35s var(--ease-cinematic), opacity 0.3s ease, transform 0.3s ease;

      .active-target &,
      .mission-waypoint-node:hover &,
      .mission-waypoint-node:focus-within & {
        max-height: 280px;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
        border-color: var(--accent-glow);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(54, 197, 240, 0.25);
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
      color: var(--accent-glow);
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
      0%, 100% { transform: translateY(0) rotate(3deg) scaleY(0.96); }
      20% { transform: translateY(-12px) rotate(5deg) scaleY(1.02); }
      45% { transform: translateY(-26px) rotate(2deg) scaleY(1); }
      70% { transform: translateY(-10px) rotate(4deg) scaleY(1); }
    }

    /* Interactive Celebration Modal */
    .completion-celebration-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(3, 7, 21, 0.88);
      backdrop-filter: blur(16px);
      padding: 1.5rem;
      animation: modalFadeIn 0.35s ease-out;
    }

    .completion-celebration-card {
      width: 100%;
      max-width: 660px;
      padding: 2rem 1.75rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      border: 2px solid var(--accent-glow);
      border-radius: 24px;
      box-shadow: 0 0 60px rgba(54, 197, 240, 0.35);
      background: rgba(11, 18, 38, 0.95);
      animation: popIn 0.35s ease-out;

      @media (max-width: 600px) { padding: 1.25rem 0.85rem; gap: 0.75rem; }
    }

    .celebration-badge-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent-glow);
    }

    .trophy-pulse {
      font-size: 1.8rem;
      filter: drop-shadow(0 0 12px gold);
    }

    .celebration-title {
      font-family: var(--font-display);
      font-size: clamp(1.3rem, 3.5vw, 1.85rem);
      font-weight: 800;
      color: #FFFFFF;
      margin: 0;
      line-height: 1.25;
    }

    .celebration-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0;
      max-width: 520px;
    }

    .accomplishments-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      width: 100%;
      margin: 0.4rem 0;
      @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
    }

    .acc-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      padding: 0.65rem 0.4rem;
      background: rgba(6, 10, 22, 0.6);
      border: 1px solid var(--border-line);
      border-radius: 10px;
    }

    .acc-icon { font-size: 1.3rem; }
    .acc-title { font-size: 0.72rem; font-weight: 700; color: #FFFFFF; }
    .acc-sub { font-size: 0.6rem; color: var(--text-faint); font-family: var(--font-mono); }

    .celebration-actions-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      width: 100%;
      flex-wrap: wrap;
    }

    .replay-mission-btn {
      padding: 0.7rem 1.3rem;
      font-size: 0.92rem;
      border-radius: 10px;
    }

    .share-cert-btn {
      padding: 0.7rem 1.1rem;
      font-size: 0.88rem;
      border-radius: 10px;
    }

    .btn-close-cert {
      padding: 0.7rem 0.9rem;
      background: transparent;
      border: 1px solid var(--border-line);
      color: var(--text-muted);
      border-radius: 10px;
      font-size: 0.82rem;
      cursor: pointer;
      &:hover { color: #FFFFFF; border-color: var(--accent-glow); }
    }
  `]
})
export class MoonExploreComponent implements OnInit, OnDestroy {
  protected readonly i18n = inject(I18nService);
  protected readonly masterTimeline = inject(MasterTimelineService);
  private readonly audio = inject(AudioService);
  private readonly scroll = inject(ScrollService);

  readonly openMission = output<MissionConfig>();

  readonly landscapeTrack = viewChild<ElementRef<HTMLElement>>('landscapeTrack');
  readonly missionFlag = viewChild<ElementRef<HTMLElement>>('missionFlag');

  readonly missions: MissionConfig[] = MISSIONS_DATA;
  readonly completedMissions = signal<Set<string>>(new Set<string>());
  readonly watchedMissions = signal<Set<string>>(new Set<string>());
  private isLockedOnMission = false;

  readonly isJourneyCompleted = signal<boolean>(false);
  readonly shareSuccess = signal<boolean>(false);

  readonly astronautX = signal<number>(440);
  readonly astronautY = signal<number>(110);
  readonly isWalking = signal<boolean>(false);
  readonly activePose = signal<'stand' | 'stride-right' | 'stride-left'>('stand');
  readonly isFlagPlanted = signal<boolean>(true);
  readonly activeNearMission = signal<MissionConfig | null>(null);
  readonly isWalkingToMission = signal<boolean>(false);

  readonly footprints = signal<{ x: number; y: number }[]>([]);

  readonly completedCount = computed(() => this.completedMissions().size);

  private scrollStopTimer: ReturnType<typeof setTimeout> | null = null;
  private walkCycleInterval: ReturnType<typeof setInterval> | null = null;
  private walkStepInterval: ReturnType<typeof setInterval> | null = null;
  private currentWalkTween: gsap.core.Tween | null = null;
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
    this.currentWalkTween?.kill();
    this.currentWalkTween = null;
    this.isWalkingToMission.set(false);
    if (this.walkStepInterval) {
      clearInterval(this.walkStepInterval);
      this.walkStepInterval = null;
    }
    if (this.scrollStopTimer) {
      clearTimeout(this.scrollStopTimer);
      this.scrollStopTimer = null;
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

    // Guard: do not override astronaut position if an explicit waypoint walk is active
    if (this.isWalkingToMission()) return;

    // Astronaut begins at 440px (clear of lander leg) and walks forward smoothly across regolith to 3680px
    const startX = 440;
    const endX = 3680;
    const targetX = startX + p * (endX - startX);
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

    // Detect proximity to nearest mission node (< 3.5% of track width)
    const currentTrackPct = (targetX / 3840) * 100;
    const near = this.missions.find(m => Math.abs(m.position.x - currentTrackPct) < 3.5);
    this.activeNearMission.set(near ?? null);

    // Auto-stop astronaut, lock scroll, and launch mission downlink video
    if (!this.isLockedOnMission) {
      const nextUnvisited = this.missions.find(m => 
        !this.watchedMissions().has(m.id) && 
        Math.abs(m.position.x - currentTrackPct) <= 2.2
      );

      if (nextUnvisited) {
        this.isLockedOnMission = true;
        this.isWalking.set(false);
        this.scroll.lockScroll();
        this.audio.playBeep(1100, 0.15);
        this.openMission.emit(nextUnvisited);
      }
    }
  }

  onMissionFinished(missionId: string): void {
    this.watchedMissions.update((set) => {
      const next = new Set(set);
      next.add(missionId);
      return next;
    });
    this.markCompleted(missionId);
    this.isLockedOnMission = false;
    this.scroll.unlockScroll();

    // Check if journey is completely finished (all 5 missions completed or Mission 5 artemis-3)
    if (this.completedMissions().size >= 5 || missionId === 'artemis-3') {
      setTimeout(() => {
        this.isJourneyCompleted.set(true);
        this.audio.playBeep(1200, 0.3);
      }, 700);
    }
  }

  replayEntireJourney(): void {
    this.isJourneyCompleted.set(false);
    this.watchedMissions.set(new Set<string>());
    this.completedMissions.set(new Set<string>());
    this.audio.playBeep(880, 0.1);
    this.scroll.scrollTo(0, { duration: 2.2 });
  }

  shareAchievement(): void {
    const text = this.i18n.currentLang() === 'ar'
      ? '🏆 أتممت بنجاح رحلة استكشاف القمر والمجموعة الشمسية مع مساحة أسيوط الفضائية وناسا! 🚀🌕'
      : '🏆 I successfully completed the NASA Lunar Exploration Mission with Asyut Space Workspace! 🚀🌕';

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.shareSuccess.set(true);
        setTimeout(() => this.shareSuccess.set(false), 3000);
      }).catch(() => {});
    }
  }

  dismissCelebration(): void {
    this.isJourneyCompleted.set(false);
  }

  /**
   * Smoothly walks astronaut to the requested mission node before opening the modal.
   * Fixed: Uses an intermediate motion object and explicitly updates the WritableSignal.
   */
  walkToAndOpenMission(mission: MissionConfig): void {
    if (this.isWalking() || this.isLockedOnMission) return;

    this.isWalkingToMission.set(true);
    this.isWalking.set(true);
    this.audio.playBeep(920, 0.08);

    // Calculate target X position along track
    const targetX = (mission.position.x / 100) * 3840 - 80;
    const currentX = this.astronautX();
    const distance = Math.abs(targetX - currentX);

    // Authentic lunar lope speed: ~150px per second with natural deceleration
    const duration = Math.max(1.35, Math.min(3.6, distance / 150));

    // Rhythmic lunar step sound every 675ms (each footfall of the lope)
    if (this.walkStepInterval) {
      clearInterval(this.walkStepInterval);
    }
    this.walkStepInterval = setInterval(() => {
      this.audio.playBeep(260 + Math.random() * 30, 0.03);
    }, 675);

    // Intermediate motion object for GSAP to drive Angular WritableSignal safely
    const motionObj = { x: currentX };
    this.currentWalkTween?.kill();
    this.currentWalkTween = gsap.to(motionObj, {
      x: targetX,
      duration: duration,
      ease: 'power1.inOut',
      onUpdate: () => {
        this.astronautX.set(motionObj.x);

        // Dynamically add footprints as astronaut walks to waypoint
        const prints = this.footprints();
        const lastPrint = prints[prints.length - 1];
        if (!lastPrint || Math.abs(motionObj.x - lastPrint.x) > 35) {
          if (prints.length < 80) {
            this.footprints.update(fps => [...fps, { x: motionObj.x, y: 108 + (fps.length % 2 === 0 ? 3 : -3) }]);
          }
        }
      },
      onComplete: () => {
        if (this.walkStepInterval) {
          clearInterval(this.walkStepInterval);
          this.walkStepInterval = null;
        }
        this.currentWalkTween = null;
        this.isWalking.set(false);
        this.isWalkingToMission.set(false);
        this.isLockedOnMission = true;
        this.scroll.lockScroll();
        this.audio.playBeep(1100, 0.15);
        this.openMission.emit(mission);
      }
    });
  }
}
