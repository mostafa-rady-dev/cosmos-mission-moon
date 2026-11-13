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
  
  // Phase 1: Launch Pad & Hero Experience
  heroTitle: string;
  heroSubtitle: string;
  startJourneyBtn: string;
  exploreUniverseBtn: string;
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
  planetMercury: string;
  planetVenus: string;
  planetEarth: string;
  planetEarthFact: string;
  planetMars: string;
  planetMarsFact: string;
  planetJupiter: string;
  planetJupiterFact: string;
  planetSaturn: string;
  planetSaturnFact: string;
  planetUranus: string;
  planetNeptune: string;
  planetMoon: string;
  factsTitle: string;
  nasaSourceLabel: string;

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
  skipVideo: string;
  muteVideo: string;
  unmuteVideo: string;
  subtitlesToggle: string;

  // Phase 3 HUD additions
  tabTelemetry: string;
  tabTimeline: string;
  tabNasaArchive: string;
  tabBriefing: string;
  scientificObjectives: string;
  keyDiscoveries: string;
  missionTimeline: string;
  destinationLabel: string;
  targetCoordsLabel: string;
  velocityLabel: string;
  distanceLabel: string;
  powerSourceLabel: string;
  latencyLabel: string;
  tempLabel: string;
  radarSweepLabel: string;
  nasaImagesLoading: string;
  nasaImagesEmpty: string;
  nasaLiveBadge: string;
  nasaCachedBadge: string;

  // Phase 3 Space Explorer Passport additions
  passportLauncherBtn: string;
  passportTitle: string;
  passportSub: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  step5Title: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  callSignLabel: string;
  callSignPlaceholder: string;
  originStationLabel: string;
  selectDestination: string;
  selectRole: string;
  roleAstrobiology: string;
  roleAstrobiologyDesc: string;
  rolePilot: string;
  rolePilotDesc: string;
  roleEngineer: string;
  roleEngineerDesc: string;
  roleScientist: string;
  roleScientistDesc: string;
  destMoon: string;
  destMars: string;
  destJupiter: string;
  destSaturn: string;
  destDeepSpace: string;
  destMoonDesc: string;
  destMarsDesc: string;
  destJupiterDesc: string;
  destSaturnDesc: string;
  destDeepSpaceDesc: string;
  nextStepBtn: string;
  prevStepBtn: string;
  generatePassportBtn: string;
  downloadPassportBtn: string;
  copyShareCodeBtn: string;
  shareCopiedToast: string;
  passportIdLabel: string;
  issueDateLabel: string;
  securitySealLabel: string;
  statusApproved: string;
  requiredFieldError: string;
  closeModal: string;

  // Phase 4: Mission Control, Progression & Achievements
  missionControlBtn: string;
  missionControlTitle: string;
  missionControlSub: string;
  filterAll: string;
  filterLunar: string;
  filterDeepSpace: string;
  filterPlanetary: string;
  difficultyLabel: string;
  launchMissionBtn: string;
  viewTelemetryBtn: string;
  missionStatusAvailable: string;
  missionStatusInProgress: string;
  missionStatusCompleted: string;
  activeFleetSummary: string;
  completedCountLabel: string;

  explorerProfileBtn: string;
  explorerProfileTitle: string;
  explorerProfileSub: string;
  levelLabel: string;
  xpLabel: string;
  nextLevelLabel: string;
  tabProfileOverview: string;
  tabMissionHistory: string;
  tabAchievements: string;
  noCompletedMissions: string;
  viewPassportCard: string;

  achievementUnlocked: string;
  achFirstLaunchTitle: string;
  achFirstLaunchDesc: string;
  achMoonWalkerTitle: string;
  achMoonWalkerDesc: string;
  achPlanetaryObserverTitle: string;
  achPlanetaryObserverDesc: string;
  achMissionSpecialistTitle: string;
  achMissionSpecialistDesc: string;
  achDeepSpaceExplorerTitle: string;
  achDeepSpaceExplorerDesc: string;
  achLocked: string;
  achUnlocked: string;

  rankCadet: string;
  rankOrbital: string;
  rankCommander: string;
  rankPioneer: string;
  rankAdmiral: string;

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
  coordinates: '\u200E27.18°\u200E شمالاً · \u200E31.18°\u200E شرقاً (كوكب الأرض)',

  heroTitle: 'ما وراء المجهول · BEYOND THE UNKNOWN',
  heroSubtitle: 'اكتشف أسرار الكون، واستكشف عوالم سحيقة، وعش تجربة استكشاف فضائية استثنائية.',
  startJourneyBtn: 'ابدأ رحلتك الفضائية',
  exploreUniverseBtn: 'استكشف المنظومة الشمسية',
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
  planetMercury: 'كوكب عطارد',
  planetVenus: 'كوكب الزهرة',
  planetEarth: 'كوكب الأرض',
  planetEarthFact: 'نقطة الانطلاق: واحة الحياة الزرقاء في سماء الكون.',
  planetMars: 'كوكب المريخ',
  planetMarsFact: 'الكوكب الأحمر: موطن أكبر البراكين والوديان في المجموعة الشمسية.',
  planetJupiter: 'كوكب المشتري',
  planetJupiterFact: 'عملاق الغاز: كتلته تفوق جميع كواكب المجموعة الشمسية مجتمعة.',
  planetSaturn: 'كوكب زحل',
  planetSaturnFact: 'جوهرة السماء: حلقات جليدية وصخرية تمتد لآلاف الكيلومترات.',
  planetUranus: 'كوكب أورانوس',
  planetNeptune: 'كوكب نبتون',
  planetMoon: 'القمر (وجهة الهبوط)',
  factsTitle: '3 حقائق مذهلة ونادرة',
  nasaSourceLabel: 'المصدر التوثيقي:',

  moonApproachTitle: 'الاقتراب والهبوط القمري',
  moonApproachDesc: 'المناورة النهائية: تشغيل محركات الكبح العكسية تمهيداً لملامسة فوهات بحر الهدوء.',
  retroThrusters: 'تشغيل محركات الكبح العكسي',
  touchdownConfirmed: 'تم الهبوط بسلام على سطح القمر!',
  moonCoordinates: '\u200E0.67°\u200E شمالاً · \u200E23.47°\u200E شرقاً (بحر الهدوء)',

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
  skipVideo: 'تخطي الفيديو',
  muteVideo: 'كتم الصوت',
  unmuteVideo: 'تشغيل الصوت',
  subtitlesToggle: 'الترجمة النصية',

  // Phase 3 HUD additions
  tabTelemetry: 'تيليميتري ورادار',
  tabTimeline: 'الجدول الزمني',
  tabNasaArchive: 'أرشيف ناسا المباشر',
  tabBriefing: 'تسجيل الفيديو',
  scientificObjectives: 'الأهداف العلمية للمهمة',
  keyDiscoveries: 'أبرز الاكتشافات والنتائج',
  missionTimeline: 'المحطات الزمنية التاريخية',
  destinationLabel: 'الوجهة الفضائية',
  targetCoordsLabel: 'إحداثيات الهدف',
  velocityLabel: 'السرعة المدارية',
  distanceLabel: 'المسافة عن كوكب الأرض',
  powerSourceLabel: 'منظومة الطاقة',
  latencyLabel: 'زمن استجابة الإشارة',
  tempLabel: 'درجة الحرارة التشغيلية',
  radarSweepLabel: 'مسح راداري نشط ونبض كهرومغناطيسي',
  nasaImagesLoading: 'جاري استرداد الصور الموثقة من أرشيف وكالة ناسا…',
  nasaImagesEmpty: 'لا تتوفر صور إضافية حالياً، يتم عرض الأرشيف الموثق.',
  nasaLiveBadge: 'بث مباشر من أرشيف ناسا',
  nasaCachedBadge: 'الأرشيف الموثق محلياً',

  // Phase 3 Space Explorer Passport additions
  passportLauncherBtn: 'جواز المستكشف الفضائي',
  passportTitle: 'وثيقة اعتماد المستكشف الفضائي',
  passportSub: 'سجل رحلات أسيوط الفضائية المعتمد · COSMOS DEEP SPACE REGISTRY',
  step1Title: 'بيانات المستكشف',
  step2Title: 'الوجهة المدارية',
  step3Title: 'الدور والتخصص',
  step4Title: 'القياسات عن بُعد',
  step5Title: 'الجواز الهولوغرافي',
  fullNameLabel: 'الاسم الكامل للرائد',
  fullNamePlaceholder: 'مثال: أحمد مصطفى السيوطي',
  callSignLabel: 'رمز النداء الفضائي (Call Sign)',
  callSignPlaceholder: 'مثال: FALCON-99 أو PHOENIX',
  originStationLabel: 'محطة الانطلاق الرسمية',
  selectDestination: 'اختر وجهتك الفضائية المستهدفة',
  selectRole: 'حدد تخصصك العلمي والعملياتي في الطاقم',
  roleAstrobiology: 'علم الأحياء الفلكي',
  roleAstrobiologyDesc: 'البحث عن بصمات الحياة الحيوية وفحص العينات الجيولوجية الصخرية.',
  rolePilot: 'طيار مداري فائق',
  rolePilotDesc: 'قيادة المناورات المدارية الدقيقة ومسارات الدخول الجوي الحرجة.',
  roleEngineer: 'مهندس فضاء عميق',
  roleEngineerDesc: 'إدارة أنظمة الدفع النووي والحراري وصيانة الدروع الواقية.',
  roleScientist: 'كبير الأخصائيين العلميين',
  roleScientistDesc: 'تحليل الأطياف الكهرومغناطيسية وتفسير قراءات الرادار والمجسات العميقة.',
  destMoon: 'القمر (Mare Tranquillitatis)',
  destMars: 'المريخ (Jezero Crater)',
  destJupiter: 'المشتري (Europa Orbit)',
  destSaturn: 'زحل (Titan Atmosphere)',
  destDeepSpace: 'الفضاء السحيق (Interstellar Void)',
  destMoonDesc: 'قاعدة بحر الهدوء القمرية، دراسة التربة القمرية واستغلال الموارد في الموقع.',
  destMarsDesc: 'فوهة جيزيرو المريخية، البحث عن بقايا بيئات صالحة للحياة ورواسب مائية قديمة.',
  destJupiterDesc: 'مدار قمر يوروبا الجليدي، سبر المحيط السائل تحت السطحي ومحيط الإشعاع المغناطيسي.',
  destSaturnDesc: 'سماء تيتان الغنية بالنيتروجين والميثان وبحيرات الهيدروكربون المعقدة.',
  destDeepSpaceDesc: 'ما وراء الغلاف الشمسي، اختراق الفراغ النجمي ودراسة الأشعة الكونية المجرية.',
  nextStepBtn: 'المرحلة التالية',
  prevStepBtn: 'السابق',
  generatePassportBtn: 'إصدار الجواز الفضائي الهولوغرافي',
  downloadPassportBtn: 'تحميل وثيقة الجواز (PNG)',
  copyShareCodeBtn: 'نسخ رمز التحقق الفضائي',
  shareCopiedToast: 'تم نسخ رمز الجواز الفضائي بنجاح إلى الحافظة!',
  passportIdLabel: 'رقم وثيقة التسجيل المعتمد',
  issueDateLabel: 'تاريخ الاعتماد الفضائي',
  securitySealLabel: 'الختم الأمني المشفر',
  statusApproved: 'معتمد وموثق فضائياً · FLIGHT CERTIFIED',
  requiredFieldError: 'يرجى إكمال هذا الحقل للمتابعة إلى الخطوة التالية',
  closeModal: 'إغلاق الواجهة',

  // Phase 4: Mission Control, Progression & Achievements
  missionControlBtn: 'مركز التحكم بالمهام',
  missionControlTitle: 'مركز القيادة والتحكم الفضائي · أسيوط',
  missionControlSub: 'إدارة العمليات الميدانية والمسارات المدارية للمهام الاستكشافية الكبرى',
  filterAll: 'كافة المهام',
  filterLunar: 'المهام القمرية',
  filterDeepSpace: 'الفضاء السحيق',
  filterPlanetary: 'الكواكب والمدارات',
  difficultyLabel: 'مستوى الصعوبة',
  launchMissionBtn: 'بدء وتوجيه المهمة',
  viewTelemetryBtn: 'فتح تيليميتري HUD',
  missionStatusAvailable: 'متاحة للبدء',
  missionStatusInProgress: 'قيد التنفيذ',
  missionStatusCompleted: 'مكتملة ومعتمدة',
  activeFleetSummary: 'أسطول المهام النشطة',
  completedCountLabel: 'المهام المنجزة',

  explorerProfileBtn: 'ملف المستكشف',
  explorerProfileTitle: 'السجل الشخصي لرائد الفضاء',
  explorerProfileSub: 'سجل الإنجازات، الرتبة الميدانية، وتاريخ المهام المعتمد',
  levelLabel: 'الرتبة الميدانية',
  xpLabel: 'نقاط الخبرة الفضائية (XP)',
  nextLevelLabel: 'الترقية التالية',
  tabProfileOverview: 'بيانات الرائد',
  tabMissionHistory: 'سجل المهام',
  tabAchievements: 'الأوسمة والإنجازات',
  noCompletedMissions: 'لم تكتمل أي مهمة بعد. توجّه لمركز التحكم لبدء رحلتك!',
  viewPassportCard: 'عرض وثيقة الجواز الفضائي',

  achievementUnlocked: 'تم فتح إنجاز فضائي جديد!',
  achFirstLaunchTitle: 'الانطلاق الأول',
  achFirstLaunchDesc: 'إتمام مرحلة إطلاق الصاروخ الأولى من منصة أسيوط بنجاح.',
  achMoonWalkerTitle: 'سائر على سطح القمر',
  achMoonWalkerDesc: 'الهبوط بسلام على سطح القمر والسير في الجاذبية المنخفضة.',
  achPlanetaryObserverTitle: 'راصد الكواكب',
  achPlanetaryObserverDesc: 'استكشاف مدارات كواكب المنظومة الشمسية ومراقبة معالمها.',
  achMissionSpecialistTitle: 'أخصائي المهام الكبرى',
  achMissionSpecialistDesc: 'إكمال 3 مهام استكشافية من المهام الخمس الكبرى بنجاح.',
  achDeepSpaceExplorerTitle: 'مستكشف الفضاء السحيق',
  achDeepSpaceExplorerDesc: 'إنجاز كافة المهام الست وبلوغ تخوم الفضاء السحيق ما وراء الغلاف الشمسي.',
  achLocked: 'مغلق',
  achUnlocked: 'تم الإنجاز',

  rankCadet: 'رائد فضاء متدرب (Cadet)',
  rankOrbital: 'أخصائي مداري (Orbital Specialist)',
  rankCommander: 'قائد رحلات قمرية (Lunar Commander)',
  rankPioneer: 'رائد الفضاء العميق (Deep Space Pioneer)',
  rankAdmiral: 'أدميرال الأسطول الكوني (Cosmos Fleet Admiral)',

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

  heroTitle: 'BEYOND THE UNKNOWN',
  heroSubtitle: 'Discover the universe, explore distant worlds, and experience the extraordinary.',
  startJourneyBtn: 'START YOUR JOURNEY',
  exploreUniverseBtn: 'EXPLORE THE UNIVERSE',
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
  planetMercury: 'Planet Mercury',
  planetVenus: 'Planet Venus',
  planetEarth: 'Planet Earth',
  planetEarthFact: 'Launch Origin: The pale blue cradle of civilization.',
  planetMars: 'Planet Mars',
  planetMarsFact: 'The Red Planet: Harboring massive canyon systems and iron dust.',
  planetJupiter: 'Planet Jupiter',
  planetJupiterFact: 'Gas Giant: More massive than all other solar planets combined.',
  planetSaturn: 'Planet Saturn',
  planetSaturnFact: 'Crown of Rings: Cosmic expanse of ice and ancient debris.',
  planetUranus: 'Planet Uranus',
  planetNeptune: 'Planet Neptune',
  planetMoon: 'The Moon (Landing Target)',
  factsTitle: '3 Amazing & Rare Facts',
  nasaSourceLabel: 'Source:',

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
  skipVideo: 'Skip Video',
  muteVideo: 'Mute Audio',
  unmuteVideo: 'Unmute Audio',
  subtitlesToggle: 'Subtitles',

  // Phase 3 HUD additions
  tabTelemetry: 'Telemetry & Radar',
  tabTimeline: 'Mission Timeline',
  tabNasaArchive: 'NASA Live Archive',
  tabBriefing: 'Video Downlink',
  scientificObjectives: 'Scientific Mission Objectives',
  keyDiscoveries: 'Key Discoveries & Scientific Legacy',
  missionTimeline: 'Chronological Mission Milestones',
  destinationLabel: 'Flight Destination',
  targetCoordsLabel: 'Target Coordinates',
  velocityLabel: 'Orbital Velocity',
  distanceLabel: 'Distance from Earth',
  powerSourceLabel: 'Power Subsystem',
  latencyLabel: 'Signal Latency',
  tempLabel: 'Operating Temperature',
  radarSweepLabel: 'Active Radar Sweep & Spectral Pulse',
  nasaImagesLoading: 'Retrieving authentic NASA mission imagery archive…',
  nasaImagesEmpty: 'No dynamic imagery found, displaying cached archive.',
  nasaLiveBadge: 'Live NASA Deep Space Network Archive',
  nasaCachedBadge: 'Local Mission Verified Archive',

  // Phase 3 Space Explorer Passport additions
  passportLauncherBtn: 'SPACE PASSPORT',
  passportTitle: 'OFFICIAL SPACE EXPLORER PASSPORT',
  passportSub: 'Certified Flight Log · COSMOS Deep Space Registry',
  step1Title: 'Explorer Identity',
  step2Title: 'Target Destination',
  step3Title: 'Mission Specialty',
  step4Title: 'Flight Telemetry',
  step5Title: 'Holographic Passport',
  fullNameLabel: 'Explorer Full Name',
  fullNamePlaceholder: 'e.g., Ahmed Mostafa or John Glenn',
  callSignLabel: 'Astronaut Call Sign',
  callSignPlaceholder: 'e.g., FALCON-99 or STAR-GAZER',
  originStationLabel: 'Origin Launch Complex',
  selectDestination: 'Designate Your Flight Destination',
  selectRole: 'Select Mission Specialization & Crew Role',
  roleAstrobiology: 'Astrobiology Specialist',
  roleAstrobiologyDesc: 'Searching for biosignatures, chemical fossils & analyzing regolith samples.',
  rolePilot: 'Orbital Flight Commander',
  rolePilotDesc: 'Precision orbital maneuvers, flybys, and critical planetary atmospheric entry.',
  roleEngineer: 'Deep Space Systems Engineer',
  roleEngineerDesc: 'Nuclear thermal propulsion, life support loops & cosmic radiation shielding.',
  roleScientist: 'Principal Science Officer',
  roleScientistDesc: 'Electromagnetic spectroscopy, radio astronomy & deep sensor telemetry.',
  destMoon: 'The Moon (Mare Tranquillitatis)',
  destMars: 'Mars (Jezero Crater)',
  destJupiter: 'Jupiter (Europa Orbit)',
  destSaturn: 'Saturn (Titan Atmosphere)',
  destDeepSpace: 'Deep Space (Interstellar Void)',
  destMoonDesc: 'Sea of Tranquility basecamp, in-situ resource utilization & lunar core drilling.',
  destMarsDesc: 'Jezero paleolake crater, ancient lacustrine delta investigation & sample caching.',
  destJupiterDesc: 'Radiation-hardened Europa orbit, subsurface liquid ocean sounding & magnetic mapping.',
  destSaturnDesc: 'Hydrocarbon atmospheric descent into Titan lakes and prebiotic atmospheric analysis.',
  destDeepSpaceDesc: 'Voyaging past heliopause boundaries into pristine interstellar cosmic ray flows.',
  nextStepBtn: 'Next Phase',
  prevStepBtn: 'Previous',
  generatePassportBtn: 'Issue Holographic Passport',
  downloadPassportBtn: 'Download Security Credential (PNG)',
  copyShareCodeBtn: 'Copy Registry Code',
  shareCopiedToast: 'Passport Registry Code copied to clipboard!',
  passportIdLabel: 'Passport Credential ID',
  issueDateLabel: 'Authorization Timestamp',
  securitySealLabel: 'Cryptographic Security Seal',
  statusApproved: 'FLIGHT CERTIFIED & APPROVED',
  requiredFieldError: 'Please complete this required field before proceeding',
  closeModal: 'Close Window',

  // Phase 4: Mission Control, Progression & Achievements
  missionControlBtn: 'MISSION CONTROL',
  missionControlTitle: 'Mission Control Center · Asyut Command',
  missionControlSub: 'Fleet Telemetry, Orbital Directives & Expedition Launchpad',
  filterAll: 'All Missions',
  filterLunar: 'Lunar Surface',
  filterDeepSpace: 'Deep Space',
  filterPlanetary: 'Interplanetary',
  difficultyLabel: 'Difficulty Level',
  launchMissionBtn: 'Launch Mission',
  viewTelemetryBtn: 'Open Telemetry HUD',
  missionStatusAvailable: 'Available',
  missionStatusInProgress: 'In Progress',
  missionStatusCompleted: 'Certified Complete',
  activeFleetSummary: 'Active Mission Fleet',
  completedCountLabel: 'Completed Missions',

  explorerProfileBtn: 'EXPLORER PROFILE',
  explorerProfileTitle: 'Astronaut Dossier & Credentials',
  explorerProfileSub: 'Field Rank, Certified Flight History & Cosmic Achievements',
  levelLabel: 'Field Rank',
  xpLabel: 'Explorer XP',
  nextLevelLabel: 'Next Promotion',
  tabProfileOverview: 'Dossier Overview',
  tabMissionHistory: 'Mission History',
  tabAchievements: 'Achievement Badges',
  noCompletedMissions: 'No missions completed yet. Visit Mission Control to deploy!',
  viewPassportCard: 'Inspect Official Passport',

  achievementUnlocked: 'NEW ACHIEVEMENT UNLOCKED!',
  achFirstLaunchTitle: 'First Launch',
  achFirstLaunchDesc: 'Successfully execute Stage-1 liftoff from Asyut Launch Facility.',
  achMoonWalkerTitle: 'Moon Walker',
  achMoonWalkerDesc: 'Touch down on lunar soil and traverse low-gravity regolith.',
  achPlanetaryObserverTitle: 'Planetary Observer',
  achPlanetaryObserverDesc: 'Navigate interplanetary corridors and survey planetary landmarks.',
  achMissionSpecialistTitle: 'Mission Specialist',
  achMissionSpecialistDesc: 'Successfully execute and certify 3 iconic space missions.',
  achDeepSpaceExplorerTitle: 'Deep Space Explorer',
  achDeepSpaceExplorerDesc: 'Certify all 6 iconic missions and breach the interstellar void.',
  achLocked: 'Locked',
  achUnlocked: 'Unlocked',

  rankCadet: 'Cadet Explorer',
  rankOrbital: 'Orbital Specialist',
  rankCommander: 'Lunar Commander',
  rankPioneer: 'Deep Space Pioneer',
  rankAdmiral: 'Cosmos Fleet Admiral',

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
