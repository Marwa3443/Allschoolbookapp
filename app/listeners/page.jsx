'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, Heart, Download, Search } from 'lucide-react';

const reciters = [
  { id: 1, name: 'محمد صديق المنشاوي', country: 'مصر', image: '🎙️', verified: true },
  { id: 2, name: 'عبدالباسط عبدالصمد', country: 'مصر', image: '🎙️', verified: true },
  { id: 3, name: 'ياسين الجزائري', country: 'الجزائر', image: '🎙️', verified: true },
  { id: 4, name: 'محمود خليل الحصري', country: 'مصر', image: '🎙️', verified: true },
  { id: 5, name: 'فاروق الدعيع', country: 'السعودية', image: '🎙️', verified: true },
  { id: 6, name: 'ماهر المعيقلي', country: 'السعودية', image: '🎙️', verified: true },
];

const surahs = [
  { id: 1, name: 'الفاتحة', verses: 7 },
  { id: 2, name: 'البقرة', verses: 286 },
  { id: 3, name: 'آل عمران', verses: 200 },
  { id: 4, name: 'النساء', verses: 176 },
  { id: 5, name: 'المائدة', verses: 120 },
];

export default function ListenersPage() {
  const [selectedReciter, setSelectedReciter] = useState(reciters[0]);
  const [selectedSurah, setSelectedSurah] = useState(surahs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const filteredReciters = reciters.filter(r =>
    r.name.includes(searchQuery) || r.country.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-islamic-light py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-2 arabic-text">
            استماع للقراء المشهورين
          </h1>
          <p className="text-gray-600 text-lg">استمع لتلاوات عالية الجودة من أشهر القرّاء في العالم الإسلامي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Reciters Selection */}
          <div className="lg:col-span-1">
            <div className="islamic-card p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4 text-islamic-dark">القراء</h2>

              {/* Search */}
              <div className="mb-6 relative">
                <input
                  type="text"
                  placeholder="ابحث عن قارئ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-islamic-light rounded-lg focus:border-islamic-secondary outline-none transition"
                />
                <Search size={20} className="absolute right-3 top-2.5 text-gray-400" />
              </div>

              {/* Reciters List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredReciters.map((reciter) => (
                  <button
                    key={reciter.id}
                    onClick={() => setSelectedReciter(reciter)}
                    className={`w-full text-right p-3 rounded-lg transition-all duration-300 ${
                      selectedReciter.id === reciter.id
                        ? 'bg-islamic-secondary text-islamic-dark font-bold'
                        : 'bg-gray-100 text-islamic-dark hover:bg-islamic-light'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{reciter.name}</span>
                      {reciter.verified && <span className="text-xs">✓</span>}
                    </div>
                    <p className="text-xs opacity-70">{reciter.country}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Current Reciter Info */}
            <div className="islamic-card p-8 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{selectedReciter.image}</div>
                <h2 className="text-3xl font-bold text-islamic-dark mb-2">
                  {selectedReciter.name}
                </h2>
                <p className="text-gray-600">من {selectedReciter.country}</p>
              </div>

              {/* Player Section */}
              <div className="bg-gradient-to-r from-islamic-primary to-islamic-dark text-white p-8 rounded-lg mb-8">
                {/* Surah Selector */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3">السورة المختارة</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {surahs.map((surah) => (
                      <button
                        key={surah.id}
                        onClick={() => setSelectedSurah(surah)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedSurah.id === surah.id
                            ? 'bg-islamic-secondary text-islamic-dark font-bold'
                            : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                        }`}
                      >
                        {surah.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Now Playing */}
                <div className="bg-white bg-opacity-10 p-6 rounded-lg mb-6">
                  <p className="text-center text-islamic-secondary font-bold mb-4">
                    الآن يعزف: سورة {selectedSurah.name}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
                      <div
                        className="bg-islamic-secondary h-full rounded-full transition-all duration-300"
                        style={{ width: '35%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs opacity-75">
                      <span>03:45</span>
                      <span>10:30</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-8">
                    <button className="hover:text-islamic-secondary transition">
                      <Volume2 size={24} />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center justify-center w-16 h-16 rounded-full bg-islamic-secondary text-islamic-dark hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    <button className="hover:text-islamic-secondary transition">
                      <Download size={24} />
                    </button>
                  </div>
                </div>

                {/* Quality Info */}
                <div className="text-center text-sm opacity-75">
                  جودة الصوت: 320kbps - نوع: تجويد
                </div>
              </div>

              {/* Reciter Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-islamic-dark">معلومات عن القارئ</h3>
                <p className="text-gray-700">
                  القارئ {selectedReciter.name} من أشهر قراء القرآن الكريم في العالم الإسلامي.
                  اشتهر بصوته العذب وتجويده المتقن للقرآن الكريم.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">4.8</div>
                    <p className="text-xs text-gray-600">التقييم</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">250K</div>
                    <p className="text-xs text-gray-600">الاستماعات</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Surahs */}
            <div className="islamic-card p-8">
              <h3 className="text-xl font-bold text-islamic-dark mb-6">تلاوات أخرى</h3>
              <div className="space-y-3">
                {surahs.slice(0, 5).map((surah) => (
                  <div key={surah.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-islamic-light transition-colors cursor-pointer">
                    <div className="flex-1">
                      <h4 className="font-bold text-islamic-dark">سورة {surah.name}</h4>
                      <p className="text-xs text-gray-600">{surah.verses} آية</p>
                    </div>
                    <button className="text-islamic-secondary hover:scale-110 transition-transform">
                      <Play size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
