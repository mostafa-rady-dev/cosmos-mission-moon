import { Injectable, signal, computed, effect } from '@angular/core';

export type Language = 'ar' | 'en';

export interface Translations {
  // Global & Meta
  siteTitle: string;
  subTitle: string;
  loading: string;
  loadingSub: string;
  readyToLaunch: string;
  launchBtn: string;
  scrollHint: string;
  skipToMissions: string;
  soundOn: string;
  soundOff: string;
  switchLang: string;
  spaceCenter: string;
  coordinates: string;
  
  // Phase 1: Launch Pad
  launchTitle: string;
  launchDesc: string;
  countdownPrefix: string;
  tMinus: string;
  ignition: string;
  liftoff: string;

  // Phase 2: Atmosphere & Orbit
  atmosphereTitle: string;
  atmosphereDesc: string;
  stagingConfirmed: string;
  boosterSeparated: string;
  earthOrbitAchieved: string;

  // Phase 3: Solar System
  solarSystemTitle: string;
  solarSystemDesc: string;
  planetEarth: string;
  planetEarthFact: string;
  planetMars: string;
  planetMarsFact: string;
  planetJupiter: string;
  planetJupiterFact: string;
  planetSaturn: string;
  planetSaturnFact: string;

  // Phase 4: Moon Approach
  moonApproachTitle: string;
  moonApproachDesc: string;
  retroThrusters: string;
  touchdownConfirmed: string;
  moonCoordinates: string;

  // Phase 5: Astronaut
  astronautEmergesTitle: string;
  astronautEmergesDesc: string;
  hatchOpen: string;
  flagPlanted: string;
  lunarSurfaceWalk: string;

  // Phase 6: Missions & Exploration
  missionsTitle: string;
  missionsDesc: string;
  openMission: string;
  completed: string;
  missionNumberPrefix: string;
  walkToMission: string;

  // Phase 7: HUD Helmet Visor
  hudTitle: string;
  hudSystemStatus: string;
  closeHud: string;
  videoPreparing: string;
  playVideo: string;
  pauseVideo: string;
  fullscreen: string;

  // Phase 8: Progress Checkpoints
  checkpointLaunch: string;
  checkpointOrbit: string;
  checkpointSolar: string;
  checkpointLanding: string;
  checkpointMoon: string;
}

const TRANSLATIONS_AR: Translations = {
  siteTitle: 'مهمة: القمر',
  subTitle: 'مساحة أسيوط الفضائية',
  loading: 'جاري تجهيز منصة الإطلاق…',
  loadingSub: 'فحص أنظمة التوجيه ومحركات الدفع الفضائي',
  readyToLaunch: 'الأنظمة جاهزة 100%',
  launchBtn: 'انطلق إلى القمر',
  scrollHint: 'مرر للأسفل للمتابعة',
  skipToMissions: 'انتقل للمهام مباشرة',
  soundOn: 'الصوت مشغل',
  soundOff: 'الصوت مكتوم',
  switchLang: 'English',
  spaceCenter: 'كوكب الأرض · مساحة أسيوط الفضائية · صعيد مصر',
  coordinates: '27.18° شمالاً · 31.18° شرقاً (كوكب الأرض)',

  launchTitle: 'منصة إطلاق أسيوط · كوكب الأرض',
  launchDesc: 'نقطة الانطلاق التاريخية من كوكب الأرض (أسيوط - مصر): من وادي النيل نحو أعماق الفضاء الخارجي في رحلة ملحمية تخترق الغلاف الجوي وتجوب كواكب المنظومة الشمسية ثم تهبط بسلام على سطح القمر لتنفيذ المهام الاستكشافية.',
  countdownPrefix: 'بدء العد التنازلي',
  tMinus: 'T - ',
  ignition: 'إشعال محركات الدفع الرئيسية!',
  liftoff: 'تم الإطلاق بنجاح!',

  atmosphereTitle: 'اختراق الغلاف الجوي',
  atmosphereDesc: 'الصاروخ يرتفع بسرعة تفوق الصوت، الغيوم تتلاشى تدريجياً ليتكشف انحناء كوكب الأرض وسط ظلمة الفضاء الساحرة.',
  stagingConfirmed: 'انفصال المرحلة الأولى',
  boosterSeparated: 'تم فصل المعزز الصاروخي بنجاح',
  earthOrbitAchieved: 'الدخول في المدار الانتقالي القمري',

  solarSystemTitle: 'عبور المنظومة الشمسية',
  solarSystemDesc: 'مسار ملاحي دقيق بين كواكب المجموعة الشمسية قبل الدخول في الجاذبية القمرية.',
  planetEarth: 'كوكب الأرض',
  planetEarthFact: 'نقطة الانطلاق: واحة الحياة الزرقاء في سماء الكون.',
  planetMars: 'كوكب المريخ',
  planetMarsFact: 'الكوكب الأحمر: موطن أكبر البراكين والوديان في المجموعة الشمسية.',
  planetJupiter: 'كوكب المشتري',
  planetJupiterFact: 'عملاق الغاز: كتلته تفوق جميع كواكب المجموعة الشمسية مجتمعة.',
  planetSaturn: 'كوكب زحل',
  planetSaturnFact: 'جوهرة السماء: حلقات جليدية وصخرية تمتد لآلاف الكيلومترات.',

  moonApproachTitle: 'الاقتراب والهبوط القمري',
  moonApproachDesc: 'المناورة النهائية: تشغيل محركات الكبح العكسية تمهيداً لملامسة فوهات بحر الهدوء.',
  retroThrusters: 'تشغيل محركات الكبح العكسي',
  touchdownConfirmed: 'تم الهبوط بسلام على سطح القمر!',
  moonCoordinates: '0.67° شمالاً · 23.47° شرقاً (بحر الهدوء)',

  astronautEmergesTitle: 'خطوات المجد الأولى',
  astronautEmergesDesc: 'يُفتح باب المركبة، وينزل رائد الفضاء بحذر على درجات السلم ليزرع علم المهمة في تراب القمر.',
  hatchOpen: 'فتح بوابة الكبسولة القمرية',
  flagPlanted: 'تم رفع الراية بنجاح',
  lunarSurfaceWalk: 'استكشاف الجاذبية المنخفضة',

  missionsTitle: 'محطات المهمة الاستكشافية',
  missionsDesc: 'تجوّل عبر محطات العمل الفضائية وافتح شاشة الخوذة HUD لمشاهدة التسجيلات الميدانية.',
  openMission: 'فتح سجل المهمة',
  completed: 'مكتملة',
  missionNumberPrefix: 'المهمة رقم',
  walkToMission: 'السير نحو المحطة…',

  hudTitle: 'خوذة الاستكشاف · واجهة HUD الميدانية',
  hudSystemStatus: 'حالة الاتصال: متصل بمركز القيادة أسيوط',
  closeHud: 'إغلاق الواجهة (ESC)',
  videoPreparing: 'جاري تجهيز وتسجيل فيديو المهمة الفضائية…',
  playVideo: 'تشغيل',
  pauseVideo: 'إيقاف',
  fullscreen: 'ملء الشاشة',

  checkpointLaunch: 'منصة الإطلاق',
  checkpointOrbit: 'المدار',
  checkpointSolar: 'الفضاء العميق',
  checkpointLanding: 'الهبوط',
  checkpointMoon: 'الاستكشاف',
};

const TRANSLATIONS_EN: Translations = {
  siteTitle: 'Mission: Moon',
  subTitle: 'Asyut Space Workspace',
  loading: 'Preparing launch pad…',
  loadingSub: 'Checking flight telemetry and propulsion stages',
  readyToLaunch: 'Systems 100% Nominal',
  launchBtn: 'Launch to Moon',
  scrollHint: 'Scroll to explore journey',
  skipToMissions: 'Skip to Missions',
  soundOn: 'Audio Enabled',
  soundOff: 'Audio Muted',
  switchLang: 'العربية',
  spaceCenter: 'Planet Earth · Asyut Space Workspace · Egypt',
  coordinates: '27.18° N · 31.18° E (Planet Earth)',

  launchTitle: 'Asyut Launch Facility · Planet Earth',
  launchDesc: 'Origin launch site on Planet Earth (Asyut, Egypt): embarking on an epic cosmic odyssey ascending through the atmosphere, journeying across the Solar System, and executing a precision touchdown on the Moon to carry out exploration missions.',
  countdownPrefix: 'Initiating Countdown',
  tMinus: 'T - ',
  ignition: 'Main Thruster Ignition!',
  liftoff: 'Liftoff confirmed!',

  atmosphereTitle: 'Atmospheric Breakthrough',
  atmosphereDesc: 'Ascending through high atmosphere. Clouds recede, revealing Earth curvature against deep celestial void.',
  stagingConfirmed: 'Stage-1 Separation',
  boosterSeparated: 'Booster safely jettisoned',
  earthOrbitAchieved: 'Trans-Lunar Injection orbit established',

  solarSystemTitle: 'Solar Navigation Route',
  solarSystemDesc: 'Curving through stylized orbital corridors across celestial landmarks.',
  planetEarth: 'Planet Earth',
  planetEarthFact: 'Launch Origin: The pale blue cradle of civilization.',
  planetMars: 'Planet Mars',
  planetMarsFact: 'The Red Planet: Harboring massive canyon systems and iron dust.',
  planetJupiter: 'Planet Jupiter',
  planetJupiterFact: 'Gas Giant: More massive than all other solar planets combined.',
  planetSaturn: 'Planet Saturn',
  planetSaturnFact: 'Crown of Rings: Cosmic expanse of ice and ancient debris.',

  moonApproachTitle: 'Lunar Descent & Touchdown',
  moonApproachDesc: 'Final descent sequence: retro-thrusters active, landing struts deploying over Mare Tranquillitatis.',
  retroThrusters: 'Retro-thrusters engaged',
  touchdownConfirmed: 'Touchdown Confirmed on Lunar Soil!',
  moonCoordinates: '0.67° N · 23.47° E (Sea of Tranquility)',

  astronautEmergesTitle: 'First Strides on Lunar Soil',
  astronautEmergesDesc: 'Hatch opens, revealing sunlight. The explorer steps down the ladder and plants the mission emblem.',
  hatchOpen: 'Lunar hatch unlocked',
  flagPlanted: 'Mission emblem firmly planted',
  lunarSurfaceWalk: 'Low-gravity traverse underway',

  missionsTitle: 'Exploration Waypoints',
  missionsDesc: 'Traverse the lunar surface and access the helmet HUD overlay to review mission records.',
  openMission: 'Open Mission Log',
  completed: 'Completed',
  missionNumberPrefix: 'Mission #',
  walkToMission: 'Walking to waypoint…',

  hudTitle: 'Helmet HUD · Mission Telemetry',
  hudSystemStatus: 'Uplink: Direct Link to Asyut Command',
  closeHud: 'Close HUD (ESC)',
  videoPreparing: 'Mission footage is being prepared…',
  playVideo: 'Play',
  pauseVideo: 'Pause',
  fullscreen: 'Fullscreen',

  checkpointLaunch: 'Launch Pad',
  checkpointOrbit: 'Orbit',
  checkpointSolar: 'Solar Way',
  checkpointLanding: 'Touchdown',
  checkpointMoon: 'Explore',
};

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  readonly currentLang = signal<Language>('ar');

  readonly isRtl = computed(() => this.currentLang() === 'ar');
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.currentLang() === 'ar' ? 'rtl' : 'ltr'));

  readonly currentTranslations = computed<Translations>(() => {
    return this.currentLang() === 'ar' ? TRANSLATIONS_AR : TRANSLATIONS_EN;
  });

  constructor() {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('mm_lang') as Language;
      if (savedLang === 'ar' || savedLang === 'en') {
        this.currentLang.set(savedLang);
      }
    }

    // Reactively update documentElement attributes when language changes
    effect(() => {
      const lang = this.currentLang();
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        localStorage.setItem('mm_lang', lang);
      }
    });
  }

  toggleLanguage(): void {
    this.currentLang.update((lang) => (lang === 'ar' ? 'en' : 'ar'));
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
  }

  t<K extends keyof Translations>(key: K): string {
    return this.currentTranslations()[key];
  }
}
