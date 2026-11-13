export interface MissionTimelineEvent {
  date: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  status?: 'completed' | 'ongoing' | 'scheduled' | string;
}

export interface MissionTelemetryData {
  velocity: string;
  distance: string;
  status: string;
  temperature: string;
  powerSource: string;
  velocityKmH?: string;
  distanceFromEarth?: string;
  tempKelvin?: string;
  signalLatency?: string;
}

export interface MissionConfig {
  id: string;
  order: number;
  codename: string;
  badgeCode?: string;
  titleAr: string;
  titleEn: string;
  destinationAr: string;
  destinationEn: string;
  targetCoordinates: string;
  targetCoords?: string;
  descAr: string;
  descEn: string;
  videoSrc: string;
  poster: string;
  position: {
    x: number; // percentage along horizontal exploration landscape (0 - 100)
    y: number; // vertical offset percentage
  };
  objectivesAr: string[];
  objectivesEn: string[];
  scientificObjectivesAr?: string[];
  scientificObjectivesEn?: string[];
  timeline: MissionTimelineEvent[];
  discoveriesAr: string[];
  discoveriesEn: string[];
  telemetry: MissionTelemetryData;
  nasaApiQuery: string;
  detailsAr: string[];
  detailsEn: string[];
  sourceAr?: string;
  sourceEn?: string;
}

/**
 * Official NASA Space Apps Challenge 2026:
 * "Abandoned But Not Forgotten: A Storytelling Narrative of NASA's Left-behind Equipment"
 * 
 * 6 Iconic Relic Stations:
 * 1. Moon: Apollo Lunar Roving Vehicle (LRV)
 * 2. Moon: Surveyor 3 Robotic Lander Relic
 * 3. Mars: Opportunity Rover (Oppy) at Endeavour Crater
 * 4. Mars: Ingenuity Mars Helicopter at Jezero Crater
 * 5. Deep Space: Pioneer 10 & The Golden Plaque
 * 6. Interstellar: Voyager 1 & The Golden Record
 */
export const MISSIONS_DATA: MissionConfig[] = [
  // =========================================================================
  // MISSION 01: MOON — APOLLO LUNAR ROVING VEHICLE (LRV)
  // =========================================================================
  {
    id: 'moon-lunar-rover',
    order: 1,
    codename: 'APOLLO-LRV',
    titleAr: 'عربة أبولو القمرية — آثار عجلات لا تمحى',
    titleEn: 'Apollo Lunar Roving Vehicle — Tracks Never Erased',
    destinationAr: 'القمر (وادي هادلي - ريل)',
    destinationEn: 'Moon (Hadley Rille Valley)',
    targetCoordinates: '26.13° N · 3.63° E',
    descAr: 'عربة التجوال القمرية (LRV) الشهيرة التي تركتها ناسا على سطح القمر في رحلات أبولو 15 و16 و17. بقيت مركونة في سكون الفضاء الصامت منذ أكثر من نصف قرن، وستظل عجلاتها وآثارها محفورة لملايين السنين لانعدام الغلاف الجوي والرياح.',
    descEn: 'The iconic Lunar Roving Vehicle left parked on the lunar surface during Apollo 15, 16, and 17. Preserved in pristine vacuum for over half a century, its tire tracks remain indelibly etched into the regolith for eons.',
    videoSrc: '/assets/videos/moon-01.mp4',
    poster: '/assets/images/lunar_rover_photorealistic.png',
    position: { x: 16, y: 54 },
    objectivesAr: [
      'توثيق بقاء هياكل الألمنيوم والعجلات الشبكية لعربة أبولو تحت إشعاع الفضاء لأكثر من 50 عاماً.',
      'دراسة الحفاظ الجيولوجي لآثار العجلات المنقوشة في الريجوليث القمري لعدم وجود هواء أو أمطار.',
      'استكشاف منظومة كاميرا التلفزيون المتبقية وهوائي الاتصال عالي الكسب المتروكين في الموقع.',
      'تخليد ذكرى أول وسيلة تنقل قادها البشر على سطح جرم سماوي آخر.'
    ],
    objectivesEn: [
      'Document the survival of aluminum chassis and mesh wire wheels under cosmic radiation for >50 years.',
      'Study pristine preservation of rover tread patterns pressed into regolith without weathering.',
      'Survey the remaining color TV camera assembly and high-gain dish antenna left parked at the site.',
      'Commemorate humanity’s very first wheeled extraterrestrial transport vehicle.'
    ],
    timeline: [
      {
        date: '31 يوليو 1971',
        titleAr: 'أول قيادة لعربة على القمر',
        titleEn: 'First Lunar Drive',
        descAr: 'ديفيد سكوت وجيمس إروين يقودان عربة LRV لأول مرة في رحلة استكشاف وادي هادلي في مهمة أبولو 15.',
        descEn: 'David Scott and James Irwin deploy and drive the LRV for the first time across Hadley Rille.'
      },
      {
        date: '2 أغسطس 1971',
        titleAr: 'ركن العربة للأبد',
        titleEn: 'Parked Forever',
        descAr: 'ركن العربة على بُعد 100 متر من مركبة الصعود لتصوير إقلاع الرواد نحو مدار القمر.',
        descEn: 'Parked 100m away from the Falcon Ascent Stage to film the historic lunar liftoff.'
      },
      {
        date: '1972 — الآن',
        titleAr: 'آثار باقية لملايين السنين',
        titleEn: 'Untouched Relic',
        descAr: 'العربة ومساراتها تظل سالمة كما هي كشاهد حي على وصول الإنسان إلى القمر.',
        descEn: 'Preserved intact in the eternal lunar vacuum, awaiting future historic heritage preservation.'
      }
    ],
    discoveriesAr: [
      'مكنت العربة الرواد من قطع 28 كيلومتراً وجمع صخرة التكوين (Genesis Rock) بعمر 4.1 مليار سنة.',
      'إثبات كفاءة محركات الدفع الكهربائي المستقلة في كل عجلة في بيئة الفراغ القمري.',
      'بقاء آثار الإطارات خالية من أي عوامل تعرية أو تآكل منذ عام 1971.',
      'أصبحت العربة علامة تاريخية مرجعية ترصدها مسابر الاستطلاع القمرية LRO من المدار.'
    ],
    discoveriesEn: [
      'Enabled traversing 28 km to discover the 4.1-billion-year-old Genesis Rock.',
      'Proven performance of four independent 0.25-hp electric wheel hub drive motors in deep vacuum.',
      'Complete lack of erosion keeping tracks pristine since 1971.',
      'Recognized as an official heritage landmark mapped by NASA’s Lunar Reconnaissance Orbiter (LRO).'
    ],
    telemetry: {
      velocity: '0.00 KM/H (PARKED)',
      distance: '384,400 KM',
      status: 'PERMANENT LUNAR MONUMENT',
      temperature: '-130°C TO +120°C',
      powerSource: 'EXHAUSTED 36V AG-ZN BATTERIES'
    },
    nasaApiQuery: 'Apollo Lunar Roving Vehicle',
    detailsAr: [
      'المركبة: عربة التجوال القمرية (Boeing / Delco Electronics LRV)',
      'الكتلة على الأرض: 210 كجم (وزنها على القمر 35 كجم فقط)',
      'الموقع: وادي هادلي-ريل (أبولو 15)'
    ],
    detailsEn: [
      'Vehicle: Boeing / Delco Electronics Lunar Roving Vehicle (LRV)',
      'Earth Mass: 210 kg (Lunar Weight: only 35 kg)',
      'Site: Hadley Rille (Apollo 15 Landing Site)'
    ],
    sourceAr: 'المصدر: وكالة ناسا — أرشيف مهمات أبولو المأهولة (NASA Apollo Lunar Surface Archive)',
    sourceEn: 'Source: NASA Apollo Lunar Surface Archive & History Division'
  },

  // =========================================================================
  // MISSION 02: MOON — SURVEYOR 3 ROBOTIC RELIC
  // =========================================================================
  {
    id: 'moon-surveyor-3',
    order: 2,
    codename: 'SURVEYOR-III',
    titleAr: 'مسبار سيرفيور 3 — أول لقاء بين مسبار ورائد فضاء',
    titleEn: 'Surveyor 3 — The Historic Robotic Rendezvous',
    destinationAr: 'القمر (محيط العواصف)',
    destinationEn: 'Moon (Ocean of Storms)',
    targetCoordinates: '3.01° S · 23.42° W',
    descAr: 'المسبار الآلي التاريخي الذي هبط عام 1967 وظل مهجوراً في فوهة قمرية حتى هبط بجواره رواد أبولو 12 عام 1969 في أول زيارة بشرية لمعدات روبوتية على جرم فضائي، لفك كاميرته واسترجاعها إلى الأرض.',
    descEn: 'The robotic lander that touched down in 1967 and lay abandoned until Apollo 12 astronauts Pete Conrad and Alan Bean landed within walking distance in 1969—marking history’s first human rendezvous with extraterrestrial robotics.',
    videoSrc: '/assets/videos/moon-02.mp4',
    poster: '/assets/images/lunar_lander_realistic.png',
    position: { x: 32, y: 52 },
    objectivesAr: [
      'توثيق حالة أول مسبار آلي مهجور يزوره البشر ويفحصون قطعه الميكانيكية مباشرة.',
      'دراسة تأثير الإشعاع الشمسي والحرارة المتطرفة على طلاء وزجاج كاميرا المسبار.',
      'استرجاع ذراع أخذ العينات الآلية والكاميرا لتحليلها في معامل ناسا على الأرض.',
      'إثبات دقة الهبوط الموجه على بعد 180 متراً فقط من مركبة روبوتية سابقة.'
    ],
    objectivesEn: [
      'Document humanity’s first physical in-situ inspection of an abandoned robotic spacecraft.',
      'Analyze solar radiation, thermal cycling, and micrometeoroid pitting on spacecraft alloys.',
      'Retrieve the robotic sampling arm and TV camera for scientific laboratory testing back on Earth.',
      'Demonstrate precision pinpoint landing capability just 180 meters from a targeted artifact.'
    ],
    timeline: [
      {
        date: '20 أبريل 1967',
        titleAr: 'هبوط سيرفيور 3',
        titleEn: 'Surveyor 3 Touchdown',
        descAr: 'المسبار يهبط بنجاح في فوهة بمحيط العواصف ويرسل 6,315 صورة تلفزيونية.',
        descEn: 'Surveyor 3 lands in Oceanus Procellarum crater and transmits 6,315 television images.'
      },
      {
        date: '19 نوفمبر 1969',
        titleAr: 'لقاء رواد أبولو 12',
        titleEn: 'Apollo 12 Rendezvous',
        descAr: 'رواد الفضاء كونراد وبين يسيرون إلى المسبار المهجور ويفكون كاميرته.',
        descEn: 'Pete Conrad and Alan Bean walk down into the crater and inspect the silent lander.'
      },
      {
        date: '1969 — الآن',
        titleAr: 'رمز خالد للتعاون البشري والآلي',
        titleEn: 'Eternal Artifact',
        descAr: 'هيكل المسبار المتبقي يستقر بسلام في فوهته كأقدم قطعة تكنولوجية زارها الإنسان في الفضاء.',
        descEn: 'The remaining chassis stands silently as the oldest inspected robotic relic on another world.'
      }
    ],
    discoveriesAr: [
      'أثبت استرجاع كاميرا سيرفيور قدرة البكتيريا الشائعة على البقاء كامنة داخل مكونات الجهاز في الفراغ.',
      'تحليل آثار الغبار القمري والاصطدامات المجهرية على زجاج وعدسات الكاميرا.',
      'تأكيد أن التربة القمرية قادرة على دعم أوزان مركبات الهبوط المأهولة دون انهيار.',
      'إثبات إمكانية إعادة استرجاع واستخدام الموارد والمعدات الفضائية المهملة مستقبلاً.'
    ],
    discoveriesEn: [
      'Analysis of retrieved camera components provided critical data on microbial hardiness in space.',
      'Quantified micrometeoroid impact flux and lunar dust adherence on optical lens coatings.',
      'Proved lunar soil load-bearing capacity was entirely safe for heavier manned landers.',
      'Laid empirical foundation for future space archaeology and planetary asset maintenance.'
    ],
    telemetry: {
      velocity: '0.00 M/S (RESTING)',
      distance: '384,400 KM',
      status: 'HISTORIC ARCHAEOLOGICAL SITE',
      temperature: '-150°C TO +115°C',
      powerSource: 'EXHAUSTED SOLAR PANEL'
    },
    nasaApiQuery: 'Surveyor 3 Apollo 12',
    detailsAr: [
      'المسبار: سيرفيور 3 (Hughes Aircraft / NASA JPL)',
      'الزوار البشريون: طاقم أبولو 12 (كونراد وبين)',
      'الموقع: محيط العواصف (Oceanus Procellarum)'
    ],
    detailsEn: [
      'Spacecraft: Surveyor 3 (Hughes Aircraft / NASA JPL)',
      'Human Visitors: Apollo 12 Crew (Conrad & Bean)',
      'Site: Oceanus Procellarum (Surveyor Crater)'
    ],
    sourceAr: 'المصدر: وكالة ناسا — أرشيف مهمة سيرفيور 3 وأبولو 12 (NASA Surveyor Archive)',
    sourceEn: 'Source: NASA Surveyor Program & Apollo 12 Archive'
  },

  // =========================================================================
  // MISSION 03: MARS — OPPORTUNITY ROVER (OPPY)
  // =========================================================================
  {
    id: 'mars-opportunity',
    order: 3,
    codename: 'OPPORTUNITY-MER',
    titleAr: 'روفر أوبورتيونيتي (أوبي) — ملحمة الـ 15 عاماً على المريخ',
    titleEn: 'Mars Opportunity Rover (Oppy) — The 15-Year Odyssey',
    destinationAr: 'المريخ (فوهة إنديفور - وادي بيرسيفيرانس)',
    destinationEn: 'Mars (Endeavour Crater - Perseverance Valley)',
    targetCoordinates: '2.2° S · 354.5° E',
    descAr: 'الروفر الأسطوري الذي صُمم ليعمل 90 يوماً فقط، لكنه قاوم العواصف الرملية لـ 15 عاماً وقطع أكثر من 45 كم مثبتاً أن المريخ كان كوكباً مائياً رطباً، حتى غطت عاصفة رملية شمسية ألواحه الشمسية عام 2018 ليستقر بسلام للأبد.',
    descEn: 'The intrepid robotic explorer designed for a 90-sol sprint that persevered for over 15 years and 45 kilometers. Oppy proved that ancient Mars possessed liquid water before a planet-encircling dust storm silenced its solar arrays forever in 2018.',
    videoSrc: '/assets/videos/mars-01.mp4',
    poster: '/assets/images/mars_opportunity_rover.jpg',
    position: { x: 50, y: 55 },
    objectivesAr: [
      'تخليد ذكرى أطول مهمة تجوال روبوتية قطعت مسافة ماراثونية كاملة (45.16 كم) على كوكب آخر.',
      'استكشاف موقع سبات الروفر في وادي "بيرسيفيرانس" عند حافة فوهة إنديفور.',
      'توثيق صخور الجبس والمياه القديمة التي كشفها أوبي مؤكداً بيئات صالحة للحياة سابقاً.',
      'تكريم رسالة الوداع المؤثرة التي ألهبت مشاعر ملايين البشر حول العالم.'
    ],
    objectivesEn: [
      'Celebrate history’s longest extraterrestrial drive covering an ultra-marathon of 45.16 km.',
      'Survey the final resting sanctuary of Oppy inside Perseverance Valley along Endeavour Crater.',
      'Revisit the gypsum veins and hematite spherules ("blueberries") proving past wet, neutral water.',
      'Honor the legendary robotic spirit that inspired millions of students and scientists globally.'
    ],
    timeline: [
      {
        date: '25 يناير 2004',
        titleAr: 'الهبوط بوسائد الأمان',
        titleEn: 'Airbag Bouncing Landing',
        descAr: 'أوبورتيونيتي يهبط في فوهة إيجل بعد ارتداد كروي بالوسائد الهوائية.',
        descEn: 'Opportunity bounces to a halt directly inside small Eagle Crater on Meridiani Planum.'
      },
      {
        date: '24 مارس 2015',
        titleAr: 'إكمال أول ماراثون فضائي',
        titleEn: 'First Extraterrestrial Marathon',
        descAr: 'الروفر يتجاوز مسافة 42.195 كم ليصبح أول مركبة بشرية تقطع مسافة ماراثون كامل على جرم فضائي.',
        descEn: 'Oppy passes 42.195 km, completing humanity’s first extraterrestrial marathon.'
      },
      {
        date: '10 يونيو 2018',
        titleAr: 'العاصفة الكوكبية ورسالة الوداع',
        titleEn: 'Final Sol & Farewell',
        descAr: 'عاصفة ترابية كبرى تحجب ضوء الشمس: "بطاريتي منخفضة والدنيا تظلم"، ليدخل أوبي في نوم أبدي.',
        descEn: 'Planet-encircling dust storm blankets the skies: solar generation plunges, entering permanent sleep.'
      }
    ],
    discoveriesAr: [
      'اكتشاف كرات الهيماتيت ("العنب البري") كأول دليل قاطع على وجود مياه سائلة جارية في ماضي المريخ.',
      'العثور على عروق الجبس المعدني النقي المترسب من مياه عذبة غير حمضية.',
      'الصمود لـ 5,111 يوماً مريخياً (Sol) متجاوزاً عمره الافتراضي بـ 55 ضعفاً.',
      'توثيق أعنف العواصف الترابية وسلوك الرياح والرمال على مدار 8 فصول مريخية كاملة.'
    ],
    discoveriesEn: [
      'Discovered hematite spherules ("blueberries"), proving ancient Mars had soaking liquid water.',
      'Found veins of bright gypsum precipitated from drinking-quality fresh water.',
      'Operated for 5,111 Martian sols—exceeding its planned 90-day design lifetime by 55 times.',
      'Recorded multi-year dust devil dynamics and meteorological transitions across eight Mars years.'
    ],
    telemetry: {
      velocity: '0.00 M/S (RESTING)',
      distance: '225,000,000 KM (MARS)',
      status: 'MISSION CELEBRATED & CONCLUDED',
      temperature: '-105°C (WINTER NIGHTS)',
      powerSource: 'SOLAR ARRAYS (DUST-COVERED)'
    },
    nasaApiQuery: 'Mars Exploration Rover Opportunity',
    detailsAr: [
      'المركبة: روفر استكشاف المريخ (NASA JPL Mars Exploration Rover - MER-B)',
      'المسافة المقطوعة: 45.16 كيلومتر (أطول مسافة لمركبة على كوكب آخر)',
      'الموقع: وادي بيرسيفيرانس، فوهة إنديفور (المريخ)'
    ],
    detailsEn: [
      'Rover: Mars Exploration Rover Opportunity (MER-B / JPL)',
      'Total Traverse: 45.16 km (Record holder for extraterrestrial driving distance)',
      'Resting Site: Perseverance Valley, Endeavour Crater Rim, Mars'
    ],
    sourceAr: 'المصدر: مختبر الدفع النفاث التابع لناسا — أرشيف مهمة مسبار المريخ MER (NASA JPL)',
    sourceEn: 'Source: NASA Jet Propulsion Laboratory (JPL) Mars Exploration Rover Mission'
  },

  // =========================================================================
  // MISSION 04: MARS — INGENUITY HELICOPTER
  // =========================================================================
  {
    id: 'mars-ingenuity',
    order: 4,
    codename: 'INGENUITY-GINNY',
    titleAr: 'مروحية إنجينويتي — طائر المريخ التاريخي المستقر على الرمال',
    titleEn: 'Ingenuity Mars Helicopter — The First Extraterrestrial Flyer',
    destinationAr: 'المريخ (فوهة جيزيرو - تلال فالينور)',
    destinationEn: 'Mars (Jezero Crater - Valinor Hills)',
    targetCoordinates: '18.44° N · 77.45° E',
    descAr: 'أول مركبة طيران ديناميكي مدفوع بمروحة تحلق في سماء كوكب آخر بغلاف جوي لا يتجاوز 1% من هواء الأرض. حققت 72 رحلة طيران بدلاً من 5 رحلات، والآن تقف كرمز عبقري خالد شاهد على إنجاز الإنسان في فوهة جيزيرو.',
    descEn: 'Humanity’s historic first powered aircraft on an alien world. Defying Mars\' ultra-thin 1% atmosphere, Ingenuity completed 72 triumphant flights across 17 kilometers before retiring permanently as an eternal monument at Valinor Hills.',
    videoSrc: '/assets/videos/mars-02.mp4',
    poster: '/assets/images/mars_opportunity_rover.jpg',
    position: { x: 68, y: 53 },
    objectivesAr: [
      'توثيق موقع هبوط المروحية التاريخية النهائي في تلال فالينور بفوهة جيزيرو.',
      'دراسة تصميم شفرات الكربون خفيفة الوزن التي دارت بسرعة 2,400 دورة/دقيقة لرفع الطائر في هواء المريخ النادر.',
      'تسليط الضوء على إنجاز تخطي المهمة المقررة (5 رحلات) لتصل إلى 72 رحلة طيران جوي متقدمة.',
      'فحص منظومة المحطة الثابتة التي تواصل تسجيل درجات الحرارة والبيانات كمرصد مريخي دائم.'
    ],
    objectivesEn: [
      'Document the permanent airfield sanctuary of Ingenuity at "Valinor Hills" in Jezero Crater.',
      'Analyze counter-rotating carbon fiber rotor performance spinning at 2,400 RPM in 1% air density.',
      'Highlight exceeding the initial 5-flight tech demo goal with 72 autonomous aerial sorties.',
      'Observe the retired aircraft functioning as an autonomous stationary weather testbed.'
    ],
    timeline: [
      {
        date: '19 أبريل 2021',
        titleAr: 'لحظة الأخوين رايت في المريخ',
        titleEn: 'Mars Wright Brothers Moment',
        descAr: 'المروحية ترتفع 3 أمتار وتحوم لمدة 39 ثانية محققة أول طيران مدفوع في تاريخ كوكب آخر.',
        descEn: 'Ingenuity lifts off to 3 meters altitude for 39 seconds: first powered flight on another planet.'
      },
      {
        date: '18 يناير 2024',
        titleAr: 'الرحلة رقم 72 والأخيرة',
        titleEn: 'Flight 72 & Soft Landing',
        descAr: 'إنجاز الرحلة 72 وهبوط اضطراري بسبب أضرار بأطراف شفرات المروحة في تلال فالينور.',
        descEn: 'Flight 72 ends with damage to rotor tips upon landing, concluding active aviation mission.'
      },
      {
        date: '2024 — الآن',
        titleAr: 'نصب تذكاري خالد للطيران الفضائي',
        titleEn: 'Eternal Aerial Monument',
        descAr: 'المروحية تستقر بسلام على رمال المريخ وتواصل إرسال تحياتها اليومية من الكوكب الأحمر.',
        descEn: 'Resting on Mars sand, waking daily to run self-tests and store telemetry for future explorers.'
      }
    ],
    discoveriesAr: [
      'إثبات إمكانية الملاحة الجوية والتحليق المستقل في غلاف جوي ذي كثافة تعادل 1% من الأرض.',
      'قامت باستطلاع المسارات الصخرية الوعرة مسبقاً وتوجيه روفر بيرسيفيرنس بأمان.',
      'قطعت مسافة جوية إجمالية تتجاوز 17 كيلومتراً وارتفعت حتى 24 متراً فوق سطح الكوكب.',
      'حملت قطعة صغيرة من جناح طائرة الأخوين رايت لعام 1903 ملصقة أسفل لوحها الشمسي.'
    ],
    discoveriesEn: [
      'Proved aerodynamic controlled lift is feasible and reliable in Mars’ ultra-thin atmosphere.',
      'Served as aerial scout, imaging terrain hazards and plotting optimal routes for Perseverance.',
      'Accumulated >128 flight minutes, covering 17 km distance and reaching altitudes of 24 meters.',
      'Carried a historic swatch of fabric from the 1903 Wright Flyer beneath its solar panel.'
    ],
    telemetry: {
      velocity: '0.00 M/S (PERMANENT AIRFIELD)',
      distance: '225,000,000 KM (MARS)',
      status: 'MISSION ACCOMPLISHED & RESTING',
      temperature: '-85°C (COLD NIGHT SURVIVAL)',
      powerSource: 'SOLAR PANEL + SONY LI-ION CELLS'
    },
    nasaApiQuery: 'Mars Ingenuity Helicopter',
    detailsAr: [
      'المركبة: مروحية المريخ إنجينويتي (NASA JPL Ingenuity Mars Helicopter)',
      'الكتلة: 1.8 كجم فقط على الأرض (وزنها 0.68 كجم على المريخ)',
      'الموقع: تلال فالينور، فوهة جيزيرو (المريخ)'
    ],
    detailsEn: [
      'Aircraft: Ingenuity Mars Helicopter (NASA Jet Propulsion Laboratory)',
      'Total Mass: 1.8 kg (Mars weight: only 0.68 kg)',
      'Resting Site: Valinor Hills, Jezero Crater, Mars'
    ],
    sourceAr: 'المصدر: وكالة ناسا ومختبر الدفع النفاث — أرشيف إنجينويتي (NASA JPL Ingenuity Mars Archive)',
    sourceEn: 'Source: NASA Jet Propulsion Laboratory (JPL) Ingenuity Mars Helicopter Archive'
  },

  // =========================================================================
  // MISSION 05: DEEP SPACE — PIONEER 10 & THE GOLDEN PLAQUE
  // =========================================================================
  {
    id: 'deep-space-pioneer',
    order: 5,
    codename: 'PIONEER-10',
    titleAr: 'مسبار بايونير 10 — اللوحة الذهبية وسفير الصمت السحيق',
    titleEn: 'Pioneer 10 — The Silent Voyager & The Golden Plaque',
    destinationAr: 'أعماق الفضاء الخارجي (باتجاه كوكبة الثور ونجم الدبران)',
    destinationEn: 'Outer Solar System Frontier (Taurus Constellation)',
    targetCoordinates: '80+ AU (12+ BILLION KM)',
    descAr: 'أول مركبة بشرية تجتاز حزام الكويكبات وتزور كوكب المشتري. يحمل مسبار بايونير 10 اللوحة الذهبية الشهيرة المنقوشة برسم الإنسان وموقع كوكب الأرض بين النجوم النابضة، ويسبح الآن صامتاً في أعماق المجرة لملايين السنين.',
    descEn: 'The first robotic probe to traverse the asteroid belt and achieve close reconnaissance of Jupiter. Pioneer 10 carries the historic gold-anodized plaque depicting humanity and Earth’s celestial coordinates, silently coasting toward Aldebaran for millions of years.',
    videoSrc: '/assets/videos/pioneer-01.mp4',
    poster: '/assets/images/pioneer_probe_realistic.jpg',
    position: { x: 82, y: 54 },
    objectivesAr: [
      'توثيق مسيرة أول جسم بشري اجتاز مدار كوكب نبتون متجهاً نحو الفضاء العميق.',
      'استعراض اللوحة الذهبية التذكارية (Pioneer Plaque) التي صممها كارل ساجان وفرانك دريك.',
      'تحليل البيانات الفيزيائية الأولى لحزام الكويكبات والإشعاع الهائل المحيط بالمشتري.',
      'تخليد آخر إشارة راديوية ضعيفة التقطتها شبكة الفضاء العميق عام 2003 قبل صمته الأبدي.'
    ],
    objectivesEn: [
      'Trace the path of the very first human-built craft to cross beyond the orbit of Neptune.',
      'Inspect the iconic gold-anodized aluminum plaque designed by Carl Sagan and Frank Drake.',
      'Review pioneer discoveries charting the asteroid belt and Jupiter’s immense radiation belts.',
      'Honor the poignant final faint whisper received by the Deep Space Network in 2003.'
    ],
    timeline: [
      {
        date: '2 مارس 1972',
        titleAr: 'الإطلاق على أطلس-سنتور',
        titleEn: 'Atlas-Centaur Launch',
        descAr: 'انطلاق بايونير 10 ليصبح أسرع جسم صنعه الإنسان وقت إطلاقه متوجهاً للمشتري.',
        descEn: 'Pioneer 10 launches, achieving the highest departure speed of any man-made object at the time.'
      },
      {
        date: '3 ديسمبر 1973',
        titleAr: 'أول اقتراب بشري من المشتري',
        titleEn: 'Historic Jupiter Flyby',
        descAr: 'التحليق على مسافة 130,000 كم والتقاط أولى الصور المقربة للغلاف الجوي والبقعة الحمراء.',
        descEn: 'Close encounter at 130,000 km sends back humanity’s first direct close-up images of Jupiter.'
      },
      {
        date: '23 يناير 2003',
        titleAr: 'الهمسة الأخيرة من مسافة 12 مليار كم',
        titleEn: 'The Final Signal',
        descAr: 'استقبال آخر نبضة إشارة خافتة جداً من المسبار على بعد 80 وحدة فلكية قبل نفاد طاقة مولده.',
        descEn: 'NASA’s Deep Space Network receives Pioneer 10’s last faint telemetry transmission.'
      }
    ],
    discoveriesAr: [
      'أول إثبات علمي بأن حزام الكويكبات آمن للعبور ولا يحطم المركبات الفضائية المتجهة للكواكب الخارجية.',
      'أول قياس دقيق للمجال المغناطيسي الجبار لكوكب المشتري وأحزمة إشعاعه المميتة.',
      'يحمل اللوحة الذهبية المنقوشة برمز ذرة الهيدروجين ومخطط كواكب المجموعة الشمسية وموقع الأرض.',
      'يسبح في مسار باليستي مستقر باتجاه النجم العملاق "الدبران" وسيصل محيطه بعد مليوني عام.'
    ],
    discoveriesEn: [
      'First spacecraft to safely traverse the asteroid belt, proving safe passage to outer planets.',
      'First direct measurement of Jupiter’s colossal magnetosphere and lethal radiation environment.',
      'Carries the iconic 6x9 inch gold plaque detailing atomic hydrogen transition and pulsar map.',
      'Glides on an untethered galactic escape trajectory heading toward red giant star Aldebaran.'
    ],
    telemetry: {
      velocity: '12.0 KM/S (43,200 KM/H)',
      distance: '80+ AU (12+ BILLION KM)',
      status: 'SILENT GALACTIC EMBASSY',
      temperature: '-270°C (DEEP SPACE VOID)',
      powerSource: 'DEPLETED SNAP-19 RTG'
    },
    nasaApiQuery: 'Pioneer 10',
    detailsAr: [
      'المسبار: بايونير 10 (NASA Ames Research Center / TRW)',
      'الكتلة: 258 كجم',
      'الرسالة الخالدة: لوحة بايونير الذهبية (Pioneer Plaque)'
    ],
    detailsEn: [
      'Spacecraft: Pioneer 10 (NASA Ames Research Center / TRW)',
      'Mass: 258 kg',
      'Timeless Artifact: Gold-Anodized Aluminum Plaque'
    ],
    sourceAr: 'المصدر: وكالة ناسا — مركز أبحاث أميس (NASA Ames Research Center & Pioneer Program)',
    sourceEn: 'Source: NASA Ames Research Center & Pioneer Interplanetary Mission Archive'
  },

  // =========================================================================
  // MISSION 06: INTERSTELLAR — VOYAGER 1 & THE GOLDEN RECORD
  // =========================================================================
  {
    id: 'interstellar-voyager',
    order: 6,
    codename: 'VOYAGER-1',
    titleAr: 'مسبار فوياجر 1 — القرص الذهبي وسفيرة الفضاء بين النجمي',
    titleEn: 'Voyager 1 — The Golden Record in the Interstellar Void',
    destinationAr: 'الفضاء بين النجمي (خارج حدود الغلاف المغناطيسي الشمسي)',
    destinationEn: 'Interstellar Space (Crossing the Heliopause into the Void)',
    targetCoordinates: '164+ AU (24.6 BILLION KM)',
    descAr: 'أبعد جسم صنعه البشر في تاريخ الحضارة، وأول من اجتاز حدود الغلاف الشمسي (الهليوبوز) ليسبح في الفضاء بين النجمي الفعلي. يحمل القرص الذهبي المطلي بالذهب بأصوات وموسيقى ورسائل سلام من كوكب الأرض لكائنات الكون السحيق.',
    descEn: 'The most distant outpost of human civilization and the first spacecraft to breach the heliopause into true interstellar space. Drifting silently at over 61,000 km/h, Voyager 1 carries humanity’s Golden Record time capsule across the Milky Way.',
    videoSrc: '/assets/videos/voyager-01.mp4',
    poster: '/assets/images/voyager_probe_realistic.png',
    position: { x: 94, y: 54 },
    objectivesAr: [
      'استكشاف سفيرة البشرية في الفضاء بين النجمي على مسافة تزيد عن 24 مليار كيلومتر من الأرض.',
      'فحص السجل الذهبي (The Golden Record) الحامل لأصوات الأرض وموسيقاها وتحيات بـ 55 لغة بشرية.',
      'توثيق لحظة اختراق حافة الغلاف الشمسي (الهليوبوز) وتسجيل أولى قياسات البلازما المجرية المباشرة.',
      'تكريم صورة "النقطة الزرقاء الباهتة" (Pale Blue Dot) التي التقطها فوياجر لكوكب الأرض من حافة النظام الشمسي.'
    ],
    objectivesEn: [
      'Survey humanity’s farthest emissary traveling over 24 billion kilometers from Earth.',
      'Examine the iconic Golden Record carrying Earth’s sounds, music, and greetings in 55 languages.',
      'Document crossing the heliopause into pristine interstellar galactic plasma medium.',
      'Honor the legendary "Pale Blue Dot" photograph capturing Earth as a fragile mote in sunbeam.'
    ],
    timeline: [
      {
        date: '5 سبتمبر 1977',
        titleAr: 'الإطلاق نحو المحاذاة الكبرى',
        titleEn: 'Grand Tour Liftoff',
        descAr: 'انطلاق فوياجر 1 للاستفادة من المحاذاة الكوكبية النادرة التي تحدث كل 175 سنة.',
        descEn: 'Voyager 1 launches from Cape Canaveral to embark on the planetary Grand Tour.'
      },
      {
        date: '14 فبراير 1990',
        titleAr: 'صورة النقطة الزرقاء الباهتة',
        titleEn: 'Pale Blue Dot Image',
        descAr: 'فوياجر 1 يلتفت نحو الأرض ويلتقط صورتها الشهيرة كنقطة زرقاء متناهية الصغر في شعاع شمس.',
        descEn: 'Takes the famous portrait of Earth from 6 billion km away at Carl Sagan’s request.'
      },
      {
        date: '25 أغسطس 2012',
        titleAr: 'اختراق الفضاء بين النجمي',
        titleEn: 'Interstellar Crossing',
        descAr: 'المركبة تجتاز الهليوبوز لتصبح رسمياً أول مسبار بشري يغادر فناء الشمس إلى الفضاء المجري.',
        descEn: 'Crosses the heliopause into true interstellar space, measuring galactic cosmic rays.'
      }
    ],
    discoveriesAr: [
      'أول رصد لبراكين نشطة خارج كوكب الأرض (براكين الكبريت على قمر المشتري آيو).',
      'اكتشاف الحلقات الرقيقة لكوكب المشتري وهيكل الحلقات الخيطية المضفورة لكوكب زحل.',
      'كشف الغلاف الجوي الكثيف الغني بالنيتروجين والميثان على قمر تيتان.',
      'أول قياس مباشر لكثافة البلازما والإشعاع الكوني في الوسط بين النجمي خارج تأثير شمسنا.'
    ],
    discoveriesEn: [
      'Discovered active extraterrestrial volcanism on Jupiter’s moon Io and braided rings of Saturn.',
      'Imaged Titan’s nitrogen-dense atmosphere and detected Jovian aurorae.',
      'Provided history’s first direct in-situ measurement of interstellar medium plasma density.',
      'Carries a gold-plated phonograph record guaranteed to endure in the cosmic void for a billion years.'
    ],
    telemetry: {
      velocity: '17.0 KM/S (61,200 KM/H)',
      distance: '164+ AU (24.6 BILLION KM)',
      status: 'INTERSTELLAR MISSION ACTIVE',
      temperature: '-269°C (COSMIC VOID)',
      powerSource: '3 RADIOISOTOPE THERMOELECTRIC GENERATORS (RTG)'
    },
    nasaApiQuery: 'Voyager 1 Interstellar',
    detailsAr: [
      'البُعد عن الأرض: أكثر من 24.6 مليار كيلومتر (164 وحدة فلكية)',
      'زمن انتقال الإشارة الضوئية: أكثر من 45.6 ساعة ذهاباً وإياباً',
      'الرسالة الخالدة: القرص الذهبي المطلي بالذهب عيار 24 (The Golden Record)'
    ],
    detailsEn: [
      'Distance from Earth: >24.6 Billion Kilometers (164 Astronomical Units)',
      'Round-Trip Light Time: >45.6 hours communication latency',
      'Interstellar Time Capsule: 12-inch Gold-Plated Copper Phonograph Record'
    ],
    sourceAr: 'المصدر: وكالة ناسا ومختبر الدفع النفاث — مشروع فوياجر بين النجوم (NASA JPL Voyager Archive)',
    sourceEn: 'Source: NASA Voyager Interstellar Mission & Jet Propulsion Laboratory'
  }
];

/**
 * Legacy mission mapping to ensure 100% backward compatibility
 */
export const LEGACY_MISSION_MAP: Record<string, string> = {
  'apollo-11': 'moon-lunar-rover',
  'jwst': 'moon-surveyor-3',
  'artemis': 'mars-opportunity',
  'mars-perseverance': 'mars-ingenuity',
  'voyager-1': 'interstellar-voyager',
};

export function getMissionById(id: string): MissionConfig | undefined {
  const targetId = LEGACY_MISSION_MAP[id] || id;
  return MISSIONS_DATA.find(m => m.id === targetId || m.id === id);
}
