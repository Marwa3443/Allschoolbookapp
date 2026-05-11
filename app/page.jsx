'use client';

import Link from 'next/link';
import { BookOpen, Headphones, Download, Users, Award, Zap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'نظام الحفظ المتقدم',
      description: 'احفظ القرآن الكريم بطريقة منظمة مع تتبع تقدمك اليومي',
      href: '/memorization',
      color: 'from-islamic-primary to-blue-600',
    },
    {
      icon: Headphones,
      title: 'استماع للقراء المشهورين',
      description: 'استمع لتلاوات عالية الجودة من أشهر القرّاء',
      href: '/listeners',
      color: 'from-green-600 to-islamic-secondary',
    },
    {
      icon: Download,
      title: 'تحميل المصحف الشريف',
      description: 'حمّل نسخ متعددة من المصحف بصيغة PDF',
      href: '/downloads',
      color: 'from-islamic-secondary to-yellow-600',
    },
    {
      icon: Users,
      title: 'المجتمع الحافظ',
      description: 'تواصل مع آلاف الحافظين وشارك تقدمك',
      href: '/community',
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: Award,
      title: 'نظام الإنجازات',
      description: 'احصل على شارات وحافز مع كل مرحلة جديدة',
      href: '/achievements',
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: Zap,
      title: 'تذكيرات ذكية',
      description: 'احصل على تنبيهات يومية لتحفيزك على الاستمرار',
      href: '/settings',
      color: 'from-cyan-600 to-blue-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 islamic-gradient opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
        }}></div>

        <div className="relative container mx-auto px-4 py-20 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 arabic-text" style={{
            animation: 'fadeIn 0.8s ease-out',
          }}>
            منصة حفظ القرآن الكريم
          </h1>

          {/* Quranic Verse */}
          <div className="mb-8 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm max-w-2xl mx-auto border-2 border-islamic-secondary">
            <p className="text-2xl md:text-3xl leading-relaxed font-bold arabic-text mb-3">
              "الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَتْلُونَهُ حَقَّ تِلَاوَتِهِ أُولَٰئِكَ يُؤْمِنُونَ بِهِ"
            </p>
            <p className="text-islamic-secondary text-sm">سورة البقرة - الآية 121</p>
          </div>

          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-95">
            منصة احترافية لتعليم وحفظ القرآن الكريم مع تقنيات حديثة وواجهة سهلة الاستخدام
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/memorization"
              className="islamic-btn-primary inline-block"
            >
              ابدأ الحفظ الآن
            </Link>
            <Link
              href="/about"
              className="islamic-btn-secondary inline-block"
            >
              تعرف على المزيد
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-islamic-dark">
              المميزات الرئيسية
            </h2>
            <div className="w-20 h-1 bg-islamic-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="group"
                >
                  <div className="islamic-card h-full p-8">
                    <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-islamic-dark group-hover:text-islamic-secondary transition">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-islamic-primary to-islamic-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">114</h3>
              <p className="text-islamic-secondary">سورة كريمة</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">6236</h3>
              <p className="text-islamic-secondary">آية مباركة</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">50+</h3>
              <p className="text-islamic-secondary">قارئ مشهور</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">100K+</h3>
              <p className="text-islamic-secondary">مستخدم نشط</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-islamic-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-islamic-dark">
            هل أنت جاهز لبدء رحلتك مع القرآن الكريم؟
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف الحافظين والتعلمين حول العالم وابدأ رحلتك الروحية اليوم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="islamic-btn-primary">
              إنشاء حساب مجاني
            </button>
            <button className="islamic-btn-secondary">
              دخول لحسابي
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
