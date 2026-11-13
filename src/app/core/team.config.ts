export interface TeamMember {
  id: string;
  order: number;
  code: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  specialtyAr: string;
  specialtyEn: string;
  avatar: string;
  glowColor: string;
  bioAr?: string;
  bioEn?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-01',
    order: 1,
    code: '01',
    nameAr: 'م. مصطفى الشريف',
    nameEn: 'Eng. Mustafa El-Sherif',
    roleAr: 'قائد الفريق ومطور الويب الإبداعي',
    roleEn: 'Team Lead & Creative Frontend Developer',
    specialtyAr: 'هندسة تجارب الويب التفاعلية والأنيميشن السينمائي',
    specialtyEn: 'Interactive Web Architecture & Cinematic Animation',
    avatar: '/assets/images/team/member-01.png',
    glowColor: '#38BDF8',
    bioAr: 'قيادة تصميم وهندسة منصة الرحلة التفاعلية وتطوير محرك الحركة المنحني.',
    bioEn: 'Spearheading interactive flight architecture and curve motion engines.'
  },
  {
    id: 'member-02',
    order: 2,
    code: '02',
    nameAr: 'م. سارة أحمد',
    nameEn: 'Sarah Ahmed',
    roleAr: 'باحثة علوم الفضاء والفيزياء الفلكية',
    roleEn: 'Astrophysics & Space Science Lead',
    specialtyAr: 'التوثيق العلمي لمهام ناسا ومسارات المسابر',
    specialtyEn: 'NASA Mission Science Documentation & Trajectories',
    avatar: '/assets/images/team/member-02.png',
    glowColor: '#818CF8',
    bioAr: 'تدقيق البيانات الفيزيائية والتاريخية لمعدات القمر والمريخ ومسابر الفضاء السحيق.',
    bioEn: 'Validating historical and physical datasets of extraterrestrial relics.'
  },
  {
    id: 'member-03',
    order: 3,
    code: '03',
    nameAr: 'م. عمر خالد',
    nameEn: 'Omar Khaled',
    roleAr: 'مصمم واجهات وتجربة المستخدم الفضائية',
    roleEn: 'UI/UX & Spacecraft HUD Designer',
    specialtyAr: 'تصميم أنظمة الرادار والخوذة وشاشات القيادة',
    specialtyEn: 'Helmet HUD, Telemetry & Cockpit UI Systems',
    avatar: '/assets/images/team/member-03.png',
    glowColor: '#34D399',
    bioAr: 'ابتكار الهوية البصرية لشاشات التيليميتري ونظام البطاقات ثلاثية الأبعاد.',
    bioEn: 'Crafting futuristic glassmorphism HUD cards and responsive telemetry.'
  },
  {
    id: 'member-04',
    order: 4,
    code: '04',
    nameAr: 'م. نور الهدى علي',
    nameEn: 'Nour Ali',
    roleAr: 'مخرجة المحتوى والسرد القصصي',
    roleEn: 'Narrative Director & Storytelling Lead',
    specialtyAr: 'صياغة الدراما القصصية "مهجورة لكنها لم تُنسَ"',
    specialtyEn: 'Storytelling & "Abandoned But Not Forgotten" Dramaturgy',
    avatar: '/assets/images/team/member-04.png',
    glowColor: '#F472B6',
    bioAr: 'بناء الحبكة القصصية المؤثرة لرحلة البحث عن روفرات ومسابر البشرية المنسية.',
    bioEn: 'Weaving the emotional narrative honoring humanity’s sleeping emissaries.'
  },
  {
    id: 'member-05',
    order: 5,
    code: '05',
    nameAr: 'م. يوسف محمود',
    nameEn: 'Youssef Mahmoud',
    roleAr: 'مهندس المؤثرات البصرية والصوتيات',
    roleEn: 'VFX & Web Audio Sound Designer',
    specialtyAr: 'التوليف الصوتي الديناميكي ومحركات الدفع',
    specialtyEn: 'Web Audio Synthesis & Thruster Acoustics',
    avatar: '/assets/images/team/member-05.png',
    glowColor: '#FBBF24',
    bioAr: 'تصميم المؤثرات الصوتية للأجواء الفضائية والنبضات الرادارية التفاعلية.',
    bioEn: 'Synthesizing dynamic multi-layered deep space ambiances.'
  },
  {
    id: 'member-06',
    order: 6,
    code: '06',
    nameAr: 'م. آية إبراهيم',
    nameEn: 'Aya Ibrahim',
    roleAr: 'أخصائية بيانات وأرشيف ناسا',
    roleEn: 'NASA Open Data & API Specialist',
    specialtyAr: 'استرجاع ومعالجة صور الأرشيف الفضائي المفتوح',
    specialtyEn: 'NASA Open API Pipeline & Archive Ingestion',
    avatar: '/assets/images/team/member-06.png',
    glowColor: '#A78BFA',
    bioAr: 'تأمين الاتصال بأرشيف ناسا الفضائي واسترجاع البيانات الموثقة لكل موقع.',
    bioEn: 'Connecting real-time queries with official NASA JPL image archives.'
  },
  {
    id: 'member-07',
    order: 7,
    code: '07',
    nameAr: 'م. كريم طارق',
    nameEn: 'Karim Tarek',
    roleAr: 'مونتير ومصمم وسائط وفيديو',
    roleEn: 'Video Editor & Motion Designer',
    specialtyAr: 'إنتاج الفيديوهات السينمائية للمهام الست',
    specialtyEn: 'Cinematic 4K Footage Editing & Motion Post-Production',
    avatar: '/assets/images/team/member-07.png',
    glowColor: '#FB923C',
    bioAr: 'إخراج ومونتاج المقاطع الميدانية الوثائقية لكل محطة استكشافية.',
    bioEn: 'Editing high-impact mission briefs and cinematic video feeds.'
  },
  {
    id: 'member-08',
    order: 8,
    code: '08',
    nameAr: 'م. مريم حسن',
    nameEn: 'Mariam Hassan',
    roleAr: 'مهندسة الجرافيك والأصول ثلاثية الأبعاد',
    roleEn: '3D Graphics & Asset Engineer',
    specialtyAr: 'تصيير نماذج المسابر والمركبة الفضائية',
    specialtyEn: 'Photorealistic Probe Rendering & 3D Shading',
    avatar: '/assets/images/team/member-08.png',
    glowColor: '#2DD4BF',
    bioAr: 'تصميم ومطابقة الأصول البصرية للمركبات والمسابر الفضائية الأيقونية.',
    bioEn: 'Crafting precision models of Pioneer, Voyager, and Mars rovers.'
  },
  {
    id: 'member-09',
    order: 9,
    code: '09',
    nameAr: 'م. زياد عادل',
    nameEn: 'Ziad Adel',
    roleAr: 'أخصائي الروبوتات والمسابر الفضائية',
    roleEn: 'Robotics & Space Systems Specialist',
    specialtyAr: 'دراسة أنظمة الطاقة والبطاريات النووية RTG',
    specialtyEn: 'Planetary Robotics & Radioisotope Power Systems',
    avatar: '/assets/images/team/member-09.png',
    glowColor: '#60A5FA',
    bioAr: 'تحليل أسباب توقف الروفرات والمسابر ونهاية عمرها التشغيلي في الفضاء.',
    bioEn: 'Analyzing robotic hardware endurance and end-of-mission telemetry.'
  },
  {
    id: 'member-10',
    order: 10,
    code: '10',
    nameAr: 'م. دينا سمير',
    nameEn: 'Dina Samir',
    roleAr: 'منسقة الجودة والتجربة التفاعلية',
    roleEn: 'QA & Interactive Experience Specialist',
    specialtyAr: 'اختبار الأداء والتوافق على مختلف الأجهزة',
    specialtyEn: 'Cross-Device Performance & Accessibility Testing',
    avatar: '/assets/images/team/member-10.png',
    glowColor: '#E879F9',
    bioAr: 'ضمان سلاسة معدل الإطارات (60 FPS) وتوافق الشاشات المختلفة وتناسق اللغات.',
    bioEn: 'Verifying seamless 60 FPS scroll performance and RTL responsiveness.'
  }
];

