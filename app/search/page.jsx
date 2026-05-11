'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, BookOpen, Loader, AlertCircle, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('verses');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const handleSearch = async (e, newPage = 1) => {
    if (e) e.preventDefault();

    if (!searchQuery.trim()) {
      setError('أدخل كلمة البحث');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const endpoint =
        searchType === 'verses'
          ? `http://localhost:5000/api/quran/verses/search`
          : `http://localhost:5000/api/quran/surahs/search`;

      const response = await fetch(
        `${endpoint}?q=${encodeURIComponent(searchQuery)}&page=${newPage}&limit=10`
      );

      if (!response.ok) {
        setError('فشل البحث');
        return;
      }

      const data = await response.json();
      setResults(data.data.verses || data.data.surahs || []);
      setPagination(data.data.pagination);
      setPage(newPage);
    } catch (err) {
      setError('خطأ في الشبكة. يرجى المحاولة مرة أخرى');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
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
            <SearchIcon className="text-emerald-600" size={32} />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">البحث</h1>
              <p className="text-gray-600">ابحث عن الآيات والسور</p>
            </div>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="mb-8 space-y-4"
        >
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute right-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setError('');
              }}
              placeholder={
                searchType === 'verses'
                  ? 'ابحث عن آية (نص أو رقم)'
                  : 'ابحث عن سورة (الاسم)'
              }
              className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
            />
          </div>

          {/* Search Type */}
          <div className="flex gap-4">
            {[
              { id: 'verses', label: 'الآيات', icon: '📖' },
              { id: 'surahs', label: 'السور', icon: '📕' },
            ].map((type) => (
              <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value={type.id}
                  checked={searchType === type.id}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setResults([]);
                    setSearched(false);
                  }}
                  className="w-4 h-4"
                />
                <span>{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </label>
            ))}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                جاري البحث...
              </>
            ) : (
              <>
                <SearchIcon size={20} />
                بحث
              </>
            )}
          </button>
        </motion.form>

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

        {/* Results */}
        {searched && !loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {results.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600 mb-6">
                    وجدنا <span className="font-bold text-emerald-600">{pagination?.total || 0}</span>{' '}
                    نتيجة
                  </p>

                  {/* Results List */}
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer group"
                      >
                        {searchType === 'verses' ? (
                          <>
                            <div className="flex items-start gap-3 mb-3">
                              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {result.Surah?.arabic_name}
                              </div>
                              <div className="text-gray-600 text-sm">
                                الآية {result.verse_number}
                              </div>
                            </div>
                            <p className="text-lg text-right mb-4 leading-relaxed text-gray-900">
                              {result.arabic_text}
                            </p>
                            <p className="text-gray-600 text-sm mb-3">
                              <span className="font-semibold">التشكيل:</span> {result.transliteration}
                            </p>
                            {result.tajweed_rules && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-700">
                                  <span className="font-semibold">قواعد التجويد:</span>{' '}
                                  {result.tajweed_rules}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-2xl font-bold text-gray-900">
                                {result.arabic_name}
                              </h3>
                              <span className="text-lg text-emerald-600 font-semibold">
                                {result.english_name}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-600">عدد الآيات</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                  {result.verse_count}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-600">نوع الوحي</p>
                                <p className="font-semibold text-gray-900">
                                  {result.revelation_type === 'meccan' ? 'مكية' : 'مدنية'}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 mt-8"
                  >
                    {Array.from({ length: Math.min(pagination.pages, 5) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleSearch(null, pageNum)}
                          className={`px-3 py-2 rounded-lg transition-all ${
                            page === pageNum
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  لم نجد نتائج لـ &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-gray-500 text-sm mt-2">جرب كلمات بحث مختلفة</p>
              </motion.div>
            )}
          </motion.div>
        ) : !searched ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <BookOpen size={64} className="text-emerald-200 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">ابدأ بالبحث عن الآيات أو السور</p>
          </motion.div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
