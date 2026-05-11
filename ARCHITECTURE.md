# معمارية منصة حفظ القرآن الكريم
## Platform Architecture & Design Documentation

### 📐 معمارية النظام

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Components                        │   │
│  │  ┌──────────────┐  ┌──────────────┐                  │   │
│  │  │   Pages      │  │   Components │                  │   │
│  │  │ - Home       │  │ - Header     │                  │   │
│  │  │ - Memory     │  │ - Footer     │                  │   │
│  │  │ - Listeners  │  │ - AudioPlay  │                  │   │
│  │  │ - Downloads  │  │ - Recording  │                  │   │
│  │  │ - Dashboard  │  │ - Progress   │                  │   │
│  │  │ - About      │  │ - Cards      │                  │   │
│  │  └──────────────┘  └──────────────┘                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     Tailwind CSS + Custom Styling                     │   │
│  │   - Islamic Design System                             │   │
│  │   - Dark Mode Support                                 │   │
│  │   - Responsive Layout                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↑
                    API Calls (Axios)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend (Node.js + Express) [Future]             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         API Endpoints                                 │   │
│  │  - Authentication & Users                             │   │
│  │  - Quran Data (Verses, Surahs)                         │   │
│  │  - Audio Processing & Streaming                        │   │
│  │  - User Progress Tracking                              │   │
│  │  - Statistics & Analytics                              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Business Logic                                │   │
│  │  - Validation & Authorization                          │   │
│  │  - Audio Analysis (Speech Recognition)                 │   │
│  │  - Progress Calculation                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL) [Future]                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Tables                                               │   │
│  │  - users                - user_progress                │   │
│  │  - surahs               - achievements                 │   │
│  │  - verses               - daily_activity               │   │
│  │  - reciters             - statistics                   │   │
│  │  - audio_files          - notifications                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 🎨 نظام التصميم الإسلامي

#### الألوان الأساسية:
```
Primary Green      #2d5f3f  ████
Dark Green         #1a472a  ████
Gold Secondary     #d4af37  ████
Accent Brown       #8b6f47  ████
Light Beige        #f5f1e8  ████
Deep Beige         #e8dcc8  ████
```

#### الخطوط:
- **للنصوص العربية**: Cairo و Tajawal (Google Fonts)
- **للنصوص الإنجليزية**: Inter (Google Fonts)

#### مكونات قابلة لإعادة الاستخدام:
- `islamic-card` - بطاقات بتأثير ذهبي
- `islamic-btn-primary` - أزرار ذهبية
- `islamic-btn-secondary` - أزرار خضراء
- `islamic-gradient` - تدرج أخضر
- `verse` - تنسيق الآيات القرآنية

### 📄 الصفحات الرئيسية

#### 1. **الصفحة الرئيسية** (`/`)
**الهدف**: عرض منصة شاملة مع الميزات الرئيسية

**المحتوى:**
- بانر ترحيبي مع آية قرآنية
- 6 بطاقات للميزات الرئيسية
- قسم الإحصائيات
- نداء للعمل (CTA)

**الوظائف:**
- التنقل السلس
- تأثيرات انتقالية جميلة
- استجابة كاملة للأجهزة

#### 2. **نظام الحفظ** (`/memorization`)
**الهدف**: تسهيل حفظ القرآن الكريم

**المحتوى:**
- قائمة السور الكريمة (Sidebar)
- مشغل الصوت المتقدم
- عرض الآيات
- أداة التسجيل الصوتي
- متتبع التقدم

**الميزات:**
- تشغيل التلاوة مع خيارات التكرار
- تسجيل التسميع والتحليل
- عرض معدل الإتقان والأخطاء
- متابعة الإحصائيات

#### 3. **الاستماع للقراء** (`/listeners`)
**الهدف**: توفير مكتبة تلاوات شاملة

**المحتوى:**
- قائمة 50+ قارئ معروف
- بحث وفلترة للقراء
- مشغل صوت عالي الجودة
- معلومات القارئ والتقييمات

**الميزات:**
- اختيار السورة من قائمة منسدلة
- عرض شريط التقدم
- خيارات التحكم الكاملة
- تقييمات وعدد الاستماعات

#### 4. **تحميل المصاحف** (`/downloads`)
**الهدف**: توفير نسخ متعددة من القرآن الكريم

**أنواع المصاحف:**
1. **مصحف المدينة** - خط كبير وواضح
2. **مصحف ملون للتجويد** - يوضح قواعد التجويد
3. **مصحف الأطفال** - بتصميم مرح
4. **جزء عم** - خفيف الحجم
5. **مصحف برتقالي** - يوضح الأحكام
6. **مصحف نور البيان** - مع شرح مختصر

**الميزات:**
- تصفية حسب النوع
- عرض التفاصيل (الحجم، العدد الصفحات، التقييم)
- عدد مرات التحميل
- أسئلة شائعة وإجابات

#### 5. **لوحة التحكم** (`/dashboard`)
**الهدف**: عرض ملخص شامل لتقدم المستخدم

**التبويبات:**
1. **نظرة عامة** - الإحصائيات الرئيسية
2. **التقدم** - رسوم بيانية تفصيلية
3. **الإنجازات** - الشارات والجوائز
4. **الإعدادات** - تخصيص التجربة

**الميزات:**
- عرض معلومات المستخدم
- 5 بطاقات إحصائيات رئيسية
- قائمة السور المحفوظة مع نسب الإنجاز
- سجل النشاط الأخير
- نظام الإنجازات (6 شارات)
- إعدادات الإشعارات والعرض

#### 6. **صفحة عن الموقع** (`/about`)
**الهدف**: توضيح الرسالة والرؤية

**المحتوى:**
- رسالة المنصة
- الميزات الرئيسية
- خط زمني للتطور
- معلومات الفريق
- زر التواصل

### 🔧 المكونات الأساسية

#### Header Component
```jsx
- Logo مخصص
- Navigation Links
- Mobile Menu
- Auth Buttons
```

#### Footer Component
```jsx
- About Section
- Quick Links
- Contact Info
- Copyright
```

#### AudioPlayer Component
```jsx
- Play/Pause Button
- Progress Bar
- Speed Control
- Repeat Mode (Once, Verse, Surah)
- Volume Control
```

#### RecordingWidget Component
```jsx
- Recording Start/Stop
- Live Timer
- Playback
- Audio Analysis
- Accuracy Percentage
- Error Detection
- Submit Button
```

#### ProgressTracker Component
```jsx
- Statistics Grid
- Weekly Chart
- Achievements
- Goals
```

### 📊 نماذج البيانات (Data Models)

#### User Model
```javascript
{
  id: string,
  name: string,
  email: string,
  avatar: string,
  joinDate: date,
  tier: enum['free', 'premium'],
  preferences: {
    darkMode: boolean,
    fontSize: enum['small', 'medium', 'large'],
    notifications: boolean
  }
}
```

#### Surah Model
```javascript
{
  id: number,
  arabicName: string,
  englishName: string,
  verseCount: number,
  revelationType: enum['makkan', 'madanah'],
  audioUrl: string
}
```

#### Verse Model
```javascript
{
  id: string,
  surahId: number,
  verseNumber: number,
  text: string,
  transliteration: string,
  meaning: string
}
```

#### Reciter Model
```javascript
{
  id: string,
  name: string,
  country: string,
  bio: string,
  audioLinks: object,
  rating: float,
  verified: boolean
}
```

#### UserProgress Model
```javascript
{
  id: string,
  userId: string,
  surahId: number,
  verseNumber: number,
  status: enum['learning', 'memorized', 'revised'],
  accuracy: float,
  lastReview: date,
  recordings: array[string]
}
```

### 🚀 الميزات المخطط إضافتها

#### Phase 1 (الحالي):
- ✅ صفحات عرض محتوى ثابتة
- ✅ تصميم احترافي وتجربة مستخدم
- ✅ مشغل صوت وعرض آيات

#### Phase 2:
- ⏳ نظام المستخدمين والحسابات
- ⏳ قاعدة بيانات حقيقية
- ⏳ API Backend
- ⏳ المصادقة (JWT/Firebase)

#### Phase 3:
- ⏳ نظام التسجيل الصوتي الفعلي
- ⏳ التعرف الصوتي بالذكاء الاصطناعي
- ⏳ تحليل الأداء المتقدم

#### Phase 4:
- ⏳ لوحة الإدارة
- ⏳ نظام الإشعارات
- ⏳ التقارير والإحصائيات المتقدمة

#### Phase 5:
- ⏳ تطبيق جوال (PWA)
- ⏳ دعم عدة لغات
- ⏳ مساعد ذكي

### 📦 الحزم والمكتبات

```json
{
  "dependencies": {
    "next": "^16.2.6",           // Framework
    "react": "^19.2.6",          // UI Library
    "react-dom": "^19.2.6",      // DOM Rendering
    "axios": "^1.16.0",          // HTTP Client
    "framer-motion": "^12.38.0", // Animations
    "zustand": "^5.0.13",        // State Management
    "lucide-react": "^1.14.0"    // Icons
  },
  "devDependencies": {
    "tailwindcss": "^4.3.0",              // CSS Framework
    "@tailwindcss/postcss": "^4.0.0",   // PostCSS Plugin
    "@tailwindcss/forms": "^0.5.11",    // Form Styles
    "postcss": "^8.5.14",                // CSS Processing
    "autoprefixer": "^10.5.0"            // Vendor Prefixes
  }
}
```

### 🔐 الأمان والأداء

#### الأمان:
- ✅ تنقية المدخلات (Input Sanitization)
- ✅ HTTPS فقط (في الإنتاج)
- ✅ CORS Configuration
- ⏳ Rate Limiting
- ⏳ Authentication & Authorization
- ⏳ Data Encryption

#### الأداء:
- ✅ Code Splitting (Next.js)
- ✅ Image Optimization (Next.js Image)
- ✅ Lazy Loading Components
- ⏳ Caching Strategy
- ⏳ CDN for Audio Files
- ⏳ Database Indexing

### 🌍 التكامل المستقبلي

#### APIs الخارجية:
- **Google Cloud Speech-to-Text** - للتعرف الصوتي
- **Firebase** - للمصادقة وقاعدة البيانات
- **AWS S3** - لتخزين الملفات الصوتية
- **Stripe** - للدفع (للنسخة Premium)

### 📱 التوافقية

```
Desktop:  ✅ Chrome, Firefox, Safari, Edge
Mobile:   ✅ iOS Safari, Chrome Mobile
Tablet:   ✅ iPad, Android Tablets
Languages: ✅ Arabic (RTL), ⏳ English (LTR)
Dark Mode: ✅ Supported
PWA:       ⏳ Planned
```

### 📝 ملاحظات التطوير

1. **HTML Direction**: تم استخدام `dir="rtl"` للنصوص العربية
2. **Typography**: استخدام fonts من Google لضمان التوافقية
3. **Color Contrast**: تطابق معايير WCAG للتباين
4. **Performance**: Lazy loading للصور والعناصر الثقيلة
5. **State Management**: Zustand للحالة العامة (مخطط)

---

**آخر تحديث**: 11 مايو 2026

لأي استفسارات أو اقتراحات، يرجى التواصل عبر info@quranapp.com
