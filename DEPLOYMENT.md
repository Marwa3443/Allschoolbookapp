# دليل النشر والاستخدار
## Deployment & Hosting Guide

### 📋 المتطلبات الأساسية

#### للتطوير المحلي:
- Node.js v18+ 
- npm v9+ أو yarn v3+
- Git
- محرر نصوص (VS Code مفضل)

#### للإنتاج:
- Hosting (Vercel, Netlify, AWS, Google Cloud, إلخ)
- نطاق (Domain)
- شهادة SSL
- CDN (اختياري لكن موصى به)

---

### 🚀 الخطوات الأولى

#### 1. استنساخ المشروع
```bash
git clone https://github.com/marwa3443/allschoolbookapp.git
cd allschoolbookapp
```

#### 2. تثبيت الحزم
```bash
npm install
# أو
yarn install
```

#### 3. تشغيل خادم التطوير
```bash
npm run dev
# أو
yarn dev
```

الموقع سيكون متاحاً على: `http://localhost:3000`

---

### 🔧 الإعدادات البيئية

#### ملف .env.local (للتطوير)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=30000

# Firebase (اختياري)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Analytics (اختياري)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Environment
NODE_ENV=development
```

#### ملف .env.production (للإنتاج)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.quranapp.com
NEXT_PUBLIC_API_TIMEOUT=30000

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prod_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod_project_id

# Analytics
NEXT_PUBLIC_GA_ID=prod_ga_id

# Environment
NODE_ENV=production
```

---

### 🏗️ البناء والاختبار

#### بناء الإنتاج
```bash
npm run build
```

#### تشغيل الإنتاج محلياً
```bash
npm run build
npm start
```

#### التحقق من الأخطاء
```bash
npm run lint
```

---

### 🌐 خيارات النشر

#### 1️⃣ Vercel (الأفضل لـ Next.js)

**المميزات:**
- نشر سريع جداً
- SSL مدمج
- CDN عالمي
- دعم بيئات متعددة
- مراقبة تلقائية

**خطوات النشر:**
1. انسخ المشروع على GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. اضغط "New Project"
4. اختر المستودع من GitHub
5. أضف متغيرات البيئة
6. انقر "Deploy"

**الأمر (اختياري):**
```bash
npm install -g vercel
vercel
```

#### 2️⃣ Netlify

**المميزات:**
- منصة شهيرة وموثوقة
- نشر بسيط من Git
- SSL مدمج
- CDN عالمي

**خطوات النشر:**
1. ادفع الكود إلى GitHub/GitLab/Bitbucket
2. اذهب إلى [netlify.com](https://netlify.com)
3. اختر "New site from Git"
4. اختر المستودع
5. أضف الإعدادات:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. انقر "Deploy"

**ملف netlify.toml:**
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = ".next"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 3️⃣ AWS (Amplify)

**المميزات:**
- قابل للتوسع
- دعم دول عديدة
- تكامل مع خدمات AWS

**خطوات النشر:**
1. ادفع الكود إلى GitHub
2. اذهب إلى AWS Amplify Console
3. اختر "Connect app"
4. اختر GitHub repo
5. أضف build settings
6. انقر "Save and deploy"

#### 4️⃣ Google Cloud Run

**المميزات:**
- قابل للتوسع التلقائي
- دفع حسب الاستخدام
- دعم Docker

**خطوات النشر:**
1. أنشئ حساب Google Cloud
2. تفعّل Cloud Run API
3. بناء Docker image:
```bash
docker build -t quran-app .
```
4. ادفع الـ image إلى Google Container Registry
5. انشر على Cloud Run

**ملف Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### 5️⃣ DigitalOcean (App Platform)

**المميزات:**
- سهل الاستخدام
- أسعار معقولة
- دعم عربي

**خطوات النشر:**
1. ادفع الكود إلى GitHub
2. اذهب إلى DigitalOcean
3. اختر "Create" → "Apps"
4. اختر GitHub repo
5. أضف build info
6. انقر "Create Resources"

---

### 📦 Docker Deployment

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: quran-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${API_URL}
    volumes:
      - ./public:/app/public
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: quran-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
```

---

### 🔒 الأمان

#### HTTPS إجباري
```javascript
// next.config.js
module.exports = {
  // إعادة توجيه HTTP إلى HTTPS
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://:host/:path*',
        permanent: true,
      },
    ]
  },
}
```

#### رؤوس الأمان
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'Content-Security-Policy', value: "default-src 'self'" },
      ],
    },
  ]
}
```

---

### 📊 المراقبة والتسجيل

#### Google Analytics
```javascript
// lib/analytics.js
export const pageview = (url) => {
  window.gtag.pageview({
    page_path: url,
    page_title: document.title,
  })
}
```

#### Sentry (لتتبع الأخطاء)
```bash
npm install @sentry/nextjs
```

```javascript
// next.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

### 🚄 تحسين الأداء

#### Image Optimization
```javascript
// استخدام Next.js Image
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Banner"
  width={1200}
  height={600}
  priority
/>
```

#### Code Splitting
```javascript
import dynamic from 'next/dynamic'

const MemorizeComponent = dynamic(
  () => import('@/components/Memorize'),
  { loading: () => <p>جاري التحميل...</p> }
)
```

#### CDN Configuration
```javascript
// next.config.js
images: {
  domains: ['cdn.quranapp.com', 'images.quranapp.com'],
  loader: 'cloudinary',
  loaderFile: './lib/cloudinary-loader.js',
}
```

---

### 🔄 التكامل المستمر/النشر المستمر (CI/CD)

#### GitHub Actions
```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
      
      - uses: actions/upload-artifact@v3
        with:
          name: build-output
          path: .next/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

### 📱 PWA (تطبيق ويب تقدمي)

#### Manifest Setup
```javascript
// public/manifest.json
{
  "name": "منصة حفظ القرآن الكريم",
  "short_name": "القرآن",
  "description": "منصة احترافية لحفظ القرآن الكريم",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f5f1e8",
  "theme_color": "#2d5f3f",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### 🔍 الاختبار قبل النشر

#### Checklist للنشر
- [ ] تم الاختبار محلياً
- [ ] جميع الروابط تعمل
- [ ] الأداء مقبول (PageSpeed > 90)
- [ ] آمن (SSL، Security headers)
- [ ] متوافق مع الأجهزة المحمولة
- [ ] SEO محسّن
- [ ] Analytics مُعد
- [ ] Error tracking مُفعّل
- [ ] البيانات الحساسة محميّة
- [ ] Backup فقط على الخادم

---

### 📞 الدعم والمساعدة

#### الموارد المفيدة:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Web.dev Performance](https://web.dev/)
- [OWASP Security](https://owasp.org/)

#### الاتصال:
- البريد: deploy@quranapp.com
- الهاتف: +966-12-345-6789
- الموقع: docs.quranapp.com

---

آخر تحديث: 11 مايو 2026

هذا الدليل يغطي جميع جوانب النشر والاستخدار للمنصة.
