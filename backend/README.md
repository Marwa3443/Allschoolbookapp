# منصة حفظ القرآن الكريم - Backend API
## Quran Learning Platform - Backend

Backend API مبني باستخدام Node.js و Express.js و PostgreSQL

### 🚀 البدء السريع

#### المتطلبات:
- Node.js v16+ 
- PostgreSQL v12+
- npm أو yarn

#### التثبيت:

```bash
# تثبيت الحزم
npm install

# نسخ متغيرات البيئة
cp .env.example .env.development

# إنشاء قاعدة البيانات
createdb quran_app_dev

# تشغيل السيرفر في بيئة التطوير
npm run dev
```

السيرفر سيعمل على: `http://localhost:5000`

### 📁 هيكل المشروع

```
backend/
├── src/
│   ├── config/          # الإعدادات (database, constants)
│   ├── controllers/     # معالجات الطلبات
│   ├── models/          # نماذج قاعدة البيانات
│   ├── routes/          # مسارات API
│   ├── middleware/      # وظائف وسيطة
│   ├── services/        # الخدمات الأساسية
│   ├── utils/           # دوال مساعدة
│   └── index.js         # نقطة البداية
├── migrations/          # ملفات هجرة قاعدة البيانات
├── seeds/               # بيانات البداية
├── .env.example         # متغيرات البيئة النموذجية
├── package.json         # الحزم والمكتبات
└── nodemon.json         # إعدادات Nodemon
```

### 🛠️ الأوامر المتاحة

```bash
npm run dev         # تشغيل السيرفر مع Nodemon (للتطوير)
npm start           # تشغيل السيرفر (الإنتاج)
npm test            # تشغيل الاختبارات
npm run seed        # ملء قاعدة البيانات ببيانات البداية
npm run migrate     # تشغيل ملفات الهجرة
```

### 🔌 API Endpoints

تحت الإنشاء - سيتم إضافة الـ endpoints تدريجياً

- `/api/health` - فحص صحة السيرفر
- `/api/auth/*` - مسارات المصادقة
- `/api/users/*` - مسارات المستخدمين
- `/api/quran/*` - مسارات بيانات القرآن
- إلخ...

### 📝 متغيرات البيئة

انظر الملف `.env.example` للقائمة الكاملة بالمتغيرات المطلوبة

### 🔒 الأمان

- تشفير كلمات المرور بـ Bcrypt
- JWT للمصادقة
- CORS محمي
- Helmet للـ Security Headers
- Input Validation

### 📚 التوثيق

- `/database/schema.sql` - هيكل قاعدة البيانات
- `/docs/API_ENDPOINTS.md` - قائمة الـ endpoints

### 🐛 تقارير الأخطاء

تُحفظ في مجلد `logs/`

---

**الحالة الحالية**: قيد الإنشاء 🔨
