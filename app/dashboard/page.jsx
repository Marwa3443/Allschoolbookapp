'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Award, Settings, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalMemorized: 28,
    masteryLevel: 87,
    dailyStreak: 12,
    weeklyGoal: 75,
    monthlyAchievement: 90,
  };

  const memorizedSurahs = [
    { id: 1, name: 'الفاتحة', percentage: 100, status: 'completed' },
    { id: 2, name: 'يس', percentage: 85, status: 'in-progress' },
    { id: 3, name: 'الرحمن', percentage: 65, status: 'in-progress' },
    { id: 4, name: 'الملك', percentage: 30, status: 'in-progress' },
  ];

  const recentActivities = [
    { id: 1, type: 'memorized', desc: 'تم حفظ 3 آيات من سورة يس', time: 'منذ ساعة' },
    { id: 2, type: 'achievement', desc: 'حصلت على شارة "متفاني"', time: 'منذ يومين' },
    { id: 3, type: 'milestone', desc: 'وصلت إلى 28 آية محفوظة', time: 'منذ 3 أيام' },
    { id: 4, type: 'memorized', desc: 'أكملت سورة الفاتحة', time: 'منذ أسبوع' },
  ];

  return (
    <div className="min-h-screen bg-islamic-light py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header with User Info */}
        <div className="islamic-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-islamic-secondary to-islamic-primary rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h1 className="text-3xl font-bold text-islamic-dark">أحمد محمود</h1>
                <p className="text-gray-600">مستخدم منذ 6 أشهر</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">نشط اليوم</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Premium</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                <Settings size={24} className="text-islamic-dark" />
              </button>
              <button className="p-3 bg-red-100 rounded-lg hover:bg-red-200 transition">
                <LogOut size={24} className="text-red-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="islamic-card p-6 mb-8">
          <div className="flex gap-4 border-b-2 border-islamic-light mb-6">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'progress', label: 'التقدم', icon: TrendingUp },
              { id: 'achievements', label: 'الإنجازات', icon: Award },
              { id: 'settings', label: 'الإعدادات', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-bold transition-all duration-300 flex items-center gap-2 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-islamic-secondary text-islamic-secondary'
                      : 'border-transparent text-gray-600 hover:text-islamic-dark'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-r-4 border-blue-500 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalMemorized}</div>
                  <p className="text-sm text-blue-800">آيات محفوظة</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-r-4 border-green-500 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.masteryLevel}%</div>
                  <p className="text-sm text-green-800">مستوى الإتقان</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-r-4 border-purple-500 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{stats.dailyStreak}</div>
                  <p className="text-sm text-purple-800">أيام متتالية</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border-r-4 border-orange-500 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stats.weeklyGoal}%</div>
                  <p className="text-sm text-orange-800">هدف الأسبوع</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg border-r-4 border-pink-500 text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">{stats.monthlyAchievement}%</div>
                  <p className="text-sm text-pink-800">إنجاز الشهر</p>
                </div>
              </div>

              {/* Memorized Surahs */}
              <div>
                <h3 className="text-xl font-bold text-islamic-dark mb-4">السور المحفوظة</h3>
                <div className="space-y-3">
                  {memorizedSurahs.map((surah) => (
                    <div key={surah.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-islamic-dark">سورة {surah.name}</h4>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          surah.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {surah.status === 'completed' ? 'مكتملة' : 'قيد الحفظ'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-islamic-primary to-islamic-secondary h-full rounded-full transition-all duration-500"
                          style={{ width: `${surah.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{surah.percentage}% مكتملة</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-xl font-bold text-islamic-dark mb-4 flex items-center gap-2">
                  <Calendar size={24} />
                  النشاط الأخير
                </h3>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 bg-gray-50 rounded-lg flex gap-4">
                      <div className={`w-4 h-4 rounded-full mt-2 ${
                        activity.type === 'memorized' ? 'bg-blue-500' :
                        activity.type === 'achievement' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-bold text-islamic-dark">{activity.desc}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="font-bold text-blue-900 mb-2">📊 رسم بياني للتقدم</h3>
                <p className="text-sm text-blue-800 mb-4">
                  سيتم عرض رسم بياني تفصيلي لتقدمك في الحفظ على مدار الوقت.
                </p>
                <div className="h-64 bg-gradient-to-t from-blue-200 to-blue-100 rounded-lg flex items-center justify-center">
                  <p className="text-blue-700">📈 رسم بياني تفاعلي</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { emoji: '🔥', title: 'على النار', desc: '3 أيام متتالية', unlocked: true },
                  { emoji: '⭐', title: 'نجم مبتدئ', desc: '10 آيات', unlocked: true },
                  { emoji: '👑', title: 'ملك القراء', desc: 'حفظ سورة كاملة', unlocked: false },
                  { emoji: '💎', title: 'ماسة', desc: '5 سور محفوظة', unlocked: false },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-islamic-secondary to-yellow-400 scale-105'
                        : 'bg-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.emoji}</div>
                    <h4 className={`font-bold text-sm mb-1 ${
                      achievement.unlocked ? 'text-islamic-dark' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs ${
                      achievement.unlocked ? 'text-islamic-dark' : 'text-gray-600'
                    }`}>
                      {achievement.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-islamic-dark text-lg">إعدادات الإشعارات</h3>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  <span className="font-bold text-islamic-dark">تذكيرات يومية</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  <span className="font-bold text-islamic-dark">إشعارات الإنجازات</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <span className="font-bold text-islamic-dark">نشرة بريدية أسبوعية</span>
                </label>
              </div>

              <div className="space-y-4 pt-6 border-t-2">
                <h3 className="font-bold text-islamic-dark text-lg">تفضيلات العرض</h3>
                <div>
                  <label className="block font-bold text-islamic-dark mb-2">الوضع الليلي</label>
                  <select className="w-full p-2 border-2 border-islamic-light rounded-lg focus:border-islamic-secondary outline-none">
                    <option>معطّل</option>
                    <option>مفعّل دائماً</option>
                    <option>تلقائي</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-islamic-dark mb-2">حجم الخط</label>
                  <select className="w-full p-2 border-2 border-islamic-light rounded-lg focus:border-islamic-secondary outline-none">
                    <option>صغير</option>
                    <option selected>متوسط</option>
                    <option>كبير</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
