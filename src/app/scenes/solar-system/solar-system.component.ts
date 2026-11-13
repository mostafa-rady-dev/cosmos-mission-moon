import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  viewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  output,
  effect,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { I18nService } from '../../core/i18n.service';
import { MasterTimelineService } from '../../core/master-timeline.service';
import { ScrollService } from '../../core/scroll.service';
import { AudioService } from '../../core/audio.service';
import { MISSIONS_DATA, MissionConfig } from '../../../assets/missions/missions.config';
import { TEAM_MEMBERS, TeamMember } from '../../core/team.config';

export interface SubMissionRelic {
  config: MissionConfig;
  subOrder: number;
  badge: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  videoSrc: string;
  facts: Array<{ textAr: string; textEn: string }>;
  sourceAr: string;
  sourceEn: string;
}

export interface RelicStationConfig {
  id: string;
  type: 'celestial-dual' | 'team' | 'deep-space-3d';
  order: number;
  badge: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  color: string;
  glowColor: string;
  bodyImg?: string;
  modelGlb?: string;
  embedUrl?: string;
  missions?: SubMissionRelic[];
  singleMission?: SubMissionRelic;
}

export const RELIC_STATIONS: RelicStationConfig[] = [
  // 1: The Moon (مدار القمر — محطة الآثار القمرية) — Both Moon Relics
  {
    id: 'moon-system',
    type: 'celestial-dual',
    order: 1,
    badge: 'LUNAR STATION // ORBITAL RELICS',
    nameAr: 'القمر · محطة الآثار القمرية',
    nameEn: 'The Moon · Lunar Relic Station',
    locationAr: 'مدار القمر · استكشاف معالم الهبوط التاريخية',
    locationEn: 'Lunar Orbit · Historic Lunar Landings',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.55)',
    bodyImg: '/assets/images/moon_realistic.jpg',
    missions: [
      {
        config: MISSIONS_DATA[0],
        subOrder: 1,
        badge: 'LUNAR RELIC // 01',
        nameAr: 'عربة أبولو القمرية (LRV)',
        nameEn: 'Apollo Lunar Roving Vehicle',
        locationAr: 'القمر · وادي هادلي (26.13° N · 3.63° E)',
        locationEn: 'Moon · Hadley Rille (26.13° N · 3.63° E)',
        videoSrc: '/assets/videos/moon-01.mp4',
        facts: [
          {
            textAr: 'مركونة في الفراغ القمري منذ عام 1971 وستظل عجلاتها وآثارها محفورة لملايين السنين لانعدام الرياح والغلاف الجوي.',
            textEn: 'Parked in pristine vacuum since 1971; its tire tracks remain etched into regolith for millions of years.'
          },
          {
            textAr: 'قطعت مسافة 28 كم وساعدت الرواد على جمع "صخرة التكوين" بعمر 4.1 مليار سنة.',
            textEn: 'Traversed 28 km and helped retrieve the ancient 4.1-billion-year-old Genesis Rock.'
          },
          {
            textAr: 'وزنها على الأرض 210 كجم بينما على القمر 35 كجم فقط بسبب الجاذبية المنخفضة.',
            textEn: 'Earth weight 210 kg, while weighing just 35 kg on the Moon due to low gravity.'
          }
        ],
        sourceAr: 'وكالة ناسا — أرشيف مهمات أبولو المأهولة (NASA Apollo Lunar Surface Archive)',
        sourceEn: 'NASA Apollo Lunar Surface Archive & History Division'
      },
      {
        config: MISSIONS_DATA[1],
        subOrder: 2,
        badge: 'LUNAR RELIC // 02',
        nameAr: 'مسبار سيرفيور 3 الآلي',
        nameEn: 'Surveyor 3 Robotic Lander',
        locationAr: 'القمر · محيط العواصف (3.01° S · 23.42° W)',
        locationEn: 'Moon · Ocean of Storms (3.01° S · 23.42° W)',
        videoSrc: '/assets/videos/moon-02.mp4',
        facts: [
          {
            textAr: 'أول مسبار آلي مهجور في الفضاء يزوره رواد فضاء بشريون (طاقم أبولو 12 عام 1969).',
            textEn: 'First abandoned robotic spacecraft in history visited by human astronauts (Apollo 12 in 1969).'
          },
          {
            textAr: 'قام الرواد بفك كاميرته وذراع الحفر واسترجاعها للأرض لفحص تأثير الفراغ والإشعاع الشمسي.',
            textEn: 'Astronauts retrieved its camera and sampling scoop for laboratory analysis back on Earth.'
          },
          {
            textAr: 'مهد مساره الآلي الطريق لهبوط الإنسان الأول على سطح القمر بدقة متناهية.',
            textEn: 'Its automated telemetry paved the way for human lunar exploration and landing precision.'
          }
        ],
        sourceAr: 'مختبر الدفع النفاث التابع لناسا — أرشيف سيرفيور (NASA JPL)',
        sourceEn: 'NASA JPL Surveyor Program Archive'
      }
    ]
  },

  // 2: Mars (المريخ — الكوكب الأحمر) — Both Martian Relics
  {
    id: 'mars-system',
    type: 'celestial-dual',
    order: 2,
    badge: 'MARTIAN STATION // RED PLANET RELICS',
    nameAr: 'المريخ · محطة الآثار المريخية',
    nameEn: 'Mars · Martian Relics Station',
    locationAr: 'مدار المريخ · آثار الاستكشاف الخالدة',
    locationEn: 'Martian Orbit · Eternal Exploration Relics',
    color: '#FB923C',
    glowColor: 'rgba(251, 146, 60, 0.55)',
    bodyImg: '/assets/images/mars_realistic.jpg',
    missions: [
      {
        config: MISSIONS_DATA[2],
        subOrder: 1,
        badge: 'MARTIAN RELIC // 01',
        nameAr: 'روفر أبورتيونيتي (أوبي)',
        nameEn: 'Opportunity Rover (Oppy)',
        locationAr: 'المريخ · فوهة إنديفور (2.2° S · 354.5° E)',
        locationEn: 'Mars · Endeavour Crater (2.2° S · 354.5° E)',
        videoSrc: '/assets/videos/mars-01.mp4',
        facts: [
          {
            textAr: 'صُمم ليعمل 90 يوماً فقط لكنه صمد 15 عاماً قاطعاً مسافة ماراثون كامل (45.16 كم).',
            textEn: 'Designed for a 90-day sprint, yet survived 15 years driving a 45.16 km ultra-marathon.'
          },
          {
            textAr: 'اكتشف كرات الهيماتيت وعروق الجبس التي أثبتت وجود مياه سائلة عذبة في ماضي المريخ.',
            textEn: 'Discovered hematite spherules and gypsum veins proving ancient fresh liquid water.'
          },
          {
            textAr: 'دخل نومه الأبدي عام 2018 إثر عاصفة ترابية كبرى: "بطاريتي منخفضة والدنيا تظلم".',
            textEn: 'Entered eternal sleep in 2018 after a planetary dust storm blocked solar arrays.'
          }
        ],
        sourceAr: 'مختبر الدفع النفاث التابع لناسا — مهمة مسبار المريخ MER (NASA JPL)',
        sourceEn: 'NASA Jet Propulsion Laboratory (JPL) Mars Exploration Rover Mission'
      },
      {
        config: MISSIONS_DATA[3],
        subOrder: 2,
        badge: 'MARTIAN RELIC // 02',
        nameAr: 'مروحية إنجينويتي ومسبار سبيريت',
        nameEn: 'Ingenuity Helicopter & Spirit',
        locationAr: 'المريخ · تلال فالينور بفوهة جيزيرو (18.44° N · 77.45° E)',
        locationEn: 'Mars · Jezero Crater Valinor Hills (18.44° N · 77.45° E)',
        videoSrc: '/assets/videos/mars-02.mp4',
        facts: [
          {
            textAr: 'أول مركبة طيران ديناميكي مدفوع بمروحة تحلق في سماء كوكب آخر (72 رحلة بدلاً من 5).',
            textEn: 'First powered aerodynamic flight on an extraterrestrial world, achieving 72 flights.'
          },
          {
            textAr: 'دارت شفراتها بسرعة 2,400 دورة/دقيقة لتوليد قوة الرفع في هواء المريخ ذي الكثافة 1%.',
            textEn: 'Blades spun at 2,400 RPM to generate lift in Mars\' ultra-thin 1% atmospheric density.'
          },
          {
            textAr: 'حملت قطعة من جناح طائرة الأخوين رايت لعام 1903 وتستقر كنصب تذكاري خالد على الرمال.',
            textEn: 'Carried a piece of the 1903 Wright Flyer, resting as an eternal monument on Mars sand.'
          }
        ],
        sourceAr: 'وكالة ناسا ومختبر الدفع النفاث — أرشيف إنجينويتي (NASA JPL)',
        sourceEn: 'NASA Jet Propulsion Laboratory (JPL) Ingenuity Mars Archive'
      }
    ]
  },

  // 3: Station 03 — Team Showcase: Expedition Command Crew
  {
    id: 'team-station',
    type: 'team',
    order: 3,
    badge: 'EXPEDITION CREW // 10 SPECIALISTS',
    nameAr: 'طاقم قيادة البعثة · فريق أسيوط',
    nameEn: 'Expedition Command Crew · Team Asyut',
    locationAr: 'حزام الكويكبات · بوابة القيادة الفضائية',
    locationEn: 'Asteroid Belt · Space Command Gateway',
    color: '#FBBF24',
    glowColor: 'rgba(251, 191, 36, 0.6)'
  },

  // 4: Station 04 — Pioneer 10 & Golden Plaque (3D Interactive Model)
  {
    id: 'deep-space-pioneer',
    type: 'deep-space-3d',
    order: 4,
    badge: 'DEEP SPACE RELIC // 01',
    nameAr: 'مسبار بايونير 10 واللوحة الذهبية',
    nameEn: 'Pioneer 10 & The Golden Plaque',
    locationAr: 'الفضاء العميق · باتجاه كوكبة الثور ونجم الدبران',
    locationEn: 'Deep Space Void · Heading toward Aldebaran',
    color: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.55)',
    modelGlb: '/assets/models/pioneer-10.glb',
    bodyImg: '/assets/images/pioneer_nasa_3d.png',
    singleMission: {
      config: MISSIONS_DATA[4],
      subOrder: 1,
      badge: 'DEEP SPACE RELIC // 01',
      nameAr: 'مسبار بايونير 10 واللوحة الذهبية',
      nameEn: 'Pioneer 10 & The Golden Plaque',
      locationAr: 'الفضاء العميق · باتجاه كوكبة الثور ونجم الدبران',
      locationEn: 'Deep Space Void · Heading toward Aldebaran',
      videoSrc: '/assets/videos/pioneer-01.mp4',
      facts: [
        {
          textAr: 'أول مركبة بشرية تجتاز حزام الكويكبات وتزور كوكب المشتري وتتخطى مدار نبتون.',
          textEn: 'First human craft to safely cross asteroid belt, fly by Jupiter, and breach Neptune’s orbit.'
        },
        {
          textAr: 'تحمل اللوحة الذهبية المنقوشة برسم الإنسان وموقع الأرض بين النجوم النابضة كرسالة سلام.',
          textEn: 'Carries the gold-anodized plaque depicting humanity and pulsar map coordinates.'
        },
        {
          textAr: 'أرسلت آخر همسة راديوية خافتة للأرض عام 2003 وتسبح الآن صامتة في الفضاء لملايين السنين.',
          textEn: 'Transmitted its last faint signal in 2003; coasting in deep space for millions of years.'
        }
      ],
      sourceAr: 'وكالة ناسا — مركز أبحاث أميس (NASA Ames Research Center & Pioneer Program)',
      sourceEn: 'NASA Ames Research Center & Pioneer Interplanetary Mission Archive'
    }
  },

  // 5: Station 05 — Voyager 1 & The Golden Record (3D NASA Interactive Embed)
  {
    id: 'interstellar-voyager',
    type: 'deep-space-3d',
    order: 5,
    badge: 'INTERSTELLAR RELIC // 01',
    nameAr: 'مسبار فوياجر 1 والقرص الذهبي',
    nameEn: 'Voyager 1 & The Golden Record',
    locationAr: 'الفضاء بين النجمي · ما وراء الهليوبوز (164+ AU)',
    locationEn: 'Interstellar Void · Beyond the Heliopause (164+ AU)',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.55)',
    embedUrl: 'https://solarsystem.nasa.gov/gltf_embed/2340/',
    modelGlb: '/assets/models/voyager-1.glb',
    bodyImg: '/assets/images/voyager_nasa_3d.png',
    singleMission: {
      config: MISSIONS_DATA[5],
      subOrder: 1,
      badge: 'INTERSTELLAR RELIC // 01',
      nameAr: 'مسبار فوياجر 1 والقرص الذهبي',
      nameEn: 'Voyager 1 & The Golden Record',
      locationAr: 'الفضاء بين النجمي · ما وراء الهليوبوز (164+ AU)',
      locationEn: 'Interstellar Void · Beyond the Heliopause (164+ AU)',
      videoSrc: '/assets/videos/voyager-01.mp4',
      facts: [
        {
          textAr: 'أبعد جسم صنعه البشر في تاريخ الحضارة (أكثر من 24.6 مليار كيلومتر عن الأرض).',
          textEn: 'The most distant human-made object in history (>24.6 Billion km from Earth).'
        },
        {
          textAr: 'أول مركبة تجتاز حدود الغلاف الشمسي (الهليوبوز) لتسبح في الفضاء بين النجمي الحقيقي.',
          textEn: 'First craft to cross the heliopause into true interstellar galactic plasma.'
        },
        {
          textAr: 'تحمل القرص الذهبي الحاوي لأصوات وموسيقى ورسائل سلام كوكب الأرض المحفوظة لمليار عام.',
          textEn: 'Carries the Golden Record time capsule guaranteed to endure in the cosmic void for a billion years.'
        }
      ],
      sourceAr: 'وكالة ناسا ومختبر الدفع النفاث — مشروع فوياجر بين النجوم (NASA JPL)',
      sourceEn: 'NASA Voyager Interstellar Mission & Jet Propulsion Laboratory'
    }
  }
];

@Component({
  selector: 'app-solar-system',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section 
      #sceneContainer 
      class="scene-solar"
      [style.opacity]="masterTimeline.getSceneVisibility(2).opacity"
      [attr.aria-label]="i18n.currentLang() === 'ar' ? 'رحلة الآثار الفضائية المهجورة' : 'Relic Odyssey Flight Corridor'"
    >
      <!-- Deep Space Starfield Backdrop -->
      <div class="deep-space-backdrop" aria-hidden="true">
        <div class="deep-space-image"></div>
        <div class="deep-space-overlay"></div>
      </div>

      <!-- Quick Action Skip Button -->
      <button 
        class="skip-to-moon-btn"
        (click)="skipForward()"
        [attr.aria-label]="i18n.currentLang() === 'ar' ? 'تخطي سريع للمحطة التالية' : 'Fast Travel'"
      >
        <span>{{ skipButtonLabel() }}</span>
      </button>

      <!-- Dynamic World Camera Track -->
      <div 
        #cameraEl
        class="world-camera-track"
      >
        <!-- Flight Path Curves SVG -->
        <svg 
          viewBox="0 0 1000 8400" 
          class="world-flight-svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="glowTrailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.95" />
              <stop offset="35%" stop-color="#FB923C" stop-opacity="0.9" />
              <stop offset="60%" stop-color="#FBBF24" stop-opacity="0.9" />
              <stop offset="85%" stop-color="#EAB308" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#A855F7" stop-opacity="0.95" />
            </linearGradient>

          </defs>

          <!-- 1. Faint Dashed Projected Path Ahead -->
          <path 
            #guidePathRef
            [attr.d]="svgPathD"
            class="flight-path-ahead"
            fill="none" 
            stroke="rgba(56, 189, 248, 0.28)" 
            stroke-width="5" 
            stroke-dasharray="14 18"
          />

          <!-- 2a. Soft glow under the traveled path (wide translucent stroke, replaces the heavy SVG blur filter) -->
          <path 
            #trailGlow
            [attr.d]="svgPathD"
            class="flight-path-glow"
            fill="none" 
            stroke="url(#glowTrailGrad)" 
            stroke-width="22" 
            stroke-linecap="round"
            opacity="0.22"
            [style.strokeDasharray]="totalPathLength()"
          />

          <!-- 2b. Progressive Solid Path Traveled Behind Cruiser (dashoffset is driven per-frame from the ship's real arc-length) -->
          <path 
            #trailCore
            [attr.d]="svgPathD"
            class="flight-path-traveled"
            fill="none" 
            stroke="url(#glowTrailGrad)" 
            stroke-width="6" 
            stroke-linecap="round"
            [style.strokeDasharray]="totalPathLength()"
          />
        </svg>

        <!-- Arrival Waypoint Pulse Rings for each Station -->
        @for (pos of waypointWorldPositions; track $index) {
          <div 
            class="station-waypoint-marker"
            [style.left.px]="pos.x"
            [style.top.px]="pos.y"
            [class.marker-active]="activeStationIndex() === $index && isStationArrived()"
            aria-hidden="true"
          >
            <div class="marker-pulse-ring"></div>
            <div class="marker-center-dot" [style.backgroundColor]="stations[$index].color"></div>
            <span class="marker-label">0{{ $index + 1 }}</span>
          </div>
        }

        <!-- Active Station Container -->
        <div class="world-stations-container">
          @if (isCurrentStationVisible()) {
            
            <!-- CASE A: Dual-Mission Celestial Station (Moon & Mars) OR Deep-Space 3D Station (Pioneer & Voyager) -->
            @if (activeStation().type === 'celestial-dual' || activeStation().type === 'deep-space-3d') {
              <div 
                class="active-planet-station"
                [class.station-flipped]="isStationFlipped()"
                [style.top.px]="activeStationWorldY()"
                [style.left.px]="activeStationWorldX()"
              >
                <!-- Visual Anchor (Spherical Planet Disk OR 3D Interactive Model) -->
                <div 
                  class="station-planet-anchor"
                  [style.opacity]="stationPhase().planetOpacity"
                  [style.transform]="stationPhase().planetTransform"
                >
                  @if (activeStation().type === 'deep-space-3d') {
                    <!-- Deep Space 3D Interactive Model (Pioneer 10 & Voyager 1) -->
                    <div class="probe-3d-interactive-wrap">
                      <model-viewer
                        [attr.src]="activeStation().modelGlb"
                        [attr.poster]="activeStation().bodyImg"
                        auto-rotate
                        rotation-per-second="18deg"
                        camera-controls
                        autoplay
                        interaction-prompt="none"
                        shadow-intensity="1.5"
                        exposure="1.2"
                        class="nasa-model-viewer-element"
                        [attr.alt]="activeStation().nameEn"
                      >
                      </model-viewer>
                    </div>
                  } @else {
                    <!-- Spherical Moon / Mars Celestial Disk (Real Planet Image) -->
                    <div 
                      class="spherical-planet-disk"
                      [style.boxShadow]="'0 0 70px ' + activeStation().glowColor + ', inset 0 0 35px rgba(0,0,0,0.65)'"
                    >
                      <img 
                        [src]="activeStation().bodyImg" 
                        [alt]="activeStation().nameEn" 
                        class="planet-surface-img" 
                        loading="lazy" 
                      />
                      <div class="planet-clean-halo" [style.borderColor]="activeStation().glowColor"></div>
                    </div>
                  }
                </div>

                <!-- Mission Information Card Docked Opposite of Body -->
                <div 
                  class="station-card-anchor hud-panel"
                  [style.opacity]="stationPhase().cardOpacity"
                  [style.transform]="stationPhase().cardTransform"
                  [attr.aria-label]="activeStation().nameEn"
                >
                  <!-- Dual Mission Tab Selector (Only for Moon and Mars) -->
                  @if (activeStation().type === 'celestial-dual' && activeStation().missions) {
                    <div class="dual-mission-tab-bar">
                      @for (m of activeStation().missions; track $index) {
                        <button 
                          class="tab-pill-btn"
                          [class.active-tab]="activeSubMissionIndex() === $index"
                          (click)="selectSubMission($index)"
                          type="button"
                        >
                          <span class="tab-index-badge">0{{ $index + 1 }}</span>
                          <span class="tab-label-text">{{ i18n.currentLang() === 'ar' ? m.nameAr : m.nameEn }}</span>
                        </button>
                      }
                    </div>
                  }

                  <!-- Card Header Bar -->
                  <div class="card-header-bar">
                    <div class="station-meta-pill">
                      <span class="meta-dot" [style.backgroundColor]="activeStation().color"></span>
                      <span class="meta-id">{{ currentMission()?.badge }}</span>
                    </div>
                    <h3 class="station-hero-name">
                      {{ i18n.currentLang() === 'ar' ? currentMission()?.nameAr : currentMission()?.nameEn }}
                    </h3>
                    <span class="station-coords-chip">{{ currentMission()?.locationAr }}</span>
                  </div>

                  <!-- 3 Staggered Scientific Facts with 3D Flip -->
                  <div class="station-facts-stack">
                    @for (fact of currentMission()?.facts; track $index) {
                      <div 
                        class="staggered-fact-card"
                        [style.opacity]="getFactOpacity($index)"
                        [style.transform]="getFactTransform($index)"
                        [class.card-flipped]="flippedCards()[$index]"
                        (click)="toggleCardFlip($index)"
                        role="button"
                        tabindex="0"
                        (keydown.enter)="toggleCardFlip($index)"
                        (keydown.space)="toggleCardFlip($index)"
                      >
                        <div class="fact-card-inner">
                          <div class="fact-card-front">
                            <div class="fact-top-row">
                              <span class="fact-order-chip" [style.color]="activeStation().color" [style.borderColor]="activeStation().color">
                                0{{ $index + 1 }}
                              </span>
                              <span class="reveal-hint">⟲ {{ i18n.currentLang() === 'ar' ? 'انقر للتوثيق' : 'Tap to reveal' }}</span>
                            </div>
                            <p class="fact-content-text">
                              {{ i18n.currentLang() === 'ar' ? fact.textAr : fact.textEn }}
                            </p>
                          </div>
                          <div class="fact-card-back" [style.borderColor]="activeStation().color">
                            <span class="back-archive-tag">NASA RECORD</span>
                            <p class="back-fact-text">
                              {{ i18n.currentLang() === 'ar' ? fact.textAr : fact.textEn }}
                            </p>
                            <span class="back-source-label">
                              {{ i18n.currentLang() === 'ar' ? currentMission()?.sourceAr : currentMission()?.sourceEn }}
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Action Button: Open Official Mission Video -->
                  @if (currentMission()?.config) {
                    <div class="card-video-action-row" [style.opacity]="stationPhase().cardOpacity">
                      <button 
                        class="btn-cinema-launch-video"
                        [style.borderColor]="activeStation().color"
                        [style.boxShadow]="'0 0 20px ' + activeStation().glowColor"
                        (click)="triggerMissionModal(currentMission()!.config)"
                      >
                        <span class="play-pulse-icon">▶</span>
                        <span class="action-btn-text">
                          {{ i18n.currentLang() === 'ar' ? 'مشاهدة الفيديو الميداني 🎬' : 'Watch Field Downlink Video 🎬' }}
                        </span>
                        <span class="video-format-pill">NASA HD</span>
                      </button>
                    </div>
                  }

                  <!-- Official NASA Source Pill -->
                  <div 
                    class="station-nasa-source-pill"
                    [style.opacity]="stationPhase().sourceOpacity"
                  >
                    <span class="nasa-worm-logo">NASA</span>
                    <span class="nasa-source-citation">
                      {{ i18n.currentLang() === 'ar' ? currentMission()?.sourceAr : currentMission()?.sourceEn }}
                    </span>
                  </div>
                </div>
              </div>
            }

            <!-- CASE B: Station 03 — Team Showcase Station -->
            @if (activeStation().type === 'team') {
              <div 
                class="active-team-station"
                [style.top.px]="activeStationWorldY()"
                [style.left.px]="activeStationWorldX()"
                [style.opacity]="stationPhase().cardOpacity"
                [style.transform]="'translate(-50%, -50%) ' + stationPhase().cardTransform"
              >
                <!-- Command Deck Header -->
                <div class="team-deck-header">
                  <div class="team-badge-pill">
                    <span class="team-beacon-dot"></span>
                    <span>EXPEDITION COMMAND // TEAM ASYUT</span>
                  </div>
                  <h2 class="team-deck-title">
                    {{ i18n.currentLang() === 'ar' ? 'أبطال البعثة ومبتكرو المشروع' : 'Expedition Pioneers & Project Creators' }}
                  </h2>
                  <p class="team-deck-subtitle">
                    {{ i18n.currentLang() === 'ar' ? 'تحدي تطبيقات الفضاء التابع لناسا 2026 — «مهجورة لكنها لم تُنسَ»' : 'NASA Space Apps Challenge 2026 — "Abandoned But Not Forgotten"' }}
                  </p>
                </div>

                <!-- Polaroid wall: every member is a taped, slightly tilted snapshot -->
                <div class="team-cards-grid">
                  @for (member of teamMembers; track member.id; let i = $index) {
                    <figure 
                      class="polaroid"
                      [class.polaroid-tape-b]="i % 2 === 1"
                      [style.--accent]="member.glowColor"
                      tabindex="0"
                      role="button"
                      [attr.aria-label]="member.nameEn"
                      (click)="onMemberClick(member)"
                      (keydown.enter)="onMemberClick(member)"
                    >
                      <span class="polaroid-tape" aria-hidden="true"></span>
                      <div class="polaroid-photo">
                        <img 
                          [src]="member.avatar" 
                          [alt]="member.nameEn" 
                          class="polaroid-img" 
                          loading="lazy"
                          (error)="onAvatarError($event)" 
                        />
                      </div>
                    </figure>
                  }
                </div>

                <!-- Astronomy Club photos (shown in full, uncropped) -->
                <div class="club-gallery">
                  @for (photo of clubPhotos; track photo.src) {
                    <figure class="club-photo">
                      <img
                        [src]="photo.src"
                        [alt]="i18n.currentLang() === 'ar' ? photo.altAr : photo.altEn"
                        loading="lazy"
                      />
                    </figure>
                  }
                </div>
              </div>
            }
          }
        </div>

        <!-- Spacecraft Avatar Pinned Above World Track (Top z-index) -->
        <div 
          #cruiserEl
          class="world-cruiser-avatar"
          aria-label="Asyut Deep Space Cruiser"
        >
          <!-- Thruster Ion Glow Bloom -->
          <div class="cruiser-thruster-exhaust"></div>
          <img 
            src="/assets/images/cruiser_realistic.png" 
            alt="Asyut Spacecraft" 
            class="cruiser-hull-img" 
          />
        </div>
      </div>

      <!-- Station Arrival Audio Beep Trigger -->
      <audio #arrivalAudioRef src="/assets/audio/checkpoint.mp3" preload="none"></audio>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .scene-solar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
      overflow: hidden;
      transition: opacity 0.5s ease;
    }

    .deep-space-backdrop {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
    }

    .deep-space-image {
      position: absolute;
      inset: -5%;
      width: 110%;
      height: 110%;
      background: radial-gradient(ellipse at 50% 40%, rgba(14, 23, 50, 0.6) 0%, rgba(3, 7, 18, 0.98) 75%),
                  url('/assets/images/deep-space-stars.jpg') center/cover no-repeat;
      filter: brightness(0.85) contrast(1.1);
    }

    .deep-space-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, transparent 40%, rgba(2, 4, 12, 0.8) 100%);
    }

    .skip-to-moon-btn {
      position: fixed;
      top: 5.5rem;
      left: 2rem;
      z-index: 60;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1.1rem;
      background: rgba(8, 14, 30, 0.85);
      border: 1px solid rgba(56, 189, 248, 0.45);
      border-radius: 999px;
      color: #38BDF8;
      font-family: var(--font-mono, monospace);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      cursor: pointer;
      pointer-events: auto;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(56, 189, 248, 0.25);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        background: rgba(14, 28, 60, 0.95);
        border-color: #38BDF8;
        color: #FFFFFF;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.5);
        transform: translateY(-2px);
      }

      @media (max-width: 768px) {
        top: 4.8rem;
        left: 1rem;
        padding: 0.45rem 0.85rem;
        font-size: 0.7rem;
      }
    }

    .world-camera-track {
      position: absolute;
      top: 0;
      left: 0;
      width: 1000px;
      height: 8400px;
      transform-origin: 0 0;
      will-change: transform;
      pointer-events: none;
      z-index: 20;
    }

    .world-flight-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 1000px;
      height: 8400px;
      overflow: visible;
      pointer-events: none;
      z-index: 10;
    }

    .flight-path-ahead {
      stroke-linecap: round;
    }

    .station-waypoint-marker {
      position: absolute;
      width: 32px;
      height: 32px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 25;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .marker-pulse-ring {
      position: absolute;
      inset: -12px;
      border: 2px solid rgba(251, 146, 60, 0.7);
      border-radius: 50%;
      opacity: 0;
      transform: scale(0.6);
      transition: all 0.4s ease;
    }

    .marker-active .marker-pulse-ring {
      opacity: 1;
      transform: scale(1.4);
      animation: ringPulse 1.6s cubic-bezier(0.25, 1, 0.5, 1) infinite;
    }

    @keyframes ringPulse {
      0% {
        transform: scale(0.8);
        opacity: 0.9;
        border-color: rgba(251, 146, 60, 0.9);
      }
      70% {
        transform: scale(2.2);
        opacity: 0;
        border-color: rgba(251, 146, 60, 0);
      }
      100% {
        transform: scale(2.4);
        opacity: 0;
      }
    }

    .marker-center-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #FB923C;
      box-shadow: 0 0 12px #FB923C;
    }

    .marker-label {
      position: absolute;
      bottom: -18px;
      font-family: var(--font-mono, monospace);
      font-size: 0.65rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: 0.1em;
    }

    .world-stations-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 1000px;
      height: 8400px;
      pointer-events: none;
      z-index: 30;
    }

    .active-planet-station {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14rem;
      pointer-events: auto;
      transform: translate(-50%, -50%);
      width: min(94vw, 1600px);

      @media (max-width: 1200px) {
        width: 96vw;
        gap: 6rem;
      }

      @media (max-width: 900px) {
        flex-direction: column;
        gap: 2rem;
        width: 92vw;
      }
    }

    .station-flipped {
      flex-direction: row-reverse;

      @media (max-width: 900px) {
        flex-direction: column;
      }
    }

    .station-planet-anchor {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      will-change: transform, opacity;
      flex-shrink: 0;
    }

    /* Spherical Moon / Mars Disk */
    .spherical-planet-disk {
      position: relative;
      width: 380px;
      height: 380px;
      border-radius: 50%;
      overflow: hidden;
      background: #02040A;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: box-shadow 0.5s ease;

      @media (max-width: 900px) {
        width: 250px;
        height: 250px;
      }
    }

    .planet-surface-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      filter: contrast(1.1) brightness(0.95);
    }

    .planet-clean-halo {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2px solid rgba(56, 189, 248, 0.4);
      pointer-events: none;
      box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.8);
    }

    /* 3D Interactive Probe Wrap (Pioneer 10 & Voyager 1) - Completely Borderless in Space */
    .probe-3d-interactive-wrap {
      position: relative;
      width: 580px;
      height: 580px;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      overflow: visible;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 1200px) {
        width: 460px;
        height: 460px;
      }

      @media (max-width: 900px) {
        width: 320px;
        height: 320px;
      }
    }

    .nasa-model-viewer-element {
      width: 100%;
      height: 100%;
      --poster-color: transparent;
      outline: none;
      background: transparent !important;
      background-color: transparent !important;
    }

    /* Mission Information Card Anchor */
    .station-card-anchor {
      width: 450px;
      background: rgba(8, 14, 32, 0.88);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 20px;
      padding: 1.75rem 1.85rem;
      backdrop-filter: blur(16px);
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.75), inset 0 0 25px rgba(56, 189, 248, 0.08);
      will-change: transform, opacity;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;

      @media (max-width: 900px) {
        width: 100%;
        padding: 1.25rem 1.2rem;
        gap: 0.9rem;
      }
    }

    /* Dual Mission Tab Bar for Moon and Mars */
    .dual-mission-tab-bar {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      background: rgba(10, 16, 36, 0.65);
      padding: 0.3rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .tab-pill-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.45rem 0.6rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 8px;
      color: #94A3B8;
      font-family: var(--font-display, sans-serif);
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        color: #FFFFFF;
        background: rgba(255, 255, 255, 0.06);
      }

      &.active-tab {
        background: rgba(56, 189, 248, 0.18);
        border-color: rgba(56, 189, 248, 0.5);
        color: #FFFFFF;
        box-shadow: 0 0 16px rgba(56, 189, 248, 0.25);
      }
    }

    .tab-index-badge {
      font-family: var(--font-mono, monospace);
      font-size: 0.68rem;
      padding: 0.1rem 0.35rem;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
    }

    .card-header-bar {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .station-meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #94A3B8;
    }

    .meta-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #38BDF8;
    }

    .station-hero-name {
      font-family: var(--font-display, sans-serif);
      font-size: 1.65rem;
      font-weight: 900;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: -0.01em;

      @media (max-width: 900px) {
        font-size: 1.35rem;
      }
    }

    .station-coords-chip {
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      color: #38BDF8;
      letter-spacing: 0.05em;
    }

    .station-facts-stack {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .staggered-fact-card {
      perspective: 1000px;
      cursor: pointer;
      will-change: transform, opacity;
      transition: transform 0.25s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .fact-card-inner {
      position: relative;
      width: 100%;
      min-height: 78px;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 12px;
    }

    .card-flipped .fact-card-inner {
      transform: rotateY(180deg);
    }

    .fact-card-front,
    .fact-card-back {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      border-radius: 12px;
      padding: 0.85rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .fact-card-front {
      background: rgba(14, 22, 48, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      gap: 0.4rem;
    }

    .fact-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .fact-order-chip {
      font-family: var(--font-mono, monospace);
      font-size: 0.68rem;
      font-weight: 800;
      padding: 0.1rem 0.45rem;
      border: 1px solid currentColor;
      border-radius: 6px;
    }

    .reveal-hint {
      font-size: 0.65rem;
      color: #64748B;
      font-family: var(--font-mono, monospace);
    }

    .fact-content-text {
      font-size: 0.84rem;
      line-height: 1.45;
      color: #E2E8F0;
      margin: 0;
    }

    .fact-card-back {
      background: rgba(22, 34, 72, 0.95);
      border: 1px solid #38BDF8;
      transform: rotateY(180deg);
      gap: 0.3rem;
    }

    .back-archive-tag {
      font-family: var(--font-mono, monospace);
      font-size: 0.65rem;
      font-weight: 800;
      color: #38BDF8;
      letter-spacing: 0.08em;
    }

    .back-fact-text {
      font-size: 0.8rem;
      line-height: 1.4;
      color: #FFFFFF;
      margin: 0;
    }

    .back-source-label {
      font-size: 0.68rem;
      color: #94A3B8;
      font-family: var(--font-mono, monospace);
    }

    /* Video Launch Action Button */
    .card-video-action-row {
      margin-top: 0.25rem;
      width: 100%;
    }

    .btn-cinema-launch-video {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, rgba(14, 28, 64, 0.95) 0%, rgba(6, 12, 28, 0.95) 100%);
      border: 1px solid #38BDF8;
      border-radius: 12px;
      color: #FFFFFF;
      font-family: var(--font-display, sans-serif);
      font-size: 0.92rem;
      font-weight: 800;
      cursor: pointer;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-2px);
        background: linear-gradient(135deg, rgba(24, 48, 104, 0.95) 0%, rgba(10, 20, 48, 0.95) 100%);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .play-pulse-icon {
      font-size: 0.85rem;
      color: #FBBF24;
      animation: pulsePlay 1.2s infinite ease-in-out;
    }

    @keyframes pulsePlay {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.25); opacity: 1; }
    }

    .video-format-pill {
      font-family: var(--font-mono, monospace);
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.15rem 0.45rem;
      background: rgba(251, 191, 36, 0.2);
      border: 1px solid rgba(251, 191, 36, 0.5);
      border-radius: 6px;
      color: #FBBF24;
      margin-inline-start: auto;
    }

    .station-nasa-source-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding-top: 0.6rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-family: var(--font-mono, monospace);
      font-size: 0.7rem;
      color: #94A3B8;
      transition: opacity 0.3s ease;
    }

    .nasa-worm-logo {
      font-weight: 900;
      color: #EF4444;
      letter-spacing: 0.15em;
    }

    .nasa-source-citation {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* CASE B: STATION 03 — TEAM SHOWCASE: POLAROID WALL */
    .active-team-station {
      position: absolute;
      transform: translate(-50%, -50%);
      width: min(94vw, 1100px);
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: auto;
      padding: 0.5rem 1rem;

      @media (max-width: 900px) {
        width: 95vw;
        padding: 0.5rem;
        max-height: 85vh;
        overflow-y: auto;
      }
    }

    .team-deck-header {
      text-align: center;
      margin-bottom: 0.75rem;
      text-shadow: 0 2px 18px rgba(0, 0, 0, 0.9);

      @media (max-height: 820px) {
        margin-bottom: 0.45rem;
      }
    }

    .team-badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.8rem;
      background: rgba(251, 191, 36, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.4);
      border-radius: 999px;
      font-family: var(--font-mono, monospace);
      font-size: 0.7rem;
      font-weight: 800;
      color: #FBBF24;
      margin-bottom: 0.35rem;
    }

    .team-beacon-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #FBBF24;
      box-shadow: 0 0 10px #FBBF24;
      animation: ringPulse 1.2s infinite ease-out;
    }

    .team-deck-title {
      font-family: var(--font-display, sans-serif);
      font-size: 1.35rem;
      font-weight: 900;
      color: #FFFFFF;
      margin: 0 0 0.25rem 0;

      @media (max-width: 900px), (max-height: 820px) {
        font-size: 1.15rem;
      }
    }

    .team-deck-subtitle {
      font-size: 0.8rem;
      color: #B6C2D9;
      margin: 0;

      @media (max-width: 900px) {
        font-size: 0.7rem;
      }
    }

    /* Photo wall: 5 per row, each photo tilted slightly like pinned snapshots */
    .team-cards-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.1rem 1.1rem;
      width: 100%;
      max-width: 900px;
      justify-items: center;
      padding: 0.25rem 0.2rem;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(5, 1fr);
        gap: 0.85rem 0.85rem;
      }

      @media (max-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.85rem 0.85rem;
      }

      @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.7rem 0.6rem;
      }
    }

    .polaroid {
      --rot: 0deg;
      --lift: 0px;
      --accent: #38BDF8;
      position: relative;
      width: 100%;
      /* compact size so the entire wall easily fits inside any screen height */
      max-width: clamp(105px, 14vh, 150px);
      margin: 0;
      padding: 6px 6px 8px;
      background: #FAF5EC;
      border-radius: 3px;
      color: #1B2540;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35), 0 14px 26px rgba(0, 0, 0, 0.45);
      transform: translateY(var(--lift)) rotate(var(--rot));
      transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;

      &:nth-child(10n + 1) { --rot: -2.5deg; --lift: 3px; }
      &:nth-child(10n + 2) { --rot: 2deg;    --lift: 0px; }
      &:nth-child(10n + 3) { --rot: -1.5deg; --lift: 4px; }
      &:nth-child(10n + 4) { --rot: 2.8deg;  --lift: 1px; }
      &:nth-child(10n + 5) { --rot: -2deg;   --lift: 3px; }
      &:nth-child(10n + 6) { --rot: 2deg;    --lift: 2px; }
      &:nth-child(10n + 7) { --rot: -3deg;   --lift: 4px; }
      &:nth-child(10n + 8) { --rot: 1.5deg;  --lift: 0px; }
      &:nth-child(10n + 9) { --rot: -1.8deg; --lift: 3px; }
      &:nth-child(10n + 10) { --rot: 2.4deg; --lift: 1px; }

      &:hover,
      &:focus-visible {
        outline: none;
        z-index: 5;
        transform: translateY(calc(var(--lift) - 8px)) rotate(0deg) scale(1.06);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35), 0 22px 38px rgba(0, 0, 0, 0.6), 0 0 0 3px var(--accent);
      }
    }

    /* Strip of tape holding the photo (pure CSS, no image asset) */
    .polaroid-tape {
      position: absolute;
      top: -9px;
      left: 50%;
      width: 58px;
      height: 18px;
      transform: translateX(-50%) rotate(-3deg);
      background: linear-gradient(180deg, rgba(247, 234, 200, 0.92), rgba(230, 211, 168, 0.86));
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      clip-path: polygon(0 0, 100% 0, 98% 20%, 100% 40%, 98% 60%, 100% 80%, 98% 100%, 0 100%, 2% 80%, 0 60%, 2% 40%, 0 20%);
      pointer-events: none;
      z-index: 2;
    }

    .polaroid-tape-b .polaroid-tape {
      top: 3px;
      left: auto;
      right: -16px;
      width: 52px;
      transform: rotate(40deg);
    }

    .polaroid-photo {
      aspect-ratio: 1 / 1;
      overflow: hidden;
      border-radius: 2px;
      background: linear-gradient(135deg, var(--accent), #0B1226);
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.14);
    }

    .polaroid-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 15%;
      display: block;
      filter: saturate(1.05) contrast(1.03);

      &.img-missing {
        visibility: hidden;
      }
    }

    /* Club photos: natural aspect ratio, never cropped */
    .club-gallery {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.2rem;
      width: 100%;
      max-width: 860px;
      margin-top: 1rem;

      @media (max-width: 900px) {
        flex-direction: column;
        gap: 0.75rem;
      }
    }

    .club-photo {
      margin: 0;
      padding: 0.35rem;
      background: rgba(8, 14, 32, 0.88);
      border: 1px solid rgba(251, 191, 36, 0.4);
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(251, 191, 36, 0.18);
      max-width: 100%;

      img {
        display: block;
        height: clamp(85px, 13vh, 125px);
        width: auto;
        max-width: 100%;
        border-radius: 6px;
        object-fit: cover;

        @media (max-width: 900px) {
          width: 100%;
          height: auto;
        }
      }
    }

    /* Spacecraft Avatar Pinned Above World Track */
    .world-cruiser-avatar {
      position: absolute;
      left: 0;
      top: 0;
      width: 170px;
      height: 96px;
      pointer-events: none;
      z-index: 50;
      will-change: transform;
      filter: drop-shadow(0 0 24px rgba(56, 189, 248, 0.8));
    }

    .cruiser-hull-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .cruiser-thruster-exhaust {
      position: absolute;
      top: 50%;
      right: calc(100% - 30px);
      transform: translateY(-50%);
      width: calc(20px + 45px * var(--thrust, 0.4));
      height: 32px;
      background: radial-gradient(ellipse at right, #FFFFFF 0%, #38BDF8 35%, rgba(56, 189, 248, 0.6) 60%, transparent 85%);
      filter: blur(3px);
      animation: exhaustFlicker 0.18s infinite alternate ease-in-out;
      pointer-events: none;
    }

    @keyframes exhaustFlicker {
      0% {
        transform: translateY(-50%) scale(0.9, 0.85);
        opacity: 0.8;
      }
      100% {
        transform: translateY(-50%) scale(1.2, 1.25);
        opacity: 1;
      }
    }
  `]
})
export class SolarSystemComponent implements AfterViewInit, OnDestroy {
  readonly masterTimeline = inject(MasterTimelineService);
  readonly i18n = inject(I18nService);
  private readonly scroll = inject(ScrollService);
  private readonly audio = inject(AudioService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly openMission = output<MissionConfig>();
  readonly memberClicked = output<TeamMember>();
  /** Emitted once each time the cruiser arrives (starts hovering) at a station. Index = station index. */
  readonly stopArrived = output<number>();

  readonly sceneContainer = viewChild<ElementRef<HTMLElement>>('sceneContainer');
  readonly arrivalAudioRef = viewChild<ElementRef<HTMLAudioElement>>('arrivalAudioRef');
  readonly guidePathRef = viewChild<ElementRef<SVGPathElement>>('guidePathRef');
  readonly cameraEl = viewChild<ElementRef<HTMLElement>>('cameraEl');
  readonly cruiserEl = viewChild<ElementRef<HTMLElement>>('cruiserEl');
  readonly trailCore = viewChild<ElementRef<SVGPathElement>>('trailCore');
  readonly trailGlow = viewChild<ElementRef<SVGPathElement>>('trailGlow');

  readonly stations = RELIC_STATIONS;
  readonly teamMembers = TEAM_MEMBERS;

  // Astronomy Club photos shown under the team wall (full, uncropped)
  readonly clubPhotos = [
    {
      src: '/assets/images/astronomy-club-1.jpeg',
      altAr: 'نادي علوم الفلك – جامعة أسيوط',
      altEn: 'Astronomy Club – Assiut University'
    },
    {
      src: '/assets/images/astronomy-club-2.jpeg',
      altAr: 'فعالية نادي علوم الفلك – جامعة أسيوط',
      altEn: 'Astronomy Club event – Assiut University'
    },
    {
      src: '/assets/images/astronomy-club-3.jpeg',
      altAr: 'فريق نادي علوم الفلك – جامعة أسيوط',
      altEn: 'Astronomy Club team – Assiut University'
    }
  ];

  // Sanitized URL for Voyager NASA 3D Embed iframe
  readonly sanitizedVoyagerUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://solarsystem.nasa.gov/gltf_embed/2340/');

  /**
   * Continuous S-curve SVG path spanning the 5 celestial destination waypoints
   */
  readonly svgPathD = `
    M 500 100
    C 450 600, 390 850, 390 1200
    C 390 1950, 610 2150, 610 2800
    C 610 3550, 500 3850, 500 4400
    C 500 5150, 390 5350, 390 6000
    C 390 6750, 610 6950, 610 7600
    C 610 7900, 500 8100, 500 8200
  `;

  /**
   * World coordinates for the 5 destination waypoints
   */
  readonly waypointWorldPositions = [
    { x: 390, y: 1200 }, // 0: The Moon (Lunar Relic Station: Apollo LRV & Surveyor 3)
    { x: 610, y: 2800 }, // 1: Mars (Martian Relic Station: Opportunity & Ingenuity)
    { x: 500, y: 4400 }, // 2: Asteroid Belt Team Deck (Expedition Command Crew)
    { x: 390, y: 6000 }, // 3: Pioneer 10 (Deep Space 3D Model & Golden Plaque)
    { x: 610, y: 7600 }  // 4: Voyager 1 (Interstellar 3D Embed & Golden Record)
  ];

  readonly userSelectedSubMission = signal<number | null>(null);
  readonly flippedCards = signal<[boolean, boolean, boolean]>([false, false, false]);
  readonly totalPathLength = signal<number>(8400);

  // ===== Journey timeline: scroll progress -> position on the path =====

  /**
   * Scroll weights per station (fractions of this scene's progress).
   * travel = flight from the previous stop, dwell = hovering at the stop (content + video).
   * The sum must stay below 1; the remainder is the final exit flight after the last station.
   */
  readonly timing = [
    { travel: 0.08, dwell: 0.10 }, // 0: Moon
    { travel: 0.10, dwell: 0.10 }, // 1: Mars
    { travel: 0.12, dwell: 0.16 }, // 2: Team deck
    { travel: 0.08, dwell: 0.07 }, // 3: Pioneer 10
    { travel: 0.06, dwell: 0.07 }  // 4: Voyager 1
  ];

  /** Local station progress `u` at the moment the ship arrives / departs (content phases are authored against these). */
  private readonly ARRIVE_U = 0.20;
  private readonly LEAVE_U = 0.80;
  /** Share of each travel leg during which the previous station is still fading out (the rest is the next station's entrance). */
  private readonly TAIL_FRAC = 0.45;

  private readonly ready = signal<boolean>(false);
  private keys: Array<{ p: number; q: number }> = [];
  private windows: Array<{ start: number; arrive: number; leave: number; end: number }> = [];
  private path: SVGPathElement | null = null;
  private pathLen = 0;

  // Smoothed per-frame state (written straight to the DOM, no change detection involved)
  private sCur = 0;
  private prevS = 0;
  private bank = 0;
  private cam = { x: 500, y: 100 };
  private lastArrived = -1;

  /**
   * Active station: the stations' windows partition [0, 1] of the scene progress,
   * so exactly one station is active at any moment.
   */
  readonly activeStationIndex = computed<number>(() => {
    if (!this.ready()) return 0;
    const p = this.currentSceneProgress();
    const w = this.windows;
    for (let i = 0; i < w.length; i++) {
      if (p < w[i].end) return i;
    }
    return w.length - 1;
  });

  constructor() {
    gsap.registerPlugin(MotionPathPlugin);

    // Reset user manual sub-mission selection when arriving at a new station
    effect(() => {
      this.activeStationIndex();
      this.userSelectedSubMission.set(null);
      this.flippedCards.set([false, false, false]);
    });

    // One arrival event per entry into a station's dwell window (consumers decide what to do, e.g. play a video)
    effect(() => {
      const idx = this.activeStationIndex();
      const arrived = this.isStationArrived();
      if (arrived && idx !== this.lastArrived) {
        this.lastArrived = idx;
        this.stopArrived.emit(idx);
      }
      if (!arrived) this.lastArrived = -1;
    });
  }

  /**
   * Authoritative Scene 3 Progress (0.0 to 1.0) derived strictly from masterTimeline
   */
  readonly currentSceneProgress = computed(() => {
    return this.masterTimeline.getSceneProgress(2);
  });

  /**
   * Local progress within active station segment: [0.0 to 1.0]
   */
  readonly stationLocalU = computed(() => {
    if (!this.ready()) return 0;
    const p = this.currentSceneProgress();
    const w = this.windows[this.activeStationIndex()];
    const seg = (a: number, b: number, u0: number, u1: number): number =>
      b > a ? u0 + (u1 - u0) * Math.min(1, Math.max(0, (p - a) / (b - a))) : u1;
    // u = ARRIVE_U exactly when the ship arrives, u = LEAVE_U exactly when it departs
    if (p < w.arrive) return seg(w.start, w.arrive, 0, this.ARRIVE_U);
    if (p <= w.leave) return seg(w.arrive, w.leave, this.ARRIVE_U, this.LEAVE_U);
    return seg(w.leave, w.end, this.LEAVE_U, 1);
  });

  readonly activeStation = computed(() => {
    return this.stations[this.activeStationIndex()] || this.stations[0];
  });

  /**
   * Active sub-mission index within dual-mission celestial stations (Moon & Mars):
   * Scroll-driven: First half of dwell (u < 0.50) -> Mission 1, Second half (u >= 0.50) -> Mission 2
   * Overridden if user clicked a specific tab button.
   */
  readonly activeSubMissionIndex = computed(() => {
    const manual = this.userSelectedSubMission();
    if (manual !== null) {
      return manual;
    }
    const u = this.stationLocalU();
    return u >= 0.50 ? 1 : 0;
  });

  /**
   * Currently active mission configuration (dual sub-mission OR single deep-space mission)
   */
  readonly currentMission = computed(() => {
    const st = this.activeStation();
    if (st.type === 'celestial-dual' && st.missions && st.missions.length > 0) {
      const subIdx = Math.min(st.missions.length - 1, Math.max(0, this.activeSubMissionIndex()));
      return st.missions[subIdx];
    }
    return st.singleMission;
  });

  /**
   * Alternating flanks for stations:
   * Station 0 (Moon): Body on right, Card on left (or flipped in RTL)
   * Station 1 (Mars): Body on left, Card on right
   * Station 2 (Team): Centered
   * Station 3 (Pioneer): Body on right, Card on left
   * Station 4 (Voyager): Body on left, Card on right
   */
  readonly isStationFlipped = computed(() => {
    const idx = this.activeStationIndex();
    const isEven = idx % 2 === 1;
    const isRtl = this.i18n.currentLang() === 'ar';
    return isRtl ? !isEven : isEven;
  });

  readonly activeStationWorldX = computed(() => {
    const idx = this.activeStationIndex();
    return this.waypointWorldPositions[idx]?.x ?? 500;
  });

  readonly activeStationWorldY = computed(() => {
    const idx = this.activeStationIndex();
    const base = this.waypointWorldPositions[idx]?.y ?? 1200;
    // For Team Showcase Station (idx === 2), position deck comfortably downstream below the cruiser
    return idx === 2 ? base + 320 : base;
  });

  readonly isStationArrived = computed(() => {
    const u = this.stationLocalU();
    return u >= 0.20 && u <= 0.80;
  });

  readonly isCurrentStationVisible = computed(() => {
    const u = this.stationLocalU();
    return u >= 0.04 && u <= 0.96;
  });

  readonly stationPhase = computed(() => {
    const u = this.stationLocalU();

    let planetOpacity = 0;
    let planetScale = 0.6;
    let planetTranslateX = 120;
    let titleOpacity = 0;
    let cardOpacity = 0;
    let cardScale = 0.94;
    let cardTranslateX = -30;
    let sourceOpacity = 0;

    if (u < 0.18) {
      const t = u / 0.18;
      const easeT = Math.sin(t * Math.PI / 2);
      planetOpacity = easeT;
      planetScale = 0.6 + 0.4 * easeT;
      planetTranslateX = (1 - easeT) * 120;
    } else if (u < 0.28) {
      planetOpacity = 1;
      planetScale = 1.0;
      planetTranslateX = 0;
      titleOpacity = (u - 0.18) / 0.10;
      const cardT = Math.max(0, (u - 0.20) / 0.08);
      cardOpacity = cardT;
      cardScale = 0.94 + 0.06 * cardT;
      cardTranslateX = (1 - cardT) * -30;
    } else if (u <= 0.80) {
      planetOpacity = 1;
      planetScale = 1.0;
      planetTranslateX = 0;
      titleOpacity = 1;
      cardOpacity = 1;
      cardScale = 1.0;
      cardTranslateX = 0;
      sourceOpacity = Math.min(1, Math.max(0, (u - 0.35) / 0.08));
    } else {
      const t = (u - 0.80) / 0.18;
      const fadeOut = Math.max(0, 1 - t);
      planetOpacity = fadeOut;
      planetScale = 1.0 - 0.25 * t;
      planetTranslateX = -t * 140;

      cardOpacity = fadeOut;
      cardScale = 1.0 - 0.15 * t;
      cardTranslateX = t * 140;
      titleOpacity = fadeOut;
      sourceOpacity = fadeOut;
    }

    return {
      planetOpacity,
      planetTransform: `scale(${planetScale}) translateX(${planetTranslateX}px)`,
      titleOpacity,
      cardOpacity,
      cardScale,
      cardTransform: `scale(${cardScale}) translateX(${cardTranslateX}px)`,
      sourceOpacity
    };
  });

  readonly skipButtonLabel = computed(() => {
    const isAr = this.i18n.currentLang() === 'ar';
    const nextIdx = (this.activeStationIndex() + 1) % this.stations.length;
    const nextSt = this.stations[nextIdx];
    const name = isAr ? nextSt.nameAr : nextSt.nameEn;
    return isAr ? `تخطي إلى: ${name} ⏭` : `Fast travel to: ${name} ⏭`;
  });

  selectSubMission(idx: number): void {
    this.userSelectedSubMission.set(idx);
    this.flippedCards.set([false, false, false]);
  }

  getFactOpacity(factIndex: number): number {
    const u = this.stationLocalU();
    const threshold = 0.28 + factIndex * 0.08;
    return u >= threshold ? 1 : 0;
  }

  getFactTransform(factIndex: number): string {
    const u = this.stationLocalU();
    const threshold = 0.28 + factIndex * 0.08;
    if (u >= threshold) {
      return 'translateY(0) scale(1)';
    }
    const offset = Math.max(0, (threshold - u) * 80);
    return `translateY(${offset}px) scale(0.95)`;
  }

  toggleCardFlip(index: number): void {
    const cur = [...this.flippedCards()] as [boolean, boolean, boolean];
    cur[index] = !cur[index];
    this.flippedCards.set(cur);
  }

  triggerMissionModal(config: MissionConfig): void {
    this.openMission.emit(config);
  }

  onMemberClick(member: TeamMember): void {
    this.memberClicked.emit(member);
  }

  /** If a member photo is missing, hide the broken-image icon and let the coloured frame show instead. */
  onAvatarError(ev: Event): void {
    (ev.target as HTMLImageElement | null)?.classList.add('img-missing');
  }

  skipForward(): void {
    if (!this.ready()) return;
    const total = this.stations.length;
    const current = this.activeStationIndex();
    const nextIdx = (current + 1) % total;

    const sceneStart = 0.22;
    const sceneEnd = 1.0;
    const sceneRange = sceneEnd - sceneStart;

    // Land inside the next station's dwell window at local u = 0.45 (same relative point as before)
    const w = this.windows[nextIdx];
    const dwellT = (0.45 - this.ARRIVE_U) / (this.LEAVE_U - this.ARRIVE_U);
    const targetSlotProgress = w.arrive + dwellT * (w.leave - w.arrive);
    const targetGlobalProgress = sceneStart + targetSlotProgress * sceneRange;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = maxScroll * targetGlobalProgress;

    this.scroll.scrollTo(targetScroll, { duration: 1.2 });
  }

  ngAfterViewInit(): void {
    this.measurePath();
    if (typeof window === 'undefined' || !this.ready()) return;
    gsap.ticker.add(this.tick);
  }

  ngOnDestroy(): void {
    gsap.ticker.remove(this.tick);
  }

  private measurePath(): void {
    const el = this.guidePathRef()?.nativeElement;
    if (!el || typeof el.getTotalLength !== 'function') return;

    try {
      this.path = el;
      this.pathLen = el.getTotalLength();
      this.totalPathLength.set(this.pathLen);

      // Arc-length position [0..1] of every station along the real path
      const qs = this.waypointWorldPositions.map(w => this.qAtY(w.y));

      const keys: Array<{ p: number; q: number }> = [{ p: 0, q: 0 }];
      const wins: Array<{ start: number; arrive: number; leave: number; end: number }> = [];
      let cursor = 0;
      let prevLeave = 0;
      this.timing.forEach((t, i) => {
        const arrive = cursor + t.travel;
        const leave = arrive + t.dwell;
        keys.push({ p: arrive, q: qs[i] });   // arrive
        keys.push({ p: leave, q: qs[i] });    // depart (same q = hovering)
        const start = i === 0 ? 0 : prevLeave + this.TAIL_FRAC * t.travel;
        wins.push({ start, arrive, leave, end: 1 });
        if (i > 0) wins[i - 1].end = start;   // windows partition [0, 1]
        prevLeave = leave;
        cursor = leave;
      });
      keys.push({ p: 1, q: 1 });
      if (cursor >= 1) {
        console.warn('Journey timing weights must sum to less than 1; got', cursor);
      }

      this.keys = keys;
      this.windows = wins;

      for (const ref of [this.trailCore(), this.trailGlow()]) {
        if (ref) ref.nativeElement.style.strokeDashoffset = String(this.pathLen);
      }
      this.ready.set(true);
    } catch (e) {
      console.warn('SVG path measurement failed:', e);
    }
  }

  /** The path's y grows monotonically, so a binary search finds the arc-length of a given y. */
  private qAtY(y: number): number {
    const path = this.path!;
    let lo = 0;
    let hi = this.pathLen;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (path.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
    }
    return lo / this.pathLen;
  }

  private smootherstep(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /** Scroll progress -> normalized arc-length. Flat while hovering at a station, eased (zero speed at both ends) while travelling. */
  private qOf(p: number): number {
    p = Math.min(1, Math.max(0, p));
    const k = this.keys;
    for (let i = 0; i < k.length - 1; i++) {
      const a = k[i];
      const b = k[i + 1];
      if (p <= b.p) {
        if (a.q === b.q || b.p === a.p) return b.q;
        return a.q + (b.q - a.q) * this.smootherstep((p - a.p) / (b.p - a.p));
      }
    }
    return 1;
  }

  private headingAt(s: number): number {
    const path = this.path!;
    const a = path.getPointAtLength(Math.max(0, s - 4));
    const b = path.getPointAtLength(Math.min(this.pathLen, s + 4));
    return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  }

  /** Per-frame loop: smoothing, banking, camera and trail all derive from one smoothed arc-length. */
  private tick = (time: number, deltaMs: number): void => {
    const path = this.path;
    const cruiser = this.cruiserEl()?.nativeElement;
    const camera = this.cameraEl()?.nativeElement;
    const core = this.trailCore()?.nativeElement;
    const glow = this.trailGlow()?.nativeElement;
    if (!this.ready() || !path || !cruiser || !camera) return;

    const dt = Math.max(0.001, Math.min(deltaMs, 50) / 1000);

    // Frame-rate independent smoothing of the arc-length; position, heading and trail all follow from it
    const target = this.qOf(this.currentSceneProgress()) * this.pathLen;
    this.sCur += (target - this.sCur) * (1 - Math.exp(-dt * 9));
    const s = this.sCur;

    const P = path.getPointAtLength(s);
    const heading = this.headingAt(s);

    // Bank = path curvature x actual speed (zero while hovering)
    const v = (s - this.prevS) / dt;
    this.prevS = s;
    const speedF = Math.min(1, Math.abs(v) / 800);
    const curv = this.headingAt(Math.min(this.pathLen, s + 120)) - this.headingAt(Math.max(0, s - 120));
    const bankTarget = Math.max(-8, Math.min(8, curv * 0.6)) * speedF;
    this.bank += (bankTarget - this.bank) * (1 - Math.exp(-dt * 8));

    // Gentle hover while stopped at a station
    const arrived = this.isStationArrived();
    const idle = arrived ? Math.sin(time * 1.6) * 3 : 0;

    cruiser.style.transform =
      `translate3d(${P.x.toFixed(2)}px, ${(P.y + idle).toFixed(2)}px, 0) translate(-50%, -50%) rotate(${(heading + this.bank).toFixed(2)}deg)`;
    cruiser.style.setProperty('--thrust', (0.35 + 0.65 * speedF).toFixed(2));

    // Camera trails slightly behind and looks ahead along the tangent
    const rad = heading * Math.PI / 180;
    const isTeamArrived = this.activeStationIndex() === 2 && arrived;
    const camTx = isTeamArrived ? this.activeStationWorldX() : P.x + Math.cos(rad) * 140;
    const camTy = isTeamArrived ? this.activeStationWorldY() : P.y + Math.sin(rad) * 140;
    const kc = 1 - Math.exp(-dt * 5);
    this.cam.x += (camTx - this.cam.x) * kc;
    this.cam.y += (camTy - this.cam.y) * kc;
    const camCenterY = isTeamArrived ? window.innerHeight * 0.5 : window.innerHeight * 0.45;
    camera.style.transform =
      `translate3d(${(window.innerWidth / 2 - this.cam.x).toFixed(1)}px, ${(camCenterY - this.cam.y).toFixed(1)}px, 0)`;

    // Trail is tied to the ship's real, rendered position
    const off = String(this.pathLen - s);
    if (core) core.style.strokeDashoffset = off;
    if (glow) glow.style.strokeDashoffset = off;
  };
}