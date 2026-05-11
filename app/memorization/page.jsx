'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, RotateCcw, Mic, CheckCircle } from 'lucide-react';
import QuranSelector from '../components/QuranSelector';
import AudioPlayer from '../components/AudioPlayer';
import RecordingWidget from '../components/RecordingWidget';
import ProgressTracker from '../components/ProgressTracker';

const quranData = {
  surahs: [
    { id: 1, name: 'الفاتحة', verses: 7 },
    { id: 2, name: 'البقرة', verses: 286 },
    { id: 3, name: 'آل عمران', verses: 200 },
    { id: 4, name: 'النساء', verses: 176 },
    { id: 5, name: 'المائدة', verses: 120 },
  ],
};

export default function MemorizationPage() {
  const [selectedSurah, setSelectedSurah] = useState(quranData.surahs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState('once'); // once, verse, surah
  const [progress, setProgress] = useState({});
  const [activeTab, setActiveTab] = useState('listen'); // listen, record, progress

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVerseSelect = (verseNumber) => {
    setCurrentVerse(verseNumber);
    setIsPlaying(true);
  };

  const handleRecordingComplete = (audioBlob) => {
    const newProgress = {
      ...progress,
      [`${selectedSurah.id}-${currentVerse}`]: {
        status: 'recorded',
        timestamp: new Date(),
      },
    };
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-islamic-light py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-2 arabic-text">
            نظام حفظ القرآن الكريم
          </h1>
          <p className="text-gray-600 text-lg">اختر السورة والآيات التي تريد حفظها وابدأ رحلتك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Surah Selection */}
          <div className="lg:col-span-1">
            <div className="islamic-card p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4 text-islamic-dark">السور الكريمة</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {quranData.surahs.map((surah) => (
                  <button
                    key={surah.id}
                    onClick={() => setSelectedSurah(surah)}
                    className={`w-full text-right p-3 rounded-lg transition-all duration-300 ${
                      selectedSurah.id === surah.id
                        ? 'bg-islamic-secondary text-islamic-dark font-bold'
                        : 'bg-gray-100 text-islamic-dark hover:bg-islamic-light'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{surah.name}</span>
                      <span className="text-xs opacity-70">{surah.verses}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Selected Surah Info */}
            <div className="islamic-card p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-islamic-dark mb-2 arabic-text">
                    سورة {selectedSurah.name}
                  </h2>
                  <p className="text-gray-600">
                    عدد الآيات: <span className="font-bold text-islamic-secondary">{selectedSurah.verses}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-islamic-secondary text-islamic-dark px-6 py-3 rounded-lg font-bold">
                    الآية {currentVerse}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b-2 border-islamic-light mb-6">
                {[
                  { id: 'listen', label: 'الاستماع والقراءة' },
                  { id: 'record', label: 'التسميع' },
                  { id: 'progress', label: 'التقدم' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-bold transition-all duration-300 border-b-2 ${
                      activeTab === tab.id
                        ? 'border-islamic-secondary text-islamic-secondary'
                        : 'border-transparent text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'listen' && (
                <div className="space-y-6">
                  {/* Audio Player */}
                  <AudioPlayer
                    surahId={selectedSurah.id}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    playbackRate={playbackRate}
                    onPlaybackRateChange={setPlaybackRate}
                    repeatMode={repeatMode}
                    onRepeatModeChange={setRepeatMode}
                  />

                  {/* Verses List */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-islamic-dark">الآيات الكريمة</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {Array.from({ length: Math.min(5, selectedSurah.verses) }).map((_, i) => (
                        <div
                          key={i + 1}
                          onClick={() => handleVerseSelect(i + 1)}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                            currentVerse === i + 1
                              ? 'bg-islamic-secondary text-islamic-dark'
                              : 'bg-gray-100 hover:bg-islamic-light'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <button className="flex-shrink-0 mt-1">
                              <Play size={20} className="hover:scale-110 transition" />
                            </button>
                            <div className="flex-1 text-right">
                              <p className="verse text-lg mb-2">
                                "وَمِنْ آيَاتِهِ خَلْقُ السَّمَاوَاتِ وَالْأَرْضِ"
                              </p>
                              <p className="text-sm opacity-75">الآية {i + 1}</p>
                            </div>
                            {progress[`${selectedSurah.id}-${i + 1}`]?.status === 'recorded' && (
                              <CheckCircle size={20} className="text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'record' && (
                <RecordingWidget
                  surahName={selectedSurah.name}
                  verseNumber={currentVerse}
                  onRecordingComplete={handleRecordingComplete}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressTracker
                  selectedSurah={selectedSurah}
                  progress={progress}
                />
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="islamic-card p-6 text-center">
                <div className="text-3xl font-bold text-islamic-secondary mb-2">12</div>
                <p className="text-gray-600">آيات محفوظة</p>
              </div>
              <div className="islamic-card p-6 text-center">
                <div className="text-3xl font-bold text-islamic-secondary mb-2">85%</div>
                <p className="text-gray-600">معدل الإتقان</p>
              </div>
              <div className="islamic-card p-6 text-center">
                <div className="text-3xl font-bold text-islamic-secondary mb-2">5</div>
                <p className="text-gray-600">أيام متتالية</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
