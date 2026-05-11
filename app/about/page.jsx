'use client';

import { CheckCircle, Users, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-islamic-light py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-4 arabic-text">
            عن منصة حفظ القرآن الكريم
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            منصة متخصصة في تعليم وحفظ القرآن الكريم باستخدام أحدث التقنيات والطرق التعليمية الفعّالة
          </p>
        </div>

        {/* Mission Section */}
        <div className="islamic-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-islamic-dark mb-4">رسالتنا</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            تسعى منصتنا إلى نشر وتيسير حفظ القرآن الكريم للمسلمين في جميع أنحاء العالم، من خلال توفير أدوات حديثة
            وتقنيات متقدمة تجعل رحلة الحفظ سهلة وممتعة وفعّالة.
          </p>
          <p className="text-gray-700 leading-relaxed">
            نؤمن بأن كل شخص لديه القدرة على حفظ القرآن الكريم، وهدفنا هو مساعدتك على تحقيق هذا الحلم بأفضل طريقة ممكنة.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="islamic-card p-6 text-center">
            <Zap size={40} className="text-islamic-secondary mx-auto mb-4" />
            <h3 className="font-bold text-islamic-dark mb-2">تقنيات متقدمة</h3>
            <p className="text-sm text-gray-600">
              استخدام الذكاء الاصطناعي والتعرف الصوتي المتقدم
            </p>
          </div>
          <div className="islamic-card p-6 text-center">
            <Users size={40} className="text-islamic-secondary mx-auto mb-4" />
            <h3 className="font-bold text-islamic-dark mb-2">مجتمع فعّال</h3>
            <p className="text-sm text-gray-600">
              تواصل مع آلاف الحافظين حول العالم
            </p>
          </div>
          <div className="islamic-card p-6 text-center">
            <CheckCircle size={40} className="text-islamic-secondary mx-auto mb-4" />
            <h3 className="font-bold text-islamic-dark mb-2">مراقبة الجودة</h3>
            <p className="text-sm text-gray-600">
              معايير عالية في التدقيق والتصحيح
            </p>
          </div>
          <div className="islamic-card p-6 text-center">
            <Shield size={40} className="text-islamic-secondary mx-auto mb-4" />
            <h3 className="font-bold text-islamic-dark mb-2">أمان عالي</h3>
            <p className="text-sm text-gray-600">
              حماية كاملة لبيانات وخصوصية المستخدمين
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="islamic-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-islamic-dark mb-8">مراحل تطورنا</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-islamic-secondary flex items-center justify-center text-white font-bold">
                2023
              </div>
              <div>
                <h3 className="font-bold text-islamic-dark">تأسيس المنصة</h3>
                <p className="text-gray-600">بدأنا برؤية حفظ القرآن الكريم ونشره عبر الإنترنت</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-islamic-secondary flex items-center justify-center text-white font-bold">
                2024
              </div>
              <div>
                <h3 className="font-bold text-islamic-dark">إطلاق النسخة الأولى</h3>
                <p className="text-gray-600">أطلقنا النسخة الأولى من المنصة مع 30 قارئ</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-islamic-secondary flex items-center justify-center text-white font-bold">
                2025
              </div>
              <div>
                <h3 className="font-bold text-islamic-dark">التوسع العالمي</h3>
                <p className="text-gray-600">وصلنا إلى 100,000 مستخدم حول العالم</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-islamic-secondary flex items-center justify-center text-white font-bold">
                2026
              </div>
              <div>
                <h3 className="font-bold text-islamic-dark">المرحلة الجديدة</h3>
                <p className="text-gray-600">إضافة ميزات الذكاء الاصطناعي والتعرف الصوتي</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="islamic-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-islamic-dark mb-8">فريق العمل</h2>
          <p className="text-gray-700 mb-6">
            يتكون فريقنا من متخصصين في التعليم الإسلامي والتقنيات الحديثة والتصميم، جميعهم متفانون في نشر القرآن الكريم.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'أحمد علي', position: 'المؤسس والمدير التنفيذي', emoji: '👨‍💼' },
              { name: 'فاطمة محمود', position: 'رئيسة قسم التعليم', emoji: '👩‍🏫' },
              { name: 'خالد سعود', position: 'رئيس قسم التطوير', emoji: '👨‍💻' },
            ].map((member, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="font-bold text-islamic-dark">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.position}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="islamic-card p-8 text-center bg-gradient-to-r from-islamic-primary to-islamic-dark text-white">
          <h2 className="text-2xl font-bold mb-4">هل لديك أسئلة أو اقتراحات؟</h2>
          <p className="mb-6">نود أن نسمع رأيك ونتواصل معك مباشرة</p>
          <button className="bg-islamic-secondary text-islamic-dark px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition">
            تواصل معنا الآن
          </button>
        </div>
      </div>
    </div>
  );
}
