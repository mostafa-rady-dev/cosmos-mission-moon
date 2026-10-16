export interface MissionConfig {
  id: string;
  order: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  videoSrc: string;
  poster: string;
  position: {
    x: number; // percentage along horizontal exploration landscape (0 - 100)
    y: number; // vertical offset percentage
  };
  detailsAr: string[];
  detailsEn: string[];
}

export const MISSIONS_DATA: MissionConfig[] = [
  {
    id: 'mission-01',
    order: 1,
    titleAr: 'تحليل طيف التربة القمرية',
    titleEn: 'Lunar Regolith Spectroscopy',
    descAr: 'فحص المعادن والعناصر النادرة في فوهة بحر الهدوء باستخدام مستشعرات الأشعة تحت الحمراء المتطورة.',
    descEn: 'Spectral analysis of rare titanium and helium isotopes across the Sea of Tranquility landing site.',
    videoSrc: '/assets/videos/mission-01.mp4',
    poster: '/assets/images/posters/mission-01.webp',
    position: { x: 18, y: 55 },
    detailsAr: [
      'العمق الجيولوجي: 1.8 متر',
      'نسبة التيتانيوم المقدرة: 8.4%',
      'الحالة: تم جمع وتوثيق 12 عينة نقية'
    ],
    detailsEn: [
      'Sample Core Depth: 1.8m',
      'Estimated Titanium Grade: 8.4%',
      'Status: 12 pristine specimens cataloged'
    ]
  },
  {
    id: 'mission-02',
    order: 2,
    titleAr: 'نشر مصفوفة أسيوط الكهروضوئية',
    titleEn: 'Asyut High-Yield Solar Array',
    descAr: 'تثبيت ألواح الطاقة الشمسية ذات الكفاءة الفائقة المصممة خصيصاً لتحمل الفارق الحراري القاسي ليل ونهار القمر.',
    descEn: 'Deploying ultra-efficient bifacial solar arrays engineered to endure extreme lunar thermal cycling.',
    videoSrc: '/assets/videos/mission-02.mp4',
    poster: '/assets/images/posters/mission-02.webp',
    position: { x: 38, y: 52 },
    detailsAr: [
      'القدرة التوليدية: 45 كيلووات',
      'زاوية التتبع الشمسي: 360 درجة',
      'كفاءة الخلايا: 34.2%'
    ],
    detailsEn: [
      'Peak Power Output: 45 kW',
      'Solar Tracking: 360° dual-axis',
      'Cell Efficiency: 34.2%'
    ]
  },
  {
    id: 'mission-03',
    order: 3,
    titleAr: 'قناة الاتصال الليزري الفضائي',
    titleEn: 'Optical Laser Deep-Space Uplink',
    descAr: 'تشغيل رابط الاتصال الضوئي فائق السرعة لنقل البيانات والفيديو المباشر إلى مركز القيادة في أسيوط.',
    descEn: 'Establishing high-bandwidth optical laser terminal directly linked to Asyut Ground Station.',
    videoSrc: '/assets/videos/mission-03.mp4',
    poster: '/assets/images/posters/mission-03.webp',
    position: { x: 58, y: 56 },
    detailsAr: [
      'معدل نقل البيانات: 1.2 جيجابت/ثانية',
      'زمن انتقال الإشارة: 1.28 ثانية',
      'التشفير: كمومي آمن'
    ],
    detailsEn: [
      'Data Throughput: 1.2 Gbps',
      'Signal Latency: 1.28s light-delay',
      'Encryption: Quantum-resilient'
    ]
  },
  {
    id: 'mission-04',
    order: 4,
    titleAr: 'حفر واستخراج الجليد القمري',
    titleEn: 'Subsurface Cryo-Drilling',
    descAr: 'حفر في المناطق المظللة دائماً لاستخراج جزيئات الماء المتجمد واستخدامها لإنتاج وقود الهيدروجين.',
    descEn: 'Precision automated drilling inside permanently shadowed craters to locate water-ice deposits.',
    videoSrc: '/assets/videos/mission-04.mp4',
    poster: '/assets/images/posters/mission-04.webp',
    position: { x: 78, y: 53 },
    detailsAr: [
      'درجة الحرارة: -230 درجة مئوية',
      'نسبة نقاء الجليد: 96.7%',
      'الهدف: تزويد محطات الأكسجين والوقود'
    ],
    detailsEn: [
      'Cryo Temperature: -230°C',
      'Ice Purity: 96.7%',
      'Objective: Fuel and Life-Support production'
    ]
  },
  {
    id: 'mission-05',
    order: 5,
    titleAr: 'قاعدة رواد المستقبل القمرية',
    titleEn: 'Future Pioneers Habitat Outpost',
    descAr: 'وضع حجر الأساس للوحدة السكنية المعيارية الأولى لتدريب واستضافة الباحثين والمهندسين الشباب.',
    descEn: 'Foundational pressurized inflatable outpost designed for next-generation scientific expeditions.',
    videoSrc: '/assets/videos/mission-05.mp4',
    poster: '/assets/images/posters/mission-05.webp',
    position: { x: 92, y: 54 },
    detailsAr: [
      'السعة الاستيعابية: 6 رواد فضاء',
      'الحماية الإشعاعية: طبقة ريجوليث سميكة',
      'مدة الإقامة: 180 يوماً متواصلاً'
    ],
    detailsEn: [
      'Crew Capacity: 6 researchers',
      'Radiation Shielding: Sintered regolith mantle',
      'Mission Endurance: 180 continuous days'
    ]
  }
];
