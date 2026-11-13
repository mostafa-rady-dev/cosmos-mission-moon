export interface PlanetFact {
  textAr: string;
  textEn: string;
}

export interface PlanetConfig {
  id: string;
  nameKey: string;
  nameAr: string;
  nameEn: string;
  image: string;
  size: number; // size in px on standard viewport
  coords: { xPct: number; yPct: number };
  color: string;
  glowColor: string;
  triggerProgress: number; // 0.0 to 1.0 within Scene 3 timeline
  sourceAr: string;
  sourceEn: string;
  facts: [PlanetFact, PlanetFact, PlanetFact];
}

export const PLANETS_DATA: PlanetConfig[] = [
  {
    id: 'mercury',
    nameKey: 'planetMercury',
    nameAr: 'عطارد',
    nameEn: 'Mercury',
    image: '/assets/images/mercury_realistic.jpg',
    size: 78,
    coords: { xPct: 6, yPct: 56 },
    color: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.45)',
    triggerProgress: 0.06,
    sourceAr: 'وكالة ناسا — مهمة MESSENGER (PIA11364)',
    sourceEn: 'NASA — MESSENGER Mission (PIA11364)',
    facts: [
      {
        textAr: 'يومه أطول من سنته! يستغرق دورانه حول نفسه 176 يومًا أرضيًا بينما دورته حول الشمس 88 يومًا فقط.',
        textEn: 'A solar day on Mercury lasts 176 Earth days, which is twice as long as its entire 88-day year!'
      },
      {
        textAr: 'جليد مائي نقي داخل فوهات قطبية مظلمة لم ترَ ضوء الشمس أبدًا، رغم حرارته الحارقة نهارًا (430°C)!',
        textEn: 'Pure water ice hides inside permanently shadowed polar craters despite scorching daytime heat (430°C)!'
      },
      {
        textAr: 'الكوكب يتقلص حرفيًا! مع تبريد لبه الحديدي الضخم، انكمش قطره بنحو 14 كيلومترًا مكوّنًا منحدرات شاهقة.',
        textEn: 'The planet is literally shrinking! Its cooling iron core has contracted its diameter by about 14 km.'
      }
    ]
  },
  {
    id: 'venus',
    nameKey: 'planetVenus',
    nameAr: 'الزهرة',
    nameEn: 'Venus',
    image: '/assets/images/venus_realistic.jpg',
    size: 104,
    coords: { xPct: 17, yPct: 32 },
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    triggerProgress: 0.17,
    sourceAr: 'وكالة ناسا — مسبار ماجلان ومارينر 10 (PIA00104)',
    sourceEn: 'NASA — Magellan & Mariner 10 Missions (PIA00104)',
    facts: [
      {
        textAr: 'الشمس تشرق من الغرب وتغرب في الشرق! لأنه يدور في اتجاه معاكس لمعظم كواكب المجموعة.',
        textEn: 'The Sun rises in the west and sets in the east because Venus rotates backwards compared to other planets!'
      },
      {
        textAr: 'تمطر سماؤه قطرات من حمض الكبريتيك لكنها تتبخر بالجو قبل لمس السطح بفعل الحرارة الشديدة (465°C)!',
        textEn: 'Its clouds rain concentrated sulfuric acid that evaporates before touching ground due to 465°C heat!'
      },
      {
        textAr: 'الضغط الجوي على سطحه يعادل الغوص 900 متر تحت المحيط، وهو كافٍ لسحق غواصة معدنية في ثوانٍ!',
        textEn: 'Surface pressure equals being 900 meters underwater on Earth, enough to crush a metal submarine!'
      }
    ]
  },
  {
    id: 'earth',
    nameKey: 'planetEarth',
    nameAr: 'الأرض',
    nameEn: 'Earth',
    image: '/assets/images/earth_realistic.jpg',
    size: 118,
    coords: { xPct: 29, yPct: 62 },
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.55)',
    triggerProgress: 0.29,
    sourceAr: 'مرصد الأرض التابع لناسا — مركز غودارد',
    sourceEn: 'NASA Earth Observatory — Goddard Space Flight Center',
    facts: [
      {
        textAr: 'الأرض ليست كرة تامة بل مفلطحة وتنتفخ بنحو 43 كم عند خط الاستواء بسبب دورانها المغزلي!',
        textEn: 'Earth is not a perfect sphere; centrifugal force causes an equatorial bulge of about 43 km!'
      },
      {
        textAr: 'يبتلع كوكبنا يوميًا ما يقارب 100 طن من الغبار الكوني والنيازك المجهرية المتساقطة من الفضاء!',
        textEn: 'Our planet sweeps up approximately 100 tons of cosmic interplanetary dust and micrometeorites every single day!'
      },
      {
        textAr: 'المجال المغناطيسي للأرض ينقلب دوريًا كل بضع مئات آلاف السنين ويتبادل القطب الشمالي والجنوبي مكانيهما!',
        textEn: 'Earth’s magnetic field periodically flips polarity, swapping the North and South magnetic poles!'
      }
    ]
  },
  {
    id: 'mars',
    nameKey: 'planetMars',
    nameAr: 'المريخ',
    nameEn: 'Mars',
    image: '/assets/images/mars_realistic.jpg',
    size: 92,
    coords: { xPct: 41, yPct: 24 },
    color: '#f87171',
    glowColor: 'rgba(248, 113, 113, 0.45)',
    triggerProgress: 0.41,
    sourceAr: 'برنامج استكشاف المريخ — وكالة ناسا (Curiosity / Perseverance)',
    sourceEn: 'NASA Mars Exploration Program (Curiosity & Perseverance)',
    facts: [
      {
        textAr: 'غروب الشمس على المريخ يظهر باللون الأزرق الناصع بسبب تشتت الضوء عبر ذرات الغبار الدقيقة!',
        textEn: 'Sunsets on Mars glow a distinctive cool blue due to how fine atmospheric dust scatters sunlight!'
      },
      {
        textAr: 'يضم بركان "أوليمبوس مونس" وهو أعلى جبل بالمجموعة الشمسية، بارتفاع 3 أضعاف قمة إفرست!',
        textEn: 'Houses Olympus Mons, the solar system’s tallest volcano, towering 3 times higher than Mount Everest!'
      },
      {
        textAr: 'يمتد أخدود "فاليس مارينريس" على طول 4,000 كم، أي أطول بـ 4 مرات وأعمق بـ 5 مرات من الأخدود العظيم!',
        textEn: 'Valles Marineris canyon spans over 4,000 km, 4 times longer and 5 times deeper than the Grand Canyon!'
      }
    ]
  },
  {
    id: 'jupiter',
    nameKey: 'planetJupiter',
    nameAr: 'المشتري',
    nameEn: 'Jupiter',
    image: '/assets/images/jupiter_realistic.jpg',
    size: 172,
    coords: { xPct: 53, yPct: 54 },
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    triggerProgress: 0.53,
    sourceAr: 'وكالة ناسا — مسبار جونو وتليسكوب هابل (PIA22949)',
    sourceEn: 'NASA — Juno Mission & Hubble Space Telescope (PIA22949)',
    facts: [
      {
        textAr: 'أسرع كوكب يدور حول نفسه! يدور في أقل من 10 ساعات فقط رغم أنه يتسع لـ 1,300 كوكب مثل الأرض!',
        textEn: 'Fastest spinning planet! A full day takes under 10 hours despite holding over 1,300 Earths inside!'
      },
      {
        textAr: 'البقعة الحمراء العظيمة هي إعصار عملاق يعصف منذ أكثر من 350 عامًا ويتسع لكوكب الأرض بأكمله!',
        textEn: 'The Great Red Spot is a persistent super-storm raging for over 350 years, wider than planet Earth!'
      },
      {
        textAr: 'لا يملك سطحًا صلبًا للوقوف عليه، فالغازات تتحول بالتدريج إلى محيط هائل من الهيدروجين المعدني السائل!',
        textEn: 'Has no solid surface; dense gas gradually transforms into a scorching ocean of liquid metallic hydrogen!'
      }
    ]
  },
  {
    id: 'saturn',
    nameKey: 'planetSaturn',
    nameAr: 'زحل',
    nameEn: 'Saturn',
    image: '/assets/images/saturn_realistic.png',
    size: 210,
    coords: { xPct: 65, yPct: 20 },
    color: '#fde047',
    glowColor: 'rgba(253, 224, 71, 0.45)',
    triggerProgress: 0.65,
    sourceAr: 'وكالة ناسا — مسبار كاسيني-هويجنز (PIA08329)',
    sourceEn: 'NASA — Cassini-Huygens Mission (PIA08329)',
    facts: [
      {
        textAr: 'كثافته أقل من الماء! لو وضعنا زحل في حوض ماء عملاق لطفى على السطح كالبالون الخفيف!',
        textEn: 'Less dense than liquid water! Saturn would literally float if placed in a giant cosmic bathtub!'
      },
      {
        textAr: 'حلقاته المذهلة تمتد لـ 282,000 كم لكن سمكها في أغلب الأماكن يتراوح بين 10 إلى 30 مترًا فقط!',
        textEn: 'Its majestic rings span 282,000 km across, yet are mostly only 10 to 30 meters paper-thin!'
      },
      {
        textAr: 'تعصف بقطبه الشمالي دوامة غازية غامضة بهيئة مسدس هندسي عملاق يتسع لكرتين أرضيتين!',
        textEn: 'A mysterious geometric hexagon jet-stream spins at Saturn’s north pole, wider than two Earths combined!'
      }
    ]
  },
  {
    id: 'uranus',
    nameKey: 'planetUranus',
    nameAr: 'أورانوس',
    nameEn: 'Uranus',
    image: '/assets/images/uranus_realistic.jpg',
    size: 110,
    coords: { xPct: 76, yPct: 58 },
    color: '#67e8f9',
    glowColor: 'rgba(103, 232, 249, 0.45)',
    triggerProgress: 0.76,
    sourceAr: 'وكالة ناسا — مسبار فوياجر 2 ومرصد جيميني (PIA18182)',
    sourceEn: 'NASA — Voyager 2 Flyby & Gemini Observatory (PIA18182)',
    facts: [
      {
        textAr: 'يدور على جنبه بميلان 98 درجة كأنه يتدحرج، ويبقى قطبه مواجهًا للشمس نهارًا مستمرًا لـ 42 عامًا!',
        textEn: 'Tilted sideways by 98 degrees rolling on its orbit; each pole gets 42 years of continuous direct sunlight!'
      },
      {
        textAr: 'أبرد غلاف جوي في المجموعة الشمسية بحرارة تنخفض إلى -224 درجة مئوية، وهو أبرد حتى من نبتون!',
        textEn: 'Features the coldest planetary atmosphere in the Solar System, plunging down to a frigid -224°C!'
      },
      {
        textAr: 'رائحة سحبه تشبه رائحة البيض الفاسد لاحتوائها على تراكيز هائلة من غاز كبريتيد الهيدروجين!',
        textEn: 'Its upper cloud decks contain concentrated hydrogen sulfide, literally smelling like rotten eggs!'
      }
    ]
  },
  {
    id: 'neptune',
    nameKey: 'planetNeptune',
    nameAr: 'نبتون',
    nameEn: 'Neptune',
    image: '/assets/images/neptune_realistic.jpg',
    size: 108,
    coords: { xPct: 86, yPct: 26 },
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.45)',
    triggerProgress: 0.86,
    sourceAr: 'وكالة ناسا — مسبار فوياجر 2 (PIA01492)',
    sourceEn: 'NASA — Voyager 2 Mission (PIA01492)',
    facts: [
      {
        textAr: 'أسرع رياح عاتية في المجموعة الشمسية تهب بسرعات تفوق 2,100 كم/ساعة، أسرع من الصوت!',
        textEn: 'Home to the fastest supersonic winds in the solar system, screaming at speeds over 2,100 km/h!'
      },
      {
        textAr: 'تمطر سماؤه ألماسًا حقيقيًا! الحرارة والضغط بقلبه يحولان غاز الميثان لقطع ألماس تسقط كالمطر نحو النواة!',
        textEn: 'It rains real diamonds! Crushing interior pressures turn atmospheric methane into falling solid diamonds!'
      },
      {
        textAr: 'منذ اكتشافه عام 1846، لم يكمل سوى دورة واحدة كاملة حول الشمس بحلول عام 2011، فسنته 165 عامًا أرضيًا!',
        textEn: 'Takes 165 Earth years to orbit the Sun; it completed its first full orbit since discovery only in 2011!'
      }
    ]
  },
  {
    id: 'moon',
    nameKey: 'planetMoon',
    nameAr: 'القمر (وجهة الهبوط)',
    nameEn: 'The Moon (Landing Target)',
    image: '/assets/images/moon_realistic.jpg',
    size: 130,
    coords: { xPct: 94, yPct: 45 },
    color: '#f8fafc',
    glowColor: 'rgba(248, 250, 252, 0.55)',
    triggerProgress: 0.95,
    sourceAr: 'وكالة ناسا — مهمات أبولو ومسبار الاستطلاع القمري (LRO)',
    sourceEn: 'NASA — Apollo Program & Lunar Reconnaissance Orbiter (LRO)',
    facts: [
      {
        textAr: 'آثار أقدام رواد الفضاء على سطحه ستظل باقية لملايين السنين لانعدام الهواء والرياح والأمطار!',
        textEn: 'Astronaut footprints on the Moon will remain preserved for millions of years because there is no wind or water erosion!'
      },
      {
        textAr: 'يبتعد القمر عن كوكب الأرض تدريجيًا بمقدار 3.8 سنتيمتر سنويًا (بنفس سرعة نمو أظافر الإنسان)!',
        textEn: 'The Moon is slowly drifting away from Earth at 3.8 cm per year, roughly the rate human fingernails grow!'
      },
      {
        textAr: 'تحدث عليه هزات وزلازل قمرية تستمر لعشرات الدقائق بسبب الجذب الثقالي المتبادل مع الأرض!',
        textEn: 'Moon experiences prolonged moonquakes lasting up to tens of minutes caused by Earth’s gravitational tidal stress!'
      }
    ]
  }
];

