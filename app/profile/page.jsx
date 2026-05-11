'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Award, TrendingUp, Loader, AlertCircle, Save } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!token || !userData) {
      window.location.href = '/auth/login';
      return;
    }

    fetchUserData(userData.id, token);
  }, []);

  const fetchUserData = async (userId, token) => {
    try {
      const [profileRes, statsRes, achievementsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/statistics/${userId}/overall`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/achievements/${userId}/achievements`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!profileRes.ok || !statsRes.ok) {
        setError('Failed to load profile data');
        return;
      }

      const profileData = await profileRes.json();
      const statsData = await statsRes.json();
      const achievementsData = await achievementsRes.json();

      setUser(profileData.data);
      setStats(statsData.data);
      setAchievements(achievementsData.data || []);
      setFormData(profileData.data);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const userData = JSON.parse(localStorage.getItem('user'));

      const response = await fetch(`http://localhost:5000/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setError('Failed to update profile');
        return;
      }

      const updatedData = await response.json();
      setUser(updatedData.data);
      setSuccess('تم تحديث الملف الشخصي بنجاح');
      setEditing(false);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader size={40} className="animate-spin text-emerald-500 mb-4" />
          <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Header />

      <main className="py-12 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">أدر معلومات حسابك وعرض تقدمك</p>
        </motion.div>

        {/* Error and Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
          >
            <p className="text-emerald-700">{success}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">معلومات الملف الشخصي</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  {editing ? 'إلغاء' : 'تعديل'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  {[
                    { label: 'الاسم الكامل', name: 'full_name', type: 'text', icon: User },
                    { label: 'البريد الإلكتروني', name: 'email', type: 'email', icon: Mail },
                    { label: 'الهاتف', name: 'phone', type: 'tel', icon: Phone },
                    { label: 'تاريخ الميلاد', name: 'birth_date', type: 'date', icon: Calendar },
                    { label: 'الدولة', name: 'country', type: 'text', icon: MapPin },
                  ].map((field) => {
                    const IconComponent = field.icon;
                    return (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <div className="relative">
                          <IconComponent className="absolute right-3 top-3 text-gray-400" size={18} />
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        حفظ التغييرات
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {[
                    { label: 'الاسم الكامل', value: user.full_name, icon: User },
                    { label: 'البريد الإلكتروني', value: user.email, icon: Mail },
                    { label: 'الهاتف', value: user.phone || '-', icon: Phone },
                    { label: 'تاريخ الميلاد', value: user.birth_date?.split('T')[0] || '-', icon: Calendar },
                    { label: 'الدولة', value: user.country || '-', icon: MapPin },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <IconComponent className="text-emerald-500 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">{item.label}</p>
                          <p className="font-semibold text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Statistics */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">الإحصائيات</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'حفظ', value: stats.verses_memorized, icon: '📖' },
                    { label: 'قيد التعلم', value: stats.verses_learning, icon: '📚' },
                    { label: 'مراجعة', value: stats.verses_revised, icon: '🔄' },
                    { label: 'دقة المتوسط', value: `${stats.average_accuracy}%`, icon: '✅' },
                    { label: 'الحالية', value: stats.current_streak, icon: '🔥' },
                    { label: 'الدراسة', value: `${stats.total_study_minutes} دقيقة`, icon: '⏱️' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-gradient-to-br from-emerald-50 to-white rounded-lg p-4 border border-emerald-100"
                    >
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-emerald-600">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100 h-fit"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award className="text-emerald-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">الإنجازات</h2>
            </div>

            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 5).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
                  >
                    <p className="font-semibold text-gray-900">{achievement.Achievement?.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{achievement.Achievement?.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">لا توجد إنجازات حتى الآن</p>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
