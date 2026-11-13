# دليل ملفات الفيديو المطلوبة للمشروع — COSMOS: Mission: Moon

تم إعداد المجلد لدعم تشغيل الفيديوهات تلقائياً عند وصول رائد الفضاء إلى كل مهمة من المهام الخمس على سطح القمر.
تم وضع ملفات مؤقتة (`placeholder`) تعمل بشكل فوري لضمان عدم توقف المتصفح أو مشغل الفيديو.
يمكنك استبدال هذه الملفات بالفيديوهات الحقيقية الرسمية بأي وقت مع الحفاظ على نفس الأسماء:

## 1. قائمة ملفات الفيديو المطلوبة:

| رقم المهمة | اسم الملف المطلوب | المهمة الفضائية | المصدر الرسمي المقترح من ناسا |
|---|---|---|---|
| **01** | `mission-01.mp4` | **Apollo 11** (أبولو 11 — الهبوط التاريخي في بحر الهدوء) | [NASA Apollo 11 Overview Video](https://images.nasa.gov/details/Apollo%2011%20Overview) / `NASA History Office` |
| **02** | `mission-02.mp4` | **James Webb Space Telescope (JWST)** (تلسكوب جيمس ويب الفضائي) | [NASA Webb Telescope Deployment](https://images.nasa.gov/details/GSFC_20211225_JWST_Deployment) / `NASA Goddard` |
| **03** | `mission-03.mp4` | **Artemis Program** (برنامج أرتميس — العودة إلى القمر) | [NASA Artemis I Highlights](https://images.nasa.gov/details/Artemis_I_Flight_Highlights) / `NASA Artemis Exploration` |
| **04** | `mission-04.mp4` | **Mars Perseverance Rover** (روفر بيرسيفيرنس وهبوط المريخ) | [NASA Perseverance Landing Moments](https://images.nasa.gov/details/PIA24426) / `NASA JPL` |
| **05** | `mission-05.mp4` | **Voyager 1** (مسبار فوياجر 1 في الفضاء بين النجوم) | [NASA Voyager 40th Anniversary](https://images.nasa.gov/details/Voyager-40-Years) / `NASA JPL Interstellar` |

## 2. المواصفات التقنية الموصى بها للفيديوهات:
- **الصيغة**: `MP4 (H.264 / AAC)`.
- **الدقة الموصى بها**: `1080p (1920×1080)` أو `720p (1280×720)`.
- **المدة المقترحة لكل فيديو**: 30 إلى 90 ثانية لضمان تجربة سريعة ومشوقة للجمهور (أطفال وشباب).
- **التحكم التلقائي**: المشغل يقوم بتشغيل الفيديو تلقائياً بوضع صامت `muted playsinline` للامتثال لسياسات المتصفحات، مع إمكانية تشغيل الصوت بضغطة زر، وإمكانية تخطي الفيديو فوراً، وإغلاق المشغل تلقائياً عند انتهاء الفيديو (حدث `ended`).

