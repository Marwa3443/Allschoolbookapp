'use client';

import { Play, Pause, Volume2, RotateCcw, Repeat, Repeat1 } from 'lucide-react';

export default function AudioPlayer({
  surahId,
  isPlaying,
  onPlayPause,
  playbackRate,
  onPlaybackRateChange,
  repeatMode,
  onRepeatModeChange,
}) {
  const playbackRates = [0.75, 1, 1.25, 1.5];

  return (
    <div className="bg-gradient-to-r from-islamic-primary to-islamic-dark text-white p-8 rounded-lg shadow-lg">
      <div className="flex flex-col gap-6">
        {/* Main Controls */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={onPlayPause}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-islamic-secondary text-islamic-dark hover:scale-110 transition-transform duration-300"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>

          <div className="flex-1">
            <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
              <div
                className="bg-islamic-secondary h-full rounded-full transition-all duration-300"
                style={{ width: '45%' }}
              ></div>
            </div>
            <div className="text-sm text-right">
              <span>02:45</span>
              <span className="mx-2">/</span>
              <span>06:00</span>
            </div>
          </div>

          <button className="hover:text-islamic-secondary transition">
            <Volume2 size={24} />
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Repeat Button */}
          <button
            onClick={() => onRepeatModeChange(
              repeatMode === 'once' ? 'verse' : repeatMode === 'verse' ? 'surah' : 'once'
            )}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              repeatMode === 'once'
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-islamic-secondary text-islamic-dark font-bold'
            }`}
          >
            {repeatMode === 'surah' ? (
              <Repeat size={20} />
            ) : repeatMode === 'verse' ? (
              <Repeat1 size={20} />
            ) : (
              <Repeat size={20} />
            )}
            <span>
              {repeatMode === 'once' ? 'بلا تكرار' : repeatMode === 'verse' ? 'تكرار الآية' : 'تكرار السورة'}
            </span>
          </button>

          {/* Playback Speed */}
          <div className="flex items-center gap-2 bg-gray-600 rounded-lg px-2">
            <span className="text-sm">السرعة:</span>
            <select
              value={playbackRate}
              onChange={(e) => onPlaybackRateChange(parseFloat(e.target.value))}
              className="bg-transparent text-white font-bold py-2 px-2 outline-none"
            >
              {playbackRates.map((rate) => (
                <option key={rate} value={rate} className="bg-islamic-dark">
                  {rate}x
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
            <RotateCcw size={20} />
            <span>إعادة تشغيل</span>
          </button>
        </div>

        {/* Quality Indicator */}
        <div className="text-center text-sm opacity-75">
          جودة الصوت: HD 320kbps
        </div>
      </div>
    </div>
  );
}
