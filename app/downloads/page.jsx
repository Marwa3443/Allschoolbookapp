'use client';

import { Download, FileText, BookOpen, Palette, Star, Clock } from 'lucide-react';

const downloads = [
  {
    id: 1,
    name: 'مصحف المدينة المنورة',
    description: 'مصحف رسمي من المدينة المنورة بجودة عالية',
    category: 'standard',
    size: '45 MB',
    pages: 604,
    rating: 4.8,
    downloads: 125000,
    features: ['واضح وسهل القراءة', 'خط كبير', 'عالي الجودة'],
    icon: '📖',
  },
  {
    id: 2,
    name: 'مصحف ملون للتجويد',
    description: 'مصحف ملون يوضح قواعد التجويد بألوان مختلفة',
    category: 'tajweed',
    size: '65 MB',
    pages: 604,
    rating: 4.9,
    downloads: 95000,
    features: ['قواعد التجويد ملونة', 'سهل الفهم', 'مثالي للدراسة'],
    icon: '🎨',
  },
  {
    id: 3,
    name: 'مصحف للأطفال',
    description: 'مصحف بخط كبير وتصميم جذاب للأطفال',
    category: 'kids',
    size: '35 MB',
    pages: 604,
    rating: 4.7,
    downloads: 78000,
    features: ['خط كبير وواضح', 'تصميم مرح', 'مناسب للأطفال'],
    icon: '👶',
  },
  {
    id: 4,
    name: 'مصحف الجزء الثلاثين',
    description: 'جزء عم فقط بجودة عالية وسهل الحمل',
    category: 'part',
    size: '8 MB',
    pages: 80,
    rating: 4.6,
    downloads: 156000,
    features: ['خفيف الحجم', 'عالي الجودة', 'سهل الحمل'],
    icon: '📕',
  },
  {
    id: 5,
    name: 'مصحف برتقالي للأحكام',
    description: 'مصحف يوضح أحكام التلاوة بألوان برتقالية',
    category: 'tajweed',
    size: '52 MB',
    pages: 604,
    rating: 4.8,
    downloads: 89000,
    features: ['أحكام التلاوة', 'ألوان زاهية', 'مفصل وواضح'],
    icon: '🟠',
  },
  {
    id: 6,
    name: 'مصحف نور البيان',
    description: 'مصحف شامل مع شرح مختصر للآيات',
    category: 'annotated',
    size: '72 MB',
    pages: 750,
    rating: 4.9,
    downloads: 102000,
    features: ['شرح مختصر', 'تفسير بسيط', 'شامل وكامل'],
    icon: '💡',
  },
];

const categories = [
  { id: 'all', label: 'الكل' },
  { id: 'standard', label: 'المصاحف العادية' },
  { id: 'tajweed', label: 'مصاحف التجويد' },
  { id: 'kids', label: 'مصاحف الأطفال' },
  { id: 'part', label: 'الأجزاء المنفصلة' },
  { id: 'annotated', label: 'مصاحف معلقة' },
];

export default function DownloadsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredDownloads = selectedCategory === 'all'
    ? downloads
    : downloads.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-islamic-light py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-2 arabic-text">
            تحميل المصحف الشريف
          </h1>
          <p className="text-gray-600 text-lg">اختر النسخة التي تناسبك وحمّل المصحف بصيغة PDF</p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-islamic-secondary text-islamic-dark shadow-lg'
                    : 'bg-white text-islamic-dark border-2 border-islamic-light hover:border-islamic-secondary'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredDownloads.map((download) => (
            <div key={download.id} className="islamic-card p-6 flex flex-col">
              {/* Icon and Header */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{download.icon}</div>
                <h3 className="text-xl font-bold text-islamic-dark mb-2 arabic-text">
                  {download.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {download.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-t-2 border-b-2 border-islamic-light">
                <div className="text-center">
                  <div className="text-xl font-bold text-islamic-secondary">{download.size}</div>
                  <p className="text-xs text-gray-600">الحجم</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-islamic-secondary">{download.pages}</div>
                  <p className="text-xs text-gray-600">صفحة</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-islamic-secondary flex items-center justify-center gap-1">
                    {download.rating}
                    <Star size={16} className="fill-islamic-secondary" />
                  </div>
                  <p className="text-xs text-gray-600">التقييم</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 flex-1">
                <h4 className="font-bold text-islamic-dark mb-3">المميزات:</h4>
                <ul className="space-y-2">
                  {download.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-islamic-secondary mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Downloads Count */}
              <div className="text-center mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <Clock size={14} className="inline mr-1" />
                  تم تحميله {download.downloads.toLocaleString()} مرة
                </p>
              </div>

              {/* Download Button */}
              <button className="w-full islamic-btn-primary flex items-center justify-center gap-2">
                <Download size={20} />
                تحميل الآن
              </button>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="islamic-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-islamic-dark mb-6 flex items-center gap-2">
            <BookOpen size={28} />
            موارد إضافية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-r-4 border-blue-500">
              <h3 className="font-bold text-blue-900 mb-2">📱 تطبيق الهاتف</h3>
              <p className="text-sm text-blue-800 mb-4">
                احصل على التطبيق الرسمي لقراءة المصحف على هاتفك الذكي بكل سهولة.
              </p>
              <button className="text-blue-600 font-bold hover:text-blue-700">
                تحميل التطبيق →
              </button>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-r-4 border-green-500">
              <h3 className="font-bold text-green-900 mb-2">🎙️ تلاوات صوتية</h3>
              <p className="text-sm text-green-800 mb-4">
                استمع للتلاوات الكاملة من أشهر القراء بجودة عالية.
              </p>
              <button className="text-green-600 font-bold hover:text-green-700">
                اذهب للاستماع →
              </button>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-r-4 border-purple-500">
              <h3 className="font-bold text-purple-900 mb-2">📚 شروح وتفاسير</h3>
              <p className="text-sm text-purple-800 mb-4">
                اقرأ شروحات مختصرة وتفاسير للآيات الكريمة.
              </p>
              <button className="text-purple-600 font-bold hover:text-purple-700">
                اقرأ الشروحات →
              </button>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-r-4 border-orange-500">
              <h3 className="font-bold text-orange-900 mb-2">✍️ أدوات الحفظ</h3>
              <p className="text-sm text-orange-800 mb-4">
                استخدم أدوات حديثة تساعدك على حفظ القرآن الكريم بسهولة.
              </p>
              <button className="text-orange-600 font-bold hover:text-orange-700">
                استخدم الأدوات →
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="islamic-card p-8">
          <h2 className="text-2xl font-bold text-islamic-dark mb-6">الأسئلة الشائعة</h2>

          <div className="space-y-4">
            <details className="p-4 bg-gray-50 rounded-lg cursor-pointer group">
              <summary className="font-bold text-islamic-dark flex justify-between items-center">
                كيفية تحميل المصحف؟
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700">
                اضغط على زر "تحميل الآن" بجانب المصحف المطلوب، سيتم تحميل الملف مباشرة على جهازك بصيغة PDF.
              </p>
            </details>

            <details className="p-4 bg-gray-50 rounded-lg cursor-pointer group">
              <summary className="font-bold text-islamic-dark flex justify-between items-center">
                هل التحميل آمن والملفات خالية من الفيروسات؟
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700">
                نعم، جميع الملفات آمنة وتم فحصها بأعلى معايير الأمان. تم التعاون مع أفضل المصادر الإسلامية.
              </p>
            </details>

            <details className="p-4 bg-gray-50 rounded-lg cursor-pointer group">
              <summary className="font-bold text-islamic-dark flex justify-between items-center">
                هل يمكن طباعة المصحف؟
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700">
                نعم، جميع المصاحف المتاحة للتحميل قابلة للطباعة بجودة عالية على الورق الأبيض.
              </p>
            </details>

            <details className="p-4 bg-gray-50 rounded-lg cursor-pointer group">
              <summary className="font-bold text-islamic-dark flex justify-between items-center">
                ماهي أفضل نسخة للمبتدئين؟
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-700">
                نوصي باستخدام مصحف المدينة المنورة للمبتدئين لأن الخط واضح وجودته عالية جداً.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
