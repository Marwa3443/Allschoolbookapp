'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Loader, AlertCircle, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('memorized');

  const metrics = [
    { id: 'memorized', label: 'الآيات المحفوظة', icon: '📖' },
    { id: 'study_minutes', label: 'وقت الدراسة', icon: '⏱️' },
    { id: 'posts', label: 'المنشورات', icon: '💬' },
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedMetric]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:5000/api/statistics/leaderboard?metric=${selectedMetric}&limit=50`
      );

      if (!response.ok) {
        setError('Failed to load leaderboard');
        return;
      }

      const data = await response.json();
      setLeaderboard(data.data.leaderboard);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getScoreLabel = (metric) => {
    if (metric === 'memorized') return 'آية';
    if (metric === 'study_minutes') return 'دقيقة';
    if (metric === 'posts') return 'منشور';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Header />

      <main className="py-12 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-amber-500" size={32} />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">جدول الترتيب</h1>
              <p className="text-gray-600">أفضل المتعلمين في المنصة</p>
            </div>
          </div>
        </motion.div>

        {/* Metric Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
        >
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedMetric === metric.id
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-300'
              }`}
            >
              <span>{metric.icon}</span>
              {metric.label}
            </button>
          ))}
        </motion.div>

        {/* Error Message */}
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

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size={40} className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
          >
            {/* Top 3 Highlights */}
            {leaderboard.slice(0, 3).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
                {leaderboard.slice(0, 3).map((user, index) => {
                  const medalIcons = ['🥇', '🥈', '🥉'];
                  return (
                    <motion.div
                      key={user.user_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-5xl mb-3">{medalIcons[index]}</div>
                      <img
                        src={user.avatar_url || 'https://via.placeholder.com/60'}
                        alt={user.full_name}
                        className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-white"
                      />
                      <h3 className="font-bold text-gray-900 text-lg">{user.full_name}</h3>
                      <p className="text-2xl font-bold text-emerald-600 mt-2">
                        {user.score} {getScoreLabel(selectedMetric)}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Leaderboard List */}
            <div className="divide-y divide-gray-200">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 3) * 0.02 }}
                  className="p-6 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {user.rank <= 3 ? getMedalIcon(user.rank) : user.rank}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url || 'https://via.placeholder.com/40'}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-bold text-gray-900">{user.full_name}</h3>
                          <p className="text-xs text-gray-500">الترتيب #{user.rank}</p>
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{user.score}</p>
                      <p className="text-xs text-gray-500">{getScoreLabel(selectedMetric)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {leaderboard.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">لا توجد بيانات للترتيب</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="font-bold text-blue-900 mb-2">معلومات مهمة</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ يتم تحديث جدول الترتيب كل ساعة</li>
            <li>✓ يعتمد الترتيب على إنجازاتك في المنصة</li>
            <li>✓ جميع المستخدمين متساوون في الفرص</li>
          </ul>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
