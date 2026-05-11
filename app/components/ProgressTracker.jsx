'use client';

import { Calendar, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProgressTracker({ selectedSurah, progress }) {
  const mockStats = {
    totalMemorized: 12,
    dailyStreak: 5,
    weeklyProgress: 35,
    masteryLevel: 85,
    sessionsDone: 24,
  };

  const dailyData = [
    { day: 'السبت', verses: 2, accuracy: 90 },
    { day: 'الأحد', verses: 3, accuracy: 85 },
    { day: 'الاثنين', verses: 2, accuracy: 88 },
    { day: 'الثلاثاء', verses: 1, accuracy: 92 },
    { day: 'الأربعاء', verses: 3, accuracy: 87 },
    { day: 'الخميس', verses: 2, accuracy: 91 },
    { day: 'الجمعة', verses: 0, accuracy: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600 mb-1">{mockStats.totalMemorized}</div>
          <p className="text-xs text-gray-600">آيات محفوظة</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-r-4 border-green-500">
          <div className="text-2xl font-bold text-green-600 mb-1">{mockStats.dailyStreak}</div>
          <p className="text-xs text-gray-600">أيام متتالية</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border-r-4 border-purple-500">
          <div className="text-2xl font-bold text-purple-600 mb-1">{mockStats.masteryLevel}%</div>
          <p className="text-xs text-gray-600">مستوى الإتقان</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-r-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-600 mb-1">{mockStats.weeklyProgress}%</div>
          <p className="text-xs text-gray-600">التقدم الأسبوعي</p>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg border-r-4 border-pink-500">
          <div className="text-2xl font-bold text-pink-600 mb-1">{mockStats.sessionsDone}</div>
          <p className="text-xs text-gray-600">جلسات اليوم</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border-r-4 border-indigo-500">
          <div className="text-2xl font-bold text-indigo-600 mb-1">2h 30m</div>
          <p className="text-xs text-gray-600">إجمالي الوقت</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="islamic-card p-6">
        <h3 className="text-lg font-bold text-islamic-dark mb-6 flex items-center gap-2">
          <Calendar size={24} />
          إحصائيات هذا الأسبوع
        </h3>

        <div className="space-y-4">
          {dailyData.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-islamic-dark">{day.day}</span>
                <span className="text-xs text-gray-600">{day.verses} آيات - {day.accuracy}% دقة</span>
              </div>
              <div className="flex gap-2">
                {/* Verses Bar */}
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${(day.verses / 3) * 100}%` }}
                  ></div>
                </div>
                {/* Accuracy Bar */}
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${day.accuracy >= 85 ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${day.accuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="islamic-card p-6">
        <h3 className="text-lg font-bold text-islamic-dark mb-6 flex items-center gap-2">
          <CheckCircle size={24} />
          الإنجازات
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { emoji: '🎯', title: 'متفاني', desc: '5 أيام متتالية' },
            { emoji: '⭐', title: 'نجم مبتدئ', desc: '10 آيات محفوظة' },
            { emoji: '🔥', title: 'على النار', desc: '3 أيام متتالية' },
            { emoji: '🎖️', title: 'حافظ', desc: 'حفظ سورة كاملة' },
            { emoji: '👑', title: 'نخبة', desc: '5 سور محفوظة' },
            { emoji: '💎', title: 'ماسة', desc: 'قادم قريباً' },
          ].map((achievement, index) => (
            <div key={index} className="bg-gradient-to-br from-islamic-secondary to-yellow-400 p-4 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl mb-2">{achievement.emoji}</div>
              <h4 className="font-bold text-islamic-dark text-sm mb-1">{achievement.title}</h4>
              <p className="text-xs text-islamic-dark opacity-75">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="islamic-card p-6">
        <h3 className="text-lg font-bold text-islamic-dark mb-6 flex items-center gap-2">
          <TrendingUp size={24} />
          الأهداف
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border-r-4 border-blue-500">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-blue-900">هدف هذا الأسبوع</h4>
              <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">50% مكتمل</span>
            </div>
            <p className="text-sm text-blue-800 mb-3">حفظ 5 آيات من سورة {selectedSurah.name}</p>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-r-4 border-green-500">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-green-900">هدف هذا الشهر</h4>
              <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded">30% مكتمل</span>
            </div>
            <p className="text-sm text-green-800 mb-3">حفظ سورة كاملة</p>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-full rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
